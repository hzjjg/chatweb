import { Component, ContentChild, OnInit, TemplateRef, ViewEncapsulation } from "@angular/core";

import { ToastService, MessageBoxService, MessageBoxComponent } from "../app/rui";
import { VisitorService } from "../app/user/visitor.servcie";
import { SessionService } from "../app/user/session.service";
import { UserType } from "../app/user/user-type";
import { Visitor } from "../app/user/visitor";
import { UserService } from "../app/user/user.service";

import { IMService, ConnectStatus, Command } from "../app/im";
import { ChatContentService } from "../app/chat/chat-content/chat-content.service";

import { RoomService } from "../app/chat/room.service";
import { Room } from "../app/chat/room";
import { RCResponse } from "../app/im/rc/proto";
// import { ChatNoticeService } from "../app/chat/chat-notice/chat-notice.service";



/**
 *
 * visibilityChange 判断此来进行页面的重连
 * 加入提示
 */
@Component({
    selector: 'root-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    host: {
        'class': 'view-framework'
    },
    encapsulation: ViewEncapsulation.None,
    providers:[ChatContentService]
})
export class AppComponent implements OnInit {
    room: Room = null;
    private isFirstConnect: boolean = true;
    constructor(
        private roomService: RoomService,
        // private chatNoticeService:ChatNoticeService,
        private visitorService: VisitorService,
        private sessionService: SessionService,
        private toastService: ToastService,
        private userService: UserService,
        private im: IMService,
        private messageBoxService: MessageBoxService,
        private chatContentService:ChatContentService
    ) {

    }
    ngOnInit() {

        this.initIM();

        //1. 获取房间信息，用户信息
        this.roomService.get((<any>window).ROOM_NO).subscribe((room: Room) => {
            if (room.secret) {
                //需要密码 暂不处理
            }
            this.room = room;
            //房间获取完毕
        }, (response) => {
            //页面跳转到错误页面
            // if (response.status.)

            if (response.error.code == -1) {
                if (response.error.msg) {
                    this.toastService.error(response.error.msg);
                }
                let instance = this.messageBoxService.confirm("服务访问失败是否重新加载", "警告");
                instance.handle.then((action: string) => {
                    window.location.reload();
                }, (reason: string) => {

                });
            } else {
                this.toastService.error(response.error.msg);
            }
        });

        this.userService.fetchUserInfo().subscribe((user) => {
        }, (response) => {
            // if (resposne.status == 401) {
            if (response.status == 404 ||
                response.status == 504 ||
                response.status == 503) {
                return;
            }
            this.doVisitorAccess();
            // }
        });

        this.sessionService.loginSubject.subscribe(() => {
            this.userService.user.next(null);
            this.userService.fetchUserInfo().subscribe(() => {

            }, (response: any) => {
                this.toastService.error(response.error.msg);
            });
        });

    }

    //游客访问
    doVisitorAccess() {
        //无权限,需获取凭证
        this.visitorService.apply({
            referrer: document.referrer
        }).subscribe((visitor: Visitor) => {
            this.sessionService.login(UserType.Visitor, visitor.visitorNo, visitor.sign).subscribe(() => {
                // //登录成功
                //获取用户,
                // this.userService.fetchUserInfo().subscribe((user) => {
                // });
            }, (response) => {
                this.toastService.error(response.error.msg);
            })
        }, (response) => {
            this.toastService.error(response.error.msg);
        })
    }

    private syncMessageBox: MessageBoxComponent = null;
    private reconnectMessageBox: MessageBoxComponent = null;
    initIM() {
        //
        window.addEventListener('offline', () => {
            this.im.offline();
        });
        if (localStorage) {
            this.userService.user.subscribe((user) => {
                if (user) {
                    localStorage.setItem("userId", user.userId.toString());
                } else {
                    localStorage.removeItem("userId");
                }
            });
            window.addEventListener('storage', () => {
                let userId = localStorage.getItem("userId") || null;
                if (userId) {
                    let curUser = this.userService.user.getValue();
                    let curUserId = curUser ? curUser.userId.toString() : null;
                    if (curUserId != userId) {
                        if (this.syncMessageBox) {
                            this.syncMessageBox.reject();
                        }
                        this.syncMessageBox = this.messageBoxService.alert("数据不同步，页面将刷新.");
                        this.im.skipReconnect = true;
                        this.im.close();
                        this.syncMessageBox.handle.then((action: string) => {
                            window.location.reload();
                        }, () => {
                            this.syncMessageBox = null;
                        })
                    } else {
                        if (this.syncMessageBox) {
                            this.syncMessageBox.reject();
                        }
                    }
                }
            });
        }


        this.im.on.subscribe((response: RCResponse) => {
            switch (response.command) {
                case Command.OTHER_LOGIN: {
                    //您的账号在另一地点登录，您已被迫下线
                    if (this.reconnectMessageBox) {
                        this.reconnectMessageBox.reject();
                    }
                    this.im.skipReconnect = true;
                    this.reconnectMessageBox = this.messageBoxService.alert("您的账号被登录，您已被迫下线。");
                    this.reconnectMessageBox.handle.then((action: string) => {
                        if (UserType.Visitor != this.userService.user.getValue().userType) {
                            this.sessionService.logout().subscribe(() => {
                                this.reconnectMessageBox = null;
                                window.location.reload();
                            }, () => {
                                window.location.reload();
                            });
                        } else {
                            window.location.reload();
                        }
                    }, (reason: string) => {
                        this.reconnectMessageBox = null;
                    });
                    break;
                }
                case Command.KICK_ROOM: {
                    if (this.reconnectMessageBox) {
                        this.reconnectMessageBox.reject();
                    }
                    this.im.skipReconnect = true;
                    this.reconnectMessageBox = this.messageBoxService.alert("你已被踢出聊天室。");
                    this.reconnectMessageBox.handle.then((action: string) => {
                        this.sessionService.logout().subscribe(() => {
                            this.reconnectMessageBox = null;
                            window.location.reload();
                        }, () => {

                        });
                    }, (reason: string) => {
                        this.reconnectMessageBox = null;
                    });
                    break;
                }
            }
        });
        this.im.connectStatusSubject.subscribe((status: ConnectStatus) => {
            switch (status) {
                case ConnectStatus.ON: {
                    this.cancelReconnect();
                    this.joinRoom();
                    break;
                }
                case ConnectStatus.OFF: {
                    // let user = this.userService.user.getValue();
                    // if (user) {
                    this.reloadTimeoutId = setTimeout(() => {
                        if (this.im.connectStatus != ConnectStatus.ON) {
                            if (!this.reconnectMessageBox) {
                                //确保当前用户在线，且 连接是关闭的
                                this.reconnectMessageBox = this.messageBoxService.alert("当前连接已断开是否重新连接", "警告");
                                this.reconnectMessageBox.handle.then((action: string) => {
                                    this.reconnectMessageBox = null;
                                    window.location.reload();
                                }, (reason: string) => {
                                    this.reconnectMessageBox = null;
                                });
                            }
                        }
                    }, 10000);
                    // }

                    break;
                }
            }
        });

        this.im.loginNotice.subscribe((data) => {
            //登录鉴权 完成
            //失败则 关闭连接
            if (data) {
                //当前认证成功
                // 获取房间信息
                this.sessionService.imAuth.next(null);
            } else {
                //this.im.close();
            }
        });

        this.userService.userChange.subscribe((userId) => {
            if (userId) {
                this.connectIM();
            } else {
                this.im.close();
            }
        })
    }
    reloadTimeoutId: any = null;
    cancelReconnect() {
        if (this.reloadTimeoutId) {
            clearTimeout(this.reloadTimeoutId);
            this.reloadTimeoutId = null;
        }
        if (this.reconnectMessageBox) {
            this.reconnectMessageBox.reject();
        }
    }

    connectIM() {
        this.im.connect('ws://' + document.location.host + '/im');
        // this.im.connect('ws://127.0.0.1:8102/im/' + (<any>window).ROOM_NO);
    }

    joinRoom() {
        this.roomService.room.subscribe((room: Room) => {
            if (room) {
                this.im.joinRoom(room.roomNo);
            }
        });
    }
}
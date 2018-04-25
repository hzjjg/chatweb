import {
    AfterContentInit, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy
} from "@angular/core";
import { UserInfo } from "../user/user-info";
import { RoomService } from "../chat/room.service";
import { ModalRef, ModalService, ToastService } from "../rui";
import { UserInfoComponent } from "../user/user-info.component";
import { UserService } from "../user/user.service";
import { Room } from "../chat/room";
import { SessionService } from "../user/session.service";
import { IMService } from "../im/ext/im.service";
import { GroupJoinTipMessage, GroupQuitTipMessage, GroupTipMessage, Message } from "../im/msg/message";
import { MsgType, GroupModifyMemberInfoTipMessage, SessionType } from "../im/index";
import { TipType } from "../im/const";
import { environment } from "../../environments/environment";
import { UserType } from "../user/index";
import { ChatService } from "../chat/chat.service";
import { ChatMessageTipService, MessageTip, userInfoWithTip } from "../chat/chat-message-tip.service";
import { Subscription } from "rxjs/Subscription";
import { Gag } from "./gag";
import { ContactListService } from "./contact-list.service";
import {Observable} from "rxjs/Observable";
import {async} from "rxjs/scheduler/async";
import {ContactService} from "./contact.service";
import {ChatSession, ChatSessionService} from "../chat/chat-session.service";

@Component({
    selector: 'contact-list',
    templateUrl: 'contact-list.component.html',
    styleUrls: ['contact-list.component.scss']
})
export class ContactListComponent implements OnInit, AfterContentInit, OnDestroy {

    //, AfterViewChecked
    sortRole: any = {
        Staff: 1,
        Customer: 2,
        Visitor: 3
    };


    selectedUserMenu: UserInfo;

    _originalMembers: UserInfo[];
    members: UserInfo[];
    viewMemebers: UserInfo[];
    // _originalMembers: UserInfo[];
    searchValue: string;
    userInfoModalRef: ModalRef;
    userInfo: UserInfo;
    userType = UserType;

    gag: Gag;

    isMobile: boolean = false;
    showCstServe: boolean = false;
    showChatButton: boolean = false;
    // private messageTips: MessageTip[];
    @ViewChild('contacts') contacts: ElementRef;

    // private msgTipSubscription: Subscription;
    private imSubscription: Subscription;
    private membersSubsription: Subscription;
    private userSubscription: Subscription;


    set originalMembers(members: UserInfo[]) {
        this._originalMembers = this.filterMember(members);
        this.resetMsgTips();
        this.handlerMemberData();

    }
    get originalMembers(): UserInfo[] {
        return this._originalMembers;
    }

    private handlerMemberData():void {

        this.members = this.originalMembers.slice();
        this.members = this.searchMembers(this.members);
        this.members = this.sortMembers(this.members);

        this.reviewMember();
    }

    private reviewMember(): void {

        //避免卡顿，滑动后在加载
        if (this.members.length > (this.isMobile? 60: 300)) {
            let min = Math.min(this.members.length, this.isMobile? 60: 300);
            if (this.viewMemebers && this.viewMemebers.length > 0) {
                min = Math.max(min, this.viewMemebers.length);
            }
            this.viewMemebers = this.members.slice(0, min);
        } else {
            this.viewMemebers = this.members.slice();
        }
    }


    loadMoreMembers() {
        let min = Math.min(this.members.length - this.viewMemebers.length, this.isMobile? 60: 150);
        if (min > 0) {
            this.viewMemebers = this.members.slice(0, this.viewMemebers.length + min);
        }
    }

    // get originalMembers() {
    //     return this._originalMembers;
    // }

    @ViewChild('chatContextMenu') chatContextMenu: ElementRef;
    // @ViewChildren("contactItems") contactItems: QueryList<ContactItemComponent>;

    @ViewChild('cstServe') cstServe: ElementRef;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private roomService: RoomService,
        private modalService: ModalService,
        private userService: UserService,
        private toastService: ToastService,
        private sessionService: SessionService,
        private imService: IMService,
        private chatService: ChatService,
        private contactListService: ContactListService,
        private contactService: ContactService,
        private chatSessionService: ChatSessionService
    ) {


    }


    ngOnInit(): void {
        this.isMobile = environment.app === 'mobile';
        // this.sessionService.imAuth
        //确保当前认证 且  连接保持
        // this.im

        this.userSubscription = this.userService.user.subscribe((user: UserInfo) => {
            this.userInfo = user;
        });

        this.membersSubsription = this.contactService.contactsSubject.subscribe(() => {
            this.originalMembers = this.contactService.contacts;

        });
        this.imSubscription = this.imService.auth.subscribe((auth: boolean) => {
            if (auth) {
                //确保认证了再去获取  因为这样可以包含自己
                if (this.contactService.contacts.length == 0) {
                    this.contactService.fetchMembers();
                } else {
                    this.originalMembers = this.contactService.contacts;
                }


            }
        });
        // this.msgTipSubscription = this.chatMessageTipService.messageTipSubject.subscribe((messageTips: MessageTip[]) => {
        //     this.messageTips = messageTips;
        //     this.resetMsgTips();
        //
        //     if (this.members && this.members.length > 0) {
        //         this.handlerMemberData();
        //     }
        // });

        this.chatSessionService.sessionSubject.subscribe(() => {
            this.resetMsgTips();
            if (this.originalMembers) {
                this.handlerMemberData();
            }
        });




        Observable.fromEvent(this.contacts.nativeElement, 'scroll')
            .throttleTime(50, async, {
                leading: true,
                trailing: true
            })
            .subscribe((e) => {
                let container = this.contacts.nativeElement;
                let startTop: number = container.scrollTop;
                let endTop: number = container.scrollHeight - container.clientHeight;
                if (endTop - startTop < 250) {
                    this.loadMoreMembers();
                }
            })
    }

    scollTop() {
        let container = this.contacts.nativeElement;
        container.scrollTop = 0;
    }

    ngAfterContentInit(): void {
        this.renderer.listen('window', 'click', (event: any) => {
            if (this.selectedUserMenu) {
                this.selectedUserMenu = null;
                event.preventDefault();
            }
        })
    }



    search(): void {
        this.handlerMemberData();
    }
    // fetchMembers() {
    //     let user: UserInfo = this.userService.user.getValue();
    //     if (user && this.imService.auth.getValue()) {
    //         this.membersSubsription = this.roomService.fetchMembers((<any>window).ROOM_NO).subscribe((members: any[]) => {
    //             // if(user.userType == 'Staff') {
    //             //     this.originalMembers = (members || []).filter((member) => {
    //             //         return !member.robotId
    //             //     })
    //             // } else {
    //             //     this.originalMembers = members;
    //             // }
    //             this.originalMembers = members;
    //             // this.resetMsgTips()
    //         });
    //     } else {
    //         this.originalMembers = [];
    //     }
    // }

    toggleCst(event: any) {
        event.stopPropagation();
        this.showCstServe = !this.showCstServe;

        if (this.showCstServe) {
            window.addEventListener('click', this.hideCst)
        } else {
            window.removeEventListener('click', this.hideCst)
        }
    }

    hideCst() {
        this.showCstServe = false;
    }

    private resetMsgTips() {
        if (this.originalMembers) {
            this.originalMembers.forEach(userInfo => {
                if (userInfo.userId) {
                    let session: ChatSession = this.chatSessionService.sessionBy(SessionType.C2C, userInfo.userId.toString());
                    let count: number = 0;
                    if (session) {
                        count = session.unread;
                    }
                    if (count > 0) {
                        console.log(count);
                    }
                    (<userInfoWithTip>userInfo).messageCount = count;    
                }
            })
            this.handlerMemberData();
        }
    }


    sortMembers(members: UserInfo[]) {
        if (!members) {
            return [];
        }
        // //客服过滤
        // let user: UserInfo = this.userService.user.getValue();
        // if(user.userType == 'Staff') {
        //     members = (members || []).filter((member: any) => {
        //         return !member.robotId
        //     })
        // }

        return members.sort((a: UserInfo, b: UserInfo) => {
            let aSession = a.userId ? this.chatSessionService.sessionBy(SessionType.C2C, a.userId.toString()): null;
            let bSession = b.userId ? this.chatSessionService.sessionBy(SessionType.C2C, b.userId.toString()): null;

            if (!aSession && !bSession) {
                if (a.userType !== b.userType) {
                    return this.sortRole[a.userType] - this.sortRole[b.userType];
                } else {
                    if (a.nickname == <any>b.nickname) {
                        return 0;
                    }
                    return (<any>a.nickname > <any>b.nickname) ? 1 : -1;
                }
            } else {
                let aTime = aSession? (aSession.time || 0) : -1;
                let bTime = bSession? (bSession.time || 0) : -1;
                return bTime - aTime;
            }
        });
        //
        // if (this.messageTips && this.messageTips.length > 0) {
        //     this.messageTips.forEach((tip, tipIndex) => {
        //         let matchedMember = sortedMembers.find((member) => {
        //             return member.userId == tip.userId;
        //         });
        //
        //         if (matchedMember) {
        //             sortedMembers.splice(sortedMembers.indexOf(matchedMember), 1);
        //             sortedMembers.splice(tipIndex, 0, matchedMember);
        //         }
        //
        //     })
        // }
    }
    // joinUser(user: UserInfo) {
    //     if (!this.originalMembers) {
    //         return;
    //     }
    //     let match = this.originalMembers.find((member) => {
    //         return member.userId == user.userId
    //     });
    //
    //     if (match) {
    //         user = Object.assign(match, user);
    //     } else {
    //         this._originalMembers.push(user);
    //     }
    //     this._calcUserKeyword(user);
    //     this._originalMembers = this.sortMembers(this._originalMembers);
    //     this.handlerMemberData();
    // }

    // quitUser(userId: number) {
    //     let matchIndex = this.originalMembers.findIndex((member) => {
    //         return member.userId == userId;
    //     });
    //     if (~matchIndex) {
    //         this._originalMembers.splice(matchIndex, 1);
    //     }
    //     this.handlerMemberData();
    // }

    // updateUser(user: UserInfo) {
    //     let match = this.originalMembers.find((member) => {
    //         return member.userId == user.userId
    //     });
    //     if (match) {
    //         user = Object.assign(match, user);
    //         this.handlerMemberData();
    //     } else {
    //         //数据不一致
    //         this.fetchMembers();
    //     }
    // }

    filterMember(members: UserInfo[]) {
        //客服过滤
        let user: UserInfo = this.userService.user.getValue();
        if(user.userType == UserType.Staff) {
            return (members || []).filter((member: any) => {
                return !member.robotId
            })
        }
        return members;
    }



    searchMembers(members: UserInfo[]) {
        if (!this.searchValue) {
            return members;
        }
        let searchKeyword = this.searchValue.toLowerCase();
        return (members || []).filter((item: UserInfo) => {
            return item.keyword && ~item.keyword.indexOf(searchKeyword);
        });


    }



    //user: UserInfo
    loading: boolean = false;
    openUserInfo(value: UserInfo) {
        if (this.loading) {
            return;
        }
        let userId = null,
            robotId = null;
        if (environment.app === 'pc') {
            userId = this.selectedUserMenu.userId;
            robotId = (<any>this.selectedUserMenu).robotId;
        } else {
            userId = value.userId;
            robotId = (<any>value).robotId;
        }
        this.loading = true;
        if (userId) {
            this.userService.getUser(userId).subscribe((user: UserInfo) => {
                if (user) {
                    this.modalService.open(UserInfoComponent, {
                        data: Object.assign({}, user, { other: true })
                    });
                }
            }, (response) => {
                this.toastService.error(response.error.msg);
            }, () => {
                this.loading = false;
            });
        } else {
            if (robotId) {
                this.userService.getRobot(robotId).subscribe((user: UserInfo) => {
                    if (user) {
                        this.modalService.open(UserInfoComponent, {
                            data: Object.assign({}, user, { other: true })
                        });
                    }
                }, (response: any) => {
                    this.toastService.error(response.error.msg);
                }, () => {
                    this.loading = false;
                });
            }
        }

    }

    kickOutUser() {
        let room: Room = this.roomService.room.getValue(),
            userId = this.selectedUserMenu.userId;
        if (room && userId) {
            this.roomService.kickout(room.roomNo, userId).subscribe(() => {
                //用户被踢出；
            }, (response) => {
                this.toastService.error(response.error.msg);
            });
        } else {
            this.toastService.error("非用户不允许踢出");
        }

    }

    gossipUser() {
        this.gag = {
            userId: this.selectedUserMenu.userId,
            userType: this.selectedUserMenu.userType,
            username: this.selectedUserMenu.username
        };
        this.contactListService.gag(this.gag).subscribe(() => {
            this.toastService.success('禁言成功!');
        }, (response) => {
            this.toastService.error(response.error.msg)
        })
    }

    // chat(user: UserInfo) {
    // }

    openContextMenu(option: any) {
        setTimeout(() => {
            //evnet: Event
            this.selectedUserMenu = option.user;

            let targetUser: UserInfo = option.user;
            let myInfo = this.userService.user.getValue();
            let isMyInfo = myInfo.userId == targetUser.userId;

            if (myInfo.userType == UserType.Staff) {
                this.showChatButton = targetUser.userId && !isMyInfo;
            } else {
                this.showChatButton = targetUser.userId && targetUser.userType == UserType.Staff;
            }

            let event = option.originEvent;
            // this.renderer.addClass(this.chatContextMenu.nativeElement, 'active');
            this.renderer.setStyle(this.chatContextMenu.nativeElement, 'top', ((<any>event).pageY) + 'px');
            this.renderer.setStyle(this.chatContextMenu.nativeElement, 'left', ((<any>event).pageX) + 'px');
        });

    }

    goChat() {
        this.chatService.sessionTypeSubject.next(
            {
                sessionType: SessionType.C2C,
                chatWith: this.selectedUserMenu.userId
            }
        );
    }

    trackByUser(index: number, user: any): number {
        return user.userId;
    }

    ngOnDestroy() {
        // this.msgTipSubscription.unsubscribe();
        this.imSubscription.unsubscribe();
        this.membersSubsription.unsubscribe();
        this.userSubscription.unsubscribe();
    }
}
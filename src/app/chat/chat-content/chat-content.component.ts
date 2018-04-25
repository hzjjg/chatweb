import {
    AfterContentChecked, Component, ElementRef, OnInit, ViewChild, AfterViewChecked, Renderer2, AfterContentInit,
    Input, OnChanges, OnDestroy, SimpleChanges, ContentChildren, QueryList, HostListener
} from '@angular/core';

// import { Message } from "../chat-message/message";
import { SessionType } from "../../im/session/session-type";
import { MsgType } from "../../im/const";
import { IMService, Message, RedPacketMessage, TipType, ConnectStatus, GroupRemoveMsgMessage, GroupGagTipMessage, GroupQuitTipMessage, GroupJoinTipMessage } from "../../im";
import { ChatContentService } from "./chat-content.service";
import { ToastService } from "../../rui";
import { NoticeService } from "../../rui";
import { DomSanitizer } from "@angular/platform-browser";
import { AnimationUtils } from "../../share/animation-utils";
import { RoomService } from "../room.service";
import { IMTimePipe } from "../../share/im-time.pipe";
import { GroupTipMessage } from "../../im/msg/message";
import { RedPacketService } from "../red-packet/red-packet.service";
import { ChatMessageService } from '../chat-message.service';
import { UserService, UserType, UserInfo } from '../../user/index';
import { MessageBoxService } from '../../../rui/packages/message-box/message-box.service';
import { DatePipe } from '@angular/common';
import { ChatService } from '../chat.service';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { ChatMessageComponent } from "../chat-message/chat-message.component";
import { Observable } from "rxjs/Observable";
import { ChatSession, ChatSessionService } from "../chat-session.service";
import { AudioService, AudioType } from "../../system/audio.service";

@Component({
    selector: 'chat-content',
    templateUrl: 'chat-content.component.html',
    styleUrls: ["../chat.component.scss"]
})

export class ChatContentComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, OnChanges {
    @Input() sessionType: SessionType;
    @Input() chatWith: string;
    chatSession: ChatSession;

    MAX_MESSAGE_COUNT: number = 350;
    CLEAN_MESSAGE_COUNT: number = 100;

    messages: Message[] = [];
    @ViewChild('chatContent') chatContent: ElementRef;
    @ViewChild('chatContextMenu') chatContextMenu: ElementRef;
    showMenu: boolean = false;
    historyLoading: boolean = false;
    isMobile = environment.app == 'mobile';

    showChatNotice: boolean = false;

    //未读的消息
    unread: number = 0;

    //断线重连中
    connecting: boolean = false;

    private imSubscription: Subscription;
    private redPacketStatusSubscription: Subscription;
    private showChatNoticeSubscription: Subscription;
    private connectStatusSubscription: Subscription

    constructor(
        private im: IMService,
        private roomService: RoomService,
        private timePipe: IMTimePipe,
        private renderer: Renderer2,
        private chatContentService: ChatContentService,
        private toastService: ToastService,
        private noticeService: NoticeService,
        private messageService: ChatMessageService,
        private redPacketService: RedPacketService,
        private userService: UserService,
        private messageBoxService: MessageBoxService,
        private datePipe: DatePipe,
        private chatService: ChatService,
        private chatSessionService: ChatSessionService,
        private audioService: AudioService
    ) {

    }

    ngOnInit() {
        this.sessionType = this.sessionType || SessionType.GROUP;
        this.userService.user.subscribe((user) => {
            if (user) {
                //更换账号 清理聊天消息 然后重新加载
                this.messages = [];
                this.fetchHistoryMessages(true);
            }
        });

        // this.noticeService.maxNum = 3;

        this.imSubscription = this.im.msgNotify.subscribe((msg: Message) => {
            if (this.sessionType == SessionType.GROUP) {
                if (
                    msg.type !== SessionType.GROUP || //私聊消息
                    (<GroupTipMessage>msg).tipType == TipType.MODIFY_MEMBER_INFO || //更改用户信息
                    (<GroupTipMessage>msg).tipType == TipType.PULL_RED_PACKET ||    //开红包
                    (<GroupTipMessage>msg).tipType == TipType.QUIT //退出聊天室
                ) {
                    //不要添加到消息
                    return;
                }

                //移除消息
                else if ((<GroupTipMessage>msg).tipType == TipType.REMOVE_MSG) {
                    this.removeMessages((<GroupRemoveMsgMessage>msg).removeMsgIds);
                    return;
                }

                //禁言
                else if ((<GroupTipMessage>msg).tipType == TipType.GAG) {
                    let message = <GroupGagTipMessage>msg;
                    if (message.userId == this.userService.user.getValue().userId) {
                        this.gagMe(message.expiryTime);
                        return;
                    } else {
                        if (this.userService.user.getValue().userType == UserType.Staff) {
                            // this.messages.push(msg);
                        } else {
                            return;
                        }
                    }
                }

                //加入聊天室
                else if ((<GroupTipMessage>msg).tipType == TipType.JOIN) {
                    let _msg = <GroupJoinTipMessage>msg,
                        myUserInfo = this.userService.user.getValue()

                    if ((_msg.userId === myUserInfo.userId ||
                        myUserInfo.userType !== UserType.Staff) ||
                        this.isMobile
                    ) {
                        return
                    }
                    // this.noticeService.show({
                    //     duration: 10000,
                    //     content: 'hahah'
                    // })

                    this.audioService.notice(AudioType.NOTICE)
                    this.noticeService.notify(`${_msg.nickname}加入了聊天室`, '通知', `${this.timePipe.transform(_msg.time)}`)
                    return
                }


                else if ((<GroupTipMessage>msg).tipType == TipType.NOTICE) {

                }

                this.addMessage(msg);

            } else {
                if (msg.type == SessionType.C2C &&
                    (msg.from == this.chatWith || msg.from == <any>this.userService.user.getValue().userId)) {
                    this.addMessage(msg);
                } else {

                }

                if (msg.type == SessionType.GROUP) {

                    if ((<GroupTipMessage>msg).tipType == TipType.QUIT && (<GroupQuitTipMessage>msg).userId == <any>this.chatWith) {
                        this.alertUserOffLine()
                    }
                }
            }

        });

        this.redPacketStatusSubscription = this.redPacketService.statusChange.subscribe((redPacket) => {
            let packetId = redPacket.packetId,
                status = redPacket.status;

            let messages = <Message[]>this.messages;

            let matchIndex = messages.findIndex((message: any, index: number, object: any[]) => {
                if (message.packetId) {
                    return message.packetId == packetId
                }
                return false;
            });

            if (~matchIndex) {
                let message: RedPacketMessage = <RedPacketMessage>messages[matchIndex];
                message.redPacketStatus = status;
                //, Object.assign({}, message)
                this.messages.splice(matchIndex, 1, message);
            }
        });

        this.showChatNoticeSubscription = this.chatService.showChatNotice.subscribe((flag: boolean) => {
            this.showChatNotice = flag;
        });

        Observable.fromEvent(this.chatContent.nativeElement, 'scroll')
            .debounceTime(50)
            .subscribe((e) => {
                if (this.isLikeBottom) {
                    this.unread = 0;
                }
            })

        this.listenReconnect()
    }


    ngAfterContentInit(): void {
        this.renderer.listen(this.chatContent.nativeElement, 'contextmenu', (event: any) => {
            event.preventDefault();
            this.showMenu = true;
            this.renderer.setStyle(this.chatContextMenu.nativeElement, 'top', ((<any>event).pageY) + 'px');
            this.renderer.setStyle(this.chatContextMenu.nativeElement, 'left', ((<any>event).pageX) + 'px');
        });
        // this.renderer.listen('window', 'click', (event: any) => {
        //
        // })
    }

    @HostListener('window:click', ['$event'])
    clickOther(event: Event): void {
        if (this.showMenu) {
            this.showMenu = false;
            event.preventDefault();
        }
    }

    clearChatContent() {
        this.messages = [];
    }

    private addMessage(msg: Message) {
        //若是自己的消息 则 滚动da
        this._calcMsgDisplayTime(
            this.messages.length > 0 ? this.messages[this.messages.length - 1] : null,
            msg
        );

        if (this.messages.length > this.MAX_MESSAGE_COUNT) {
            this.messages = this.messages.slice(this.CLEAN_MESSAGE_COUNT);
        }
        this.messages.push(msg);

        //若是自己的消息 则 滚动da
        let isLikeBottom: boolean = this.isWillScrollBottom ? false : this.isLikeBottom;
        let isFromSelf: boolean = msg.from == <any>this.userService.user.getValue().userId;
        if (isLikeBottom || isFromSelf) {
            //去抖避免消息过快
            this.toBottom(true);
        } else {
            if (!isFromSelf) {
                this.unread++;
            }
        }
    }
    removeMessages(msgIds: any[]) {
        let messages = (this.messages || []).filter((message) => {
            return !~msgIds.indexOf(message.msgId);
        })
        this.messages = messages;
    }

    gagMe(expiryTime: number) {
        let time = this.datePipe.transform(expiryTime, 'yyyy-MM-dd HH:mm:ss');
        // this.messageBoxService.alert(`禁言至:${time}`, `您已被禁言`);
        if (!time) {
            this.messageBoxService.alert(`永久禁言`, `您已被禁言`);
        } else {
            this.messageBoxService.alert(`禁言至: ${time}`, `您已被禁言`);
        }
    }

    private checkUserIsOnLine() {
        this.roomService.fetchMembers((<any>window).ROOM_NO).subscribe((members: UserInfo[]) => {

            if (!members.find(user => {
                return user.userId == <any>this.chatWith;
            })) {
                this.alertUserOffLine()
            }
        });
    }

    private alertUserOffLine() {
        let instance = this.messageBoxService.alert('对方已下线，请返回群聊', '提示')
        instance.handle.then(() => {
            if (this.isMobile) {
                history.back();
            } else {
                this.chatService.sessionTypeSubject.next({ sessionType: SessionType.GROUP });
            }
        });
    }

    private _calcMsgDisplayTime(provideMsg: Message | null, msg: Message): void {
        if (msg.msgType == MsgType.GROUP_TIP) {
            return;
        }
        if (!provideMsg || provideMsg.msgType == MsgType.GROUP_TIP || (Math.abs(provideMsg.time - msg.time) >= 60000)) {
            msg.displayTime = this.timePipe.transform(msg.time);
        }
    }

    //断线重连提示
    private listenReconnect() {
        this.connectStatusSubscription = this.im.connectStatusSubject.subscribe((status: ConnectStatus) => {
            switch (status) {
                case ConnectStatus.ON: {
                    this.connecting = false;
                    break;
                }
                case ConnectStatus.CONNECTING: {
                    if (!this.chatContentService.isFirstConnect) {
                        this.connecting = true;
                    }
                    break;
                }
            }
        });
    }

    toBottom(animation: boolean): void {
        this.isWillScrollBottom = true;
        this.isWillAnimation = animation;
    }

    prevTopMessageId: string;
    isWillScrollBottom: boolean = false;
    isWillAnimation: boolean = false;


    isScrolling: boolean = false;
    //动画ID
    scrollAnimationID: number = 0;

    scrollBottom(animation: boolean = false) {
        //因为暂无中止动画实现 故先跳过

        let container = this.chatContent.nativeElement;
        if (container.scrollHeight > container.clientHeight) {
            let startTop: number = container.scrollTop,
                endTop: number = container.scrollHeight - container.clientHeight;
            if (animation) {
                //几帧 进行
                let during = Math.min(15, (endTop - startTop) / 50);
                //Math.max(1, (endTop - startTop) / 40);
                let anc = (endTop - startTop) / during;
                let current = during;
                this.isScrolling = true;
                let doAnimation = (animationId: number) => {
                    if (!this.isScrolling) {
                        //当前状态被要求停止
                        return;
                    }
                    if (this.scrollAnimationID != animationId) {
                        //动画被切换了；
                        return;
                    }
                    current--;
                    if (current > 0) {
                        //当前进度

                        let top: number = container.scrollTop;
                        container.scrollTop = top + anc;
                        AnimationUtils.rAFShim(doAnimation.bind(this, animationId));
                    } else {
                        this.isScrolling = false;
                        container.scrollTop = endTop;
                    }
                };
                doAnimation(++this.scrollAnimationID);
            } else {
                container.scrollTop = endTop;
            }
        }
    }

    get isLikeBottom(): boolean {
        let container = this.chatContent.nativeElement;
        let startTop: number = container.scrollTop;
        let endTop: number = container.scrollHeight - container.clientHeight;
        return endTop - startTop < 10;
    }

    //是否直接切换到底部
    fetchHistoryMessages(switchBottom: boolean = false) {
        if (this.messages.length > (this.MAX_MESSAGE_COUNT - this.CLEAN_MESSAGE_COUNT)) {
            this.toastService.error("消息已达最大数量");
            return;
        }
        let topId: string = null,
            to = this.chatWith || this.roomService.room.getValue().roomNo,
            sessionType = this.sessionType || SessionType.GROUP;

        if (this.messages.length > 0) {
            let message = this.messages.find((msg: Message, index: number, message: any[]) => {
                return !!msg.msgId;
            });
            if (message != null) {
                topId = message.msgId;
            }
        }

        this.historyLoading = true;
        this.messageService.getHistory(sessionType, to, topId).subscribe((messages: Message[]) => {
            this.historyLoading = false;
            //当小于一定数量表示为空
            if (messages.length == 0) {
                if (this.messages.length > 0) {
                    this.toastService.info("没有更多历史记录");
                }
                return;
            }
            //
            // messages = messages.filter((msg)=>{
            //     return (<GroupTipMessage>msg).tipType != TipType.PULL_RED_PACKET
            // })

            messages = messages.reverse();

            messages.forEach((msg, index) => {
                let provMessage = null;
                if (index != 0) {
                    provMessage = messages[index - 1];
                }
                this._calcMsgDisplayTime(provMessage, msg);
            });

            //获取当前最顶端的消息ID
            //显示完成后直接设置数据
            if (!switchBottom) {
                let msg = this.messages.find((message) => {
                    return !!message.msgId;
                });

                this.prevTopMessageId = msg ? msg.msgId : null;
            }

            this.messages = [].concat(messages, this.messages);

            if (switchBottom) {
                this.toBottom(false);
            }

        }, (response: any) => {
            this.historyLoading = false;
            this.toastService.error(response.error.msg);
        })
    }

    ngAfterContentChecked(): void {
        //setTimeout延迟 故移植到这边进行

    }

    ngAfterViewChecked(): void {
        //优先
        if (this.prevTopMessageId) {
            //停掉其他的
            this.isWillScrollBottom = false;
            let msgElementId = this.prevTopMessageId;
            // setTimeout(() => {
            // console.log(this.messageComponents.length);
            let msgElement = this.chatContent.nativeElement.querySelector("#msg" + msgElementId);
            if (msgElement) {
                //在原有基础上加
                this.chatContent.nativeElement.scrollTop += (msgElement.offsetTop - 28);
            }
            // });
            this.prevTopMessageId = null;
        }
        if (this.isWillScrollBottom) {
            this.isWillScrollBottom = false;
            //终止动画
            this.scrollBottom(this.isWillAnimation);
        }
    }
    //
    // trackByMessage() : number {
    //
    // }

    ngOnChanges(changes: SimpleChanges) {
        let sessionChange = false;
        let fetchMessage = false;
        if (changes.sessionType) {
            // console.log(this.sessionType, changes.sessionType.currentValue);
            this.sessionType = changes.sessionType.currentValue;
            sessionChange = true;

            if (changes.sessionType.previousValue &&
                changes.sessionType.previousValue !== changes.sessionType.currentValue) {
                fetchMessage = true;
            }
        }
        if (changes.chatWith) {
            // console.log(this.chatWith, changes.sessionType.currentValue);
            this.chatWith = changes.chatWith.currentValue;
            sessionChange = true;
            if (changes.chatWith.previousValue &&
                changes.chatWith.previousValue !== changes.chatWith.currentValue) {
                fetchMessage = true;
            }
        }

        if (fetchMessage) {
            // (this.sessionType == SessionType.C2C) && this.checkUserIsOnLine();
            this.messages = [];
            this.fetchHistoryMessages(true)
        }
        if (sessionChange && this.chatWith && this.sessionType) {
            this.chatSession = this.chatSessionService.createSession(this.sessionType, this.chatWith);
            this.chatSession.unread = 0;
            if (this.chatSession.time) {
                this.chatSession.time = new Date().getTime();
            }
            setTimeout(() => {
                this.chatSessionService.sessionSubject.next();
            });
        }


    }

    trackByMessage(index: number, message: any): number {
        return message.time;//messageId;
    }


    ngOnDestroy() {
        this.chatService.sessionTypeSubject.next({ sessionType: SessionType.GROUP });
        this.imSubscription.unsubscribe();
        this.redPacketStatusSubscription.unsubscribe();
        this.connectStatusSubscription.unsubscribe();
    }

}
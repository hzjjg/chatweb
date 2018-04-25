import { Injectable } from '@angular/core';
import { MsgType, TipType } from "../../im/const";
import { GroupNoticeTipMessage, GroupTipMessage, Message } from "../../im/msg/message";
import { IMService } from "../../im/ext/im.service";

import { Subscription, Subject, BehaviorSubject } from "rxjs";
import { SessionType } from "../../im/session/session-type";
import { ChatMessageService } from "../chat-message.service";
import { RoomService } from "../room.service";
import { ChatService } from "../chat.service";
import { ToastService } from "../../../rui/packages/toast/toast.service";
import { IMTimePipe } from "../../share/im-time.pipe";
import { UserInfo } from "../../user/user-info";
import { UserService } from "../../user";

@Injectable()
export class ChatNoticeService {
    private noticeSubject: BehaviorSubject<Message[]>;
    private messages: Message[];

    constructor(
        private roomService: RoomService,
        private chatMessageService: ChatMessageService,
        private toastService: ToastService,
        private timePipe: IMTimePipe,
        private userService: UserService,
        private im: IMService
    ) {
        this.noticeSubject = new BehaviorSubject([]);
        window['noticeSubject'] = this.noticeSubject;
        this.userService.user.subscribe((user: UserInfo) => {
            if (user) {
                this.fetchHistoryMessages();
            }
        });

        this.im.msgNotify.subscribe((msg: Message) => {
            if (msg.type == SessionType.GROUP && (<GroupTipMessage>msg).tipType == TipType.NOTICE) {
                //避免接口加载的消息跟websocket的有重复
                if (!~(this.messages || []).findIndex((message: Message) => {
                    return message.msgId == msg.msgId;
                })) {
                    this.addMessage(msg)
                    setTimeout(() => {
                        this.launchNotice()
                    });
                }
            }
        })
    }

    launchNotice() {
        this.noticeSubject.next(this.messages);
    }

    fetchHistoryMessages(switchBottom?: boolean) {
        let sessionType = SessionType.GROUP,
        to = this.roomService.room.getValue().roomNo,
        type = TipType.NOTICE,
        topId: string = null
        
        // if (this.messages.length > 0) {
        //     let message = this.messages.find((msg: Message, index: number, message: any[]) => {
        //         return !!msg.msgId;
        //     });
        //     if (message != null) {
        //         topId = message.msgId;
        //     }
        // }
        
        this.chatMessageService.getTipHistory(sessionType, to, type, topId).subscribe((msgs: Message[]) => {
            //当小于一定数量表示为空
            if (msgs.length == 0) {
                // if (this.messages.length > 0) {
                //     this.toastService.info("没有更多历史记录");
                // }
                return;
            }

            msgs = msgs.reverse();

            msgs.forEach((msg, index) => {
                let provMessage = null;
                if (index != 0) {
                    provMessage = msgs[index - 1];
                }
                msg.displayTime = this.timePipe.transform(msg.time);
            });

            this.messages = [].concat(msgs, this.messages);
            setTimeout(() => {
                this.launchNotice();
            });

        }, (response) => {
            this.toastService.error(response.error.msg)
        })
    }

    addMessage(msg: Message) {
        msg.displayTime = this.timePipe.transform(msg.time);
        this.messages.push(msg);
        //强行滚动
        // this.toBottom(true);
    }

}
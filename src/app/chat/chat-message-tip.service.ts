import { Injectable } from '@angular/core';
import { IMService, Message, GroupTipMessage, SessionType, MsgType, TipType, GroupQuitTipMessage } from '../im/index';
import { ChatService, ChatInfo } from '../chat/chat.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserInfo, UserService } from '../user/index';

//https://cloud.tencent.com/document/product/269/1598
// @Injectable()
export class ChatMessageTipService {

    private chatInfo: ChatInfo
    messageTipSubject: BehaviorSubject<MessageTip[]>

    private messageTips: MessageTip[] = [];

    constructor(
        private im: IMService,
        private chatService: ChatService,
        private userService: UserService
    ) {
        this.messageTipSubject = new BehaviorSubject([]);
        this.chatInfo = this.chatService.chatInfo;

        // this.chatService.sessionTypeSubject.subscribe((chatInfo: ChatInfo) => {
        //     this.chatInfo = chatInfo;
        //     this.clearSomeBodyTip(chatInfo.chatWith);
        //     this.launchMessageTip();
        // })
        //
        // this.im.msgNotify.subscribe((msg: Message) => {
        //     if (msg.msgType == MsgType.GROUP_TIP) {
        //         //团提示消息
        //         if ((<GroupTipMessage>msg).tipType == TipType.QUIT) {
        //             this.clearSomeBodyTip((<GroupQuitTipMessage>msg).userId)
        //             // this.launchMessageTip();
        //         } else {
        //             return;
        //         }
        //     }
        //
        //     if (msg.from == <any>this.userService.user.getValue().userId) {
        //         //自己的消息
        //         return;
        //     }
        //
        //
        //     if (msg.type == SessionType.C2C) {
        //         this.addMessageTip(msg.from);
        //         this.launchMessageTip();
        //     } else {
        //         //群聊消息
        //         // this.addMessageTip(msg.from, 0);
        //         // this.launchMessageTip();
        //         return;
        //     }
        //
        //     if (this.chatInfo.chatWith && this.chatInfo.chatWith == msg.from) {
        //         //正在与他聊天
        //         this.clearSomeBodyTip(msg.from)
        //         this.launchMessageTip();
        //     }
        //
        //
        // })
    }



    private clearSomeBodyTip(userId: any) {
        let tipItem = this.messageTips.find((item) => {
            return item.userId == userId;
        })
        tipItem && (tipItem.messageCount = 0);
    }

    private addMessageTip(userId: any, addNumber?: number) {
        let tip = this.messageTips.find((item) => {
            return item.userId == userId;
        })
        if (tip) {
            this.messageTips.splice(this.messageTips.indexOf(tip), 1);
            tip.messageCount += (addNumber || 1);
            this.messageTips.unshift(tip);
        } else {
            this.messageTips.unshift({
                userId: userId,
                messageCount: (addNumber || 1)
            })
        }
    }

    private launchMessageTip() {
        this.messageTipSubject.next(this.messageTips)
    }

}

export interface MessageTip {
    userId: any,
    messageCount: number
}

export class userInfoWithTip extends UserInfo {
    messageCount?: number;
}
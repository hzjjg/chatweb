import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { HttpClient, HttpParams } from "@angular/common/http";

import { ToastService } from "../rui";
import { IMService, Message, RedPacketMessage, GroupTipMessage, GroupNoticeTipMessage,GroupPullRedPackedTipMessage, GroupRemoveMsgMessage, GroupGagTipMessage } from "../im";
import { SessionType } from "../im/session/session-type";
import { MsgType, TipType } from "../im/const";
import { RedPacketStatus } from "../chat/red-packet/red-packet";
import { UserService, UserType } from '../user/index';
import { MessageBoxService } from '../../rui/packages/message-box/message-box.service';
// import { DatePipe } from '@angular/common';


@Injectable()
export class ChatMessagesService {
    private messages: Message[] = [];
    private messagesSource = new Subject<any>();

    messageSource$ = this.messagesSource.asObservable();

    constructor(
        private im: IMService,
        private toastService: ToastService,
        private http: HttpClient,
        private userService:UserService,
        private messageBoxService:MessageBoxService,
        // private datePipe:DatePipe
    ) {
        this.im.msgNotify.subscribe((msg: Message) => {
            if (msg.type == SessionType.GROUP) {
                if ((<GroupTipMessage>msg).tipType == TipType.MODIFY_MEMBER_INFO) {
                    //不要添加到消息
                    return;
                } else if ((<GroupTipMessage>msg).tipType == TipType.REMOVE_MSG) {
                    this.removeMessages((<GroupRemoveMsgMessage>msg).removeMsgIds);
                    return;
                } else if((<GroupTipMessage>msg).tipType == TipType.GAG){
                    let message = <GroupGagTipMessage>msg;
                    if(message.userId == this.userService.user.getValue().userId){
                        this.gagMe(message.expiryTime);
                    }else{

                        if(this.userService.user.getValue().userType == UserType.Staff){

                            
                            // this.messages.push(msg);
                            // this.setMessages()
                        }else{

                            
                            return;
                        }
                    }
                }
                //若是自己的消息 则 滚动da
                this.calcMsgDisplayTime(
                    this.messages.length > 0 ? this.messages[this.messages.length - 1] : null,
                    msg
                );
                this.messages.push(msg);
                this.setMessages();
            }
        }, (response: any) => {
            this.toastService.error(response.error.msg);
        })

    }


    getMessages() {
        return Object.assign([], this.messages);
    }

    setMessages(messages?: Message[]) {
        messages && (this.messages = Object.assign([], messages));
        this.messagesSource.next(Object.assign([], this.messages));
    }

    removeMessages(msgIds: any[]) {
        let messages = (this.messages || []).filter((message) => {
            return !~msgIds.indexOf(message.msgId);
        })
        this.setMessages(messages)
    }

    gagMe(expiryTime:number){
        // let time = this.datePipe.transform(expiryTime,'yyyy-MM-dd HH:mm:ss')
        // this.messageBoxService.alert(`禁言至:${time}`,`您已被禁言`);
    }

    getHistory(sessionType: SessionType, to: string, topId?: string) {
        // return 1this.messages;
        let params: HttpParams = new HttpParams()
            .set("sessionType", sessionType.toString())
            .set("to", to)
        if (topId != null) {
            params = params.set("topId", topId);
        }


        return this.http.get('/messages', {
            params: params
        });

    }

    setRedPackageStatus(packetId: number, status: RedPacketStatus) {
        let messages = <RedPacketMessage[]>this.messages;
        messages.forEach(message => {
            if (message.packetId && message.packetId == packetId) {
                message.redPacketStatus = status;
            }
        });
        this.setMessages();
    }

    private calcMsgDisplayTime(provideMsg: Message | null, msg: Message) {
        if (msg.msgType == MsgType.GROUP_TIP) {
            return;
        }
        if (!provideMsg ||
            provideMsg.msgType == MsgType.GROUP_TIP ||
            (Math.abs(provideMsg.time - msg.time) >= 60000)) {
            // msg.displayTime = this.timePipe.transform(msg.time);
        }
    }

}
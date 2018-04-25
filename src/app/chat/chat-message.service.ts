import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { HttpClient, HttpParams } from "@angular/common/http";

import { ToastService } from "../rui";
import { IMService, Message, RedPacketMessage, GroupTipMessage, GroupPullRedPackedTipMessage } from "../im";
import { SessionType } from "../im/session/session-type";
import { MsgType, TipType } from "../im/const";
import { RedPacketStatus } from "../chat/red-packet/red-packet";


@Injectable()
export class ChatMessageService {
    // private messages: Message[] = [];
    // private messagesSource = new Subject<any>();
    //
    // messageSource$ = this.messagesSource.asObservable();
    // messageChange = new Subject<Message>();

    constructor(
        private im: IMService,
        private toastService: ToastService,
        private http: HttpClient
    ) {

    }


    // getMessages() {
    //     return Object.assign([], this.messages);
    // }

    // setMessages(messages?: Message[]) {
    //     messages && (this.messages = Object.assign([], messages));
    //     this.messagesSource.next(Object.assign([], this.messages));
    // }

    getHistory(sessionType: SessionType, to: string, topId?: string) {
        // return 1this.messages;
        let params: HttpParams = new HttpParams()
            .set("sessionType", sessionType.toString())
            .set("to", to);
        if (topId != null) {
            params = params.set("topId", topId);
        }

        return this.http.get('/messages', {
            params: params
        });

    }

    getMessage(sessionType: SessionType, to: string, type: TipType) {
        let params: HttpParams = new HttpParams()
            .set("sessionType", sessionType.toString())
            .set("to", to)
            .set("tipType", type);

        return this.http.get(`/messages`, {
            params: params
        })
    }

    getTipHistory(sessionType: SessionType, to: string, tipType: TipType, topId?: string) {
        let params: HttpParams = new HttpParams()
            .set("sessionType", sessionType.toString())
            .set("to", to)
            .set("tipType", tipType)
        if (topId != null) {
            params = params.set("topId", topId);
        }

        return this.http.get(`/messages`, {
            params: params
        })
    }

}
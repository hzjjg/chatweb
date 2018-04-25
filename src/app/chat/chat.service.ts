import { Injectable } from '@angular/core';
import { SessionType } from '../im/index';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class ChatService {
    private _chatInfo: ChatInfo;
    sessionTypeSubject: BehaviorSubject<ChatInfo>;

    showChatNotice = new Subject<boolean>();

    constructor() {
        this.sessionTypeSubject = new BehaviorSubject<ChatInfo>(null)
        this.sessionTypeSubject.subscribe((chatInfo: ChatInfo) => {
            this._chatInfo = chatInfo
            return chatInfo;
        })
    }

    public get chatInfo(): ChatInfo {
        return Object.assign({}, this._chatInfo);
    }

    set(flag: boolean) {
        this.showChatNotice.next(flag);
    }
    get() {
        return this.showChatNotice;
    }
}


export class ChatInfo {
    sessionType: SessionType;
    chatWith?: any;
}
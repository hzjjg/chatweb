import { Injectable } from '@angular/core';
import { IMService, Message, GroupTipMessage, SessionType } from '../im/index';
import { ChatService, ChatInfo } from '../chat/chat.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserInfo, UserService } from '../user/index';
import {HttpClient} from "@angular/common/http";
import {Gag} from "./gag";

@Injectable()
export class ContactListService {
    
    constructor(
        private http: HttpClient
    ) {

    }

    gag(params: Gag) {
        return this.http.post('/security-gags', params)
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { Message, IMService, ConnectStatus } from "../../im";
import { Subject } from "rxjs";
import { SessionType } from "../../im/session/session-type";


@Injectable()
export class ChatContentService {

    private content: Message[]
    public isFirstConnect: boolean = true;
    constructor(
        private http: HttpClient,
        private im: IMService
    ) {
        let connectStatusSubscription = this.im.connectStatusSubject.subscribe((status: ConnectStatus) => {
            switch (status) {
                case ConnectStatus.ON: {
                    this.isFirstConnect = false;
                    // console.log(this.isFirstConnect);
                    connectStatusSubscription.unsubscribe();
                    break;
                }
            }
        });
    }

}
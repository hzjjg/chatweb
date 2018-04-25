import { Component } from "@angular/core";
import { SessionType } from "../../app/im/index";
import { ChatService } from "../../app/chat/chat.service";

@Component({
    selector: 'framework-body',
    templateUrl: 'body.component.html',
    styleUrls: ['body.component.scss'],
    host: {
        'class': 'framework-body row no-gutters'
    }
})
export class BodyComponent {
    sessionType: SessionType
    chatWith: any
    constructor(
        private chatService: ChatService
    ) {
        this.sessionType = SessionType.GROUP;
        this.chatService.sessionTypeSubject.subscribe((sessionInfo) => {
            if (sessionInfo) {
                this.sessionType = sessionInfo.sessionType;
                if (this.sessionType == SessionType.C2C) {
                    this.chatWith = sessionInfo.chatWith
                } else {
                    this.chatWith = null;
                }
            } else {
                this.chatWith = null;
            }

        })
    }
} 1
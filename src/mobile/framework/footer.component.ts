import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {ChatSession, ChatSessionService} from "../../app/chat/chat-session.service";

@Component({
    selector: 'framework-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss']
})

export class FooterComponent implements OnInit, OnDestroy {
    msgTipsCount: number = 0;
    private msgTipSubscription: Subscription
    constructor(
        // private chatMessageTipService: ChatMessageTipService,
        private chatSessionService: ChatSessionService
    ) {
        // this.msgTipSubscription = this.chatMessageTipService.messageTipSubject.subscribe((messageTips) => {
        //     this.msgTipsCount = messageTips.reduce((value, tip) => {
        //         return value + (tip.messageCount || 0);
        //     }, 0)
        // })
        this.msgTipSubscription = this.chatSessionService.sessionSubject.subscribe(() => {
            this.update();
        })
    }


    ngOnInit() {
        this.update();
    }

    ngOnDestroy() {
        this.msgTipSubscription.unsubscribe();
    }

    update() {
        let sessions: ChatSession[] = this.chatSessionService.getSessions();
        if (sessions && sessions.length > 0) {
            this.msgTipsCount = sessions.reduce((value, session) => {
                return value + (session.unread || 0);
            }, 0)
        }
    }
}
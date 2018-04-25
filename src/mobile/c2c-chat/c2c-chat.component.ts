import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionType } from '../../app/im/index';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService, UserInfo } from '../../app/user/index';
import { ToastService } from '../../rui/packages/toast/toast.service';
import { ChatService } from '../../app/chat/chat.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'c2c-chat',
    templateUrl: 'c2c-chat.component.html',
    styleUrls: ['c2c-chat.component.scss']
})

export class C2cChatComponent implements OnInit, OnDestroy {
    sessionType = SessionType.C2C;
    chatWith: string;
    chatWithUser: UserInfo;
    private sessionTypeSubcription: Subscription;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private toastService: ToastService,
        private chatService: ChatService
    ) {
        this.chatWith = this.route.snapshot.params.userId;
        // this.sessionTypeSubcription = this.chatService.sessionTypeSubject.subscribe((chatInfo) => {
        //     this.chatWith = chatInfo.chatWith;
        // })

        this.userService.getUser(this.chatWith).subscribe((user: UserInfo) => {
            this.chatWithUser = user;
        }, (response) => {
            this.toastService.error(response.error.msg);
        })
    }

    ngOnInit() { }

    back() {
        this.router.navigate(['contact'])
    }

    ngOnDestroy() {
        // this.sessionTypeSubcription.unsubscribe();
    }
}
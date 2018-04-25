
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { UserInfo } from "../user/user-info";
import { environment } from "../../environments/environment";
import { Terminal, UserService, UserType } from "../user/index";
import { userInfoWithTip } from "../chat/chat-message-tip.service";

@Component({
    selector: 'contact-item',
    template: `
        <div class="chat-item clearfix" #contextMenu>
            <div class="chat-item-avatar float-left">
                <img src="{{user.avatar}}" alt="">
                <i class="fa fa-mobile icon-terminal" *ngIf="user.terminal == terminal.MOBILE && userInfo.userType == 'Staff'"></i>
                <i class="fa fa-desktop icon-terminal" *ngIf="user.terminal == terminal.PC && userInfo.userType == 'Staff'" ></i>
                <div *ngIf="user.messageCount">
                    <span class="message-count-tip" *ngIf="user.messageCount <= 99">{{user.messageCount}}</span>
                    <span class="message-count-tip count-overflow" *ngIf="user.messageCount > 99">99+</span>
                </div>
            </div>
            <div class="chat-item-icon float-right">
            <i class="fa fa-commenting-o mr-2" *ngIf="showChat"></i>
            <img src="/images/user.png" alt="" *ngIf="user.userType === 'Customer' && !isMobile" title="用户">
            <img src="/images/user2.png" alt="" *ngIf="user.userType === 'Customer' && isMobile" title="用户">
            <img src="/images/cst-icon.png" alt="" *ngIf="user.userType === 'Staff' && !isMobile" title="客服">
            <img src="/images/cst-icon2.png" alt="" *ngIf="user.userType === 'Staff' && isMobile" title="客服">
            </div>

            <div class="chat-item-info">
                <h3 class="nickname text-overflow">{{user.nickname}}</h3>
            </div>

        </div>
    `,
    styleUrls: ['contact-item.component.scss'],
    // host: {
    //     '(contextmenu)': '_onContextMenu($event)'
    // }
})
export class ContactItemComponent implements OnInit {
    isMobile: boolean = false;
    terminal = Terminal
    showChat: boolean = false;
    userInfo: UserInfo;

    @Input()
    user: userInfoWithTip;

    @Output("menu")
    contextMenuEmitter: EventEmitter<any>;

    @ViewChild('contextMenu') contextMenu: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private userService: UserService
    ) {
        this.contextMenuEmitter = new EventEmitter();
    }
    ngOnInit() {
        this.userInfo = this.userService.user.getValue();
        this.isMobile = environment.app == 'mobile';
        this.renderer.listen(this.elementRef.nativeElement, 'click', (event: any) => {
            this._onContextMenu(event);
        });

        let myInfo = this.userService.user.getValue();
        let isMyInfo = myInfo.userId == this.user.userId;

        if (myInfo.userType == UserType.Staff) {
            this.showChat = this.user.userId && !isMyInfo;
        } else {
            this.showChat = this.user.userId && this.user.userType == UserType.Staff;
        }
    }
    _onContextMenu(event: Event) {
        this.contextMenuEmitter.emit({
            "user": this.user,
            "originEvent": event
        });
        event.preventDefault();
    }
}
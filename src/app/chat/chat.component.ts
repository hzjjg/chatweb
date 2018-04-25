import {
    Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Renderer2,
    NgZone, OnDestroy
} from '@angular/core';

import { RoomService } from "./room.service";
import { ChatNotice, Room } from "./room";
import { IMService, SessionType } from "../im";
import { environment } from '../../environments/environment';
import { ChatService } from './chat.service';
import { UserService, UserInfo } from '../user/index';
import { Notice } from "../../mobile/discover/notices/notice";
import { ModalRef, ModalService } from "../../rui/packages/modal";
import { ChatGuideComponent } from "./chat-guide/chat-guide.component";
import {UserType} from "../user";
import {VisitorTipComponent} from "./visitor-tip/visitor-tip.component";

@Component({
    selector: 'chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.scss']
})

export class ChatComponent implements OnInit, OnChanges, OnDestroy {


    @Input() sessionType: SessionType;
    @Input() chatWith: string;

    notices: ChatNotice[];

    chatWithNickName: string;
    private noticeTimer: any;
    showNotice: boolean = true;
    SESSION_TYPE = SessionType;
    isMobile = environment.app == 'mobile';
    scrollLeft: number;

    chatGuide: boolean;

    visitorTip: any;

    @ViewChild("notice") private noticeEleRef: ElementRef;
    @ViewChild("noticeWrapper") private noticeWrapperEleRef: ElementRef;

    userInfo: UserInfo;
    timer: any;

    visitorTipModalRef: ModalRef;

    constructor(
        private imService: IMService,
        private renderer: Renderer2,
        private roomService: RoomService,
        private chatService: ChatService,
        private userService: UserService,
        private ngZone: NgZone,
        private modalService: ModalService,
    ) {

    }


    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            this.notices = room.notices;

            this.chatGuide = localStorage['user-guide'];
            //TODO 过期时间?
            if (!this.chatGuide && room.guide ) {
                setTimeout(() => {
                    const ref: ModalRef = this.modalService.open(ChatGuideComponent, {
                        data: room.guide
                    });
                });
                localStorage['user-guide'] = true;
                // localStorage['user-guide']
                // this.cookieService.put('user-guide', 'true');
                // this.cookieService.put('user-guide-time', (new Date()).getTime().toString());
            }

            this.visitorTip = {
                visitorWarnTimeout: room.visitorWarnTimeout,
                visitorWarn: room.visitorWarn
            };
            this.userService.user.subscribe((user) => {
                if (user) {
                    this.userInfo = user;
                    if(this.userInfo.userType != UserType.Visitor) {
                        this.startVisitorWarn();
                    }
                    if(this.userInfo.userType == UserType.Visitor &&
                        this.visitorTip.visitorWarn &&
                        this.visitorTip.visitorWarnTimeout) {
                        this.startVisitorWarnTimer();
                    }
                }
            });
        });
        this.scrollLeft = this.noticeWrapperEleRef.nativeElement.clientWidth;
    }

    startVisitorWarnTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.visitorTipModalRef = this.modalService.open(VisitorTipComponent, {
                data: this.visitorTip.visitorWarn
            });
        }, this.visitorTip.visitorWarnTimeout * 1000);
    }
    startVisitorWarn() {
        if(this.timer) {
            clearTimeout(this.timer);
        }
        this.visitorTipModalRef && this.visitorTipModalRef.close();
    }

    hideNotice() {
        this.showNotice = false;
    }

    seeNotice() {
        this.showNotice = true;
    }

    ngAfterViewInit() {
        if (environment.app == 'pc') {

            this.scrollNotice(this.scrollLeft);
            // this.renderer.listen()
            this.renderer.listen(this.noticeEleRef.nativeElement, 'mouseover', () => {
                clearInterval(this.noticeTimer);
            });

            this.renderer.listen(this.noticeEleRef.nativeElement, 'mouseleave', () => {
                this.scrollNotice(this.scrollLeft);
            })
        }
    }
    ngOnDestroy(): void {
        if (this.noticeTimer) {
            clearInterval(this.noticeTimer);
        }
    }

    scrollNotice(scrollLeft: number) {
        let noticeEle = this.noticeEleRef.nativeElement;
        let noticeWrapperEle = this.noticeWrapperEleRef.nativeElement;
        let speed = 2;
        this.scrollLeft = scrollLeft;
        if (noticeEle.clientWidth > 0) {
            this.ngZone.runOutsideAngular(() => {
                this.noticeTimer = setInterval(() => {
                    if (this.scrollLeft > -(noticeEle.scrollWidth)) {
                        this.scrollLeft -= speed;
                        this.renderer.setStyle(noticeEle, 'transform', 'translate(' + this.scrollLeft + 'px)');
                    } else {
                        this.scrollLeft = noticeWrapperEle.clientWidth;
                    }
                }, 50)
            });
        }

        // if (noticeEle.scrollWidth > noticeEle.clientWidth) {
        //     noticeWrapperEle.scrollLeft = noticeWrapperEle.scrollLeft - noticeEle.clientWidth;
        //     console.log(noticeEle.scrollWidth, noticeEle.clientWidth, noticeWrapperEle.scrollLeft, "width");
        //     this.ngZone.runOutsideAngular(() => {
        //         this.noticeTimer = setInterval(() => {
        //             if (noticeWrapperEle.scrollLeft < noticeEle.scrollWidth) {
        //                 noticeWrapperEle.scrollLeft += speed
        //             } else {
        //                 noticeWrapperEle.scrollLeft = 1;
        //             }
        //         }, 50)
        //     });
        // }

    }

    exitC2C() {
        this.chatService.sessionTypeSubject.next({ sessionType: SessionType.GROUP })
    }

    loadChatWithUser() {
        this.userService.getUser(this.chatWith).subscribe((userInfo: UserInfo) => {
            this.chatWithNickName = userInfo.nickname;
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.sessionType) {
            this.sessionType = changes.sessionType.currentValue;
        }

        if (changes.chatWith) {
            let chatWIthChange = changes.chatWith
            if (chatWIthChange.previousValue !== chatWIthChange.currentValue) {
                this.chatWith = chatWIthChange.currentValue;
                this.chatWith && this.loadChatWithUser();
            }
        }


    }
}
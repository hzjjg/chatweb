import { AfterViewChecked, Component, ElementRef, Input, Output, ViewChild, OnDestroy } from "@angular/core";
// import { MsgType, TipType } from "../../im/const";
// import { GroupNoticeTipMessage, GroupTipMessage, Message } from "../../im/msg/message";
import { PlanReference } from "../../im";
import { DomSanitizer } from "@angular/platform-browser";
import { IMService } from "../../im/ext/im.service";

import { Subscription, Subject, BehaviorSubject } from "rxjs";
// import { SessionType } from "../../im/session/session-type";
import { PlanService } from "./plan.service";
import { RoomService } from "../room.service";
import { environment } from "../../../environments/environment";
import { ChatService } from "../chat.service";
import { AnimationUtils } from "../../share/animation-utils";
import { ToastService } from "../../../rui/packages/toast/toast.service";
import { IMTimePipe } from "../../share/im-time.pipe";
import { UserInfo } from "../../user/user-info";
import { UserService } from "../../user";

@Component({
    selector: 'chat-notice',
    templateUrl: 'chat-notice.component.html',
    styleUrls: ['../chat.component.scss','./chat-notice.component.scss'],
    providers: [PlanService]
})

export class ChatNoticeComponent implements AfterViewChecked, OnDestroy {

    planRefs: PlanReference[] = [];
    showChatNotice: boolean;
    // tipType = TipType;

    isMobile = environment.app == 'mobile';
    private showChatNoticeSubscription: Subscription;
    private imSubscription: Subscription;
    private prevTopPlanRefId: string;
    // private noticeSubject: BehaviorSubject<string>;

    @ViewChild("chatNoticeContent")
    chatNoticeContent: ElementRef;

    // @ViewChild("chatNoticeMessages")
    // chatNoticeMessages: ElementRef;

    noticeLoading: boolean = false;

    constructor(
        private planService: PlanService,
        private chatService: ChatService,
        private toastService: ToastService,
        private sanitizer: DomSanitizer,
        private timePipe: IMTimePipe,
        private roomService: RoomService,
        private im: IMService,
        private userService: UserService
    ) {
        // this.noticeSubject = new BehaviorSubject("");
        // window['noticeSubject'] = this.noticeSubject;
    }

    ngOnInit() {
        this.showChatNoticeSubscription = this.chatService.showChatNotice.subscribe((isShowNotice: boolean) => {
            if (isShowNotice) {
                this.planRefs = [];
                this.prevTopPlanRefId = null;
                this.userService.user.subscribe((user: UserInfo) => {
                    if (user) {
                        this.fetchHistory(true);
                    }
                });

                this.imSubscription = this.im.planNotify.subscribe((msg: PlanReference) => {
                    this.addPlanReference(msg)
                });
            } else {
                this.imSubscription && this.imSubscription.unsubscribe();
            }
            this.showChatNotice = isShowNotice;
        });

        // window['fetchNoticeHistory'] = this.fetchHistory
    }

    fetchHistory = (switchBottom: boolean = false) => {
        let topId: string = null;
        let roomNo = this.roomService.room.getValue().roomNo;

        if (this.planRefs.length > 0) {
            let planRef = this.planRefs.find((planRef: PlanReference, index: number) => {
                return !!planRef.referenceId;
            });
            if (planRef != null) {
                topId = planRef.referenceId;
            }
        }

        this.noticeLoading = true;
        this.planService.getPlanReferences(roomNo, topId).subscribe((planRefs: PlanReference[]) => {
            this.noticeLoading = false;

            //当小于一定数量表示为空
            if (planRefs.length == 0) {
                if (this.planRefs.length > 0) {
                    this.toastService.info("没有更多历史记录");
                }
                return;
            }

            planRefs = planRefs.reverse();

            planRefs.forEach((planRef, index) => {
                let prevPlanRef = null;
                (<any>planRef).content = this.sanitizer.bypassSecurityTrustHtml(planRef.content);
                if (index != 0) {
                    prevPlanRef = planRefs[index - 1];
                }
                (<any>planRef).time = this.timePipe.transform(planRef.time);
            });

            //获取当前最顶端的消息ID
            //显示完成后直接设置数据
            if (!switchBottom) {
                let planRef = this.planRefs.find((item) => {
                    return !!item.referenceId;
                });
                this.prevTopPlanRefId = planRef ? planRef.referenceId : null;
            }

            this.planRefs = [].concat(planRefs, this.planRefs);
            // setTimeout(() => {
            //     this.launchNotice();
            // });

            if (switchBottom) {
                this.toBottom(false);
            }

            // this.planRefs = this.planRefs.concat(msgs.reverse());

            // (this.planRefs || []).forEach((message) => {
            //     message.displayTime = this.timePipe.transform(message.time);
            // });

        }, (response) => {
            this.noticeLoading = false;
            this.toastService.error(response.error.msg)
        })
    }

    // launchNotice() {
    //     // this.noticeSubject.next(this.chatNoticeMessages.nativeElement);
    // }

    toBottom(animation: boolean) {
        this.isWillScrollBottom = true;
        this.isWillAnimation = animation;
    }
    
    isWillScrollBottom: boolean = false;

    isWillAnimation: boolean = false;


    isScrolling: boolean = false;
    //动画ID
    scrollAnimationID: number = 0;

    scrollToBottom(animation: boolean = false) {
        let container = this.chatNoticeContent.nativeElement;
        if (container.scrollHeight > container.clientHeight) {
            let startTop: number = container.scrollTop,
                endTop: number = container.scrollHeight - container.clientHeight;
            if (animation) {
                //几帧 进行
                let during = Math.min(15, (endTop - startTop) / 50);
                //Math.max(1, (endTop - startTop) / 40);
                let anc = (endTop - startTop) / during;
                let current = during;
                this.isScrolling = true;
                let doAnimation = (animationId: number) => {
                    if (!this.isScrolling) {
                        //当前状态被要求停止
                        return;
                    }
                    if (this.scrollAnimationID != animationId) {
                        //动画被切换了；
                        return;
                    }
                    current--;
                    if (current > 0) {
                        //当前进度

                        let top: number = container.scrollTop;
                        container.scrollTop = top + anc;
                        AnimationUtils.rAFShim(doAnimation.bind(this, animationId));
                    } else {
                        this.isScrolling = false;
                        container.scrollTop = endTop;
                    }
                };
                doAnimation(++this.scrollAnimationID);
            } else {
                container.scrollTop = endTop;
            }
        }
    }

    ngAfterViewChecked(): void {
        //优先
        if (this.prevTopPlanRefId) {
            //停掉其他的
            this.isWillScrollBottom = false;
            let msgElementId = this.prevTopPlanRefId;
            let msgElement = this.chatNoticeContent.nativeElement.querySelector("#msg" + msgElementId);
            if (msgElement) {
                //在原有基础上加
                this.chatNoticeContent.nativeElement.scrollTop += (msgElement.offsetTop - 28);
            }
            // });
            this.prevTopPlanRefId = null;
        }
        if (this.isWillScrollBottom) {
            this.isWillScrollBottom = false;
            //终止动画
            this.scrollToBottom(this.isWillAnimation);
        }
    }

    toggleNotice() {
        this.showChatNotice = !this.showChatNotice;
        this.chatService.set(this.showChatNotice);
        // if(this.showChatNotice) {
        //     this.load();
        // } else {
        //     this.planRefs = [];
        // }
    }

    addPlanReference(planRef: PlanReference) {
        (<any>planRef).time = this.timePipe.transform(planRef.time);
        (<any>planRef).content = this.sanitizer.bypassSecurityTrustHtml(planRef.content);
        this.planRefs.push(planRef);
        //强行滚动
        this.toBottom(true);
    }

    ngOnDestroy() {
        // this.imSubscription.unsubscribe();
    }
}
import {
    Component, OnInit, Input, Renderer2, OnDestroy, ChangeDetectionStrategy,
    ChangeDetectorRef, AfterViewInit
} from "@angular/core";

import {
    Message,
    TextMessage,
    ImageMessage,
    RedPacketMessage,
    GroupTipMessage,
    GroupNoticeTipMessage,
} from "../../im/msg/message";

import { RedPacketStatus } from "../red-packet/red-packet";
import { IMService, SessionType } from "../../im";
import { EmoticonPipe } from "../emoticon.pipe";
import { MsgType, TipType } from "../../im/const";
import { UserService } from "../../user/user.service";
import { ModalRef, ModalService } from "../../rui";
import { RedPacketReceiveComponent } from "../red-packet/red-packet-receive.component";
import { DomSanitizer } from "@angular/platform-browser";
import { UserInfoComponent } from "../../user/user-info.component";
import { UserInfo } from "../../user/user-info";
import { ChatMessageService } from "../chat-message.service";
import { ImagePreviewComponent } from "../image-preview/image-preview.component";
import { environment } from "../../../environments/environment";
import { ChatService } from "../chat.service";
import { UserType } from "../../user/index";
import { ToastService } from "../../../rui/packages/toast/toast.service";

// import { Message } from "./message";

/**
 * 根据消息类型展示 内容
 */
@Component({
    // changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'chat-message',
    templateUrl: 'chat-message.component.html',
    styleUrls: ["chat-message.component.scss"]
})
export class ChatMessageComponent implements OnInit, OnDestroy, AfterViewInit {


    msgTypes = MsgType;
    @Input() message: Message;
    myUserId: number;
    isMyMsg: boolean;
    // isFirstMsg: boolean;
    redPackageOpened: boolean;
    content: any;
    loading: boolean = false;
    tipType = TipType;
    sessionType: SessionType = SessionType.GROUP;
    SESSION_TYPE = SessionType;
    private isMobile = environment.app == 'mobile'

    get imgWidth() {
        let width = (<ImageMessage>this.message).imgWidth;
        if (this.isMobile && <any>width > 200) {
            width = '200'
        }
        return width ? (width + 'px') : 'auto';
    };
    get imgHeight() {
        let imgHeight = (<ImageMessage>this.message).imgHeight;
        let width = <any>(<ImageMessage>this.message).imgWidth;
        if (this.isMobile && <any>width > 200) {
            imgHeight = (<any>imgHeight * (200 / width)).toString()
        }
        return imgHeight ? (imgHeight + 'px') : 'auto';
    };


    redPacketMessage: RedPacketMessage;

    private redPacketModalRef: ModalRef;
    constructor(
        private sanitizer: DomSanitizer,
        private emoticon: EmoticonPipe,
        private modalService: ModalService,
        private renderer: Renderer2,
        private userService: UserService,
        private im: IMService,
        private chatMessageService: ChatMessageService,
        private cdRef: ChangeDetectorRef,
        private chatService: ChatService,
        private toastService: ToastService
    ) {
        this.sessionType = this.chatService.chatInfo.sessionType
        // this.redPackageOpened = true;
        // this.msgTypes.RED_PACKET
    }

    ngAfterViewInit(): void {
        switch (this.message.msgType) {
            case MsgType.RED_PACKET: {
                break;
            }
            default: {
                this.cdRef.detach();
            }
        }
    }

    ngOnInit() {
        this.myUserId = this.userService.user.getValue().userId;
        this.isMyMsg = this.message.from == <any>this.myUserId;

        // this.isFirstMsg = false;

        switch (this.message.msgType) {
            case MsgType.TEXT: {
                let textMessage: TextMessage = <TextMessage>this.message;
                let content = this.emoticon.transform(textMessage.content);
                this.content = this.sanitizer.bypassSecurityTrustHtml(content);
                break;
            }
            case MsgType.IMAGE: {
                break;
            }
            case MsgType.RED_PACKET: {
                this.redPacketMessage = <RedPacketMessage>this.message;
                this.redPacketMessage.redPacketStatus = this.redPacketMessage.redPacketStatus || RedPacketStatus.Normal;
                break;
            }
            case MsgType.GROUP_TIP: {
                if ((<GroupTipMessage>this.message).tipType == TipType.NOTICE) {
                    this.content = this.sanitizer.bypassSecurityTrustHtml((<GroupNoticeTipMessage>this.message).content);
                }
                break;
            }
        }
    }

    openRedPacket() {
        // if (this.userService.user.getValue().userType == UserType.Staff) {
        //     this.toastService.error("客服不能抢红包");
        //     return;
        // }
        this.redPacketModalRef = this.modalService.open(RedPacketReceiveComponent, {
            data: Object.assign({}, this.message)
        });
        this.redPacketModalRef.didAppear().subscribe(() => {
            var modalDialogEle = this.redPacketModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog');
            this.renderer.setStyle(modalDialogEle, "width", "320px")
            this.renderer.setStyle(modalDialogEle, "margin-left", "auto")
            this.renderer.setStyle(modalDialogEle, "margin-right", "auto")
        })
        // this.redPacketModalRef.didDisappea().subscribe()
    }


    openUserInfo() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        let userId = parseInt(this.message.from);
        this.userService.getUser(userId).subscribe((user: UserInfo) => {
            this.loading = false;
            if (user) {
                let data = {};
                if (this.myUserId === user.userId) {
                    data = user;
                } else {
                    data = Object.assign({}, user, { other: true })
                }
                this.modalService.open(UserInfoComponent, {
                    data: data
                });
            }
        }, () => {
            this.loading = false;
        });
    }

    openBigImage(src: string) {
        let imageModalRef = this.modalService.open(ImagePreviewComponent, {
            data: src
        });
        imageModalRef.didAppear().subscribe(() => {
            let dialogEle = imageModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog');
            if (this.isMobile) {
                this.renderer.addClass(dialogEle, 'full-screen-dialog');
                this.renderer.setStyle(dialogEle, 'background', '#000');
            } else {
                this.renderer.setStyle(dialogEle, 'max-width', '600px');
            }
        })
    }

    ngOnDestroy() {
        //unsubscribe
    }
}
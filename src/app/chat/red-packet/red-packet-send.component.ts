import { Component, OnInit,Renderer2,ElementRef } from '@angular/core';

import { ModalRef, ToastService } from "../../rui";
import { MsgType } from "../../im/const"
import { ChatEditorService } from "../chat-editor/chat-editor.service";
import { RedPacketService } from "./red-packet.service";
import { RedPacketCreateInfo, RedPacketInfo } from "./red-packet";
import { UserService } from "../../user/user.service";
import { StaffUserInfo } from "../../user/user-info";
import { environment } from "../../../environments/environment";

@Component({
    selector: 'red-packet-send',
    templateUrl: 'red-packet-send.component.html',
    styleUrls: ["./red-packet.component.scss"]
})

export class RedPacketSendComponent implements OnInit {
    createInfo: RedPacketCreateInfo;
    defaultDescription = '恭喜发财，大吉大利';
    user: StaffUserInfo;

    sendLoading: boolean;
    isValid: boolean;
    constructor(
        private modalRef: ModalRef,
        private redPacketService: RedPacketService,
        private chatEditorService: ChatEditorService,
        private toastService: ToastService,
        private userService: UserService,
        private elementRef:ElementRef,
        private renderer:Renderer2
    ) {
        this.createInfo = {
            count: null,
            amount: null,
            description: null
        }
    }

    send() {
        this.sendLoading = true;
        this.createInfo.description = this.createInfo.description || this.defaultDescription;
        this.redPacketService.create(this.createInfo).subscribe((redPacket: RedPacketInfo) => {
            this.sendLoading = false;
            let message = this.chatEditorService.createMessage({
                msgType: MsgType.RED_PACKET,
                packetId: redPacket.packetId,
                token: redPacket.token
            })
            this.chatEditorService.send(message);

            this.modalRef.close();
        }, (response: any) => {
            this.sendLoading = false;
            this.toastService.error(response.error.msg)
        });

    }

    private calcModalTop() {
        let windowHeight = window.innerHeight;
        this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${(windowHeight - 425) / 2}px`);
    }

    close() {
        this.modalRef.close();
    }

    ngOnInit() {
        this.user = <StaffUserInfo>this.userService.user.getValue();
        if(environment.app == 'mobile'){
            this.calcModalTop();
        }
    }
} 
import { Component, OnInit, Input, Output, Renderer2, AfterContentInit, Inject, ElementRef } from '@angular/core';
import { plus, minus } from "number-precision";

import { ModalRef, ModalService, MODAL_DATA } from "../../../rui/packages/modal";
import { RedPacketService } from "./red-packet.service";
import { RedPacketStatus } from "../red-packet/red-packet";
import { UserService } from "../../user/user.service";
import { ToastService } from "../../rui";
import { ChatMessageService } from "../chat-message.service";
import { UserInfo } from "../../user/user-info";
import { RedPacketInfo, RedPacketInfoAllot } from "./red-packet";
import { RedPacketMessage, Message } from "../../im/msg/message";
import { RedPacketRecordComponent } from "../red-packet/red-packet-record.component";
import { IMTimePipe } from "../../share/im-time.pipe";
import { UserType } from "../../user/user-type";
import { environment } from "../../../environments/environment";
import { RedPacketTipService } from "./red-packet-tip/red-packet-tip.service";

@Component({
    selector: 'red-packet-receive',
    templateUrl: 'red-packet-receive.component.html',
    styleUrls: ['red-packet.component.scss']
})

export class RedPacketReceiveComponent implements OnInit, AfterContentInit {
    @Input() isOpen: boolean;
    // @Output() isOpenChange: Function

    redPacketInfo: RedPacketInfo;
    openLoading: boolean = false;
    myAllot: RedPacketInfoAllot;
    myInfo: UserInfo;
    receivedAmount: Number;

    private redPackRecordModalRef: ModalRef;

    constructor(
        protected redPackModalRef: ModalRef,
        private redPackageService: RedPacketService,
        private modalService: ModalService,
        private renderer: Renderer2,
        private userService: UserService,
        private toastService: ToastService,
        private redPacketService: RedPacketService,
        private elementRef: ElementRef,
        @Inject(MODAL_DATA) private data: RedPacketMessage,
        private redPacketTipService:RedPacketTipService

    ) {
        //TODO
        // this.isOpen = true;
    }

    checkRedPacketStatus() {
        if (this.redPacketInfo.allots.find((element): boolean => {
            return this.myInfo.userId == element.userId;
        })) {
            this.redPacketService.updateRedPackageStatus(
                this.data.packetId,
                RedPacketStatus.HaveReceived
            );
            // this.setRedPackstatus(this.data.token, RedPacketStatus.HaveReceived)
            this.isOpen = true;
        } else if (this.redPacketInfo.remain == 0) {
            this.redPacketService.updateRedPackageStatus(
                this.data.packetId,
                RedPacketStatus.Finished
            );
        }
    }
    ngOnInit() {
        this.myInfo = this.userService.user.getValue();
        this.redPackageService.getInfo(this.data.packetId).subscribe((redPacketInfo: RedPacketInfo) => {
            if (this.myInfo.userType === UserType.Staff) {
                this.isOpen = true;
                this.redPacketInfo = redPacketInfo;
                this.receivedAmount = minus(this.redPacketInfo.amount, this.redPacketInfo.balance)
            } else {
                this.redPacketInfo = redPacketInfo;
                this.receivedAmount = minus(this.redPacketInfo.amount, this.redPacketInfo.balance)
                this.checkRedPacketStatus();
            }

        }, (response: any) => {
            this.toastService.error(response.error.msg);
            this.redPackModalRef.close();
        })


    }

    ngAfterContentInit() {
        if(environment.app == "mobile"){
            this.calcModalTop()
        }
    }

    open() {
        this.openLoading = true;
        this.redPackageService.pull(this.data.packetId, this.data.token).subscribe((result: RedPacketInfoAllot) => {
            this.openLoading = false;
            this.isOpen = true;
            this.myAllot = result;
            this.refreshRedPacketInfo()
            // this.redPackageService.getInfo(this.data.packetId).subscribe((redPackInfo: RedPacketInfo) => {
            //     this.redPacketInfo = redPackInfo;
            //     this.receivedAmount = minus(this.redPacketInfo.amount, this.redPacketInfo.balance)
            //     this.checkRedPacketStatus();
            // }, (response: any) => {
            //     this.toastService.error(response.error.msg);
            // })
        }, (response: any) => {
            this.openLoading = false;
            this.toastService.error(response.error.msg);
            //已领
            if (response.error.code == '10601') {
                this.isOpen = true;
                // this.refreshRedPacketInfo()
                this.redPacketService.updateRedPackageStatus(this.data.packetId, RedPacketStatus.HaveReceived)
            }
            //领完
            else if (response.error.code == '10602') {
                this.isOpen = true;
                this.refreshRedPacketInfo()
                this.redPacketTipService.updateRemind(this.data.packetId)
            }
        })
    }

    private refreshRedPacketInfo() {
        this.redPackageService.getInfo(this.data.packetId).subscribe((redPackInfo: RedPacketInfo) => {
            this.redPacketInfo = redPackInfo;
            this.receivedAmount = minus(this.redPacketInfo.amount, this.redPacketInfo.balance)
            this.checkRedPacketStatus();
        }, (response: any) => {
            this.toastService.error(response.error.msg);
        })
    }

    private calcModalTop() {
        let windowHeight = window.innerHeight;
        this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${(windowHeight - 460) / 2}px`);
    }

    private setMostLucky() {
        let mostLucky = this.redPacketInfo.allots.sort((a, b) => {
            return b.money - a.money
        })[0]
    }

    // private setRedPackstatus(token: string, status: RedPacketStatus) {
    //     let messages = <RedPacketMessage[]>this.chatMessagesService.getMessages();
    //     messages.forEach(message => {
    //         if (message.token && message.token == token) {
    //             message.redPacketStatus = status;
    //         }
    //     });
    //     this.chatMessagesService.setMessages(<Message[]>messages)
    // }

    openMyRecord() {
        this.redPackRecordModalRef = this.modalService.open(RedPacketRecordComponent);
        this.redPackRecordModalRef.didAppear().subscribe(() => {
            var modalDialogEle = this.redPackRecordModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog');
            this.renderer.setStyle(modalDialogEle, "width", "320px")
            this.renderer.setStyle(modalDialogEle, "margin-left", "auto")
            this.renderer.setStyle(modalDialogEle, "margin-right", "auto")
        })

    }

    close() {
        this.redPackModalRef.close();
    }

}
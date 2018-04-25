import { Component, OnInit, Renderer2, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedPacketReceiveComponent } from "../red-packet-receive.component";
import { RedPacketTip, RedPacketTipAllot, RedPacketInfo } from "../red-packet";
import { ModalRef, ModalService, ToastService } from "../../../rui";
import { UserService } from "../../../user/user.service";
import { MsgType } from "../../../im/const";
import {
    IMService,
    TipType,
    Message,
    RedPacketMessage,
    GroupTipMessage,
    GroupPullRedPackedTipMessage
} from "../../../im";
import { RedPacketTipService } from "./red-packet-tip.service";

@Component({
    selector: 'red-packet-tip-content',
    templateUrl: 'red-packet-tip-content.component.html',
    styleUrls: ['./red-packet-tip.component.scss'],
    providers: [RedPacketTipService]

})

export class RedPacketTipContentComponent implements OnInit {
    redPackets: RedPacketTip[] = [];
    // activeRedPacket: RedPacketTip;
    // imSubscription: Subscription;
    loadingTips: boolean;
    private myUserId: any;

    @ViewChild("tipContent", undefined)
    private tipContent: ElementRef;

    constructor(
        private modalService: ModalService,
        private renderer: Renderer2,
        private im: IMService,
        private service: RedPacketTipService,
        private toastService: ToastService,
        private modalRef: ModalRef,
        private userService: UserService
    ) {
        this.myUserId = this.userService.user.getValue().userId;

    }

    ngOnInit() {
        this.loadRecent();

        // this.imSubscription = this.im.msgNotify.subscribe((msg: Message) => {
        //     if (msg.msgType == MsgType.RED_PACKET) {
        //         let redPacketTip = new RedPacketTip(),
        //             redPacketMsg = <RedPacketMessage>msg;

        //         redPacketTip.allots = [];
        //         redPacketTip.packetId = redPacketMsg.packetId;
        //         redPacketTip.token = redPacketMsg.token;
        //         redPacketTip.fromNick = redPacketMsg.fromNick;
        //         redPacketTip.fromAvatar = redPacketMsg.fromAvatar;

        //         this.redPackets.push(redPacketTip);
        //         if (this.redPackets.length == 1) {
        //             this.activeRedPacket = this.redPackets[0];
        //         }
        //     }

        //     if ((<GroupTipMessage>msg).tipType == TipType.PULL_RED_PACKET) {
        //         let pullRedPacketMsg = <GroupPullRedPackedTipMessage>msg
        //         let packet = (this.redPackets || []).find((item) => {
        //             return item.packetId == (<GroupPullRedPackedTipMessage>msg).packetId;
        //         })
        //         if (packet) {
        //             let allot = new RedPacketTipAllot();
        //             allot.nickname = pullRedPacketMsg.nickname;
        //             allot.time = <any>pullRedPacketMsg.time;
        //             console.log(allot, pullRedPacketMsg);

        //             packet.allots = packet.allots || [];
        //             packet.allots.push(allot);
        //             // console.log(this.activeRedPacket);
        //         }
        //     }
        // })
    }

    loadRecent() {
        this.loadingTips = true;
        this.service.getRecentRedPacketTips(10).subscribe((redPacketTips: RedPacketTip[]) => {
            this.loadingTips = false;
            // this.redPackets = [].concat(redPacketTips, this.redPackets);
            this.redPackets = redPacketTips
            this.redPackets = this.redPackets.sort((a, b) => {
                return (a.time || 0) - (b.time || 0);
            })
            this.redPackets.forEach((redPacket) => {
                (<any>redPacket)._opened = ~(redPacket.allots.findIndex((item) => {
                    return item.userId == this.myUserId;
                })) || ((<any>redPacket).balance === 0)
            })
        }, (response) => {
            this.loadingTips = false;
            this.toastService.error(response.error.msg)
        })
    }


    openRedPacket(redPacketTip: RedPacketTip) {
        let redPacketInfo = new RedPacketInfo();
        redPacketInfo.packetId = redPacketTip.packetId;
        redPacketInfo.token = redPacketTip.token;
        redPacketInfo.fromAvatar = redPacketTip.fromAvatar;
        redPacketInfo.fromNick = redPacketTip.fromNick;

        let redPacketModalRef = this.modalService.open(RedPacketReceiveComponent, {
            data: Object.assign({}, redPacketInfo)
        });
        redPacketModalRef.didAppear().subscribe(() => {
            var modalDialogEle = redPacketModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog');
            this.renderer.setStyle(modalDialogEle, "width", "320px")
            this.renderer.setStyle(modalDialogEle, "margin-left", "auto")
            this.renderer.setStyle(modalDialogEle, "margin-right", "auto")
        })

        redPacketModalRef.didDisappear().subscribe(() => {
            this.redPackets = [];
            this.loadRecent();
        })
    }

    close() {
        this.modalRef.close();
    }
}
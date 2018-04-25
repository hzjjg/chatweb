import { Component, OnInit, Renderer2, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RedPacketReceiveComponent } from "../red-packet-receive.component";
import { RedPacketTip, RedPacketTipAllot, RedPacketInfo } from "../red-packet";
import { ModalRef, ModalService, ToastService } from "../../../rui";
import { MsgType } from "../../../im/const";
import { IMTimePipe } from "../../../share/im-time.pipe";
import { UserService } from "../../../user/user.service";
import { UserInfo } from "../../../user/user-info";

import { RoomService } from "../../../chat/room.service";
import { Room } from "../../room";
import { StateManagerService, States } from "../../../system/state-manager.service";

import {
    IMService,
    TipType,
    Message,
    RedPacketMessage,
    GroupTipMessage,
    GroupPullRedPackedTipMessage
} from "../../../im";
import { RedPacketTipContentComponent } from "./red-packet-tip-content.component";
import { RedPacketTipService } from "./red-packet-tip.service";

@Component({
    selector: 'red-packet-tip',
    templateUrl: 'red-packet-tip.component.html',
    styleUrls: ['./red-packet-tip.component.scss'],
})
export class RedPacketTipComponent implements OnInit {
    redPacket: RedPacketTip;
    // allots: RedPacketTipAllot[];
    isShowContent: boolean;
    imSubscription: Subscription;
    private myUserId: any;

    @ViewChild("tipContent", undefined)
    private tipContent: ElementRef;

    @ViewChild("tipIcon", undefined)
    private tipIcon: ElementRef;

    constructor(
        private modalService: ModalService,
        private renderer: Renderer2,
        private im: IMService,
        private timePipe: IMTimePipe,
        private service: RedPacketTipService,
        private toastService: ToastService,
        private userService: UserService,
        private roomService: RoomService,
        private stateManagerService: StateManagerService

    ) {
        // this.myUserId = this.userService.user.getValue().userId;
        // this.allots = [];
    }

    ngOnInit() {
        this.updateRemind()
        this.userService.user.subscribe((user: UserInfo) => {
            if (user) {
                this.myUserId = user.userId
                this.service.getRecentRedPacketTips(1).subscribe((redPacketTips: RedPacketTip[]) => {
                    if (!redPacketTips[0]) {
                        return;
                    }
                    this.redPacket = redPacketTips[0];
                    (this.redPacket.allots || []).forEach((allot) => {
                        allot.time = <any>this.timePipe.transform(allot.time);
                    })

                    // this.remind();
                    // (<any>this.redPacket)._opened = ~(this.redPacket.allots.findIndex((allot) => {
                    //a     return allot.userId == this.myUserId
                    // })) || ((<any>this.redPacket).balance === 0)

                }, (response) => {
                    this.toastService.error(response.error.msg)
                })
            }
        })

        this.imSubscription = this.im.msgNotify.subscribe((msg: Message) => {
            if (msg.msgType == MsgType.RED_PACKET) {
                let redPacketMsg = <RedPacketMessage>msg;
                let redPacketTip = new RedPacketTip();
                redPacketTip.packetId = redPacketMsg.packetId;
                redPacketTip.token = redPacketMsg.token;
                redPacketTip.fromAvatar = redPacketMsg.fromAvatar;
                redPacketTip.fromNick = redPacketMsg.fromNick;

                if (!this.redPacket) {
                    this.redPacket = redPacketTip;
                    this.redPacket.allots = [];
                    this.remind();
                } else {
                    if ((msg.time || 0) > (this.redPacket.time || 0)) {
                        this.redPacket = redPacketTip;
                        this.redPacket.allots = [];
                        this.remind();
                    }
                }
            }

            if ((<GroupTipMessage>msg).tipType == TipType.PULL_RED_PACKET) {
                if (!this.redPacket) {
                    return;
                }
                let pullRedPacketMsg = <GroupPullRedPackedTipMessage>msg
                if (pullRedPacketMsg.packetId == this.redPacket.packetId) {
                    let allot = new RedPacketTipAllot();
                    allot.nickname = pullRedPacketMsg.nickname;
                    allot.time = <any>this.timePipe.transform(pullRedPacketMsg.time);
                    this.redPacket.allots.push(allot);
                }
                
                if(this.myUserId && this.myUserId == pullRedPacketMsg.userId){
                    this.cancelRemind()
                }
            }
        })

        this.service.remindSubject.subscribe((packetId:any)=>{
            
            if(packetId && this.redPacket && packetId == this.redPacket.packetId){
                this.cancelRemind();
            }
        })
    }


    toggleTipContent() {
        this.isShowContent = !this.isShowContent;
        this.cancelRemind()
        // if (!this.isShowContent) {
        //     this.redPacket = null;
        // }
    }

    //红包图标闪烁
    updateRemind() {
        if (this.stateManagerService.state[States.RED_PACKET_HAS_NEW]) {
            this.renderer.addClass(this.tipIcon.nativeElement, 'remind')
        } else {
            this.renderer.removeClass(this.tipIcon.nativeElement, 'remind')
        }
    }

    remind() {
        this.stateManagerService.on(States.RED_PACKET_HAS_NEW);
        this.updateRemind()
    }

    cancelRemind() {
        this.stateManagerService.off(States.RED_PACKET_HAS_NEW);
        this.updateRemind()
    }

    openRedPacket() {
        let redPacketInfo = new RedPacketInfo();
        redPacketInfo.packetId = this.redPacket.packetId;
        redPacketInfo.token = this.redPacket.token;
        redPacketInfo.fromAvatar = this.redPacket.fromAvatar;
        redPacketInfo.fromNick = this.redPacket.fromNick;

        let redPacketModalRef = this.modalService.open(RedPacketReceiveComponent, {
            data: Object.assign({}, redPacketInfo)
        });
        redPacketModalRef.didAppear().subscribe(() => {
            var modalDialogEle = redPacketModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog');
            this.renderer.setStyle(modalDialogEle, "width", "320px")
            this.renderer.setStyle(modalDialogEle, "margin-left", "auto")
            this.renderer.setStyle(modalDialogEle, "margin-right", "auto")
        })
    }


    @HostListener('document:touchstart', ['$event'])
    onTouchStart(event: Event) {
        if (this.tipContent.nativeElement.contains(event.target) || this.tipIcon.nativeElement.contains(event.target)) {
        } else {
            this.isShowContent = false;
        }
    }

    @HostListener('document:click', ['$event'])
    onClick(event: Event) {
        if (this.tipContent.nativeElement.contains(event.target) || this.tipIcon.nativeElement.contains(event.target)) {
        } else {
            this.isShowContent = false;
        }
    }

    openTipContent() {
        let contentModalRef = this.modalService.open(RedPacketTipContentComponent);
    }
}

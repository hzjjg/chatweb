import {Component, Inject, Renderer2} from "@angular/core";
import {ModalRef, ModalService} from "../rui";
import {WithdrawComponent} from "./withdraw.component";
import {MODAL_DATA} from "../../rui/packages/modal/modal.service";
import {UserWallet} from "./user-wallet";
import {ToastService} from "../../rui/packages/toast/toast.service";
import {UserService} from "../user/user.service";
import {RedPacketRecordComponent} from "../chat/red-packet/red-packet-record.component";

@Component({
    selector: 'wealth',
    templateUrl: 'wallet.component.html',
    styleUrls: ['wallet.component.scss']
})

export class WalletComponent {
    userWallet: UserWallet;
    // withdrawModalRef: ModalRef;
    receiveRedPacket: ModalRef;

    constructor(
        private toastServe: ToastService,
        private userService: UserService,
        private modalService: ModalService,
        private renderer: Renderer2
    ) {

    }

    ngOnInit() {
        this.userService.getWallet().subscribe((userWallet) => {
            this.userWallet = <UserWallet>userWallet;
        });
    }

    public openWithdraw() {
        this.toastServe.warning('敬请期待!');
        // this.withdrawModalRef = this.modalService.open(WithdrawComponent, {
        //     data: this.wallet
        // })
    }

    public openRedPacket() {
        this.receiveRedPacket = this.modalService.open(RedPacketRecordComponent);
    }
}
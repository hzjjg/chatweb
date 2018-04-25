import { Component, Inject, Renderer2 } from "@angular/core";
import { ModalRef, ModalService } from "../rui";
import { WithdrawComponent } from "./withdraw.component";
import { MODAL_DATA } from "../../rui/packages/modal/modal.service";
import { UserWallet } from "./user-wallet";
import { ToastService } from "../../rui/packages/toast/toast.service";
import { UserService } from "../user/user.service";
import { RedPacketRecordComponent } from "../chat/red-packet/red-packet-record.component";
import { ConversionMoneyApplyComponent } from "./draw-money/draw-money.component";
import { ConversionMoneyHistoryComponent } from "./draw-money/draw-money-history.component";
import { environment } from "../../environments/environment";
import { PageManager } from "../system/page-manage";

@Component({
    selector: 'wealth',
    templateUrl: 'wallet.component.html',
    styleUrls: ['wallet.component.scss']
})

export class WalletComponent {
    userWallet: UserWallet;
    // withdrawModalRef: ModalRef;
    private receiveRedPacket: ModalRef;
    private isMobile: boolean

    constructor(
        public modalRef: ModalRef,
        private toastService: ToastService,
        private userService: UserService,
        private modalService: ModalService,
        private renderer: Renderer2,
        private pageManage: PageManager,
    ) {
        this.isMobile = environment.app == 'mobile'
    }

    ngOnInit() {
        this.userService.getWallet().subscribe((userWallet) => {
            this.userWallet = <UserWallet>userWallet;
        }, (response: any) => {
            this.toastService.error(response.error.msg);
        });
    }

    public openRedPacket() {
        this.receiveRedPacket = this.modalService.open(RedPacketRecordComponent);

    }

    recharge() {
        this.toastService.warning('充值请联系客服!');
    }

    openConversionMoney() {
        this.pageManage.goConversionApply();
        this.modalRef.close()
        // if (this.isMobile) {
        //     this.modalRef.close()
        // }
    }

    openConversionHistory() {
        this.pageManage.goConversionHistory();
        this.modalRef.close()
        // if (this.isMobile) {
            // this.modalRef.close()
        // }
    }
}
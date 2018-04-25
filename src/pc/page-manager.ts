import { PageManager } from "../app/system/page-manage";

import { Injectable } from '@angular/core';
import { ModalService } from "../rui/packages/modal/modal.service";
import { LoginComponent } from "../app/user/login.component";
import { ConversionMoneyApplyComponent } from "../app/wallet/draw-money/draw-money.component";
import { RegisterComponent } from "../app/user/register.component";
import { ConversionMoneyHistoryComponent } from "../app/wallet/draw-money/draw-money-history.component";

@Injectable()
export class PcPageManager extends PageManager {

    constructor(
        private modalService: ModalService,
    ) {
        super();
    }

    goConversionApply() {
        this.modalService.open(ConversionMoneyApplyComponent)
    }

    goConversionHistory() {
        this.modalService.open(ConversionMoneyHistoryComponent)
    }

    goLogin() {
        this.modalService.open(LoginComponent)
    }

    goRegister() {
        this.modalService.open(RegisterComponent)
    }

    goChat(userId: any) {

    }

}
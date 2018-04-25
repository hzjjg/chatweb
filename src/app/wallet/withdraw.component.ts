import {Component, Inject} from "@angular/core";
import {ModalRef, MODAL_DATA} from "../rui";
import {NgForm} from "@angular/forms";
import {UserWallet} from "./user-wallet";

@Component({
    selector: 'withdraw',
    templateUrl: 'withdraw.component.html',
    styleUrls: ['../user/login.component.scss']
})

export class WithdrawComponent {
    wallet: UserWallet;
    money: any;
    selectBank: number = 1;
    banks: any[] = [
        {
            id: 1,
            name: '招商银行'
        },
        {
            id:2,
            name: '建设银行'
        }
    ];

    constructor(
        public modalRef: ModalRef,
        @Inject(MODAL_DATA) data: any
    ) {
        this.wallet = data;
    }

    presentAll() {
        this.money = this.wallet;
    }

    submit(withdrawForm: NgForm) {
    }
}
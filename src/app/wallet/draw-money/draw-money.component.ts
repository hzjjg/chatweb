import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ConversionMoneyService } from './draw-money.service';
import { UserService } from '../../user/index';
import { UserWallet } from '../user-wallet';
import { ToastService } from '../../../rui/packages/toast/toast.service';
import { ModalRef } from '../../../rui/packages/modal/modal-ref';
import { environment } from '../../../environments/environment';
import { WorkReviewStatus } from '../work';
import { Room, RoomService } from "../../chat";
import { CstUserInfo, UserInfo } from "../../user/user-info";

@Component({
    selector: 'conversion-money-apply',
    templateUrl: 'draw-money.component.html',
    styleUrls: ['draw-money.component.scss'],
})

export class ConversionMoneyApplyComponent implements OnInit {
    money: string;
    wallet: UserWallet; //balance
    remark: string;
    isMobile: boolean;
    room: Room;
    account: string;
    phone: number;
    userInfo: CstUserInfo;
    conversionMoneyForm: FormGroup;
    constructor(
        private service: ConversionMoneyService,
        private userService: UserService,
        private toastService: ToastService,
        private modalRef: ModalRef,
        private roomService: RoomService
    ) {
        this.isMobile = environment.app == 'mobile';
        this.roomService.room.subscribe((room: Room) => {
            this.room = room;
        })
    }

    ngOnInit() {
        this.userService.getWallet().subscribe((wallet) => {
            this.wallet = <UserWallet>wallet;
        });
        const userInfo = this.userService.user.getValue();
        this.userInfo = <CstUserInfo>userInfo;
    }

    cashOut() {
        let params: any = {
            money: this.money,
            account: this.account,
            remark: this.remark
        };

        if(params.money < this.room.drawmoneyOpts.minMoney) {
            this.toastService.error('金额过低，最低提现金额为' + this.room.drawmoneyOpts.minMoney + '元');
            return;
        }

        if (this.room.drawmoneyOpts && this.room.drawmoneyOpts.enablePhone && this.phone) {
            (<any>params).phone = this.phone;
        }

        this.service.cashOut(params).subscribe((response) => {
            this.toastService.success("提交成功，请等待审核通过");
            if (params.phone && !this.userInfo.phone) {
                this.userInfo.phone = params.phone;
                // this.userService.fetchUserInfo().subscribe(() => {
                // });
            }
            if (environment.app == 'mobile') {
                this.back();
            } else {
                this.modalRef.close();
            }
        }, (response) => {
            this.toastService.error(response.error.msg);
            if (environment.app == 'mobile') {
                this.back();
            } else {
                this.modalRef.close();
            }
        })
    }

    close() {
        this.modalRef.close();
    }

    back() {
        history.back();
    }

    cashOutAll() {
        this.money = <any>this.wallet.balance;
    }

    moneyChange() {
        if ((this.money != null) && !isNaN(parseFloat(this.money))) {
            let strs = this.money.toString().split('.');
            let str = strs[1] || ''
            if (str.length > 2) {
                this.money = parseFloat(this.money).toFixed(2);
            }
        }
    }

}
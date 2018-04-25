import { Component, OnInit } from '@angular/core';
import { ConversionMoneyService } from './draw-money.service';
import { ConversionMoneyWork, WorkReviewStatus } from '../work'
import { ToastService } from '../../../rui/packages/toast/toast.service';
import { ModalRef } from '../../../rui/packages/modal/modal-ref';
import { DatePipe } from '@angular/common/src/pipes/date_pipe';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'conversion-money-history',
    templateUrl: 'draw-money-history.component.html',
    styleUrls: ['draw-money.component.scss']
})

export class ConversionMoneyHistoryComponent implements OnInit {
    histories: ConversionMoneyWork[];
    isMobile: boolean;
    workReviewStatus = WorkReviewStatus;
        
    constructor(
        private service: ConversionMoneyService,
        private toastService: ToastService,
        private modalRef: ModalRef
    ) {
        this.isMobile = environment.app == 'mobile'
    }

    ngOnInit() {
        this.service.getHistory().subscribe((histories: ConversionMoneyWork[]) => {
            this.histories = histories;
        }, (response) => {
            this.toastService.error(response.error.msg);
            // this.histories = [
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.ADOPTED,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.REJECTED,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.WAITING,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.ADOPTED,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.REJECTED,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.WAITING,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.ADOPTED,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.REJECTED,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.WAITING,
            //         reviewTime: 1511282413992,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.ADOPTED,
            //         reviewTime: 121231233,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.REJECTED,
            //         reviewTime: 121231233,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            //     {
            //         money: 123,
            //         status: WorkReviewStatus.WAITING,
            //         reviewTime: 121231233,
            //         reason: "haha",
            //         remark: "nothing"
            //     },
            // ]

        })
    }

    close() {
        this.modalRef.close();
    }

    back() {
        history.back();
    }
}
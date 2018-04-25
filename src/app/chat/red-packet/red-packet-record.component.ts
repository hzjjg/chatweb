import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

import { ModalRef } from "../../rui";
import { UserService } from "../../user/user.service";
import { UserInfo } from "../../user/user-info";
import { RedPacketStatistic } from "./red-packet-statistic";
import { RedPacketLog } from "./red-packet-log";
import { environment } from "../../../environments/environment";

@Component({
    selector: 'red-packet-record',
    templateUrl: 'red-packet-record.component.html',
    styleUrls: ['red-packet.component.scss']
})

export class RedPacketRecordComponent implements OnInit {
    user: UserInfo;
    statistic: RedPacketStatistic;
    logs: RedPacketLog[];

    constructor(
        private modalRef: ModalRef,
        private userService: UserService,
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) { }

    ngOnInit() {
        this.userService.user.subscribe((user) => {
            this.user = user;
        });

        this.userService.fetchRedPacketStatistic().subscribe((statistic: any) => {
            this.statistic = statistic;
        });
        this.logs = [];
        this.loadLog();

        if(environment.app =='mobile'){
            this.calcModalTop()
        }
    }

    fetchMore() {
        let logId = null;
        if (this.logs.length > 0) {
            logId = this.logs[this.logs.length - 1].logId;
        }
        this.loadLog(logId);
    }

    loadLog(logId?: string) {
        this.userService.fetchRedPacketLogs(logId).subscribe((logs: RedPacketLog[]) => {
            this.logs = this.logs.concat(logs);
        })
    }

    private calcModalTop() {
        let windowHeight = window.innerHeight;
        this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${(windowHeight - 470) / 2}px`);
    }

    close() {
        this.modalRef.close();
    }

}
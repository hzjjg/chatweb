import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs/Subject";

import {RedPacketCreateInfo, RedPacketInfo, RedPacketStatus} from "./red-packet";
import { RedPacketMessage } from "../../im/msg/message";

@Injectable()
export class RedPacketService { 

    statusChange = new Subject<{
        packetId: number,
        status: RedPacketStatus
    }>();


    constructor(
        private http: HttpClient
    ) {

    }

    create(createInfo: RedPacketCreateInfo) {
        // if (createInfo.description) {
        //     createInfo.description = '恭喜发财，大吉大利'
        // }
        // this.sendLoading = true;
        return this.http.post('/red-packet', createInfo);
    }

    getInfo(packetId: number) {
        return this.http.get(`/red-packet/${packetId}`);
    }

    pull(packetId: number, token: string) {
        return this.http.post(`/red-packet/${packetId}/pull`, {
            token: token
        })
    }


    updateRedPackageStatus(packetId: number, status: RedPacketStatus) {
        this.statusChange.next({
            packetId,
            status
        });
    }

}
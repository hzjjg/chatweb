import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";

import { RoomService } from "../../../chat/room.service";



@Injectable()
export class RedPacketTipService {
    remindSubject: Subject<any>;
    constructor(
        private http: HttpClient,
        private roomService: RoomService
    ) {
        this.remindSubject = new Subject()
    }

    getRecentRedPacketTips(maxRow: number, topId?: any) {
        let room = this.roomService.room.getValue();
        let params = new HttpParams().set('maxRow', maxRow.toString())
        topId && (params = params.set('topId', topId));
        return this.http.get(`/rooms/${room.roomNo}/red-packet?`, {
            params: params
        });
    }

    updateRemind(packetId: any) {
        this.remindSubject.next(packetId);
    }
}
import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { HttpClient, HttpParams } from "@angular/common/http";

import { ToastService } from "../../rui";
import { IMService, PlanReference } from "../../im";


@Injectable()
export class PlanService {

    constructor(
        private im: IMService,
        private toastService: ToastService,
        private http: HttpClient
    ) {

    }

    getPlanReferences(roomNo: string, topId?: string) {
        let params: HttpParams = new HttpParams()
            .set('roomNo', roomNo)
        if (topId != null) {
            params = params.set("topId", topId);
        }
        return this.http.get(`/plan-references`, {
            params: params
        })
    }

}
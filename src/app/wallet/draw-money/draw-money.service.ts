import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConversionMoneyService {

    constructor(
        private http: HttpClient
    ) {

    }

    getHistory() {
        return this.http.get('/conversion-money-works')
    }

    cashOut(params: any) {
        return this.http.post('/conversion-money-apply', params)
    }
}


import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CustomerRegisterInfo} from "./customer-register-info";
import {CustomerRegisterApply} from "./customer-register-apply";

@Injectable()
export class CustomerService {

    constructor(
        private httpClient: HttpClient
    ) {

    }

    apply(apply: CustomerRegisterApply) {
        return this.httpClient.post("/customers", apply);
    }
}
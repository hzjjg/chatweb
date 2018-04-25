

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
@Injectable()
export class CaptchaService {

    constructor(private http: HttpClient) {
    }

    request() : Observable<any> {
        return this.http.post("/captcha", null);
    }

}
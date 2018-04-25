import {Http} from "@angular/http";
import 'rxjs/add/operator/map'
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Subject} from "rxjs/Subject";


@Injectable()
export class VisitorService {
    constructor(
        private http: HttpClient
    ) {
    }
    apply(body: any) : Observable<Object> {
        return this.http.post("/visitor", body)
    }
    // handleError(error: any): Promise<any> {
    //     return Promise.reject(error.message || error);
    // }
}
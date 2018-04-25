
import {UserType} from "./user-type";
import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";


@Injectable()
export class SessionService {

    imAuth: BehaviorSubject<void>;

    loginSubject: Subject<void>;

    constructor(private http: HttpClient) {
        this.imAuth = new BehaviorSubject<void>(null);
        this.loginSubject = new Subject<void>();
    }

    get() {
        return this.http.get("/session");
    }
    
    login(type: UserType,
          username: string,
          sign: string) : Observable<any> {
        return this.http.post("/session", {
            type: UserType[type],
            username,
            sign
        }).map(() => {
            this.loginSubject.next(null);
        })
    }

    logout() {
        return this.http.delete("/session")
    }
    //
    // handleError(error: any): Promise<any> {
    //     return Promise.reject(error.message || error);
    // }
}
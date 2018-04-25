


import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {UserInfo} from "./user-info";
import {UserProfileInfo} from "./user-profile-info";

@Injectable()
export class UserService {

    private _userId: BehaviorSubject<number>;
    private _user: BehaviorSubject<UserInfo>;

    get userChange() {
        return this._userId.distinctUntilChanged()
    }
    get user() {
        return this._user;
    }
    constructor(private httpClient: HttpClient) {
        this._userId = new BehaviorSubject<number>(null);
        this._user = new BehaviorSubject<any>(null);
        this.user.subscribe((user) => {
            this._userId.next(user? user.userId: null);
        })
    }

    //CstUserInfo 或 StaffUserInfo
    fetchUserInfo() {
        let params: HttpParams = new HttpParams()
            .set("timestamp", new Date().getTime().toString());
        return this.httpClient.get("/user", {
            params
        }).map((user: UserInfo) => {
            this._user.next(user);
            return user;
        });
    }

    putProfile(userProfileInfo: UserProfileInfo) {
        // UserProfileInfo
        // let obj;
        return this.httpClient.put("/user/profile", userProfileInfo);
    }


    putPassword(
        pwd: string,
        newPwd: string
    ) {
        //ModifyPasswordInfo
        // let obj;
        return this.httpClient.put("/user/password", {
            pwd,
            newPwd
        });
    }

    ///user/wallet
    getWallet() {
        return this.httpClient.get('/user/wallet');
    }

    getProfile() {
        return this.httpClient.get('/user/profile')
    }


    fetchRedPacketStatistic() {
        return this.httpClient.get("/user/red-packet-statistic")
    }

    fetchRedPacketLogs(topId?: string) {
        let params: HttpParams = new HttpParams();
        if (topId) {
            params.set("topId", topId);
        }
        return this.httpClient.get("/user/red-packet-logs", {
            params
        })
    }

    getUser(
        userId: any
    ) {
        return this.httpClient.get("/user/" + userId);
    }

    getRobot(robotId: any) {
        return this.httpClient.get(`/robots/${robotId}`);
    }
}
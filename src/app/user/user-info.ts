import { UserType } from "./user-type";

export class UserInfo {
    userId: number;
    userType: UserType;
    username: string;
    nickname: string;
    avatar: string;
    personalSignature: string;

    //本地检索使用
    keyword: string;
    terminal: string;
}

export class CstUserInfo extends UserInfo {
    username: string;
    phone: string;
    balance: number;
}

export class StaffUserInfo extends UserInfo {
    username: string;
    name: string;
    contact: string;
}

export class VisitorUserInfo extends UserInfo {
    visitorNo: string;
}

export enum Terminal {
    PC = "PC",
    MOBILE = 'MOBILE'
}
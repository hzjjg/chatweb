import {SessionType} from "./session-type";

export class Session {
    type: SessionType;
    id: string;    //群ID 或 对方ID
    name: string;  //名称
    icon: string;  //头像url
    time: number;
    seq: number;   //当前会话最新消息序列号

    //获取当前最新消息序列号
    getCurMaxMsgSeq() {

    }

    //获取未读消息数
    unread() {

    }
}

export class SessionService {
    //获取所有会话对象
    sessions() {

    }

    getBy(type: SessionType, id: string) {

    }

}
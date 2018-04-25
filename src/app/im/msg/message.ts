import { Session } from "../session/session";
import { MsgType, TipType } from "../const";
import { UserType } from "../../user/user-type";
import { SessionType } from "../session/session-type";
import { RedPacketStatus } from "../../chat/red-packet/red-packet";
import { UserInfo } from "../../user/user-info";

//消息元素
// export class MsgElement {
//
// }
export abstract class Message {
    // session: Session;
    msgId: string;
    type: SessionType;
    msgType: MsgType;
    from: string;
    fromNick?: string; //来源昵称 ，将由服务端填充
    fromAvatar?: string;
    to: string;
    seq: number;
    time: number;
    clientMsgId: number;

    //本地管理
    displayTime?: string;

    // elements: MsgElement[];
    constructor(msgType: MsgType) {
        let time: number = new Date().getTime();
        time = time >>> 4;

        this.clientMsgId = time;
        this.msgType = msgType;
    }
}

export class TextMessage extends Message {
    content: string;
    constructor(content: string) {
        super(MsgType.TEXT);
        this.content = content;
    }
}

export class ImageMessage extends Message {
    content: string; //图片信息
    mediaUri: string;
    imgWidth: string;
    imgHeight: string;
    constructor(mediaUri: string) {
        super(MsgType.IMAGE);
        this.mediaUri = mediaUri;
    }
}

//红包效果 (领取调用接口)
export class RedPacketMessage extends Message {
    packetId: number;
    token: string;
    description: string;
    redPacketStatus: RedPacketStatus;
    constructor(packetId?: number, token?: string, description?: string) {
        super(MsgType.RED_PACKET);
        this.packetId = packetId;
        this.token = token;
        this.description = description;
    }
}

/**
 * 提示消息
 */
export abstract class GroupTipMessage extends Message {
    tipType: TipType;
    constructor(tipType: TipType) {
        super(MsgType.GROUP_TIP);
        this.tipType = tipType;
    }
}

//进群
export class GroupJoinTipMessage extends GroupTipMessage {
    userType: UserType;
    userId: number;
    nickname: string;
    user: UserInfo;
    total: number; //总人数
    constructor(userType: UserType, userId: number, nickName: string) {
        super(TipType.JOIN);
        this.userType = userType;
        this.userId = userId;
        this.nickname = nickName;
    }
}

//退群
export class GroupQuitTipMessage extends GroupTipMessage {
    userType: UserType;
    userId: number;
    nickname: string;
    total: number; //总人数
    constructor(userType: UserType, userId: number, nickName: string) {
        super(TipType.QUIT);
        this.userType = userType;
        this.userId = userId;
        this.nickname = nickName;
    }
}


//团修改成员信息
export class GroupModifyMemberInfoTipMessage extends GroupTipMessage {
    user: UserInfo;
}


//收红包
export class GroupPullRedPackedTipMessage extends GroupTipMessage {
    userType: UserType;
    userId: number;
    nickname: string;
    // token: string;
    // tokenFrom: string;
    packetId:any;
    packetFrom:string;
    money: number;
    description: string;
    // constructor(
    //     userType: UserType,
    //     userId: number,
    //     nickName: string,
    //     // token: string,
    //     // tokenFrom: string,
    //     packetId:any,
    //     packetFrom:string,
    //     money: number,
    //     description: string

    // ) {
    //     super(TipType.PULL_RED_PACKET);
    //     this.userType = userType;
    //     this.userId = userId;
    //     this.nickname = nickName;
    //     // this.token = token;
    //     // this.tokenFrom = tokenFrom;
    //     this.packetId = packetId;
    //     this.packetFrom = packetFrom;
    //     this.money = money;
    //     this.description = description;
    // }
}

export class GroupRemoveMsgMessage extends GroupTipMessage {
    removeMsgIds: string[];
    // constructor() {
    //     super(TipType.REMOVE_MSG);
    // }
}

export class GroupGagTipMessage extends GroupTipMessage {
    userType: UserType;
    userId: number;
    nickname: string;
    expiryTime: number;
}

export class GroupNoticeTipMessage extends GroupTipMessage{
    content:string;
}
export enum Command {
    //身份相关
    // REGISTER = 'Register',          //注册
    LOGIN = 'Login',                   //登录鉴权
    OTHER_LOGIN = 'OtherLogin',        //被登录了
    // LOGOUT = 'Logout',              //退出
    // APPLY_VISITOR = 'ApplyVisitor', //申请游客

    //IM 消息相关
    SEND = 'Send',                  //发送消息
    ROOMS = 'Rooms',                //获取房间列表
    ROOM_DETAIL = 'RoomDetail',     //房间详情
    JOIN_ROOM = 'JoinRoom',         //加入房间 (将会切换)
    KICK_ROOM = 'KickRoom',

    //控制相关


    //客户端控制
    //消息通知
    MSG_NOTIFY = "MsgNotify", //消息通知
    PLAN_NOTIFY = "PlanNotify" //计划通知


}

export class RCMessage {
    command: Command;
    encrypt: string;
    data: any;


    constructor(command: Command, encrypt: string, data: any) {
        this.command = command;
        this.encrypt = encrypt;
        this.data = data;
    }
}


export class RCResponse {
    command: Command;
    data: any;

    constructor(command: Command, data: any) {
        this.command = command;
        this.data = data;
    }
}

//登录
//上报已读
//发送消息(私聊,群聊)
//获取历史消息(私聊,群聊)
//获查询个人资料
//设置个人资料
//登出

//SESSION-TYPE
import { Injectable } from "@angular/core";
import { WebSocketConnection } from "../io/web-socket-connection";
import { ConnectStatus } from "../const";
import { ConnectionStatus } from "../io/connection";
import { Subject } from "rxjs/Subject";
import { HeartbeatCheck } from "../session/heartbeat";
import { Message } from "../msg/message";
import { PlanReference } from "../plan/plan-reference";
import { Command, RCMessage, RCResponse } from "../rc/proto";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {Backoff} from "./backoff";

/**
 * 在线测试: http://www.blue-zero.com/WebSocket/
 */
@Injectable()
export class IMService {
    url: string;
    private connection: WebSocketConnection;
    private heartbeatCheck: HeartbeatCheck;
    private backoff: Backoff;
    connectStatus: ConnectStatus;
    connectStatusSubject: Subject<ConnectStatus>;
    reconnecting: boolean;
    skipReconnect: boolean;
    on: Subject<RCResponse>;


    auth: BehaviorSubject<boolean>;


    constructor() {
        this.auth = new BehaviorSubject<boolean>(false);
        this.connectStatus = ConnectStatus.OFF;
        this.connectStatusSubject = new Subject();
        this.testNotice = new Subject();
        this.loginNotice = new Subject();
        this.msgNotify = new Subject();
        this.planNotify = new Subject();
        this.on = new Subject();
        this.groupInfoChangeNotify = new Subject();
        this.groupSystemNotify = new Subject();
        this.profileSystemNotify = new Subject();
        this.reconnecting = false;
        this.heartbeatCheck = new HeartbeatCheck(
            () => {
                //不确定PING兼容，直接使用数据发送
                this.connection.send('PING');
            }
        );
        this.backoff = new Backoff({
            min: 1000,
            max: 5000,
            jitter: 0.5
        })
    }


    connect(url: string) {
        this.url = url;
        this.skipReconnect = false;
        this._connect();
    }
    heartbeat() {
        if (this.connectStatus == ConnectStatus.ON) {
            this.heartbeatCheck.heartbeat();
        }
    }

    _connect() {
        if (this.connection) {
            if (this.connection.status != ConnectionStatus.CLOSED) {
                this.connection.close();
            }
        }
        this.connectStatusSubject.next(ConnectStatus.CONNECTING);
        let connection = this.connection = new WebSocketConnection(this.url);
        this.connection.connect();
        let closeTrigger = false;
        this.connection.statusObservable.subscribe((status: ConnectionStatus) => {
            if (connection != this.connection) {
                return;
            }
            switch (status) {
                case ConnectionStatus.OPEN: {
                    this.connectStatus = ConnectStatus.ON;
                    //心跳开始
                    this.heartbeatCheck.start();
                    this.heartbeatCheck.heartbeat();
                    if (this.reconnecting) {
                        this.onreconnect();
                    }
                } break;
                case ConnectionStatus.CLOSED: {

                    if (!closeTrigger) {
                        closeTrigger = true;
                        this.connectStatus = ConnectStatus.OFF;
                        //关闭心跳
                        this.heartbeatCheck.close();
                        //重连
                        //是否跳过
                        if (!this.reconnecting) {
                            this.backoff.reset();
                        }
                        if (!this.skipReconnect) {
                            this.reconnect();
                        }

                    } else {
                        console.log("close Trigger retry");
                        return;
                    }
                } break;
            }
            this.connectStatusSubject.next(this.connectStatus);
        });
        this.auth.next(false);
        this.connection.on = (response: RCResponse) => {
            if (connection != this.connection) {
                return;
            }
            const data = response.data;
            switch (response.command) {

                case Command.LOGIN: {
                    this.auth.next(true);
                    this.loginNotice.next(data);
                } break;

                case Command.MSG_NOTIFY: {
                    this.msgNotify.next(data as Message);
                } break;

                case Command.PLAN_NOTIFY: {
                    this.planNotify.next(data as PlanReference);
                } break;
            }
            this.on.next(response);
        };
    }

    reconnect() {
        //避免reconnect重复执行
        if (!this.url) {
            throw new Error('URL is empty');
        }
        if (this.connectStatus == ConnectStatus.CONNECTING) {
            //连接中 则跳过。
            return;
        }
        if (this.skipReconnect) {
            return;
        }
        this.reconnecting = true;
        let time = this.backoff.duration();
        console.warn("will wait %dms before reconnect attempt", time);
        let timeoutId = setTimeout(() => {
            if (this.skipReconnect) {
                return;
            }
            this._connect();
        }, time);

    }
    onreconnect() {
        let attempts = this.backoff.attempts;
        this.reconnecting = false;
        this.backoff.reset();
        //重连上了
        console.log("reconnect attempts %d", attempts);
    }

    close() {
        this.skipReconnect = true;
        if (this.connection) {
            this.connection.close();
        }
    }


    offline() {
        if (this.connection) {
            this.connection.close();
            //舍弃旧的连接 直接重连
            this.connection = null;
            // this.connection.statusO
            this._connect();
        }
    }

    // login(
    //     type: string,
    //     user: string,
    //     sign: string
    // ) {
    //     this.sendData(Command.LOGIN);
    // }

    //加入房间
    joinRoom(
        roomNo: string,
        secretKey?: string
    ) {
        this.sendData(Command.JOIN_ROOM, {
            roomNo,
            secretKey
        })
    }

    sendData(command: Command, data?: any) {
        this.heartbeatCheck.reset();
        // if (typeof data !== 'string') {
        //     data = JSON.stringify(data);
        // }
        let rcMessage: RCMessage = new RCMessage(command, null, data);

        this.connection.send(JSON.stringify(rcMessage));
    }


    // generateClientId(): number {
    //     function pad(num: string, n : number) : string {
    //         let len = num.length;
    //         while(len < n) {
    //             num = "0" + num;
    //             len++;
    //         }
    //         return num;
    //     }
    //
    //     function genClientMsgId() : number{
    //         let id = (new Date().getTime() << 4).toString();
    //         id = id + pad(Math.floor(Math.random()*9999).toString(), 4);
    //         return parseInt(id);
    //     }
    //     return genClientMsgId();
    // }
    send(
        msg: Message
    ) {
        this.sendData(Command.SEND, msg);
    }


    //观察者模式


    testNotice: Subject<String>;

    loginNotice: Subject<any>;
    //监听新消息
    msgNotify: Subject<Message>;

    //plan
    planNotify: Subject<PlanReference>;

    //监听群资料
    groupInfoChangeNotify: any;
    //监听群系统消息
    groupSystemNotify: Subject<any>;
    //监听资料系统(自己或好友)通知事件
    profileSystemNotify: Subject<any>



}
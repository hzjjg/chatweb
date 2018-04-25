

//https://cloud.tencent.com/document/product/269/1598
//会话服务
import { Injectable } from "@angular/core";
import { SessionType } from "../im/session/session-type";
import { Subject } from "rxjs/Subject";
import { IMService, Session, Message } from "../im/index";
import { ChatService, ChatInfo } from "./chat.service";
import { UserService } from "../user/user.service";
import { MsgType, TipType } from "../im/const";
import { GroupQuitTipMessage, GroupTipMessage } from "../im/msg/message";
import { AudioService, AudioType } from "../system/audio.service";
@Injectable()
export class ChatSessionService {

    private sessions: ChatSession[];
    sessionSubject: Subject<void>;

    constructor(
        private im: IMService,
        private chatService: ChatService,
        private userService: UserService,
        private audioService: AudioService
    ) {
        this.sessionSubject = new Subject<void>();
        this.sessions = [];

        // this.chatService.sessionTypeSubject.subscribe((chatInfo: ChatInfo) => {
        // this.chatInfo = chatInfo;
        // this.clearSomeBodyTip(chatInfo.chatWith);
        // this.launchMessageTip();
        // })

        this.im.msgNotify.subscribe((msg: Message) => {
            if (msg.msgType == MsgType.GROUP_TIP) {
                //团提示消息
                if ((<GroupTipMessage>msg).tipType == TipType.QUIT) {
                    // this.clearSomeBodyTip(()
                    this.cleanSession(SessionType.C2C, (<GroupQuitTipMessage>msg).userId.toString());
                    this.sessionSubject.next();

                    // this.launchMessageTip();
                } else {
                    return;
                }
            }

            if (msg.from == <any>this.userService.user.getValue().userId) {
                //自己的消息
                return;
            }


            if (msg.type == SessionType.C2C) {
                let session: ChatSession = this.createSession(SessionType.C2C, msg.from);
                session.time = msg.time;
                session.seq = msg.msgId
                let chatInfo = this.chatService.sessionTypeSubject.getValue();
                if (chatInfo && chatInfo.chatWith && chatInfo.chatWith == msg.from) {
                } else {
                    session.unread++;
                }
                this.audioService.notice(AudioType.NEW_C2C_MSG)
                this.sessionSubject.next();
                // this.addMessageTip(msg.from);
                // this.launchMessageTip();
            } else {
                //群聊消息
                // this.addMessageTip(msg.from, 0);
                // this.launchMessageTip();
                return;
            }

            // if (this.chatInfo.chatWith && this.chatInfo.chatWith == msg.from) {
            //     //正在与他聊天
            //     this.clearSomeBodyTip(msg.from)
            //     this.launchMessageTip();
            // }


        })

    }

    getSessions(): ChatSession[] {
        return this.sessions;
    }

    sessionBy(type: SessionType, id: string) {
        return this.sessions.find((session) => {
            return session.type == type &&
                session.id == id;
        });
    }

    cleanSession(type: SessionType, id: string) {
        let index = this.sessions.findIndex((session) => {
            return (session.type == type &&
                session.id == id);
        });
        if (!index) {
            this.sessions.splice(index, 1);
        }
    }

    createSession(type: SessionType, id: string) {
        let session = this.sessionBy(type, id);
        if (!session) {
            console.log("create");
            session = new ChatSession(type, id);
            this.sessions.push(session);
        }
        return session

    }

}


//最新
export class ChatSession {
    type: SessionType; //会话类型
    id: string;  //当群是为ID  当私聊时为用户ID
    time: number; //最新消息的时间戳
    seq: string;  //当前最新消息ID

    unread: number; //未读消息数



    constructor(type: SessionType, id: string) {
        this.type = type;
        this.id = id;
        this.unread = 0;
    }
}
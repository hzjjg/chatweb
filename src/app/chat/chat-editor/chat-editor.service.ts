import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ModalService } from "../../rui";
import { IMService, TextMessage, SessionType } from "../../im";
import { ImageMessage, Message, RedPacketMessage } from "../../im/msg/message";
import { MsgType } from "../../im/const";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class ChatEditorService {
    private content: any;
    editing = new BehaviorSubject<boolean>(false);

    constructor(
        private im: IMService,
        private modalService: ModalService
    ) { }

    //这类操作应该放在Session 会话上，更简介
    createMessage(options: any): Message {
        //会话来源判断
        let message: Message = null;
        switch (options.msgType) {
            case MsgType.IMAGE: {
                let mediaUri = options.mediaUri;
                message = new ImageMessage(mediaUri);
                break;
            }
            case MsgType.TEXT: {
                let content = options.content;

                content = content.replace(/<(?:img|IMG).*?text="(.*?)".*?>/g, (_: string, text: string) => {
                    return `[${text}]`;
                });

                message = new TextMessage(content);

                //原始内容
                //发送内容

                //编码
                break;
            }
            case MsgType.RED_PACKET: {
                let packetId = options.packetId,
                    token = options.token;
                message = new RedPacketMessage(packetId, token);

                break;
            }
            default: {
                throw "错误的msgType: " + options.msgType;
            }
        }

        message.type = options.type || SessionType.GROUP;
        options.to && (message.to = options.to);
        
        // message.clientMsgId
        // message.msgId
        //crateTime
        //状态，Ready
        return message;

    }

    send(message: Message) {
        this.im.send(message);
    }

    private contentParser() {

    }

    //TODO
    selectExpression(expression: any) {
    }


}
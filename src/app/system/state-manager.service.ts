import { Injectable } from "@angular/core";
import { headersToString } from "selenium-webdriver/http";
/**
 * 状态管理
 * 参考StateManagerService
 */

@Injectable()
export class StateManagerService {
    state = {
        "sender:hasText": false,
        "sender:active": false,
        // ""
        "dialog:open": false,

        'redPacket:hasNew': false,
    };

    helper = {
        canPasteFile: (): boolean => {
            return !this.state["dialog:open"];
        }
    };

    canDo(event: string): boolean {
        return this.helper[event];
    }

    on(event: string) {
        this.state[event] = true;
    }
    
    off(event: string) {
        this.state[event] = false;
    }
    //帮助

}

export enum States {
    RED_PACKET_HAS_NEW = 'redPacket:hasNew',
}
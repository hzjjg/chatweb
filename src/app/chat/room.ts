import { RoomFunction } from "./room-function";
import { RoomMenu } from "./room-menu";
import { RoomContact } from "./room-contact";
import { Extension } from "./room-extension";
export class Room {
    name: string;
    roomNo: string;
    secret: boolean;
    icon: string;
    logo: string;
    logoHref?: string;

    corp: string;
    // status: ChatRoomStatus;
    // notice: string;
    notices: ChatNotice[];
    banner?: string;
    bannerHref?: string;

    functions: RoomFunction[];
    menus: RoomMenu[];
    contacts: RoomContact[];
    extensions: Extension[];
    registerOpts: RegisterOpts;
    drawmoneyOpts: DrawmoneyOpts;
    chatOpts: ChatOpts;
    guide?: string;
    visitorWarn?: string;
    visitorWarnTimeout?: number;
}

export class ChatOpts {
    enableVisitorSpeech?: boolean;
    enableOnlyStaffSpeech?: boolean;
}

export class DrawmoneyOpts {
    enablePhone?:boolean;
    minMoney?: number;
}

export class RegisterOpts {
    enableName?: boolean;
    enableQQ?:boolean;
    enableWeChat?:boolean;
    enablePhone?:boolean;
}

export class ChatNotice {
    content: string;
    order: number;
    releaseTime: number
}
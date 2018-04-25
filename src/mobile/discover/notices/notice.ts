import {ChatNotice} from "../../../app/chat/room";

export abstract class Notice {
    name: string;
    content?: string;
    type: string;
    notices?: ChatNotice[];
}
import { Injectable } from "@angular/core";
import {Extension} from "../../../app/chat/room-extension";
import {RoomService} from "../../../app/chat/room.service";
import {Room} from "../../../app/chat/room";

@Injectable()
export class ExtensionService {
    private extensions: Extension[];

    constructor(
        private roomService: RoomService
    ) {
        this.roomService.room.subscribe((room: Room) => {
            this.extensions = room.extensions;
        })
    }
}
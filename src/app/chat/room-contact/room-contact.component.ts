import { Component } from "@angular/core";
import {RoomContact, RoomContactType} from "../room-contact";
import {RoomService} from "../room.service";
import {Room} from "../room";

@Component({
    selector: 'room-contact',
    templateUrl: 'room-contact.component.html',
    styleUrls: ['room-contact.component.scss']
})

export class RoomContactComponent {
    roomContacts: RoomContact[];
    roomContactType: RoomContactType;

    constructor(
        private roomService: RoomService
    ) {

    }

    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            this.roomContacts = room.contacts;
        });
        this.roomContactType = new RoomContactType();
    }
}
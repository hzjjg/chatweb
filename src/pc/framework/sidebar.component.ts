import { Component, OnInit } from "@angular/core";
import {RoomService} from "../../app/chat/room.service";
import {Room} from "../../app/chat/room";
import {RoomMenu} from "../../app/chat/room-menu";
import {environment} from "../../environments/environment";
import {RoomContact, RoomContactType} from "../../app/chat/room-contact";

@Component({
    selector: 'framework-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.scss'],
    host: {
        'class': 'framework-sidebar'
    }
})
export class SidebarComponent implements OnInit {
    menus: RoomMenu[] = [];
    sideLogo: string;

    roomContact: RoomContact[];
    roomContactType: RoomContactType;
    get url() {
        let roomNo = (<any>window).ROOM_NO;
        // let url = `/rooms/${roomNo}/url`;
        let url = `/url`;

        if (!environment.production) {
            return `/proxy${url}`;
        }
        return url;
    }
    constructor(
        private roomService: RoomService
    ) {
        this.roomService.room.subscribe((room: Room) => {
            if (room) {
                this.menus = room.menus;
            }
        })
    }

    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            this.roomContact = room.contacts;
        });
        this.roomContactType = new RoomContactType();
    }
}
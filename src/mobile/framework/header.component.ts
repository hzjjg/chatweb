import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { ModalRef, ModalService } from "../../app/rui";
import { LoginComponent } from "../../app/user/login.component";
import { RegisterComponent } from "../../app/user/register.component";
import { UserService } from "../../app/user/user.service";
import { UserInfo } from "../../app/user/user-info";
import { RoomService } from "../../app/chat/room.service";
import { Room } from "../../app/chat/room";

@Component({
    selector: 'framework-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    // host: {
    //     'class': 'framework-header clearfix'
    // }
})
export class HeaderComponent implements OnInit {
    constructor(
        private modalService: ModalService,
        private userService: UserService,
        private renderer: Renderer2,
        private router: Router,
        private roomService: RoomService
    ) {
    }

    loginModalRef: ModalRef;
    registerModalRef: ModalRef;
    user: UserInfo;
    roomName: string;
    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            if (room) {
                this.roomName = room.name;
            }
        })
        // this.userService.user.subscribe((user) => {
        //     this.user = user;
        // })
    }

    // public openLogin() {


    //     this.router.navigate['login']
    //     // this.loginModalRef = this.modalService.open(LoginComponent);
    // }

    // public openRegister() {
    //     this.router.navigate['register']
    //     // this.registerModalRef = this.modalService.open(RegisterComponent);
    // }
}
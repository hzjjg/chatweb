import {Component, OnInit, Renderer2, TemplateRef, ViewChild} from "@angular/core";
import {ModalRef, ModalService} from "../../app/rui";
import {LoginComponent} from "../../app/user/login.component";
import {RegisterComponent} from "../../app/user/register.component";
import {UserService} from "../../app/user/user.service";
import {UserInfo} from "../../app/user/user-info";
import {Room} from "../../app/chat/room";
import {RoomService} from "../../app/chat/room.service";

@Component({
    selector: 'framework-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    host: {
        'class': 'framework-header clearfix'
    }
})
export class HeaderComponent implements OnInit {
    constructor(
        private modalService: ModalService,
        private userService: UserService,
        private roomService: RoomService,
        private renderer: Renderer2
    ) {

    }

    loginModalRef: ModalRef;
    registerModalRef: ModalRef;
    user: UserInfo;
    room: Room;
    styles: any;
    ngOnInit() {
       this.roomService.room.subscribe((data: Room) => {
           this.room = data;
           if(data.banner) {
               this.styles = {
                   'background-image': 'url(' + data.banner + ')'
               }
           }
        });
        this.userService.user.subscribe((user) => {
            this.user = user;
        })
    }

    // logoLink() {
    //     if(!this.room.logoHref) {
    //         return;
    //     }
    //     window.open(this.room.logoHref);
    // }

    openLogoHref(event: any) {
        event.stopPropagation();
        if(!this.room.logoHref) {
            return;
        }
        window.open(this.room.logoHref);
    }
    openBannerHref() {
        if(!this.room.bannerHref) {
            return;
        }
        window.open(this.room.bannerHref);
    }

}
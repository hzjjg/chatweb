import { Component, OnInit } from '@angular/core';
import { NoticesService } from './notices.service';
import { Notice } from './notice';
import { Router, ActivatedRoute } from '@angular/router';
import {RoomService} from "../../../app/chat/room.service";
import {Extension} from "../../../app/chat/room-extension";
import {ChatNotice, Room} from "../../../app/chat/room";

@Component({
    selector: 'discover-notices',
    templateUrl: 'notices.component.html',
    styleUrls: ['notice.component.scss']
})

export class NoticesComponent implements OnInit {
    notices: ChatNotice[];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private roomService: RoomService
    ) {

    }

    ngOnInit() {

        // this.notices = [
        //     {
        //         order: 3,
        //         text: "幸运彩票于2009年成立，专业经营各项彩票业务，现已推出高频彩票现金投注网，主营北京赛车PK10、幸…免费自助注册开户， 现金投注。我们拥有稳定的平台，成熟的玩法，简单的下注流程、以及优质的客户服务。",
        //         releaseTime: 1513180800000
        //     },
        //     {
        //         order: 2,
        //         text: '幸运彩票于2009年成立，专业经营各项彩票业务，现已推出高频彩票现金投注网',
        //         releaseTime: 1513353600000
        //     }
        // ];

        this.roomService.room.subscribe((room: Room) => {
            this.notices = room.notices;
        })

    }

    navBack() {
        this.router.navigate(['/discover']);
    }
}
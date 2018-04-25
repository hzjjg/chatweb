import {
    AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2,
    ViewChild, ViewChildren
} from "@angular/core";
import { ActivatedRoute, ParamMap ,Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Subject, Observable } from "rxjs";

import { RoomFunction } from "../../app/chat/room-function";
import { RoomService } from "../../app/chat/room.service";
import { Room } from "../../app/chat/room";
import { DomSanitizer } from "@angular/platform-browser";
import {Extension} from "../../app/chat/room-extension";

/**
 * 最好iframe出去
 */
@Component({
    selector: 'discover',
    templateUrl: 'discover.component.html',
    styleUrls: ['discover.component.scss'],
    host: {
        'class': 'framework-functional'
    }
})
export class DiscoverComponent implements OnInit, AfterViewInit {
    functions: RoomFunction[] = [];
    active: number = 0;
    extensions: Extension[] = [];

    constructor(
        private sanitizer: DomSanitizer,
        private roomService: RoomService,
        private renderer: Renderer2,
        private router:Router
    ) {
        
    }

    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            if (room) {
                let supports = ['iframe'];

                this.functions = (room.functions || []).filter(function(func) {
                    return func.support && ~func.support.indexOf('mobile');
                });
                this.extensions = room.extensions;
            }
        });
    }

    ngAfterViewInit() {
    }

}
import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import { ExtensionService } from "./extension.service";
import { ActivatedRoute, Router } from "@angular/router";
import { RoomService } from "../../../app/chat/room.service";
import { Room } from "../../../app/chat/room";
import { Extension } from "../../../app/chat/room-extension";

@Component({
    selector: 'extension',
    templateUrl: 'extension.component.html',
    styleUrls: ['../notices/notice.component.scss']
})

export class ExtensionComponent {
    extensionName: string;
    extension: Extension;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private roomService: RoomService,
        private sanitized: DomSanitizer
    ) {
        this.route.params.subscribe((data) => {
            this.extensionName = data.type;
        })
    }

    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            this.extension = (room.extensions || []).find((extension) => {
                return this.extensionName == extension.name;
            });

            this.extension.description = this.sanitized.bypassSecurityTrustHtml(this.extension.description);
        })
    }

    navBack() {
        this.router.navigate(['/discover']);
    }
}
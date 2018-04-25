import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService, Room } from '../../../app/chat/index';
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { FunctionalService } from './functional.service';


@Component({
    selector: 'discover-functional',
    templateUrl: 'functional.component.html',
    styleUrls:['functional.component.scss'],
    providers:[FunctionalService]
})

export class FunctionalComponent implements OnInit {
    function: any;
    functions: any[];
    functionName: string;
    constructor(
        private route: ActivatedRoute,
        private roomService: RoomService,
        private sanitizer: DomSanitizer,
        private router:Router
    ) {
        this.route.params.subscribe((data) => {
            this.functionName = data.name;
        })
    }

    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            if (room) {
                this.functions = (room.functions || []).map((func) => {
                    switch (func.type) {
                        case 'embed':
                        case 'iframe': {
                            return Object.assign({}, func, {
                                src: this.sanitizer.bypassSecurityTrustResourceUrl(func.src || 'https://www.test.com/')
                            })
                        }
                        case 'flash': {
                            return Object.assign({}, func, {
                                src: this.sanitizer.bypassSecurityTrustResourceUrl(func.src || 'https://www.test.com/'),
                                width: 380,
                                height: 244
                            })
                        }
                        default: return func;
                    }
                });

                this.function = this.functions.find((fun) => {
                    return this.functionName == fun.name
                })

                return this.function;
            }
        });

    }

    navBack(){
        // this.router.navigate(['../'], { relativeTo: this.route });
        this.router.navigate(['/discover']);
    }
}
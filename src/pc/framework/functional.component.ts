import {
    AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit,
    QueryList, Renderer2,
    ViewChild, ViewChildren
} from "@angular/core";
import { RoomFunction } from "../../app/chat/room-function";
import { RoomService } from "../../app/chat/room.service";
import { Room } from "../../app/chat/room";
import { DomSanitizer } from "@angular/platform-browser";
import { NoticeList } from "./notice-list";
import { Extension } from "../../app/chat/room-extension";


/**
 * 最好iframe出去
 */
@Component({
    selector: 'framework-functional',
    templateUrl: 'functional.component.html',
    styleUrls: ['functional.component.scss'],
    host: {
        'class': 'framework-functional'
    },
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FunctionalComponent implements OnInit, AfterViewInit {
    functions: RoomFunction[] = [];
    extensions: Extension[] = [];
    active: number;
    noticeActive: number = 0;
    notices: NoticeList[] = [];
    isFunctionFull: boolean;

    @ViewChildren('noticeContent') noticeContentList: QueryList<any>;

    private noticeContentRefs: ElementRef[];
    private timer: any;

    showMoreNav: boolean = false;

    constructor(
        private sanitizer: DomSanitizer,
        private roomService: RoomService,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private sanitized: DomSanitizer
    ) {
    }

    showMoreNavTabs() {
        this.showMoreNav = !this.showMoreNav;
    }

    ngOnInit() {
        this.roomService.room.subscribe((room: Room) => {
            if (room) {
                this.extensions = room.extensions.map((extension) => {
                    extension.description = this.sanitized.bypassSecurityTrustHtml(extension.description);
                    return extension;
                });
                if (this.extensions && this.extensions.length > 0) {
                    setTimeout(() => {
                        this.extensionScroll();
                    })
                }
                const functions = (room.functions || []).map((func) => {
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

                this.functions = (functions || []).filter((item) => {
                    return item.support && ~item.support.indexOf('pc');
                });

                this.switchFunction(0, this.functions[0] && this.functions[0].full);
            }
        });

        // (<any>window).openLotteryIframe = function(){
        // }

        // let scrollTop = 1;
        // this.timer = setInterval(() => {
        //     scrollTop++;
        //     // this.scrollNoticeContent(scrollTop);
        // }, 1000)

        // this.scrollNoticeContent(100);
    }

    ngAfterViewInit() {
        // this.noticeContentRefs = this.noticeContentList.map((noticeContentRef: ElementRef) => {
        //     let noticeContentEle = noticeContentRef.nativeElement;
        //     this.renderer.listen(noticeContentEle, 'mouseover', () => {
        //         if (this.timer) {
        //             clearInterval(this.timer);
        //         }
        //     });
        //     this.renderer.listen(noticeContentEle, 'mouseleave', () => {
        //         this.scrollNoticeContent(noticeContentRef, noticeContentEle.scrollTop);
        //     })
        //     return noticeContentRef;
        // })
        // this.scrollNoticeContent(this.noticeContentRefs[0], 0);

        // this.switchNotice(0);
    }

    switchFunction(index: number, isFull: boolean) {
        this.active = index;
        this.isFunctionFull = isFull;
    }

    extensionScroll() {
        this.noticeContentRefs = this.noticeContentList.map((noticeContentRef: ElementRef) => {
            let noticeContentEle = noticeContentRef.nativeElement;
            this.renderer.listen(noticeContentEle, 'mouseover', () => {
                if (this.timer) {
                    clearInterval(this.timer);
                }
            });
            this.renderer.listen(noticeContentEle, 'mouseleave', () => {
                this.scrollNoticeContent(noticeContentRef, noticeContentEle.scrollTop);
            });
            return noticeContentRef;
        });
        this.scrollNoticeContent(this.noticeContentRefs[0], 0);
    }

    switchNotice(index: number) {
        this.noticeActive = index;
        setTimeout(() => {
            clearInterval(this.timer);
            this.scrollNoticeContent(this.noticeContentRefs[index], 0);
        });
    }

    scrollNoticeContent(contentRef: ElementRef, distance: number) {
        let container = contentRef.nativeElement;
        let scrollHeight = container.scrollHeight;
        if (container.clientHeight < scrollHeight) {
            let endTop: number = scrollHeight - container.clientHeight;
            let speed = 0.3;
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.ngZone.runOutsideAngular(() => {
                //跳出检查
                this.timer = setInterval(() => {
                    distance += speed;
                    if (distance > endTop) {
                        distance = 0
                    }
                    container.scrollTop = distance;
                }, 17);
            });

        }
    }
}
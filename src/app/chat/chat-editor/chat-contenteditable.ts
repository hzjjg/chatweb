

import {
    Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2,
    SimpleChanges
} from "@angular/core";
import { ToastService } from "../../../rui/packages/toast/toast.service";

@Directive({
    selector: '[chatcontenteditable]',
})
export class ChatContentEditable implements OnInit {

    pasteLimit: number = 1;
    pasteResetTime: number = 200;
    @Input("chatcontenteditable")
    set content(html: string) {
        if (this.content != html) {

            this.elementRef.nativeElement.innerHTML = html;
        }
    }

    get content() {
        return this.elementRef.nativeElement.innerHTML;
    }

    @Output("contentEditChange")
    private contentChangeEmitter: EventEmitter<string> = new EventEmitter();
    @Output("paste")
    private pasteEmitter: EventEmitter<ClipboardEvent> = new EventEmitter();
    // private pasteTimeout: any;

    constructor(
        protected elementRef: ElementRef,
        private renderer: Renderer2,
    ) {

    }
    ngOnInit() {
        // paste处理
        //$.browser.msie?"beforepaste":"paste",
        let paseNumber = 0,
            timeoutId: any = null;
        this.renderer.listen(this.elementRef.nativeElement, 'paste', (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.types.length > 0) {
                if (paseNumber > this.pasteLimit) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                } else {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(() => {
                        paseNumber = 0;
                    }, this.pasteResetTime);
                    // console.log(e, e.clipboardData.types.length > 0);
                    // this.pasteEmitter.emit(e);
                }
            } else {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });


        //keyup paste
        //input
        //2者可做兼容判断
        this.renderer.listen(this.elementRef.nativeElement, 'paste', (e: any) => {
            setTimeout(() => {
                let html = this.elementRef.nativeElement.innerHTML;
                this.contentChangeEmitter.emit(html);
            }, 50);
            
        })

        this.renderer.listen(this.elementRef.nativeElement, 'keyup', (e: any) => {
            let html = this.elementRef.nativeElement.innerHTML;
            this.contentChangeEmitter.emit(html);
        })


    }

}
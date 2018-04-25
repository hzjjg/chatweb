import { Component, ElementRef, HostBinding, OnInit, Renderer2 } from "@angular/core";
import { ToastService } from "./toast.service";
import { CLASS_NAME, TRANSITION_DURATIONS } from "./toast-options";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import * as Icons from "./icons"
import { Utils } from "../shared/utils";
import { environment } from "../../../environments/environment";
@Component({
    templateUrl: 'toast.component.html',
    host: {
        'class': 'toast-container',
    }
})
export class ToastComponent implements OnInit {

    type: string = 'info';

    duration: number = 3000;
    timer: any;

    animate: boolean = true;
    shown: boolean;
    hiding: boolean = false;
    isMobile = environment.app == 'mobile'    


    public level: number;
    private _position: string;

    constructor(
        private sanitizer: DomSanitizer,
        protected elementRef: ElementRef,
        private renderer: Renderer2,
        private toastService: ToastService
    ) {
        this.position = 'top';
    };
    set position(value: string) {
        if (this._position != value) {
            if (this._position) {
                this.renderer.removeClass(
                    this.elementRef.nativeElement,
                    'is-' + this._position
                )
            }

            this._position = value;
            this.renderer.addClass(
                this.elementRef.nativeElement,
                'is-' + this.position
            );
        }
    }
    get position() {
        return this._position;
    }

    ngOnInit() {
        if (this.animate) {
            this.renderer.addClass(
                this.elementRef.nativeElement,
                CLASS_NAME.FADE
            );
            ///渲染等下要动画了
            Utils.reflow(this.elementRef.nativeElement);
        }

        this.renderer.addClass(
            this.elementRef.nativeElement,
            CLASS_NAME.SHOW
        );

        const animateDuration = this.animate ? TRANSITION_DURATIONS.TOAST : 0;
        setTimeout(() => {
            this.shown = true;
            this.timer = setTimeout(() => {
                this.close();
            }, Math.max(this.duration - animateDuration, 0));
        }, animateDuration);


    }

    makeLink(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(Icons[this.type])
    }

    // show(message: string): void {
    //     // this.obj = obj;
    //     // this.showToast = true;
    //     // this.timer = setTimeout(() => {
    //     //     this.cancel();
    //     // }, this.duration)
    // }
    // cancel():void {
    // this.showToast = false;
    // this.timer && clearTimeout(this.timer);
    // this.onDestroy()
    // }

    toastClick(e:Event){
        e.preventDefault();
        this.close();
    }

    close(): void {
        if (this.hiding || !this.shown) {
            return;
        }
        this.hiding = true;
        this.renderer.removeClass(
            this.elementRef.nativeElement,
            CLASS_NAME.IN
        );
        setTimeout(() => {
            this.shown = false;
            // 当前是否需移除modal-open
            // this.modalService
            this.toastService.close(this.level);
            // service hide
            //
            this.hiding = false;
        }, this.animate ? TRANSITION_DURATIONS.TOAST : 0)
    }
}




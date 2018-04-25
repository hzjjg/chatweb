import { Component, ElementRef, HostBinding, OnInit, Renderer2 } from "@angular/core";

import { NoticeService } from "./notice.service";
import { Utils } from "../shared/utils";

@Component({
    templateUrl: 'notice.component.html',
    styleUrls: ['./notice.component.scss']
})

export class NoticeComponent implements OnInit {
    level: number
    animateDuration: number = 300
    // position: string    //位置

    duration: number = 5000
    animate: string     //动画类型
    title: string
    footer: string
    iconClass: string
    customClass: string

    shown: boolean
    hiding: boolean = false
    private timer: any

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private noticeService: NoticeService
    ) { }

    ngOnInit() {
        //TODO 根据动画类型增加类名
        this.renderer.addClass(
            this.elementRef.nativeElement,
            'fade'
        );

        ///渲染等下要动画了
        Utils.reflow(this.elementRef.nativeElement);
        this.renderer.addClass(
            this.elementRef.nativeElement,
            'show'
        );


        setTimeout(() => {
            this.shown = true;
        }, this.animateDuration);

        setTimeout(() => {
            this.timer = setTimeout(() => {
                this.close();
            }, Math.max(this.duration || 3000, 0));
        });

    }

    updatePosition(lineLength: number) {
        let pos = lineLength - this.level;
        //TODO 根据position计算位置 & 自动计算高度
        this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translate(0, ${-80 * pos}px)`)
    }

    clickNotice(e: Event) {
        // e.preventDefault();
        // this.close();
    }

    close(): void {
        if (this.hiding || !this.shown) {
            return;
        }
        this.hiding = true;
        this.renderer.removeClass(
            this.elementRef.nativeElement,
            'show'
        );
        setTimeout(() => {
            this.shown = false;
            // 当前是否需移除modal-open
            // this.modalService
            this.noticeService.close(this.level);
            // service hide
            //
            this.hiding = false;
        }, 300)
    }
}
import {Directive, ElementRef, Inject, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from "@angular/core";
import {DOCUMENT} from "@angular/common";
// import { DocumentWrapper } from "../shared/dynamic.service";

/**
 * 参考: https://github.com/eleme/element-angular/blob/master/src/loading/loading.directive.ts
 */ 
@Directive({ 
    selector: '[trip-loading]',
})
export class LoadingDirective implements OnInit, OnChanges {
    @Input() text: string
    // @Input() lock: boolean = false  //// ban scroll on loading active 注意
    @Input('custom-class') customClass: string
    @Input('full-screen') fullScreen: boolean = false
    @Input("trip-loading") showLoading: boolean = false

    cacheElement: HTMLElement
    // cacheOverflow: string

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        // private document: DocumentWrapper,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    ngOnInit(): void {
        //if (this.lock) {
           // this.cacheOverflow = this.window.getComputedStyle(this.document.body).overflow
        //}
        this.cacheElement = this.renderer.createElement('div');
        this.cacheElement.innerHTML = this.makeHtml();
        const parentElement = this.fullScreen ? this.document.body : this.el.nativeElement;

        if (!this.fullScreen) {
            this.renderer.setStyle(this.el.nativeElement, 'position', 'relation');
        }
        
        this.renderer.appendChild(parentElement, this.cacheElement);
    }



    ngOnChanges(changes: SimpleChanges): void {
        if (changes.showLoading && this.cacheElement) {
            this.cacheElement.innerHTML = this.makeHtml()
        }
    }

    //可能需待优化的
    makeHtml(): string {
       return `
            <div class="trip-loading-mask ${this.customClass} ${this.fullScreen ? ' is-fullscreen' : ''}"
                style="display: ${this.showLoading ? 'block': 'none'}">
                <div class="trip-loading-spinner">
                  <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none"/>
                  </svg>
                  <p class="trip-loading-text" style="display: ${this.text ? 'block': 'none'}">
                    ${this.text}
                  </p>
                </div>
            </div>
       `
    }


}
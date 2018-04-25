import {
    Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ElementRef,
    Directive
} from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

/**
 * 参考 https://github.com/eleme/element-angular/blob/master/src/button/button.ts
 * 参考directive 推荐写法my-button
 */
@Component({
    selector: '[trip-button]',
    template: `
        <i class="trip-icon-loading" *ngIf="loading"></i>
        <!--图标-->
        <ng-content></ng-content>
    `,
    host: {
        "[class]": "'btn ' + customClass + (themeType ? ' btn-' + themeType : '')",
        // "[class.disabled]": "disabled",
        // "[class.loading]": "loading",
        // "[class.plain]": "plain",
        // "[disabled]": "disabled",
        // "[type]": "nativeType",
        // "[style]": "extendStyles()",
        // "[autofocus]": "autofocus"
    }
})
export class ButtonDirective implements OnInit {
    @Input('theme') themeType: string = ''
    @Input('native-type') nativeType: string = 'button'
    @Input() size: string = ''
    @Input() icon: string = ''
    // @Input() disabled: string = ''
    @Input() loading: string = ''
    // @Input() plain: string = ''
    // @Input() autofocus: string = ''
    @Input('custom-class') customClass: string = ''
    // @Output() mclick: EventEmitter<any> = new EventEmitter<any>()

    constructor(
        private el: ElementRef,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit(): void {
        //     removeNgTag(this.el.nativeElement)
    }

    // clickHandle($event: Event): void {
    //     this.click.emit($event)
    // }

    // get extend(): SafeStyle {
    //     return this.sanitizer.bypassSecurityTrustStyle(this.style)
    // }
    // extendStyles(): SafeStyle {
    //     return this.sanitizer.bypassSecurityTrustStyle(this.style)
    // }

}
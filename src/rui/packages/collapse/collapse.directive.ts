import {
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    Renderer2
} from '@angular/core';

@Directive({
    selector: '[collapse]',
    exportAs: 'collapse', //供使用  #panel="collapsible"   pannel.collapseds
    host: {
        '[class.collapse]': 'true'
    }
})
export class CollapseDirective {
    @Output() collapsed: EventEmitter<any> = new EventEmitter();
    @Output() expanded: EventEmitter<any> = new EventEmitter();

    @HostBinding('style.display') display: string;
    // shown
    // @HostBinding('class.in')
    @HostBinding('class.show')
    // @HostBinding('attr.aria-expanded')
    isExpanded = true;
    // stale state
    @HostBinding('class.collapse') isCollapse = true;
    // animation state
    @HostBinding('class.collapsing') isCollapsing = false;

    /** A flag indicating visibility of content (shown or hidden) */
    @Input()
    set collapse(value: boolean) {
        this.isExpanded = value;
        this.toggle();
    }

    get collapse(): boolean {
        return this.isExpanded;
    }

    constructor(private _el: ElementRef, private _renderer: Renderer2) {
    }

    /** allows to manually toggle content visibility */
    toggle(): void {
        if (this.isExpanded) {
            this.hide();
        } else {
            this.show();
        }
    }

    /** allows to manually hide content */
    hide(): void {
        this.isCollapse = false;
        this.isCollapsing = true;

        this.isExpanded = false;

        this.isCollapse = true;
        this.isCollapsing = false;

        this.display = 'none';
        this.collapsed.emit(this);
    }

    /** allows to manually show collapsed content */
    show(): void {
        this.isCollapse = false;
        this.isCollapsing = true;

        this.isExpanded = true;

        this.display = 'block';
        // this.height = 'auto';
        this.isCollapse = true;
        this.isCollapsing = false;
        this._renderer.setStyle(
            this._el.nativeElement,
            'overflow',
            'visible'
        );
        this._renderer.setStyle(this._el.nativeElement, 'height', 'auto');
        this.expanded.emit(this);
    }
}
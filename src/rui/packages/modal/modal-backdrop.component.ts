import {Component, ElementRef, OnInit, Renderer2} from "@angular/core";
import {Utils} from "../shared/utils";

@Component({
    selector: 'modal-backdrop',
    template: ' ',
    host: { 'class' : 'modal-backdrop' }
})
export class ModalBackdropComponent implements OnInit {
    _shown: boolean;

    get isShown(): boolean {
        return this._shown;
    }
    set shown(value: boolean){
        this.renderer[value ? 'addClass':'removeClass'](
            this.elementRef.nativeElement,
            'show'
        );
    }

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2) {
    }


    ngOnInit() {
        this.renderer.addClass(
            this.elementRef.nativeElement,
            'fade'
        );
        Utils.reflow(this.elementRef.nativeElement);
        this.shown = true;
    }
}
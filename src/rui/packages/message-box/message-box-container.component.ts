import {Component, ElementRef, OnInit, Renderer2} from "@angular/core";
import {ModalContainerComponent} from "../modal/modal-container.component";
import {ModalService} from "../modal/modal.service";

@Component({
    selector: 'message-box-container',
    template: `
        <!--<div [class]="'modal-dialog'">-->
            <!--<div class="modal-content">-->
                <!--<ng-content></ng-content>-->
            <!--</div>-->
        <!--</div>-->
        <ng-content></ng-content>
    `,
    host: {
        'class': 'modal',
        'tabindex': '-1'
    },
})
export class MessageBoxContainerComponent extends ModalContainerComponent {
    constructor(
        elementRef: ElementRef,
        renderer: Renderer2,
        modalService: ModalService,
    ) {
        super(elementRef, renderer, modalService);
    }
}
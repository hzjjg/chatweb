import { Component, OnInit, Inject } from '@angular/core';
import { ModalRef } from '../../../rui/packages/modal/modal-ref';
import { MODAL_DATA } from '../../../rui/packages/modal/modal.service';

@Component({
    selector: 'image-preview',
    template: `
            <a href="javascript:;" (click)="close()" class="close">
                <i class="fa fa-close"></i>
            </a>
            <div class="image-wrapper" (click)="close()">
                <img src="{{src}}" />
            </div>
    `,
    styleUrls: ['./image-preview.component.scss']
})

export class ImagePreviewComponent implements OnInit {
    constructor(
        private modalRef: ModalRef,
        @Inject(MODAL_DATA) public src: string
    ) {

    }

    ngOnInit() { }

    close() {
        this.modalRef.close();
    }
}
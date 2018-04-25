import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MODAL_DATA, ModalService } from "../../rui/packages/modal/modal.service";
import { CropperSettings } from 'ng2-img-cropper/src/cropperSettings';
import { ImageCropperComponent } from 'ng2-img-cropper/src/imageCropperComponent';
import { ModalRef } from '../../rui/packages/modal/modal-ref';
import { environment } from '../../environments/environment';
import { ToastService } from '../../rui/packages/toast/toast.service';


@Component({
    selector: 'avatar-cropper',
    template: `
        <a class="close" (click)="close()">
            <i class="fa fa-close"></i>
        </a>
        <div class="cropper-wrapper" *ngIf="cropperSettings">
            <img-cropper #cropper [image]="data" [settings]="cropperSettings"></img-cropper>
        </div>
        <div class="mt-3 text-right">
            <button trip-button type="button" theme="primary" [disabled]="uploading" (click)="uploadAvatar()">
                <span *ngIf="!uploading">确定</span>
                <span *ngIf="uploading">上传中……</span>
            </button>
        </div>
    `,
    styleUrls: ['avatar-cropper.component.scss']
})

export class AvatarCropperComponent implements OnInit {

    cropperSettings: CropperSettings;
    //要上传的data
    data: any

    @ViewChild('cropper')
    cropper: ImageCropperComponent;
    uploading: boolean;
    isMobile = environment.app == 'mobile'

    constructor(
        @Inject(MODAL_DATA) public image: any,
        private modalRef: ModalRef,
        private httpClient: HttpClient,
        private toastService: ToastService
    ) {
        this.data = {}
    }

    ngOnInit() {
        setTimeout(() => {
            this.cropperSettings = new CropperSettings();
            this.cropperSettings.noFileInput = true;
            this.cropperSettings.width = 100;
            this.cropperSettings.height = 100;

            //最终文件长宽
            this.cropperSettings.croppedWidth = 100;
            this.cropperSettings.croppedHeight = 100;

            this.cropperSettings.canvasWidth = 370;
            this.cropperSettings.canvasHeight = 300;

            if (this.isMobile) {
                let modalWidth = this.modalRef.container.elementRef.nativeElement.offsetWidth;
                this.cropperSettings.canvasWidth = modalWidth - 50;
                this.cropperSettings.canvasHeight = modalWidth - 50;
            }

            setTimeout(() => {
                this.cropper.setImage(this.image);
            });

        });
    }

    uploadAvatar() {
        this.uploading = true;
        this.httpClient.post('/base64', this.data.image).subscribe((response: any) => {
            this.modalRef.close(response.url);
        }, (response) => {
            this.uploading = false;
            this.toastService.error(response.error.msg)
        }, () => {
            this.uploading = false;
        })
    }

    close() {
        this.modalRef.close();
    }
}
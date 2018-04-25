import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ModalRef, ModalService, ToastService, MODAL_DATA } from "../../../rui";
import { environment } from "../../../environments/environment";


@Component({
    templateUrl: 'chat-paste-image.component.html',
    styleUrls: ['chat-paste-image.component.scss']
})

export class ChatPasteImageComponent implements OnInit {
    public src: any;
    public uploading:boolean;
    constructor(
        public modalRef: ModalRef,
        @Inject(MODAL_DATA) private data: File,
        private toastService: ToastService,
        private http:HttpClient
    ) {
        // && /\.(?:jpg|png|gif)$/.test(data.name))

    }

    ngOnInit() {
        // if (!(this.data.type && ~this.data.type.indexOf('image')) || true) {
        //     this.toastService.error('仅限图片');
        //     setTimeout(() => {
        //         this.modalRef.close();
        //     });
        //     return;
        // }
        let reader = new FileReader();
        reader.readAsDataURL(this.data);
        reader.onload = (e: any) => {
            this.src = e.target.result;
        }
    }

    close() {
        this.modalRef.close();
    }


    submit() {
        this.uploading = true;
        let formData = new FormData();
        formData.append("file", this.data);
        let uploadUrl = '/file';
        // if (!environment.production) {
        //     uploadUrl = '/proxy/file';
        // }
        
        this.http.post(uploadUrl, formData).subscribe((response: any) => {
            this.modalRef.close(response.uri);
        }, (response) => {
            this.uploading = false;
            this.toastService.error(response.error.msg)
        }, () => {
            this.uploading = false;
        })
    }
}
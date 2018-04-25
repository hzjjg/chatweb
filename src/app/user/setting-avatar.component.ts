import { Component, Inject, Output, EventEmitter } from "@angular/core";
import { MODAL_DATA, ModalService } from "../../rui/packages/modal/modal.service";
import { ModalRef } from "../../rui/packages/modal/modal-ref";
import { AvatarCropperComponent } from "./avatar-cropper.component";

@Component({
    selector: 'setting-avatar',
    templateUrl: 'setting-avatar.component.html',
    styleUrls: ["./setting-avatar.component.scss"]
})

export class SettingAvatarComponent {

    @Output('selectedAvatar') selectedAvatar: EventEmitter<string> = new EventEmitter<string>();
    avatar: string;

    defaultAvatars: any[] = [
        '/images/avatar/0.jpg',
        '/images/avatar/1.jpg',
        '/images/avatar/2.jpg',
        '/images/avatar/3.jpg',
        '/images/avatar/4.jpg',
        '/images/avatar/5.jpg',
        '/images/avatar/6.jpg',
        '/images/avatar/7.jpg',
        '/images/avatar/8.jpg',
        '/images/avatar/9.jpg',
        '/images/avatar/10.jpg',
        '/images/avatar/11.jpg',
        '/images/avatar/12.jpg',
        '/images/avatar/13.jpg',
        '/images/avatar/14.jpg',
        '/images/avatar/15.jpg',
        '/images/avatar/16.jpg',
        '/images/avatar/17.jpg',
        '/images/avatar/18.jpg',
        '/images/avatar/19.jpg',
        '/images/avatar/20.jpg',
        '/images/avatar/21.jpg',
        '/images/avatar/22.jpg',
        '/images/avatar/23.jpg',
        '/images/avatar/24.jpg'
    ];
    selectAvatarIndex: number = 0;

    constructor(
        public modalRef: ModalRef,
        @Inject(MODAL_DATA) private data: any,
        private modalService: ModalService
    ) {
        this.selectAvatarIndex = this.defaultAvatars.findIndex((item: any) => {
            return data === item;
        })
        this.selectedAvatar.emit(this.avatar);
    }

    selectAvatar(index: number) {
        this.selectAvatarIndex = index;
    }
    sureAvatar() {
        this.avatar = this.defaultAvatars[this.selectAvatarIndex];
        this.modalRef.close(this.avatar);
    }

    fileChangeListener($event: any) {
        let image: any = new Image();
        let file: File = $event.target.files[0];
        if (file) {
            let reader: FileReader = new FileReader();
            reader.onloadend = (loadEvent: any) => {
                image.src = loadEvent.target.result;
                let corpperModalRef = this.modalService.open(AvatarCropperComponent, {
                    data: image
                })
                corpperModalRef.didDisappear().subscribe(url => {
                    if (url) {
                        this.modalRef.close(url)
                    }
                })
                $event.target.value = null;
                // $event.target.select();
                // (<any>document).selection.clear();
            };
            reader.readAsDataURL(file);
        }

        // let upload = <HTMLInputElement>document.querySelector(selectorName);
        // upload.value = null;

        // $event.target.parentNode.replaceChild(file2,file);

    }
}
import { Injectable, ComponentRef, Optional } from '@angular/core';
import { MessageBoxComponent } from './message-box.component';
import { MessageBoxContainerComponent } from "./message-box-container.component";
import { ModalRef, ModalService } from "../modal";

@Injectable()
export class MessageBoxService {


    constructor(
        private modalService: ModalService
    ) {
    }

    open(title: string, message: string, showCancelButton: boolean): ModalRef {

        const ref: ModalRef = this.modalService.open(MessageBoxComponent, {
            container: MessageBoxContainerComponent
        });
        let messageBoxComponent: MessageBoxComponent = (<MessageBoxComponent>ref.content);
        messageBoxComponent.title = title;
        messageBoxComponent.message = message;
        messageBoxComponent.showCancelButton = showCancelButton;
        ref.content.handle.then(() => {
            ref.close();
        }, () => {
            ref.close();
        });
        return ref;
    }


    alert(message: string, title?: string): MessageBoxComponent {
        const ref: ModalRef = this.open(title, message, false);
        return ref.content;
    }

    confirm(message: string, title?: string) : MessageBoxComponent {
        const ref: ModalRef = this.open(title, message, true);
        return ref.content;
    }

    // setOptinos(options: Options): void {
    //     if (this.components.length == 0 || this.components[this.components.length - 1].init) {
    //         this.createComponent()
    //     }
    //     const last = this.components[this.components.length - 1];
    //     last.instance = Object.assign(last.instance, options);
    // }

    // createMessageBox(): void {
    //     const com: ComponentRef<any> = this.dynamic.generator(MessageBoxComponent);
    //     this.messageBoxSet.push({
    //         instance: com.instance,
    //         id: com.instance.id,
    //         ref: com,
    //         // init: false
    //     })
    // }
    //
    // closeMessageBox(instance: any): void {
    //     let matchIndex: number = this.messageBoxSet.findIndex(messageBox => {
    //         return messageBox.instance == instance
    //     });
    //     if (~matchIndex) {
    //         let messageBox: any = this.messageBoxSet[matchIndex];
    //         if (messageBox) {
    //             this.messageBoxSet.splice(matchIndex, 1);
    //             this.dynamic.destroy(messageBox.ref);
    //         }
    //     }
    // }

}
import {Component, ElementRef, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Subject} from "rxjs/Subject";

@Component({
    templateUrl: 'message-box.component.html',
    host: {
        'class': 'message-box'
    }
})
export class MessageBoxComponent {

    title: string;
    message: string;
    showCancelButton: boolean;

    handle: Promise<string>;
    resolve: Function;
    reject: Function;

    constructor(
    ) {
        this.handle =  new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

        })
    }

    // show(options: any) {
    //     this.message = options['message'];
    //     this.title = options['title'];
    //     this.showCancelButton = options['showCancelButton'];
    // }
    handleAction(action: any) {
        if (this.resolve) {
            if (action == 'cancel') {
                this.reject(action);
            } else {
                this.resolve(action);
            }
        }
    }
    //
    // ngOnInit() {
    //     super.ngOnInit();
    //     super.open();
    // }
}
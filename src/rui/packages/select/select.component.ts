import { Component, Input } from '@angular/core';

@Component({
    selector: 'trip-select',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.scss']
})
export class SelectComponent {
    @Input() options: any[];
    @Input() value: any;

    isShow: boolean;

    constructor() {
        
    }

    select(item: any): void {
        this.value = item.value;
        this.isShow = !this.isShow;
    }
}
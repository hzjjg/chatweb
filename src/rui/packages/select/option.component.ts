import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'trip-option',
    template: `<div></div>`
})

export class OptionComponent implements OnInit {
    @Input() option: any;
    @Input() value: any;

    constructor() { }

    ngOnInit() { }
}
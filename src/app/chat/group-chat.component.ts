import { Component, OnInit } from '@angular/core';
import { SessionType } from '../im/index';

@Component({
    selector: 'group-chat',
    template: '<chat [sessionType]="sessionType"></chat>'
})

export class GroupChatComponent implements OnInit {
    constructor() { }

    sessionType = SessionType.GROUP

    ngOnInit() { }
}
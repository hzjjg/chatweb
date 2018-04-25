import { Component, ContentChild, Input, OnInit, TemplateRef } from "@angular/core";

@Component({
    selector: 'trip-nav',
    templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {
    @ContentChild('left') leftTmp: TemplateRef<any>
    @ContentChild('right') rightTmp: TemplateRef<any>
    @Input() title: string
    @ContentChild('title') titleTmp: TemplateRef<any>
    constructor() { }
}
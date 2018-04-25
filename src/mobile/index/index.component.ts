import { Component, ContentChild, OnInit, TemplateRef, ViewEncapsulation } from "@angular/core";
import {ChatEditorService} from "../../app/chat/chat-editor/chat-editor.service";

/**
 * 加入提示
 */
@Component({ 
    selector: 'index',
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.scss'],
    host: {
    //     'class': 'view-framework'
        '[class.has-footer]': 'isFooterShow'
    },
    encapsulation: ViewEncapsulation.None
})

export class IndexComponent implements OnInit {
    activeTab: number = 0;
    // isChatEditing: boolean = false;
    isFooterShow: boolean = true;
    constructor(
        private chatEditorService: ChatEditorService
    ) {

    }
    ngOnInit() {

        // this.chatEditorService.editStatus.subscribe((value: boolean) => {
        //     // this.isChatEditing = value;
        // })
        this.chatEditorService.editing.subscribe((value: boolean) => {
           //滑倒最低
           this.isFooterShow = !value;
           // document.body.scrollTop = document.body.scrollHeight;
        });

    }

    toggleTab(index: number) {
        this.activeTab = index;
    }
}
import {Component, Inject} from "@angular/core";
import {MODAL_DATA, ModalRef} from "../../../rui/packages/modal";


@Component({
    selector: "alert",
    templateUrl: 'chat-guide.component.html',
    styleUrls: ['./chat-guide.component.scss']
})

export class ChatGuideComponent {
    content: string;

    constructor(
        public modalRef: ModalRef,
        @Inject(MODAL_DATA) content: string
    ) {
        this.content = content;
        // this.content = '<p><span style="color: rgb(0, 138, 0);" class="ql-size-large">北京PK10</span> 冠军定位</p><p><br></p><p>936-937期 [01 03 05 07 08] 937期 开 04 错</p><p>938-939期 [01 02 03 07 08] 938期 开 03 对</p><p>939-940期 [02 04 06 09 10] 正在进行第1期&nbsp;&nbsp;</p><p><br></p><p>博乐城聊天计划</p>'
    }

    ngOnInit() {

    }
}
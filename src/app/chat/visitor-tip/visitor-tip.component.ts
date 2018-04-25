import {Component, Inject, Optional} from "@angular/core";
import {MODAL_DATA, ModalRef, ModalService} from "../../../rui/packages/modal/index";
import {RegisterComponent} from "../../user/register.component";
import {LoginComponent} from "../../user/login.component";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";


@Component({
    selector: "visitor-tip",
    templateUrl: 'visitor-tip.component.html',
    styleUrls: ['./visitor-tip.component.scss']
})

export class VisitorTipComponent {
    content: string;
    isMobile = environment.app == 'mobile';

    constructor(
        public modalRef: ModalRef,
        private modalService: ModalService,
        @Optional() private route: Router,
        @Inject(MODAL_DATA) content: string
    ) {
        this.content = content;
    }

    ngOnInit() {

    }

    public routeLogin() {
        this.modalRef.close();
        this.route.navigate(['/login']);
    }

    public openLogin() {
        const ref: ModalRef = this.modalService.open(LoginComponent);
    }

    public openRegister() {
        const ref: ModalRef = this.modalService.open(RegisterComponent);
    }
}
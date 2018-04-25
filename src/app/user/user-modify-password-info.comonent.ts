import {Component, OnInit} from "@angular/core";
import {ModalRef} from "../rui";
import {UserModifyPasswordInfo} from "./user-modify-password-info";
import {NgForm} from "@angular/forms";
import {UserService} from "./user.service";
import {ToastService} from "../../rui/packages/toast/toast.service";
import {SessionService} from "./session.service";
import {ModalService} from "../../rui/packages/modal/modal.service";
import {LoginComponent} from "./login.component";

@Component({
    selector: 'user-modify-password-info',
    templateUrl: 'user-modify-password-info.component.html',
    styleUrls: ['./login.component.scss']
})

export class UserModifyPasswordInfoComponent implements OnInit{
    pwdInfo: UserModifyPasswordInfo;

    constructor(
        public modalRef: ModalRef,
        private userService: UserService,
        private toastService: ToastService,
        private sessionService: SessionService,
        private modalService: ModalService
    ) {

    }

    ngOnInit() {
        this.pwdInfo = {
            pwd: '',
            newPwd: '',
            confirmPwd: '',
        }
    }

    submit(modifyPwsForm: NgForm) {
        this.userService.putPassword(
            modifyPwsForm.value.pwd,
            modifyPwsForm.value.newPwd
        ).subscribe(() => {
            this.modalRef.close();
            window.location.reload();
        }, (res) => {
            this.toastService.error(res.error.msg);
        })
    }
}
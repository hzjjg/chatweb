import { Component, Input, OnInit } from '@angular/core';

import { LoginInfo } from "./login-info";
import { NgForm } from "@angular/forms";
import { SessionService } from "./session.service";
import { UserType } from "./user-type";
import { ModalRef, ToastService, ModalService } from "../rui";
import { RegisterComponent } from "./register.component";
import { UserService } from "./user.service";
import { UserManager } from "./user-manager";
import { environment } from '../../environments/environment';
import { PageManager } from '../system/page-manage';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent {
    loginInfo: LoginInfo;
    text: string;
    isShowError: boolean = false;
    registerModalRef: ModalRef;
    isMobile:boolean;

    constructor(
        public modalRef: ModalRef,
        private sessionService: SessionService,
        private toastService: ToastService,
        private modalService: ModalService,
        private userService: UserService,
        private userManager: UserManager,
        private pageManager:PageManager
    ) {
        this.userManager.go(1);
        this.isMobile = environment.app == 'mobile'
    }

    ngOnInit() {
        this.loginInfo = {
            type: UserType.Customer,
            username: '',
            sign: '',
        };
        this.sessionService.loginSubject.subscribe(() => {
            this.close()
        })
    }

    openRegister() {
        this.pageManager.goRegister()
    }

    close(){
        if(this.isMobile){
            history.back()
        }else{
            this.modalRef.close()
        }
    }

    submit(loginForm: NgForm) {
        if (!this.loginInfo.username) {
            this.isShowError = true;
            this.text = '请输入用户名';
            return;
        }
        if (!this.loginInfo.sign) {
            this.isShowError = true;
            this.text = '请输入密码';
            return;
        }
        this.isShowError = false;
        this.sessionService.login(
            this.loginInfo.type,
            loginForm.value.username,
            loginForm.value.sign
        ).subscribe(() => {
            this.close()
            this.toastService.success("登录成功!");
        }, (response) => {
            this.toastService.error(response.error.msg);
        });
    }
}
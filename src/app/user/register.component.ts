import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CustomerRegisterInfo } from "./customer-register-info";
import { CustomerService } from "./customer.service";
import { ModalRef, ToastService } from "../rui";
import { SessionService } from "./session.service";
import { UserType } from "./user-type";
import { UserService } from "./user.service";
import { CaptchaService } from "./captcha.service";
import { CaptchaToken } from "./captcha-token";
import { environment } from "../../environments/environment";
import { CustomerRegisterApply } from "./customer-register-apply";
import { Room, RoomService } from "../../app/chat"

@Component({
    selector: 'register',
    templateUrl: 'register.component.html',
    styleUrls: ['./login.component.scss']
})

export class RegisterComponent {
    registerInfo: CustomerRegisterInfo;
    // confirmPwd: string;
    registerForm: FormGroup;
    type: UserType;
    room: Room;

    token: CaptchaToken;
    isMobile: boolean;

    get captchaUrl() {
        if (this.token == null) {
            return null;
        }
        let captchaUrl = `/captcha?token=${this.token.token}`;
        if (!environment.production) {
            return `/proxy${captchaUrl}`;
        }
        return captchaUrl;
    }

    constructor(
        public modalRef: ModalRef,
        private customerService: CustomerService,
        private toastService: ToastService,
        private sessionService: SessionService,
        private captchaService: CaptchaService,
        private userService: UserService,
        // private formBuilder: FormBuilder
        private roomService: RoomService
    ) {
        this.isMobile = environment.app == 'mobile'
        this.roomService.room.subscribe((room: Room) => {
            this.room = room;
        })
    }

    ngOnInit() {
        this.type = UserType.Customer;
        this.registerInfo = new CustomerRegisterInfo;
        this.refresh();
    }


    submit() {
        if (!this.token) {
            this.toastService.error("验证码失效,请重新输入");
            this.refresh();
            return;
        }
        let applyInfo = new CustomerRegisterApply();
        applyInfo.username = this.registerInfo.username;
        applyInfo.pwd = this.registerInfo.pwd;

        if (this.room.registerOpts) {
            this.room.registerOpts.enableName && (applyInfo.name = this.registerInfo.name);
            this.room.registerOpts.enableQQ && (applyInfo.qq = this.registerInfo.qq);
            this.room.registerOpts.enablePhone && (applyInfo.phone = this.registerInfo.phone);
            this.room.registerOpts.enableWeChat && (applyInfo.weChat = this.registerInfo.weChat);
        }

        applyInfo.captchaToken = this.token.token;
        applyInfo.captcha = this.registerInfo.captcha;

        applyInfo.referrer = document.referrer;


        this.customerService.apply(applyInfo).subscribe(() => {
            this.sessionService.login(
                this.type,
                this.registerInfo.username,
                this.registerInfo.pwd
            ).subscribe(() => {
                this.close()
                this.toastService.success("注册登录成功!");
            }, (response) => {
                this.toastService.error(response.error.msg);
            });
        }, (response) => {
            //response.error.code === 10006
            this.refresh();
            this.toastService.error(response.error.msg);
            delete this.registerInfo.captcha;
        })
    }

    refresh() {
        this.captchaService.request().subscribe((token: CaptchaToken) => {
            this.token = token;
        }, (response) => {
            this.toastService.error(response.error.msg);
        })
    }

    close() {
        if (this.isMobile) {
            history.back();
        } else {
            this.modalRef.close();
        }
    }

}
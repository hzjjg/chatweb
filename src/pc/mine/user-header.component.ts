import { Component, OnInit, Input, ViewChild, TemplateRef, Renderer2, AfterContentInit } from "@angular/core";
import { ModalService, ModalRef, MessageBoxService } from "../../app/rui";
import { UserInfoComponent } from "../../app/user/user-info.component";
import { WalletComponent } from "../../app/wallet/wallet.component";
import { UserModifyPasswordInfoComponent } from "../../app/user/user-modify-password-info.comonent";
import { UserService } from "../../app/user/user.service";
import { SessionService } from "../../app/user/session.service";
import { UserInfo, UserType } from "../../app/user/index";
import { LoginComponent } from "../../app/user/login.component";
import { RegisterComponent } from "../../app/user/register.component";

/**
 * 联系人条目
 */
@Component({
    selector: 'user-header',
    templateUrl: 'user-header.component.html',
    styleUrls: ['user-header.component.scss'],
    // host: {
    //     'class': 'contact-item'
    // }
})
export class UserHeaderComponent implements OnInit, AfterContentInit {


    userInfo: UserInfo;
    isShowTool: boolean = false;
    isVisitor: boolean = true;

    constructor(
        private modalService: ModalService,
        private renderer: Renderer2,
        private userService: UserService,
        private sessionService: SessionService,
        private messageBoxService: MessageBoxService,
    ) {

    }

    ngOnInit(): void {
        this.userService.user.subscribe((userInfo: UserInfo) => {
            if (!userInfo) {
                return;
            }

            this.userInfo = userInfo;
            if (this.userInfo.userType == UserType.Visitor) {
                this.isVisitor = true;
            } else {
                this.isVisitor = false;
            }
        });
    }

    changePwdModalRef: ModalRef;
    userInfoModalRef: ModalRef;
    wealthModalRef: ModalRef;
    loginModalRef: ModalRef;
    registerModalRef: ModalRef;

    public openChangePwd() {
        this.changePwdModalRef = this.modalService.open(UserModifyPasswordInfoComponent);
    }

    public openUserInfo() {
        this.userInfoModalRef = this.modalService.open(UserInfoComponent, {
            data: Object.assign({}, this.userInfo)
        });

        this.userInfoModalRef.didAppear().subscribe(() => {
            this.renderer.setStyle(
                this.userInfoModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog'),
                "width",
                "360px"
            );
        })

        // this.userInfoModalRef.container;
        //临时处理


    }

    public openWealth() {
        this.wealthModalRef = this.modalService.open(WalletComponent);
        this.wealthModalRef.didAppear().subscribe(() => {
            this.renderer.setStyle(
                this.wealthModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog'),
                "width",
                "280px"
            );
        })
    }


    public openLogin() {
        this.loginModalRef = this.modalService.open(LoginComponent);
    }

    public openRegister() {
        this.registerModalRef = this.modalService.open(RegisterComponent);
    }

    switchTool($event: Event) {
        this.isShowTool = !this.isShowTool;
        $event.stopPropagation();
    }

    ngAfterContentInit(): void {
        //有遮盖层更为合适
        this.renderer.listen('window', 'click', (event: any) => {
            if (this.isShowTool) {
                this.isShowTool = false;
                event.preventDefault();
            }
        })
    }

    logout() {
        this.messageBoxService.confirm("确认是否退出登录").handle.then(() => {
            this.sessionService.logout().subscribe(() => {
                window.location.reload();;
            }, () => {

            });
        }, () => {

        })

    }

}
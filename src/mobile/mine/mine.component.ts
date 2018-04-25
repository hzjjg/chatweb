import {Component} from "@angular/core";
import {UserInfo} from "../../app/user/user-info";
import {WalletComponent} from "../../app/wallet/wallet.component";
import {ModalRef} from "../../rui/packages/modal/modal-ref";
import {ModalService} from "../../rui/packages/modal/modal.service";
import {UserService} from "../../app/user/user.service";
import {SessionService} from "../../app/user/session.service";
import {MessageBoxService} from "../../rui/packages/message-box/message-box.service";
import {UserModifyPasswordInfoComponent} from "../../app/user/user-modify-password-info.comonent";
import {UserInfoComponent} from "../../app/user/user-info.component";

@Component({
    selector: 'mine-page',
    templateUrl: 'mine.component.html',
    styleUrls: ['../discover/discover.component.scss', 'mine.component.scss']
})

export class MineComponent {
    userInfo: UserInfo;

    constructor(
        private modalService: ModalService,
        private userService: UserService,
        private sessionService: SessionService,
        private messageBoxService: MessageBoxService,
    ) {

    }

    ngOnInit(): void {
        this.userService.user.subscribe((userInfo: UserInfo) => {
            this.userInfo = userInfo;
        });
    }

    changePwdModalRef: ModalRef;
    userInfoModalRef: ModalRef;
    wealthModalRef: ModalRef;

    public openChangePwd() {
        this.changePwdModalRef = this.modalService.open(UserModifyPasswordInfoComponent);
    }

    public openUserInfo() {
        this.userInfoModalRef = this.modalService.open(UserInfoComponent, {
            data: Object.assign({}, this.userInfo)
        });
    }

    public openWealth() {
        this.wealthModalRef = this.modalService.open(WalletComponent);
    }

    logout() {
        this.messageBoxService.confirm("确认是否退出登录").handle.then(() => {
            this.sessionService.logout().subscribe(() => {
                window.location.reload();
            }, () => {

            });
        }, () => {

        })

    }
}
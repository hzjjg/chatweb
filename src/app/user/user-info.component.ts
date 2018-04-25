import { Component, Inject, Renderer2, ViewChild } from "@angular/core";
import { UserInfo } from "./user-info";
import { NgForm } from "@angular/forms";
import { ModalRef, MODAL_DATA } from "../rui";
import { UserType } from "./user-type";
import { UserService } from "./user.service";
import { ToastService } from "../../rui/packages/toast/toast.service";
import { UserProfileInfo } from "./user-profile-info";
import { ModalService } from "../../rui/packages/modal/modal.service";
import { SettingAvatarComponent } from "./setting-avatar.component";
import { Room } from "../chat/room";
import { RoomService } from "../chat/room.service";
import { environment } from "../../environments/environment";
import { PageManager } from "../system/page-manage";
import { SessionType } from "../im/index";
import { ChatService } from "../chat/chat.service";
import { Gag } from "../contact/gag";
import { ContactListService } from "../contact/contact-list.service";

@Component({
    selector: 'user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['user-info.component.scss']
})

export class UserInfoComponent {
    userType = UserType;
    userInfo: UserInfo;
    originalUserInfo: UserInfo;
    isMyInfo: boolean = false;
    showChatButton: boolean = false;

    myUserInfo: UserInfo;

    avatarModalRef: ModalRef;


    constructor(
        public modalRef: ModalRef,
        private modalService: ModalService,
        private userService: UserService,
        private toastService: ToastService,
        private renderer: Renderer2,
        @Inject(MODAL_DATA) private data: UserInfo,
        private roomService: RoomService,
        private pageManager: PageManager,
        private chatService: ChatService,
        private contactListService: ContactListService
    ) {
        this.userInfo = this.data;
        this.myUserInfo = this.userService.user.getValue();
        this.isMyInfo = this.myUserInfo.userId == this.userInfo.userId;

        //复制一个、修改的时候上下不会同时修改
        this.originalUserInfo = Object.assign({}, this.data);

        //判断是否能聊天

        if (this.myUserInfo.userType == UserType.Staff) {
            this.showChatButton = this.userInfo.userId && !this.isMyInfo;
        } else {
            this.showChatButton = this.userInfo.userId && this.userInfo.userType == UserType.Staff;
        }
    }

    ngOnInit() {

    }


    submit(userForm: NgForm) {
        let profileInfo: UserProfileInfo = {
            nickname: userForm.value.nickname,
            avatar: this.userInfo.avatar,
            personalSignature: userForm.value.personalSignature
        };
        this.userService.putProfile(profileInfo).subscribe(() => {
            let userInfo: UserInfo = this.userService.user.getValue();
            this.userService.user.next(Object.assign({}, userInfo, profileInfo));
            this.modalRef.close();
        }, (res) => {
            this.toastService.error(res.error.msg);
        })
    }

    settingAvatar() {
        this.avatarModalRef = this.modalService.open(SettingAvatarComponent, { data: this.userInfo.avatar });
        this.avatarModalRef.didDisappear().subscribe((avatar: string) => {
            if (avatar) {
                this.userInfo.avatar = avatar;
            }
        });
        //移动端不需要

        if (environment.app === 'pc') {
            this.renderer.setStyle(
                this.avatarModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog'),
                "width",
                "382px"
            );
        }

    }

    //移动端
    kickOutUser(user: UserInfo) {
        let room: Room = this.roomService.room.getValue(),
            userId = user.userId;
        if (room && userId) {
            this.roomService.kickout(room.roomNo, userId).subscribe(() => {
                this.toastService.success("成功踢出该用户")
                //用户被踢出；
            }, (response) => {
                this.toastService.error(response.error.msg);
            });
        } else {
            this.toastService.error("非用户不允许踢出");
        }
    }


    gagUser() {
        let gag: Gag = {
            userId: this.userInfo.userId,
            userType: this.userInfo.userType,
            username: this.userInfo.username
        };
        this.contactListService.gag(gag).subscribe(() => {
            this.toastService.success('禁言成功!');
        },(response)=>{
            this.toastService.error(response.error.msg)
        })
    }

    goChat() {
        this.chatService.sessionTypeSubject.next({ sessionType: SessionType.C2C, chatWith: this.userInfo.userId });
        this.pageManager.goChat(this.userInfo.userId);
        this.modalRef.close();
    }
}
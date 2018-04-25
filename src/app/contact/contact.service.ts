import {Injectable} from "@angular/core";
import {UserInfo} from "../user/user-info";
import {IMService} from "../im";
import {MsgType, TipType} from "../im/const";
import {
    GroupJoinTipMessage, GroupModifyMemberInfoTipMessage, GroupQuitTipMessage, GroupTipMessage,
    Message
} from "../im/msg/message";
import {UserService} from "../user/user.service";
import {RoomService} from "../chat/room.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ContactService {

    contacts: UserInfo[];

    contactsSubject: Subject<UserInfo[]>;

    constructor(
        private imService: IMService,
        private userService: UserService,
        private roomService: RoomService
    ) {
        this.contacts = [];
        this.contactsSubject = new Subject<UserInfo[]>();
        this.userService.userChange.subscribe((userId) => {
            if (userId) {
                this.contacts = [];
                this.fetchMembers();
            }
        });
        imService.msgNotify.subscribe((msg: Message) => {
            if (msg.msgType == MsgType.GROUP_TIP) {
                let tipMessage: GroupTipMessage = <GroupTipMessage>msg;
                switch (tipMessage.tipType) {
                    case TipType.JOIN: {
                        let user: UserInfo = (<GroupJoinTipMessage>tipMessage).user,
                            total = (<GroupJoinTipMessage>tipMessage).total;
                        if (user.userId != this.userService.user.getValue().userId) {
                            this.joinUser(user);
                            this.checkMemberTotal(total);
                        }

                        break;
                    }
                    case TipType.QUIT: {
                        let userId = (<GroupQuitTipMessage>tipMessage).userId,
                            total = (<GroupQuitTipMessage>tipMessage).total;

                        this.quitUser(userId);
                        this.checkMemberTotal(total);
                        break;
                    }
                    case TipType.MODIFY_MEMBER_INFO: {
                        let user = (<GroupModifyMemberInfoTipMessage>tipMessage).user;
                        this.updateUser(user);
                        break;
                    }
                }
            }
        });
    }

    _calcUserKeyword(user: UserInfo) {
        return user.keyword = [user.nickname, (<any>user).username].join(',').toLowerCase();
    }
    quitUser(userId: number) {
        let matchIndex = this.contacts.findIndex((member) => {
            return member.userId == userId;
        });
        if (~matchIndex) {
            this.contacts.splice(matchIndex, 1);
        }
        this.contactsSubject.next(this.contacts);
    }

    checkMemberTotal(total: number) {
        if (this.contacts && this.contacts.length != total) {
            console.warn("check member total failed:" + this.contacts.length + ", " + total);
            this.fetchMembers();
        }
    }

    fetchMembers() {
        let user: UserInfo = this.userService.user.getValue();
        if (user && this.imService.auth.getValue()) {
            this.roomService.fetchMembers((<any>window).ROOM_NO).subscribe((members: any[]) => {
                members.forEach((member) => {
                    this._calcUserKeyword(member);
                })
                this.contacts = members;
                this.contactsSubject.next(this.contacts);
            });
        } else {
            this.contacts = [];
            this.contactsSubject.next(this.contacts);
        }
    }

    addContact(contact: UserInfo) {

    }
    // deleteContact(contact: User)

    joinUser(user: UserInfo) {
        if (!this.contacts) {
            return;
        }
        let match = this.contacts.find((member) => {
            return member.userId == user.userId
        });

        this._calcUserKeyword(user);
        if (match) {
            user = Object.assign(match, user);
        } else {
            this.contacts.push(user);
        }


        // this._originalMembers = this.sortMembers(this._originalMembers);
        // this.handlerMemberData();
        this.contactsSubject.next(this.contacts);
    }

    updateUser(user: UserInfo) {
        let match = this.contacts.find((member) => {
            return member.userId == user.userId
        });
        if (match) {
            user = Object.assign(match, user);
            this._calcUserKeyword(user);
            //数据变更通知
            this.contactsSubject.next(this.contacts);
        } else {
            //数据不一致
            this.fetchMembers();
        }
    }
}
import { Injectable } from '@angular/core';
import { Notice } from './notice';
import { RoomService, Room } from '../../../app/chat/index';
import { Subject } from 'rxjs/Subject';
import {Extension} from "../../../app/chat/room-extension";

@Injectable()
export class NoticesService {
    private notices: Notice[];
    private extensions: Extension[];
    noticesSubject = new Subject<Notice[]>();

    constructor(
        private roomService: RoomService
    ) {
        this.roomService.room.subscribe((room: Room) => {
            if(room) {
                this.extensions = room.extensions
            }
        });

        this.notices = [
            {
                type: "platform",
                name: "平台介绍",
                content: `幸运彩票于2009年成立，专业经营各项彩票业务，现已推出高频彩票现金投注网，主营北京赛车PK10、幸运飞艇、PC蛋蛋、重庆时时彩、广东快乐十分、江苏快三、香港六合彩等项目，免费自助注册开户， 现金投注。我们拥有稳定的平台，成熟的玩法，简单的下注流程、以及优质的客户服务。幸运彩票于2009年成立，专业经营各项彩票业务，现已推出高频彩票现金投注网，主营北京赛车PK10、幸运飞艇、PC蛋蛋、重庆时时彩、广东快乐十分、江苏快三、香港六合彩等项目，免费自助注册开户，
                         现金投注。我们拥有稳定的平台，成熟的玩法，简单的下注流程、以及优质的客户服务。`
            },
            {
                type: "game",
                name: "游戏介绍",
                content: `现金投注。我们拥有稳定的平台，成熟的玩法，简单的下注流程、以及优质的客户服务。`
            },
            {
                type: "markSix",
                name: `六合心水`,
                content: "123"
            },
            {
                type: 'help',
                name: "新手帮助",
                content: `幸运彩票于2009年成立，专业经营各项彩票业务，现已推出高频彩票现金投注网，主营北京赛车PK10、幸运飞艇、PC蛋蛋、重庆时时彩、广东快乐十分、江苏快三、香港六合彩等项目，免费自助注册开户， 现金投注。我们拥有稳定的平台，成熟的玩法，简单的下注流程、以及优质的客户服务。幸运彩票于2009年成立，专业经营各项彩票业务，现已推出高频彩票现金投注网，主营北京赛车PK10、幸运飞艇、PC蛋蛋、重庆时时彩、广东快乐十分、江苏快三、香港六合彩等项目，免费自助注册开户，
                         现金投注。我们拥有稳定的平台，成熟的玩法，简单的下注流程、以及优质的客户服务。`
            }
        ]

        this.roomService.room.subscribe((room: Room) => {
            if (room) {
                let sysNoticeIndex = this.notices.findIndex((notice) => {
                    return notice.type == 'systemNotice'
                });

                ~sysNoticeIndex && this.notices.splice(sysNoticeIndex, 1)

                this.notices.push({
                    type: "systemNotice",
                    name: "系统通知",
                    notices: room.notices
                })
            }

            this.noticesSubject.next(this.notices);
        })
    }

    getNotices(): Notice[] {
        return Object.assign([], this.notices);
    }
}
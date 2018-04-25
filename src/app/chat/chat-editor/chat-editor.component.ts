import {
    Component, OnInit, ViewChild, ElementRef, Renderer2, OnChanges, AfterContentInit,
    EventEmitter, HostListener, Input, NgZone
} from '@angular/core';

import { Observable, Subject } from "rxjs";
import { ChatEditorService } from "./chat-editor.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { MessageUtils } from "../message-utils";
import { EMOTICON_LIST, EMOTICON_MAP } from "../../system/emoticon";
import { ModalService, ToastService } from "../../rui";
import { RedPacketSendComponent } from "../red-packet/red-packet-send.component";
import { ChatPasteImageComponent } from "../chat-paste-image/chat-paste-image.component";
import { UserService, UserInfo, UserType } from "../../user";
import { UploadOutput, UploadInput, UploaderOptions } from "ngx-uploader";
import { environment } from "../../../environments/environment";
import { PageManager } from '../../system/page-manage';
import { Room, RoomService } from "../";
import { SessionType, MsgType } from '../../im';
import {async} from "rxjs/scheduler/async";
// import {AudioRecorder} from "../../utils/recorder";

@Component({
    selector: 'chat-editor',
    templateUrl: 'chat-editor.component.html',
    styleUrls: ['chat-editor.component.scss'],
})
export class ChatEditorComponent implements OnInit, OnChanges, AfterContentInit {
    @Input() sessionType: SessionType;
    @Input() chatWith: any;

    _editCtn: string = "";

    set editCtn(content: string) {
        this._editCtn = content;
    }

    get editCtn() {
        return this._editCtn;
    }
    // contentHtml: SafeHtml;
    emoticons: {
        url: string,
        text: string
    }[] = [];
    openEmoticon: boolean = false;
    isVisitor: boolean = false;

    userType: UserType;

    isMobile: boolean;
    SESSION_TYPE = SessionType;

    showCstServe: boolean = false;


    options: UploaderOptions;
    uploadInput: EventEmitter<any>;
    @ViewChild('fileUpload', undefined)
    fileUpload: ElementRef;

    // @ViewChild('voiceButton')
    // voiceButtonEleRef: ElementRef;

    private redPacketModalRef: any;

    @ViewChild("editArea")
    private editArea: ElementRef;

    editAreaSelection: any; //P
    editAreaRange: any;        //U
    sendSubject: any;

    @ViewChild("emoticonContainer", undefined)
    private emoticonContainer: ElementRef;

    isVoice: boolean = false;
    islistening: boolean = false; //录音中
    isReadyCancelListen: boolean = false; // 显示滑动取消
    isOverTime: boolean = false; //超过最大录音时间
    showMoreTool: boolean = false;

    @ViewChild('toolMore', undefined)
    private toolMore: ElementRef;



    private voiceMaxMove = 100;
    private voiceMaxTime = 60000;
    private touchStartTime: number;
    private voiceCountdown: number;

    //是否被全体禁言
    private isGaged: boolean;

    @ViewChild('suggestWrap', undefined)
    private suggestWrap: ElementRef;
    private _showSuggest: boolean = false;
    private suggestLeft: number;
    private suggestTop: number;
    get showSeggest() {
        return this._showSuggest;
    }
    set showSuggest(show: boolean) {
        if (show  && !this._showSuggest && this.suggestWrap) {
            //获取高标位置
            // this.suggestWrap.nativeElement.getClientRects();
            let rect: ClientRect = this.suggestWrap.nativeElement.getBoundingClientRect();
            this.suggestLeft = rect.left;
            this.suggestTop = rect.top;
        }
        this._showSuggest = show;

    }

    room: Room;
    constructor(
        private chatEditorService: ChatEditorService,
        private sanitizer: DomSanitizer,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private modalService: ModalService,
        private userService: UserService,
        private toastService: ToastService,
        private pageManager: PageManager,
        private roomService: RoomService,
        private ngZone: NgZone
    ) {
        this.uploadInput = new EventEmitter<any>();
        this.emoticons = EMOTICON_LIST.map((value) => {
            let id = EMOTICON_MAP[value];
            return {
                url: `/images/emoticons/${id}@2x.gif`,
                text: value
            }
        });
        this.isMobile = environment.app == 'mobile';
        this.userService.user.subscribe((user: UserInfo) => {
            this.isVisitor = user && user.userType == UserType.Visitor;
            this.userType = user && user.userType;
        });
        this.roomService.room.subscribe((room: Room) => {
            this.room = room;
        });

        this.sendSubject = new Subject().throttleTime(60, async, {
            leading: false,
            trailing: true
        }).subscribe(() => {
            this.sendMessage();
        });
        // Observable.forkJoin(this.userService.user, this.roomService.room).subscribe((response) => {
        //     console.log(response);

        //     let user: UserInfo = response[0],
        //         room: Room = response[1]

        //     this.isVisitor = user && user.userType == UserType.Visitor;
        //     this.userType = user && user.userType;
        //     this.room = room;

        //     if (this.room.chatOpts && this.room.chatOpts.enableOnlyStaffSpeech && this.sessionType == SessionType.GROUP && this.userType != UserType.Staff) {
        //         this.isGaged = true;
        //     } else if (this.userType == UserType.Visitor && this.sessionType == SessionType.GROUP && !(this.room.chatOpts && this.room.chatOpts.enableVisitorSpeech)) {
        //         this.isGaged = true;
        //     }

        //     console.log(this.isGaged,'hhhh')
        // })

    }


    ngOnInit() {
        // let recorder: AudioRecorder = new AudioRecorder();
        // recorder.requestAuthorization(()=>{
        //     recorder.start();
        //     setTimeout(()=> {
        //         recorder.stop();
        //         recorder.play();
        //     }, 3000);
        // });


        let touchStartY: number;

        // this.editArea = this.elementRef.nativeElement.querySelector('.edit-area');
        this.renderer.listen(this.editArea.nativeElement, 'input', () => {
            this.saveSelectionStatus();
        });
        this.renderer.listen(this.editArea.nativeElement, 'click', () => {
            this.saveSelectionStatus();
        });

        if (environment.app == 'pc') {
            this.editArea.nativeElement.focus();
            this.saveSelectionStatus();
        }

        // this.editArea.addEventListener('focus', (e: any) => {
        //     this.chatEditorService.editing.next(true);
        //     e.stopPropagation();
        //     e.preventDefault();
        //     return false;
        // }, true);
        // let timeoutBoard = false;
        this.renderer.listen(this.editArea.nativeElement, 'focus', (e: any) => {

            // if (timeoutBoard) {
            //
            // } else {
            this.chatEditorService.editing.next(true);
            // timeoutBoard = true;
            // this.editArea.blur();
            // setTimeout(() => {
            //     this.editArea.focus();
            // }, 100);

            // }
            if (environment.app == 'mobile') {
                setTimeout(() => {
                    // console.log(window.innerHeight, this.elementRef.nativeElement.getBoundingClientRect().y);
                    // window.scrollHeight
                    // if (this.editCtrl) {
                    //相当于滑到最底部
                        this.elementRef.nativeElement.scrollIntoView(true);
                        this.elementRef.nativeElement.scrollIntoViewIfNeeded();
                    // }
                    // this.elementRef.nativeElement.clientHeight
                    // let y = document.body.clientHeight - this.elementRef.nativeElement.getBoundingClientRect().y;
                    // console.log(document.body.scrollTop,
                    //     document.body.scrollHeight,
                    //     document.body.clientHeight)
                    // let endTop: number = document.body.scrollHeight - window.innerHeight + 30;
                    // document.body.scrollTop = endTop;
                }, 300)

            }



            // e.stopPropagation();
            // e.preventDefault();
        });
        this.renderer.listen(this.editArea.nativeElement, 'blur', () => {
            // if (timeoutBoard == false) {
            this.chatEditorService.editing.next(false);
            // }
        });

        // //语音录音触摸滑动
        // this.renderer.listen(this.voiceButtonEleRef.nativeElement, 'touchstart', (e: any) => {
        //     this.touchStartTime = (new Date()).getTime()
        //     touchStartY = e.changedTouches[0].pageY;
        //     //TODO 录音机
        //     this.islistening = true;
        // })

        // this.renderer.listen(this.voiceButtonEleRef.nativeElement, 'touchmove', (e: any) => {
        //     let movedY = touchStartY - e.changedTouches[0].pageY;
        //     if (movedY >= this.voiceMaxMove) {
        //         this.isReadyCancelListen = true;
        //     } else {
        //         this.isReadyCancelListen = false;
        //     }

        // })

        // this.renderer.listen(this.voiceButtonEleRef.nativeElement, 'touchend', (e: any) => {
        //     let movedY = touchStartY - e.changedTouches[0].pageY,
        //         passedTime = (new Date()).getTime() - this.touchStartTime;
        //     this.islistening = false;
        //     this.isReadyCancelListen = false;

        //     if (passedTime > this.voiceMaxTime) {
        //         return;
        //     }

        //     if (movedY > this.voiceMaxMove) {
        //         //TODO 取消录音机
        //     } else {
        //         //TODO 发送消息
        //     }
        // })

        // this.renderer.listen('window', 'click', (e: any) => {
        //     if (this.showMoreTool) {
        //         this.showMoreTool = !this.showMoreTool;
        //         e.stopPropagation();
        //     }
        // })

        // this.renderer.listen(this.toolMore.nativeElement, 'click', (e: any) => {
        //     e.stopPropagation();
        // })
    }

    onUploadOutput(output: UploadOutput): void {
        if (output.type == 'allAddedToQueue') { // add file to array when added
            // this.files.push(output.file);21
            //http://www.099609.com/
            const event: UploadInput = {
                type: 'uploadAll',
                url: '/file',
                method: 'POST',
                data: {}
            };
            if (!environment.production) {
                event.url = '/proxy/file';
            }
            this.fileUpload.nativeElement.value = null;

            this.uploadInput.emit(event);
        }

        if (output.type == 'done') {
            if (output.file.responseStatus == 200) {
                let mediaUri = output.file.response.uri;

                let options: any = {
                    msgType: MsgType.IMAGE,
                    mediaUri: mediaUri
                };

                if (this.sessionType == SessionType.C2C) {
                    options.to = this.chatWith;
                    options.type = this.sessionType;
                }

                let message = this.chatEditorService.createMessage(options);

                this.chatEditorService.send(message);

            } else {
                if (output.file.response.code) {
                    this.toastService.error(output.file.response.msg);
                } else {
                    this.toastService.error(output.file.response || '图片发送失败');
                }
            }
        }

    }

    toggleEmoticons($event: any) {
        // let handle = () => {
        //     this.openEmoticon = false;
        //     window.removeEventListener('click', handle);
        // };
        this.openEmoticon = !this.openEmoticon;
        $event.stopPropagation();
        // if (this.openEmoticon) {
        //     setTimeout(() => {
        //         window.addEventListener('click', handle)
        //     });
        // }
    }

    @HostListener('document:click', ['$event'])
    onClick(event: Event) {
        if (this.isMobile) {
            return;
        }
        if (this.emoticonContainer.nativeElement.contains(event.target)) {
        } else {
            this.openEmoticon = false;
            // this.highlight(null);
        }
        if (this.toolMore && this.toolMore.nativeElement.contains(event.target)) {
        } else {
            this.showMoreTool = false;
        }
        // this.openEmoticon = false;
        // if (this.el.nativeElement.contains(event.target)) {
        //     // this.highlight('yellow');
        // } else {
        //     this.highlight(null);
        // }
    }

    @HostListener('document:touchstart', ['$event'])
    onTouchStart(event: Event) {
        if (!this.isMobile) {
            return;
        }
        if (this.emoticonContainer.nativeElement.contains(event.target)) {
        } else {
            this.openEmoticon = false;
            // this.highlight(null);
        }
        if (this.toolMore.nativeElement.contains(event.target)) {
        } else {
            this.showMoreTool = false;
        }
    }

    private pasteTimeout: any;

    // @HostListener('voiceButton:touchstart',['$event'])
    // ontouchstart(event:Event){
    // }

    onPaste(event: any) {
        // html = html.replace(/<[^>]+>/g, '');
        // this.insertToEditArea(html);
        // this.ngZone.run(() => {
        //
        // })

        let items = event.clipboardData.items,
            blob;
        let allowed = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.kind !== 'file' || !(blob = item.getAsFile())) {
                continue;
            }
            allowed.push(blob);
        }

        if (allowed.length) {
            // 不阻止非文件粘贴（文字粘贴）的事件冒泡
            event.preventDefault();
            event.stopPropagation();
            // 将这个数据上传 allowed[0];
            let file = allowed[0];
            if (!(file.type && ~file.type.indexOf('image'))) {
                this.toastService.error('仅限图片');
                return;
            }
            let pasteModalRef = this.modalService.open(ChatPasteImageComponent, {
                data: allowed[0]
            });

            pasteModalRef.didDisappear().subscribe((mediaUri) => {
                if (!mediaUri) {
                    return;
                }

                let options: any = {
                    msgType: MsgType.IMAGE,
                    mediaUri: mediaUri
                };

                if (this.sessionType == SessionType.C2C) {
                    options.to = this.chatWith;
                    options.type = this.sessionType;
                }

                let message = this.chatEditorService.createMessage(options);

                this.chatEditorService.send(message);
            })

        } else {
            if (this.pasteTimeout) {
                clearTimeout(this.pasteTimeout);
                this.pasteTimeout = null;
            }

            this.pasteTimeout = setTimeout(() => {
                this.editCtn = this.editCtn.replace(/<[^<>]+>/g, '');
                this.pasteTimeout = null;
            }, 100);
        }

    }
    //TODO
    selectEmoticon(emotion: any) {
        this.insertToEditArea(MessageUtils.getEmoticonByText(emotion.text));
        this.openEmoticon = false;
    }

    alertGag() {
        this.toastService.error('全部禁言!');
    }

    sendMessage() {
        if (!this.editCtn.replace(/<br\/?>/g, "").match(/^\s*$/)) {
            //延迟50秒调用 确保复制粘贴的执行完毕
            let options: any = {
                msgType: MsgType.TEXT,
                content: this.editCtn
            }
            if (this.sessionType == SessionType.C2C) {
                options.to = this.chatWith;
                options.type = this.sessionType;
            }

            let message = this.chatEditorService.createMessage(options);
            this.chatEditorService.send(message);
            this.editCtn = "";
        }
    }

    filterUpload(event: any) {
        if(this.room.chatOpts &&
            this.room.chatOpts.enableOnlyStaffSpeech &&
            this.sessionType == SessionType.GROUP &&
            this.userType != UserType.Staff) {
            event.preventDefault();
            this.toastService.error('全部禁言!');
            return;
        } else if (this.userType == UserType.Visitor &&
            this.sessionType == SessionType.GROUP &&
            !(this.room.chatOpts && this.room.chatOpts.enableVisitorSpeech)) {
            event.preventDefault();
            this.toastService.error("登录后才可发言");
            this.openLogin();
            return;
        }
    }

    send() {
        if (this.pasteTimeout) {
            return;
        }
        if (this.room.chatOpts && this.room.chatOpts.enableOnlyStaffSpeech && this.sessionType == SessionType.GROUP && this.userType != UserType.Staff) {
            this.toastService.error('全部禁言!');
            return;
        } else if (this.userType == UserType.Visitor && this.sessionType == SessionType.GROUP && !(this.room.chatOpts && this.room.chatOpts.enableVisitorSpeech)) {
            this.toastService.error("登录后才可发言");
            this.openLogin();
            return;
        }
        // this.sendMessage();
        this.sendSubject.next();

    }
    get canSend(): boolean {
        return !this.editCtn.replace(/<br\/?>/g, "").match(/^\s*$/);
        // return this.editCtn && !!this.editCtn.trim()
    }

    saveSelectionStatus() {
        this.editAreaSelection = window.getSelection();
        this.editAreaRange = this.editAreaSelection.getRangeAt(0);
    }

    recoverySelectionStatus() {
        if (this.editAreaSelection) {
            this.editAreaSelection.removeAllRanges();
            this.editAreaSelection.addRange(this.editAreaRange);
        }
    }

    setInitRange() {
        let range = document.createRange();
        range.selectNodeContents(this.editArea.nativeElement);
        range.collapse(false);
        this.editAreaSelection.removeAllRanges();
        this.editAreaSelection.addRange(range);
    }

    insertToEditArea(html: any) {

        //恢复recoverySelectionStatus

        let selection,
            range: Range;
        if (!this.editAreaRange) {
            // (<any>window).Zepto(this.editArea).trigger('focus');
            this.editArea.nativeElement.focus();
            this.saveSelectionStatus();
        }
        if (this.editAreaRange) {
            selection = this.editAreaSelection;
            range = this.editAreaRange;
        } else {
            return;
            // selection = window.getSelection();
            // range = selection.getRangeAt(0);
        }
        range.deleteContents();
        let parseHtml = () => {
            let result = null;
            if (range.createContextualFragment) {
                result = range.createContextualFragment(html);
            } else {
                let tmpDiv = this.renderer.createElement("div");
                tmpDiv.innerHTML = html;
                result = document.createDocumentFragment();
                let child = null;
                while (child = tmpDiv.firstChild) {
                    //一个个转移
                    result.appendChild(child);
                }
            }
            return result;
        };
        let node = parseHtml();
        let child = node.lastChild; //先视图渲染
        range.insertNode(node);
        range.setStartAfter(child);
        selection.removeAllRanges();
        selection.addRange(range);
        //设置scrollTop

        this.editCtn = this.editArea.nativeElement.innerHTML;
    }

    onKeyDown(e: any) {
        if (e.keyCode == 13) {
            this.send();
            return false;
        }
        return true;
    }

    lineFeed(e: any) {
    }


    sendPacket() {
        if (this.room && this.room.chatOpts.enableOnlyStaffSpeech && this.userType != UserType.Staff) {
            this.toastService.error('全部禁言!');
            return;
        }
        if (this.userType == UserType.Visitor) {
            this.toastService.error("登录后才可发红包");
            this.openLogin();
            return;
        }
        this.redPacketModalRef = this.modalService.open(RedPacketSendComponent);
        this.redPacketModalRef.didAppear().subscribe(() => {
            var modalDialogEle = this.redPacketModalRef.container.elementRef.nativeElement.querySelector('.modal-dialog');
            this.renderer.setStyle(modalDialogEle, "width", "320px")
            this.renderer.setStyle(modalDialogEle, "margin-left", "auto")
            this.renderer.setStyle(modalDialogEle, "margin-right", "auto")
        })

    }

    ngOnChanges() {

    }

    openLogin() {
        this.pageManager.goLogin();
    }

    @ViewChild('cstServe') cstServe: ElementRef;
    toggleCst(event: any) {
        event.stopPropagation();
        this.showCstServe = !this.showCstServe;
    }

    ngAfterContentInit(): void {
        //有遮盖层更为合适
        this.renderer.listen('window', 'click', (event: any) => {
            if (this.showCstServe) {
                this.showCstServe = false;
                event.preventDefault();
            }
        });
        this.renderer.listen(this.cstServe.nativeElement, 'click', (event: any) => {
            if (this.showCstServe) {
                event.stopPropagation();
                this.showCstServe = false;
            }
        })
    }

    toggleVoice() {
        this.isVoice = !this.isVoice;
    }
    toggleMoreTool(e: any) {
        this.showMoreTool = !this.showMoreTool;
        e.stopPropagation();
    }

    private voiceTimmerHandle: Function = () => {
        let passedTime = (new Date()).getTime() - this.touchStartTime;

        //录音时间大于最长时间
        if (passedTime > (this.voiceMaxTime)) {
            this.isReadyCancelListen = false;
            this.islistening = false;
            //TODO 发送
            return;
        }

        if (passedTime >= (this.voiceMaxTime - 10000)) {
            this.voiceCountdown = parseInt(((this.voiceMaxTime - passedTime) / 1000).toFixed(0));
        } else {
            this.voiceCountdown = null;
        }
    }

    updateEditCtn(content: string) {
        this.editCtn = content;

        this.showSuggest = content.endsWith('@');
    }
}
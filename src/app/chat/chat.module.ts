import { ModuleWithProviders, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ChatComponent } from './chat.component';
import { ChatContentComponent } from "./chat-content/chat-content.component";
import { ChatEditorComponent } from "./chat-editor/chat-editor.component";
import { ChatMessageComponent } from './chat-message/chat-message.component'
import { RedPacketSendComponent } from "./red-packet/red-packet-send.component";
import { RedPacketReceiveComponent } from "./red-packet/red-packet-receive.component";
import { RedPacketRecordComponent } from "./red-packet/red-packet-record.component";
import { RedPacketTipComponent } from "./red-packet/red-packet-tip/red-packet-tip.component";
import { RedPacketTipContentComponent } from "./red-packet/red-packet-tip/red-packet-tip-content.component";

import { ChatService } from './chat.service';
import { ChatMessageService } from "./chat-message.service";
import { ChatEditorService } from "./chat-editor/chat-editor.service";
import { RedPacketService } from "./red-packet/red-packet.service";
import { RedPacketTipService } from "./red-packet/red-packet-tip/red-packet-tip.service";

import { ChatContentService } from "./chat-content/chat-content.service";
import { SharedModule } from "../share/shared.module";
import { ChatContentEditable } from "./chat-editor/chat-contenteditable";
import { EmoticonPipe } from "./emoticon.pipe";
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { RoomContactComponent } from "./room-contact/room-contact.component";
import { GroupChatComponent } from './group-chat.component';
import { ChatNoticeComponent } from "./chat-notice/chat-notice.component";
import { ChatSessionService } from "./chat-session.service";
import { ChatGuideComponent } from "./chat-guide/chat-guide.component";
import { ChatPasteImageComponent } from "./chat-paste-image/chat-paste-image.component";
import {VisitorTipComponent} from "./visitor-tip/visitor-tip.component";

@NgModule({
    imports: [SharedModule],
    exports: [
        ChatComponent,
        RoomContactComponent
    ],
    declarations: [
        ChatComponent,
        ChatContentComponent,
        ChatEditorComponent,
        ChatMessageComponent,
        RedPacketSendComponent,
        RedPacketReceiveComponent,
        RedPacketRecordComponent,
        RedPacketTipComponent,
        RedPacketTipContentComponent,
        ImagePreviewComponent,
        ChatContentEditable,
        EmoticonPipe,
        RoomContactComponent,
        GroupChatComponent,
        ChatNoticeComponent,
        ChatGuideComponent,
        ChatPasteImageComponent,
        VisitorTipComponent
    ],
    providers: [
        DatePipe,
        ChatService,
        ChatEditorService,
        RedPacketService,
        RedPacketTipService,
        ChatContentService,
        EmoticonPipe,
        ChatMessageService,

    ],
    entryComponents: [
        RedPacketSendComponent,
        RedPacketReceiveComponent,
        RedPacketRecordComponent,
        ImagePreviewComponent,
        RedPacketTipContentComponent,
        ChatGuideComponent,
        ChatPasteImageComponent,
        VisitorTipComponent
    ]
})
export class ChatModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ChatModule,
            providers: [
                ChatService,
                ChatEditorService,
                RedPacketService,
                RedPacketTipService,
                ChatContentService,
                ChatMessageService,
                ChatSessionService,
            ]
        }
    }
}

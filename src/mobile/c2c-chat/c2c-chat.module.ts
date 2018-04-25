import { NgModule } from '@angular/core';

import { C2cChatComponent } from './c2c-chat.component';
import { ChatModule } from '../../app/chat/chat.module';
import { SharedModule } from '../../app/share/shared.module';

@NgModule({
    imports: [ChatModule,SharedModule],
    exports: [],
    declarations: [C2cChatComponent],
    providers: [],
})
export class C2cChatModule { }

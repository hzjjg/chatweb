import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from "../share/shared.module";
import { ChatModule } from '../chat/chat.module';
import { ContactListComponent } from "./contact-list.component";
import { ContactItemComponent } from "./contact-item.component";
import { ContactListService } from './contact-list.service';
import { ContactService } from "./contact.service";
import { MemberCountPipe } from "./contact-members-count.pipe.service";

@NgModule({
    declarations: [
        ContactListComponent,
        ContactItemComponent,
        MemberCountPipe
    ],
    imports: [
        SharedModule,
        ChatModule
    ],
    exports: [
        ContactListComponent,
        ContactItemComponent
    ],
    providers: [
        ContactListService,
        ContactService,
        MemberCountPipe
    ]
})
export class ContactModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ContactModule,
            providers: [
                ContactListService
            ]
        }
    }
}
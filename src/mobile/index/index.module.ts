import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ViewFrameworkModule } from "../framework/module";
// import { UserModule } from "../../app/user/module";
import { UserModule } from "../user/module";
import { ContactModule } from "../../app/contact/contact.module";
import { ChatModule } from "../../app/chat/chat.module";

import { IndexComponent } from "./index.component";
import { DiscoverModule } from '../discover/discover.module';
import { MineModule } from "../mine/mine.module";
import { IndexRoutingModule } from './index.routing.module';

@NgModule({
    imports: [
        CommonModule,
        ChatModule.forRoot(),
        ContactModule.forRoot(),
        UserModule.forRoot(),
        ViewFrameworkModule.forRoot(),
        DiscoverModule,
        MineModule,
        IndexRoutingModule
    ],
    declarations: [IndexComponent],
    exports: [IndexComponent],
    providers: [],
})
export class IndexModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IndexModule
        }
    }
}

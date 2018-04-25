import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";


import { SharedModule } from "../app/share/shared.module";
import { SystemModule } from "../app/system/module";

import { IMModule } from "../app/im";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-router.module";
import { ViewFrameworkModule } from "./framework/module";
import { UserModule } from "./user/module";
import { WealthModule } from "../app/wallet/wallet.module";
import { ChatModule } from "../app/chat/chat.module";
import { ContactModule } from "../app/contact/contact.module";
import { IndexModule } from "./index/index.module";
import { DiscoverModule } from "./discover/discover.module";
import { PageManager } from "../app/system/page-manage";
import { MobilePageManager } from "./page-manager";
import { C2cChatModule } from "./c2c-chat/c2c-chat.module";
import { DatePipe } from "@angular/common";
import { StateManagerService } from "../app/system/state-manager.service";


@NgModule({
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: PageManager, useClass: MobilePageManager },
        DatePipe,
        StateManagerService
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        SystemModule.forRoot(),

        AppRoutingModule,
        IndexModule.forRoot(),
        IMModule.forRoot(),
        UserModule.forRoot(),
        ChatModule.forRoot(),
        ContactModule.forRoot(),
        WealthModule.forRoot(),
        DiscoverModule,
        ViewFrameworkModule.forRoot(),
        C2cChatModule
    ],
    exports: [
        // CommonModule,
        // FormsModule,
        // UserModule,
        // ChatModule,
        // ContactModule,
        // DiscoverModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
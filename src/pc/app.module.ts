import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { SharedModule } from "../app/share/shared.module";
import { SystemModule } from "../app/system/module";

import { AppComponent } from "./app.component";
import { IMModule } from "../app/im";
import { ViewFrameworkModule } from "./framework/module";
import { UserModule } from "./user/module";
import { WealthModule } from "../app/wallet/wallet.module";
import { ChatModule } from "../app/chat/chat.module";
import { ContactModule } from "../app/contact/contact.module";
import { PageManager } from "../app/system/page-manage";
import { PcPageManager } from "./page-manager";
import { StateManagerService } from "../app/system/state-manager.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        SharedModule,
        SystemModule.forRoot(),
        IMModule.forRoot(),
        ViewFrameworkModule.forRoot(),
        UserModule.forRoot(),
        ChatModule.forRoot(),
        ContactModule.forRoot(),
        WealthModule.forRoot()
    ],
    exports: [
    ],
    providers: [
        {
            provide: PageManager, useClass: PcPageManager,
        },
        StateManagerService
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
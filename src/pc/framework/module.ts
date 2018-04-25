import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SidebarComponent } from "./sidebar.component";
import { HeaderComponent } from "./header.component";
import { BodyComponent } from "./body.component";
import { FunctionalComponent } from "./functional.component";
import { ContactModule } from "../../app/contact/contact.module";
import { ChatModule } from "../../app/chat/chat.module";
import { UserModule } from "../user/module";
import { MineModule } from "../mine/mine.module";

@NgModule({
    imports: [
        CommonModule,
        ContactModule,
        UserModule,
        ChatModule,
        MineModule
    ],
    exports: [
        HeaderComponent,
        SidebarComponent,
        BodyComponent,
        FunctionalComponent,

    ],
    declarations: [
        HeaderComponent,
        SidebarComponent,
        BodyComponent,
        FunctionalComponent,
    ],
})
export class ViewFrameworkModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ViewFrameworkModule,
            providers: []
        }
    }
}


import {ModuleWithProviders, NgModule} from "@angular/core";
import {SharedModule} from "../../app/share/shared.module";
import {UserHeaderComponent} from "./user-header.component";
import {VisitorService} from "../../app/user/visitor.servcie";
import {RoomService} from "../../app/chat/room.service";
import {UserService} from "../../app/user/user.service";
import {CustomerService} from "../../app/user/customer.service";
import {CaptchaService} from "../../app/user/captcha.service";


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        UserHeaderComponent
    ],
    exports: [
        UserHeaderComponent
    ],
    entryComponents:[
        UserHeaderComponent
    ]
})
export class MineModule {
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: MineModule,
            providers: [
                VisitorService,
                RoomService,
                UserService,
                CustomerService,
                CaptchaService
            ]
        }
    }
}
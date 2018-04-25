
import { ModuleWithProviders, NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../app/share/shared.module";
import { VisitorService } from "../../app/user/visitor.servcie";
import { RoomService } from "../../app/chat/room.service";
import { UserService } from "../../app/user/user.service";
import { CustomerService } from "../../app/user/customer.service";
import { CaptchaService } from "../../app/user/captcha.service";
import { MineComponent } from "./mine.component";


@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    declarations: [
        MineComponent
    ],
    exports: [
        MineComponent
    ],
    entryComponents: [
        MineComponent
    ]
})
export class MineModule {
    static forRoot(): ModuleWithProviders {
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


import { ModuleWithProviders, NgModule } from "@angular/core";
import { SessionService, VisitorService, UserService, CustomerService, EqualValidator, CaptchaService } from "../../app/user";
import { RoomService } from "../../app/chat";
import { LoginComponent } from "../../app/user/login.component";
import { RegisterComponent } from "../../app/user/register.component";
import { SharedModule } from "../../app/share/shared.module";
import { UserModifyPasswordInfoComponent } from "../../app/user/user-modify-password-info.comonent";
import { SettingAvatarComponent } from "../../app/user/setting-avatar.component";
import { UserInfoComponent } from "../../app/user/user-info.component";
import { UserManager } from "../../app/user/user-manager";
import { PCUserManager } from "./user-manager";
import { ImageCropperModule } from "ng2-img-cropper"
import { AvatarCropperComponent } from "../../app/user/avatar-cropper.component";

@NgModule({
    imports: [
        SharedModule,
        ImageCropperModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        EqualValidator,
        UserModifyPasswordInfoComponent,
        SettingAvatarComponent,
        UserInfoComponent,
        AvatarCropperComponent
    ],
    exports: [
        LoginComponent,
        RegisterComponent,
        UserModifyPasswordInfoComponent,
        SettingAvatarComponent,
        UserInfoComponent,
        AvatarCropperComponent
    ],
    entryComponents: [
        LoginComponent,
        RegisterComponent,
        UserModifyPasswordInfoComponent,
        SettingAvatarComponent,
        UserInfoComponent,
        AvatarCropperComponent
    ]
})
export class UserModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: UserModule,
            providers: [
                SessionService,
                VisitorService,
                RoomService,
                UserService,
                CustomerService,
                CaptchaService,
                { provide: UserManager, useClass: PCUserManager }
            ]
        }
    }
}
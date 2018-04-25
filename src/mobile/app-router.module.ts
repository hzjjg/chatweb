import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from "./index/index.component";
import { FunctionalComponent } from "./discover/functional/functional.component";
import { NoticesComponent } from "./discover/notices/notices.component";
import { ConversionMoneyApplyComponent } from "../app/wallet/draw-money/draw-money.component";
import { ConversionMoneyHistoryComponent } from "../app/wallet/draw-money/draw-money-history.component";
import { LoginComponent } from "../app/user/login.component";
import { RegisterComponent } from "../app/user/register.component";
import { C2cChatComponent } from "./c2c-chat/c2c-chat.component";
import { ExtensionComponent } from "./discover/extension/extension.component";


const routes: Routes = [
    {
        path:'',
        redirectTo:"/chat",
        pathMatch:'full'
    },
    {
        path:'',
        component: IndexComponent,
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path: "functional/:name",
        component: FunctionalComponent
    },
    {
        path: "notices",
        component: NoticesComponent
    },
    {
        path: "extension/:type",
        component: ExtensionComponent
    },
    {
        path:'conversion-money-apply',
        component:ConversionMoneyApplyComponent
    },
    {
        path:'conversion-money-work',
        component:ConversionMoneyHistoryComponent
    },
    {
        path:'c2c-chat/:userId',
        component:C2cChatComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}

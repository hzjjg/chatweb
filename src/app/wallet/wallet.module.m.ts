import {ModuleWithProviders, NgModule} from "@angular/core";
import {WalletComponent} from "./wallet.component.m";
import {WithdrawComponent} from "./withdraw.component";
import {SharedModule} from "../share/shared.module";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        WalletComponent,
        WithdrawComponent
    ],
    exports: [
        WalletComponent,
        WithdrawComponent
    ],
    entryComponents: [
        WalletComponent,
        WithdrawComponent
    ]
})

export class WealthModule {
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: WealthModule,
            providers: [

            ]
        }
    }
}
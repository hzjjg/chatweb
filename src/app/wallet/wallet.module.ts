import {ModuleWithProviders, NgModule} from "@angular/core";
import {WalletComponent} from "./wallet.component";
import {WithdrawComponent} from "./withdraw.component";
import {SharedModule} from "../share/shared.module";
import { ConversionMoneyModule } from "./draw-money/draw-money.module";


@NgModule({
    imports: [
        SharedModule,
        ConversionMoneyModule
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
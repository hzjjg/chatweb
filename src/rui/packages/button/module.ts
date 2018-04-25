
import {ModuleWithProviders, NgModule} from "@angular/core";
import {ButtonDirective} from "./button.component";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [ButtonDirective],
    imports: [CommonModule],
    exports: [ButtonDirective],
    entryComponents: []
})
export class ButtonModule {
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: ButtonModule,
            providers: []
        }
    }
}
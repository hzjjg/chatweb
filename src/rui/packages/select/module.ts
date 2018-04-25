import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SelectComponent} from "./select.component";
import {OptionComponent} from "./option.component";

@NgModule({
    declarations: [SelectComponent,OptionComponent],
    imports: [CommonModule],
    exports: [SelectComponent,OptionComponent],
    // entryComponents: [SelectComponent]
})
export class SelectModule {
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: SelectModule,
            providers: []
        }
    }
}
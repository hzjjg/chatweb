import {ModuleWithProviders, NgModule} from "@angular/core";

import { PickerComponent } from "./picker.component";
import { PickerService } from "./picker.service";
import { CommonModule } from "@angular/common";


@NgModule({
    declarations: [
        PickerComponent,
    ],
    imports: [ CommonModule ],
    exports: [ PickerComponent ],
    entryComponents: [ PickerComponent ]
})
export class PickerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PickerModule,
            providers: [
                PickerService
            ]
        }
    }
}
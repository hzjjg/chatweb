import {ModuleWithProviders, NgModule} from "@angular/core";

import {ToastComponent} from "./toast.component";
import {ToastService} from "./toast.service";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        ToastComponent,
    ],
    imports: [ CommonModule ],
    exports: [ ToastComponent ],
    entryComponents: [ ToastComponent ]
})
export class ToastModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ToastModule,
            providers: [
                ToastService,
            ]
        }
    }
}
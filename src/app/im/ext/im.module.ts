
import {ModuleWithProviders, NgModule} from "@angular/core";
import {IMService} from "./im.service";



@NgModule({

})
export class IMModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IMModule,
            providers: [IMService]
        }
    }
}
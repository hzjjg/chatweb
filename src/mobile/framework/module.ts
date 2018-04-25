import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { UserModule } from "../user/module";
import { HeaderComponent } from "./header.component";
import { FooterComponent } from "./footer.component";

@NgModule({
    imports: [
        CommonModule,
        UserModule,
        RouterModule
    ],
    exports: [
        HeaderComponent,
        FooterComponent
        
    ],
    declarations: [
        HeaderComponent,
        FooterComponent
    ],
})
export class ViewFrameworkModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ViewFrameworkModule,
            providers: []
        }
    }
}
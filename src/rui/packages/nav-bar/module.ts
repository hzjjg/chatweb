
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NavBarComponent} from "./nav-bar.component";

@NgModule({
    declarations: [NavBarComponent],
    imports: [CommonModule],
    exports: [NavBarComponent],
    entryComponents: [NavBarComponent]
})
export class NavBarModule {
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: NavBarModule,
            providers: []
        }
    }
}
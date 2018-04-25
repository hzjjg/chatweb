import {ModuleWithProviders, NgModule} from "@angular/core";

import {NoticeComponent} from "./notice.component";
import {NoticeService} from "./notice.service";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        NoticeComponent,
    ],
    imports: [ CommonModule ],
    exports: [ NoticeComponent ],
    entryComponents: [ NoticeComponent ]
})
export class NoticeModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NoticeModule,
            providers: [
                NoticeService,
            ]
        }
    }
}
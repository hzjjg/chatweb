import {ModuleWithProviders, NgModule} from '@angular/core'

import { CommonModule } from '@angular/common'

import { MessageBoxComponent } from './message-box.component'
import { MessageBoxService } from './message-box.service'
import { MessageBoxContainerComponent } from "./message-box-container.component";
import { ModalModule } from "../modal/module";

@NgModule({
    declarations: [
        MessageBoxComponent,
        MessageBoxContainerComponent
    ],
    imports: [CommonModule, ModalModule],
    exports: [MessageBoxComponent, MessageBoxContainerComponent],
    entryComponents: [
        MessageBoxComponent,
        MessageBoxContainerComponent
    ]
})
export class MessageBoxModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MessageBoxModule,
            providers: [MessageBoxService]
        }
    }
}
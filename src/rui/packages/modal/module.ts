import {ModuleWithProviders, NgModule} from "@angular/core";

import {ModalBackdropComponent} from "./modal-backdrop.component";
import {ModalContainerComponent} from "./modal-container.component";
import {ModalService} from "./modal.service";
import {ComponentProxyFactory} from "../shared/component-proxy";
import {PositionService} from "../position/position.service";

@NgModule({
    declarations: [
        ModalBackdropComponent,
        ModalContainerComponent
    ],
    exports: [ModalBackdropComponent],
    entryComponents: [
        ModalBackdropComponent,
        ModalContainerComponent
    ]
})
export class ModalModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ModalModule,
            providers: [
                PositionService,
                ComponentProxyFactory,
                ModalService
            ]
        }
    }
}
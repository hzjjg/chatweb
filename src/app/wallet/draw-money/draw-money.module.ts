import { NgModule } from '@angular/core';

import { ConversionMoneyApplyComponent } from './draw-money.component';
import { ConversionMoneyHistoryComponent } from './draw-money-history.component';
import { ConversionMoneyService } from './draw-money.service';
import { SharedModule } from '../../share/shared.module';
import { ModalRef } from '../../../rui/packages/modal/modal-ref';

@NgModule({
    imports: [SharedModule],
    exports: [ConversionMoneyApplyComponent, ConversionMoneyHistoryComponent],
    declarations: [ConversionMoneyApplyComponent, ConversionMoneyHistoryComponent],
    providers: [ConversionMoneyService,ModalRef],
    entryComponents: [ConversionMoneyApplyComponent, ConversionMoneyHistoryComponent]
})
export class ConversionMoneyModule { }

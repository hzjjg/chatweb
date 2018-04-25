import { Injectable, Optional, ComponentRef } from '@angular/core';
import { PickerComponent } from "./picker.component";
import { DynamicService } from "../shared/dynamic.service";
import { PickerSolt } from './picker-solt'
 
export interface Options {
    solts: PickerSolt[];
    // year?: number;
    // month?: number;
    // day?: number;
}

@Injectable()
export class PickerService {
    picker: any = {};

    constructor(
        @Optional() private root: PickerComponent,
        private dynamic: DynamicService
    ) { }

    show(solts: PickerSolt[]): void  {
        this.createComponent();
        const current = this.picker;
        const timer = setTimeout(() => {
            current.instance.show(solts);
            clearTimeout(timer);
        }, 0)
    }

    close() {
        this.destoryComponent();
    }

    private createComponent(): void {
        const com: ComponentRef<any> = this.dynamic.generator(PickerComponent);
        this.picker = {
            instance: com.instance,
            init: false
        }
    }

    private destoryComponent(): void {
        this.dynamic.destroy(this.picker);
    }
}
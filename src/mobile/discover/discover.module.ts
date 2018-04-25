import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DiscoverComponent } from './discover.component';
import { SharedModule } from '../../app/share/shared.module';
import { FunctionalComponent } from './functional/functional.component';
import { NoticesComponent } from './notices/notices.component';
import {ExtensionComponent} from "./extension/extension.component";


@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    exports: [
        DiscoverComponent,
        FunctionalComponent,
        NoticesComponent,
        ExtensionComponent
    ],
    declarations: [
        DiscoverComponent,
        FunctionalComponent,
        NoticesComponent,
        ExtensionComponent
    ],
    providers: [],
})
export class DiscoverModule { }

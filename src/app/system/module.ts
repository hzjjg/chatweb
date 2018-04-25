

import {ErrorHandler, ModuleWithProviders, NgModule, Optional, SkipSelf} from "@angular/core";
import {ConfigService} from "./config.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {APIInterceptor} from "./api-interceptor";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import {LogService} from "./log.service";
import {AppErrorHandler} from "./error-handler";
import { AudioService } from "./audio.service";


@NgModule({

})
export class SystemModule {
    constructor( @Optional() @SkipSelf() parentModule: SystemModule) {
        throwIfAlreadyLoaded(parentModule, 'SystemModule');
    }
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: SystemModule,
            providers: [
                ConfigService,
                LogService,
                AudioService,
                {provide: ErrorHandler, useClass: AppErrorHandler},
                { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }
            ]
        }
    }
}
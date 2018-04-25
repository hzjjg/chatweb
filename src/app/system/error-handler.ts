


import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {LogService} from "./log.service";


@Injectable()
export class AppErrorHandler extends ErrorHandler{

    constructor(
        private logService: LogService
    ) {
        super();
    }

    handleError(error: any) {
        this.logService.exception(error);
    }
}
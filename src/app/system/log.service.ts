

import {Injectable} from "@angular/core";

@Injectable()
export class LogService {

    constructor() {

    }
    record(event: string, params: any): void {
        try {
            (<any>window).gtag('event', event, params);
        }catch (e) {
            console.log(e);
        }
    }

    exception(description: string): void {
        console.log(description);
        this.record('exception', {
            'description': description,
            'fatal': false
        });
    }
}
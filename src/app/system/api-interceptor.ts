import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";

import {ToastService} from "../rui";
import {Observable} from "rxjs/Rx";
import {environment} from "../../environments/environment";


@Injectable()
export class APIInterceptor implements HttpInterceptor {
    constructor(
        private toastService: ToastService
    ) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let cloneRequest = req;
        if (!environment.production) {
            cloneRequest = req.clone({
                // url: "/im/" + (<any>window).APP_ID + req.url
                url: "/proxy" + req.url
                // url: "/" + req.url
            });
        }



        return next.handle(cloneRequest).catch((err: any, caught: Observable<any>) => {
            if (err instanceof HttpErrorResponse) {
                let response: HttpErrorResponse = err;
                let contentType = response.headers.get("content-type");
                if (contentType && ~contentType.indexOf("application/json")) {
                    // if (response.status == 401) {

                    //     window.location.href = '/login';
                    // }
                    err = new HttpErrorResponse({
                        // The error in this case is the response body (error from the server).
                        error: response.error, //JSON.parse(),
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                    });
                    //或继续 throw err;
                    return Observable.throw(err);
                } else {
                    // this.toastService.error("服务繁忙!");
                    err = new HttpErrorResponse({
                        // The error in this case is the response body (error from the server).
                        error: {
                            code: -1,
                            msg: response.error
                        },
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                    });
                    return Observable.throw(err);
                }
            }
            // return caught;
            return Observable.throw(err);
        });
        // return next.handle(cloneRequest).catch((err: any, caught: Observable<any>) => {
            // if (err instanceof HttpErrorResponse) {
            //     let response: HttpErrorResponse  = err;
            //     let contentType = response.headers.get("content-type");
            //     if (~contentType.indexOf("application/json")) {
            //         if (response.status == 401) {
            //             // window.location.href = '/login';
            //         }
            //         err = new HttpErrorResponse({
            //             // The error in this case is the response body (error from the server).
            //             error: JSON.parse(response.error),
            //             headers: response.headers,
            //             status: response.status,
            //             statusText: response.statusText,
            //             url: response.url,
            //         });
            //         // throw err;都可
            //         return Observable.throw(err);
            //     }
            // }
        //     return caught;
        // });
    }

}
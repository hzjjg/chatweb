import {Observable} from "rxjs/Observable";
import {ModalContainerComponent} from "./modal-container.component";

export class ModalRef {

    private _container: ModalContainerComponent;
    content?: any;

    private _result: any;

    constructor(
    ) {

    }

    set container(container: ModalContainerComponent) {
        this._container = container;
        container.didDisappear().subscribe((result) => {
            this._result = result;
        })
    }

    get container() {
        return this._container;
    } 


    close(result?:any) {
        this.container.close(result);
    }

    // willAppear(): Observable<void> {
    //     return this._willAppear.asObservable();
    // }
    didAppear(): Observable<void> {
        return this.container.didAppear();
    }

    willDisappear(): Observable<any> {
        return this.container.willDisappear();
    }
    didDisappear(): Observable<any> {
        return this.container.didDisappear();
    }
}
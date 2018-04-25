import { Observable } from "rxjs/Observable";

export enum ConnectionStatus {
    CONNECTION = 1,
    OPEN = 2,
    CLOSING = 3,
    CLOSED = 4
}

export abstract class Connection<T> {
    url: string;
    status: ConnectionStatus;
    statusObservable: Observable<ConnectionStatus>;
    on: (data: any) => void;

    constructor(url: string) {
        this.url = url;
    }
    abstract connect(): void;
    abstract close(): void;
    abstract send(data: any): void;


}
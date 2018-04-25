
import { Observable } from "rxjs/Observable";
import {Connection, ConnectionStatus} from "./connection";
import {stringify} from "@angular/core/src/util";

export class WebSocketConnection extends Connection<WebSocketConnection> {


    socket: WebSocket

    constructor(url: string) {
        super(url);


        // this.on = new Subject<any>();

        // this.on = Observable.create<any>((observer: Observer<any>) => {
        // this.socket.onmessage = (msg) => {
        //     // observer.next(msg.data);
        //     this.on.next(msg.data);
        // }
        // })

    }

    connect(): void {
        this.socket = new WebSocket(this.url);
        this.statusObservable = new Observable<ConnectionStatus>(observer  => {
            this.socket.onopen = (event) => {
                observer.next(ConnectionStatus.OPEN);
            };
            this.socket.onclose = (event) => {
                observer.next(ConnectionStatus.CLOSED);
            };
            this.socket.onerror = (event) => {

                observer.next(ConnectionStatus.CLOSED);
            };
        });

        this.socket.onmessage = (msg) => {
            if (msg.data == 'PONG') {
                return;
            }
            if (this.on) {
                this.on(JSON.parse(msg.data));
            }
        }
    }
    close(): void {
        this.socket.close();
    }

    send(data: any): void {
        this.socket.send(data);
    }



}
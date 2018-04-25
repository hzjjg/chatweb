export class HeartbeatCheck {
    timeout = 30000;   //30秒
    timer: any;
    enable: boolean;

    constructor(
        private callback: ()=> void
    ) {
        this.enable = false;
    }
    heartbeat(): void {
        if (this.enable) {
            this.callback();
        }
    }
    start(): void {
        this.enable = true;
        this._start();
    }
    reset(): void {
        this._start();
    }
    _start(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        const callback = (function() {
            this.heartbeat();
            this.timer = null;
            this._start();
        }).bind(this);
        this.timer = setTimeout(callback, this.timeout);
    }
    close(): void {
        this.enable = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

}
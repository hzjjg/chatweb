import {Injectable} from "@angular/core";

//补充
// @Injectable()
export class Backoff {

    private ms: number;
    private max: number;
    //增幅因子
    private factor: number;
    //抖动(避免小波动 导致 同一时刻重连接过多。)
    private jitter: number;
    //尝试次数
    attempts: number;

    constructor(options: any) {
        this.ms = options.min || 100;
        this.max = options.max || 5000;//1e4;
        this.factor = options.factor || 10;
        this.jitter = Math.max(Math.min(options.jitter, 1), 0);
        this.attempts = 0;
    }

    duration() {
        console.log(this.factor, this.attempts++);
        let time = this.ms * Math.pow(this.factor, this.attempts ++);
        if (this.jitter) {
            let t = Math.random(),
                jitterTime = Math.floor(t * this.jitter * time);
            time = time  + ((Math.floor(Math.random() * 10) & 1) == 0 ? -1 : 1) * jitterTime;
        }
        return 0 | Math.min(time, this.max);
    }

    reset() {
        console.log("reset");
        this.attempts = 0;
    }

}
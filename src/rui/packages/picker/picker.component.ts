import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2, Input, Output } from "@angular/core";
import { PickerSolt } from './picker-solt';
import { PickerService } from './picker.service';

@Component({
    selector: 'trip-picker',
    templateUrl: './picker.component.html',
    styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements OnInit {
    solts: PickerSolt[];
    visableCounts: number = 4;
    soltItemHeight: number = 2.5;

    dividerStyles = {
        'margin-top': Math.floor(this.visableCounts / 2) * this.soltItemHeight + "rem",
        'line-height': this.soltItemHeight + 'rem'
    }

    pickerTargetBorderStyles = {
        'top': Math.floor(this.visableCounts / 2) * this.soltItemHeight + "rem",
        'height': this.soltItemHeight + 'rem'
    }

    private results: any[] = [];

    @ViewChild("pickWrapper")
    pickerRef: ElementRef;


    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        // private pickerService: PickerService
    ) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        setTimeout(() => {
            let pickerEle = this.pickerRef.nativeElement;
            let pickerSoltEles = pickerEle.getElementsByClassName("col");
            if (pickerSoltEles.length > 0) {
                for (let i = 0; i < pickerSoltEles.length; i++) {
                    let pickSoltEle = pickerSoltEles[i];
                    let soltIndex = i;
                    let currentSolt = this.solts[soltIndex];
                    let pickerTargetIndex = Math.floor(this.visableCounts / 2);
                    let soltItemindex = currentSolt.defaultIndex || pickerTargetIndex;

                    if (soltItemindex > currentSolt.values.length - 1) {
                        soltItemindex = currentSolt.values.length - 1
                    }

                    let pos = this.soltItemHeight * (pickerTargetIndex - soltItemindex)

                    this.results[soltIndex] = currentSolt.values[soltItemindex];

                    this.renderer.setStyle(pickSoltEle, "-webkit-transform", 'translate3d(0,' + pos + 'rem,0)')
                    this.renderer.setAttribute(pickSoltEle, 'top', pos + "rem")

                    this.renderer.listen(pickSoltEle, 'touchstart', (evnet: any) => {
                        this.gearTouchStart(event);
                    })

                    this.renderer.listen(pickSoltEle, 'touchmove', (evnet: any) => {
                        this.gearTouchMove(event);
                    })

                    this.renderer.listen(pickSoltEle, 'touchend', (evnet: any) => {
                        this.gearTouchEnd(event, soltIndex);
                    })
                }
            }
        });
    }

    show(solts: PickerSolt[]): void {
        this.solts = solts;
    }

    finishPick(): Promise<any> { 
        //TODO 输出 this.result
        // this.pickerService.close();
        return new Promise((resolve) => {
            resolve(this.results);
        })
    }

    cancel() {
        // this.pickerService.close();
    }

    private gearTouchStart(e: any) {
        e.preventDefault();
        var target = e.target;
        while (true) {
            if (!target.classList.contains("picker-solt")) {
                target = target.parentElement;
            } else {
                break
            }
        }
        clearInterval(target["int_"]);
        target["_old"] = e.targetTouches[0].screenY;
        target["o_t_"] = (new Date()).getTime();
        var top = target.getAttribute('top');
        if (top) {
            target["_o_d"] = parseFloat(top.replace(/rem/g, ""));
        } else {
            target["_o_d"] = 0;
        }
    }

    private gearTouchMove(e: any) {
        e.preventDefault();
        var target = e.target;
        while (true) {
            if (!target.classList.contains("picker-solt")) {
                target = target.parentElement;
                // console.dir(target);
            } else {
                break
            }
        }

        target["_new"] = e.targetTouches[0].screenY;
        target["_n_t"] = (new Date()).getTime();
        //var f = (target["_new"] - target["_old"]) * 18 / target.clientHeight;
        var f = (target["_new"] - target["_old"]) * 18 / 370;
        target["_pos"] = target["_o_d"] + f;
        this.renderer.setStyle(target, "-webkit-transform", 'translate3d(0,' + target["_pos"] + 'rem,0)')
        this.renderer.setAttribute(target, "top", target["_pos"] + 'rem')
    }

    private gearTouchEnd(e: any, soltIndex: number) {
        e.preventDefault();
        var target = e.target;
        while (true) {
            if (!target.classList.contains("picker-solt")) {
                target = target.parentElement;
            } else {
                break;
            }
        }
        var flag = (target["_new"] - target["_old"]) / (target["_n_t"] - target["o_t_"]);
        if (Math.abs(flag) <= 0.2) {
            target["spd_"] = (flag < 0 ? -0.08 : 0.08);
        } else {
            if (Math.abs(flag) <= 0.5) {
                target["spd_"] = (flag < 0 ? -0.16 : 0.16);
            } else {
                target["spd_"] = flag / 2;
            }
        }
        if (!target["_pos"]) {
            target["_pos"] = 0;
        }
        this.rollGear(target, soltIndex);
    }

    //缓动效果
    private rollGear(target: any, soltIndex: number) {
        var d = 0;
        var stopGear = false;
        clearInterval(target["int_"]);
        target["int_"] = setInterval(() => {
            var pos = target["_pos"];
            var speed = target["spd_"] * Math.exp(-0.03 * d);
            pos += speed;
            if (Math.abs(speed) > 0.1) { } else {
                speed = 0.1;
                var b = Math.round(pos / this.soltItemHeight) * this.soltItemHeight;
                if (Math.abs(pos - b) < 0.02) {
                    stopGear = true;
                } else {
                    if (pos > b) {
                        pos -= speed
                    } else {
                        pos += speed
                    }
                }
            }
            if (pos > Math.floor(this.visableCounts * this.soltItemHeight / 2)) {
                pos = Math.floor(this.visableCounts * this.soltItemHeight / 2);
                pos -= pos % this.soltItemHeight
                stopGear = true;
            }

            if (pos < -(target.children.length * this.soltItemHeight - Math.floor(this.visableCounts * this.soltItemHeight / 2))) {
                pos = -(target.children.length * this.soltItemHeight - Math.floor(this.visableCounts * this.soltItemHeight / 2));
                pos += this.soltItemHeight - pos % this.soltItemHeight

                stopGear = true;
            }
            if (stopGear) {
                var gearValIndex = -Math.round(pos / this.soltItemHeight) + Math.floor(this.visableCounts / 2);
                this.setPickerValue(target, gearValIndex, soltIndex)
                clearInterval(target["int_"]);
            }

            target["_pos"] = pos;
            this.renderer.setStyle(target, "-webkit-transform", 'translate3d(0,' + pos + 'rem,0)')
            this.renderer.setAttribute(target, 'top', pos + 'rem');
            d++;
        }, 30);
    }

    //滚动后停留的值
    private setPickerValue(target: any, valIndex: any, soltIndex: number) {
        let result = this.solts[soltIndex].values[valIndex];

        this.results[soltIndex] = result;
        if (this.solts[soltIndex].afterSelect && this.solts[soltIndex].afterSelect instanceof Function) {
            this.solts[soltIndex].afterSelect(result);
        }

    }

}
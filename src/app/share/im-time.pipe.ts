
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "imtime",
    pure: true
})
export class IMTimePipe implements PipeTransform{

    formatNum(value: number, number: number) {
        let valueString = (isNaN(value) ? 0 : value).toString(),
            n = number - valueString.length;
        return n > 0 ? [new Array(n + 1).join("0"), valueString].join("") : valueString
    }
    transform(value: any, ...args: any[]): string {
        if(value) {
            if (typeof value == 'string') {
                value = parseInt(value);
            }
            let date = new Date(value),
                now = new Date();

            if (date.getFullYear() != now.getFullYear() ||
                date.getMonth() != now.getMonth() ||
                date.getDate() != now.getDate()) {
                return `${this.formatNum(date.getMonth() + 1, 2)}-${this.formatNum(date.getDate(), 2)} ${this.formatNum(date.getHours(), 2)}:${this.formatNum(date.getMinutes(), 2)}`;
            }
            return this.formatNum(date.getHours(), 2) + ":" + this.formatNum(date.getMinutes(), 2);
            // Math.abs(e.MMDisplayTime - t.CreateTime) >= 180 ? (t.MMDisplayTime = t.CreateTime, t.MMTime = t.MMDigestTime) : (t.MMDisplayTime = e.MMDisplayTime, t.MMTime = "")
        } else {
            return '';
        }

    }
}
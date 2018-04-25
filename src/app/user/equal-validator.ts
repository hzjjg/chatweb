
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";
import {Attribute, Directive, forwardRef} from "@angular/core";

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator),
        multi: true }
]
})
export class EqualValidator implements Validator {
    constructor(@Attribute('validateEqual') public validateEqual: string,
                @Attribute('reverse') public reverse: string) { }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true';
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value
        let v = c.value;

        // control vlaue
        let e = c.root.get(this.validateEqual);

        // value not equal
        // 未设置reverse的值或值为false
        if (e && v !== e.value && !this.isReverse) {
            return {
                validateEqual: true
            }
        }

        // value equal and reverse
        // 若值相等且reverse的值为true，则删除validateEqual异常信息
        if (e && v === e.value && this.isReverse) {
            delete e.errors['validateEqual'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }

        // value not equal and reverse
        // 若值不相等且reverse的值为true，则把异常信息添加到比对的目标控件上
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({ validateEqual: true });
        }
        return null;
    }
}
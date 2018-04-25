

export class AnimationUtils {

    // /**
    //  // * t: current time（当前时间）；
    //    进度
    //  * b: beginning value（初始值）；
    //  * c: change in value（变化量）；
    //  * d: duration（持续时间）。
    //  * @return {number}
    //  */
    // //https://github.com/zhangxinxu/Tween/blob/master/tween.js
    // static easeIn(t: number, b: number, c: number, d: number):number {
    //     return c * (t /= d) * t + b;
    // };


    static timeLast: number = 0;

    //动画
    //http://www.zhangxinxu.com/wordpress/2013/09/css3-animation-requestanimationframe-tween-%E5%8A%A8%E7%94%BB%E7%AE%97%E6%B3%95/
    //帧动画
    //https://github.com/julianshapiro/velocity/blob/master/velocity.js
    public static rAFShim: (callback: any) => any = function() {
        return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || (<any>window).mozRequestAnimationFrame || function (callback: any) {
            let timeCurrent = (new Date()).getTime(),
                timeDelta: number;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - AnimationUtils.timeLast));
                AnimationUtils.timeLast = timeCurrent + timeDelta;

            return setTimeout(function () {
                callback(timeCurrent + timeDelta);
            }, timeDelta);
        }
    }();


}
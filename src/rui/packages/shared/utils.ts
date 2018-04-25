export class Utils {


    // 使得布局渲染 当在修改样式时 将可触发动画
    // https://github.com/valor-software/ngx-bootstrap/blob/development/src/utils/utils.class.ts
    static reflow(element: any): void {
        element.offsetHeight
        // ((bs: any): void => bs)(element.offsetHeight);
    }

    // source: https://github.com/jquery/jquery/blob/master/src/css/var/getStyles.js
    static getStyles(elem: any): any {
        // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        let view = elem.ownerDocument.defaultView;

        if (!view || !view.opener) {
            view = window;
        }

        return view.getComputedStyle(elem);
    }
}
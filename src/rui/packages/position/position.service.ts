
import {ElementRef, Injectable} from "@angular/core";

// export interface  PositionOptions {
//     element?: HTMLElement | ElementRef | string;
//
//     target?: HTMLElement | ElementRef | string;
//
//     //附属于
//     attachment?: string
//
//     appendToBody?:boolean
// }


/**
 * https://github.com/valor-software/ngx-bootstrap/blob/development/src/positioning/ng-positioning.ts
 */
@Injectable()
export class PositionService {

    layout(
        element: HTMLElement,
        targetElement: HTMLElement,
        placement: string,
        appendToBody: boolean): ClientRect {

        const elementPosition = appendToBody? this.offset(element) : this.position(element)
        const targetElementStyles = getAllStyles(targetElement);


        const targetElementBCR = targetElement.getBoundingClientRect();
        const placements = placement.split(' ');
        let placementPrimary = placements[0] || 'top';
        const placementSecondary = placements[1] || 'center';

        //待完善 布局计算
        return null;

    }

    /**
     * 当前位置信息
     * @param element
     * @param round
     * @return {ClientRect}
     */
    public position(element: HTMLElement, round = true): ClientRect {
        let elementPosition: ClientRect;

        if (getStyle(element, 'position') === 'fixed') {
            elementPosition = element.getBoundingClientRect();
        } else {
            const offsetParentElement = this.offsetParent(element);
            elementPosition = this.offset(element, false);
            let parentOffset: ClientRect = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
            }

            if (offsetParentElement !== document.documentElement) {
                parentOffset = this.offset(offsetParentElement);
            }
            parentOffset.top += offsetParentElement.clientTop; //有border情况
            parentOffset.left += offsetParentElement.clientLeft;

            elementPosition.top -= parentOffset.top;
            elementPosition.bottom -= parentOffset.top;
            elementPosition.left -= parentOffset.left;
            elementPosition.right -= parentOffset.left;
        }

        if (round) {
            roundPosition(elementPosition);
        }

        return elementPosition;
    }

    /**
     * 相对于当前文档offset
     * @param element
     * @param round
     */
    public offset(element: HTMLElement, round = true): ClientRect {
        const clientRect = element.getBoundingClientRect();
        const viewportOffset = {
            top: window.pageYOffset, //- document.documentElement.clientTop, 兼容
            left: window.pageXOffset //- document.documentElement.clientLeft
        }
        let elementOffset = {
            top: clientRect.top + viewportOffset.top,
            left: clientRect.left + viewportOffset.left,
            bottom: clientRect.bottom + viewportOffset.top,
            right: clientRect.right + viewportOffset.left,
            width: clientRect.width || element.offsetWidth,
            height: clientRect.height || element.offsetHeight,
        }
        if (round) {

        }
        return elementOffset;
    }

    /**
     * 有效的父元素
     */
    private offsetParent(element: HTMLElement): HTMLElement {
        let offsetParentElement = <HTMLElement>element.offsetParent || document.documentElement;

        while(
            offsetParentElement &&
            offsetParentElement !== document.documentElement &&
            isStaticPosition(offsetParentElement)
            ) {
            offsetParentElement = <HTMLElement>offsetParentElement.offsetParent;
        }

        return offsetParentElement || document.documentElement;
    }



    // private positionElements(
    //     hostElement: HTMLElement,
    //     targetElement: HTMLElement,
    //     placement: string,
    //     appendToBody?: boolean
    // ): ClientRect {
    //
    // }
}

// function getHtmlElement(element: HTMLElement | ElementRef | string) : HTMLElement {
//
//     if (typeof element === 'string') {
//         return document.querySelector(element) as HTMLElement;
//     }
//
//     if (element instanceof ElementRef) {
//         return element.nativeElement;
//     }
//
//     return element as HTMLElement
// }

function getAllStyles(element: HTMLElement): CSSStyleDeclaration{
    return window.getComputedStyle(element)
}
function getStyle(element: HTMLElement, prop: string): string {
    return getAllStyles(element) [prop];
}
function isStaticPosition(element: HTMLElement): boolean {
    return (getStyle(element, 'position') || 'static') === 'static';
}
function roundRect(clientRect: any) {
    clientRect.height = Math.round(clientRect.height);
    clientRect.width = Math.round(clientRect.width);
    roundPosition(clientRect);
}
function roundPosition(clientRect: any) {
    clientRect.top = Math.round(clientRect.top);
    clientRect.bottom = Math.round(clientRect.bottom);
    clientRect.left = Math.round(clientRect.left);
    clientRect.right = Math.round(clientRect.right);
}
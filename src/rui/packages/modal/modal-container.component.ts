import {Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ModalService} from "./modal.service";
import {CLASS_NAME, TRANSITION_DURATIONS} from "./modal-options";
import {ModalRef} from "./modal-ref";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'modal-container',
    template: `
        <div [class]="'modal-dialog'">
            <div class="modal-content">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    host: {
        'class': 'modal',
        'tabindex': '-1',
        '[hidden]': 'isHidden'
    },
})
export class ModalContainerComponent implements OnInit, OnDestroy{

    shown: boolean;
    hiding: boolean = false;
    public level: number;

    private _didAppear = new Subject<void>();
    private _willDisappear = new Subject<any>();
    private _didDisappear = new Subject<any>();

    constructor(
        public elementRef: ElementRef,
        private renderer: Renderer2,
        private modalService: ModalService,
    ) {

    }
    ngOnInit(): void {
        this.renderer.addClass(
            this.elementRef.nativeElement,
            CLASS_NAME.FADE
        );
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'display', 'block'
        );
        setTimeout(() => {
            //完整显示
            this.shown = true;
            this.renderer.addClass(
                this.elementRef.nativeElement,
                CLASS_NAME.SHOW
            );
            this._didAppear.next();
            this._didAppear.complete();
        }, TRANSITION_DURATIONS.BACKDROP);

        if (document && document.body) {
            //如果只有一个 验证滚动条, 设置滚动

            this.renderer.addClass(document.body, CLASS_NAME.OPEN)
        }
    }

    get isHidden() {
        return this.level != this.modalService.getModalsCount()
    }
    //导致迅速更新时会关闭
    // @HostListener('click', ['$event'])
    // onClick(event: any): void {
    //     if (this.elementRef.nativeElement.contains(event.target)) {
    //         return;
    //     }
    //     //是否忽略
    //     // 关闭原因
    //     this.close();
    // }
    @HostListener('window:keydown.esc')
    onEsc(): void {
        //当前是否最顶层
        if (this.modalService.getModalsCount() == this.level) {
            this.close();
        }
    }

    ngOnDestroy(): void {
        if (this.shown) {
            this.close();
        }
    }

    close(result?: any): void {
        if (this.hiding || !this.shown) {
            return;
        }
        this.hiding = true;
        this.renderer.removeClass(
            this.elementRef.nativeElement,
            CLASS_NAME.SHOW
        );
        this._willDisappear.next(result);
        this._willDisappear.complete();
        setTimeout(() => {
            this.shown = false;

            //当前是否需移除modal-open
            if (document && document.body &&
                this.modalService.getModalsCount() === 1) {
                this.renderer.removeClass(document.body, CLASS_NAME.OPEN);
            }
            this.modalService.close(this.level);
            //service hide
            this._didDisappear.next(result);
            this._didDisappear.complete();
            this.hiding = false;
        }, TRANSITION_DURATIONS.MODAL);
    }

    didAppear(): Observable<void> {
        return this._didAppear.asObservable();
    }

    willDisappear(): Observable<void> {
        return this._willDisappear.asObservable();
    }
    didDisappear(): Observable<void> {
        return this._didDisappear.asObservable();
    }


}
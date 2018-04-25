
import {ComponentRef, Injectable, InjectionToken, Renderer2, RendererFactory2, TemplateRef} from "@angular/core";
import {ModalBackdropComponent} from "./modal-backdrop.component";
import {ComponentProxy, ComponentProxyFactory} from "../shared/component-proxy";
import {ModalContainerComponent} from "./modal-container.component";
import {TRANSITION_DURATIONS} from "./modal-options";
import {ModalRef} from "./modal-ref";

export const MODAL_DATA = new InjectionToken<any>('ModalData');
//可注入 @Inject(MODAL_DATA) public data: any



/**
 * modal 与 backdrop分离管理
 */
@Injectable()
export class ModalService {

    // options: {
        // backdrop: true,
        // keyboard: true,
        // focus: true,
        // show: false,
        // ignoreBackdropClick: false,
        // class: '',
        // animate: boolean
    // }

    protected backdropRef: ComponentRef<ModalBackdropComponent>;
    private backdropProxy: ComponentProxy<ModalBackdropComponent>;
    // private renderer: Renderer2


    private modalsCount = 0;
    private componentProxies: ComponentProxy<ModalContainerComponent>[] = [];


    constructor(
        // rendererFactory: RendererFactory2,
        private componentProxyFactory: ComponentProxyFactory
    ) {
        this.backdropProxy = this.componentProxyFactory.createProxy<ModalBackdropComponent>(
            null,
            null,
            null
        );
        //
        // this.renderer = rendererFactory.createRenderer(null, null);
    }


    open(content: string | TemplateRef<any> | any, options?: any): ModalRef {
        this.modalsCount ++;
        options = Object.assign({}, options);

        const proxy = this.createModalProxy();

        this.showBackdrop();

        const modalRef = new ModalRef();
        const modalContainerRef = proxy
            //options
            .provide({provide: MODAL_DATA, useValue: options.data})
            .provide({provide: ModalRef, useValue: modalRef})
            .attach(options.container || ModalContainerComponent)
            .to('body')
            .create({content});
        modalContainerRef.instance.level = this.modalsCount;
        modalRef.container = modalContainerRef.instance;
        modalRef.content = proxy.innerComponent || null;
        return modalRef;
    }

    close(level: number) {
        this.modalsCount = Math.max(this.modalsCount - 1, 0);

        this.hideBackdrop();
            // this.resetScrollbar();
        setTimeout(() => {
            this.destroyModal(level)
            this.removeModalProxy(level)
        },  TRANSITION_DURATIONS.BACKDROP)
    }


    private showBackdrop(): void {
        if (this.modalsCount === 1) {
            this.removeBackdrop(); //确保

            //是否使用backdrop
            this.backdropProxy
                .attach(ModalBackdropComponent)
                .to('body')
                .create();
            this.backdropRef = this.backdropProxy.componentRef;
        }
    }

    private hideBackdrop(): void {
        if (!this.backdropRef) {
            return;
        }
        if (this.modalsCount == 0) {
            this.backdropRef.instance.shown = false;
            setTimeout(() => {
                this.removeBackdrop();
            }, TRANSITION_DURATIONS.BACKDROP)
        }
    }

    private removeBackdrop() {
        this.backdropProxy.destroy();
        this.backdropRef = null;
    }

    private destroyModal(level: number) {
        const modalProxy = this.componentProxies[level - 1];
        if (modalProxy) {
            modalProxy.destroy()
        }
    }

    private createModalProxy() {
        const proxy = this.componentProxyFactory.createProxy<ModalContainerComponent>(
            null,
            null,
            null
        );
        this.componentProxies.push(proxy);
        return proxy;
    }
    private removeModalProxy(level: number) {
        this.componentProxies.splice(level - 1, 1);
        this.componentProxies.forEach((proxy, i:number) => {
            proxy.instance.level = i + 1;
        })
    }

    getModalsCount(): number {
        return this.modalsCount;
    }
}
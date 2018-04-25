import { Injectable, Optional, ComponentRef, Renderer2, RendererFactory2 } from '@angular/core';

import { ToastComponent } from "./toast.component";

import { ComponentProxy, ComponentProxyFactory } from "../shared/component-proxy";
import { environment } from '../../../environments/environment';

export interface Options {
    obj?: any
}

export class ToastRef {

    container: any; //ComponentRef<C>;
    content?: any;

    close: () => void = Function;
}

@Injectable()
export class ToastService {
    toastPool: any[] = [];
    isMobile = environment.app == 'mobile';
    private defaultPosition: string;
    private toastCount = 0;
    private componentProxies: ComponentProxy<ToastComponent>[] = [];
    constructor(
        private rendererFactory: RendererFactory2,
        private componentProxyFactory: ComponentProxyFactory
        // private dynamic: DynamicService
    ) {
        this.defaultPosition = this.isMobile ? 'bottom' : 'top'
    }

    success(message: string, position: string = this.defaultPosition) {
        this.show({
            position: position,
            type: 'success',
            message: message,
        })
    }
    error(message: string, position: string = this.defaultPosition) {
        this.show({
            position: position,
            type: 'error',
            message: message,
        })
    }
    warning(message: string, position: string = this.defaultPosition) {
        this.show({
            position: position,
            type: 'warning',
            message: message,
        })
    }
    info(message: string, position: string = this.defaultPosition) {
        this.show({
            position: position,
            type: 'info',
            message: message,
        })
    }

    show(options: any): ToastRef {
        this.toastCount++;
        const proxy = this.createToastProxy();
        const toastRef = new ToastRef();
        const toastContainerRef = proxy
            .provide({ provide: ToastRef, useValue: toastRef })
            .attach(options.component || ToastComponent)
            .to('body')
            .create({ content: options.message });
        toastContainerRef.instance.level = this.toastCount;
        toastContainerRef.instance.type = options.type;
        toastContainerRef.instance.position = options.position || 'top';
        toastRef.close = () => {
            toastContainerRef.instance.close();
        };
        toastRef.container = toastContainerRef;
        toastRef.content = proxy.innerComponent || null;
        return toastRef;
        // if(this.toastPool.length === 0 || this.toastPool[this.toastPool.length - 1].init) {
        //     this.createToast();
        // }
        // const current = this.toastPool[this.toastPool.length - 1];
        // current.init = true;
        //
        // current.instance.onDestroy = () => {
        //     // component detach and destroy
        //     this.dynamic.destroy(current.copy);
        //     //在pool移除
        //     const index = this.toastPool.findIndex(com => com.id == current.id);
        //      if (~index) this.toastPool.splice(index, 1)
        // }
        //
        // const timer = setTimeout(() => {
        //     current.instance.show(obj);
        //     clearTimeout(timer);
        // }, 0)
    }

    close(level: number) {
        this.toastCount = Math.max(this.toastCount - 1, 0);
        this.destroyToast(level);
        this.removeToastProxy(level);
    }


    private destroyToast(level: number) {
        const toastProxy = this.componentProxies[level - 1];
        if (toastProxy) {
            toastProxy.destroy()
        }
    }
    createToastProxy(): ComponentProxy<ToastComponent> {
        const proxy = this.componentProxyFactory.createProxy<ToastComponent>(
            null,
            null,
            this.rendererFactory.createRenderer(null, null),
        );
        this.componentProxies.push(proxy);
        return proxy;
        // const com: ComponentRef<any> = this.dynamic.generator(ToastComponent);
        // this.toastPool.push({
        //     instance: com.instance,
        //     id: com.instance.id,
        //     copy: com,
        //     init: false
        // })
    }

    private removeToastProxy(level: number) {
        this.componentProxies.splice(level - 1, 1);
        this.componentProxies.forEach((proxy, i: number) => {
            proxy.instance.level = i + 1;
        })
    }


}


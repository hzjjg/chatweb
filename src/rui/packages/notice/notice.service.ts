import { Injectable, Optional, ComponentRef, RendererFactory2 } from '@angular/core';

import { NoticeComponent } from "./notice.component";
import { NoticeOptions, NoticeRef } from "./notice";
import { ComponentProxy, ComponentProxyFactory } from "../shared/component-proxy";

@Injectable()
export class NoticeService {
    private defaultPosition: string;
    // private noticeCount = 0;
    private componentProxies: ComponentProxy<NoticeComponent>[] = [];
    private _maxNum = 6;
    constructor(
        private rendererFactory: RendererFactory2,
        private componentProxyFactory: ComponentProxyFactory,
    ) { }

    show(options: NoticeOptions): NoticeRef {
        // this.noticeCount++;
        const proxy = this.createNoticeProxy();
        const noticeRef = new NoticeRef();
        const noticeContainerRef = proxy
            .provide({ provide: NoticeRef, useValue: noticeRef })
            .attach(NoticeComponent)
            .to('body')
            .create({ content: options.content });
        options.title && (noticeContainerRef.instance.title = options.title)
        options.footer && (noticeContainerRef.instance.footer = options.footer)
        options.duration && (noticeContainerRef.instance.duration = options.duration)
        options.iconClass && (noticeContainerRef.instance.iconClass = options.iconClass)
        options.customClass && (noticeContainerRef.instance.customClass = options.customClass)

        noticeContainerRef.instance.level = this.componentProxies.length
        // noticeContainerRef.instance.type = options.type;
        // noticeContainerRef.instance.animate = options.animate;
        // noticeContainerRef.instance.position = options.position || 'bottom-right';

        noticeRef.close = () => {
            noticeContainerRef.instance.close();
        };
        noticeRef.container = noticeContainerRef;
        noticeRef.content = proxy.innerComponent || null;
        this.resetPosition();

        return noticeRef;
    }

    notify(content: string, title?: string, footer?: string) {
        this.show({
            content: content,
            title: title,
            footer: footer
        })
    }

    success(content: string, title?: string, footer?: string) {
        this.show({
            content: content,
            title: title,
            footer: footer,
            customClass:'notify-success',
            iconClass:'fa-check-circle'
        })
    }
    
    warning(content: string, title?: string, footer?: string) {
        this.show({
            content: content,
            title: title,
            footer: footer,
            customClass:'notify-warning',
            iconClass:'fa-exclamation-circle'
        })
    }
    
    info(content: string, title?: string, footer?: string) {
        this.show({
            content: content,
            title: title,
            footer: footer,
            customClass:'notify-info',
            iconClass:'fa-info-circle',
        })
    }
    
    error(content: string, title?: string, footer?: string) {
        this.show({
            content: content,
            title: title,
            footer: footer,
            customClass:'notify-error',
            iconClass:'fa-times-circle',
        })
    }

    private resetPosition() {
        this.componentProxies.forEach((proxy, i: number) => {
            proxy.instance.updatePosition(this.componentProxies.length);
        })
    }

    public get maxNum(): number {
        return this._maxNum;
    }


    public set maxNum(v: number) {
        this._maxNum = v;
    }

    close(level: number) {
        // this.noticeCount = Math.max(this.noticeCount - 1, 0);
        this.destroyNotice(level);
        this.removeNoticeProxy(level);
    }

    private destroyNotice(level: number) {
        const noticeProxy = this.componentProxies[level - 1];
        if (noticeProxy) {
            noticeProxy.destroy()
        }
    }

    private createNoticeProxy(): ComponentProxy<NoticeComponent> {
        const proxy = this.componentProxyFactory.createProxy<NoticeComponent>(
            null,
            null,
            this.rendererFactory.createRenderer(null, null),
        );
        if (this.componentProxies.length >= this._maxNum) {
            this.destroyNotice(1);
            this.removeNoticeProxy(1)
        }
        this.componentProxies.push(proxy);
        return proxy;
    }

    private removeNoticeProxy(level: number) {
        this.componentProxies.splice(level - 1, 1);
        this.componentProxies.forEach((proxy, i: number) => {
            proxy.instance.level = i + 1;
        })
        this.resetPosition();
    }
}



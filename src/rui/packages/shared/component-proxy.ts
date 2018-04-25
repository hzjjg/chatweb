import {
    ApplicationRef,
    ComponentFactoryResolver, ElementRef, Injector, NgZone, Provider,
    ReflectiveInjector,
    Renderer2, Type,
    ViewContainerRef, ComponentFactory, ComponentRef, EmbeddedViewRef, TemplateRef, ViewRef, EventEmitter, Injectable
} from "@angular/core";
import {PositionService} from "../position/position.service";

@Injectable()
export class ComponentProxyFactory {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        // private ngZone: NgZone,
        private injector: Injector,
        // private positionService: PositionService,
        private applicationRef: ApplicationRef
    ) {

    }
    createProxy<T>(
        elementRef: ElementRef,                 //组件
        viewContainerRef: ViewContainerRef,     //组件容器
        renderer: Renderer2
    ): ComponentProxy<T> {
        return new ComponentProxy<T>(
            viewContainerRef,
            renderer,
            elementRef,
            this.injector,
            this.componentFactoryResolver,
            // this.ngZone,
            this.applicationRef,
            // this.positionService
        )
    }
}
/**
 * 组件代理
 * - 显示隐藏管理
 * - 生命周期回调
 *
 *
 * - 事件抽离出去
 */
export class ComponentProxy<T> {

    onBeforeShow: EventEmitter<any> = new EventEmitter();
    onShown: EventEmitter<any> = new EventEmitter();
    onBeforeHide: EventEmitter<any> = new EventEmitter();
    onHidden: EventEmitter<any> = new EventEmitter();

    //当前管理的组件
    instance: T
    componentRef: ComponentRef<T>
    // inlineViewRef: EmbeddedViewRef<T>

    outsideClick: boolean

    private providers: Provider[] = []
    private componentFactory: ComponentFactory<T>
    // private zoneSubscription: any


    //管理组件内部内容
    private contentRef: ContentRef
    private _innerComponent: T

    get innerComponent() {
        return this._innerComponent;
    }
    /**
     * A selector specifying the element the popover should be appended to.
     * Currently only supports "body".
     */
    private container: string | ElementRef | any;


    //要记录 注意销毁
    private globalListener: Function;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private injector: Injector,
        private componentFactoryResolver: ComponentFactoryResolver,
        // private ngZone: NgZone,
        private applicationRef: ApplicationRef,
        // private positionService: PositionService
    ) {

    }

    attach(componentType: Type<T>): ComponentProxy<T> {
        this.componentFactory = this.componentFactoryResolver
            .resolveComponentFactory(componentType);
        return this;
    }
    to(container?: string): ComponentProxy<T> {
        this.container = container || this.container;

        return this;
    }

    provide(provider: Provider): ComponentProxy<T> {
        this.providers.push(provider);

        return this;
    }

    create(
        opts: {
            content?: string | TemplateRef<any>;
            context?: any;
            [key: string]: any
        } = {}
    ): ComponentRef<T> {
        // this.zone.runOutsideA
        // if (this.com)
        // this.subscribePosition()
        this._innerComponent = null;
        if (!this.componentRef) {
            this.onBeforeShow.emit();
            this.contentRef = this.getContentRef(opts.content, opts.context);
            const injector = ReflectiveInjector.resolveAndCreate(this.providers, this.injector)

            this.componentRef = this.componentFactory.create(
                injector,
                this.contentRef.nodes
            )

            this.applicationRef.attachView(this.componentRef.hostView);

            this.instance = this.componentRef.instance;

            //将选项拷贝到组件上
            Object.assign(this.componentRef.instance, opts);

            if (this.container instanceof ElementRef) {
                this.container.nativeElement.appentChild(
                    this.componentRef.location.nativeElement
                )
            }

            if (this.container === 'body' && typeof document !== 'undefined') {
                document
                    .querySelector(this.container as string)
                    .appendChild(this.componentRef.location.nativeElement)
            }


            if (!this.container &&
                this.elementRef &&
                this.elementRef.nativeElement.parentElement) {
                this.elementRef.nativeElement.parentElement.appendChild(
                    this.componentRef.location.nativeElement
                );
            }

            //来源于组件
            if (this.contentRef.componentRef) {
                this._innerComponent = this.contentRef.componentRef.instance
                this.contentRef.componentRef.changeDetectorRef.markForCheck();
                this.contentRef.componentRef.changeDetectorRef.detectChanges();
            }

            //TODO: 用途？
            this.componentRef.changeDetectorRef.markForCheck()
            this.componentRef.changeDetectorRef.detectChanges()

            this.onShown.emit(this.componentRef.instance)
        }

        this.registerOutsideClick()

        return this.componentRef;
    }

    destroy(): ComponentProxy<T> {
        if (!this.componentRef) {
            return this;
        }

        this.onBeforeHide.emit(this.componentRef.instance);

        // appRef.detachView(com.hostView) 不需要吗？
        //删除组件
        const componentElement = this.componentRef.location.nativeElement
        componentElement.parentElement.removeChild(componentElement)
        if (this.contentRef.componentRef) {
            //若内容为组件 则销毁
            this.contentRef.componentRef.destroy()
        }
        this.componentRef.destroy()
        if (this.viewContainerRef && this.contentRef.viewRef) {
            this.viewContainerRef.remove(
                this.viewContainerRef.indexOf(this.contentRef.viewRef)
            )
        }

        this.contentRef = null
        this.componentRef = null

        if (this.globalListener) {
            this.globalListener()
            this.globalListener = null
        }

        this.onHidden.emit()

        return this
    }

    // dispose(): void {
    //     // this.show
    //     //是否显示
    //
    //     // this.unsubscribePosition();
    //     // if (this.unregisterListenersFn)
    //
    // }

    // private subscribePosition(): void {
    //     if (this.zoneSubscription) {
    //         return;
    //     }
    //     this.zoneSubscription = this.ngZone.onStable.subscribe(() => {
    //         // if (this.componentRef)
    //         // this.positionService.position()
    //         //计算引用
    //
    //     });
    // }

    //removeGlobalListener
    // attachInline() {
    //
    // }
    //注册外部点击，关闭
    private registerOutsideClick(): void {
        if (!this.componentRef || !this.componentRef.location) {
            return;
        }

        //outside click
        const target = this.componentRef.location.nativeElement;

        // why: should run after first event bubble
        //异步设置 意义？
        // setTimeout()
        if (this.outsideClick) {
            this.globalListener = registerOutsideClick(
                this.renderer,
                [target, this.elementRef.nativeElement],
                () => {
                    //应回调出去 由外面来处理
                    this.destroy();
                }
            )
        }

    }

    // private unsubscribePosition(): void {
    //     if (!this.zoneSubscription) {
    //         return;
    //     }
    //     this.zoneSubscription.unsubscribe();
    //     this.zoneSubscription = null;
    // }

    private getContentRef(
        content: string | TemplateRef<any> | any,
        context?: any
    ): ContentRef {
        if (!content) {
            return new ContentRef([]);
        }

        if (content instanceof TemplateRef) {
            let viewRef = null;
            if (this.viewContainerRef) {
                viewRef = this.viewContainerRef
                    .createEmbeddedView<TemplateRef<T>>(content, context);
            } else {
                viewRef = content.createEmbeddedView({});
                this.applicationRef.attachView(viewRef);
            }
            return new ContentRef([viewRef.rootNodes], viewRef);
        }

        if (typeof content === 'function') {
            const contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
                content
            )
            const modalContentInjector = ReflectiveInjector.resolveAndCreate(
                [...this.providers],
                this.injector
            )
            const componentRef = contentComponentFactory.create(modalContentInjector);
            this.applicationRef.attachView(componentRef.hostView)

            return new ContentRef(
                [[componentRef.location.nativeElement]],
                componentRef.hostView,
                componentRef
            )
        }
        return new ContentRef([[this.renderer.createText(`${content}`)]])
    }
}

export function registerOutsideClick(
    renderer: Renderer2,
    excludeTargets: HTMLElement[],
    hide: (event: any) => void
) {
    return renderer.listen('document', 'click', (event: any) => {
        if (excludeTargets && excludeTargets.some(target => target.contains(event.target))) {
            return;
        }
        hide(event);
    })
}

export class ContentRef {
    constructor(
        public nodes: any[],
        public viewRef?: ViewRef,
        public componentRef?: ComponentRef<any>
    ) {

    }
}
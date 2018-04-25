export class NoticeOptions {
    content: string
    title?: string
    footer?: string  //时间之类
    duration?: number = 3000
    iconClass?:string  //fontawsome
    customClass?:string
    // zindex?:number
    // offset?:number
    // position?: string
}



export class NoticeRef {
    container: any; //ComponentRef<C>;
    content?: any;
    close: () => void = Function;
}
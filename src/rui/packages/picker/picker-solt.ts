export class PickerSolt {
    //data
    values: any[];
    flex?: number = 1;
    className?: string;
    textAlign?: string = 'center';
    defaultIndex?: number = 0;
    afterSelect?: Function = (value: any) => { };
    //分隔符
    dividerContent?: string;
}
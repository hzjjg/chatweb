export enum WorkReviewStatus {
    ADOPTED = 'Adopted',
    REJECTED = 'Rejected',
    WAITING = 'Waiting'
}


export class ConversionMoneyWork {
    money: number;
    status: WorkReviewStatus;
    reviewTime:number; //审核时间
    reason:string;
    remark:string;
}
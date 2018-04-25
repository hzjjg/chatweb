export enum WorkReviewStatus {
    ADOPTED = 'Adopted',
    REJECTED = 'Rejected',
    WAITING = 'Waiting'
}

export enum WorkType {
    CONVERT_MONEY = 'ConvertMoney'
}

export abstract class Work {
    workId: string;
    type: WorkType;
    cstId: number;
    username: string;
    createTime: number;

    constructor(type: WorkType) {
        this.type = type
    }
}

export class ConversionMoneyWork extends Work {
    money: number;
    status: WorkReviewStatus;
    reviewTime: number; //审核时间
    reason: string;
    remark: string;

    constructor() {
        super(WorkType.CONVERT_MONEY)
    }
}
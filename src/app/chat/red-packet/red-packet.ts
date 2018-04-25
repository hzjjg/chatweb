export class RedPacketCreateInfo {
    count: number;
    amount: number;
    description: string
    takeRate?: number;
}

export enum RedPacketStatus {
    Normal = 'Normal',
    HaveReceived = "HaveReceived",
    Finished = "Finished"
}

export class RedPacketInfo {
    packetId: number;
    token: string;
    from: string;
    fromNick: string;
    fromAvatar: string;
    description: string;
    //分配个数
    count: number;  //发放数量
    remain: number; //剩余个数
    amount: number; //总金额
    balance: number; //剩余金额
    allots: RedPacketInfoAllot[];
    time?:number;
}

export class RedPacketInfoAllot {
    userId: number;
    nickname: string;
    avatar: string;
    money: number;
    time: number;
}

export class RedPacketTip {
    packetId: number;
    token: string;
    from: string;
    fromNick: string;
    fromAvatar: string;
    time?:number;
    // description?: string;
    allots?: RedPacketTipAllot[]
}

export class RedPacketTipAllot {
    userId: number;
    nickname: string;
    avatar: string;
    time: number;
}
//连接状态
export enum ConnectStatus {
    ON,                   //正常
    OFF,                  //断开
    CONNECTING,              //连接中
}



//消息类型
export enum MsgType {
    TEXT="Text",      //普通消息
    IMAGE="Image",     //文本
    GROUP_TIP="GroupTip",       //提示消息
    RED_PACKET="RedPacket"  //红包消息
}

//提示类型
export enum TipType {
    JOIN="JOIN",                 //进群
    QUIT="QUIT",                 //退群
    KICK="KICK",                 //踢出
    MODIFY_GROUP_INFO="MODIFY_GROUP_INFO",    //修改群信息  //直接全部更新
    MODIFY_MEMBER_INFO="MODIFY_MEMBER_INFO",    //修改成员信息
    PULL_RED_PACKET="PULL_RED_PACKET",         //收红包
    REMOVE_MSG="REMOVE_MSG",
    GAG="GAG",
    NOTICE="NOTICE"   //群通知
}

// //消息元素
// export enum MsgElementType {
//     TEXT,                 //文本消息
//     IMAGE,                //图片消息
// }

export enum FriendSystemNotifyType {
    FRIEND_ADD,
    FRIEND_DELETE,
}
export enum ProfileSystemNotifyType {
    PROFILE_MODIFY
}
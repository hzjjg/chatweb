

GET /messages
    参数: sessionType: SessionType 暂时使用 SessionType.GROUP
          to: string     暂时先忽略我回来考虑下
          topId: string 消息ID
    返回: [Message]
    每次会拉取20条
            
        
    
---------------------------------------------

##MessageType
Text
Image
RedPacket  //红包消息
GroupTip    //群提示消息


##Message
{
    msgId: ID
    msgType: MessageType     
    type: SessionType
    from: String
    fromNick: String
    fromAvatar: String
    to: String
    clientMsgId: Integer
    time: long
}



##ImageMessage
{
    include: Message
    content: 图片
}


##RedPacketMessage
{
    include: Message
    packetId: 红包ID
    token: 红包Token
}
 

##TextMessage
{
    include: Message
    content: 文字 表情定义结构 , "[笑脸]"
}


# GroupTip - 分类

##GroupTipType
JOIN,                 //进群
QUIT,                 //退群
MODIFY_INFO,          //修改群信息  //先直接页面，全部更新
PULL_RED_PACKET,      //领取了红包

##GroupTipMessage     - abstract 
{
    tipType: GroupTipType
}

//加入聊天室提示    `${nickname}加入了聊天室`
## GroupJoinTipMessage 
{
    userType: IMUserType ;
    userId: id;
    nickname: string;
}

//离开聊天室先不要提示
## GroupQuitTipMessage
{
    userType: IMUserType ;
    userId: id;
    nickname: string;
}

// ${nickname}领取了${tokenFrom}的红包
## GroupPullRedPackedTipMessage
{
    userType: IMUserType;
    userId: id;
    nickname: string;
    token: string;
    tokenFrom: string; //比如领取了XX的红包
    money: price: //领取了多少
}


 
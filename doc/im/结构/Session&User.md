

GET  /session

- 登录
POST /session
    Body格式: application/json
    参数: LoginInfo

- 注销
DELETE /session



- 用户信息
GET /user
    返回 StaffUserInfo || CstUserInfo
    
- 获取用户信息    
GET /user/profile
    返回: UserProfileInfo 
    
- 提交信息编辑
PUT /user/profile
    Body格式: application/json
    参数: UserProfileInfo
    返回: 204, "No Content"
    
- 修改密码
PUT /user/password
    Body格式: application/json
    参数: UserModifyPasswordInfo
    返回: 204, "No Content"
    
- 查询钱包
GET /user/wallet
    
    返回 UserWallet
    
- 红包统计
GET /user/red-packet-statistic
    返回: RedPacketStatistic
    
- 红包日志
GET /user/red-packet-logs
    参数: topI?: 最底部的ID
    返回: [RedPacketLogInfo]
   
##############页面数据

- LoginInfo {
    type: IMUserType ;
    username: string;
    sign: string;
}

- UserProfileInfo 
{
    nickname;
    avatar;
    personalSignature;
}
    
- UserModifyPasswordInfo
{
    pwd,
    newPwd
}


##############用户信息
    
- IMUserType

Visitor  //访客
Customer //客户
Staff    //员工
    
- IMUser
{
    userId: number //用户ID
    userType: IMUserType //用户类型
   //tag: String          //标签
    nickname: String  
    avatar: String
    personalSignature: String
}
    
- CstUserInfo {
    include IMUserInfo
    username: string
    phone: string
    balance: money
}

- StaffUserInfo {
    include IMUserInfo
    username: string
    name: string
    contact: string
}    

- VisitorUserInfo {
    include IMUserInfo
    visitorNo: string
}

- UserWallet {
    balance: Price
}

### 红包统计
- RedPacketStatistic {
    totalAmount: Money,
    totalQuantity: number
}
- RedPacketLogInfo {
   logId: number;
   userId: number;
   from: string;来源ID
   fromNick: string; 来源名称
   packetId: number 红包ID
   time: number时间
   money: price 金额
}

 
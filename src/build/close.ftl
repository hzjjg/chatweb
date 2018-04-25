<!--关闭的时候的提示页面-->

<!DOCTYPE html>
<html lang="zh-cn">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <title>${room.name}</title>
        <link rel="stylesheet" href="${room.icon}">
        <style>
            html, body {
                height: 100%;
            }
            .error {
                width: 80%;
                max-width: 330px;
                margin: 0 auto;
                padding-top: 100px;
                text-align: center;
            }
            .error p {

                padding-top: 15px;
                font-size: 18px;
                text-align: center;
                color: #8dc2fd;
            }
        </style>
    </head>
    <body>
    <div class="view">
        <div class="error">
            <p>该聊天室已关闭!</p>
            <p>${room.closingNotice}</p>
        </div>
    </div>
    </body>
</html>
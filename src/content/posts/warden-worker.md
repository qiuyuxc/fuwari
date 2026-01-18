---
title: 你可曾想过，直接将BitWarden部署到Cloudflare Worker？
published: 2026-01-09T17:00:52
description: warden-worker就是这样一个项目，它将Rust编译为WASM，然后部署到Cloudflare Worker，无需VPS，无需家里云，只需点点鼠标就可免费用上自己的密码托管！
image: ../img/3e413d1eb3804138efdfa86b333b20da.png
tags:
  - Cloudflare
  - Bitwarden
draft: false
lang: ""
---
# 原理
项目参考开源的 [dani-garcia/vaultwarden: Unofficial Bitwarden compatible server written in Rust, formerly known as bitwarden_rs](https://github.com/dani-garcia/vaultwarden) 将Rust源码编译为WASM以支持在Cloudflare Worker上运行。其中Worker负责REST API，D1负责存储加密后的数据

# 实战

打开Cloudflare https://dash.cloudflare.com/ 

登录后复制这里的 **账户ID** （CLOUDFLARE_ACCOUNT_ID）
![](../img/49d5f3eba03b18ffc9de5fea91aa0b8d.png)

右上角进入配置文件
![](../img/a52e10291205fb836082a405cd9a1d63.png)

左上角选择API令牌
![](../img/002cd4ccc5cda2b9e6e9026827d291f3.png)

点击创建令牌
![](../img/7bbf4f52d417efee7ffc3ee1c79c1eb9.png)

选择 编辑Cloudflare Workers
![](../img/d6cd4954c0b71918811644a21e22ce71.png)

创建后 **复制API 令牌** （只会展示一次）（CLOUDFLARE_API_TOKEN）
![](../img/ec3af994a5c4da9f426c3cbb75db5325.png)

回到主页，进入D1数据库
![](../img/94cf02692d73df13980ebe334d0ff432.png)

选择 创建数据库
![](../img/d25de88d273c8ce1d321dd9f7e7db4cf.png)

创建完成后，进入，复制 **D1 数据库 ID**（D1_DATABASE_ID）

> 由于原项目坑点太多（如：依赖不固定版本导致编译报错，必须设置的环境变量不写白，SQL初始化遇到问题直接跳过）

这里我Fork并二改了一个我的版本，跟着我的步骤走，包你成功！

Fork我的仓库（别忘了点个 **Star** ） [afoim/warden-worker: A Bitwarden-compatible server for Cloudflare Workers](https://github.com/afoim/warden-worker/)

在仓库设置中添加上述三个机密环境变量
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `D1_DATABASE_ID`
![](../img/1217670f945bf368d1a35aa1542046d9.png)

点击 Action，运行Build工作流
![](../img/9958ec6f9004534a943f47e73206d6d9.png)

Build结束，全绿
![](../img/3dd4e091dc901ae60f19a9a859a22ee5.png)

打开Cloudflare D1，查看数据库表
![](../img/dce3d645f7dcad36e3e8abaa64abb58f.png)

如果这里是空的，我们就手动建表
![](../img/24018762eec46086ae3ce68d4b067512.png)

查看这个文件 [warden-worker/sql/schema.sql at main · afoim/warden-worker](https://github.com/afoim/warden-worker/blob/main/sql/schema.sql)

依次将这3个SQL块进行执行（一定要依次，不能一把梭）。每执行一次你应该都能看到新表的出现
![](../img/5e554540d38a98138f202d63ef290d3c.png)
![](../img/f79cc7020ef5abdffd73b52ac18714fa.png)![](../img/bec4f68e72a28be086f05c3e2c538d3d.png)

进入Workers
![](../img/7a9a9b6d9a2b1d1b0d32a85ed121af2c.png)

进入 warden-worker
![](../img/66194c99a7fdf04eed44961274424bad.png)

先添加 **自定义域** ，填你的域名，因为 Worker 默认给的域名国内无法访问
![](../img/365bdb4adb2756189ac207e4d33a039a.png)

再添加**机密环境变量** （注意不要有空格）
- `ALLOWED_EMAILS` your-email@example.com 
- `JWT_SECRET` 随机的长字符串 
- `JWT_REFRESH_SECRET` 随机的长字符串
> [!CAUTION]
> 必须使用Wrangler CLI命令添加机密环境变量，如： `wrangler secret put JWT_SECRET` 这样添加的环境变量不会在新的部署中被覆盖

![](../img/47970475972e61c6b1d752d3aa281517.png)

![](../img/48a803f7f6111f8bd1e30c4e2915585a.png)

此时打开手机上的 **BitWarden** 软件，在你的自托管上创建账号即可（注意：密码一经设置将无法更改）
![](../img/7c2cbe876e3f2febdde9795d8d4615d0.jpg)![](../img/8708faa4b5f5e90b846e1c219cf73e81.jpg)![](../img/97da71d9226623a5cae22c08b10aedcb.jpg)![](../img/cce328f2081c37e58caf9451439e4a6f.jpg)

> [!CAUTION]
>  ~~值得注意的是，该项目似乎仅实现了手机端的大部分API，而针对于电脑浏览器插件使用的API暂未支持，我们目前正在尝试用AI补全... Just a moment...~~
>  
>  更多注意事项请参阅仓库README
>  
>  已支持电脑端浏览器插件

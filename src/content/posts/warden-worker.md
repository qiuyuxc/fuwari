---
title: 你可曾想过，直接将BitWarden部署到Cloudflare Worker？
published: 2026-01-09T17:00:52
description: warden-worker就是这样一个项目，它将Rust编译为WASM，然后部署到Cloudflare Worker，无需VPS，无需家里云，只需点点鼠标就可免费用上自己的密码托管！
image: https://i0.hdslb.com/bfs/openplatform/16f304ec34bab4891ae875584c039171cb682955.png
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
![](https://i0.hdslb.com/bfs/openplatform/fc68e09283d5680c63d0fac210aee09e925ef80c.png)

右上角进入配置文件
![](https://i0.hdslb.com/bfs/openplatform/e54327302fc2bb563baad859770612727351f17e.png)

左上角选择API令牌
![](https://i0.hdslb.com/bfs/openplatform/e660364bed07b4767f8cc139445cbb2557f790e6.png)

点击创建令牌
![](https://i0.hdslb.com/bfs/openplatform/8d4187c1c2a909e8cdebbf854cfd75e130e4c248.png)

选择 编辑Cloudflare Workers
![](https://i0.hdslb.com/bfs/openplatform/a0b50cf5f4dd38f9f94f00992bf6591402ee2620.png)

创建后 **复制API 令牌** （只会展示一次）（CLOUDFLARE_API_TOKEN）
![](https://i0.hdslb.com/bfs/openplatform/694a2b4517c9c809170b1b2df2979db83edf8fe0.png)

回到主页，进入D1数据库
![](https://i0.hdslb.com/bfs/openplatform/85e3b6658048d0fcc13ffb5395fc4835f32c196c.png)

选择 创建数据库
![](https://i0.hdslb.com/bfs/openplatform/d7770f999c5aa1d0c01debb0a0a869b5b39077fa.png)

创建完成后，进入，复制 **D1 数据库 ID**（D1_DATABASE_ID）

> 由于原项目坑点太多（如：依赖不固定版本导致编译报错，必须设置的环境变量不写白，SQL初始化遇到问题直接跳过）

这里我Fork并二改了一个我的版本，跟着我的步骤走，包你成功！

Fork我的仓库（别忘了点个 **Star** ） [afoim/warden-worker: A Bitwarden-compatible server for Cloudflare Workers](https://github.com/afoim/warden-worker/)

在仓库设置中添加上述三个机密环境变量
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `D1_DATABASE_ID`
![](https://i0.hdslb.com/bfs/openplatform/9021aec8f5bc7181301b3e29690d5e4609050e38.png)

点击 Action，运行Build工作流
![](https://i0.hdslb.com/bfs/openplatform/0f388ba9b361a1ed7c1d569932907821cacfa74f.png)

Build结束，全绿
![](https://i0.hdslb.com/bfs/openplatform/fdb589cb2a0a82b9851f692ea938b6e0d6909418.png)

打开Cloudflare D1，查看数据库表
![](https://i0.hdslb.com/bfs/openplatform/57eb1845f985c151700532efa566576650911908.png)

如果这里是空的，我们就手动建表
![](https://i0.hdslb.com/bfs/openplatform/6cb413bf02a871f1cf755899cc6ce809cc7a3014.png)

查看这个文件 [warden-worker/sql/schema.sql at main · afoim/warden-worker](https://github.com/afoim/warden-worker/blob/main/sql/schema.sql)

依次将这3个SQL块进行执行（一定要依次，不能一把梭）。每执行一次你应该都能看到新表的出现
![](https://i0.hdslb.com/bfs/openplatform/3ca07d60b3f8d4771b630c23d1b36d5ff0883263.png)
![](https://i0.hdslb.com/bfs/openplatform/f640a3bd1a7363362d5090afa24fc8a595eb0725.png)![](https://i0.hdslb.com/bfs/openplatform/a74ac9d8892fa704541d45adeb21f445d7471e91.png)

进入Workers
![](https://i0.hdslb.com/bfs/openplatform/794e7dd2bfa4d8afd1efb0e27554ad7bc57823b3.png)

进入 warden-worker
![](https://i0.hdslb.com/bfs/openplatform/befd22361cab91cd6d618621c42b6184225991b3.png)

先添加 **自定义域** ，填你的域名，因为 Worker 默认给的域名国内无法访问
![](https://i0.hdslb.com/bfs/openplatform/e860492ee65bc9b4b6030de1f1a41597533c1e79.png)

再添加**机密环境变量** （注意不要有空格）
- `ALLOWED_EMAILS` your-email@example.com 
- `JWT_SECRET` 随机的长字符串 
- `JWT_REFRESH_SECRET` 随机的长字符串
> [!CAUTION]
> 必须使用Wrangler CLI命令添加机密环境变量，如： `wrangler secret put JWT_SECRET` 这样添加的环境变量不会在新的部署中被覆盖

![](https://i0.hdslb.com/bfs/openplatform/31c36e1290c6ff0c9dbea643fbc69f60d6cbfac0.png)

![](https://i0.hdslb.com/bfs/openplatform/b6706465350774296f6da7264dfab9893fb06115.png)

此时打开手机上的 **BitWarden** 软件，在你的自托管上创建账号即可（注意：密码一经设置将无法更改）
![](https://i0.hdslb.com/bfs/openplatform/ab121508d2503b0d1b12e1ded86bf2f194f9a6e2.jpg)![](https://i0.hdslb.com/bfs/openplatform/9a7ba09b8dc6fdd9b0dfbc03c521a0ae31654f70.jpg)![](https://i0.hdslb.com/bfs/openplatform/5793c83c26b36d486e3a228439d5d7ad9a4a0369.jpg)![](https://i0.hdslb.com/bfs/openplatform/95236ff50652e5ed64fe282a63905f46eb8b9d67.jpg)

> [!CAUTION]
>  ~~值得注意的是，该项目似乎仅实现了手机端的大部分API，而针对于电脑浏览器插件使用的API暂未支持，我们目前正在尝试用AI补全... Just a moment...~~
>  
>  更多注意事项请参阅仓库README
>  
>  已支持电脑端浏览器插件

---
title: 来！让我们用Vercel来分享你的OneDrive！
published: 2025-11-14T15:03:46
description: 利用onedrive-index这个项目可以将你的OneDrive映射到公网，轻松分发资源！
image: https://i0.hdslb.com/bfs/openplatform/b42b66d728b5ff4e6ee1985ad7a920a3b88b7615.png
tags:
  - Vercel
  - OneDrive
draft: false
lang: ""
---
# 正式开始
你可以根据[前文](/posts/ms-e3/)免费拿E3，得到至高免费5T的OneDrive存储空间，也可以用你个人永久免费的5G空间，都可以！

前往 [高级 - OneDrive Vercel Index](https://ovi.swo.moe/zh/docs/advanced#%E4%BD%BF%E7%94%A8%E4%BD%A0%E8%87%AA%E5%B7%B1%E7%9A%84-client-id-%E4%B8%8E-secret) 拿到 clientid 和 secret

前往该页面，点击快速部署 [onedrive-index/README.zh-CN.md at main · iRedScarf/onedrive-index](https://github.com/iRedScarf/onedrive-index/blob/main/README.zh-CN.md#%E9%83%A8%E7%BD%B2%E5%88%B0vercel) 

![](https://i0.hdslb.com/bfs/openplatform/2e50291de56e0b0ea93ee4836a25d6c2a7d51659.png)

填写必须的5个环境变量
![](https://i0.hdslb.com/bfs/openplatform/c933625ab26efc835813a123a8f2b7053b6b0726.png)

其中，USER_PRINCIPAL_NAME为类似 huding@Smartree233.onmicrosoft.com 的电子邮箱，也就是你登陆OneDrive的用户名

Vercel部署完毕后，会报错连不上Redis，因为我们还没创建和绑定，现在我们开始做
![](https://i0.hdslb.com/bfs/openplatform/beb6fb913da609c0b3396255a59b05e042125053.png)

前往 https://vercel.com/integrations/upstash 点击 Install
![](https://i0.hdslb.com/bfs/openplatform/ee4983907551eff41e93164ff3a0f453f0e66d7a.png)

选择你要绑定的Vercel项目，并且设置Redis实例名称
![](https://i0.hdslb.com/bfs/openplatform/2487fa9f4ad10010a19a8374b56c83153d4e6016.png)

来到Vercel的环境变量页面，这就是绑定成功了
![](https://i0.hdslb.com/bfs/openplatform/4d6c31a30ee16b3134efe1a4646ee2a4fd8cfcd9.png)

随便打开一个部署，点击 Redeploy 重新部署，就能成功连接数据库了

接下来访问你的项目域名，进入OneDrive-Index的引导，需要打开微软的一个链接授权

授权后会重定向到一个localhost的域名，复制该URI，粘贴回OneDrive-Index即可（仅需一次）

成功部署！
![](https://i0.hdslb.com/bfs/openplatform/d7b2dfa2eedd738f3fadbfdfe9afdc7e804faa20.png)

# 同项目更改OneDrive账号
首先在Vercel上更改这三个环境变量
![](https://i0.hdslb.com/bfs/openplatform/64a7dfa7fea5947e2888b50e63480dc9293d720b.png)

然后打开 Upstash 找到对应的Redis，删除里面存储的所有Token
![](https://i0.hdslb.com/bfs/openplatform/811d406a56a29e719b75a19502116d8f2dee83bb.png)
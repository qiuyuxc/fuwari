---
title: 来！让我们用Vercel来分享你的OneDrive！
published: 2025-11-14T15:03:46
description: 利用onedrive-index这个项目可以将你的OneDrive映射到公网，轻松分发资源！
image: ../img/94e2ff9d07d1c8f7df03f8d869fa15cd.png
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

![](../img/6e5042ac2b77c488b4f95dcb0f3f3f1a.png)

填写必须的5个环境变量
![](../img/a771d13a794c28693cd2e6b42aa38a20.png)

其中，USER_PRINCIPAL_NAME为类似 huding@Smartree233.onmicrosoft.com 的电子邮箱，也就是你登陆OneDrive的用户名

Vercel部署完毕后，会报错连不上Redis，因为我们还没创建和绑定，现在我们开始做
![](../img/72073f9e616664cdd83c41befbaafc5d.png)

前往 https://vercel.com/integrations/upstash 点击 Install
![](../img/9a3e4f842c3d6a6e4c2a38f5574283dd.png)

选择你要绑定的Vercel项目，并且设置Redis实例名称
![](../img/87437b9804f7c837ddc0828608fa2b71.png)

来到Vercel的环境变量页面，这就是绑定成功了
![](../img/4c0276e8757214c04bfbafa5d63b5a4e.png)

随便打开一个部署，点击 Redeploy 重新部署，就能成功连接数据库了

接下来访问你的项目域名，进入OneDrive-Index的引导，需要打开微软的一个链接授权

授权后会重定向到一个localhost的域名，复制该URI，粘贴回OneDrive-Index即可（仅需一次）

成功部署！
![](../img/d040d45b8b7cc9850706743b1a8a15cc.png)

# 同项目更改OneDrive账号
首先在Vercel上更改这三个环境变量
![](../img/767d879ea626eb9eaf96ef38fbb991fe.png)

然后打开 Upstash 找到对应的Redis，删除里面存储的所有Token
![](../img/0ffeb9a1160b6a4b1de9a4ccdbc10ea1.png)
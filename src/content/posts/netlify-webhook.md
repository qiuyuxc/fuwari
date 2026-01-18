---
title: 利用Netlify WebHook来实时提醒你的订阅者博客文章更新
published: 2025-08-09T00:01:00
description: '早期提过使用Github WebHook来做到这件事，今天偶然发现了Netlify也可以做到同样的事情'
image: '../img/89652d6e534d3c67abe01becdefee500.png'
tags: [Netlify]
category: '记录'
draft: false 
lang: ''
---

# 原理

早期文章提到过 [利用Github Webhook为你的订阅者推送文章更新消息](/posts/github-webhook)

其实已经很完美了，但是仍有一些缺陷

比如Github WebHook确实可以让Bot知道什么时候有了新的提交

但是Github并不知道构建服务需要构建多久

只能设置一个保守的延迟推送

但是当我们再使用Netlify的WebHook的时候

情况就变得不同了

Netlify可以在站点构建成功后向Bot发送WebHook

但是也有缺陷

那就是Netlify不支持检测文件变动

但是

我们只需要将两者结合

则工作流为
Push -> 

Github Webhook 通知Bot -> 

Bot收到提交信息，如果合法，则记录变动的文章，并且等待Netlify发送部署成功的WebHook -> 

Netlify WebHook 通知Bot站点部署成功 -> 

Bot即刻推送文章更新消息 √

# 实操

添加HTTP POST钩子

![](../img/d794e62540c4d5a5867a7557acaf1f6d.png)

创建一个部署成功钩子

![](../img/1ce8a04b7087187a1a1a612b29c4d80f.png)

# Bot端

设置一个双监听WebHook服务器，同时接受Github和Netlify的WebHook即可。

![](../img/081d8d09a6411084c1f0fd23dbf37e29.png)

![](../img/6bcec5676df883ff6ad4fc85f85e611b.png)

![](../img/f3cf1cf1376731dafa60b1fd729a628e.png)

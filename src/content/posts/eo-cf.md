---
title: EdgeOne + Cloudflare，我们天下无敌！
published: 2025-06-27
description: 'EdgeOne的低延迟+Cloudflare的强大业务！我都不敢想这有多爽！'
image: https://i0.hdslb.com/bfs/openplatform/8c1b2f2291f18c0a999b61000cafe6b99f0cd5ca.webp
tags: [EdgeOne, Cloudflare]
category: '记录'
draft: false 
lang: ''
---

# 引言

主播也是搞到了EdgeOne免费版激活码了，终于可以大展宏图了😋

# 我怎么换到EdgeOne免费版？

前往 [腾讯云EdgeOne免费计划兑换码 - 立即体验](https://edgeone.ai/zh/redemption)

推荐直接发推，按照要求发

发完后私信EO官方即可

![](https://i0.hdslb.com/bfs/openplatform/103f19a6d5ac7811b0f41ed320f32807471af039.webp)

# 默认EdgeOne给的Anycast CNAME过于垃圾？

默认在EO添加域名EO会发给你一个类似 `afo.im.eo.dnse4.com` 这样的CNAME

也就是 `你的域名.eo.dnse4.com` 

emm 这玩意吧 你们自己看速度吧

![](https://i0.hdslb.com/bfs/openplatform/5e54bbbb9cb1a794c36708a389af46bdd43878c0.webp)

我推荐大家使用 `43.174.150.150` 。是一个中国香港的三网优化IP。速度如下。**本人EdgeOne优选：** `eo.072103.xyz`

![](https://i0.hdslb.com/bfs/openplatform/c13900fcef77e00544e1d88a58416a4bb11be2ae.webp)

# 换了CNAME后无法自动申请免费SSL？

如果你将你的域名托管给EO并且没有用EO给你的CNAME，则这个选项不可用

![](https://i0.hdslb.com/bfs/openplatform/16c6fd5cc4284521967aeab699df5aef7eac1479.webp)

我推荐采用1panel、宝塔、acme.sh手动申请泛域名证书然后上传到腾讯云SSL控制台，就像这样

![](https://i0.hdslb.com/bfs/openplatform/c8275b030f48618f05d2ef85eafc7c12f1966f0b.webp)

# EdgeOne怎么做重定向？

在这里

![](https://i0.hdslb.com/bfs/openplatform/9e908df909777dfe06c9854e6752af6f19d47659.webp)

![](https://i0.hdslb.com/bfs/openplatform/cc1f04e3812e5f91104e1d63bcc372ae8e0e5a6d.webp)

EO边缘函数也支持重定向，支持更细化的重定向规则

但是这玩意记录请求数，不如用Cloudflare的重定向规则

![](https://i0.hdslb.com/bfs/openplatform/a540a6f3b14a7809f81c29713df0c9e9dafec28a.webp)

首先我们在CF写这样一个规则
![](https://i0.hdslb.com/bfs/openplatform/c94a56671f29858d92db6d4e172e35de8eced47e.webp)

然后让EO回源到CF边缘节点。最简单就是随便填个IP然后套CDN

![](https://i0.hdslb.com/bfs/openplatform/6e80c76327814e3b2144cb2ccbee9216163fc331.webp)

接着配置EO回源，这里一定要使用加速域名作为回源Host头

![](https://i0.hdslb.com/bfs/openplatform/1c3d8c4a05a9e97f34f9b3aa3db4bea64f013195.webp)

原理：用户 - EO - CF - CF识别到Host匹配重定向规则 - 301

# EdgeOne反代一切？

> 大部分情况将 `回源HOST头` 改为源站就能解决反代后网站无法访问的问题
> 
> ![](https://i0.hdslb.com/bfs/openplatform/774def4f78b49baf1836c14f1895247728fd5f75.png)

---
category: 记录
description: Serverless服务有很多，静态托管就是重中之重，来看看谁最稳定快速
draft: false
image: ../img/92a5e5522679332ad4d58c7c2b27a835.webp
lang: ''
published: 2025-07-14
tags:
- Vercel
- Cloudflare
- Netlify
- EdgeOne
- Github
- Render
title: N款CDN/静态托管服务商的优缺点比较
---

# [Netlify](https://www.netlify.com)

注册门槛高，需要使用谷歌邮箱注册。支持IPv6回源。用量限制较宽松，仅有带宽和构建时间限制。 **我认为是免费计划里最快的CDN！并且限制很少！**

> 需要注意，构建时间是每月限制。但是流量限制较为宽松

![](../img/e0e519b7015ee0ba2bc1ea960e95a660.webp)

因为节点禁Ping，所以这里用Tcping结果展示

**推荐CNAME：** apex-loadbalancer.netlify.com

![](../img/71180b8a39c0c5ab85c53f0f2b41c377.webp)

# [Vercel](https://vercel.com)

零成本用上。注册无门槛，延迟良好。用量限制较严格。仅支持IPv4回源。默认的 `*.vercel.app` 在国内会被SNI阻断，需要绑定自己的域名

> Vercel每天可以构建100次，每次构建时间不得超过45分钟

**推荐IP：** 76.76.21.21

![](../img/d86af340f3f0b6fb91f3bb6a9a434f97.webp)

![](../img/2e4e94d62abfcc5b07fa654f5bfe00a5.webp)

# [EdgeOne CDN](https://edgeone.ai)

目前处于内测，需要兑换码。获取方式前往 [腾讯云EdgeOne免费计划兑换码 - 立即体验](https://edgeone.ai/zh/redemption) 。无流量和请求数限制。

![](../img/ee878adaa9bb703fd654e80b37d6980a.webp)

支持**高级回源设置**

![](../img/34fe2e89f1e134d7b5d9e2bcf8beee8d.webp)

## 全球可用区（不含中国大陆）

> 本人博客目前使用的CDN

默认提供的CNAME延迟一般。下图是使用了本人的HK优选： eo.072103.xyz（注： EdgeOne Page不可用）

![](../img/7a4c62ae4f8f1c4ad5dc52163e5ae996.webp)

## EdgeOne CDN 中国大陆可用区

需要**实名认证**，需要**域名备案**

默认CNAME可用

![](../img/02c90d675b1ee58461f46e88d61ee538.webp)

# [Cloudflare](https://www.cloudflare.com/)

无流量和请求数限制。**无法被打死**

[戳我查看优选域名](/posts/record/#cloudflare-%E4%BC%98%E9%80%89%E5%9F%9F%E5%90%8D)

下图使用本人的分流优选： fenliu.072103.xyz

![](../img/d897278eb97397c39f1528a2d7f5f0f6.webp)

# [Render](https://render.com)

注册简单，具有严格的用量限制

![](../img/d62f2a1543f07d6b96456653564185c8.webp)

![](../img/d7a858ad6225becc66f5d9cdd91a2fb9.webp)

# [Github Page](https://pages.github.com/)

需要使用Github Action发布。**中国大陆大部分地区会间歇性阻断**，不推荐使用

![](../img/da8f9b35b84a0e0f6b9e421c648ae4ee.webp)

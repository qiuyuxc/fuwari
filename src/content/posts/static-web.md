---
category: 记录
description: Serverless服务有很多，静态托管就是重中之重，来看看谁最稳定快速
draft: false
image: https://i0.hdslb.com/bfs/openplatform/11e53374f46a5ee308bed1649c274c11aa6316a0.webp
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

![](https://i0.hdslb.com/bfs/openplatform/615d124803f44b77b7ac23dbbac54ae9bf8f0701.webp)

因为节点禁Ping，所以这里用Tcping结果展示

**推荐CNAME：** apex-loadbalancer.netlify.com

![](https://i0.hdslb.com/bfs/openplatform/2a4dc78c9785e501967483225f6ebc7a9896e168.webp)

# [Vercel](https://vercel.com)

零成本用上。注册无门槛，延迟良好。用量限制较严格。仅支持IPv4回源。默认的 `*.vercel.app` 在国内会被SNI阻断，需要绑定自己的域名

> Vercel每天可以构建100次，每次构建时间不得超过45分钟

**推荐IP：** 76.76.21.21

![](https://i0.hdslb.com/bfs/openplatform/11c2bad72501973ab8afe0d9035480b68dd352db.webp)

![](https://i0.hdslb.com/bfs/openplatform/f1c86185403c931fc6e155e8b06c118ae05cab6a.webp)

# [EdgeOne CDN](https://edgeone.ai)

目前处于内测，需要兑换码。获取方式前往 [腾讯云EdgeOne免费计划兑换码 - 立即体验](https://edgeone.ai/zh/redemption) 。无流量和请求数限制。

![](https://i0.hdslb.com/bfs/openplatform/2daf9884c3ed22bb4d82caa6e9998a5381bd7c1f.webp)

支持**高级回源设置**

![](https://i0.hdslb.com/bfs/openplatform/5d388b5d82b524a06536e5f00a4bb376e451b537.webp)

## 全球可用区（不含中国大陆）

> 本人博客目前使用的CDN

默认提供的CNAME延迟一般。下图是使用了本人的HK优选： eo.072103.xyz（注： EdgeOne Page不可用）

![](https://i0.hdslb.com/bfs/openplatform/0a6beda4bab99ea22fa283047f7b1166ab6b290f.webp)

## EdgeOne CDN 中国大陆可用区

需要**实名认证**，需要**域名备案**

默认CNAME可用

![](https://i0.hdslb.com/bfs/openplatform/51736be69827c2a723088fa43b6c7583413459b9.webp)

# [Cloudflare](https://www.cloudflare.com/)

无流量和请求数限制。**无法被打死**

[戳我查看优选域名](/posts/record/#cloudflare-%E4%BC%98%E9%80%89%E5%9F%9F%E5%90%8D)

下图使用本人的分流优选： fenliu.072103.xyz

![](https://i0.hdslb.com/bfs/openplatform/780ef262092d0064515ef5e4dd42e9c735332734.webp)

# [Render](https://render.com)

注册简单，具有严格的用量限制

![](https://i0.hdslb.com/bfs/openplatform/c0ece08d86b0ee48f21f3768d360990f4974234c.webp)

![](https://i0.hdslb.com/bfs/openplatform/e541d540a70defb0d0e9327d0d9355936183107c.webp)

# [Github Page](https://pages.github.com/)

需要使用Github Action发布。**中国大陆大部分地区会间歇性阻断**，不推荐使用

![](https://i0.hdslb.com/bfs/openplatform/b23580163026df202a90c6b22f87b8b3b0e4db31.webp)

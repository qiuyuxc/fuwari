---
title: NAT1开放内网网站
published: 2025-05-31
description: '利用CF动态重定向透过STUN+Lucky WebHook实时更新STUN端口实现NAT1家宽建站'
image: https://i0.hdslb.com/bfs/openplatform/8d8b5fca833eaa8a77b5c2b2241412b498e222ef.webp
tags: [NAT1, Lucky, Cloudflare]
category: '教程'
draft: false 
lang: ''
---

# 配套视频

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=114597528936170&bvid=BV1hY7szUEbu&cid=30235755189&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

# 原理

![](https://i0.hdslb.com/bfs/openplatform/5039032985eab9aea4d368e284effacc22207623.webp)

# 正式开始

### 创建必要的Cloudflare API令牌

创建拥有如下图权限的令牌，使得Lucky可以使用此令牌设置DDNS、签发SSL、更新Cloudflare动态重定向

![](https://i0.hdslb.com/bfs/openplatform/e300941fb13cc10ad96f69bfa659f776d35a8045.webp)

### 创建基底Cloudflare动态重定向规则

如图填写，替换为你的域名
![](https://i0.hdslb.com/bfs/openplatform/c76b4fb73f9bfed8121750954f469e71657a60ee.webp)

表达式： `wildcard_replace(http.request.full_uri, "*://*.072103.xyz/*", "https://${2}.stun.072103.xyz:6666/${3}")`

观察网址，记录下如下图的数据

![](https://i0.hdslb.com/bfs/openplatform/2a480149d417fc48f69f6fd787d8285be48e4939.webp)

打开开发者工具后，再保存，确保抓到这样的包，保存备用
![](https://i0.hdslb.com/bfs/openplatform/7d6d5a028fe3ac2690aaeb65019c2a496f327b55.webp)

将 `dash.cloudflare.com/api` 改为 `api.cloudflare.com/client` 。将刚才获得的红框内的内容填写到 `rules` 后面

![](https://i0.hdslb.com/bfs/openplatform/dfafaff9e722d34e35ddb0badb94bd46ecca170f.webp)

如果你不是第一次更新，可能会带有一个 `"position":{"index":1},` 删除它，否则后面的WebHook将会出错。

将我们硬编码的 `6666` 端口改为Lucky STUN的变量 `#{port}`

---

最终我们记录了以下信息

```
https://api.cloudflare.com/client/v4/zones/f305febd3a25b5bb3a46b802328a75a8/rulesets/35218f125f7f4421b4c76314464689a2/rules/17228a4add70429c9cdd38eb7fec1d02

{"description":"stun","expression":"(http.host wildcard \"*.072103.xyz\" and not http.host in {\"pic.072103.xyz\" \"hpic.072103.xyz\"})","action":"redirect","action_parameters":{"from_value":{"status_code":301,"preserve_query_string":true,"target_url":{"expression":"wildcard_replace(http.request.full_uri, \"*://*.072103.xyz/*\", \"https://${2}.stun.072103.xyz:#{port}/${3}\")"}}},"enabled":true}
```

### 让Cloudflare接管 *.072103.xyz 的流量

![](https://i0.hdslb.com/bfs/openplatform/8f28f981862f4f22a80baacde4daaa125fa5ebca.webp)

### 配置Lucky DDNS

![](https://i0.hdslb.com/bfs/openplatform/f5add9a94aaff8f255f3b40442bc25cdd1862f66.webp)

### 配置Lucky SSL/TLS证书

![](https://i0.hdslb.com/bfs/openplatform/237200b2c36a5336e0e9184d606943626df0ecb4.webp)

### 配置Lucky Web服务

![](https://i0.hdslb.com/bfs/openplatform/b41d707dec6f09bc7eefa339ea502d511d1a2171.webp)

### 配置Lucky STUN

注：我这里使用了路由器的端口转发，将Lucky的16666（Web服务）端口转发到了路由器的17777端口。如果你不会端口转发，请**不要启用** `不使用Lucky内置端口转发` 并且**目标端口**填写16666

![](https://i0.hdslb.com/bfs/openplatform/5bc213d63be5e8ad4376b04627864f92ad4c5b23.webp)

### 配置WebHook

如图配置

![](https://i0.hdslb.com/bfs/openplatform/51fd6838b629fac6583f51506b084abe3444f2ba.webp)

接口地址：你之前记录的 `https://api.cloudflare.com/...`

请求方法： `PATCH` 或者 `POST`

请求头：

```
Authorization: Bearer 你的API令牌
Content-Type: application/json
```

请求体：你之前记录的 `{"description":...` 

# End.

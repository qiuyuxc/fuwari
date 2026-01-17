---
title: IPv6反解域名是什么？嫩长一坨还能托管到Cloudflare？SSL签发也没问题？
published: 2025-08-09
description: '你是否见过类似 e.b.9.f.0.7.4.0.1.0.0.2.ip6.arpa 这样的域名，今天就教你搞一个！'
image: 'https://i0.hdslb.com/bfs/openplatform/75c60f7c869a0c89e7baf02354bd5da4a41e4c8d.png'
tags: [IPv6, ip6.arpa]
category: '教程'
draft: false 
lang: ''
---

# 这是什么

> 以下内容来自GPT-5

这是一个 **IPv6 反向解析（Reverse DNS）域名**，遵循 `ip6.arpa` 格式。  
它是把 IPv6 地址每个十六进制数字倒序排列，加上 `.ip6.arpa` 后缀，用于 DNS 反查时将域名解析回原 IPv6 地址。

# 将 x.x.x.x.x.x.x.x.x.x.x.x.ip6.arpa 弄到手

> 视频教程： https://www.bilibili.com/video/BV1q8tBzsEPi/

前往 [Hurricane Electric Free IPv6 Tunnel Broker](https://tunnelbroker.net/)

注册一个账号（需要用域名邮箱）

创建隧道。需要一台启用了ICMP信令的VPS

填上IP后，TunnelBroker会向其发送Ping请求

如果TunnelBroker收到了回应，并且该IP没有被其他隧道绑定，就会弹出绿色，可绑定的标志

如果该IP曾被绑定，则需要进行HTTP验证

![](https://i0.hdslb.com/bfs/openplatform/19f226b2c289123bf8e91d69ee6962b3fc35a2e0.png)

进入这个页面，查看TunnelBroker为你分配的路由IPv6

![](https://i0.hdslb.com/bfs/openplatform/4939b5887e94357211321e30c5ef1ac843f539b2.png)

以 `2001:470:24:386::/64` 为例

首先加0，每项4位，通过 `:` 分割，则为 `2001047000240386`

然后倒过来，则为 `6830420007401002` 

最后，加上 `.` 和 `.ip6.arpa` ，则为 `6.8.3.0.4.2.0.0.0.7.4.0.1.0.0.2.ip6.arpa` 

将其添加到Cloudflare

![](https://i0.hdslb.com/bfs/openplatform/4da67b3d0dcb11fec83ab33b67397beae295c74e.png)

查看Cloudflare要求你设置的NS服务器

![](https://i0.hdslb.com/bfs/openplatform/dfe7eea61f2e6a9c42af5cd980a61413f1dac1c8.png)

回到TunnelBroker进行设置

![](https://i0.hdslb.com/bfs/openplatform/09e6fd8a4594d447d3f79de574f2654b6edec1a5.png)

等待域被激活即可

# 为其签发SSL

默认 ipra 无法签发SSL，因为会被大部分SSL提供商拒签

将Cloudflare SSL提供商改为 SSL.COM 可以解决这个问题

获取必要信息，发起更改SSL提供商请求

```bash
curl --location --request PATCH 'https://api.cloudflare.com/client/v4/zones/<zone_id>/ssl/universal/settings' --header 'X-Auth-Email: 你的CF注册邮箱' --header 'X-Auth-Key: 你的CF全局APIKey' --header 'Content-Type: application/json' --data-raw '{"enabled":true,"certificate_authority":"ssl_com"}'
```

稍等片刻，CF会自动使用新的SSL提供商签发SSL

![](https://i0.hdslb.com/bfs/openplatform/89101acab8085a97b1b2b35bacaedd9873282807.png)

# 局限性

本人测试，如果您自己创建SSL.COM的账户尝试签发SSL会拒签。故该域名仅能在Cloudflare CDN下使用

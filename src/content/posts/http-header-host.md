---
title: 利用自定义HTTP请求头Host字段实现单节点分流域名的监控
published: 2026-01-13T17:28:33
description: 如果说你有个分流域名，正常来说我们需要两个监测源模拟国内和海外用户访问，但真的需要这么麻烦吗...
image: ../img/44c52f52c71e7f1511e0ef9f8b275743.png
draft: false
lang: ""
---
# 原理
CDN上托管了那么多的网站，那它是如何识别每个用户需要访问哪个网站的呢？

针对 HTTPS ，CDN 会检查SSL握手报文中的 `Server_Name` 字段。而针对 HTTP ，CDN 会检查请求头中的 `Host` 字段

也就是说，我们可以通过直接访问CDN节点，如： `http://blog.acofork.com.a1.initww.com` 并携带上 `Host` 头指定为 `blog.acofork.com` ，从而强制指定节点访问业务网站，不走分流

那么如果CDN开启了强制HTTPS呢？监测请求会被301到分流域名，这样不就没意义了吗？

并不是，我们只需要让它监测301/302是否能正常返回即可，不吃它的重定向。如果说CDN节点被打宕机了，它应该什么状态码都不返回，如果说CDN节点返回拦截页面，那它也不可能返回301/302 ，所以这样监测是有效的

经测试，EdgeOne，ESA都是先进行WAF拦截，也就是你使用HTTP访问，若该请求不合法，将会直接被拦截（EO返回418，ESA返回403），不会进行HTTPS升级

# 正式开始
部署一个Uptime Kuma（或者其他服务，监测源必须在国内。因为EO，ESA我们要做拦截海外策略）

如图写监测项目，直接使用HTTP协议监测CDN节点，并且携带Host头，将重定向设为0，只要返回 301/302 就算存活（为了减轻站点压力，建议使用HEAD请求）

![](../img/f0afc786de578a822c74741d2fc86619.png)

![](../img/10b2969fde97039f8170ea0603e258f8.png)

# Demo
::url{href="https://status.acofork.com"}
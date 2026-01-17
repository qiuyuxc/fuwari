---
title: 关于Whois查询那点事
published: 2025-05-28
description: '你有没想过自己部署一个第三方的Whois查询服务？我做过，这里面全是坑！'
image: https://i0.hdslb.com/bfs/openplatform/fed92c312d12d4f203d24a31b7a310e563d311ec.webp
tags: [Whois]
category: '记录'
draft: false 
lang: ''
---

# 前言

### Whois查询是什么？

如果了解域名，就知道域名一旦被注册就会在Whois服务器留下一些相关信息（比如：注册方，注册地，注册时间等等），可以被公开查询。

### 如何快速查询一个域名的Whois？

你是否用过某些Whois查询网站？如图为IP.SB的WHOIS查询服务，可以通过 [WHOIS - IP.SB](https://ip.sb/whois) 快速查询一个域名的Whois

![](https://i0.hdslb.com/bfs/openplatform/b543f167392d3af236f01d609b5b3a4b44cf8ba9.webp)

# 正片

那么如果我们想自建一个Whois查询服务放到我们的Bot或者网页上，我们要怎么做呢？

你也许已经知道在Linux系统上专门有一个包就叫做 `whois` 我们可以方便用它来查询Whois。我们现在就可以试试

![](https://i0.hdslb.com/bfs/openplatform/8dfdbcfe62403f631a9abb4316a1517ed1952b32.webp)

可以看到，成功查询到了 `baidu.com` 的Whois信息。但是实际上这个命令的输出有这么长

![](https://i0.hdslb.com/bfs/openplatform/ddbbc070e1363d2f9fe042605c017c716ecf67dc.webp)

但是实际上，只有红色框内的信息对我们有效，其他的信息则是一些公告，警示，许可之类的无用信息

这对于偶尔查询一次然后用人眼筛选有效信息的现代人类不难，但是对现代计算机来说非常难

因为在**传统的Whois查询**中，Whois服务器返回的信息没有任何规范，它想给你什么就能给你什么，如下图

这是我的域名的Whois查询结果，可以看到，完全没有规范可言
![](https://i0.hdslb.com/bfs/openplatform/c0217927f5cfadd76ce6efb7d9c02bbc167ed440.webp)

更有甚者不仅改格式，甚至还改术语，比如Status写一个Connect

![](https://i0.hdslb.com/bfs/openplatform/8dba284c799660991f946c073ca504c784e56a47.webp)

这就使得我们做三方API的时候想要针对性的汉化或者过滤就非常困难。如果你想要做到绝对的规范，需要针对每一个顶级域的Whois服务器做调查，然后针对性的配置过滤器，这样才能输出一个完整的，规范的Whois查询结果

前文我提到了**传统的Whois查询**，那么有没有一个API能直接提供一个规范了格式的查询结果，并且每个域名都遵循这个规范呢？

有的，兄弟有的，这就是RDAP（Registration Data Access Protocol），注册数据访问协议。使用了RDAP的域名查询Whois将会返回一个标准的JSON格式的输出，并且查询是通过标准的RESTAPI，也就是Web协议，如下图

![](https://i0.hdslb.com/bfs/openplatform/0ec2914cb5c489192b47eb33af414d352769aa8f.webp)

乍一看好多无用信息啊，但是你先别急，既然它返回的是JSON，而且所有域名都是一个规范，那么我们完全可以方便快捷的过滤

![](https://i0.hdslb.com/bfs/openplatform/c6f978a0c071cf9590f6c3bcd6f6b83284977a4b.webp)

就像这样，只需要写一遍过滤规则，以后所有**支持RDAP查询Whois的顶级域**都可以通过这个规则快捷展示信息！

但是话又说回来，RDAP毕竟是一个新式协议，很多顶级域仍然不支持，比如 `.im`

[.im Domain Delegation Data](https://www.iana.org/domains/root/db/im.html)

![](https://i0.hdslb.com/bfs/openplatform/9c305ea759f38d1b28a6ff94e8be6f8b11bd634e.webp)

可以看到 `.im` 仅支持传统Whois查询

那么我们的三方API就要既支持传统Whois，又支持新式RDAP

# 正式开始构建三方Whois查询API

由于传统Whois查询是通过TCP请求43端口获取信息，需要专用客户端来查询，所以针对于**只支持传统Whois查询的顶级域**就需要我们的服务器先查询到信息，再返回用户纯文本。如下图

![](https://i0.hdslb.com/bfs/openplatform/fed92c312d12d4f203d24a31b7a310e563d311ec.webp)

而对于**已经支持RDAP查询的顶级域**，直接返回Web URL，让用户自行阅览，如下图

![](https://i0.hdslb.com/bfs/openplatform/c7244fefa4e5d28ac02bced2d9db330f1cfdddb2.webp)

另外，针对于**仅支持RDAP查询的顶级域**，我们需要先通过IANA查询该顶级域的RDAP服务器（实际上传统Whois也需要，但是Linux的Whois包硬编码的Whois查询服务器目前够用 :）

比如我要查询 `freebird.day` ，就需要先前往[.day Domain Delegation Data](https://www.iana.org/domains/root/db/day.html)查找![](https://i0.hdslb.com/bfs/openplatform/f0548f6c4382d73a9e42d4cf9df9cfbac4204617.webp)

接下来通过给定的RDAP服务器查询即可![](https://i0.hdslb.com/bfs/openplatform/479574de6ee65abe57a6d75eaec195724913e8ce.webp)

因为RDAP协议较新，且易读，所以针对于**传统Whois和RDAP查询都支持的顶级域**优先RDAP查询

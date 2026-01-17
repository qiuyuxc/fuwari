---
title: 网站分流怎么做？全球秒开！有点坐牢，但是好玩！
published: 2026-01-12T02:09:05
description: 网站分流看着很难，实际上一点都不简单，如果你也感兴趣（想坐牢），那就来试试8！
image: https://i0.hdslb.com/bfs/openplatform/df341d38126c947d809a111c795b39af2aeb305e.png
draft: false
lang: ""
---
# 需分流的网站
博客本体，主站
::url{href="https://blog.acofork.com"}
Umami，用于在网站插入一个JS来进行访客统计以及展示访客信息
::url{href="https://umami.acofork.com/share/CdkXbGgZr6ECKOyK"}
静态随机图，用于置顶文章Cover和整个网站的背景图
::url{href="https://pic1.acofork.com"}

---
其他： https://acofork.com , https://www.acofork.com
这些都是要 **301** 重定向到 https://blog.acofork.com 的域名，我们也需要为其配置分流

# 各CDN SSL申请方案

### EdgeOne

由于NS直接在EdgeOne，故直接申请
![](https://i0.hdslb.com/bfs/openplatform/a9228e00c0deafaf9e4b29326019f5d8880e7693.png)
### ESA
使用DCV委派
![](https://i0.hdslb.com/bfs/openplatform/db3227e651800b7ce0f2c02f1b38db95e861016b.png)
### Cloudflare
使用HTTP验证，由于ACME验证节点在国外，所以它只会看到CNAME到Cloudflare的记录，从而签发SSL
![](https://i0.hdslb.com/bfs/openplatform/016638b16d10e222532e80d7024bc359198fb2b7.png)
针对重定向的域名，由于默认所有请求都会被重定向到新域，ACME自然无法验证，所以我们需要写一条排除规则，让ACME验证路径直接返回200 OK，其余的路径再重定向
![](https://i0.hdslb.com/bfs/openplatform/8a040924058ac3cc52160a3bf7a91023091272f0.png)

# 源站类型

### 静态型

国内使用对应CDN的Page业务，海外使用Cloudflare Worker。至于为什么不将 `blog.acofork.com` 也放在EdgeOne Page，一是因为EdgeOne CDN和Page的WAF规则是分开的，而Page业务的WAF规则不是很好做海外封锁，二是因为EO在之前被打的时候将这个子域封了。而ESA Page可以很简单做到海外封禁
![](https://i0.hdslb.com/bfs/openplatform/784ba7a2dbba81aaa4f33532d4f92ddb9a6270c3.png)
![](https://i0.hdslb.com/bfs/openplatform/aaf27fceadfa19eafb251e3980bcef0d6319b82f.png)
![](https://i0.hdslb.com/bfs/openplatform/e543ac654f8e41ab2b01be7ff7c80b8e4cab7f29.png)
### 动态型

国内使用IPv6回源（用户 - IPv4 - EO/ESA CDN - IPv6 - 源站）。至于为什么不用ESA，是因为ESA CDN回源非标端口需要像Cloudflare一样写一条回源规则，占用免费规则集5条中的其中之一
![](https://i0.hdslb.com/bfs/openplatform/849b00f0d8cca234228d875fe2c0b37fbc75c3a5.png)
海外采用Cloudflare Tunnel（用户 - IPv4 - CF CDN - 内部连接 - 源站）
![](https://i0.hdslb.com/bfs/openplatform/83f9d15184fbc43b40ec70b5073d6e204bfa22ec.png)

# 浏览器客户端实现监看当前访问节点

利用浏览器JavaScript发送HEAD请求拿取对端响应头Server字段并回显（若跨域则需要设置 **Access-Control-Expose-Headers** 响应头，值为 **server**
![](https://i0.hdslb.com/bfs/openplatform/4a9a27b3905b6573eeb86f7fc0da767c28bfd5dd.png)
![](https://i0.hdslb.com/bfs/openplatform/2b4e884fe79523eeeda04aba41939269ed5ca240.png)

# 注意事项

- ESA Page对超多资源和大文件支持很差。例如静态随机图项目无法部署到ESA Page（超出了2000个静态资产）
- ESA CDN针对于回源非标端口和Cloudflare一样要通过写回源规则实现，很浪费规则，推荐使用EdgeOne CDN，可以随意指定回源端口
![](https://i0.hdslb.com/bfs/openplatform/56c95271fca28449fee8dc11b921312aaa72e1bc.png)
- 如果你要做分流业务，必须将域名NS托管在国内的DNS解析服务商，因为Cloudflare不支持域名分流解析，并且请将默认解析给CF，将境内解析给国内节点，不要反着来
![](https://i0.hdslb.com/bfs/openplatform/02b8b6e0d45ea0fdb1dcb253ddbf127e0e8e1106.png)
- 分流的原理是DNS看查询的源IP，如果是国内则返回国内节点，海外则返回海外。也就是说你的出口IP决定访问的节点，若你开梯子（如美国），就算你在国内，访问到的也是海外节点
- DCV委派只能写一条，如果你的NS在EO，可以写DCV给ESA，而Cloudflare使用HTTP验证，这一切都将是一劳永逸，全自动化的
- Cloudflare SaaS 在接入外部域名时，非常建议选择 HTTP验证来签发SSL，下文会详细说明该验证模式的好处。我们都知道，Cloudflare SaaS 在创建的时候，对于申请SSL默认选项是 TXT验证，但是该方式并不好，我们都知道，使用TXT验证的确可以签发证书，但在3月后（上一个SSL证书过期后），我们需要及时更新TXT记录来重新申领新的SSL证书，但是HTTP验证就不是这样了，Cloudflare CDN会自动在边缘节点放上HTTP验证的文件，并且Cloudflare可以随时更改，这样，你就不需要在申领新SSL的时候做任何事情了，一切都由Cloudflare自动实现
- Cloudflare SaaS接入外部域名后，对于该外部域名是可以享有所有Cloudflare单域名下服务（也包括Cloudflare Worker，参见： [Cloudflare Worker 优选](/posts/cf-fastip/#%E9%92%88%E5%AF%B9%E4%BA%8Ecloudflare-workers/)）。也可以配置规则等业务，你最终访问的是哪个域名就写哪个主机名，不要写回退源的主机名，除非你想让该规则仅在直接访问回退源时生效
![](https://i0.hdslb.com/bfs/openplatform/be9a211a1b3459eb742c9c730905c7fb28370082.png)
![](https://i0.hdslb.com/bfs/openplatform/52bc01d3bda0732679866882891bc5e69cd8f4c1.png)
- Cloudflare Tunnel实际上是可以自定义生效的域名的，并非仅局限于账户内域名（虽然你在控制台看着是这样），我们可以通过抓包更改请求体来实现各种各样的域名，它没有验证，详见：[Cloudflare Tunnel 优选](/posts/cf-fastip/#%E9%92%88%E5%AF%B9%E4%BA%8Ecloudflare-tunnelzerotrust/)
![](https://i0.hdslb.com/bfs/openplatform/499d4605c2c369204b5cea006ec0724b0c7d0d56.png)
- 分流做完后，一定要针对国内节点启用封锁海外模式，这能大大降低被DDoS致使CDN商给你域名取消接入的概率。Cloudflare随你，因为打不死，如果你的源站Hold不住，也请配置点策略。因为刷子（DDoS发起者可以通过强行绑定域名和IP来通过便宜量大的海外IP来攻击你脆弱的国内节点，如果什么防护都不做，很可能被刷几个TB的异常流量然后被CDN取消接入）
![](https://i0.hdslb.com/bfs/openplatform/a6e944cba747dc8f117e49a4dc43b743ff6695f9.png)
![](https://i0.hdslb.com/bfs/openplatform/15d97939f2d7651a29b37dc43227fa7da2c179f2.png)
# 成果展示

### 博客本体

![](https://i0.hdslb.com/bfs/openplatform/5d7f2056a03248acfd5e07dc81a78c5c3589b075.png)
### Umami
![](https://i0.hdslb.com/bfs/openplatform/3ed8ca63ac892313f9ed10d5d50fc111260f0904.png)
### 随机图
![](https://i0.hdslb.com/bfs/openplatform/537420d3d9f02c903a3c233186088a9b7cd8938a.png)
---
title: 测评一下SecBit MCDN HK区域的质量
published: 2025-07-02
description: '在我哥们的帮助下也是成功通过我的博客拿到了Secbit的免费MCDN服务，再见EdgeOne（'
image: https://i0.hdslb.com/bfs/openplatform/564239aedbdf27ca9c4bf8d577f520fd2fd6fd59.webp
tags: [Secbit]
category: '记录'
draft: false 
lang: ''
---

# 官网

https://secbit.ai

# 测试节点信息

安徽合肥移动家宽（本人电脑）  

# PostMan GET测试

测试Cloudflare R2默认的404页面HTML需要多长时间可以接收到

## 直连Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/178a10478845189317324eb78697bab68ecd2cf9.webp)

## Secbit回源Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/0f6c5b502c54f2b65b3841d9a477870b66991e2d.webp)

# ITDog Tcping测试

## 直连Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/517833740f42a9d6235877f3db245bbfe078e288.webp)

## Secbit回源Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/6f424dcc427a527cb951bced557ab262664d398e.webp)

# ITDog 网站测速

## 直连Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/097b8cf202c0ad3f0e3b51204d033a7356931c53.webp)

## Secbit回源Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/d1c4615de9889b176d4ff96e4dbc6d90fd521f11.webp)

# 大文件下载

## 直连Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/66c592c5e7453a7c651ef73b677b0705d24d3cc4.webp)

## Secbit回源Cloudflare R2

![](https://i0.hdslb.com/bfs/openplatform/9d7552d85df1086d3926da0691f69e99c42f0539.webp)

---

# 总结

Secbit相较于Cloudflare对于大陆直连更为友好，延迟更低、带宽更大。唯一的缺点就是直接买很贵，也建议大家可以多多写博客，**网站月ip达到3k可以看置顶文章加群联系我帮你申请**，争取早日拿到属于你们的Secbit😋

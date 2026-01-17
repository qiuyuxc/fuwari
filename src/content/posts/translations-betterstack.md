---
title: 我给BetterStack的状态页面汉化了
published: 2025-08-28T18:46:27
description: '闲来无事，打开BetterStack的状态页面发现一会中文一会英文，受不了了，全部汉化！'
image: 'https://i0.hdslb.com/bfs/openplatform/86a9ee48697fc23d99e25763e1792acbb74ceb2f.png'
tags: [BetterStack]

draft: false 
lang: ''
---

# 速览

现在点击 [这里](https://ss.2x.nz) 或者顶部导航栏的 `状态` 即可查看中文的BetterStack的状态面板

# 汉化过程

在 [BetterStack](https://uptime.betterstack.com/) 左侧导航条的 `Status pages` 进入你的状态面板域名，然后进入 `Translations` 即可开始汉化

![](https://i0.hdslb.com/bfs/openplatform/11d4fd5b1389ab280f9e443028a50607bccb8284.png)

# 一些小插曲

因为BetterStack完全没有顾及中国用户，所以对于 `日` 和 `年` 的翻译没有后缀，不过我们可以硬编码一下

![](https://i0.hdslb.com/bfs/openplatform/931daeb394f1ebb18bd4be6db76eb92136f5cd94.png)

而对于 `月` 直接这样写

![](https://i0.hdslb.com/bfs/openplatform/21cb8d1a467be33e9662894abbb6d73db4702773.png)

BetterStack对于 `UTC+8` 会自作聪明使用 `CST` 。这是一个有歧义的时区缩写，我们同样可以使用硬编码来解决

![](https://i0.hdslb.com/bfs/openplatform/6866161b091d160d8999608d7c6f698e4ee84098.png)

![](https://i0.hdslb.com/bfs/openplatform/6de284fc7a67440635874a87451396e348b6f709.png)

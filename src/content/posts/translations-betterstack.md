---
title: 我给BetterStack的状态页面汉化了
published: 2025-08-28T18:46:27
description: '闲来无事，打开BetterStack的状态页面发现一会中文一会英文，受不了了，全部汉化！'
image: '../img/f435f735692d0789faee68ca3442b62e.png'
tags: [BetterStack]

draft: false 
lang: ''
---

# 速览

现在点击 [这里](https://ss.2x.nz) 或者顶部导航栏的 `状态` 即可查看中文的BetterStack的状态面板

# 汉化过程

在 [BetterStack](https://uptime.betterstack.com/) 左侧导航条的 `Status pages` 进入你的状态面板域名，然后进入 `Translations` 即可开始汉化

![](../img/b00690e69ff50392735aed0394ba9195.png)

# 一些小插曲

因为BetterStack完全没有顾及中国用户，所以对于 `日` 和 `年` 的翻译没有后缀，不过我们可以硬编码一下

![](../img/bdba89d0feb30dd15d5bab01df0d49eb.png)

而对于 `月` 直接这样写

![](../img/ef9afff0b2ec38c20f9b5f5d1ff18414.png)

BetterStack对于 `UTC+8` 会自作聪明使用 `CST` 。这是一个有歧义的时区缩写，我们同样可以使用硬编码来解决

![](../img/4f122ec3724ff89a8a445b0c918f30ef.png)

![](../img/4027b3f215aaccc799aa10e32db31579.png)

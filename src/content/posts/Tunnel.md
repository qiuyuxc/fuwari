---
title: CloudflareTunnel的优选实践
published: 2026-01-14
description: '通过 Cloudflare Tunnel + SaaS，优化 Tunnel 站点的访问体验'
image: 'https://ipfs.klbbs.top/images/38.webp'
tags: [CDN,Cloudflare,Tunnel,SaaS]
category: 'CDN'
draft: false 
lang: 'zh-cn'
---

## 准备阶段
> 1.准备两个域名[付费/免费都可以]

> 2.海外借记卡/PayPal[用于验证开通SaaS]

## 理解
>设域名分别为xik.com,cf.com,如需最终访问地址为*.xik.com,则使用cf.com为配置SaaS的域名,反之同理.
[xik.com为主域名,cf.com为辅助域名]

>如果你只有一个域名的话，可以使用子域名来作为替代如saas.cf.com


在理解两者的关系后,开始进行实际操作


## 实操
>在你的Tunnel中给你需要优选的站点添加两个不同的域名[主域名与辅助域名]

![示例](/assets/image/Tunnel1.png)

>在[辅助域名]的dns解析中添加任意[A,AAAAA,CNAME]记录值,开启小黄云,以用于回退源



例如这边我将子域名指向了谷歌的8.8.8.8,只要保证小黄云是开启状态，走cloudflare即可


![示例1](/assets/image/Tunnel2.png)


再添加一条指向社区优选的CNAME记录,可以从以下站点获取


```
https://cf.090227.xyz/
https://www.byoip.top/
```

切到主域名的dns,找到你Tunnel中添加的子域名解析记录,修改记录值为你指向优选的子域名,关闭小黄云

>如y.cf.com指向了cf.090227.xyz,这里的主域名指向y.cf.com，非直接使用cf.090227.xyz


回到辅助域名,选择侧边栏SSL/TSL 中的自定义主机,添加刚才设置的子域名[saas.quiyu.com]为回源域名


再选择添加自定义主机名


第1行填你最终需要访问的域名


![示例5](/assets/image/Tunnel5.png)


验证方法自行选择


>源站选择你在Tunnel绑定的辅助域名[没有修改过Tunnel指向的域名]


添加后复制给的TXT验证记录值，在对应域名添加,等待生效


全部生效后,使用itdog等站点进行测试,确认是否生效


## 以下是晚高峰对比图

>未优选

![未优选](/assets/image/Tunnel3.png)

>优选

![优选](/assets/image/Tunnel4.png)
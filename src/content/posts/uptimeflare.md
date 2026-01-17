---
title: 超高校级的监控服务：UptimeFlare！基于CF Worker！自托管！声明式！新手友好！
published: 2026-01-03T03:10:53
description: 谁不想拥有一个监控自己服务的服务呢？
image: https://i0.hdslb.com/bfs/openplatform/4f474e590216de19ff59622989e84894252314b8.png
draft: false
lang: ""
---
# 从KV迁移
由于原项目于26/1/3将数据存储从KV迁移到了D1，并且配备了完备的i18n，如果你仍在运营旧版的UptimeFlare，建议升级，下面是迁移教程

首先，将你之前配置的Cloudflare API令牌添加一个新的权限 **编辑D1**

然后备份根目录的 `uptime.config.ts` ，直接 把原仓库删了（但是不要删KV，Worker，Page），Fork我的仓库

::github{repo="afoim/UptimeFlare"}

接下来编辑新的 `uptime.config.ts`

参阅 [UptimeFlare/uptime.config.ts at main · afoim/UptimeFlare](https://github.com/afoim/UptimeFlare/blob/main/uptime.config.ts) 主要就是将自定义callback迁移到官方的WebHook方法

编辑后推送，会自动触发Github Action的自动部署，它会自动将KV内的数据迁移到D1

这迁移到D1何意味
![](https://i0.hdslb.com/bfs/openplatform/9814e0cf3b07c7723059a476416a976accfe9f22.png)

# 前言
本来这个教程应该是永远都不会出的，因为在此之前，我曾经给大家介绍了一个无需自托管的监控服务：[UptimeRobot](/posts/uptimerobot/) 

但是，就在最近我再次查看控制台，发现之前创建的监控全部都没了，咱也不知道是被官方删了还是号被黑客大手子肘击了，总之，我现在不得不要重建监控服务了

# 原理
首先，UptimeFlare是一个基于Cloudflare Worker+D1的监控服务

它的原理非常简单，一共由三个部分组成
- **前端**：放在Cloudflare Page，用于给用户展示zhandianzhuangt
- **后端**：放在Cloudflare Worker，通过 Worker 自带的 **Cron** 每分钟 检查站点状态，并将状态持久化进 **D1** 
![](https://i0.hdslb.com/bfs/openplatform/7b665ca3823814896e404526fbb47290e3c264b5.png)
![](https://i0.hdslb.com/bfs/openplatform/209ba27aff4e0bc096e7c56d48e9849ea502d822.png)

# 正式开始
首先我们需要 **Fork** 项目，建议Fork我的项目（由于原项目不知道为什么不给在某些地方注入环境变量，所以建议Fork我的）

::github{repo="afoim/UptimeFlare"}

首先，我们先尝试将其部署到Cloudflare

创建一个Cloudflare API Token **编辑Workers** 和 **D1** 
![](https://i0.hdslb.com/bfs/openplatform/1962eadcd0efacb1d6bfe1967fd3f41b78ed5dbf.png)

接下来将该Token绑定到你的Github仓库
![](https://i0.hdslb.com/bfs/openplatform/17620a61af83ec25277939afec873cb8f8fd2ede.png)

最后，来到 `Action` 页面，手动创建一个 `Deploy to Cloudflare` 的工作流
![](https://i0.hdslb.com/bfs/openplatform/316f7d4d49326879bb71916ee2a0621738209e0f.png)

等待工作流运行结束，你应该可以在Cloudflare仪表板看见一个新的Page，新的Worker和新的D1
![](https://i0.hdslb.com/bfs/openplatform/1f696c12856e2565bcb5d0127d55cbba1636644b.png)


点开 Page，注意不要点错了
![](https://i0.hdslb.com/bfs/openplatform/d55d588e59ab3604a053dcf160a48bdf1f8cab57.png)

绑定你的域名，尝试访问
![](https://i0.hdslb.com/bfs/openplatform/a389966d539a777860d9d7cd9d29775a6de85551.png)

如果你能看到一个初始的监控页面，则正常
![](https://i0.hdslb.com/bfs/openplatform/719f09a2ded27f76b1900f281c3cfa301c3d98df.png)

接下来，我们开始自定义该监控

编辑根目录的 `uptime.config.ts` 

如果服务故障如何做通知？

UptimeFlare非常自由，你可以在 `callbacks` 中编写故障时要做的任何事情，这里以发送 `POST` 请求让 `Resend` 发送邮件给你举例

首先前往 https://resend.com/

添加一个域名（作为你的发信域名）
![](https://i0.hdslb.com/bfs/openplatform/b50d5be1e9dd450bba4592a9c12ca6f390bcceee.png)

创建一个发信API Key
![](https://i0.hdslb.com/bfs/openplatform/0e10844f64b97638cc10098ebb57244ef5c4839c.png)

添加环境变量： `RESEND_API_KEY` 将其绑定到 **Action**

![](https://i0.hdslb.com/bfs/openplatform/87cf39305057335d86823be4872b90f20668c71d.png)

编辑 `uptime.config.ts` 的 `webhook.payload` 部分

示例代码：
```ts
        payload: {
        "from": "系统状态更新 <uptimeflare@update.2x.nz>",
        "to": ["acofork@foxmail.com"],
        "subject": "UptimeFlare 状态更新",
        "text": "$MSG"
      },
```

接下来，当服务故障/重新上线就会通知你啦~
![](https://i0.hdslb.com/bfs/openplatform/5291ee9dec13d2a0dbd5d36705c55a0a0987bf90.png)

最终效果：
::url{href="https://ok.2x.nz"}
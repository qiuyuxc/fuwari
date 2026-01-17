---
title: 在Mac上玩GalGame竟如此简单！
published: 2025-09-30T19:29:21
description: 虽然说用了Mac就等于远离了所有游戏，但是偶尔还是想打打Gal放松放松的，那么有没有傻瓜式的方法让我们可以抱着Mac在床上嗯嗯啊啊呢，有的！
image: https://i0.hdslb.com/bfs/openplatform/19bfb6116675faab6d8eb0b60cc6611127731395.png
tags:
  - Mac
  - GalGame
  - 虚拟机
draft: false
lang: ""
---
# 思路
首先，新版的Mac用的是Arm架构的Apple自研芯片并且搭载基于Unix的MacOS系统。而大部分游戏则是专为Windows x64打造的。也就是说，我们需要翻译两层，首先将Unix转Win，再将Arm架构专为x64架构

诚然，你可以使用 **[CrossOver](https://www.codeweavers.com/crossover)** 来自动化这个流程，或者手动在Apple开发者工具下载GPTK手动执行该操作。但是这两个操作一个要钱，一个要命（指时间和脑子）

我们这里采用 **虚拟机** 来简化这些操作。由于是虚拟机，所以只需要准备一个Arm镜像就可以在Mac上完美运行一个Arm的Win11系统，又由于微软干的大好事，Arm版本的Windows11在运行x64程序是会自动转译，所以我们只需要保证必要的运行库安装即可。是的，这可能在性能上会大打折扣，但是兼容性是最高的，且如果你只玩Gal这种类PPT游戏，性能差距感知不强
# 正式开始
首先，我们下载虚拟机软件 **[VMware Fusion](https://support.broadcom.com/group/ecx/productdownloads?subfamily=VMware%20Fusion&freeDownloads=true)** （需要注册一个博通账号）

登录后你可能会被重定向到 Dashboard，再次访问一次链接即可进入下载软件界面
![](https://i0.hdslb.com/bfs/openplatform/1f530e753453ec31d14e449b51ba5c8ba8a6ee36.png)
⚠️注意：你可能会发现下载按钮被禁用，这并不是你没有权限，而是你没有阅读用户许可协议，你可能又会发现，用户许可协议的勾打不上。请先点击用户协议超链接，不管你看没看，再回退到之前到页面，你就会发现用户许可协议的勾可以被选中了

让我们省略一下安装过程...

假设你已经成功安装了 **VMware Fusion**
![](https://i0.hdslb.com/bfs/openplatform/3d4a7e34692104e85025319c502c3cfbc53cd17c.png)
接下来我们去下载 **Windows 11 On Arm** 的ISO镜像： https://www.microsoft.com/zh-cn/software-download/windows11arm64

你会得到
![](https://i0.hdslb.com/bfs/openplatform/c251cde99b362fcfd1d45ad3bf2630425767e295.png)
再次打开 **VMware Fusion** ，新建一个虚拟机，并导入ISO文件，按需调整虚拟机配置即可
![](https://i0.hdslb.com/bfs/openplatform/84b00ff93038e00ff8d8255d07eb7055c0c67d60.png)
最终，我们启动虚拟机，完成Windows11安装向导，进入Windows桌面。此时你的Windows可能看起来糊糊的，那是因为没有安装 **VM Tools** ，安装一下即可
![](https://i0.hdslb.com/bfs/openplatform/efdfcc19a5f830c967f827e373c33fef38db416d.png)
此时你已经完成90%的步骤了，你已经可以把你的Mac当Windows用啦！但是为了让后续的游戏能顺利运行，我们还是要装一下必要的运行库

前往 https://zhangyue667.lanzouh.com/DirectXRepairEnhanced 下载并解压运行DX修复工具。运行后，程序会自动安装DX9和VC++运行库，这足以保障大部分游戏顺利运行！

如果遇到游戏打不开或第一次能打开后续打不开，请按需配置微软仿真

![](https://i0.hdslb.com/bfs/openplatform/d080d6b99a50c5cd4dcd7b3418fb21031713ee87.png)

现在，享受吧！
---
title: 如何绕过Steam直接启动Steam上的游戏？
published: 2025-10-15T14:39:40
description: 经常买Steam单机游戏的小伙伴们都知道，Steam上的大部分游戏在启动时都要求Steam在后台运行，那么如果我只是在玩一个单机游戏又不想带Steam启动要怎么办呢？这篇文章来帮你
image: https://i0.hdslb.com/bfs/openplatform/8d35dec91c637a03463508f42a221bbc8c3f5c9e.png
tags:
  - Steam
draft: false
lang: ""
---
# 正式开始

首先我们需要有一个完整的Steam版的游戏包体

前往 `Steam\steamapps` 你会发现有很多的 `appmanifest_xxx.acf` 文件。

![](https://i0.hdslb.com/bfs/openplatform/9c80e160db51b78169d38b0f8258609e024944a9.png)

使用 **记事本** 挨个打开，知道找到你需要Hook的游戏，记录以下信息

![](https://i0.hdslb.com/bfs/openplatform/8034920ba2734b8f7b140d0cf3bf99976d1641ab.png)

前往 [Wu-Yijun/steam_client_loader](https://github.com/Wu-Yijun/steam_client_loader)

下载最新的文件名带有 **Windows** 的 **Release**
![](https://i0.hdslb.com/bfs/openplatform/581d592e522b8ac6253b199261b0e4784b1ba90e.png)

解压，剔除无关文件

![](https://i0.hdslb.com/bfs/openplatform/acdee68274fb0c1faca9491d898880c7a516985e.png)

编辑 `ColdClientLoader.ini`

```
#My own modified version of ColdClientLoader originally by Rat431
[SteamClient]
Exe=manosaba.exe
ExeRunDir=.
ExeCommandLine=
#IMPORTANT:
AppId=3101040

SteamClientDll=steamclient.dll
SteamClient64Dll=steamclient64.dll
```

`Exe` 填写要启动的程序名称

`AppId` 填写上一步获取的

保存

进入 `steam_settings`

编辑 `force_steamid.txt` 填入上一步获取的 `LastOwner` 字段的值

编辑 `DLC.txt` 填入 `AppId=Name`，如

```
3101040=魔法少女ノ魔女裁判
```

回到根目录，将所有文件复制到游戏文件夹内，如图

![](https://i0.hdslb.com/bfs/openplatform/18b658076886bb24e4c05c6feb49366091bbaf05.png)

随后运行， `steamclient_loader.exe` 即可在不启动Steam的情况下直接拉起游戏
---
title: Win11保留数据无损降级Win10！
published: 2025-11-23T15:18:40
description: 我真的受够了Win11那黏黏的感觉了，什么？能降级？还是官方手段？还能保留数据？？?
image: ../img/852fe67f3827c6d79ff7ea138a3b3135.png
tags:
  - Windows
  - 降级
draft: false
lang: ""
---
# 前言

### 为什么要回到Win10
有太多理由了
- Win11几乎只升级了UI，并且新的UI优化不完全，导致很多地方有粘滞感，参见： [我们发现了Win11操作总是不跟手的深层原因！_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV11MVoznE4L/?spm_id_from=333.1387.search.video_card.click&vd_source=6b94c66d8e200ba092130f674228bbff)
- Win10和Win11都是NT 10.x的内核，能跑在Win11上的程序必然能在Win10上跑。而微软大部分的程序文档中规定的最低版本号几乎都为 `Windows 10 1607 and later` ，也就是 **支持 Windows 10 2016年的版本，以及之后的版本** ，而我们一般使用的都比这新的多，如 `21h2` `22h2` ，根本不用担心兼容性问题

### 这种非正常手段的“升级”有哪些影响
几乎没有影响，虽然我们需要做点善后工作，但得益于Win10和11本质上是一个东西，并不会造成什么不可逆的损害

### “升级”后，我会丢失什么？
Win11有但Win10没有的东西会消失，两者都有的会保留。专为Win11打造的Appx，“升级”后会不可用或直接消失

### 是保留数据的“升级”吗
是的。理论上来说仅会替换Windows版本，并不会清除你的所有数据，如应用，文档，个人信息

### 为什么微软不开放官方通道降级？
其实是有的，当你先安装Win10，再通过Windows更新升级为Win11后，你有30天的后悔期，期间你可以在设置中选择回到Windows 10。但30天并不是一个特殊的日子，只是微软为了减少麻烦设置的一个保守日期

# 正式开始
:::caution
数据无价，谨慎操作
:::

:::warning
确保你有PE U盘，如果你听不懂我在说什么，请不要继续操作！
:::

首先确保你正在运行Win11的 **正式版** ，如果你加入了 **Windows Insider Preivew** ，请想办法回到 **正式版** 

接下来我们先去下载Win10的ISO，前往 https://www.microsoft.com/zh-cn/software-download/windows10 ，如果你发现你没有可以下载ISO文件的地方，如图
![](../img/85d83f2ade18d1ec444f5f53f5b647d7.png)

点击F12，打开Devtools，切换为设备仿真
![](../img/9530a59667276ab1d96fdb0d4df51ef2.png)

按F5，刷新页面，此时网页就会认为你是手机，就会让你下载ISO了
![](../img/9d0ed459d5ba3cebe0fef5a0545b77fd.png)

选择版本 **Windows 10 （多版本ISO）**
![](../img/999932ad8d1407290d8d27511ef70825.png)

选择 **简体中文**
![](../img/7836344e0e39fb37ec3344abf4b20bba.png)

下载 **64位版本的ISO**
![](../img/c310fc339f0b3e94c6ee96fee89ef4d3.png)

得到ISO文件
![](../img/332531b22181a7fc0df11d69b426b028.png)

确保你安装了 **支持解压缩ISO** 的软件，如 [Bandizip 官方网站 - 免费压缩软件下载 (Windows)](https://www.bandisoft.com/bandizip/) ，**解压ISO文件**
![](../img/71492d49f2d73ab5729deb86d1fff2fb.png)

打开 **已解压的ISO** 文件夹，重命名 `setup.exe` 为 `setup1.exe`
![](../img/4a24a661be8d01b836a705f4d3962a6f.png)

更改文件属性 - 兼容性为 **Windows 8** 
![](../img/873173da4ac4a9881182b1ba87554a3a.png)

下载伪装文件： [Win11ToWin10.zip](https://acofork-my.sharepoint.com/:u:/g/personal/af_acofork_onmicrosoft_com/ESxJWKgjjHVEhlNoBG4oNWUB_-rGTlLRh1CkXdLoxJsGpw?e=8s79zt) 目的是强制激活安装程序中的 **保数据升级** 

解压出 `ei.cfg` 和 `setupcompat.dll` 。将其复制到ISO文件夹下的 `sources` 文件夹并替换其中已有的文件
![](../img/7faab8cb4eeb0f38f2bfdcf6f6ac4c1a.png)

打开 `setup1.exe` ，**更改 Windows 安装程序下载更新的方式**，选择 **不是现在**，然后一路下一步
![](../img/1c147c2f85203889220fcb9910f1b048.png)

等待变为 **准备就绪，可以安装** ，并确保 **保留个人文件和应用** ，选择 **安装** 
![](../img/852fe67f3827c6d79ff7ea138a3b3135.png)

等待设备开机时从 **白条转圈** 变为 **白点转圈** ，即Windows10已被安装
![](../img/64c9351ea6d1021073a54902b06a1581.png)

接下来你第一次开机可能会黑屏。表现为用户登录后随着一声警告声并且黑屏，此时移动鼠标可以看到光标移动，但无法点击屏幕上的任何元素

进入其他系统（如U盘中的PE系统），删除所有 
```
C:\ProgramData\Microsoft\Windows\AppRepository\StateRepository-开头的文件
```


再次开机，应该可以成功开机了

接下来 `Win+X` 打开管理员的Powershell

首先修复一下系统
```
Dism.exe /Online /Cleanup-Image /CheckHealth
DISM.exe /Online /Cleanup-image /Scanhealth
DISM.exe /Online /Cleanup-image /Restorehealth
sfc /scannow
```

接下来修复系统应用
```
恢复系统应用：add-appxpackage -register "C:\Windows\SystemApps\*\AppxManifest.xml" -disabledevelopmentmode

恢复内置应用：add-appxpackage -DisableDevelopmentMode -Register "C:\ProgramData\Microsoft\Windows\AppRepository\*\AppxManifest.xml" -verbose

恢复应用商店安装的应用：add-appxpackage -DisableDevelopmentMode -Register "C:\Program Files\WindowsApps\*\AppxManifest.xml" -verbose
```


至此，已完美“升级”为Windows10
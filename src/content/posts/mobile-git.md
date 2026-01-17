---
category: 随笔
description: 在桌面端，我们可以使用vsc+obsidian来写文章，那么在手机上呢？
draft: false
image: https://i0.hdslb.com/bfs/openplatform/53e6f907e7ab421713318a96af1d76ef1fc90c43.jpg
lang: ""
published: 2025-11-11
tags:
  - Git
  - 博客
title: 如何在安卓手机上优雅的写我的博客
---
# 正式开始
为了让我出门在外也能通过我的手机来撰写我的博客文章，我研究了一下，发现是完全可以的

首先，我们需要挑选一个手机上的git客户端，这里我使用的是 https://github.com/catpuppyapp/PuppyGit

安装之后，点击右上角的加号，点击克隆，即可克隆仓库
![](https://i0.hdslb.com/bfs/openplatform/09318ff0379b16062955ec6d25c39fa825da5e0c.jpg)

创建Github Token
![](https://i0.hdslb.com/bfs/openplatform/5060d358fa6131132bd7973a6538fbf56bddd414.jpg)

将其添加到小狗Git
![](https://i0.hdslb.com/bfs/openplatform/8523fdc7ee6e8c083089fc92bf8fb4b2c804a0d0.jpg)

链接仓库![](https://i0.hdslb.com/bfs/openplatform/3743237af02d53d758fa063454386a1c3cbceabe.jpg)

当你修改好后，点击 **需要提交** 按钮，进入提交界面
![](https://i0.hdslb.com/bfs/openplatform/15646dfe2a1d6d84e8757ac263106ddc8f3c6adb.jpg)

进入后点击右上角三个点就可以做我们最常用的 **提交（commit），拉取（pull），推送（push）** 啦
![](https://i0.hdslb.com/bfs/openplatform/322b609aec4743d661d49c759a139226f20fabc1.jpg)

好的，既然我们有了git客户端，那么既然要写文章，自然是需要一个好用的markdown编辑器，很巧的是，**obsidian** 也有移动端！
![](https://i0.hdslb.com/bfs/openplatform/b11c5efc1fa24b067dd647bfbf0dcb06401ce180.jpg)

打开后导入仓库（src/content）就可以啦，并且会自动同步桌面端的插件，无缝迁移！
![](https://i0.hdslb.com/bfs/openplatform/ed31febb1555421e0b4230d50d111fc7cd3e84d5.jpg)

在桌面端，我们想要新建文章一般会用Fuwari特有的 `pnpm new-post xxx` 命令，不过在手机上我们可以曲线救国，选择一个文章，**创建副本** 后再更改元数据即可！
![](https://i0.hdslb.com/bfs/openplatform/fbe32ba89e0ce72d6920dc7146c4565bbcd8c26a.jpg)

最后！本篇文章也是用手机写的哦！
---
category: 随笔
description: 在桌面端，我们可以使用vsc+obsidian来写文章，那么在手机上呢？
draft: false
image: ../img/091e5125d66e00a3b5df7d6b5472bda5.jpg
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
![](../img/e9c9d919a3b3228d03de1de4d56443f8.jpg)

创建Github Token
![](../img/fa2292930c6c6f2ea342e738ce34c8d4.jpg)

将其添加到小狗Git
![](../img/8e1918c6783d9836475f955eb466660f.jpg)

链接仓库![](../img/f4e68cfc06bdb58975b114b7863f7d81.jpg)

当你修改好后，点击 **需要提交** 按钮，进入提交界面
![](../img/574e4aa149a7f38ad35fbd81fdfd2b2d.jpg)

进入后点击右上角三个点就可以做我们最常用的 **提交（commit），拉取（pull），推送（push）** 啦
![](../img/480315952b3aa03077a7b72ea59449a0.jpg)

好的，既然我们有了git客户端，那么既然要写文章，自然是需要一个好用的markdown编辑器，很巧的是，**obsidian** 也有移动端！
![](../img/bb719fa2d9506992c15aefd88fe0571f.jpg)

打开后导入仓库（src/content）就可以啦，并且会自动同步桌面端的插件，无缝迁移！
![](../img/f0fa49681289e0be8a16964b4159d2cf.jpg)

在桌面端，我们想要新建文章一般会用Fuwari特有的 `pnpm new-post xxx` 命令，不过在手机上我们可以曲线救国，选择一个文章，**创建副本** 后再更改元数据即可！
![](../img/fd0c37075b89369c74001491daf9de63.jpg)

最后！本篇文章也是用手机写的哦！
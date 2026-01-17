---
title: 你是我吗？
published: 2025-08-12T15:43:18
description: '博客开源了就会有很多小笨蛋Fork完改也改不全，导致评论也评论到我这来了，浏览量统计也来我这来了😅'
image: 'https://i0.hdslb.com/bfs/openplatform/dcc3edcebd735148e87eebda9d547e7d49bb376a.png'
tags: [CORS]
category: '记录'
draft: false 
lang: ''

---

# 前情提要

今天收到一封小邮件

![](https://i0.hdslb.com/bfs/openplatform/001731e04dcad7fcc9cc62dc855f574b92d22b34.png)

我一眼就看出来了

有人Fork完我的仓库但是Giscus评论区没改成自己的。

# Giscus仅允许自己

在启用了Giscus的仓库放一个文件

```json
<!-- giscus.json -->
{
  "origins": ["https://2x.nz"]
}
```

这样设置后，即使有人在它的网站上引入了**你的评论区**，也会被拒绝显示

![](https://i0.hdslb.com/bfs/openplatform/d6758f5d93adb51ebb6f41eed7d01c5a66c265b0.png)

# Umami仅允许自己

我博客有一个浏览量统计，基于Umami，之前是没鉴权的，如果你啥也不改，访问你的网站也会记到我网站上😅

Umami并没有给配置来更改CORS（毕竟这个访问量统计是我逆向出来的）

但是我的Umami套了EO，我可以直接写一套CORS规则仅允许自己调用

![](https://i0.hdslb.com/bfs/openplatform/05e5f90130f812eef58cc41f319d2fa82322407f.png)

这样的话，即使你啥也不改，也不会把错误的统计信息发到我这，会报错CORS头不允许

![](https://i0.hdslb.com/bfs/openplatform/43255b02295397e3c258f5d3b392973daee52fd5.png)

# 最后

开源是为了让大家更好的学习我的博客框架，不是让你照搬，请确认将所有内容、API端点、私有服务全部改为自己的后再上线！

你要是懒可以Fork[上游原仓库](https://github.com/saicaca/fuwari)从白纸开始[改](/posts/fuwari/)

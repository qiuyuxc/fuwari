---
title: 白嫖免费的3x-ui面板
published: 2025-05-01
description: '3x-ui面板是一个非常好用的代理面板，很多人都在使用他，如果有人使用的是默认密码...'
image: https://i0.hdslb.com/bfs/openplatform/ce6fd5cfc6af51c10ceae061f7a36363f97491ab.webp
tags: [3x-ui]
category: '记录'
draft: false 
lang: ''
---

# 正式开始

首先我们要先找到互联网上搭建了3x-ui的网站，可以使用 [网络空间测绘，网络空间安全搜索引擎，网络空间搜索引擎，安全态势感知 - FOFA网络空间测绘系统](https://fofa.info/)

![2025-05-01-22-14-32-image.png](https://i0.hdslb.com/bfs/openplatform/c02ddcbe7da71ffe2f6b61557ff840d87ac9dce7.png)

进入后我们搜索：`app="3x-ui" && region="HK"` 即寻找3x-ui网站，并且地区为中国香港的

接下来我们制作一个TXT文档，里面全部都是搭建了3x-ui的网站，如图![](https://i0.hdslb.com/bfs/openplatform/c719e9a8e42c8631f0d64b79fd3caa4e44fe3ac6.webp)

然后我们就要找到3x-ui的登录原理

通过正常登录可知，他会请求 `/login` 并且以 `application/x-www-form-urlencoded; charset=UTF-8` 格式发送请求体

![2025-05-01-22-10-39-image.png](https://i0.hdslb.com/bfs/openplatform/7eab4d0c370f4b8ff1d4bc0292fd6e896178df83.png)

接下来让我们查看请求体，非常简单！只有一个 `username` 和 `password`

![2025-05-01-22-12-14-image.png](https://i0.hdslb.com/bfs/openplatform/6dd617e6659ea99c05fd595940bbcbfaccfe83e5.png)

然后让我们在Postman中模拟请求...完全没有问题！

![2025-05-01-22-12-46-f6cec50c16c94c50acc0e23150edde22.png](https://i0.hdslb.com/bfs/openplatform/4f80476459c29f5440a9cc946f38405ca6d43088.png)

接下来就可以编写爬虫了！

大致原理：依次请求TXT内的网站，并且模拟登录，如果弱口令登录成功，并且网站返回登录成功的JSON，就将它记录到另一个TXT。循环结束后就能得到非常非常多的白嫖的节点了！

![2025-05-01-22-16-13-image.png](https://i0.hdslb.com/bfs/openplatform/0a3dd76183176a998d06f6ca63fdf0dd1e796bb5.png)

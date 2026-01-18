---
title: 利用Cloudflare Page提供的重定向功能实现无损耗、不限数量的静态重定向！
published: 2025-07-13
description: 'Cloudflare的重定向规则非常强大，但是如果直接使用重定向规则创建批量重定向会消耗很多的配额'
image: ../img/3d54d0ac041e57fc24319977d91d3013.webp
tags: [Cloudflare]
category: '教程'
draft: false 
lang: ''
---

# 快速上手！

直接 Fork我的 [仓库](https://github.com/afoim/Redirect_Group) 。

接着将该仓库连接到Cloudflare部署Worker或Page，然后绑定你的域名

![](../img/47ecda56ad6ba3100b7ffa9e3e635e07.webp)

接着更改 `_redirects` 内的文件

![](../img/3c78c425421ce48b5c6b4820cb8a9522.webp)

例如： 

```bash
/ https://www.afo.im/ 301
/test/* https://test.test/test/:splat 302
```

则意味着

访问 `/` 301 永久重定向到 `https://www.afo.im/` 

![](../img/1c6c38c7afe547a46ca165ae4434cb17.webp)

访问 `/test/*` 302 临时重定向到 `https://test.test/test/*`

![](../img/8a0292e6a816726917684eb18f08265c.webp)

已经非常强大了。而且不占用重定向规则配额也不耗费Worker请求数！

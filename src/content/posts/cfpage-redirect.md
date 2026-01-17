---
title: 利用Cloudflare Page提供的重定向功能实现无损耗、不限数量的静态重定向！
published: 2025-07-13
description: 'Cloudflare的重定向规则非常强大，但是如果直接使用重定向规则创建批量重定向会消耗很多的配额'
image: https://i0.hdslb.com/bfs/openplatform/a26749a6aa2387c311efb5ee6f245e4389ca58a5.webp
tags: [Cloudflare]
category: '教程'
draft: false 
lang: ''
---

# 快速上手！

直接 Fork我的 [仓库](https://github.com/afoim/Redirect_Group) 。

接着将该仓库连接到Cloudflare部署Worker或Page，然后绑定你的域名

![](https://i0.hdslb.com/bfs/openplatform/40ee5305dc487afce9ff2328023ec3a17f185962.webp)

接着更改 `_redirects` 内的文件

![](https://i0.hdslb.com/bfs/openplatform/c4709578c8e95220280cd6e5c93bccc7835fba6e.webp)

例如： 

```bash
/ https://www.afo.im/ 301
/test/* https://test.test/test/:splat 302
```

则意味着

访问 `/` 301 永久重定向到 `https://www.afo.im/` 

![](https://i0.hdslb.com/bfs/openplatform/42a066d6563ac5ebc7e4b3ea0ba78c9d9b6ca593.webp)

访问 `/test/*` 302 临时重定向到 `https://test.test/test/*`

![](https://i0.hdslb.com/bfs/openplatform/cc0d11d309b22a31cace280d13d12369135264a3.webp)

已经非常强大了。而且不占用重定向规则配额也不耗费Worker请求数！

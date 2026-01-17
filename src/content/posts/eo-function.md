---
title: 对标CF Worker？拿EdgeOne边缘函数做一个随机图API！
published: 2025-08-01
description: '很早就知道EdgeOne边缘函数，一直都没来得及体验，今天上手后发现它真的很强大'
image: 'https://i0.hdslb.com/bfs/openplatform/5fcf2c9958493de12dd70c7406bcb02f17c7ec42.webp'
tags: [EdgeOne]
category: '教程'
draft: false 
lang: ''
---

# 正式开始

前往 [afoim/EdgeOne_Function_PicAPI: 适用于EdgeOne边缘函数的随机图API](https://github.com/afoim/EdgeOne_Function_PicAPI)

复制 `worker.js` 代码

部署到EdgeOne边缘函数

![](https://i0.hdslb.com/bfs/openplatform/442a8b3ff7dc5bae6d00362bc7ba25b3c4b63a24.webp)

将代码开头的 `R2_CONFIG` 设为你自己的

```js
var R2_CONFIG = {
  region: 'auto',
  service: 's3',
  accountId: '',
  accessKeyId: '',
  secretAccessKey: '',
  bucketName: ''
};
```

配置你的R2，将横屏随机图放到 `ri/h` 和 `ri/v` 。保证跟代码中的路径一样

```js
    // 根据路径确定前缀
    var prefix = '';
    if (pathname === '/h') {
      prefix = 'ri/h/';
    } else if (pathname === '/v') {
      prefix = 'ri/v/';
    } else if (pathname === '/') {
```

访问 `/h` 则展示一张横屏随机图，访问 `/v` 则展示一张竖屏随机图

![](https://i0.hdslb.com/bfs/openplatform/84d035d1eee221df6b837f1c80f91e31e623efd1.webp)

如果需要绑定域名请设置触发规则

![](https://i0.hdslb.com/bfs/openplatform/c4db317e470ffb1e2017deda40c3bdc58a83beca.webp)

# 注意

边缘函数每月有300万次的请求数限制，暂不知道超出是否扣费

---
title: 手把手教你用上微信企业（域名）邮箱（免费！）
published: 2025-05-02
description: '非常简单，只需要改几个MX记录就行~'
image: https://i0.hdslb.com/bfs/openplatform/fb5d21bfe0a119a20e5a1f342538183e554eeab8.png
tags: [域名邮箱, 微信企业邮]
category: '教程'
draft: false 
lang: ''
---

# 前情提要

之前我写过一篇[网易企业邮](/posts/163-free-domain-email/)的文章，但真的投入使用后发现各种毛病是层出不穷。比如SMTP/IMAP/POP3默认是关的，你想打开就弹出一个 `管理员未开启当前登录权限` ...

我TM是不是管理员啊，你倒是TM告诉我TMD这个在哪开啊！

![2025-05-02-20-54-05-image.png](https://i0.hdslb.com/bfs/openplatform/dbe2d3d6719d4101f75e2a9e4809985c008b61cb.png)

![2025-05-02-20-54-18-image.png](https://i0.hdslb.com/bfs/openplatform/c6e57e3cde66aae413d2e7b6cadbded8a80b524d.png)

而微信企业邮完美解决了这些问题，开启SMTP/IMAP/POP3服务非常简单，而且也没有网易那么草台

# 正式开始

首先进入 [腾讯企业邮箱](https://work.weixin.qq.com/mail/) 创建一个企业，会让你绑定企业微信，按照步骤弄好就行

接下来绑定域名，添加几条MX记录即可

最后是重头戏，开启SMTP/IMAP/POP3

我们需要前往 [腾讯企业邮箱-登录入口](https://exmail.qq.com/login)

注意，这里点击 `其他方式登录`

![2025-05-02-20-57-24-image.png](https://i0.hdslb.com/bfs/openplatform/a82b991b212b079b4bd90c6b3e98e76ef4489f34.png)

然后选择账号密码登录

![2025-05-02-20-57-44-image.png](https://i0.hdslb.com/bfs/openplatform/6ef0cba361b427bba5d0dc2ee8b6bbf72757b962.png)

接着选择成员登录（如果直接进去了就跳过这一步）

![2025-05-02-20-59-22-image.png](https://i0.hdslb.com/bfs/openplatform/bfea3e7d130d032d045e88405581fb97a1ab72eb.png)

接下来左上角点击设置

![2025-05-02-21-00-08-image.png](https://i0.hdslb.com/bfs/openplatform/84f6effbab16488522e6c994254cd48f052170ce.png)

收发信设置

![2025-05-02-21-00-31-image.png](https://i0.hdslb.com/bfs/openplatform/666d4fc4ec59c6a19b860f4fcdfb06cccf48ff57.png)

这里就能查看到SMTP和IMAP的地址和端口（实测TLS也是支持的，只是它没写）

![2025-05-02-21-01-07-image.png](https://i0.hdslb.com/bfs/openplatform/46ad0a9b4f7fd298c66359f2603e830fc1349616.png)

接下来前往邮箱绑定

![2025-05-02-21-01-36-image.png](https://i0.hdslb.com/bfs/openplatform/bdc4eb56ec6de4721a8a653a49f8c03921e169b4.png)

生成新密码

![2025-05-02-21-01-57-image.png](https://i0.hdslb.com/bfs/openplatform/b6e504cab7e246032d42808781d24ab82039f481.png)

接着随便找一个邮箱客户端去测试即可

![2025-05-02-21-03-17-Screenshot_2025-05-02-21-02-29-86.jpg](https://eo-r2.2x.nz/myblog/img/2025-05-02-21-03-17-Screenshot_2025-05-02-21-02-29-86.png)

![2025-05-02-21-03-45-Screenshot_2025-05-02-21-03-32-54_6cf654f91021b6b.jpg](https://eo-r2.2x.nz/myblog/img/2025-05-02-21-03-45-Screenshot_2025-05-02-21-03-32-54_6cf654f91021b6b.png)

接着你就可以拿这个邮箱给你的博客论坛用啦
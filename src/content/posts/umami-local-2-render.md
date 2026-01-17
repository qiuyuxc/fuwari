---
title: 记录迁移Umami，从本地到云
published: 2025-08-28T09:57:16
description: '之前的站点统计部署在家里云NAS，通过IPv6回源，而现在我将他迁移到了Render+Supabase'
image: 'https://i0.hdslb.com/bfs/openplatform/24d557c097a66fdcbd14b848ed0844a666de3c70.png'
tags: [Umami]
category: '记录'
draft: false 
lang: ''
---

> 回滚了

# 备份本地数据库

在任何一台机子上安装 **pgAdmin4** 

连接到本地的PostgreSQL实例

![](https://i0.hdslb.com/bfs/openplatform/76abd3322e6e1cd57de3363ae8fc93f94e02ad9f.png)

右键需要备份的数据库，点击 **备份**

![](https://i0.hdslb.com/bfs/openplatform/e50e0768af0683907cd0c77d36be985a72655c24.png)

填写 **文件名** 创建备份。备份的文件将会保留在 **pgAdmin4** 上

![](https://i0.hdslb.com/bfs/openplatform/06d8b8768c93c64293df5f10664fe79bdc386674.png)

# 还原备份到云端数据库

> 免费计划有 500MB 免费的数据库空间，完全够用了
> 
> ![](https://i0.hdslb.com/bfs/openplatform/17c3111d4c28c7f5676100a77fa187f48c0934c8.png)

进入 https://supabase.com/

创建一个新项目

找到连接参数（左上角Connect）

![](https://i0.hdslb.com/bfs/openplatform/68944c7b4ec91c58e4516196c3c96ee618c19a7c.png)

在 **pgAdmin4** 中，连接到Supabase数据库

![](https://i0.hdslb.com/bfs/openplatform/ad1ec64c7991380c038c7ed13d7d2459ef580bcb.png)

> 值得注意的是，本地的PostgreSQL我们可以创建多个子数据库。而在Supabase中，每一个项目对应一个专属的 **postgres** 数据库。当然，你完全可以使用 **pgAdmin4** 来创建新的子数据库，但是Supabase仪表盘上将不可见。所以，我建议在Supabase项目中，一个项目对应一个数据库，不使用子数据库

右键，进行还原

![](https://i0.hdslb.com/bfs/openplatform/43fafd743f64e69acbe5fdb68a011904654cd899.png)

选择刚才备份的数据库文件

![](https://i0.hdslb.com/bfs/openplatform/d1ced4f3670107913209b00172a8abc057eb7651.png)

进行还原，必会 **失败**，但是不用管

*这些报错大概就是，找不到之前数据库的用户之类的，实际上表结构已经被还原了*

![](https://i0.hdslb.com/bfs/openplatform/ed8203f1b3d4258925f5904860403ab3fab6c674.png)

# 在Render上部署Umami

打开 https://dashboard.render.com/

创建项目，选择 **Web Services**

**Source Code** 选择 **Exist Image** ，并输入 `ghcr.io/umami-software/umami:postgresql-v2.19.0` *最好选最新版，也就是 `vx.xx.x` 这个字段*

配置必须的环境变量

| Key           | Value         |
|:-------------:|:-------------:|
| APP_SECRET    | 在之前的环境变量中     |
| DATABASE_TYPE | postgresql    |
| DATABASE_URL  | 在Supabase仪表板中 |

你可以在曾经的Umami实例中看到 **APP_SECRET** 的值

![](https://i0.hdslb.com/bfs/openplatform/3e62eed10d9f75e9bf981dcb7606fa9507d4dd2b.png)

而 **DATABASE_URL** 可以在 Supabase 中看到

![](https://i0.hdslb.com/bfs/openplatform/cb0f3fe468fe18ae1b7b31c7026503f48948fb14.png)

其中的 `[YOUR-PASSWORD]` 可以在 Supabase 的数据库设置中进行重置

*注意，Supabase仅支持重置数据库密码，一旦设置后将无法再次查看，请妥善保管您的数据库密码*

配置完毕之后，部署它，Render将会为你分配一个Web地址

![](https://i0.hdslb.com/bfs/openplatform/60d8a5fdaea4fff4bb36551c1e9fc93963c48490.png)

尝试访问，应该已经迁移成功

![](https://i0.hdslb.com/bfs/openplatform/6504e70953de7033eaff5435bd199e911e61deda.png)

# 配置EdgeOne CDN变相支持CORS配置

> 由于 Umami 没有独立的CORS设置，如果不设置CORS则他人将可以随便刷你的Umami，这会导致统计不准确，详见 [这篇文章](/posts/you-is-me-huh/) 。我们可以接入EdgeOne CDN来变相支持CORS

使用 **源站域名** 作为 **回源 HOST 头** 即可

![](https://i0.hdslb.com/bfs/openplatform/276e6ab5b9bbd464cb9d7346b8c88a21646ffc67.png)

CORS配置详情

![](https://i0.hdslb.com/bfs/openplatform/32feb4cfde88dc6755d18c2fb2d2da5eb440d80c.png)

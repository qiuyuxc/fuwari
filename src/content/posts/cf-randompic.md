---
category: 教程
description: 使用R2存储图片，通过Workers连接，最后使用a标签或img标签在网页中嵌入展示，全链路上云
draft: false
image: https://i0.hdslb.com/bfs/openplatform/07f8507f0ded8a2640f89c7cf7b80f71376c2ed1.webp
lang: ''
published: 2025-03-05
tags:
- Cloudflare R2
- Cloudflare Workers
title: Cloudflare R2+Workers！马上搭建自己的云上图床！
---
### **结果图**

![QmVgqgoC7G8NLS21WvR8j9gf5amu33XvuV68ZrgM5B9iFf.webp](https://i0.hdslb.com/bfs/openplatform/58e4581637a89137ae2bee75585f398808565949.webp)

### **原理**

图源由 Cloudflare R2 托管，通过两个 Workers 连接 R2 以展示随机横屏/竖屏图片，静态页面引用 Workers 的 URL 以实现以上界面

### **创建 Cloudflare R2 存储桶**

R2 实际上是一个对象存储。Cloudflare 提供 10G 的免费存储和每月 1000 万次的免费访问

1. 进入[Cloudflare 仪表盘](https://dash.cloudflare.com/)，进入 R2 页面，如图
   
   ![QmU7u2JHUcevyHnwsCdAZfs7X7Fcdh3KJhn6eoy24Q5dGC.webp](https://i0.hdslb.com/bfs/openplatform/942efb6175dfdd5e8af9f22f12d3c8ded96088c0.webp)

2. 选择创建存储桶![QmX3eCaCVEgE8AN29D9t2VpQ5t5SrZGKb8EcZv9oKpCqf2.webp](https://i0.hdslb.com/bfs/openplatform/60c7f991e40d6a345eb767176ea66f687ec081c0.webp)

3. 为你的存储桶起一个名字，然后单击创建![QmVad5eoJCLpSNZ4HCvTPJfD8rpg4aePMzZ7j2DZATn1XD.webp](https://i0.hdslb.com/bfs/openplatform/7e06cad5ba21a4d0a7a892f01e178c31755ecfcf.webp)

4. 进入如下页面就已经创建完毕了![QmSdzwBJpw2L4a8LJ3eM3VMJs3d5oV5iFCxCMtv69VZmYH.webp](https://i0.hdslb.com/bfs/openplatform/0b3116df83aeee46821ac65992c63e5fb3ead09a.webp)

5. 返回 R2 首页。因为在下文我们需要使用 API 来进行文件传输，所以需要创建你的 R2 API 令牌，单击管理 R2 API 令牌![QmbS8zjJTESwsmycKBSC9kmabAA9dtSCUX8nbUDWg4BWRX.webp](https://i0.hdslb.com/bfs/openplatform/c1d39c9dcb6581ebe4db292fea97e363815b68b1.webp)

6. 单击创建 API 令牌，如图![QmPzJEHVAm4z3S1SHY4k99TugrPyTB9DXpyRR8Loj22bz3.webp](https://i0.hdslb.com/bfs/openplatform/e133a7e43ba41f7a17f65ad9d661b21d0ec0a403.webp)

7. 因为我们需要该 API 来管理单个 R2 存储桶，所以选择**对象读和写**，详细配置如图![QmNY9p8hksi18B9R8TVfdGgu336oQ3cPmghyfYXE9CDGD4.webp](https://i0.hdslb.com/bfs/openplatform/67e9e11fe261edfc289e193d31f5c887717df8ab.webp)

8. 创建 API 令牌后，新页面会展示令牌的详细信息，**仅会展示一次！！！** 保持这个页面，直到你将该页面的所有信息都已经妥善保存，不要关闭界面，否则，你需要轮转 API 令牌以禁用之前的旧密钥，如图![QmZTUwbycqbJhVP6PatD3psYy7ej9PDDoiXbmDWoakPhwx.webp](https://i0.hdslb.com/bfs/openplatform/87a8d230a5c589db34fe480a30cec76908c68b27.webp)

9. 确保你已经妥善保存你的 R2 API 令牌，然后进行下一步

### **为你的存储桶添加文件**

因为 Web 界面传输文件较慢且不支持传输大于 300MB 的文件。这里使用本地部署 AList 然后连接你的 R2 存储桶实现高速上传

1. 笔者使用 Windows。前往[AList - Github Release](https://github.com/alist-org/alist/releases)下载适用于 Windows 的最新可执行文件，如图![QmPDRDJGeGStreyZMXVYofbE9FCs1T1MyDek3KUbB3Kk5b.webp](https://i0.hdslb.com/bfs/openplatform/eefc502ec9ce055bddf9f8500023e83866dfb3f5.webp)

2. 将下载的压缩包解压，并将其中的`alist.exe`放入一个空文件夹

3. 单击搜索框，输入 cmd 并回车，如图

4. ![QmSt8aFtaeEprJHASEiNPB67UHcHoSxsbhhHUPxW6QkWSo.webp](https://i0.hdslb.com/bfs/openplatform/05ce8d9c34090b6245324bb1bf9e83a1c9a722c1.webp)
   
   ![QmNkMhDhpPLkYCpVhE1ov7Q6A34uWDvraCqNvuTqaCkujT.webp](https://i0.hdslb.com/bfs/openplatform/f94ab0d0763ab4eb177b5d6c3d819cc46d6098a8.webp)
   
   在 cmd 中输入`alist.exe server`并且不要关闭窗口，运行成功后如图![QmdzyY8xbic8jdnZEXegefoZPeizqHa4ZkdMnRKoguBMkf.webp](https://i0.hdslb.com/bfs/openplatform/3f142ef3eb35c6b24dc730357984ca6e772570d9.webp)

5. 打开浏览器，输入`localhost:5244`即可进入 AList 控制台，如图![QmUBFKu7mCiRneCrsTNPxTH6S4gxwtXf9cwLzf4dKW9LLR.webp](https://i0.hdslb.com/bfs/openplatform/bccef1b475648a09df0353ec35cda617de87ed95.webp)

6. 用户名：`admin`密码：`在cmd窗口中，如图`。你可以使用鼠标左键在终端中框选内容然后单击鼠标右键进行复制操作![QmVH3qZYo3QE6anNHymwkikq5MSeJphrZNR7RCH5jpP3wn.webp](https://i0.hdslb.com/bfs/openplatform/fb9fa599279a205dc69c80bc473cb4d6a741091e.webp)

7. 注意，在 cmd 中，鼠标左键点击或拖动 cmd 的终端界面会导致进入选择状态，程序将会被系统阻塞，**需要在终端界面点按鼠标右键解除**。若进程被阻塞，cmd 的进程名会多一个**选择**，请注意。如图是程序被阻塞的例子，**在终端界面点按鼠标右键即可解除**
   ![QmapESiqSEvbYq3AJs15yYvhemRxSHrJaccjTFr99muX6Z.webp](https://i0.hdslb.com/bfs/openplatform/1fb72b540828dffc7e1e492c5b1bfefc4ce6e405.webp)

8. 现在，你已经成功以管理员身份登入了 AList单击最下面的**管理**![QmfNE53GThdjVrh4q64MJcZqwcGPD7UtcYTNw9bVBaSEaF.webp](https://i0.hdslb.com/bfs/openplatform/175ba7639aba993d44e96b9eeab2f63ed9ba7184.webp)

9. 你会进入到如图界面。尽管 AList 运行在本地，也建议更改你的用户名和密码![QmNdD8UU8fkVDBz5dXdJhCF2fZg8P1FwrcMaaTsG6a7ENy.webp](https://i0.hdslb.com/bfs/openplatform/b6cc15791b2792abe6c367e77015b0c4de8104f0.webp)

10. 更改账密，重新以新账密登录![Qmas7pMiPR2FNTXheBT1xGNUpzDiSzv7J7yd6oCuT17yad.webp](https://i0.hdslb.com/bfs/openplatform/4acf5db6cbe840d2be97e6d462cd3c3811582171.webp)

11. 进入控制台，然后单击存储，如图![QmS4gGyCM1j3RXgHEPuZ1zTbLAvGtVBEiPXJe9QMF3dD2D.webp](https://i0.hdslb.com/bfs/openplatform/45fb3c28b91d7a3f0ea559c73c218babdf01b35e.webp)

12. 选择添加，如图![QmRDVxt8WbrVkHavgFNXj3qC86ysw6sSZhPy3Uf2ixKp2E.webp](https://i0.hdslb.com/bfs/openplatform/147256a881defc0dd0283ecdd29f0167891abcc2.webp)

13. 详细配置如图。挂载路径即 AList 展示路径，推荐使用`/R2/你的存储桶名字`，地区为`auto`![](https://i0.hdslb.com/bfs/openplatform/c9a68db73cc4cbb3c32d4518a78c01dbbfeef9b8.webp)回到主页，如图![QmSnR9Ptrssx4nqk9qCvhFUNKQyQqJiN7GRscwoj4Dczgj.webp](https://i0.hdslb.com/bfs/openplatform/28cfe19dfb9cf7cf0b20a4ea2c75f43caa70b1d9.webp)

14. 尝试上传文件，如图![QmPqFsmZNNnh4jNyLS7X3h8Zr6ZCVqTqGVwTxmPDdbmrGW.webp](https://i0.hdslb.com/bfs/openplatform/f422d8acd15c9757ff5058aac36eb128fde74d07.webp)

15. 可以看到，速度非常快![QmXfGK6aZjz741GrY8RfFfKMkUzDMB3xhx93PGZ9S1QycT.webp](https://i0.hdslb.com/bfs/openplatform/9fc0c1b1914baee6e79251a6a5d69745f66d75ed.webp)

16. 为你的图床创建目录以分类横屏和竖屏图等，以便下文使用 Workers 连接 R2 来调用。后文我将使用R2的`/ri/h` 路径作为横屏随机图目录、`/ri/v` 路径作为竖屏随机图目录

![QmNdD8UU8fkVDBz5dXdJhCF2fZg8P1FwrcMaaTsG6a7ENy.webp](https://i0.hdslb.com/bfs/openplatform/b6cc15791b2792abe6c367e77015b0c4de8104f0.webp)

### **创建 Workers，连接 R2**

1. 进入[Cloudflare 仪表盘](https://dash.cloudflare.com/)，进入 Workers 和 Pages 页面，如图![QmW5UaUap8T2R37u5dzmKGLmUgk4qKnSMFwHBVHqvVbkVA.webp](https://i0.hdslb.com/bfs/openplatform/40f1ebc4c0d76a2a6ceb20f99d2ef579f4a97a55.webp)

2. 单击创建，选择创建 Workers，名称自取，单击部署![QmVvLv5n41QQfDfYiVWYRpsfw7TVNGy1BYuv5e8vBRhKLA.webp](https://i0.hdslb.com/bfs/openplatform/87e5a0a8ea2823dcbb9eb56204fd74d0b049e6cb.webp)

3. 选择编辑代码![QmTbRifzXQ593DGyjFQMbA9exyNp2iAeAg4zbVrfFimQc4.webp](https://i0.hdslb.com/bfs/openplatform/cee695bbba2599c816309225b5718f8c1b11317c.webp)

4. 粘贴代码（创建随机横屏图）：

新代码：

```
export default {
  async fetch(request, env, ctx) {
    const bucket = env.MY_BUCKET;
    const url = new URL(request.url);
    const hostname = url.hostname;

    // 初始化prefix
    let prefix = '';
    
    // 根据域名判断prefix
    if (hostname === 'hpic.072103.xyz' || hostname === 'api-hpic.072103.xyz') {
      prefix = 'ri/h/';
    } else if (hostname === 'vpic.072103.xyz' || hostname === 'api-vpic.072103.xyz') {
      prefix = 'ri/v/';
    } else {
      return new Response('Invalid domain', { status: 400 });
    }

    try {
      // 如果是API域名，只返回数量
      if (hostname.startsWith('api-')) {
        const objects = await bucket.list({ prefix: prefix });
        const count = objects.objects.length;
        const headers = new Headers({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain'
        });
        return new Response(count.toString(), { headers });
      }

      // 原有的随机图片逻辑
      const objects = await bucket.list({ prefix: prefix });
      const items = objects.objects;
      
      if (items.length === 0) {
        return new Response('No images found', { status: 404 });
      }
      
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const object = await bucket.get(randomItem.key);

      if (!object) {
        return new Response('Image not found', { status: 404 });
      }

      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata.contentType || 'image/jpeg');

      return new Response(object.body, { headers });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
```

旧代码：

```
export default {
  async fetch(request, env, ctx) {
    // R2 bucket 配置
    const bucket = env.MY_BUCKET;

    try {
      // 列出 /ri/h 目录下的所有对象
      const objects = await bucket.list({ prefix: 'ri/h/' });

      // 从列表中随机选择一个对象
      const items = objects.objects;
      if (items.length === 0) {
        return new Response('No images found', { status: 404 });
      }
      const randomItem = items[Math.floor(Math.random() * items.length)];

      // 获取选中对象
      const object = await bucket.get(randomItem.key);

      if (!object) {
        return new Response('Image not found', { status: 404 });
      }

      // 设置适当的 Content-Type
      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata.contentType || 'image/jpeg');

      // 返回图片内容
      return new Response(object.body, { headers });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
```

5. 点击左侧的文件图标![QmQGQTiTXSESU2TSJ6tc3KrzWU4KABKqn6QZ1GdWqKnWmc.webp](https://i0.hdslb.com/bfs/openplatform/4dc78eb725afd7ceb82b418c2aa9a0d78a2ee6a5.webp)

6. 在`wrangler.toml`中填入：

```
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "114514"
```

7. 保存修改，点击右上角的部署![QmP7hXdtenrJrzJRRePHQATGtyAsZEr5MkMsboXvmNUxTx.webp](https://i0.hdslb.com/bfs/openplatform/2d7a0795df91f368402864a533f2e6d61b073e46.webp)

8. 在设置 - 变量找到 R2 存储桶绑定，添加你的存储桶，变量名即上文的`MY_BUCKET`![QmStitSyATnA8sY9tTgZaXXqmqkGPUtZmMxn9KjbFQzgTc.webp](https://i0.hdslb.com/bfs/openplatform/9f9610b421ee7ddf6d60a31d1b43b1f883e6ec67.webp)

9. 在设置 - 触发器添加你的自定义域名以便访问![QmUMxtkCiKsgFw8afRUGREFztXE9D5W6FmCbAUB7DaVH5o.webp](https://i0.hdslb.com/bfs/openplatform/6bb9a0d7676b6d33b79036e435bc2ab8ac61d26c.webp)
   
   ![QmPF9iCoq6n8Jj2Z6kPkdJSCm45VJystZoYcir55yceCQo.webp](https://i0.hdslb.com/bfs/openplatform/e39a4aa28e3131c790bb30f5be377d381d5f8e60.webp)

10. 访问效果，每次刷新都不一样![QmQgEdjXxF9oph2jYKzFMJToX9WfG11jUmPiNJnjhYVN4N.webp](https://i0.hdslb.com/bfs/openplatform/d2720ade6ef3f21b922c5c03c09847950d4a7a1b.webp)

### **通过使用 HTML 的 `<img>` 标签引用即可达到开头的效果**

如：`<img src="你的域名" alt="">`
<img title="" src="https://hpic.072103.xyz" alt="loading-ag-4760">

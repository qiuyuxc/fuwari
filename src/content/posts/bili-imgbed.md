---
title: 神秘API！B站也能当图床使！
published: 2026-01-18T21:34:18
description: 今天我发现我的一位粉丝的博客图片是 i0.hdslb.com... ，然后深度钻研了一下，然后发现竟然是B站的图床，并且这个“洞”已经有将近10年之久了...
image: https://i0.hdslb.com/bfs/live/164c93801f5c484808979778add7cf64c2eaae3e.png
draft: false
lang: ""
---
> [!CAUTION]
> 该API非官方开放平台API，我也不知道源头是哪来的，时效性未知。但是该API托管的最早的图片为2019年。总之慎用

![](https://i0.hdslb.com/bfs/live/b6e746c2f30e2f21d9559bffbb910d1c7316a7e3.png)
# API
```sql
curl -X POST "https://api.bilibili.com/x/upload/web/image" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  -b "SESSDATA=你的SESSDATA;bili_jct=你的BILI_JCT" \
  -F "bucket=live" \
  -F "csrf=你的BILI_JCT" \
  -F "file=@image.png;filename=image.png"
```

# 请求负载
`file` 是一个二进制，为你要上传的图片（支持WEBP，PNG，JPG，JPEG）。最大15MB

`SESSDATA` 和 `BILI_JCT` 都是通过登录网页端B站，查看Cookie获得

`csrf` 就是 `BILI_JCT` 

`bucket` 为图片要扔到的存储桶名称，目前共探测到如下桶。各个桶貌似并无区别，仅仅会改变上传后的URL
```sql
openplatform, static, live, seed, banner, mall, album, vip, face, svg-next, archive, garb, polaris_web_conf
```

# 响应体
```json
{
    "code": 0,
    "message": "0",
    "ttl": 1,
    "data": {
        "location": "http://i0.hdslb.com/bfs/live/246dcaf9a031ac1c971f67a789183aecec9ddd20.jpg",
        "etag": "246dcaf9a031ac1c971f67a789183aecec9ddd20",
        "object_metas": {}
    }
}
```

`data.location` 即为上传后的图片URL
# 绕过防盗链
该API十分神奇，得到的URL是检测 `Referer` 的，但是如果不带就默认放行（？），所以你可以在要用的网页的HTML 头注入这一行meta，**注入后整个网页的外部资源请求将都不带Referer**

```html
<meta name="referrer" content="no-referrer">
```

# 小插件

::github{repo="afoim/bilibili-img-uploader"}

重命名 `config_example.json` 为 `config.json` 并且填写相应配置

### 从任何地方迁移
将你要转为B站图床的本地图片通过该方式上传
```sql
python bili_img_uploader {本地图片完整路径}
```

插件会返回一条单独的图片外链
![](https://i0.hdslb.com/bfs/live/22815a3c2a64d5cc5c514c2a26c439cda6cc4fb1.png)

### 写作模式
当你想撰写新文章（MarkDown）形式时，可以使用参数 `-copy` 来开启写作模式

该模式会监听剪贴板，一旦识别到图片（MIME/文件形式都行），就会自动上传，并且随着“叮”一声，告诉你图片已经上传完毕，并且会自动将 `![]({外链图片URL})` 写入你的剪贴板，你只需要在编辑器内粘贴即可

![](https://i0.hdslb.com/bfs/live/f1300906ab061da67e56ea3623a5e6b809d02bf5.png)

![](https://i0.hdslb.com/bfs/live/f348da95d8587740bbba2b36e3ec2345f8792d8a.png)
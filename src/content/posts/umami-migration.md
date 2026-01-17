---
title: Umami Cloud迁移到本地踩坑记录
published: 2025-12-05T10:13:34
description: 早期的我很有先见之明，在使用Umami的时候是自建的，但是不久后因为想要全上云，又用回了Umami Cloud，但是现在访问记录激增，我又不得不迁移到本地...
image: https://i0.hdslb.com/bfs/openplatform/60817805c17679a56b793f2f6e8710c999fd4b10.png
tags:
  - Umami
  - PostgreSQL
draft: false
lang: ""
---
# 正式开始
首先，我们想要迁移，首先肯定是要拿到原来的Umami Cloud存放的数据

在 [Umami Cloud Data | Settings](https://cloud.umami.is/settings/data) 中，我们可以选择，导出数据（Export）
![](https://i0.hdslb.com/bfs/openplatform/537e51f14585ac7b9586796fec9ebec196c0bb06.png)

当数据准备好后（几分钟左右），你的邮箱会收到一封Umami Cloud发来的邮件
![](https://i0.hdslb.com/bfs/openplatform/f350ff78a91d185ba0c16d75758443c303378450.png)

下载下来的文件是一个以UUID命名的ZIP压缩包，将其解压可以得到3个CSV文件
![](https://i0.hdslb.com/bfs/openplatform/64f9814c95a7f34a15ae6559330511b162a74405.png)

其中，只有 `website_event.csv` 有用，其他两个文件仅有表头，无数据

这样，我们就成功拿到了旧Umami数据

接下来，我们需要在本地部署Umami PostgreSQL版本的 **最新版** （目前版本为 3.x）（部署教程略）

然后我们还需要安装一个CSV编辑软件： [SmoothCSV - The ultimate CSV editor for macOS & Windows](https://smoothcsv.com/)

在本地Umami中新建一个网站，Umami会随机为你生成一个UUID

接下来我们需要在你的终端安装一个图形化管理PostgreSQL的软件： [pgAdmin - PostgreSQL Tools](https://www.pgadmin.org/)

然后连上数据库，你将可以看到这些表
![](https://i0.hdslb.com/bfs/openplatform/daaa08d766246861e896c365472dde9167b1b84f.png)

接下来我们查看 `website` 这张表，将 `website_event.csv` 打开，查看旧的 `website_id` 将新的ID改为旧的，这样才能数据匹配
![](https://i0.hdslb.com/bfs/openplatform/a12e4cb8c199ded6ba2c81786b2971e4506b17a0.png)
![](https://i0.hdslb.com/bfs/openplatform/bf0acc9c190f386e88f4d81f764f22269b470878.png)

接下来，我们正式开始数据导入，由于导入后的数据有两个 `session_id` 字段，而在Umami自我管理的过程中这个 `session_id` 字段是 **唯一约束的** ，我们需要先解除这个限制，在正式上线前还要再加回这个限制（后面会说）

让我们删除主键约束和索引

```sql
ALTER TABLE session DROP CONSTRAINT session_pkey;
DROP INDEX session_session_id_key;
```

接下来，我们需要将数据配对，我们先查看 `website_event.csv` 这张表。这里应该只有表头，没有数据（我有是因为我已经导入完成了，教程是后写的）

**注意顺序** 如： `event_id` `website_id` `session_id` ...

![](https://i0.hdslb.com/bfs/openplatform/76fc4824c1b25f1b4c5eff31bf2da5db8ac02fec.png)

编辑CSV文件，你需要将顺序配对，并且删除表中没有的列，如： `browser` `os` ...
![](https://i0.hdslb.com/bfs/openplatform/e443b7aafb62eef74029e801e0654e7ac2e4e812.png)

确保数据库中的表头顺序和CSV文件中的表头顺序一一对应，顺序一致，不多不少后，**Ctrl + S 保存** CSV文件，我们开始导入并在选项中勾选 **标题**

![](https://i0.hdslb.com/bfs/openplatform/89f55b4e3f64f2e257345ac4687b5d2b9e1c23fc.png)
![](https://i0.hdslb.com/bfs/openplatform/a38529f9ef33c1947ecb956685c03399a856685a.png)
![](https://i0.hdslb.com/bfs/openplatform/c96f1a6c8b74e90dcb95dbcf8166c14a7984ffdf.png)
导入成功后如图
![](https://i0.hdslb.com/bfs/openplatform/10f1b3536b59e1724ab630366c4fb7d6fda91d9e.png)
![](https://i0.hdslb.com/bfs/openplatform/a27e20106c6b176483e1165700857d3048ae55e8.png)

再编辑 `session` 这张表，手法同上，导入成功后如图
![](https://i0.hdslb.com/bfs/openplatform/760c3b8664e4bdf592dc8a7825794f30bfafec25.png)

接下来打开本地Umami的WebUI，查看数据是否有异常
![](https://i0.hdslb.com/bfs/openplatform/0158470798594f5da99f85384b679d459484e923.png)

确保导入后数据无异常后，我们开始删除另一条 `session_id` 记录并回锁主键。否则上线后Umami将无法再向表中插入数据
```sql
SELECT session_id, COUNT(*) 
FROM public.session
GROUP BY session_id
HAVING COUNT(*) > 1;

-- 保留最早的 created_at
DELETE FROM public.session
WHERE ctid NOT IN (
    SELECT MIN(ctid)
    FROM public.session
    GROUP BY session_id
);

ALTER TABLE public.session
ADD CONSTRAINT session_id_unique UNIQUE (session_id);
```

至此，迁移工作结束
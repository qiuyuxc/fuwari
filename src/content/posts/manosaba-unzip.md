---
title: 魔法少女的魔女审判解包（Unity通用解包方案）
published: 2025-10-05T16:09:36
description: 魔判这部作品真的很不错，大家可以去Steam搜索魔法少女的魔女审判下载下来玩玩
image: https://i0.hdslb.com/bfs/openplatform/1dabcbbd8c0ce569241a3b32756e9b91d4edc405.png
tags:
  - 解包
  - 魔法少女的魔女审判
draft: false
lang: ""
---
# 正式开始
前往 https://github.com/AssetRipper/ ，下载 **AssetRipper** 并打开

这会自动调用浏览器并导向 `http://127.0.0.1:64203` 暂时放一边

接下来在Steam页面对游戏右键并选择 `管理 - 浏览本地文件`
![](https://i0.hdslb.com/bfs/openplatform/ec77d6e13240d2bce0699ac321253e61b7cbad35.png)
会打开你的文件资源管理器并导向该游戏位于系统中的实际路径 ![](https://i0.hdslb.com/bfs/openplatform/00fd0649989b5a39ea393287b34cf3695cd53322.png)
点击 `地址栏` 然后复制
![](https://i0.hdslb.com/bfs/openplatform/5b26f85b0bf1c9b30855613d0c1d83a0f68eccce.png)
此时在 **AssetRipper** 中我们选择 `文件 - 打开文件夹` 并粘贴路径，并进入 `*_Data` 文件夹，这里为 **manosaba_Data** 
![](https://i0.hdslb.com/bfs/openplatform/17766e8d5dba7fc158274932bf453946af276a10.png)
![](https://i0.hdslb.com/bfs/openplatform/66a48537089251a0bfaf266de88efc49296b8bbe.png)
接下来会进入漫长的等待时间。网页会卡在加载，我们可以查看一并打开的命令窗口确认资源载入进度
当你发现 **查看已导入文件** 可被点击后，方可继续
![](https://i0.hdslb.com/bfs/openplatform/9e3fc5c9b7c8261bd1a18a898c70a9540172814d.png)
选择右上角的 `导出 - 导出所有文件`
![](https://i0.hdslb.com/bfs/openplatform/1ca516a000d6ea86f2a611e55df525a4421ed966.png)
点击选择文件夹，随便选个位置放解包后的文件
![](https://i0.hdslb.com/bfs/openplatform/e7bef5d384008ee21457e8c9341c3e2d73e41be3.png)
然后点击 **导出主要内容**
![](https://i0.hdslb.com/bfs/openplatform/006836511fc8f767476e4372894fc796aba9c8d0.png)
最终，寻找类似 `Assets` 文件夹，就有所有的资源文件了（如CG图，MV，角色语音等）
![](https://i0.hdslb.com/bfs/openplatform/691a8b6f1a88942ab22de049110f51375b11dacf.png)

注：某些资源为骨骼/模型和动作文件，游戏进行中显现的2D图并非直接由静态文件提供，而是骨骼/模型和动作文件协作而成，对于这些内容，你需要自己拼出完整的资源画面，在此不做讨论
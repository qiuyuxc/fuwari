---
title: AI绘图发展了这么多年，你还不会画你推的同人图？
published: 2025-05-13
description: '从零教你用上最新的NoobAI-V预测模型！2025年最值得上手最简单好用的模型！'
image: https://i0.hdslb.com/bfs/openplatform/cea07fe558249e6d265dfeb23e5615ddd2657757.png
tags: [AI绘图, NoobAI]
category: '教程'
draft: false 
lang: ''
---

# 前情提要（坐牢实况）

其实本来这篇文章应该在一个月前就发出来的，当时已经把部署方法写好了，但是脑子一热给系统重装了。教程没留下，模型没留下，prompt（提示词）没留下，图也没留下。然后就脱坑AI绘图了，然后就开始研究别的东西了

契机是昨天晚上（2025-05-12）看到有大佬在发一些精美的AI绘图。我这不服输的胜负欲啊...

然后就边和群u唱歌边研究AI绘图，前前后后把Stable Diffusion WebUI、Stable Diffusion Forge WebUI、Comfyui全装了一遍各种找教程、实操、试错

![2025-05-13-11-58-34-image.png](https://i0.hdslb.com/bfs/openplatform/213f91bb86d0e8da40baa6045be26489fdf03ef4.png)

好在凭借着仅剩的记忆也是顺着这些蛛丝马迹把我曾经丢掉的知识找回来了，在纯小白的情况下，你可以跑出类似下面的图！（跑不出来你打死我！）


![2025-05-13-11-59-50-ComfyUI_00016_.png](https://i0.hdslb.com/bfs/openplatform/268f852077adb4f93ae3db32bb099e62e755d846.png)

![2025-05-13-12-00-37-ComfyUI_00011_.png](https://i0.hdslb.com/bfs/openplatform/fb97a500771d87a7762182166c2ae785ece45d25.png)

# 正式开始

## 下载NoobAI-V预测模型

前往 [NoobAI-XL (NAI-XL) - V-Pred-1.0-Version | NoobAI Checkpoint | Civitai](https://civitai.com/models/833294?modelVersionId=1190596) （需魔法）

点击下载即可

![2025-05-13-12-08-17-image.png](https://i0.hdslb.com/bfs/openplatform/24d9478a2f7ab04c736ac1c91aa58186df94161e.png)

## 安装Comfyui

前往秋叶的视频评论区下载Comfyui整合包，下载并解压： https://www.bilibili.com/video/BV1Ew411776J

解压完后打开文件夹，打开 `A绘世启动器`

![2025-05-13-12-05-17-image.png](https://i0.hdslb.com/bfs/openplatform/8ea2517ec9dd2cd9c5af3dcf26570998447d904f.png)

点击右下角的开始运行，先让他进行初始化，直到它自动打开你的浏览器并且可以正常进入Comfyui的界面，如下图![2025-05-13-12-06-57-image.png](https://i0.hdslb.com/bfs/openplatform/fdcf2512897b3601d6e46fe2fb8a306c582acc45.png)

## 放置模型

将我们刚才下载的NoobAI-V预测模型，类似 `noobaiXLNAIXL_vPred10Version.safetensors` 这样的文件放到 `ComfyUI-aki-v1.5\models\checkpoints` 下面，如图

![2025-05-13-12-10-06-image.png](https://i0.hdslb.com/bfs/openplatform/516cf8c4e7b2fdc11bec91dac9683ffe8fb62665.png)

## 开始绘图

刷新Comfyui，你应该可以在 `Checkpoint加载器(简易)` 处可以看到你放置的所有模型，选择带有 `vPred...` 的就是V预测模型

![2025-05-13-12-11-55-image.png](https://i0.hdslb.com/bfs/openplatform/4ee210a9401981e853f0a20f545e12327cded112.png)

然后你想要画什么呢？比如崩铁的流萤？

进入 [Danbooru characters in NoobAI-XL (NAI-XL)](https://www.downloadmost.com/NoobAI-XL/danbooru-character/)

搜索流萤的英文名 `firefly` 或者搜索 `star rail` 找到所有关于崩铁的角色

![2025-05-13-12-15-16-image.png](https://i0.hdslb.com/bfs/openplatform/97e9986382e895f227e9d215e624bbeb24950a04.png)

复制 `Prompt tags` 

回到Comfyui，将其粘贴进链接了正面条件的CLIP文本编码器

![2025-05-13-12-16-35-image.png](https://i0.hdslb.com/bfs/openplatform/45e3eaefd6583e498e5035d928997a513c8a3508.png)

这样角色预设就写好了

我这里也提供了一些起手的提示词

- 正面条件：
  
  ```
  masterpiece, best quality, newest, absurdres, highres
  ```

- 负面条件：
  
  ```
  text, watermark, worst quality, old, early, low quality, lowres, signature, username, logo, bad hands, mutated hands, mammal, anthro, furry, ambiguous form, feral, semi-anthro
  ```

我们将其添加到Comfyui，如下图

![2025-05-13-12-19-32-image.png](https://i0.hdslb.com/bfs/openplatform/87e683d4d7f70e57e376f848e3b1874d75f16fe7.png)

ok！接下来让我们配置K采样器

- 步数：28-35

- CFG：4-5

- 采样器：euler（❗重要！不能更改！可能会崩图！）

没提到的参数自行斟酌调整，如果你不懂就不要乱调！

接下来设置图像尺寸，总面积约为 1024x1024。**最推荐832x1216**。其余：768x1344、896x1152、1024x1024、1152x896、1216x832、1344x768、1024x1536、1536x1024

![2025-05-13-12-22-06-image.png](https://i0.hdslb.com/bfs/openplatform/94df229f8b569d48b3576b8223eb6040209c12c1.png)

最终工作流如图，然后点击执行队列！
![2025-05-13-12-24-12-image.png](https://i0.hdslb.com/bfs/openplatform/9890814f0a3fd57dd44fe7d22c3fc20524d272f5.png)

然后你就能得到一张这样的图片：![2025-05-13-12-24-51-ComfyUI_00018_.png](https://i0.hdslb.com/bfs/openplatform/e6f769d04fe7633e10dc4fd7cb3d4f3c47ae6e50.png)

如果你想要图片是不同的样子请在正面提示词和反面提示词添加（**必须为英文！不知道的用翻译或者问AI！**）。比如我这边想要让足部放到焦点上并且裸足就添加**正面提示词**： `barefoot,feet in foreground`

![2025-05-13-12-27-07-ComfyUI_00019_.png](https://i0.hdslb.com/bfs/openplatform/6567302474dc3ca5e187d9e128921ec7a463671e.png)

## 最后

- AI生成的图片随机性较强。每一次生成的图片都不太一样。多试试

- 可以在负面提示词添加：`NSFW` ，在正面提示词添加 `safe` 这样就不会生成涩图

- 由于V预测模型较新，只能在SDForge和Comfyui上运行，原版SD无法运行，会崩图

- 参考：[NoobAI-XL (NAI-XL) - V-Pred-0.5-Version | NoobAI Checkpoint | Civitai](https://civitai.com/models/833294?modelVersionId=1046043)。关于更多的此模型的技巧可以到图片对应处的About查看![2025-05-13-12-30-55-image.png](https://i0.hdslb.com/bfs/openplatform/ea470fc1748611affb17b9d61e45d6ed7897c7ce.png)

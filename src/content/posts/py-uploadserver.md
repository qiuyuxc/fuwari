---
title: 想要一个匿名文件上载器？一行命令装好！
published: 2025-12-11T09:08:55
description: 有时候我们可能出门在外想要带文件回家，但是U盘插来插去并不优雅，那么，我们可以尝试在自家电脑启动一个匿名文件上载器，然后将其暴露到公网！
image: ../img/983a4a5f674878f976b4761f5d8793ff.png
tags:
  - Python
draft: false
lang: ""
---
# 安装
确保你安装了 **Python**

安装 **uploadserver**
```bash
pip install --user uploadserver
```

接下来，创建并进入一个新文件夹，作为 **上传目录**
```bash
mkdir upload
cd upload
```

运行，并监听 **IPv4** 的 **8000端口**
```bash
python -m uploadserver 8000
```

又或者，监听 **IPv6** 的 **8000端口** 
```bash
python -m uploadserver --bind :: 8000
```

接下来，你就可以在内网环境使用这个 **文件上载器** 了
![](../img/2d546fe3a64f15da6e8338e6c24d5e4e.png)

再然后，我们就可以将其打到公网了

# 打到公网

### 方案一：使用EdgeOne进行IPv6回源

将你的IPv6做 **DDNS** ，然后使用EdgeOne回源
![](../img/f2c3625fc7d27d56d6749c7f260f90c1.png)

### 方案二：STUN（仅NAT1可用）

当你的家庭网络为 **NAT1** ，则可以使用类似这样的软件将你的 **内网端口** 直接打到 **公网端口** （貌似该程序对TCP分片敏感，会导致RST） [MikeWang000000/Natter: Expose your TCP/UDP port behind full-cone NAT to the Internet.](https://github.com/MikeWang000000/Natter) 
![](../img/35fe434b116898cef9b2056308f6f048.png)
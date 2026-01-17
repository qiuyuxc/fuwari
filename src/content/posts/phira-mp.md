---
category: 教程
description: 懒人可以直接下载预构建的可执行文件，但如果想获得日志需要自备Rust环境
draft: false
image: https://i0.hdslb.com/bfs/openplatform/6b435b9d31b82914f3c07f1733bb0183dcd21597.webp
lang: ''
published: 2024-11-06
tags:
- Phira
title: Phira多人联机服务器搭建/使用教程
---
# 直接下载服务端文件并运行

[https://github.com/afoim/phira-mp-autobuild](https://github.com/afoim/phira-mp-autobuild)

这里有一些由Github Action自动构建的服务端文件，涵盖以下系统和架构![](https://i0.hdslb.com/bfs/openplatform/f947bcdb59cb2eab1a63dc86b434d4eb889283a3.webp)

也可以前往[Multiplayer Server | Dmocken的Phira下载站](https://phira.dmocken.top/Multiplayer%20Server%E5%A4%9A%E4%BA%BA%E6%B8%B8%E6%88%8F%E6%9C%8D%E5%8A%A1%E5%99%A8)自行寻找

寻找适用于你的系统的文件，下载下来并执行即可。默认服务端将会在你的主机12346端口上开放，如果需要自定义端口，请使用`--port`参数指定端口。然后即可使用Phira来填写IP/域名:端口来连接

*如果要显示Log，请使用 `RUST_LOG=debug ./xxx` 去运行，默认日志等级是 `WARN`

如果这些文件不适用于你正在使用的系统请前往[自行构建（高级）](#自行构建高级)继续阅读

# 自行构建（高级）

由于phira-mp使用Rust编写，若想要自行构建需要在你的操作系统上安装Rust环境

## 对于Windows

前往[Rust 下载页](https://www.rust-lang.org/zh-CN/learn/get-started)，下载 Rust  ![](https://i0.hdslb.com/bfs/openplatform/dc1b28a268e185fceb08f1375500b188cacf939f.webp)
打开后会弹出一个 CMD 窗口，输入 1（Quick Install）回车，等待 Visual Studio 安装（如果此步 Visual Studio 下载很慢也可以[手动下载](https://visualstudio.microsoft.com/zh-hans/downloads/)）  

![](https://i0.hdslb.com/bfs/openplatform/0236358c4d2665629594f39131fcb9cbc003ef07.webp)在 Visual Studio 中，勾选**使用 C++ 的桌面开发**，然后安装  
![](https://i0.hdslb.com/bfs/openplatform/67793a422bc3603eee57a745e01eb3d9aba08ea3.webp)然后请跳过 Linux 教程直接阅读[构建 phira-mp]()

## 对于Linux

执行：`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

选择 1 回车

执行：`source $HOME/.cargo/env`

# 使用Rust构建phira-mp

克隆仓库：`git clone https://github.com/TeamFlos/phira-mp.git`（不支持IPv6）或`git clone https://github.com/afoim/phira-mp-autobuild.git`（支持IPv6）

`cd phira-mp`或`cd phira-mp-autobuild`

更新依赖：`cargo update`

构建：`cargo build --release -p phira-mp-server`

运行程序并将 log 打印到终端，会显示你监听的端口：`RUST_LOG=info target/release/phira-mp-server`  
（如果你需要指定端口号：`RUST_LOG=info target/release/phira-mp-server --port 8080`）

![](https://i0.hdslb.com/bfs/openplatform/13e3e019c1dbfe084063251e4ddc569f73d67a6c.webp)

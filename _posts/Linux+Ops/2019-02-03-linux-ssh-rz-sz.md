---
layout: blog
back: true
comments: True
flag: linux
background: gray
category: 后端
title: SSH 上传下载
date:   2019-02-03 15:11:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/13/5ad0695146748.jpg
tags:
- linux
---
# {{ page.title }}

## 什么是 SSH

**[SSH(Secure Shell)](https://zh.wikipedia.org/wiki/Secure_Shell)** 是一种加密的网络传输协议，可在不安全的网络中为网络服务提供安全的传输环境。SSH 通过在网络中创建安全隧道来实现 SSH 客户端与服务器之间的连接。其最常见的用途是远程登录系统，来传输命令行界面和远程执行命令。

```SHELL
# 只需要指定用户名和主机名参数即可. 主机名可以是 IP 地址或者域名
ssh user@hostname

# SSH 默认连接到目标主机的 22 端口上,但是由于各种原因你可能需要连接到其他端口
ssh -p 10022 user@hostname
```

## 上传下载

利用 SSH 管理远程 Linux 服务器时，经常需要与本地交互文件。当然，我们可以利用 FTP 方式，比如通过 **Filezilla** 客户端软件，或者直接通过 mount 命令去挂载。不过直接使用 SSH 软件(**SecureCRT****、Xshell**)自带的上传和下载功能无疑使最方便快捷的。通常 SSH 软件支持的文件传输协议主要有 **ASCII**、**Xmodem**、[**Zmodem**](https://baike.baidu.com/item/ZModem协议) 等。

### rz/sz

**rz(接收)**、**sz(发送)** 是 Linux/Unix 同 Windows 进行 ZModem 文件传输的命令行工具。首先需要在服务器端安装 **lszrz** 包。其次，windows 端需要支持 ZModem 的 telnet/ssh 客户端，比如 SecureCRT、Xshell 等，**PuTTY** 暂时不支持。

```SHELL
# For CentOS/RHEL
yum -y install lrzsz
# For Ubuntu
# sudo apt-get install lrzsz
```

运行命令 rz 即可，此时会弹出文件选择对话框，文件就会上传到服务器当前目录。运行命令 `sz filename` 则是将文件到 Windows 上，保存的目录可以在客户端配置。

```SHELL
# 上传
rz
# 下载
sz filename
```

### SSH 客户端

SSH 客户端有很多，这里只介绍一些常用的，一些客户端的比较可[查看这里](https://zh.wikipedia.org/wiki/SSH客户端比较) 👈

#### SecureCRT

**SecureCRT** 是一个基于图形用户界面的 Telnet 客户端和虚拟终端。这里只介绍下配置上传下载的路径(截图基本[摘自这里](http://blog.51cto.com/skypegnu1/1538371)):

![SecureCRT](http://s3.51cto.com/wyfs02/M00/45/56/wKiom1PniTzQ1nNWAAHEyqLtFF0295.jpg)

#### Xshell

Xshell 本身用的不多，这里同样贴一下配置上传下载的路径:

![Xshell](http://s3.51cto.com/wyfs02/M00/45/56/wKiom1Pni_fS-2EKAAKi4aKC7m0124.jpg)

#### PuTTY

虽然 [**PuTTY**](https://www.putty.org) 不支持 Zmodem 协议进行传输文件，但由于用的比较多， 这里还是介绍一下，毕竟免费且"短小精悍"。

![PuTTY](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/putty-session-config.png)

## 参考链接

1. [Linux 基础：利用 SSH 上传、下载（使用 sz 与 rz 命令）](http://blog.51cto.com/skypegnu1/1538371) By skypeGNU1

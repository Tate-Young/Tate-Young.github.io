---
layout: blog
back: true
comments: True
flag: Linux
background: gray
category: 后端
title:  Linux 文件属性及操作
date:   2018-04-14 14:48:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/13/5ad0695146748.jpg
tags:
- Linux
---
# {{ page.title }}

## 什么是 Linux

**Linux** 是一套免费使用和自由传播的类 **[Unix](https://zh.wikipedia.org/wiki/UNIX)** 操作系统，是一个基于 [POSIX](https://zh.wikipedia.org/wiki/POSIX) 和 UNIX 的多用户、多任务、支持多线程和多 CPU 的操作系统。下面介绍几个知识点:

1、Linux 的发行版

就是将 Linux 内核与应用软件做一个打包。目前市面上较知名的发行版有：[Ubuntu](https://zh.wikipedia.org/wiki/Ubuntu)、[RedHat](https://zh.wikipedia.org/wiki/Red_Hat_Linux)、[CentOS](https://zh.wikipedia.org/wiki/CentOS)、[Debian](https://zh.wikipedia.org/wiki/Debian)、[Fedora](https://zh.wikipedia.org/wiki/Fedora) 等。

2、Linux 远程登录

Linux 系统中是通过 **[ssh(secure shell)](https://zh.wikipedia.org/wiki/Secure_Shell)** 加密的网络传输协议服务实现的远程登录功能，默认 ssh 服务端口号为 22。

* Window 系统上 Linux 远程登录客户端有 SecureCRT、Putty、SSH Secure Shell 等。

* macOS 系统上使用终端知名进行远程访问:

```SHELL
ssh root@example.com

# 例如
ssh 591550@10.88.22.1
```

## 系统目录结构

![系统目录结构](http://www.runoob.com/wp-content/uploads/2014/06/003vPl7Rty6E8kZRlAEdc690.jpg)

Linux 中根目录和主目录的区分:

* 根目录是 **/**，是树状形式目录的根，只有一个。
* 主目录 **~** 是用户的 home 目录，添加用户的时候指定的。对于不同用户，主目录不同。如对于用户名为 tate 的用户，主目录是 /home/user，root 用户例外，其主目录是 /root。

## 文件属性

### 属性图解

```SHELL
# ls -l
total 112
drwxr-xr-x    4 tate  staff    128 Jan 19 09:23 Applications
drwxrwxrwx    2 tate  staff     64 Jan 19 09:04 Creative Cloud Files
```

![linux-file-property.png](https://i.loli.net/2018/04/13/5ad07221ee04c.png)

针对第一部分的文件属性可查看下图:

![文件属性](http://www.runoob.com/wp-content/uploads/2014/06/363003_1227493859FdXT.png)

第一个字符(如上述 'd')代表这个文件是目录、文件或链接文件等等。

* [ **d** ] - 目录
* [ **-** ] - 文件
* [ **l** ] - 链接文档(link file)
* [ **b** ] - 装置文件里面的可供储存的接口设备(可随机存取装置)
* [ **c** ] - 装置文件里面的串行端口设备，例如键盘、鼠标(一次性读取装置)

接下来的字符中，以三个为一组，且均为『rwx』 的三个参数的组合，**属主**代表该文件的拥有者，**属组**代表所有者的同组用户。其中:

* [ **r** ] - 可读(read)
* [ **w** ] - 可写(write)
* [ **x** ] - 可执行(execute)

### 属性更改命令

Linux 涉及文件属性更改的命令有:

* **chgrp** - 更改文件属组
* **chown** - 更改文件属主，也可以同时更改文件属组
* **chmod** - 更改文件的访问权限

#### chown

```SHELL
# 参数 -R 表示是否递归应用至子目录
chown [–R] 属主名 文件名
chown [-R] 属主名:属组名 文件名
```

栗子如下:

```SHELL
chown bin install.log
# 将文件属主更改为 bin 账号
# -rw-r--r--  1 bin  users 68495 Jun 25 08:53 install.log

chown root:root install.log
# 将文件属主和属组改为 root
# -rw-r--r--  1 root root 68495 Jun 25 08:53 install.log
```

#### chmod

Linux 基本权限就有九个，分别是 **user/group/others** 三种身份各有自己的 **read/write/execute** 权限。文件属性有两种设置方法，一种是数字，一种是符号:

* **符号 r --> 数字 4**
* **符号 w --> 数字 2**
* **符号 x --> 数字 1**

1、根据数字更改权限的方法:

```SHELL
chmod [-R] xyz 文件或目录
```

举个栗子 🌰，针对文件权限 <code>-rwxrwx---</code>:

```TEXT
owner = rwx = 4+2+1 = 7
group = rwx = 4+2+1 = 7
others= --- = 0+0+0 = 0
```

```SHELL
# -rw-r--r--    1 tate  staff     0B Apr 14 10:00 test.txt

chmod 777 test.txt
# -rwxrwxrwx    1 tate  staff     0B Apr 14 10:00 test.txt
```

2、根据符号类型更改权限的方法:

```SHELL
chmod u=rwx,g=rx,o=r 文件或目录
```

* **符号 u --> 属主 user**
* **符号 g --> 属组 group**
* **符号 o --> 其他 others**
* **符号 a --> 全部**

设定权限的三种方式:

* **符号 +** - 加入某个权限，如 [rwx]
* **符号 -** - 去除某个权限，如 [rwx]
* **符号 =** - 设定某个权限，如 [rwx]

举个栗子 🌰:

```SHELL
chmod a-x test.txt
# 去除所有用户的可执行权限

chmod o+rw test.txt
# 增加其他用户的读写权限
```

## 文件操作

| 命令 | 描述 |
|:--------------|:---------|
| **ls** | 列出文件或目录 |
| **cd** | 切换目录 |
| **pwd** | 显示目前的目录 |
| **mkdir** | 创建一个新的目录 |
| **rmdir** | 删除一个空的目录 |
| **rm** | 移除文件或目录 |
| **cp** | 复制文件或目录 |

### ls

```SHELL
ls -[adl] [目录]
```

**ls** 命令用来列出文件或目录，参数为:

* **-a** - 全部的文件，连同隐藏档(开头为 . 的文件)一起列出来
* **-d** - 仅列出目录本身，而不是列出目录内的文件数据
* **-l** - 长数据串列出，包含文件的属性与权限等数据

### mkdir

**mkdir** 命令用来创建目录，参数为:

* **-m** - 顺带配置权限
* **-p** - 即 --parents，若所要建立目录的上层目录目前尚未建立，则会一并建立上层目录

```SHELL
mkdir -m 711 test
```

```SHELL
mkdir test/test1
# No such file or directory

mkdir -p test/test1
```

### rm

**rm** 命令用来删除文件或目录，参数为:

* **-f** - 就是 force 的意思，忽略不存在的文件，不会出现警告信息
* **-i** - 互动模式，在删除前会询问使用者是否动作
* **-r** - 递归删除目录，谨慎使用

> 对于删除目录来讲，**rmdir** 仅能删除空的目录，可以使用 **rm -r** 命令来删除目录

## 文件查看

| 命令 | 描述 |
|:--------------|:---------|
| **cat** | 由第一行开始显示文件内容 |
| **tac** | 从最后一行开始显示，可以看出 tac 是 cat 的反写 |
| **nl** | 显示的时候，顺道输出行号 |
| **more** | 一页一页的显示文件内容，"空格"代表向下翻页，"Enter"代表向下翻一行，"q"为退出 |
| **less** | 与 more 类似，但是比 more 更好的是，他可以往前翻页 |
| **head** | 只显示头几行，参数 -n 表示行数 |
| **tail** | 只显示后几行，参数 -n 表示行数 |

## 参考链接

1. [菜鸟 - linux 教程](http://www.runoob.com/linux/linux-intro.html)

---
layout: blog
front: true
comments: True
flag: Linux
background: gray
category: 后端
title:  Linux 文件属性及操作
date:   2018-04-14 14:48:00 GMT+0800 (CST)
update: 2019-03-20 12:03:00 GMT+0800 (CST)
background-image: /style/images/smms/linux.webp
tags:
- Linux
---
# {{ page.title }}

## 什么是 Linux

**Linux** 是一套免费使用和自由传播的类 **[Unix](https://zh.wikipedia.org/wiki/UNIX)** 操作系统，是一个基于 [POSIX](https://zh.wikipedia.org/wiki/POSIX) 和 UNIX 的多用户、多任务、支持多线程和多 CPU 的操作系统。下面介绍几个知识点:

1、Linux 的发行版

就是将 Linux 内核与应用软件做一个打包。目前市面上较知名的发行版有: [RedHat](https://zh.wikipedia.org/wiki/Red_Hat_Linux)、[CentOS](https://zh.wikipedia.org/wiki/CentOS)、[Fedora](https://zh.wikipedia.org/wiki/Fedora)、[Debian](https://zh.wikipedia.org/wiki/Debian)、[Ubuntu](https://zh.wikipedia.org/wiki/Ubuntu) 等。

2、Linux 远程登录

Linux 系统中是通过 **[ssh(secure shell)](https://zh.wikipedia.org/wiki/Secure_Shell)** 加密的网络传输协议服务实现的远程登录功能，默认 ssh 服务端口号为 22，具体可以[参考这篇博客]( {{site.url}}/2019/02/03/linux-ssh-rz-sz.html ) 👈

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

![linux-file-property]( {{site.url}}/style/images/smms/linux-file-property.webp )

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

举个栗子 🌰，针对文件权限 `-rwxrwx---`:

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
| **touch** | 创建一个空的文件 |
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

### cp

[**cp**](http://man.linuxde.net/cp) 可以复制文件或目录，`-r` 参数可以实现递归拷贝:

```SHELL
# 将文件 file 复制到目录 /usr/men/tmp 下，并改名为 file1
cp file /usr/men/tmp/file1

# 将目录 /usr/men 下的所有文件及其子目录复制到目录 /usr/zh 中，如果目标目录不存在则自动创建
cp -r /usr/men /usr/zh

# 交互式地将目录 /usr/men 中的以 m 打头的所有 .c 文件复制到目录 /usr/zh 中
cp -i /usr/men m*.c /usr/zh
```

我们在 Linux 下使用 cp 命令复制文件时候，有时候会需要覆盖一些同名文件，覆盖文件的时候都会有提示：需要不停的按 Y 来确定执行覆盖。因此可以采用下列操作:

```SHELL
# 复制目录 aaa 下所有到 /bbb 目录下，这时如果 /bbb 目录下有和 aaa 同名的文件，需要按 Y 来确认并且会略过 aaa 目录下的子目录。
cp aaa/* /bbb

# 这次依然需要按 Y 来确认操作，但是没有忽略子目录。
cp -r aaa/* /bbb

# 依然需要按 Y 来确认操作，并且把 aaa 目录以及子目录和文件属性也传递到了 /bbb。
cp -r -a aaa/* /bbb

# 成功，没有提示按 Y、传递了目录属性、没有略过目录。
\cp -r -a aaa/* /bbb
```

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

## 文件编辑 vim

**vim** 是从 vi 发展出来的一个文本编辑器。代码补完、编译及错误跳转等方便编程的功能特别丰富。基本上 vi/vim 共分为三种模式，分别是:

* **命令模式**(Command mode)
* **输入模式**(Insert mode)
* **底线命令模式**(Last line mode)

1、命令模式

启动 vim 时便进入命令模式，此时支持常用的命令:

* **i/o/a** - 切换到输入模式，以输入字符，区别在于进入到输入模式时光标的位置不同
* **:** - 切换到底线命令模式
* **x** - 删除当前光标所在处的字符，相当于 Del;大写 X 则删除光标之前的字符，相当于退格键
* **dd** - 删除当前光标所在一整行，ndd 则删除当前光标及其以下的 n 行
* **gg** - 光标移动到该档案的第一行
* **0/[home]** - 光标移动到该行的首个字符处；反之则为 $ 或功能键[End]
* **n[enter]** - n 为输入的数字，光标向下移动 n 行；配合 [space] 则为向右移动这一行的 n 个字符
* **.** - 重复上一个动作
* **u** - 复原上一个动作
* **/** - 搜索，n 跳转下一个

2、输入模式

在输入模式中可以进行常规的编写，按 [HOME/END]，移动光标到行首/行尾；按 [ESC] 退出该模式，切换到命令模式。

3、底线命令模式

底线命令模式可以输入单个或多个字符的命令，按 [ESC] 退出该模式，切换到命令模式:

* **q** - 退出程序
* **q!** - 强制退出程序
* **w** - 保存文件
* **x** - 保存并退出程序，同 wq
* **set nu** - 显示行数

> 在编辑文件的时候如果异常退出，会自动生成 swp 文件以保证文件的安全性，导致每次启动 vim 编辑该文件时都会进行扰人的提示，解决的办法是 `rm -f .[basename].swp`。

![vim](http://www.runoob.com/wp-content/uploads/2014/07/vim-vi-workmodel.png)

## .bash_profile

这里介绍下 linux 中几个文件的区别:

* **/etc/profile** - The systemwide initialization file, executed for login shells
* **~/.bash_profile** - The personal initialization file, executed for login shells
* **~/.bashrc** - The individual per-interactive-shell startup file, executed for interactive non-login shells

首先 `/etc` 目录下的一般是针对所有用户生效的，而 `~` 主目录下的只针对当前用户生效。然后 `profile` 和 `rc` 的主要区别在于 shell 的两种不同属性:

* 登录
  * **登录** - 用户通过输入用户名/密码(或证书认证)后启动的 shell；或者通过带有 `-l|--login` 参数的 bash 命令启动的 shell，如 系统启动、远程登录、使用 `su -` 切换用户、通过 `bash --login` 命令启动 bash 等
  * **非登录** - 图形界面启动终端、使用 `su` 切换用户、通过 `bash` 命令启动 bash 等
* 交互
  * **交互式** - 登录、输入并执行命令、登出。当登出的时候，这个 shell 就终止了
  * **非交互式** - 执行预先设定的命令，当它读到文件的结尾，这个 shell 就终止了

> A login shell is one whose first character of argument zero is a -, or one started with the --login option

```SHELL
echo $0
# -bash 即为登录 shell

bash --login
echo $0
# bash 也为登录 shell，但其他情况下是 非登录 shell
```

对于用户而言，**登录 shell** 和 **非登陆 shell** 的主要区别在于启动 shell 时所执行的 startup 文件不同，前者执行 `~/.bash_profile`，后者执行 `~/.bashrc`。

> 上述讨论的都是针对 bash，如果使用的是 zsh，则只会执行对应的 `/etc/zshrc` 和 `~/.zshrc` 或者 `/etc/zprofile`。

这里额外扯一下，涉及到用 `alias` 设置别名的话，最好单独建一个文件进行管理，比如新建 `.bash_aliases`，然后写上别名，之后在 `~/.bash_profile` 里添加:

```SHELL
[[ -f ~/.bash_aliases ]] && . ~/.bash_aliases

# or
if ［ -f ~/.bash_aliases ］; then
  . ~/.bash_aliases
fi

# or
test -f ~/.bash_aliases && source ~/.bash_aliases
```

## 参考链接

1. [菜鸟 - linux 教程](http://www.runoob.com/linux/linux-intro.html)
2. [关于 .bash_profile 和 .bashrc 区别的总结](https://blog.csdn.net/sch0120/article/details/70256318) By Charles_Shih
3. [What is the difference between .bash_profile and .bashrc?](https://medium.com/@kingnand.90/what-is-the-difference-between-bash-profile-and-bashrc-d4c902ac7308) By King Dink

---
layout: blog
back: true
comments: True
flag: Linux
background: gray
category: 后端
title:  Linux 常用命令
date:   2018-04-15 14:15:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/13/5ad0695146748.jpg
tags:
- Linux
---
# {{ page.title }}

## 常用命令

| 命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **yum** | 包管理工具 | <code>yum search/install/remove ...</code> |
| **grep** | 文本搜索 | <code>grep '^tate' filename</code> |
| **ps** | 查看进程 | <code>ps -ef</code> |
| **lsof** | 列出当前系统打开文件的工具 | <code>lsof -i:4000</code> |
| **kill** | 终止进程 | <code>kill -9</code> |
| **find** | 指定目录下查找文件 | <code>find . -name '*.txt'</code> |
| **tr** | 对字符进行替换、压缩和删除 | <code>echo "HELLO" | tr 'A-Z' 'a-z'</code> |
| **pwd** | 以绝对路径的方式显示用户当前工作目录 | <code>pwd</code> |
| **whoami** | 查看当前有效用户名 | <code>whoami</code> |
| **date** | 显示或设置系统时间与日期 | <code>date +"%Y-%m-%d"</code> |
| **mount** | 挂载，umount 接触挂载 | <code>mount -t cifs -o ...</code> |
| **alias** | 设置命令的别名 | <code>alias ll='ls -al'</code> |
| **say** | macOS 系统中激活语音合成系统 | <code>say -v Ting-Ting hello</code> |

## yum

针对 yum/apt-get/rmp/dpkg 等命令作区分，通过 linux 分为两大系列:

| 系列 | RedHat 系列 | Debian 系列 |
|:--------------|:---------|:---------|
| 常用安装包格式 | rmp | deb |
| 安装包命令 | <code>rmp -参数</code> | <code>dpkg -参数</code> |
| 包管理工具 | yum | apt-get |
| 栗子 | Redhat、Centos、Fedora 等 | Debian、Ubuntu 等 |

下面着重介绍几个知识点:

* **[RPM(Redhat Package Manager)](https://zh.wikipedia.org/wiki/RPM%E5%A5%97%E4%BB%B6%E7%AE%A1%E7%90%86%E5%93%A1)** 是由红帽公司开发的软件包管理器，可以方便的进行软件的安装、查询、卸载、升级等工作，但软件包之间的依赖性问题往往处理起来很繁琐
* **yum(Yellow dog Updater,Modified)** 是基于 rpm 包的包管理工具，能够从指定的服务器自动下载 rpm 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装
* **dpkg(Debian Package)** 是 Debian 软件包管理器的基础，类似于 rpm，用于安装、卸载和供给与 .deb 软件包相关的信息
* **apt(Advanced Packaging Tools)** 是 Debian 及其派生发行版的软件包管理器，可以自动下载、配置、安装二进制或者源代码格式的软件包，apt 最早被设计成 dpkg 的前端，用来处理 deb 格式的软件包。现在经过 APT-RPM 组织修改，已经可以安装在支持 RPM 的系统管理 RPM 包
* **Wget** 是一个在网络上进行下载的简单而强大的自由软件，目前它支持通过 HTTP、HTTPS 以及 FTP 这三个最常见的 TCP/IP 协议下载，可以递归，支持断点
* **cURL** 是一个利用 URL 语法在命令行下工作的文件传输工具，支持文件上传和下载，相较于 wget，它支持更多的协议，批量下载
* **[homebrew](https://brew.sh/)** 是是一款自由及开放源代码的软件包管理系统，用以简化 macOS 系统上的软件安装过程，类似于 yum/apt-get；Windows 系统则可以使用 [**chocolatey**](https://chocolatey.org/)

## grep

**[grep](http://man.linuxde.net/grep)** 命令是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来

```SHELL
grep "match_pattern" file_name
```

```SHELL
grep '^chmod' test.txt
# chmod 用法
# chmod a=rwx file
# chmod 777 file
# chmod ug=rwx,o=x file
# chmod 771 file
```

## ps

**ps** 命令用于查看进程，常用的参数为:

* **-a** - 显示所有进程
* **-e** - 显示所有进程和环境变量
* **-f** - 显示 UID、PPID、C 与 STIME 栏位

```SHELL
ps -af
# UID   PID  PPID   C STIME   TTY           TIME CMD
#   0 46292 15100   0 Tue11AM ttys000    0:00.04 login -pf tate
# 501 46293 46292   0 Tue11AM ttys000    0:01.31 -zsh
```

其中 **UID** 是用户身份证明，**PID** 是进程识别号，**PPID** 是上级父进程的识别号。通常配合 grep 命令查找:

```SHELL
ps -ef | grep vim
# 501 64513 64386   0 12:51PM ttys003    0:00.04 vim test.txt
```

符号 **\|** 是管道命令操作符，可以传递给下一个命令，作为标准的输入。它只能处理经由前面一个指令传出的正确输出信息，对错误信息信息没有直接处理能力。之后也可以通过 **kill** 命令删除执行中的程序或工作:

```SHELL
# kill [PID] 删除指定进程
kill 64513
```

## lsof

**lsof**(list open files) 列出当前系统打开文件的工具,通过 **-i** 参数可以列出符合条件的进程:

```SHELL
lsof -i:4000
# COMMAND   PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
# ruby    56525 tate    9u  IPv4 0x28babd01c639a281      0t0  TCP localhost:terabase (LISTEN)
```

## kill

**kill** 根据进程 PID 进行终止，该命令是通过向进程发送指定的信号来结束相应进程的，通过 <code>kill -l</code> 可以列出所有的信号。只有第 9 种信号(SIGKILL)才可以无条件终止进程，其他信号进程都有权利忽略。下面是常用的信号:

| 信号 | 信号对应数值 | 描述 |
|:--------------|:---------|:---------|
| HUP | 1 | 终端断线 |
| INT | 2 | 中断(同 Ctrl + C) |
| QUIT | 3 | 退出(同 Ctrl + \) |
| TERM | 15 | 终止 |
| KILL | 9 | 强制终止 |
| CONT | 18 | 继续(与 STOP 相反， fg/bg 命令) |
| STOP | 19 | 暂停(同 Ctrl + Z) |

```SHELL
# 强制终止指定进程
kill -9 56525
```

## find

**[find](http://man.linuxde.net/find)** 用来在指定目录下查找文件，不设置任何参数时，将在当前目录下查找子目录与文件。并且将查找到的子目录和文件全部进行显示。

```SHELL
# 查找 home 目录下以 .txt 结尾的文件名
find /home -name "*.txt"

# 查找 home 目录下不以 .txt 结尾的文件名
find /home ! -name "*.txt"

# 查找当前目录下以 .txt 或 .pdf 结尾的文件名
find . -name "*.txt" -o -name "*.pdf"
```

还可以根据文件类型进行搜索:

```SHELL
find . -type 类型参数(f 是普通文件、d 是目录)
```

```SHELL
# 搜索最近七天内被访问过的所有文件
find . -type f -atime -7

# 搜索大于 10KB 的文件
find . -type f -size +10k
```

## tr

**tr** 用来对字符进行替换、压缩和删除，参数为:

* **-c**(--complerment) - 取代所有不属于第一字符集的字符
* **-d**(--delete) - 删除所有属于第一字符集的字符
* **-s**(--squeeze-repeats) - 把连续重复的字符以单独一个字符表示
* **-t**(--truncate-set1) - 先删除第一字符集较第二字符集多出的字符

转换大小写:

```SHELL
echo "HELLO WORLD" | tr 'A-Z' 'a-z'
# hello world
```

删除所匹配的字符:

```SHELL
echo "hello 123 world 456" | tr -d '0-9'
# hello  world
```

压缩字符:

```SHELL
echo "thissss is      a text linnnnnnne." | tr -s ' sn'
this is a text line.
```

## date

**date** 用来显示或设置系统时间与日期，用法为 <code><+时间日期格式></code>，指定显示时使用的[日期时间格式](http://man.linuxde.net/date):

```SHELL
date +"%Y-%m-%d"
# 2018-04-16
```

例如检查某个命令花费的时间:

```SHELL
start=$(date +%s)
nmap man.linuxde.net &> /dev/null

end=$(date +%s)
difference=$(( end - start ))
echo $difference seconds.
```

## mount

**mount** 用来挂载资源以供访问，卸载则为 **unmount**，常用的方式为:

```SHELL
mount -t 类型 -o 挂接方式 源路径 目标路径
```

一般情况下要是访问 Windows 文件共享，则类型采用 **cifs**，详情[查看此篇博客](https://blog.csdn.net/q1059081877q/article/details/48251893)，目标路径一定要在挂载前创建，否则报错:

```SHELL
# 挂载
mount -t cifs -o username=591550,password=Bestsfer20175 //10.88.1.8/test $reportletMnt

# 卸载
umount /dev/hda5
# –l 参数并不是马上卸载，而是在该目录空闲后再卸载，可以解决 device busy 的问题，当然你也可以查询到进程并 kill 掉
umount -l /mnt/hda5
```

## alias

**alias** 用来设置命令的别名，只局限于该次登入的操作。若要每次登入都能够使用这些命令别名，则可将相应的 alias 命令存放到 `~/.bash_profile` 中，若不存在该文件的话可以手动创建。**unalias** 可删除别名。

```SHELL
alias 新的命令='原命令 -选项/参数'
```

```SHELL
alias ll='ls -al'
```

## say(macOS)

**say** 是 macOS 系统中独有的，不加参数的情况下使用系统默认语音。

```SHELL
say hello

say -v Ting-Ting 我是中国女声
say -v Mei-Jia 我是台湾女声
say -v Daniel i am Daniel
```

## 参考链接

1. [Linux 命令大全](http://man.linuxde.net/grep)
2. [Linux Shell 脚本攻略](http://man.linuxde.net/shell-script)
3. [yum 与 rpm、apt 的区别：rpm 的缺陷及 yum 的优势](http://www.aboutyun.com/thread-9226-1-1.html) By pig2
4. [Mount 挂载命令使用方法](https://blog.csdn.net/q1059081877q/article/details/48251893)

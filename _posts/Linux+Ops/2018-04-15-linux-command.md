---
layout: blog
front: true
comments: True
flag: Linux
background: gray
category: 后端
title:  Linux 常用命令
date:   2018-04-15 14:15:00 GMT+0800 (CST)
update: 2020-01-31 20:42:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/13/5ad0695146748.jpg
tags:
- Linux
---
# {{ page.title }}

## 常用命令

基本的文件操作和查看命令可[参考前一篇博客]( {{site.url}}/2018/04/14/linux-profile.html ) 👈

| 命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **yum** | 包管理工具 | `yum search/install/remove ...` |
| **grep** | 文本搜索 | `grep '^tate' filename` |
| **ps** | 查看进程 | `ps -ef` |
| **lsof** | 列出当前系统打开文件的工具 | `lsof -i:4000` |
| **kill** | 终止进程 | `kill -9` |
| **find** | 指定目录下查找文件 | `find . -name '*.txt'` |
| **tr** | 对字符进行替换、压缩和删除 | `echo "HELLO" | tr 'A-Z' 'a-z'` |
| **pwd** | 以绝对路径的方式显示用户当前工作目录 | `pwd` |
| **whoami** | 查看当前有效用户名 | `whoami` |
| **date** | 显示或设置系统时间与日期 | `date +"%Y-%m-%d"` |
| **mount** | 挂载，umount 接触挂载 | `mount -t cifs -o ...` |
| **scp** | Linux 之间复制文件和目录 | `mount -t cifs -o ...` |
| **alias** | 设置命令的别名 | `scp [可选参数] file_source file_target` |
| **say** | macOS 系统中激活语音合成系统 | `say -v Ting-Ting hello` |

## yum

针对 yum/apt-get/rmp/dpkg 等命令作区分，通过 linux 分为两大系列:

| 系列 | RedHat 系列 | Debian 系列 |
|:--------------|:---------|:---------|
| 常用安装包格式 | rmp | deb |
| 安装包命令 | `rmp -参数` | `dpkg -参数` |
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

## homebrew

[**homebrew**](https://brew.sh) 上面已经说到了是用 ruby 开发的 macOS 的包管理系统，常用的命令总结如下，更多可以[参考官方文档](https://docs.brew.sh/Manpage):

```SHELL
# install
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

```SHELL
# 更新 brew 本身
brew update
# 查看需要更新的包，并且会显示当前版本和最新版本号对照
brew outdated

brew search $FORMULA  # 搜索包
brew install $FORMULA # 安装包
brew list             # 列出已安装包

brew upgrade             # 更新所有的包
brew upgrade $FORMULA    # 更新指定的包

brew cleanup             # 清理所有包的旧版本
brew cleanup $FORMULA    # 清理指定包的旧版本
brew cleanup -n          # 查看可清理的旧版本包，不执行实际操作

brew pin $FORMULA      # 锁定包
brew unpin $FORMULA    # 取消锁定

brew info $FORMULA    # 显示包的信息
brew info             # 显示安装了包数量，文件数量，和总占用空间
brew deps --installed --tree # 查看已安装的包的依赖，树形显示

brew rm $FORMULA                # 删除包
brew uninstall --force $FORMULA # 删除所有版本
```

当然为了更方便使用，我们可以设置一些别名 alias:

```TEXT
bcubc='brew cask reinstall $(brew cask outdated) && brew cleanup'
bcubo='brew update && brew cask outdated'
bi='brew install'
brewp='brew pin'
brews='brew list -1'
brewsp='brew list --pinned'
bs='brew search'
bubc='brew upgrade && brew cleanup'
bubo='brew update && brew outdated'
bubu='bubo && bubc'
```

还有两种用法需要我们注意，一个是 `brew cast`，另一个是 `brew tap`:

* brew cast - 针对编译好的应用包，比如 `brew cast chrome`，即相当于安装软件
* brew tap - 针对第三方的包，仓库源不仅限于 Github，不带参数的话会列出所有安装的 taps，一般用法为 `brew tap <github_userid/repo_name>`。反之为 `brew untap $FORMULA`

> 命令中的 repo_name 其实是 `brew tap <github_userid/homebrew-repo_name>` 的简写，我们可以看到多了个 homebrew 的前缀，这个是和仓库名一致的

```SHELL
brew tap
# homebrew/cask
# homebrew/core
# mongodb/brew

brew install vim                     # installs from homebrew/core
brew install username/repo/vim       # installs from your custom repo

# 举个安装 Elasticsearch 的栗子
brew tap elastic/tap
brew install elastic/tap/elasticsearch-full
```

那么问题来了，如果第三方和 homebrew/core 的安装包名称重复了怎么办？这时候就需要看下下载优先级了。当你使用 `brew install` 这个命令时，brew 其实会将按照下面的顺序去查找哪个 formula(tap) 将被使用:

1. pinned taps
2. core formulae
3. other taps

因此，如果我们想优先下载第三方的同名包，必须先通过下面命令 `tap-pin` 去 pin 这个仓库:

```SHELL
brew tap-pin username/repo # pin 仓库
brew tap-unpin username/repo # unpin 仓库
```

## cURL & HTTPie

这里主要再介绍一下 [**HTTPie**](https://httpie.org)，引用官方的说法:

```SHELL
# 安装 brew install httpie
http [flags] [METHOD] URL [ITEM [ITEM]]
```

| Item Type   | Description |
| ------------ | ------- |
| HTTP Headers Name:Value | Arbitrary HTTP header, e.g. X-API-Token:123. |
| URL parameters name==value | Appends the given name/value pair as a query string parameter to the URL. The == separator is used. |
| Data Fields field=value, field=@file.txt | Request data fields to be serialized as a JSON object (default), or to be form-encoded (--form, -f). |
| Raw JSON fields field:=json, field:=@file.json | Useful when sending JSON and one or more fields need to be a Boolean, Number, nested Object, or an Array, e.g., meals:='["ham","spam"]' or pies:=[1,2,3] (note the quotes). |
| Form File Fields field@/dir/file | Only available with --form, -f. For example screenshot@~/Pictures/img.png. The presence of a file field results in a multipart/form-data request. |

> HTTPie is a command line HTTP client with an intuitive UI, JSON support, syntax highlighting, wget-like downloads, plugins, and more.

<style>
  /* 更改下图片最大高度 */
  .post-content img {
    max-height: 900px;
  }
</style>

![httpie](https://httpie.org/static/img/httpie2.png?v=1f6219a5a07bb6e99aa7afd98d0e67ec)

简单的运用一下，如果 JSON 数据存在不是字符串则用 **:=** 符号分隔:

```SHELL
# 省略 GET
http https://jsonplaceholder.typicode.com/posts/1
curl https://jsonplaceholder.typicode.com/posts/1 -i

# PUT
# Custom HTTP method, HTTP headers and JSON data
http PUT https://jsonplaceholder.typicode.com/posts/1 title=tate age:=100 X-API-Token:123

# 当然也支持下载文件 -d === --download
http -d www.example.com/my_file.zip

# localhost 的简写
http :4000
```

```SHELL
http PUT api.example.com/person/1 \
  name=John \
  age:=29 married:=false hobbies:='["http", "pies"]' \  # Raw JSON
  description=@about-john.txt \   # Embed text file
  bookmarks:=@bookmarks.json      # Embed JSON file
PUT /person/1 HTTP/1.1
Accept: application/json, */*
Content-Type: application/json
Host: api.example.com

{
  "age": 29,
  "hobbies": [
    "http",
    "pies"
  ],
  "description": "John is a nice guy who likes pies.",
  "married": false,
  "name": "John",
  "bookmarks": {
    "HTTPie": "http://httpie.org",
  }
}
```

再看看两者用法上的一些对比:

```SHELL
# cURL POST Example
curl -d "param1=value1&param2=value2" -H "Content-Type: application/json" -X POST http://localhost:3000/data

# HTTPie POST Example:
http POST http://localhost:3000/data 'param1=value1 value2' 'param2=value3'

# cURL GET Example:
curl -i -H "Accept: application/json" -X GET http://hostname/resource

# HTTPie GET Example:
http http://hostname/resource
```

## grep

**[grep](http://man.linuxde.net/grep)** 命令是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来，常用的参数如下:

* **-v** - 反向查找
* **-i** - 忽略大小写
* **-E** - 使用正则表达式

```SHELL
grep "match_pattern" file_name
# -v 反向查找
grep -v "match_pattern" file_name
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

**kill** 根据进程 PID 进行终止，该命令是通过向进程发送指定的信号来结束相应进程的，通过 `kill -l` 可以列出所有的信号。只有第 9 种信号(SIGKILL)才可以无条件终止进程，其他信号进程都有权利忽略。下面是常用的信号:

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

如果只查找当前目录，而不包括子目录的时候:

```SHELL
# -maxdepth 后的数字即使查找的目录层级
find . -name '*.sh' -maxdepth 1
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

**date** 用来显示或设置系统时间与日期，用法为 `<+时间日期格式>`，指定显示时使用的[日期时间格式](http://man.linuxde.net/date):

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

## scp

**scp** 命令用于在 linux 之间复制文件和目录，具体的参数说明[可以参考这里](https://www.runoob.com/linux/linux-comm-scp.html) 👈:

```SHELL
scp [可选参数] file_source file_target
```

```SHELL
# 从本地复制到远程, 如果是目录的话加 -r 参数
scp local_file remote_username@remote_ip:remote_file
scp /home/space/music/1.mp3 root@www.runoob.com:/home/root/others/music
```

> 使用 scp 命令要确保使用的用户具有可读取远程服务器相应文件的权限，否则 scp 命令是无法起作用的

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

> TIPS: 通过快捷键 `Ctrl+R` 可以更快搜索历史命令 👈

## 参考链接

1. [Linux 命令大全](http://man.linuxde.net/grep)
2. [Linux Shell 脚本攻略](http://man.linuxde.net/shell-script)
3. [yum 与 rpm、apt 的区别：rpm 的缺陷及 yum 的优势](http://www.aboutyun.com/thread-9226-1-1.html) By pig2
4. [Mount 挂载命令使用方法](https://blog.csdn.net/q1059081877q/article/details/48251893)
5. [HTTPie 官方文档](https://httpie.org/doc#examples)
6. [Why I chose HTTPie instead of cURL on the Command Line for HTTP APIs](https://extra-something.com/why-i-chose-httpie-instead-of-curl-on-the-command-line-for-http-apis/)

---
layout: blog
front: true
comments: True
flag: Shell
background: gray
category: 后端
title:  Shell 脚本编写
date:   2018-04-16 16:16:00 GMT+0800 (CST)
background-image: /style/images/smms/linux.webp
tags:
- Linux
- shell
---
# {{ page.title }}

## 什么是 Shell

**Shell** 既是一种命令语言，又是一种程序设计语言。作为命令语言，它交互式解释和执行用户输入的命令或者自动地解释和执行预先设定好的一连串的命令；作为程序设计语言，它定义了各种变量和参数，并提供了许多在高级语言中才具有的控制结构，包括循环和分支。**Shell 脚本(shell script)**，是一种为 shell 编写的脚本程序。

Linux 中 Shell 种类繁多，一般默认为 **bash(Bourne Again Shell)**，易用且免费。当执行 shell 脚本时，一定要确保脚本可执行:

```SHELL
# 添加执行权限
chmod +x shell.sh

# 当前目录下执行 shell 脚本
./shell.sh
sh shell.sh
```

## 变量声明

```SHELL
name='tate'
```

需要注意的是，变量名和等号之间**不能有空格**。同时，变量名的命名须遵循如下规则:

* 命名只能使用英文字母，数字和下划线，首个字符不能以数字开头
* 中间不能有空格，可以使用下划线 _
* 不能使用标点符号
* 不能使用 bash 里的关键字(可用 help 命令查看保留关键字)

使用变量时，只要在变量名前加美元符号 $ 即可:

```SHELL
echo $name
# 或者
echo ${name}
```

通过 **readonly** 关键字可以设置只读变量:

```SHELL
readonly name
```

通过 **unset** 关键字可以删除变量:

```SHELL
unset name
```

## 字符串 / 数组

Shell 里的字符串可以使用单引号，也可双引号，单引号字符串的限制:

* 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的
* 单引号字串中不能出现单引号(转义也无效)

因此一般建议使用双引号。获取字符串和提取子字符串的方法如下:

```SHELL
str="abcd"
echo ${#str} # 输出 4
```

```SHELL
str="welcome to our house"
echo ${str:1:4} # 输出 elco
```

bash 支持一维数组(不支持多维数组)，并且没有限定数组的大小:

```SHELL
数组名=(val1 val2 ... valn)
```

读取数组元素的值:

```SHELL
# 读取数组中该索引下的值
${数组名[n]}

# 读取数组中所有值，@ 等价于 *
${数组名[@/*]}
```

通过符号 **#** 获取数组的长度:

```SHELL
# 取得数组元素的个数
len=${#数组名[@]}
```

## 传递参数

在执行 Shell 脚本时，可以向脚本传递参数，脚本内获取参数的格式为: **$n**。n 代表第 n 个参数。**$@/$\***则代表所有参数，只是传递方式不一样。

```SHELL
./shell.sh 1 2 3
```

```SHELL
# shell.sh
echo "执行的文件名：$0" # 1
echo "第一个参数为：$1" # 2
echo "第二个参数为：$2" # 3
echo "参数个数为：$#" # 3
echo "传递的参数作为多个字符串显示：$@" # "1" "2" "3"
echo "传递的参数作为一个字符串显示：$*" # "1 2 3"
```

```SHELL
echo "-- \$@ 演示 ---"
for i in "$@"; do
  echo $i # "1" "2" "3"
done

echo "-- \$* 演示 ---"
for i in "$*"; do
  echo $i # "1 2 3"
done
```

## 运算符

原生 bash 不支持简单的数学运算，但是可以通过其他命令来实现，例如 **let** 和 **expr**。

### 算术运算符

| 算术运算符 | 描述 | 栗子(a=10,b=20) |
|:--------------|:---------|:---------|
| **+** | 加法 | `expr $a + $b` 结果为 30 |
| **-** | 减法 | `expr $a - $b` 结果为 -10 |
| **\*** | 乘法 | `expr $a \* $b` 结果为 200，注意乘号(*)必须转义 |
| **/** | 除法 | `expr $b / $a` 结果为 2 |
| **%** | 取余 | `expr $b % $a` 结果为 0 |
| **=** | 赋值 | a=$b 将把变量 b 的值赋给 a |
| **==** | 相等，用于比较两个数字，相同则返回 true | [ $a == $b ] 返回 false |
| **!=** | 不相等，用于比较两个数字，不相同则返回 true | [ $a != $b ] 返回 true |

> 条件表达式要放在方括号之间，并且要有空格，例如: [$a==$b] 是错误的，必须写成 **[ $a == $b ]**

### 关系运算符

| 关系运算符 | 英文对照 | 描述 | 栗子(a=10,b=20) |
|:--------------|:---------|:---------|:---------|
| **-eq** | equal to | 检测两个数是否相等，相等返回 true | [ $a -eq $b ] 返回 false |
| **-ne** | not equal to | 检测两个数是否相等，不相等返回 true | [ $a -ne $b ] 返回 true |
| **-gt** | greater than | 检测左边的数是否大于右边的，如果是，则返回 true | [ $a -gt $b ] 返回 false |
| **-lt** | less than | 检测左边的数是否小于右边的，如果是，则返回 true | [ $a -lt $b ] 返回 true |
| **-ge** | gt or eq | 检测左边的数是否大于等于右边的，如果是，则返回 true | [ $a -ge $b ] 返回 false |
| **-le** | lt or eq | 检测左边的数是否小于等于右边的，如果是，则返回 true | [ $a -le $b ] 返回 true |

### 布尔运算符

| 布尔运算符 | 描述 | 栗子(a=10,b=20) |
|:--------------|:---------|:---------|
| **!** | 非运算，表达式为 true 则返回 false，否则返回 true | [ ! false ] 返回 true |
| **-o** | 或运算，有一个表达式为 true 则返回 true | [ $a -lt 20 -o $b -gt 100 ] 返回 true |
| **-a** | 与运算，两个表达式都为 true 才返回 true | [ $a -lt 20 -a $b -gt 100 ] 返回 false |

### 逻辑运算符

| 逻辑运算符 | 描述 | 栗子(a=10,b=20) |
|:--------------|:---------|:---------|
| **&&** | 逻辑的 AND | [[ $a -lt 100 && $b -gt 100 ]] 返回 false |
| **\|\|** | 逻辑的 OR | [[ $a -lt 100 \|\| $b -gt 100 ]] 返回 true |

> 注意，使用逻辑运算符时必须使用 **[[ ... ]]** 条件判断结构

### 字符串运算符

| 字符串运算符 | 描述 | 栗子(a='abc',b='def') |
|:--------------|:---------|:---------|
| **=** | 检测两个字符串是否相等，相等返回 true | [ $a = $b ] 返回 false |
| **!=** | 检测两个字符串是否相等，不相等返回 true | [ $a != $b ] 返回 true |
| **-z** | 检测字符串长度是否为 0，为 0 返回 true | [ -z $a ] 返回 false |
| **-n** | 检测字符串长度是否为 0，不为 0 返回 true | [ -n $a ] 返回 true |
| **str** | 检测字符串是否为空，不为空返回 true | [ $a ] 返回 true |

### 文件测试运算符

| 文件测试运算符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **-d** file | 检测文件是否是目录，如果是，则返回 true | [ -d $file ] 返回 false |
| **-f** file | 检测文件是否是普通文件（既不是目录，也不是设备文件），如果是，则返回 true | [ -f $file ] 返回 true |
| **-r** file | 检测文件是否可读，如果是，则返回 true | [ -r $file ] 返回 true |
| **-w** file | 检测文件是否可写，如果是，则返回 true | [ -w $file ] 返回 true |
| **-x** file | 检测文件是否可执行，如果是，则返回 true | [ -x $file ] 返回 true |
| **-s** file | 检测文件是否为空(文件大小是否大于 0)，不为空返回 true | [ -s $file ] 返回 true |
| **-e** file | 检测文件(包括目录)是否存在，如果是，则返回 true | [ -e $file ] 返回 true |

#### let / (())

以下介绍三个相关的关键字或者符号:

* **let** - 用于执行一个或多个表达式，变量计算中不需要加上 $ 来表示变量
* **(())** - 常用于算术运算或比较，双括号中的变量可以不使用 $ 符号前缀
* **test** - 检查某个条件是否成立

let 与 expr 的比较:

```SHELL
val=`expr 2 + 2`

# 等价于
let val=2+2

# 等价于
((val=2+2))
```

三种条件比较的等价写法:

```SHELL
if [ $a == $b ]

# 等价于
if test $a == $b

# 等价于
if ((a==b))
```

## 流程控制

### if / else

```SHELL
if condition1
then
  command1
elif condition2
then
  command2
else
  commandN
fi
```

### for 循环

```SHELL
for var in item1 item2 ... itemN
do
  command1
  command2
  ...
  commandN
done
```

举个栗子 🌰:

```SHELL
for ((i=0;i<5;i++));do echo $i;done
```

### while

```SHELL
while condition
do
  command
done
```

举个栗子 🌰:

```SHELL
i=0
while ((i<=5))
do
  echo $i
  let i++ # 或者 ((i++))
done
```

### case

```SHELL
case 值 in
模式1)
  command1
  command2
  ...
  commandN
  ;;
模式2）
  command1
  command2
  ...
  commandN
  ;;
esac
```

## 重定向 >

这里只是做简单了解，一般情况下，每个 Unix/Linux 命令运行时都会打开三个文件:

* **标准输入文件(stdin)** - stdin 的文件描述符为 0，Unix 程序默认从 stdin 读取数据
* **标准输出文件(stdout)** - stdout 的文件描述符为 1，Unix 程序默认向 stdout 输出数据
* **标准错误文件(stderr)** - stderr 的文件描述符为 2，Unix 程序会向 stderr 流中写入错误信息

常用的重定向命令有:

| 命令 | 描述 |
|:--------------|:---------|
| command > file | 将输出重定向到 file |
| command < file | 将输入重定向到 file |
| command >> file | 将输出以追加的方式重定向到 file |
| n >& m | 将输出文件 m 和 n 合并 |
| n <& m | 将输入文件 m 和 n 合并 |

举个栗子，此时打开目标文件则会看到内容被替换为 "hello tate":

```SHELL
echo "hello tate" > test.txt
```

有个特殊的文件介绍下 `/dev/null`，写入到它的内容都会被丢弃，且无法读取。将命令的输出重定向到它，会起到"静止输出"的效果:

```SHELL
cd /data/www/h5 >& /dev/null
```

## 文件包含

Shell 支持外部脚本，只需要引入即可:

```SHELL
. filename

# 或
source filename
```

举个栗子 🌰:

```SHELL
# a.sh
name="tate"
```

```SHELL
# b.sh
. a.sh
echo $name
```

执行 b.sh 脚本时，便可以正确打印出 name 的值。

## 参考案例

```SHELL
reportletMnt="/home/tate/deploy/tmp/mnt"
if [ ! -d "$reportletMnt" ];then
  mkdir $reportletMnt
fi
mount -t cifs -o username=591550,password=Bestsfer20175 //10.88.1.8/test $reportletMnt
echo 'mount & cp reportlets.zip to tmp'

cp $reportletMnt/reportlets.zip ./deploy/tmp/
echo unzip reportlets.zip
cd ./deploy/tmp/
unzip reportlets.zip
rm -rf /home/webapp/fr-web/WEB-INF/reportlets/*
mv ./reportlets/* /home/webapp/fr-web/WEB-INF/reportlets/

echo move to upload dir
DATE=$(date +%Y%m%d)
mkdir /home/tate/deploy/$DATE
mv reportlets.zip /home/tate/deploy/$DATE/
umount /$reportletMnt
echo umount
```

## 参考链接

1. [菜鸟 - Shell 教程](http://www.runoob.com/linux/linux-shell.html)
2. [Linux Shell 脚本攻略](http://man.linuxde.net/shell-script)
3. [shell 中各种括号的作用详解 ()、(())、[]、[[]]、{}](http://www.jb51.net/article/123081.htm) By QuintinX

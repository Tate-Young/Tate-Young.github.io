---
layout: blog
front: true
comments: True
flag: Other
background: green
category: 前端
title: 记一些命令行工具
date:   2019-04-01 18:58:00 GMT+0800 (CST)
update: 2019-04-19 18:07:00 GMT+0800 (CST)
background-image: https://raw.githubusercontent.com/nvbn/thefuck/master/example.gif
tags:
- Other
---
# {{ page.title }}

## 命令行工具

| 命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| bat | 类似 cat，支持代码高亮 | `bat <filename>` |
| exa | 类似 ls，查看目录 | `exa --tree --level=1` |
| fd | 类似 find，查找文件 | `fd app` |
| tldr | 类似 man，help 文档 | `tldr git` |
| fx | 查看和操作 JSON | `fx package.json` |
| loc | 计算代码行数 | `loc` |
| thefuck | 智能纠正和执行命令 | `fuck` |
| fkill-cli | 杀死进程 | `fkill` |
| primitive | 转换成艺术图片 | `primitve -i products.png -o products-shape.svg -n 800` |
| figlet-cli | 基于 ASCII 字符组成的字符画，详见[此篇博客]({{site.url}}/2018/03/13/js-console.html#figlet) | `figlet -f 'Ghost' 'Tate'` |

### bat

[**bat**](https://github.com/sharkdp/bat) 类似于 `cat` 查看命令，但可以支持代码高亮:

![bat](https://camo.githubusercontent.com/9d3d89364f2cc83ace8f29646a6236bc15ea1da0/68747470733a2f2f696d6775722e636f6d2f724773646e44652e706e67)

### exa

[**exa**](https://the.exa.website) 比 `ls` 命令查看目录更优雅，还有另一个 [**lsd**](https://github.com/Peltoche/lsd)，这里就不介绍了:

![exa](https://raw.githubusercontent.com/ogham/exa/master/screenshots.png)

这里介绍下以树状结构展示目录:

```SHELL
$ exa --tree --level=1

├── app
│  ├── App.jsx
│  ├── common
│  ├── dataBoard
│  ├── layout
│  └── list
├── config.js
├── images
│  ├── 404-page.png
│  ├── home.png
│  └── loading.png
├── index.jsx
├── reducers.js
├── registerServiceWorker.js
├── request.js
├── sagas.js
├── store.js
├── utils.js
└── versionInfo.md
```

```SHELL
$ exa --tree --level=1 --long

drwxr-xr-x - tate 21 3 11:09  .
drwxr-xr-x - tate 26 3 16:15  ├── activity-admin.dotfashion.cn
drwxr-xr-x - tate 28 3 15:48  ├── app_h5
drwxr-xr-x - tate 28 2 18:52  ├── design-assistant-demo
drwxr-xr-x - tate  5 3 19:40  ├── romwe_m
drwxr-xr-x - tate  7 3 14:41  ├── romwe_w
drwxr-xr-x - tate  5 3 19:30  ├── shein_m
drwxr-xr-x - tate 15 3 10:57  ├── shein_pwa
drwxr-xr-x - tate  7 11  2018 ├── shein_sus_m
drwxr-xr-x - tate 26 3 12:03  ├── shein_w
drwxr-xr-x - tate  4 3 20:24  └── Tate-Young.github.io
```

### fd

[**fd**](https://github.com/sharkdp/fd) 可以代替 `find` 命令基于正则表达式查找文件或目录，查找速度更快:

![fd](https://github.com/sharkdp/fd/raw/master/doc/screencast.svg?sanitize=true)

```SHELL
$ fd webpack

webpack.config.js
webpack.server.js
webpack.ssr.js

$ fd 'webp*'

public/src/image/card_accept/ocean-webmoney.png
vueBuild/webpack.config.js
webpack.config.js
webpack.server.js
webpack.ssr.js
```

<!-- ### fzf

[**fzf**](https://github.com/junegunn/fzf) 可展示当前目录下所有文件列表，可以用键盘上下键或者鼠标点出来选择。可以用 `vim` 组合 `fzf` 来查找并打开目录下的文件:

```SHELL
vim $(fzf)
```

![vim-fzf](https://img30.360buyimg.com/devfe/jfs/t25372/5/461999989/83158/3ce44a5/5b6fc7f2Nd6432499.gif)

也可以使用在切换 `git` 分支的场景:

![git-fzf](https://img10.360buyimg.com/devfe/jfs/t23242/262/2000817850/127859/c0955478/5b6fce70N3c3573ae.gif) -->

### tldr

[**tldr**](https://tldr.sh) 是简化版的 **man** 命令:

```SHELL
$ tldr fuck

Corrects your previous console command.

- Set the `fuck` alias to `thefuck` tool:
    eval "$(thefuck --alias)"

- Try to match a rule for the previous command:
    fuck
```

### fx

[**fx**](https://github.com/antonmedv/fx) 是查看 `JSON` 的好帮手，支持的交互操作如下:

| Key | Command |
| ----- | ----- |
| q or Esc or Ctrl+c | Exit |
| e/E | Expand/Collapse all |
| g/G | Goto top/bottom |
| up/down or k/j | Move cursor up/down |
| left/right or h/l | Expand/Collapse |
| **.** | Edit filter |
| / | Search |
| n | Goto next found pattern |

![fx](https://camo.githubusercontent.com/b5df8c57792e443a18a56cd9a292b1a101ba2391/68747470733a2f2f6d6564762e696f2f6173736574732f66782e676966)

```SHELL
$ fx package.json

{
  "name": "xxx",
  "dependencies": {...},
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    }
  }
}
```

### loc

[**loc**](https://github.com/cgag/loc) 是用来计算代码行数的，还可以检测到所用的语言，比其他一些同类软件计算要快，比如 `cloc`、`tokei` 等。

```SHELL
$ loc
--------------------------------------------------------------------------------
 Language             Files        Lines        Blank      Comment         Code
--------------------------------------------------------------------------------
 Jsx                    110        16713         1054          282        15377
 JSON                     3        14380            0            0        14380
 JavaScript              81         6394          523         1019         4852
 Less                     7          836           98           18          720
 CSS                      1          543           72           14          457
 Markdown                 2          271           33            0          238
 HTML                     1           43            3           20           20
--------------------------------------------------------------------------------
 Total                  205        39180         1783         1353        36044
--------------------------------------------------------------------------------
```

### thefuck

[**thefuck**](https://github.com/nvbn/thefuck) 能够智能纠正你之前输入的命令:

![thefuck](https://raw.githubusercontent.com/nvbn/thefuck/master/example.gif)

举两个栗子 🌰:

```SHELL
$ git brnch
git: 'brnch' is not a git command. See 'git --help'.

Did you mean this?
  branch

$ fuck
git branch [enter/↑/↓/ctrl+c]
* master
```

```SHELL
$ git push
fatal: The current branch master has no upstream branch.
To push the current branch and set the remote as upstream, use

  git push --set-upstream origin master

$ fuck
git push --set-upstream origin master [enter/↑/↓/ctrl+c]
```

### fkill-cli

[**fkill-cli**](https://github.com/sindresorhus/fkill-cli) 可以杀死进程，支持跨平台:

```SHELL
# 安装
yga fkill-cli
```

```SHELL
$ fkill --help

  Usage
    $ fkill [<pid|name> …]

  Options
    --force -f    Force kill
    --verbose -v  Show process arguments
    --silent -s   Silently kill and always exit with code 0

  Examples
    $ fkill 1337
    $ fkill safari
    $ fkill :8080
    $ fkill 1337 safari :8080
    $ fkill

  To kill a port, prefix it with a colon. For example: :8080.

  Run without arguments to use the interactive interface. The process name is case insensitive.
```

![fkill](https://github.com/sindresorhus/fkill-cli/raw/master/screenshot.svg?sanitize=true)

### primitive

[**primitive**](https://github.com/fogleman/primitive) Recreate your photos with vector-based geometric primitives:

| Flag | Default | Description |
| i | n/a | input file |
| o | n/a | output file |
| n | n/a | number of shapes |
| m | 1 | mode: 0=combo, 1=triangle, 2=rect, 3=ellipse, 4=circle, 5=rotatedrect, 6=beziers, 7=rotatedellipse, 8=polygon |
| rep | 0 | add N extra shapes each iteration with reduced search (mostly good for beziers) |
| nth | 1 | save every Nth frame (only when %d is in output path) |
| r | 256 | resize large input images to this size before processing |
| s | 1024 | output image size |
| a | 128 | color alpha (use 0 to let the algorithm choose alpha for each shape) |
| bg | avg | starting background color (hex) |
| j | 0 | number of parallel workers (default uses all cores) |
| v | off | verbose output |
| vv | off | very verbose output |

```SHELL
primitve -i products.png -o products-shape.svg -n 800
```

这里再配合另一个库 [**svgo**](https://github.com/svg/svgo)  进行压缩:

```SHELL
svgo -i products-shape.svg -o products-shape.svg
```

![primitive](https://camo.githubusercontent.com/1bc275c484326bebabd07f33b4e02b1d20ea10fe/68747470733a2f2f7777772e6d69636861656c666f676c656d616e2e636f6d2f7374617469632f7072696d69746976652f6578616d706c65732f70656e63696c732e676966)

> 推荐一个 [**explainshell**](https://explainshell.com) 页面，可以解释一些命令行

![explainshell](https://user-gold-cdn.xitu.io/2019/1/23/1687a706e7c637ef?imageView2/0/w/1280/h/960/ignore-error/1)

## 命令行光标操作

| 快捷键 | 描述 |
|:--------------|:---------|
| Ctrl + A | 跳到行首 |
| Ctrl + E | 跳到行尾 |
| Ctrl + U | 删除整行 |
| Ctrl + K | 删除光标后的所有字符 |
| Opt + 点击 | 跳到当前点击的字符位置 |
| Opt + ←/→ | 跳到左/右的一个单词位置 |
| Fn + ←/→ | 跳到行首/尾，效果同 `Ctrl + A/E`，更方便 |
| Fn + Del | 删除光标后的单个字符，直接 Del 则删除光标前的单个字符 |

## 软件

| 软件 | 描述 |
|:--------------|:---------|
| [launchbar](https://www.obdev.at/products/launchbar/index.html) | 类似 Afred，高效率工具 |
| [IINA](https://github.com/iina/iina) | 视频播放器 |
| [Pap.er](http://paper.meiyuan.in) / [Unsplash](https://unsplash.com) | 高清壁纸 |
| [Snip](https://snip.qq.com) | 支持滚动截屏 |
| [Yoink](https://eternalstorms.at/yoink/mac/) | 文件中转 |
| [paste](https://pasteapp.me) | 剪切板工具 |
| [boom3d](https://www.globaldelight.com/boom/boom-ppc.php?utm_source=google&utm_medium=cpc&utm_campaign=Worldwide-Brand&gclid=Cj0KCQjw7YblBRDFARIsAKkK-dK06kvxpwChCrYM-KzdtGKcVhG-nOYVKP2orqwFaM-9TrL08r0Go08aAjxfEALw_wcB) | 音效增强 |
| [Downie3](https://software.charliemonroe.net/downie/) | 类似硕鼠，视频下载 |
| [magnetx](http://bt.xiandan.in) | 种子下载 |

## 参考链接

1. [优秀的命令行工具整理](https://juejin.im/post/5c3dcecef265da6163024b1c) By LeanCloud
2. [Fuzzy finder(fzf+vim) 使用全指南](https://keelii.com/2018/08/12/fuzzy-finder-full-guide/)

---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  console & FIGlet
date:   2018-03-13 15:27:00 GMT+0800 (CST)
update: 2019-04-01 14:35:00 GMT+0800 (CST)
background-image: https://misc.aotu.io/youing/20161122/1.png
tags:
- JavaScript
---
# {{ page.title }}

## 常用方法

**console** 对象可以输出各种信息用来调试程序，而且还提供了很多额外的方法供开发者调用。常用的方法有:

| 方法 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **log** | 打印信息，类似的有 debug、info | <code>console.log('Tate')</code> |
| **warn** | 打印警告信息，类似的有 error 打印错误信息 | <code>console.warn('warning!')</code> |
| **assert** | 断言 | <code>console.assert(1===2, '等式不成立')</code> |
| **dir** | 对一个对象进行检查(inspect)，并以易于阅读和打印的格式显示 | <code>console.dir(document.body)</code> |
| **table** | 以表格形式打印对象 | <code>console.table(object)</code> |
| **count** | 计数器 | <code>console.count('count_name')</code> |
| **time** | 计时，和 timeEnd 配合使用 | <code>console.time('link start')</code> |
| **group** | 分组，和 groupEnd 配合使用 | <code>console.group('my group')</code> |

### log

```JS
console.log('Tate & Snow');
// Tate & Snow
```

**log** 除了简单打印外，还可以格式化输出:

| 占位符 | 描述 |
|:--------------|:---------|
| %s | 字符串 |
| %d%i | 数字 |
| %f | 浮点数 |
| %o%O | object 对象 |
| %c | CSS 样式 |

```JS
console.log('打印的数字为 %d', 1);
// 打印的数字为 1

console.log('这是 %c Tate & Snow %c 的博客', 'color: orange', 'color: blue')
// 这是  [Tate & Snow](orange)  [的博客](blue)

// 打印图片，不支持设置 width 和 height，只能用 padding 拉伸。但浏览器可能不支持，比如 IE、safari
console.log('%c', 'background: url(https://i.loli.net/2018/03/13/5aa74f5b4c2c7.png) no-repeat;padding: 20px 219px;line-height: 166px');
```

![console.log.png](https://i.loli.net/2018/03/13/5aa75246de7c3.png)

> 关于 Tate 文字的打印可参考 [FIGlet](#figlet)，是基于 ASCII 字符组成的字符画。

### assert

**assert** 断言支持两个参数，前者为 false 才会打印第二个参数，否则为 undefined。

```JS
console.assert([1, 2].includes(3), '不包含');
// Assertion failed: 不包含
```

### dir

**dir** 对一个对象进行检查(inspect)，并以易于阅读和打印的格式显示。

```JS
console.log({name: 'tate', spause: 'snow'})
// Object {name: "tate", spause: "snow"}

console.dir({name: 'tate', spause: 'snow'})
// Object
//   name: "tate"
//   spause: "snow"
//   __proto__: Object
```

该方法对于输出 DOM 对象非常有用，因为会显示 DOM 对象的所有属性:

```JS
console.dir(document.body);
```

### table

**table** 将对象以表格形式打印。

```JS
var person = [
  { name: "Tate", age: 26 },
  { name: "Snow", age: 18 }
];

console.table(person);
```

在控制台输出的内容为 table:

| (index) | name | age |
|:--------------|:---------|:---------|
| 0 | "tate" | 26 |
| 1 | "snow" | 18 |

### count

**count** 计数器，可以查看调用执行多少次。

```JS
(function() {
  for (var i = 0; i < 2; i++) {
    console.count('count');
  }
})();
// count: 1
// count: 2
```

### time

**time** 和 **timeEnd** 两个方法用于计时，可以算出一个操作所花费的准确时间。

```JS
console.time("link start");

for (var i = 0; i <= 10000; i++){
    console.log(i);
}

console.timeEnd("link terminate");

// Array initialize: 149.35009765625ms
```

### group

**group** 和 **groupEnd** 两个方法用于分组，可以将之间包含的打印信息进行折叠查看。group 首次默认不折叠显示，**groupCollapsed** 首次默认折叠显示。

```JS
console.group('my group');
console.log(1);
console.log(2);
console.groupEnd()

// my group(可折叠，默认不折叠显示)
// 1
// 2
```

## 覆写 log 方法

如果想要实现覆写 <code>console.log</code> 方法，并且每次打印都在前面加上标签，可以参考下面这种写法:

```JS
console.log = ((log) => {
  let n = 0;
  return (str) => {
    log(`${n++}:${str}`)
  }
})(console.log)
```

## FIGlet

**[FIGlet](http://www.figlet.org/figlet_history.html)** 是基于 ASCII 字符组成的字符画。玩转 FIGlet 有以下几种方式:

* **vs code 插件**

vs code 可安装插件 VSC FIGlet，然后运行命令 vsc figlet 并输入要转换的字符，还可以选特定效果。

```TEXT
888888888888
     88              ,d
     88              88
     88 ,adPPYYba, MM88MMM ,adPPYba,
     88 ""     `Y8   88   a8P_____88
     88 ,adPPPPP88   88   8PP"""""""
     88 88,    ,88   88,  "8b,   ,aa
     88 `"8bbdP"Y8   "Y888 `"Ybbd8"'
```

* **npm 安装包**

使用 npm 安装 [figlet](https://www.npmjs.com/package/figlet)。

```JS
var figlet = require('figlet');

figlet('Hello World!!', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});
```

```TEXT
  _   _      _ _        __        __         _     _ _ _
 | | | | ___| | | ___   \ \      / /__  _ __| | __| | | |
 | |_| |/ _ \ | |/ _ \   \ \ /\ / / _ \| '__| |/ _` | | |
 |  _  |  __/ | | (_) |   \ V  V / (_) | |  | | (_| |_|_|
 |_| |_|\___|_|_|\___/     \_/\_/ \___/|_|  |_|\__,_(_|_)
```

或者通过命令行，可参考其 [github 项目](https://github.com/patorjk/figlet-cli) 👈:

```JS
// 安装 figlet-cli
npm install -g figlet-cli

// -f 参数使用字体，'Ghost' 为字体类型，比如有: Dancing Font、o8 等
figlet -f 'Ghost' 'Tate'
```

```TEXT
 .-') _      ('-.     .-') _     ('-.
(  OO) )    ( OO ).-.(  OO) )  _(  OO)
/     '._   / . --. //     '._(,------.
|'--...__)  | \-.  \ |'--...__)|  .---'
'--.  .--'.-'-'  |  |'--.  .--'|  |
   |  |    \| |_.'  |   |  |  (|  '--.
   |  |     |  .-.  |   |  |   |  .--'
   |  |     |  | |  |   |  |   |  `---.
   `--'     `--' `--'   `--'   `------'
```

再举个字体栗子 🌰，如果不知道有哪些字体的话，可以在 vscode 插件里查一下:

```JS
figlet -f 'Dancing Font' 'Snow'
```

```TEXT
 ____     _   _     U  ___ u
 / __"| u | \ |"|     \/"_ \/__        __
<\___ \/ <|  \| |>    | | | |\"\      /"/
 u___) | U| |\  |u.-,_| |_| |/\ \ /\ / /\
 |____/>> |_| \_|  \_)-\___/U  \ V  V /  U
  )(  (__)||   \\,-.    \\  .-,_\ /\ /_,-.
 (__)     (_")  (_/    (__)  \_)-'  '-(_/
```

* **在线网页**

在线 ASCII Art 转换网页地址，[参考这里](http://patorjk.com/software/taag/#p=display&f=Swamp%20Land&t=dfddf) 👈👈👈

除了文字，也可以由图片转成 ASCII，可参考网页 [picascii](http://picascii.com/)。

```TEXT
                             @+@.                                              #@;+@@@@#+
                             #@@.                         .::                 ;`@@`#@:@#.@                                        `
                 #@@@;@;     @@@.      :@@@             :@@#@'@              @#:@@@:##;@@;:                :@@#           ,++  @@#:
                ;`@@+@@+@  :@'@+@@   `@@@@+@:           @@#@@@.@             @ :++@  @:@ +'  #@@:#'@@`   +@@@#'@    ;#@@  @@@  +@@`
 .::+'@#@#@#@   #;@@`+`@@, ,#@+@@@   #:,@'@@@`         @@+@  .@@.            '@+:@@;         @@@@#@+@:  :@#@#@@@#   ;@@@  @+@. +@#
@@@@@#;@@@##@    ,@,  #@@; .:#@@+   ,#@@  @@@+         @@@;  ,@#,            ;#;;@@@@@@.     @#@@'@#@;  #;@@ #@#@    #+@  +@@: ;@@
@@@+@+#@@@+@@        @@@#.   @@:'   :@'+  ;@@#         @@@@+#'@#              @@:,#@@@+@@.   #@:@  @##. @#+@  @+@`   ' @` @@@: @;@
@@@@+@##@@,#+    ;;@+'@#@    @@#'   ,#::@@@@@+          #@#@@#@                ''@+@++#.'@#  '+@@  @@#` @#@#  ++@:   :@;# '@@+ @#@
    #.++#.     ,@:@@@@@@@    #@@@   `;@#@@@#@@          '@@#@#`  @@;`            :::'#@++:#  @@@@  @@+. @@@@  :; '    :@@`,@:@;@@@
    @+ @@:     +@@@  ;@@#    #@@#    @@;@`             @@@#@@++.@@+@                 @+++;.  @#@@  ###. :@@;  :@`:    #'@.:+@'+@+;
    @+  @.    .#@@   @@+@    @@@#    @@++  :@@.       #@+@ @#@@#@@+          +:#@':  ;,@#@+  @@@@  @@:.  ;@@;  +@'`   #@,.#'.###'#
    @@@+ :    :'@@  .@#@:    +@@@    +'@+  @+#:       #@@`  @@@+@@`          .@@@+;::@@@##@  @@@@  ;@@.  #@;@  @.;`   `#,@#; @##@@
    @;@@#+    `;@@@@+@@'`    +@@@    ;@@;  @#@.       +;++   ###@+:          +@:@@@#+@#@@``  @@@@  +#@   ++@@  @#@     '+@@# @;##+
    +@@@#@     ;@@@@@@@@     #@@@@+   @;@@@@@@        @#@@#@#@+@+@.+          #'@':#+@@@@.   #@+@  @;+.    :@#@@@@     #+@@@ .;@:+
    #@@@@@      `#@,:@@@      #:@@:   ;@@'#@@          @#++@@###@@@@#           +'@;:@@:     @@#@  #'@.   :@:#@@@      `@#@+  @@@:
    @@@@@@             ;       +@``    `@#+             :@#'.   .`....                       @@@@  ++@.     :+.         ;,.
    +#@@#@
    +@;#@#
```

## 参考链接

1. [alloyteam - 从 console.log 说起](http://www.alloyteam.com/2013/11/console-log/) By TAT.老教授
2. [console 对象](https://segmentfault.com/a/1190000004528137) By 从小就爱跺跺跺
3. [FIGlet 初识](https://aotu.io/notes/2016/11/22/figlet/) By 圆姑娘她爹
4. [ASCII Art 在线转换](http://patorjk.com/software/taag/#p=display&f=Swamp%20Land&t=dfddf)
5. [Picture To ASCII Convert](http://picascii.com/)

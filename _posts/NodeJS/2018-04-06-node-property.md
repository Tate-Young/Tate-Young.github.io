---
layout: blog
back: true
comments: True
flag: Node
background: gray
category: 后端
title:  Node 常用模块
date:   2018-04-08 10:54:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/19/5ad8a8e7dce53.jpg
tags:
- Node
---
# {{ page.title }}

## 本节涉及的常用模块

| Node 模块 | 描述 |
|:--------------|:---------|
| **[global](#global-对象)** | 全局对象 |
| **[path](#path-模块)** | 用于处理文件与目录的路径 |
| **[fs](#fs-模块)** | 对系统文件及目录进行读写操作 |

## global 对象

通过 global 对象可以设置全局变量，内置的常用全局变量有:

### __dirname / __filename

* **__dirname** - 当前模块的文件夹名称。等同于 __filename 的 path.dirname() 的值
* **__filename** - 当前模块的文件名称解析后的绝对路径

举个栗子，运行位于 /Users/mjr 目录下的 example.js 文件:

```JS
console.log(__dirname)
// Prints: /Users/mjr
console.log(path.dirname(__filename))
// Prints: /Users/mjr
console.log(__filename)
// Prints: /Users/mjr/example.js
```

### exports / module.exports

* **exports** - 对于 module.exports 的更简短的引用形式
* **module.exports** - 指定一个模块导出的内容

两者的区别如下:

* exports 是指向 module.exports 的引用
* module.exports 初始值为一个空对象 {}
* require() 返回的是 module.exports 而不是 exports

![module.exports](https://dn-cnode.qbox.me/FjN9jHWiy-yuUtghTUlRgB_0cgUC)

### process

process 进程有以下几个常用属性:

* **argv** - 包含命令行参数的数组
* **env** - 获取当前系统环境信息的对象
* **versions** - 返回一个对象，此对象列出了 Node 和其依赖的版本信息；**version** 则只返回 Node 版本号
* **platform** - 返回 Node 程运行其上的操作系统平台

```JS
// 执行 node index.js name='tate'
console.log(process.argv)
// ['/usr/local/Cellar/node/9.3.0_1/bin/node', '/Users/tate/testS/index.js', 'name=tate']
```

process.env 可以配合跨平台插件 **[cross-env](https://github.com/kentcdodds/cross-env)** 进行设置环境变量:

```JS
// 执行 cross-env ENV=dev node index.js
console.log(process.env.ENV)
// dev 可根据该变量确定是否为开发环境
```

process 进程有以下几个常用的方法:

* **cwd()** - 返回 Node 进程当前工作的目录
* **exit([code])** - 终止进程，可以接受一个参数，表示结束状态码，默认为 0，可以[参考状态码 exit code](http://nodejs.cn/api/process.html#process_process_exit_code)
* **nextTick(callback[, ...args])** - 将 callback 添加到 "next tick 队列"。一旦当前事件轮询队列的任务全部完成，在 next tick 队列中的所有 callbacks 会被依次调用，有关 Node 事件循环[可参考这里]( {{site.url}}/2018/04/21/node-event-loop.html )

执行 <code>process.exit()</code> 终止进程时或 Node 事件循环数组中不再有额外的工作，会触发 exit 事件:

```JS
// 'exit' 事件监听器的回调函数，只允许包含同步操作
process.on('exit', (code) => {
  console.log(`即将退出，退出码：${code}`);
});
```

## path 模块

```JS
const path = require('path');
```

**path** 用于处理文件与目录的路径，常用的属性及方法有:

* **basename(p, [ext])** - 返回 path 的文件名，提取出用 ‘/' 隔开的 path 的最后一部分
* **dirname(p)** - 返回 path 的目录名
* **extname(p)** - 返回 path 的扩展名
* **join([p1], [p2], [...])** - 将多个参数拼接成一个 path，拼接时会执行 normalize 方法
* **normalize(p)** - 会规范化给定的 path，并解析 '..' 和 '.' 片段
* **format()** - 从一个对象返回一个路径字符串，与 parse() 相反，对象包含 dir/root/base/name/ext 几个属性
* **parse()** - 返回一个对象，对象的属性表示 path 的元素
* **sep** - 路径片段分隔符，常用的是通过 <code>split(path.sep)</code> 分割成数组

示例如下:

### basename

basename(p, [ext])，参数 p 是要处理的 path，可选参数 ext 是要过滤的字符:

```JS
path.basename('/foo/bar/baz/asdf/quux.html'); // 返回: 'quux.html'
path.basename('/foo/bar/baz/asdf/quux.html', '.html'); // 返回: 'quux'
```

```JS
path.dirname('/foo/bar/baz/asdf/quux'); // 返回: '/foo/bar/baz/asdf'
path.extname('index.coffee.md'); // 返回: '.md'
```

### join / normalize

join([p1], [p2], [...]) 将多个参数拼接成一个 path，拼接时会执行 normalize 方法:

```JS
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'); // 返回: '/foo/bar/baz/asdf'

path.normalize('/foo/bar//baz/asdf/quux/..'); // 返回: '/foo/bar/baz/asdf'
```

### format / parse

```JS
path.format({
  root: '/ignored', // 忽略
  dir: '/home/user/dir',
  base: 'file.txt'
});
// 返回: '/home/user/dir/file.txt'
```

```JS
path.parse('/home/user/dir/file.txt');
// 返回:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

```TXT
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

### sep

sep 表示路径片段分隔符，windows 为 \，macOS 为 /:

```JS
'foo/bar/baz'.split(path.sep); // 返回: ['foo', 'bar', 'baz']
```

## fs 模块

```JS
const fs = require('fs');
```

**fs** 对系统文件及目录进行读写操作，常用的属性及方法有:

* **open**(path, flags[, mode], callback) - 打开文件
* **read**(fd, buffer, offset, length, position, callback) - 读取文件，会将文件内容读取 buffer 对象中
* **write**(fd, buffer, offset, length[, position], callback - 写入文件
* **close**(fd, callback) - 关闭文件

以上是基于底层的操作，更便捷的文件操作如下，不用打开和关闭文件:

* **readFile**(file[, options], callback) - 读取文件，读取文件流 createReadStream
* **writeFile**(file, data[, options], callback) - 写入文件，写入文件流 createWriteStream
* **appendFile**(filename, data, [options], callback) - 追加文件，若文件不存在则创建
* **access**(path, callback) - 代替 exists，判断文件是否存在，还可以用来判断文件的权限
* **unlink**(path, callback) - 删除文件
* **rename**(oldPath, newPath, callback) - 重命名文件
* **stat**(path, callback(err, stats)) - 文件信息，会将 stats 类的实例返回给其回调函数。可通过 stats 类中的提供方法判断文件的相关属性
* **watch**(filename[, options][, listener]) - 监视 filename 的变化，filename 可以是一个文件或一个目录。返回一个 fs.FSWatcher 对象

目录操作有如下方法:

* **mkdir**(path[, mode], callback) - 创建目录
* **rmdir**(path, callback) - 删除目录
* **readdir**(path[, options], callback) - 读取目录

以上皆为异步方法，同步方法为 "方法名 + Sync"，一般情况下不建议使用。示例如下:

### open / close

open(path, flags[, mode], callback) 中 flags 的取值有:

| flags | 描述 |
|:--------------|:---------|
| r | 以读取模式打开文件。如果文件不存在抛出异常 |
| r+ | 以读写模式打开文件。如果文件不存在抛出异常 |
| rs | 以同步的方式读取文件 |
| rs+ | 以同步的方式读取和写入文件 |
| w | 以写入模式打开文件，如果文件不存在则创建 |
| wx | 类似 'w'，但是如果文件路径存在，则文件写入失败 |
| w+ | 以读写模式打开文件，如果文件不存在则创建 |
| wx+ | 类似 'w+'， 但是如果文件路径存在，则文件读写失败 |
| a | 以追加模式打开文件，如果文件不存在则创建 |
| ax | 类似 'a'， 但是如果文件路径存在，则文件追加失败 |
| a+ | 以读取追加模式打开文件，如果文件不存在则创建 |
| ax+ | 类似 'a+'， 但是如果文件路径存在，则文件读取追加失败 |

```JS
fs.open('input.txt', 'r+', function(err, fd) {
  if (err) {
    /* handle error */
  } else {
    fs.close(fd, function(err){
      if (err){ console.log(err) }
      console.log("文件关闭成功")
    })
  }
})
```

### readFile / createFileStream

readFile(file[, options], callback) 用于读取文件，options 该参数是一个对象，包含 {encoding, flag}:

```JS
fs.readFile(filename, 'utf8', function(err, data){
  if(err){
    console.log('文件读取失败');
  }else{
    // console.log(data); // 若没设置编码方式，则默认为 buffer 类型: <Buffer 54 61 74 65 20 26 20 53 6e 6f 77 0a>
    console.log(data.toString()); // 'Tate & Snow'
  }
});
```

对于大的文件，可采用文件流进行操作，如方法 **createReadStream** 和 **createWriteStream**:

```JS
var readStream = fs.createReadStream('input.txt', 'utf8');

readStream
  .on('data', function(chunk) {
    console.log('读取数据: ' + chunk);
  })
  .on('error', function(err){
    console.log('抛出异常: ' + err.message);
  })
  .on('end', function(){ // 数据传输完毕
    console.log('end');
  })
  .on('close', function(){ // 已经关闭，不会再有事件抛出
    console.log('已经关闭');
  });
```

```JS
var writeStream = fs.createWriteStream('input.txt', 'utf8');

writeStream
  .on('close', function(){  // 已经关闭，不会再有事件抛出
    console.log('已经关闭');
  });

writeStream.write('hello');
writeStream.write('world');
writeStream.end('');
```

### stat

stat(path, callback) 查看文件信息，会将 stats 类的实例返回给其回调函数。stats 类的方法有:

* **isFile()** - 如果是文件返回 true，否则返回 false
* **isDirectory()** - 如果是目录返回 true，否则返回 false
* **isBlockDevice()** - 如果是块设备返回 true，否则返回 false
* **isCharacterDevice()** - 如果是字符设备返回 true，否则返回 false
* **isSymbolicLink()** - 如果是软链接返回 true，否则返回 false
* **isFIFO()** - 如果是 FIFO，返回 true，否则返回 false。FIFO 是 UNIX 中的一种特殊类型的命令管道
* **isSocket()** - 如果是 Socket 返回 true，否则返回 false

### 遍历目录

使用 fs 模块遍历目录的同步和异步写法:

```JS
// 同步写法
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function(file) {
    var pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}
```

```JS
// 异步写法
function travel(dir, callback, finish) {
  fs.readdir(dir, function(err, files) {
    (function next(i) {
      if (i < files.length) {
        var pathname = path.join(dir, files[i]);

        fs.stat(pathname, function(err, stats) {
          if (stats.isDirectory()) {
            travel(pathname, callback, function() {
              next(i + 1);
            });
          } else {
            callback(pathname, function () {
              next(i + 1);
            });
          }
        });
      } else {
        finish && finish();
      }
    }(0));
  });
}
```

## 参考链接

1. [nodeJS 之 fs 文件系统](https://www.cnblogs.com/xiaohuochai/p/6938104.html) By 小火柴的蓝色理想
2. [七天学会 NodeJS](http://nqdeng.github.io/7-days-nodejs/#3.2.4)
3. [nodejs-learning-guide](https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/fs.md) By chyingp
4. [5 分钟让你明白“软链接”和“硬链接”的区别](https://www.jianshu.com/p/dde6a01c4094) By Cyandev
5. [exports 和 module.exports 的区别](https://cnodejs.org/topic/5231a630101e574521e45ef8) By nswbmw
6. [module.exports 与 exports 的区别解释【极简版】这还看不懂就没救了。。。](https://cnodejs.org/topic/5734017ac3e4ef7657ab1215) By lellansin
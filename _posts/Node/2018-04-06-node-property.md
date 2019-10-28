---
layout: blog
front: true
comments: True
flag: Node
background: gray
category: 后端
title:  Node 常用模块
date:   2018-04-08 10:54:00 GMT+0800 (CST)
update: 2019-10-28 11:17:00 GMT+0800 (CST)
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
* **resolve** - 把一个路径或路径片段的序列解析为一个绝对路径，如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上
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

### join / resolve

join([p1], [p2], [...]) 将多个参数拼接成一个 path，拼接时会执行 normalize 方法:

```JS
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'); // 返回: '/foo/bar/baz/asdf'

path.normalize('/foo/bar//baz/asdf/quux/..'); // 返回: '/foo/bar/baz/asdf'
```

resolve() 把一个路径或路径片段的序列解析为一个绝对路径，方向为从右向左，如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上:

```JS
path.resolve('/foo', '/bar', 'baz'); // 'bar/baz' 从右到左解析，直到有完整的绝对路径为止

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录为 /home/myself/node
// 由于未生成一个绝对路径，则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
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
    fs.close(fd, function(err) {
      if (err){ console.log(err) }
      console.log("文件关闭成功")
    })
  }
})
```

### readFile / createFileStream

readFile(file[, options], callback) 用于读取文件，options 该参数是一个对象，包含 {encoding, flag}:

```JS
fs.readFile(filename, 'utf8', function(err, data) {
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
  .on('error', function(err) {
    console.log('抛出异常: ' + err.message);
  })
  .on('end', function() { // 数据传输完毕
    console.log('end');
  })
  .on('close', function() { // 已经关闭，不会再有事件抛出
    console.log('已经关闭');
  });
```

```JS
var writeStream = fs.createWriteStream('input.txt', 'utf8');

writeStream
  .on('close', function() {  // 已经关闭，不会再有事件抛出
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

## 流 stream

**流**是数据的集合，类似于数组或字符串。区别在于流中的数据可能不会同时全部可用，并且不用 全部放入内存。这使得流在操作大量数据或是数据从外部来源逐段发送过来的时候变得非常有用。然而，流的作用并不仅限于操作大量数据，它还带给我们组合代码的能力。就像我们可以通过管道连接几个简单的 Linux 命令以组合出强大的功能一样，我们可以利用流在 Node 中做同样的事:

```JS
a.pipe(b).pipe(c).pipe(d)

// 等价于:
a.pipe(b)
b.pipe(c)
c.pipe(d)

// 在 Linux 中，等价于：
a | b | c | d
```

在 Node 中有四种基本类型的流，所有的流都是 **EventEmitter** 的实例，它们发出可用于读取或写入数据的事件。另一方面我们可以利用 **pipe** 方法以一种更简单的方式使用流中的数据:

* **可读流** - 对一个可以读取数据的源的抽象。如 `fs.createReadStream`
* **可写流** - 对一个可以写入数据的目标的抽象。如 `fs.createWriteStream`
* **双向流** - 既是可读的，又是可写的。如 TCP socket
* **变换流** - 一种特殊的双向流，它会基于写入的数据生成可供读取的数据。如使用 `zlib.createGzip` 来压缩数据。你可以把一个变换流想象成一个函数，这个函数的输入部分对应可写流，输出部分对应可读流

![eventemitter](https://cdn-media-1.freecodecamp.org/images/1*HGXpeiF5-hJrOk_8tT2jFA.png)

```JS
// 使用事件来模拟 pipe 读取、写入数据
// readable.pipe(writable)

readable.on('data', (chunk) => {
  writable.write(chunk);
});

readable.on('end', () => {
  writable.end();
});
```

我们对数据流的具体使用举个栗子，先通过 fs 模块使用流接口读取和写入比较大的文件:

```JS
const fs = require('fs');
const file = fs.createWriteStream('./big.file');

for(let i=0; i<= 1e6; i++) {
  file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n');
}

file.end();
```

然后我们在服务端收到请求后，通过异步方法 `fs.readFile` 读取文件内容发送给客户端:

```JS
const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  fs.readFile('./big.file', (err, data) => {
    if (err) throw err;

    res.end(data);
  });
});

server.listen(8000);
```

当我们在客户端请求时，会发现此刻服务器内存暴增，非常低效。HTTP 响应对象也是一个可写流，这意味着如果我们有一个代表了 `big.file` 内容的可读流，就可以将两个流连接起来以实现相同的功能，并且性能上更优:

```JS
const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  const src = fs.createReadStream('./big.file');
  src.pipe(res);
});

server.listen(8000);
```

> 我们还可以通过 **stream** 模块来自定义流接口。更多关于流的分析，请[参考这篇文章](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/) 👈

## 参考链接

1. [nodeJS 之 fs 文件系统](https://www.cnblogs.com/xiaohuochai/p/6938104.html) By 小火柴的蓝色理想
2. [七天学会 NodeJS](http://nqdeng.github.io/7-days-nodejs/#3.2.4)
3. [nodejs-learning-guide](https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/fs.md) By chyingp
4. [5 分钟让你明白“软链接”和“硬链接”的区别](https://www.jianshu.com/p/dde6a01c4094) By Cyandev
5. [exports 和 module.exports 的区别](https://cnodejs.org/topic/5231a630101e574521e45ef8) By nswbmw
6. [module.exports 与 exports 的区别解释【极简版】这还看不懂就没救了。。。](https://cnodejs.org/topic/5734017ac3e4ef7657ab1215) By lellansin
7. [Node.js Streams: Everything you need to know](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/) By Samer Buna

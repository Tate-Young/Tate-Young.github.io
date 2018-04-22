---
layout: blog
back: true
comments: True
flag: Node
background: gray
category: 后端
title:  Node 常用库
date:   2018-04-22 15:14:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/19/5ad8a8e7dce53.jpg
tags:
- Node
---
# {{ page.title }}

## 常用库统计

本文主要收集 Node 中好用的库，也有包含 Express 框架的中间件等，没有局限性:

| Node | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **[cheerio](https://github.com/cheeriojs/cheerio)** | 以 jQuery 为核心，解析和操作 DOM 模型，如实现网络爬虫 | <code>require('cheerio')</code> |
| **[request](https://github.com/request/request)** | 精简的 HTTP 请求客户端 | <code>require('request')</code> |
| **[marked](https://github.com/markedjs/marked)** | 转换 Markdown 为 Html 显示 | <code>require('marked')</code> |
| **[chalk](https://github.com/chalk/chalk)** | 修改终端输出信息的样式 | <code>require('chalk')</code> |
| **[shelljs](https://github.com/shelljs/shelljs)** | 执行 shell 命令 | <code>require('shelljs')</code> |

| Express | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **[express-session](https://github.com/expressjs/session)** | session 中间件 | <code>require('express-session')</code> |
| **[connect-mongo](https://github.com/jdesboeufs/connect-mongo)** | 通过 Mongodb 存储 session，基于 express-session | <code>require('connect-mongo')(session)</code> |
| **[connect-flash](https://github.com/jaredhanson/connect-flash)** | 页面通知中间件，基于 session 实现 | <code>require('connect-flash')</code> |
| **[express-formidable](https://github.com/utatti/express-formidable)** | Formidable 中间件，解析表单数据 | <code>require('express-formidable')</code> |

## Node 第三方库

### cheerio

**cheerio** 以 jQuery 为核心，可以解析和操作 DOM 模型，如实现网络爬虫，可以[参考这里的实现](http://www.cnblogs.com/xiaohuochai/p/6960738.html)。

```JS
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')

$('h2.title').text('Hello there!')
$('h2').addClass('welcome')

$.html() // => <h2 class="title welcome">Hello there!</h2>
```

### request

**request** 是一个精简的 HTTP 客户端，支持 HTTPS 协议和重定向。

```JS
const request = require('request');
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
```

任何响应都可以输出到文件流:

```JS
request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'))
```

```JS
http.createServer(function (req, resp) {
  if (req.url === '/doodle.png') {
    if (req.method === 'PUT') {
      req.pipe(request.put('http://mysite.com/doodle.png'))
    } else if (req.method === 'GET' || req.method === 'HEAD') {
      request.get('http://mysite.com/doodle.png').pipe(resp)
    }
  }
})
```

举个 post 请求提交 formData 的栗子:

```JS
request.post({url:'http://service.com/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
});
```

### marked

**marked** 可以将 Markdown 语法转换为 html 并显示。

```JS
 document.getElementById('content').innerHTML =
      marked('# Marked in the browser\n\nRendered by **marked**.');
```

### chalk

**chalk** 可以修改终端输出信息的样式:

```JS
chalk.<style>[.<style>...](string, [string...])
```

![chalk](https://camo.githubusercontent.com/71d70de9a74293b29dbbcca7ac6cd309948a0f3e/68747470733a2f2f63646e2e7261776769742e636f6d2f6368616c6b2f616e73692d7374796c65732f383236313639376339356266333462366337373637653263626539393431613835316435393338352f73637265656e73686f742e737667)

```JS
const chalk = require('chalk');
const log = console.log;

// Combine styled and normal strings
log(chalk.blue('Hello') + ' World' + chalk.red('!'));

// Compose multiple styles using the chainable API
log(chalk.blue.bgRed.bold('Hello world!'));

// Pass in multiple arguments
log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

// Nest styles
log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
```

除了内置的颜色 API 以外，还支持其他颜色自定义的 API，常用的有:

* **rgb** - Example: chalk.rgb(255, 136, 0).bold('Orange!')
* **hex** - Example: chalk.hex('#FF8800').bold('Orange!')
* **keyword** (CSS keywords) - Example: chalk.keyword('orange').bold('Orange!')
* **hsl** - Example: chalk.hsl(32, 100, 50).bold('Orange!')

### shelljs

**shelljs** 可以在 Node 中调用 shell 命令。

```JS
var shell = require('shelljs');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1); // Exits the current process with the given exit code.
}

// Copy files to release dir
shell.rm('-rf', 'out/Release');
shell.cp('-R', 'stuff/', 'out/Release');

// Replace macros in each .js file
// sed([options,] search_regex, replacement, file [, file ...])
// or sed([options,] search_regex, replacement, file_array)

shell.cd('lib');
shell.ls('*.js').forEach(function (file) {
  shell.sed('-i', 'BUILD_VERSION', 'v0.1.2', file);
  shell.sed('-i', /^.*REMOVE_THIS_LINE.*$/, '', file);
  shell.sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, shell.cat('macro.js'), file);
});
shell.cd('..');

// Run external tool synchronously
if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}
```

## Express 中间件

### express-session

**express-session** 用来操作 session，保存会话信息，常用于登录注册、购物车等。

```JS
// session 中间件
app.use(session({
  name: config.session.key, // 设置保存 session id 的 cookie 名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: { // 默认值 { path: '/', httpOnly: true, secure: false, maxAge: null }
    maxAge: config.session.maxAge
  },
  store: new MongoStore({ // 将 session 存储到 mongodb
    url: config.mongodb // mongodb 地址
  })
}))
```

可以通过 **req.session** 来访问或存储 session:

```JS
// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// Access the session as req.session
app.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})
```

req.session 还有其他几个属性和方法:

* **id** - session id，与 session 唯一绑定，也可通过 <code>req.sessionID</code> 访问，不可修改
* **cookie** - 访问 session id 绑定的 cookie 信息
* **regenerate()** - 重新生成一个 session
* **destroy()** - 销毁一个 session
* **reload()** - 刷新一个 session
* **save()** - 保存一个 session，一般在 session 改变后自动调用，而不用手动去执行

### connect-mongo

**connect-mongo** 是基于 express-session 实现的，可以通过 Mongodb 来存储 session。

```JS
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'tate',
  store: new MongoStore(options)
}));
```

options 可以创建一个新的连接，也可以复用现成的连接:

```JS
// 复用现成的连接
const mongoose = require('mongoose');

// Basic usage
mongoose.connect(connectionOptions);

app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Advanced usage
const connection = mongoose.createConnection(connectionOptions);

app.use(session({
  store: new MongoStore({ mongooseConnection: connection })
}));
```

```JS
// 创建一个新的连接
app.use(session({
  store: new MongoStore({
    url: 'mongodb://localhost/test-app',
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default 设置 session 过期时间
  })
}));
```

### connect-flash

**connect-flash** 是基于 session 实现的信息通知中间件，必须在设置 session 后再运行。

```JS
const flash = require('connect-flash')

// flash 中间件，用来显示通知
app.use(flash())
```

可以通过 **req.flash()** 来设置通知:

```JS
app.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  res.redirect('/');
});

app.get('/', function(req, res){
  // Get an array of flash messages by passing the key to req.flash()
  res.render('index', { messages: req.flash('info') });
});
```

### express-formidable

**express-formidable** 是 Express 与 **[Formidable](https://github.com/felixge/node-formidable)** 的桥梁，用来解析表单数据。

```JS
const express = require('express');
const formidable = require('express-formidable');

var app = express();

app.use(formidable(opts));

app.post('/upload', (req, res) => {
  req.fields; // contains non-file fields
  req.files; // contains files
});
```

这里的 opts 可以参考 Formidable API，以下列出常用的几个:

* **encoding** - 设置编码形式
* **uploadDir** - 设置需要上传文件的存放路径，默认是 <code>os.tmpdir()</code>
* **keepExtensions** - 布尔类型，是否保持原始文件的后缀名
* **multiples** - 布尔类型，设置 true 时，当调用 form.parse，files 参数会包含上传文件的数组

```JS
app.use(formidable({
  encoding: 'utf-8',
  uploadDir: '/my/dir',
  multiples: true, // req.files to be arrays of files
});
```

## 参考链接

1. [N-Blog](https://github.com/nswbmw/N-blog/blob/master/book/4.2%20%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C.md) By nswbmw
1. [nodeJS 实现简单网页爬虫功能](http://www.cnblogs.com/xiaohuochai/p/6960738.html) By 小火柴的蓝色理想
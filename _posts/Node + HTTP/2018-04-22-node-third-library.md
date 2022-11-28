---
layout: blog
front: true
comments: True
flag: Node
background: gray
category: 后端
title:  Node 常用库
date:   2018-04-22 15:14:00 GMT+0800 (CST)
background-image: /style/images/smms/node.webp
tags:
- Node
---
# {{ page.title }}

## 常用库统计

本文主要收集 Node 中好用的库，也有包含 Express 框架的中间件等，没有局限性:

| Node | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **[cheerio](https://github.com/cheeriojs/cheerio)** | 以 jQuery 为核心，解析和操作 DOM 模型，如实现网络爬虫 | `require('cheerio')` |
| **[request](https://github.com/request/request)** | 精简的 HTTP 请求客户端 | `require('request')` |
| **[marked](https://github.com/markedjs/marked)** | 转换 Markdown 为 Html 显示 | `require('marked')` |
| **[chalk](https://github.com/chalk/chalk)** | 修改终端输出信息的样式 | `require('chalk')` |
| **[shelljs](https://github.com/shelljs/shelljs)** | 执行 shell 命令 | `require('shelljs')` |
| **[async](https://github.com/caolan/async)** | Async utilities | `require('async')` |

| Express | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **[express-session](https://github.com/expressjs/session)** | session 中间件 | `require('express-session')` |
| **[connect-mongo](https://github.com/jdesboeufs/connect-mongo)** | 通过 Mongodb 存储 session，基于 express-session | `require('connect-mongo')(session)` |
| **[connect-flash](https://github.com/jaredhanson/connect-flash)** | 页面通知中间件，基于 session 实现 | `require('connect-flash')` |
| **[express-formidable](https://github.com/utatti/express-formidable)** | Formidable 中间件，解析表单数据 | `require('express-formidable')` |
| **[express-ejs-layouts](https://github.com/Soarez/express-ejs-layouts)** | Layout support for ejs | `require('express-ejs-layouts')` |
| **[cookie-parser](https://github.com/expressjs/cookie-parser)** | 解析 cookie，通过 `req.cookies` 访问 | `require('cookie-parser')` |
| **[body-parser](https://github.com/expressjs/body-parser)** | 解析 POST 请求的请求体，通过 `req.body` 访问 | `require('body-parser')` |
| **[compression](https://github.com/expressjs/compression)** | 会尝试压缩所有经过此中间件的响应体 | `require('compression')` |

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
request.post({url:'http://service.com/upload', formData: formData}, optionalCallback);

function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
};
```

### marked

**marked** 可以将 Markdown 语法转换为 html 并显示。

```JS
document.getElementById('content').innerHTML = marked('# Marked in the browser\n\nRendered by **marked**.');
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

> 现在 google 又出了个 [zx](https://github.com/google/zx) 👈

### async

**async** 库的所有方法可以从[官方这里查看](https://caolan.github.io/async/docs.html#auto)，这里介绍三个比较常用的方法:

* waterfall - 异步执行
* parallel - 同步执行
* auto - 可同步可异步

1、waterfall

Runs the tasks array of functions in series, each passing their results to the next in the array. However, if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the error.

```JS
import waterfall from 'async/waterfall';

async.waterfall([
  myFirstFunction,
  mySecondFunction,
  myLastFunction,
], function (err, result) {
  // result now equals 'done'
});
function myFirstFunction (callback) {
  callback(null, 'one', 'two');
}
function mySecondFunction (arg1, arg2, callback) {
  // arg1 now equals 'one' and arg2 now equals 'two'
  callback(null, 'three');
}
function myLastFunction (arg1, callback) {
  // arg1 now equals 'three'
  callback(null, 'done');
}
```

2、parallel

Run the tasks collection of functions in parallel, without waiting until the previous function has completed. If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error. Once the tasks have completed, the results are passed to the final callback as an array

```JS
import parallel from 'async/parallel';

async.parallel([
  function (callback) {
    setTimeout(function() {
      callback(null, 'one');
    }, 200);
  },
  function (callback) {
    setTimeout(function() {
      callback(null, 'two');
    }, 100);
  }
],
// optional callback
function(err, results) {
    // the results array will equal ['one','two'] even though the second function had a shorter timeout.
});

// an example using an object instead of an array
async.parallel({
  one: function (callback) {
    setTimeout(function() {
      callback(null, 1);
    }, 200);
  },
  two: function (callback) {
    setTimeout(function() {
      callback(null, 2);
    }, 100);
  }
}, function (err, results) {
  // results is now equals to: {one: 1, two: 2}
});
```

3、auto

能够同时满足上面两种需求:

```JS
import auto from 'async/auto';

async.auto({
  get_data: function(callback) {
    console.log('in get_data');
    // async code to get some data
    callback(null, 'data', 'converted to array');
  },
  make_folder: function(callback) {
    console.log('in make_folder');
    // async code to create a directory to store a file in,this is run at the same time as getting the data
    callback(null, 'folder');
  },
  write_file: ['get_data', 'make_folder', function(results, callback) {
    console.log('in write_file', JSON.stringify(results));
    // once there is some data and the directory exists,write the data to a file in the directory
    callback(null, 'filename');
  }],
  email_link: ['write_file', function(results, callback) {
    console.log('in email_link', JSON.stringify(results));
    // once the file is written let's email a link to it...,results.write_file contains the filename returned by write_file.
    callback(null, {'file':results.write_file, 'email':'user@example.com'});
  }]
}, function(err, results) {
  console.log('err = ', err);
  console.log('results = ', results);
});
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
app.get('/', function (req, res, next) {
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

* **id** - session id，与 session 唯一绑定，也可通过 `req.sessionID` 访问，不可修改
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
app.get('/flash', function (req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  res.redirect('/');
})

app.get('/', function (req, res) {
  // Get an array of flash messages by passing the key to req.flash()
  res.render('index', { messages: req.flash('info') });
})
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
* **uploadDir** - 设置需要上传文件的存放路径，默认是 `os.tmpdir()`
* **keepExtensions** - 布尔类型，是否保持原始文件的后缀名
* **multiples** - 布尔类型，设置 true 时，当调用 form.parse，files 参数会包含上传文件的数组

```JS
app.use(formidable({
  encoding: 'utf-8',
  uploadDir: '/my/dir',
  multiples: true, // req.files to be arrays of files
});
```

### express-ejs-layouts

引用官方 demo:

```JS
var expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.get('/', function (req, res) {
  res.locals = {
    title: 'expressLayouts',
    message: 'Tate & Snow'
  };
  res.render('view');
});
```

```HTML
<!-- layout.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%= title %></title>

  <% /* Place any styles in the page in this section. */ %>
  <%- style %>
</head>
<body>
  <header>
    <% /*
    Define an required placeholder for the header.
    If a page doesn't define a header, there will be an error when rendering.
    */ %>
    <%- header %>
  </header>

  <%- body %>

  <footer>
    <% /*
    Define an optional placeholder for the footer.
    If a page doesn't define a footer, this section will simply be empty.
    */ %>
    <%- defineContent('footer') %>
  </footer>

  <% /* Place any scripts contained in views at the end of the page. */ %>
  <%- script %>
</body>
</html>
```

```HTML
<!-- view.ejs -->
<%- contentFor('header') %>
<h1 class="page-title"><%= title %></h1>

<%- contentFor('footer') %>
<h1>This is the footer</h1>

<% /*
Content for the `body` section should either be the first thing defined
in the view, or it has to be declared just like any other section.
*/ %>
<%- contentFor('body') %>

This is part of the body.

<style>
  .page-message { color: blue }
</style>

<% /*
Like stylesheets, scripts can also be extracted.
This script block will end up at the end of the HTML document.
*/ %>
<script>
  // Script content!
</script>

<h1 class="page-message"><%= message %></h1>
```

渲染后页面显示为:

```TEXT
expressLayouts
This is part of the body.
Tate & Snow
This is the footer
```

还可以设置默认 layout 模板:

```JS
app.set('layout', 'layouts/layout');

// 通过 layout 属性使用指定的模板进行渲染
app.get('/', function(req, res) {
  res.render('the-view', { layout: 'specific-layout' });
);
```

### cookie-parser

解析 HTTP 请求中的 cookie。

```JS
var cookieParser = require('cookie-parser')

// 不使用签名
app.use(cookiePareser())

// 使用签名，需要指定一个 secret 字符串，否者会报错
// app.use(cookiePareser('Tate'))

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
})
```

### body-parser

解析 HTTP POST 请求中的请求体，通过 `req.body` 访问。

```JS
// 常用的设置
app.use(bodyParser.json()) // 解析 application/json
app.use(bodyParser.urlencoded({ extended: false })) // 解析 application/x-www-form-urlencoded
```

### compression

compression 会尝试压缩所有经过此中间件的响应体。支持两种压缩模式: deflate 和 gzip。

```JS
var compression = require('compression')
app.use(compression()) // compress all responses，可以带 options 参数
```

还可以通过 filter 来过滤哪些不需要压缩的请求:

```JS
app.use(compression({filter: shouldCompress}))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
```

## 参考链接

1. [Github - N-Blog](https://github.com/nswbmw/N-blog/blob/master/book/4.2%20%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C.md) By nswbmw
2. [nodeJS 实现简单网页爬虫功能](http://www.cnblogs.com/xiaohuochai/p/6960738.html) By 小火柴的蓝色理想
3. [Express 中间件----cookie-parser(六)](https://www.jianshu.com/p/25ffa01466f9) By HowardHuang
4. [body-parser Node.js(Express) HTTP 请求体解析中间件](https://blog.csdn.net/yanyang1116/article/details/54847560) By yanyang1116
5. [async 官方文档](https://caolan.github.io/async/docs.html)

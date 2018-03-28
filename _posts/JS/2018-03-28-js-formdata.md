---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  XHR & Fetch
date:   2018-03-28 15:46:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- JavaScript
---
# {{ page.title }}

## 什么是 AJAX

**AJAX(Asynchronous JavaScript and XML)** 是一种技术方案，能够向服务器请求额外的数据而无须卸载页面。其技术核心为 **XMLHttpRequest(XHR)** 对象，通过它可以发出 HTTP 请求和接收 HTTP 响应。

## XHR

### XHR level 2

**XMLHttpRequest(XHR)** 最初只是微软引入的一个特性，后来其他浏览器提供商也提供了相同的实现。之后 W3C 对它进行了标准化，提出了 XMLHttpRequest 标准，其中又分为 Level 1 和 Level 2。

**XMLHttpRequest Level 1** 主要存在以下缺点:

* 受同源策略的限制，不能发送跨域请求
* 无法读取和上传二进制文件(如图片、视频、音频等)，只支持纯文本数据
* 在发送和获取数据的过程中，无法实时获取进度信息，只能判断是否完成

**XMLHttpRequest Level 2** 新增了以下功能:

* 可以实现跨域请求
* 支持发送和接收二进制数据
* 发可以获得数据传输的进度信息
* 可以设置请求的超时时间
* 新增 FormData 对象，用来管理表单数据

```JS
function sendAjax() {
  //构造表单数据
  var formData = new FormData();
  formData.append('username', 'johndoe');
  formData.append('id', 123456);
  //创建 XHR 对象
  var xhr = new XMLHttpRequest();
  // 设置 XHR 请求的超时时间，同步请求只能为 0
  xhr.timeout = 5000;
  // 设置响应返回的数据格式，同步请求无效
  xhr.responseType = ‘text’;
  // 进度事件，可能有浏览器兼容问题
  xhr.onload = function(e) {
    if((this.status >= 200 && this.status < 300) || this.status == 304){
        alert(this.responseText);
    }
  };

  xhr.ontimeout = function(e) { ... }; // 请求超时时调用
  xhr.onerror = function(e) { ... };
  xhr.upload.onprogress = function(e) { ... };

  // 创建一个异步 post 请求
  xhr.open('POST', '/server', true);
  //发送数据
  xhr.send(formData);
}
```

### XHR 方法

* **open()** - 启动一个请求以备发送

```JS
// 第一个参数为请求类型，不区分大小写
// 第二个参数为请求的 URL
// 第三个参数为布尔值，表示是否异步发送请求，默认为 true 异步
xhr.open('get', 'https://jsonplaceholder.typicode.com/posts/1', true);
```

* **send()** - 发送一个请求

```JS
// 接收一个参数，即作为请求主题发送的数据
xhr.send(null);
```

* **setRequestHeader()** - 设置请求头信息

```JS
// 必须在 open 方法之后，send 方法之前调用，否则会抛错
// 多次调用采用追加，最终请求头中显示 'my-header: tate, snow'
xhr.setRequestHeader('my-header', 'tate');
xhr.setRequestHeader('my-header', 'snow');
```

* **getResponseHeader()** - 获取指定响应头信息，**getAllResponseHeaders** 方法可以获取所有响应头信息。这里 W3C 的 CORS 标准对于跨域请求做了限制规定，对于跨域请求，客户端允许获取的 response header 字段只限于 "simple response header" 和 "Access-Control-Expose-Headers":
  * simple response header - 包括的 header 字段有：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma
  * Access-Control-Expose-Headers - 属于跨域请求时响应头部中的一个字段，对于同域请求则没有这个字段的。此字段中列举的 header 字段就是服务器允许暴露给客户端访问的字段

```JS
xhr.getResponseHeader('my-header'); // Refused to get unsafe header "my-header"
xhr.getAllResponseHeaders();
// pragma: no-cache
// content-type: application/json; charset=utf-8
// cache-control: public, max-age=14400
// expires: Wed, 28 Mar 2018 07:31:37 GMT
```

### 获取 response 数据

在收到响应后，响应的数据会自动填充 XHR 对象的属性:

* **responseText** - 作为相应主体被返回的文本
* **responseXML** - 若响应的内容类型为 "text/html" 或 "application/xml"，则此属性将保存响应数据的 XML DOM 文档
* **status** - 响应的 HTTP 状态码
* **statusText** - HTTP 状态的说明

### onreadystatechange

若采用异步请求的话，XHR 对象的 **readyState** 属性可以检测当前请求的状态:

* **0** - 未初始化。尚未调用 open 方法;
* **1** - 启动。已经调用 open 方法，尚未调用 send 方法;
* **2** - 发送。已经调用 send 方法，尚未接收到响应;
* **3** - 接收。已经接收到部分响应数据;
* **4** - 完成。已经接收到全部响应数据。

```JS
// 这里使用 this 对象的话，在部分浏览器可能会导致函数执行失败，因此尽量采用 XHR 实例变量
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText);
    }
  }
}
```

### load 进度事件

**Progress Events** 进度事件定义了客户端和服务器通信有关的事件:

* **loadstart** - 在接收到响应数据的第一个字节时触发
* **progress** - 在接收响应期间持续不断地触发
* **error** - 在请求发生错误时触发
* **abort** - 调用 abort 方法终止连接时触发
* **load** - 在接收到完整的响应数据时触发，相当于 readyState 为 4
* **loadend** - 在通信完成或者 error、abort 或 load 事件后触发

progress 进度事件可以用来实时显示进度，默认每 50ms 触发一次。需要注意的是，上传过程和下载过程触发的是不同对象的 onprogress 事件:

* 上传触发的是 **xhr.upload** 对象的 onprogress 事件
* 下载触发的是 xhr 对象的 onprogress 事件

onprogress 事件处理程序会接收到一个 event 对象，其 target 属性是 XHR 对象，但包含着三个额外的属性:

* **lengthComputable** - 布尔值，表示进度信息是否可用
* **position** - 已经接收的字节数
* **totalSize** - 根据 content-length 响应头确定的预期字节数

```JS
xhr.onprogress = updateProgress;
xhr.upload.onprogress = updateProgress;
function updateProgress(event) {
  if (event.lengthComputable) {
    statusElement.innerHTML = 'Received ' + event.position + ' of ' + event.totalSize + ' bytes';
  }
}
```

## Fetch

### fecth()

**Fetch API** 提供了一个获取资源的接口(包括跨域)，最常用的就是 fetch() 函数。它接收一个 URL 参数，返回一个 promise 来处理 response。

```JS
// GET
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(json => console.log(json))
```

```JS
// POST
var headers = {
  method: 'POST',
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  },
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1
  })
}
fetch('https://jsonplaceholder.typicode.com/posts', headers)
  .then(response => response.json())
  .then(json => console.log(json))
```

Fetch 引入了三个接口，它们分别是 Headers、Request 以及 Response。

### Headers

**Headers** 接口是一个简单的多映射的名-值表。

```JS
// 创建一个空的 Headers 对象
var headers = new Headers();

// 添加(append)请求头信息
headers.append('Content-Type', 'text/plain');
headers.append('X-My-Custom-Header', 'CustomValue');

// 判断(has), 获取(get), 以及修改(set)请求头的值
headers.has('Content-Type'); // true
headers.get('Content-Type'); // 'text/plain'
headers.set('Content-Type', 'application/json');

// 删除某条请求头信息
headers.delete('X-My-Custom-Header');

// 创建对象时设置初始化信息
var headers = new Headers({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token,
});
```

### Request

**Request** 对象表示一次 fetch 调用的请求信息:

* **method** - 支持 GET、POST、PUT、DELETE、HEAD
* url - 请求的 URL
* **headers** - 对应的 Headers 对象
* **body** - 请求体
* referrer - 请求的 referrer 信息
* mode - 可以设置 cors、no-cors、same-origin
* credentials - 设置 cookies 是否随请求一起发送。可以设置: omit(默认)、same-origin、include
* redirect - follow、error、manual
* integrity - subresource 完整性值(integrity value)
* cache - 设置 cache 模式(default, reload, no-cache)

```JS
var request = new Request('/users.json', {
  method: 'POST',
  mode: 'cors',
  redirect: 'follow',
  headers: new Headers({
    'Content-Type': 'text/plain'
  })
});

fetch(request).then(function() { /* handle response */ });
```

### Response

**Response** 代表响应, fetch 的 then 方法接收一个 Response 实例，其可配置的参数如下:

* type - 类型，支持: basic、cors
* url - 请求的 url
* useFinalURL - Boolean 值, 代表 url 是否是最终 URL
* **status** - 状态码
* **ok** - 布尔值，代表成功响应(status 值在 200-299 之间)
* statusText - 状态值(例如: OK)
* headers - 与响应相关联的 Headers 对象

Response 提供的方法如下:

* clone() - 创建一个新的 Response 克隆对象
* error() - 返回一个新的,与网络错误相关的 Response 对象
* redirect() - 重定向,使用新的 URL 创建新的 response 对象
* arrayBuffer() - 返回一个 promise，resolves 是一个 ArrayBuffer 对象
* blob() - 返回一个 promise, resolves 是一个 Blob.
* formData() - 返回一个 promise, resolves 是一个 FormData 对象
* **json()** - 返回一个 promise, resolves 是一个 JSON 对象
* text() - 返回一个 promise, resolves 是一个 USVString (text)

> Fetch API 的兼容情况可[查看 caniuse](https://caniuse.com/#search=fetch)，可以使用 [whatwg-fetch 填充库](https://github.com/github/fetch)进行兼容处理。

## 参考链接

1. [你真的会使用 XMLHttpRequest 吗？](https://segmentfault.com/a/1190000004322487) By ruoyiqing
1. [This API is so Fetching!](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/)
1. [fetch API](https://davidwalsh.name/fetch) By David Walsh
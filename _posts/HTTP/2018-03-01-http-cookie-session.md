---
layout: blog
front: true
comments: True
flag: HTTP
background: orange
category: 前端
title: Cookie & Session
date:   2018-03-02 10:10:00 GMT+0800 (CST)
background-image: http://upload-images.jianshu.io/upload_images/1234352-474c42b13e2d470d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240
tags:
- http
---
# {{ page.title }}

**会话(Session)** 是一个客户与服务器之间的不中断的请求响应序列。可简单理解为：用户开一个浏览器，访问某一个 web 站点，在这个站点点击多个超链接，访问服务器多个 web 资源，然后关闭浏览器，整个过程称之为一个会话。

**HTTP 会话** 由于 HTTP 协议的无状态特征，为了识别不同的请求是否来自同一客户，引用 HTTP 会话机制，即多次 HTTP 连接间维护用户与同一用户发出的不同请求之间关联的情况称为维护一个会话(session)。

* **cookie** - 通过在客户端记录信息确定用户身份
* **session** - 通过在服务器端记录信息确定用户身份

## cookie

### 类型

**cookie** 总是保存在客户端中，按在客户端中的存储位置，可分为:

* 内存 cookie - 由浏览器维护，保存在内存中，浏览器窗口关闭后就消失了，其存在时间是短暂的，一般不设置过期时间会存在内存中
* 硬盘 cookie - 保存在硬盘里，有一个过期时间，除非用户手工清理或到了过期时间，否则不会被删除，其存在时间是长期的

### 缺点

* 符合条件的 cookie 会被附加在每个 HTTP 请求中，所以无形中增加了流量。
* 由于在 HTTP 请求中的 cookie 是明文传递的，所以安全性成问题，除非用 HTTPS。
* cookie 的大小限制在 4KB 左右，数量也有限制，对于复杂的存储需求来说是不够用的。

> 符合条件的意思是，客户端会检查所有存储的 cookie，如果某个 cookie 所声明的作用范围(域 + 路径)大于等于将要请求的资源所在的位置，则会附加于请求头中。也可以禁用 cookie。

### 属性

* **max-age** - HTTP1.1产物(HTTP1.0 使用 Expires)，设置相对过期时间，单位秒，有三种值：
  * 负数 - 即有效期为 session，属于会话 cookie(内存)
  * 0 - 删除
  * 正数 - 创建，有效期为创建时刻 + max-age
* **domain** - 目标域名，默认为当前创建时所在的域名
* **path** - 目标路径，默认为当前创建时所在的路径
* **secure** - 只在确保安全的请求中才会发送，如 HTTPS，默认不带
* **HttpOnly** - 是否能通过 js 去访问，默认不带

```JS
document.cookie; // 这个方法只能获取非 HttpOnly 类型的 cookie
// "_ga=GA1.2.865451383.1517365757; __lnkrntdmcvrd=-1; PHPSESSID=web2~207a6ac37f624ce19d9a4f268dc01304; _gid=GA1.2.1650902441.1519796826; afpCT=1; Hm_lvt_e23800c454aa573c0ccb16b52665ac26=1519705527,1519796826,1519830084,1519866651; Hm_lpvt_e23800c454aa573c0ccb16b52665ac26=1519866651"


// 在设置 cookie 属性时，属性之间由一个分号和一个空格隔开
document.cookie = "key=name; max-age=-1; domain=www.example.com; path=/; secure; HttpOnly"
```

> domain 是域名，path 是路径，可以来限制 cookie 能被哪些 URL 访问。

### 设置

cookie 既可以由服务端来设置，也可以由客户端来设置。

* **服务端**

在响应头中可加入 set-cookie 字段设置 cookie，如下图则对应 5 个 cookie:

![cookie - 服务端](https://sfault-image.b0.upaiyun.com/237/110/2371104766-56dd2fc2ba7ae_articlex)

* **客户端**

直接通过 document.cookie 设置，当 Name / domain / path 相同时则是修改，否则为新建。

```JS
document.cookie = "key=name; max-age=100; secure";
```

![cookie.png](https://i.loli.net/2018/03/01/5a976bda462c4.png)

> 默认情况下，在发生 CORS 跨域请求时，cookie 作为一种 credential 信息是不会被传送到服务端的。必须要进行额外设置才可以。详情请[查看 CORS 跨域一节]( {{site.url}}/2018/02/28/http-sop.html#withcredentials )。

## session

**session** 是一种服务器端的机制，内容通常是保存在服务器的内存中，也可以保存在文件、数据库等等。session 对象存储特定用户会话所需的属性及配置信息。这样，当用户在应用程序的 Web 页之间跳转时，存储在 session 对象中的变量将不会丢失。通常用来保存用户的登录状态。

实现流程机制:

* 客户端发送第一次请求，服务器端根据会话生成对应 **sessionID**。其中 session 内容存储在服务器端，session 由客户端和服务器端通过 sessionId 来关联;
* 服务器端把生成的 sessionID 通过响应头字段 set-cookie 返回给客户端，实际上是新建一个包含 sessionId 的 cookie;
* 每次 HTTP 请求时，sessionId 都会随着对应 cookie 被发送到服务器端;
* 服务器可通过 sessionId 取到对应的信息，来判断这个请求来自于哪个客户端/用户，从而进行有状态的会话。

常见的购物车案例:

![session - cookie](https://img.ken.io/blog/session/session-workingprinciple.png?v1)

session 也可设置过期时间，禁用 cookie 并不一定无法使用 session。除了 cookie，客户端还可以将发送给服务器的数据包含在请求的 URL 中:

![session - url](http://upload-images.jianshu.io/upload_images/1234352-474c42b13e2d470d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## Web Storage

### localStorage

**Web Storage** 的概念和 cookie 相似，区别是它是为了更大容量存储设计的，且能以一种比使用 cookie 更直观的方式存储键/值对。其中包含如下两种机制：

* **sessionStorage** 为每一个给定的源(given origin)维持一个独立的存储区域，该存储区域在页面会话期间可用，即只要浏览器处于打开状态，包括页面重新加载和恢复。
* **localStorage** 同样的功能，但数据存储是无限期的，除非手动删除，不同窗口可以共享数据。

localStorage 和 sessionStorage 都具有相同的操作方法，如:

```JS
// 保存数据到 localStorage
localStorage.setItem('key', 'value');

// 从 localStorage 获取数据
var data = localStorage.getItem('key');

// 从 localStorage 删除保存的数据
localStorage.removeItem('key');

// 从 localStorage 删除所有保存的数据
localStorage.clear();
```

遍历:

```JS
var storage = window.localStorage;
for (var i = 0, len = storage.length; i < len; i++){
  var key = storage.key(i);
  var value = storage.getItem(key);
  console.log(key + " - " + value);
}
```

当 Storage 对象发生变化时， StorageEvent 事件会触发:

```JS
if(window.addEventListener){
  window.addEventListener("storage", handle_storage, false);
}else if(window.attachEvent){
  window.attachEvent("onstorage", handle_storage);
}

function handle_storage(e){
  if(!e){e = window.event;}
}
```

上述 Web Storage 仍然有几个缺点:

* 同步执行 - 需要等待数据从磁盘读取和解析，从而减慢应用程序的响应速度
* 仅支持字符串 - 需要使用 JSON.parse 与 JSON.stringify 进行序列号和反序列化
* 存储大小仍然有较大限制
* 不能加密存储到硬盘上

### localForage

为了解决上述问题，Mozilla 开发了 **[localForage](https://localforage.github.io/localForage/)** 的库 ，使得离线数据存储在任何浏览器都变得容易。

* 支持回调的异步 localStorage-like API
* 支持 IndexedDB、WebSQL 和 localStorage 三种存储模式，默认以顺序优先级存储
* 支持 BLOB 和任意类型的数据，可以存储图片，文件等
* 支持 ES6 Promises API

```JS
// Callback version:
localforage.getItem('somekey', function(err, value) {
  // Run this code once the value has been
  // loaded from the offline store.
  console.log(value);
});

// Supply a list of drivers, in order of preference.
localforage.setDriver([localforage.WEBSQL, localforage.INDEXEDDB]);
```

## 本地数据库

上述 Web Storage 对于大量结构化数据就无能为力了，灵活大不够强大。

### Web SQL

**Web SQL**(*deprecated*) 是属于前端的**关系型数据库**，由一张张的二维表组成的，它也是本地存储的一种，使用 SQLite 实现，可通过 SQL(即操作关系型 DB 的语言)支持增删查改等。同样的关系型数据库比如有 MySQL、SQLite、SQL Server、Oracle 等。

关系型数据库的缺点是:

* 不方便横向扩展，例如给数据库表添加一个字段，如果数据量达到亿级，那么这个操作的复杂性将会是非常可观的。
* 海量数据用 SQL 联表查询，性能将会非常差
* 关系型数据库为了保持事务的一致性特点，难以应对高并发

![Web SQL](https://dn-sdkcnssl.qbox.me/editor/oVrWVVjH3Ewo-uwiYtE5.png)

### IndexedDB

**IndexedDB** 属于**非关系型数据库(NoSQL = not only sql)**，非关系型数据库根据它的存储特点，常用的有:

* key-value 型，如 Redis、IndexedDB，value 可以为任意数据类型
* json / document 型，如 MongoDB，可对 value 的字段做索引，IndexedDB 也支持

![IndexedDB](https://dn-sdkcnssl.qbox.me/editor/9Ks86rbq3cacvngmF0NI.png)

它的特点是存储比较灵活，但是查找没有像关系型数据库一样好用。适用于数据量很大，只需要单表 key 查询，一致性不用很高的场景。具体操作请[参考这里](https://fed.renren.com/2017/06/11/sql/)。

## 参考链接

1. [聊一聊 cookie](https://segmentfault.com/a/1190000004556040) By ruoyiqing
1. [session 和 cookies 会话机制详解](https://liuchi.coding.me/2016/07/20/session%E5%92%8Ccookies%E4%BC%9A%E8%AF%9D%E6%9C%BA%E5%88%B6%E8%AF%A6%E8%A7%A3/) By Liu Chi
1. [MDN - 使用 Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
1. [github -  localforage](https://localforage.github.io/localForage/)
1. [前端与SQL](https://fed.renren.com/2017/06/11/sql/) By 会编程的银猪
1. [Session 的工作原理和使用经验](https://ken.io/note/session-principle-skill) By ken
1. [理解 Cookie 和 Session 机制](https://my.oschina.net/xianggao/blog/395675) By 陶邦仁

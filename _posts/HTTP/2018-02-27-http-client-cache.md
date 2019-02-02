---
layout: blog
front: true
comments: True
flag: HTTP
background: orange
category: 前端
title: HTTP 缓存
date:   2018-02-27 17:03:00 GMT+0800 (CST)
background-image: http://imweb-io-1251594266.file.myqcloud.com/FozLFZKB5y67NUSXLhioLseHJYbE
tags:
- http
---
# {{ page.title }}

## 缓存状态码

使用缓存是为了加快客户端和服务器之间的通信，减少数据传输的成本。缓存状态码有以下两种:

* **200 OK (from cache)** - 不向服务器发送请求，直接使用客户端缓存
* **304 not modified** - 代表资源在客户端中的缓存依然是有效的，否则返回 200 状态码(相当于重新请求)

## 首部字段

### Expires

在 http1.0 时代，给客户端设定缓存方式可通过两个字段 **Pragma** 和 **Expires** 来规范。

```HTTP
<!-- 禁用缓存 -->
Pragma: no-cache

<!-- 启用缓存，且时间点未超过设定时间时，则使用缓存 -->
Expires: Sat, 10 Mar 2019 13:14:00 GMT
```

然而 Expires 的缓存时间是针对服务器而言，无法保证和客户端时间统一。因此 http1.1 新增 Cache-Control 来定义缓存过期时间。

### Cache-Control

**Cache-Control** 通用消息头被用于在 HTTP 请求和响应中通过指定指令来实现缓存机制。它是一个通用首部字段，这意味着它能分别在请求报文和响应报文中使用:

* 作为客户端请求首部

| 指令 | 描述 |
|:-------------|:------------|
| max-age=\<seconds\> | 客户端希望接收一个存在时间不超过过期时间的资源 |
| max-stale[=\<seconds\>] | 客户端愿意接收一个已经过期的资源，可选时间表示响应不能超过的过期时间 |
| min-fresh=\<seconds\> | 客户端希望在指定的时间内获取最新的响应 |
| no-cache | 告知(代理)服务器不直接使用缓存，要求向原服务器发起请求 |
| no-store | 缓存不应存储有关客户端请求或服务器响应的任何内容 |
| no-transform | 不得对资源进行转换或转变 |
| only-if-cached | 客户端只接受已缓存的响应，并且不要向原始服务器检查是否有更新的拷贝 |

* 作为服务器响应首部

| 指令 | 描述 |
|:-------------|:------------|
| public | 响应可以被任何对象缓存，包括客户端和代理服务器 |
| private | 响应只能被单个用户缓存，不能作为共享缓存，不适用与代理服务器 |
| must-revalidate | 可直接使用未过期资源，若过期，则要求向服务器发起请求 |
| proxy-revalidate | 同 must-revalidate，仅适用于共享缓存，如代理服务器 |
| no-cache | 不直接使用缓存，要求向服务器发起请求 |
| no-store | 缓存不应存储有关客户端请求或服务器响应的任何内容 |
| no-transform | 不得对资源进行转换或转变 |
| max-age=\<seconds\> | 设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)，是相对于请求的时间 |
| s-maxage=\<seconds\> | 同 max-age，仅适用于共享缓存，如代理服务器 |

可支持自由组合，其格式为:

```HTTP
<!-- 禁用缓存 -->
Cache-Control: no-cache, no-store, must-revalidate

<!-- 缓存静态资源: 5s 内直接取缓存，过期则必须要服务器发起请求 -->
Cache-Control: max-age=5, must-revalidate
```

> 首部字段优先级 **Pragma -> Cache-Control -> Expires**

目前还存在一个问题: 假定在首次获取资源 \<seconds\> 秒后，客户端又对该资源发起了新的请求。若该响应现已过期，客户端无法使用。此时，客户端可以直接发出新的请求并获取新的完整响应。不过这样做效率较低，因为如果资源未发生变化，那么下载与缓存中已有的资源完全相同，为了让客户端与服务器之间能实现缓存文件是否更新的验证、提升缓存的复用率，Http1.1 新增了以下几个字段。

### Last-Modified

服务器将资源传递给客户端时，会将资源最后更改的时间加在响应头上一起返回给客户端。客户端会为资源标记上该信息，下次再次请求时，会把该信息附带在请求报文中，作为条件一并带给服务器去做检查。

```HTTP
Last-Modified: Tue, 27 Feb 2018 13:14:00 GMT
```

![last-modified](http://imweb-io-1251594266.file.myqcloud.com/FozLFZKB5y67NUSXLhioLseHJYbE)

#### If-Modified-Since

**If-Modified-Since** 如果客户端传来的最后修改时间与服务器上的一致，那么返回一个不带有消息主体的 304 响应；否则会将资源返回，状态码为 200。

只可以用在 GET 或 HEAD 请求中。当与 If-None-Match 一同出现时，它会被忽略掉，除非服务器不支持 If-None-Match。

#### If-Unmodified-Since

**If-Unmodified-Since** 如果所请求的资源在指定的时间之后发生了修改，那么会返回 [412(Precondition Failed)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/412) 状态码，否则返回 200。一般和 [If-Range](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/If-Range) 用作断点续传。

> Last-Modified 存在一定问题，如果在服务器上资源被修改，但其实际内容根本没发生改变，也会返回整个资源给客户端。

### Etag

服务器会通过某种算法，给资源计算得出一个唯一标志符(如 MD5)，在把资源响应给客户端的时候，会在实体首部加上 Etag 字段。同样客户端会保留该 ETag 字段，并在下一次请求时将其一并带过去给服务器。

```HTTP
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

![http-cache-control.png](https://i.loli.net/2018/02/27/5a952486e5c4e.png)

#### If-None-Match

**If-None-Match** 若 Etag 匹配一致则返回不带有消息主体的 304 响应，否则会将资源返回，状态码为 200。优先级高于 If-Modified-Since。

#### If-Match

**If-Match** 与 ETag 匹配不一致，或者收到了 "*" 值而当前并没有该资源实体，则应当返回 412(Precondition Failed) 状态码。

## 字段比较

| 首部字段 | 特性 | 缺点 |
|:-------------|:------------|:-------------|
| Expires | HTTP1.0 产物，以时刻标识失效时间 | 1、不能保证服务器与客户端时间一致；2、存在版本问题，到期之前的修改客户端是不可知的 |
| Cache-Control | HTTP 1.1 产物，采用相对请求时间，更多选项设置 | 1、不向下兼容；2、存在版本问题，到期之前的修改客户端是不可知的 |
| Last-Modified | 不存在版本问题，每次请求都会去服务器进行校验 | 1、只要资源修改，无论内容是否发生实质性的变化，都会将该资源返回客户端；2、以时刻作为标识，无法识别一秒内进行多次修改的情况 |
| Etag | 同上，且可以更加精确的判断资源是否被修改 | 1、ETag 值计算需要性能损耗；2、分布式服务器存储(如 CDN)的情况下，算法若不一样，会导致客户端从一台服务器上获得页面内容后到另外一台服务器上进行验证时发现 ETag 不匹配的情况 |

## 最佳策略

在理想的情况下，目标应该是在客户端上缓存尽可能多的响应，缓存尽可能长的时间，并且为每个响应提供验证令牌，以实现高效的重新验证。

![http-cache-decision-tree.png](https://i.loli.net/2018/02/27/5a952486ea7b1.png)

## 刷新访问

可以分为以下几种刷新访问，示例均来自 [IMWeb](http://imweb.io/topic/5795dcb6fb312541492eda8c):

* 输入 URL 地址然后回车 / 书签访问
* F5 / 工具栏刷新按钮 / 右键菜单重新加载
* Ctl + F5

假设已经首次访问某页面，响应头信息如下:

```HTTP
Cache-Control: max-age=31104000
Expires: Thu, 20 Jul 2017 02:18:41 GMT
Last-Modified: Fri, 15 Jul 2016 04:11:51 GMT
```

* **第一种情况**: 输入 URL

![输入 URL](http://imweb-io-1251594266.file.myqcloud.com/FjNVji6ipMDCWCoe2jXfzgqFbF8k)

* **第二种情况**: F5 刷新

F5 会强制让浏览器发送一个 HTTP 请求到服务器。此时请求头包含:

```HTTP
<!-- Cache-Control 是 Chrome 强制加上的 -->
Cache-Control: max-age=0
If-Modified-Since: Fri, 15 Jul 2016 04:11:51 GMT
```

服务器则返回 304 状态和响应头。

![F5 刷新](http://imweb-io-1251594266.file.myqcloud.com/FoGcVs6BvMvNLNM7KSvwEuHBaqDt)

* **第三种情况**: Ctrl + F5 刷新

Ctrl + F5 会强制禁用缓存，服务器返回 200，重新将资源返回到浏览器。比如 Chrome 会在请求头添加条件:

```HTTP
Cache-Control: no-cache
Pragma: no-cache
```

![Ctrl + F5](http://imweb-io-1251594266.file.myqcloud.com/FonZrh_J5auduA4JaqZKW9hZqXrG)

## 参考链接

1. [MDN - Cache-Control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)
1. [Google - HTTP 缓存](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn) By Ilya Grigorik
1. [IMWeb - HTTP 缓存控制小结](http://imweb.io/topic/5795dcb6fb312541492eda8c)
1. [IMWeb - 缓存策略](http://imweb.io/topic/55c6f9bac222e3af6ce235b9)
1. [说说客户端端缓存的那点事儿-扑朔迷离的 etag 与 last-modified](https://github.com/rccoder/blog/issues/12) By rccoder

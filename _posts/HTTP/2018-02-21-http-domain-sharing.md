---
layout: blog
front: true
comments: True
flag: HTTP
background: orange
category: 前端
title: 域名发散
date:   2018-02-22 23:42:00 GMT+0800 (CST)
background-image: https://sfault-image.b0.upaiyun.com/117/354/117354478-56fecc31ed57e_articlex
tags:
- http
---
# {{ page.title }}

## 什么是域名发散

由于浏览器的限制，对每个域名的连接数存在上限，[一般为 6 个](http://www.browserscope.org/?category=network)。浏览器做并发限制的主要原因是减小服务器负载和防止 [DDos 攻击](https://zh.wikipedia.org/wiki/%E9%98%BB%E6%96%B7%E6%9C%8D%E5%8B%99%E6%94%BB%E6%93%8A)。

**域名发散(domain sharding)**，静态资源采用多个子域名，目的是充分利用现代浏览器的多线程并发下载能力，解除最大连接数限制。具体实施可以使用子域名申请或者 CNAME 别名解析，一般域名发散的数量应控制在 3 以下。

![domain sharding](https://blog.stackpath.com/hubfs/Glossary/domain-sharding-1.gif?t=1519237512138)

> 譬如 youtube 通过 i.ytimg.com 和 s.ytimg.com 两个子域名把图片资源和脚本资源分开，前者包含 icons、logos 等，后者包含 JS、CSS 等，当用户访问 youtube 时候，会同时下载脚本和媒体文件来渲染页面。

## 什么是域名收敛

**域名收敛(domain of convergence)**，静态资源采用一个域名，通常针对移动端而言，因为其解析 DNS 的时间会稍长，发散到多个域名的话会增加首屏时间。

> **首屏时间** 是指用户打开网站开始，到浏览器首屏内容渲染完成的时间。**白屏时间** 指的是浏览器开始显示内容的时间。

## CDN

**CDN(Content Delivery Network)** 即内容分发网络。利用[负载均衡技术](https://zh.wikipedia.org/wiki/%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1)将源站内容分发至最接近用户的节点，使用户可就近取得所需内容，提高用户访问的响应速度和成功率。解决因分布、带宽、服务器性能带来的访问延迟问题，适用于静态资源仓库、站点加速、点播、直播等场景。

![CDN](https://pic1.zhimg.com/80/v2-7d4409a2d13943df2ca9c15defaec8c6_hd.jpg)

工作流程:

1. 当用户点击网站页面上的内容 URL，经过本地 DNS 系统解析，会最终将域名的解析权交给 CNAME 指向的 CDN 专用 DNS 服务器;
2. CDN 的 DNS 服务器将 CDN 的全局负载均衡设备 IP 地址返回用户;
3. 用户向 CDN 的全局负载均衡设备发起内容 URL 访问请求;
4. CDN 全局负载均衡设备根据用户 IP 地址，以及用户请求的内容 URL，选择一台用户所属区域的区域负载均衡设备，告诉用户向这台设备发起请求;
5. 区域负载均衡设备会为用户选择一台合适的缓存服务器提供服务，选择的依据包括：根据用户IP地址，判断哪一台服务器距用户最近；根据用户所请求的URL中携带的内容名称，判断哪一台服务器上有用户所需内容；查询各个服务器当前的负载情况，判断哪一台服务器尚有服务能力。基于以上这些条件的综合分析之后，区域负载均衡设备会向全局负载均衡设备返回一台缓存服务器的 IP 地址;
6. 全局负载均衡设备把服务器的 IP 地址返回给用户;
7. 用户向缓存服务器发起请求，缓存服务器响应用户请求，将用户所需内容传送到用户终端。如果这台缓存服务器上并没有用户想要的内容，而区域均衡设备依然将它分配给了用户，那么这台服务器就要向它的上一级缓存服务器请求内容，直至追溯到网站的源服务器将内容拉到本地。

![CDN-7](https://pic2.zhimg.com/80/049b124feb55100ff2f147b768ad4c8b_hd.jpg)

## SPDY

**SPDY(speedy)** 可以在不增加域名的情况下，解除最大连接数的限制。SPDY 协议通过压缩、多路复用和优先级来缩短加载时间，提高安全性。2015年9月，Google 宣布了计划，移除对SPDY的支持，拥抱 HTTP/2，并将在 Chrome 51中生效。

![SPDY](https://camo.githubusercontent.com/d7571ae59436c10b44b8b739ae09ee043bc78bde/687474703a2f2f696d61676573323031352e636e626c6f67732e636f6d2f626c6f672f3630383738322f3230313630342f3630383738322d32303136303430373230303030353331322d323130353734363430342e706e67)

## HTTP/2

简称 [h2](https://zh.wikipedia.org/wiki/HTTP/2)，主要基于 SPDY 协议。在 HTTP 的语义、HTTP 方法、状态码、URI 和首部字段等核心概念不变的情况下，HTTP/2 实现了性能优化。

![HTTP](http://img.mp.itc.cn/upload/20170731/1e77ec4574774711975f3bab2b339c40.jpg)

HTTP/2 的优势：

* **二进制分帧(Binary Framing)**

HTTP1.x 是基于文本协议(textual)解析。HTTP/2 将所有传输的信息分割为更小的消息和帧，并对它们采用二进制格式的编码，我们先了解几个概念：

* **帧(Frame)** - HTTP/2 通信的最小单位，每个帧包含帧首部，至少也会标识出当前帧所属的流
* **消息(Message)** - 由一个或多个帧组合而成，例如请求和响应
* **连接(Connection)** - 与 HTTP/1 相同，都是指对应的 TCP 连接
* **流(Stream)** - 已建立的连接上的双向字节流

在 HTTP/2 中，数据流以消息的形式发送，而消息由一个或多个帧组成，帧可以在数据流上乱序发送，然后再根据每个帧首部的流标识符重新组装。二进制分帧是 HTTP/2 的基石，其他优化都是在这一基础上来实现的。

* **多路复用(Request and Response Multiplexing)**

HTTP1.x中，如果想并发多个请求，必须使用多个 TCP 链接，且浏览器为了控制资源，还会对单个域名有 6-8 的个数限制。HTTP/2 中合并多个请求，同个域名只需要占用一个 TCP 连接，消除了因多个 TCP 连接而带来的延时和内存消耗。单个连接上可以并行交错的请求和响应，之间互不干扰。

* **流优先级(Stream priority)**

每个请求都可以带一个31bit的优先值，0表示最高优先级， 数值越大优先级越低。有了这个优先值，客户端和服务器就可以在处理不同的流时采取不同的策略，以最优的方式发送流、消息和帧。

* **服务器推送(Server Push)**

即缓存推送，即服务端向客户端发送比客户端请求更多的数据。这允许服务器直接提供浏览器渲染页面所需资源，而无须浏览器在收到、解析页面后再提起一轮请求，节约了加载时间。

* **压缩头(Header Compression)**

舍弃掉了不必要的 HTTP 头信息，经过 HPACK 算法压缩之后可以节省多余数据传输所带来的等待时间和带宽。

## 参考链接

1. [What is Domain Sharding](https://blog.stackpath.com/glossary/domain-sharding/)
1. [CDN 是什么？使用 CDN 有什么优势？](https://www.zhihu.com/question/36514327?rf=37353035)
1. [CDN 的基本工作过程](http://book.51cto.com/art/201205/338756.htm)
1. [【前端性能】浅谈域名发散与域名收敛](https://github.com/chokcoco/cnblogsArticle/issues/1)
1. [域名发散--前端优化(三)](https://segmentfault.com/a/1190000004647665)
1. [SPDY 是什么？如何部署 SPDY？](http://www.geekpark.net/news/158198)
1. [http2-spec / HTTP2 中英对照版](https://github.com/fex-team/http2-spec/blob/master/HTTP2%E4%B8%AD%E8%8B%B1%E5%AF%B9%E7%85%A7%E7%89%88%2806-29%29.md)
1. [HTTP/2 协议–特性扫盲篇](https://www.cnblogs.com/yingsmirk/p/5248506.html)
1. [谈谈 HTTP/2 对前端的影响](http://hectorguo.com/zh/http2-starter/)
1. [http2 讲解](https://ye11ow.gitbooks.io/http2-explained/content/part1.html)
1. [HTTP/2 Frequently Asked Questions](https://http2.github.io/faq/#why-is-http2-multiplexed)
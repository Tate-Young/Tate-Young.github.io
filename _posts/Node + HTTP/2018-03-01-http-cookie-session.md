---
layout: blog
front: true
comments: True
flag: HTTP
background: orange
category: 前端
title: Cookie & Session
date:   2018-03-02 10:10:00 GMT+0800 (CST)
update: 2022-06-07 17:37:00 GMT+0800 (CST)
description: add SameParty & fenced frames
background-image: /style/images/smms/http-cookie-session.png
tags:
- http
---
# {{ page.title }}

**会话(Session)** 是一个客户与服务器之间的不中断的请求响应序列。可简单理解为：用户开一个浏览器，访问某一个 web 站点，在这个站点点击多个超链接，访问服务器多个 web 资源，然后关闭浏览器，整个过程称之为一个会话。

**HTTP 会话** 由于 HTTP 协议的无状态特征，为了识别不同的请求是否来自同一客户，引用 HTTP 会话机制，即多次 HTTP 连接间维护用户与同一用户发出的不同请求之间关联的情况称为维护一个会话(session)。

* **cookie** - 通过在客户端记录信息确定用户身份
* **session** - 通过在服务器端记录信息确定用户身份

## cookie

**cookie** 总是保存在客户端中，按在客户端中的存储位置，可分为:

* 内存 cookie - 由浏览器维护，保存在内存中，浏览器窗口关闭后就消失了，其存在时间是短暂的，一般不设置过期时间会存在内存中
* 硬盘 cookie - 保存在硬盘里，有一个过期时间，除非用户手工清理或到了过期时间，否则不会被删除，其存在时间是长期的

使用 cookie 存在着一些限制，比如：

* 符合条件的 cookie 会被附加在每个 HTTP 请求中，所以无形中增加了流量。
* 由于在 HTTP 请求中的 cookie 是明文传递的，所以安全性成问题，除非用 HTTPS。
* cookie 的大小限制在 4KB 左右，数量也有限制，对于复杂的存储需求来说是不够用的。

> 符合条件的意思是，客户端会检查所有存储的 cookie，如果某个 cookie 所声明的作用范围(域 + 路径)大于等于将要请求的资源所在的位置，则会附加于请求头中。也可以禁用 cookie。

cookie 既可以由服务端来设置，也可以由客户端来设置。

* **服务端**

在响应头中可加入 set-cookie 字段设置 cookie:

```TEXT
Set-Cookie: <cookie名>=<cookie值>

HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry
```

* **客户端**

直接通过 document.cookie 设置，当 Name / domain / path 相同时则是修改，否则为新建。

```JS
document.cookie = "key=name; max-age=100; secure";
```

![cookie.png]( {{site.url}}/style/images/smms/cookie.png )

> 默认情况下，在发生 CORS 跨域请求时，cookie 作为一种 credential 信息是不会被传送到服务端的。必须要进行额外设置才可以。详情请[查看 CORS 跨域一节]( {{site.url}}/2018/02/28/http-sop.html#withcredentials )。

### domain / path 作用域

* **max-age** - HTTP1.1产物(HTTP1.0 使用 Expires)，设置相对过期时间，单位秒，有三种值：
  * 负数 - 即有效期为 session，属于会话 cookie(内存)
  * 0 - 删除
  * 正数 - 创建，有效期为创建时刻 + max-age
* **domain** - 目标域名，即可以送达的主机名，默认为当前创建时所在的域名
* **path** - 目标路径，默认为当前创建时所在的路径
* **secure** - 只在确保安全的请求中才会发送，如 HTTPS，默认不带
* **HttpOnly** - 是否能通过 js 去访问，默认不带

```JS
document.cookie; // 这个方法只能获取非 HttpOnly 类型的 cookie
// "_ga=GA1.2.865451383.1517365757; __lnkrntdmcvrd=-1; PHPSESSID=web2~207a6ac37f624ce19d9a4f268dc01304; _gid=GA1.2.1650902441.1519796826; afpCT=1; Hm_lvt_e23800c454aa573c0ccb16b52665ac26=1519705527,1519796826,1519830084,1519866651; Hm_lpvt_e23800c454aa573c0ccb16b52665ac26=1519866651"


// 在设置 cookie 属性时，属性之间由一个分号和一个空格隔开
document.cookie = "key=name; max-age=-1; domain=.example.com; path=/; secure; HttpOnly"
```

**其中 domain 和 path 共同决定了 cookie 的作用域**，即限制 cookie 能被哪些 URL 访问。当前大多数浏览器遵循 RFC 6265，设置 domain 时 不需要加前导点。浏览器不遵循该规范，则需要加前导点，例如：`domain=.mozilla.org`。domain 如果不指定，则默认为 origin，不包含子域名。

path 标识指定了主机下的哪些路径可以接受 cookie（该 URL 路径必须存在于请求 URL 中）。以字符 `%x2F ("/")` 作为路径分隔符，子路径也会被匹配。例如，设置 `path=/docs`，则以下地址都会匹配：

```text
/docs
/docs/Web/
/docs/Web/HTTP
```

### SameSite

**SameSite** Cookie 允许服务器要求某个 cookie 在跨站(cross-site)请求时不会被发送，从而可以阻止**跨站请求伪造攻击（CSRF）**。SameSite 可以有下面三种值：

* **None** - 浏览器会在同站请求、跨站请求下继续发送 cookie，不区分大小写。
* **Strict** - 浏览器将只在访问相同站点时发送 cookie。（在原有 Cookies 的限制条件上的加强，如上文 “Cookie 的作用域” 所述）
* **Lax** - 与 Strict 类似，但更宽松一些，在 Lax 模式下只会阻止在使用危险 HTTP 方法进行请求携带的三方 Cookie，例如 POST 方式。同时，使用 JavaScript 脚本发起的请求也无法携带三方 Cookie。

导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求，GET 表单。详见下表：

| 请求类型        |   示例   | 正常情况或 None | Lax | Strict |
| ------------ | ------- | --- | --- | --- |
| 链接 | \<a href="..."\>\</a\> | 发送 | 发送 | 不发送 |
| 预加载 | \<link rel="prerender" href="..."> | 发送 | 发送 | 不发送 |
| GET 表单 | <form method="GET" action="..."> | 发送 | 发送 | 不发送 |
| POST 表单 | <form method="POST" action="..."> | 发送 | 不发送 | 不发送 |
| iframe | <iframe src="..."></iframe> | 发送 | 不发送 | 不发送 |
| AJAX | $.get("...") | 发送 | 不发送 | 不发送 |
| Image | \<img src="..."\> | 发送 | 不发送 | 不发送 |

> 如果 SameSite 属性在以前没有设置，或者没有得到运行浏览器的支持，那么它的行为等同于 None，Cookies 会被包含在任何请求中，包括跨站请求。大多数主流浏览器正在将 SameSite 的默认值迁移至 Lax。如果想要指定 Cookies 在同站、跨站请求都被发送，现在需要明确指定 SameSite 为 None。

> 如果要设置 SameSite None 属性，那么该 Cookie 就必须同时加上 Secure 属性，因为 HTTP 不支持 SameSite 为 None 的配置

那么 same site（同站）和 same origin（同域）到底有什么区别呢？我们再看下以下图示：

![url](https://zh.javascript.info/article/url/url-object.svg)

同域的判断比较严格，需要 `protocol, hostname, port` 三部分完全一致。相对而言，Cookie 中的同站判断就比较宽松，主要是根据 Mozilla 维护的[公共后缀表（Pulic Suffix List）](https://publicsuffix.org/list/public_suffix_list.dat)使用 **有效顶级域名(eTLD) + 1** 的规则查找得到的一级域名是否相同来判断是否是同站请求，不需要考虑协议和端口。举些例子：

```text
# These are the same site because the registrable domain of mozilla.org is the same (different host and files path don't matter):

https://developer.mozilla.org/en-US/docs/
https://support.mozilla.org/en-US/

# These are the same site because scheme and port are not relevant:

http://example.com:8080
https://example.com

# These are not same site because the registrable domain of the two URLs differs:

https://developer.mozilla.org/en-US/docs/
https://example.com

# 需要注意的是，`.github.io` 在 PSL 中记录的是有效顶级域名，所以以下是跨站请求

https://tateyoung.github.io
https://blog.github.io
```

#### PSL & eTLD

eTLD 的全称是 **effective Top-Level Domain**，它与我们往常理解的 Top-Level Domain 顶级域名有所区别。eTLD 记录在之前提到的 **PSL(Pulic Suffix List)** 文件中。而 TLD 也有一个记录的列表，那就是 [Root Zone Database](https://www.iana.org/domains/root/db)。RZD 中记录了所有的根域列表，其中不乏一些奇奇怪怪五花八门的后缀。

eTLD 的出现主要是为了解决 `.com.cn, .com.hk, .co.jp` 这种看起来像是一级域名的但其实需要作为顶级域名存在的场景。这里还可以分享一个有趣的事情，2020年5月份出现了一起阿里云所有 ac.cn 后缀网站解析全部挂掉的事件。原因就是 ac.cn 是中科院申请在册的 eTLD 域名。而阿里云的检测域名备案的脚本不了解规范，没有使用 PSL 列表去查找一级域名，而是使用了.分割的形式去查找的。最终所有 *.ac.cn 的域名由于 ac.cn 这个域名没有进行备案导致解析全部挂掉。而我们现在知道 ac.cn 这个域名是 eTLD 域名，它肯定是无法备案的。

#### 与 domain 区别

参考 [stackoverflow 的问答](https://stackoverflow.com/questions/57090774/what-are-the-security-differences-between-cookies-with-domain-vs-samesite-strict)。**Domain 属性限制将 cookie 发送到的主机。 SameSite 属性限制了发送 cookie 的来源**。

因此，第一个 cookie 可以发送到 baz.qux.com 或其任何子域，而不管请求的来源是什么 (即是从 baz.qux.com 还是 foo.example.com 托管的网页发送的)：

```text
Set-Cookie: Foo=bar; Path=/; Secure; Domain=baz.qux.com;
```

第二个 cookie 只能发送到 baz.qux.com (因为未指定域，并且忽略 IE 异常)，并且仅当请求源自 qux.com 站点，即不会针对跨站点请求发送：

```text
Set-Cookie: Foo=bar; Path=/; Secure; SameSite=strict;
```

通过阻止随机网站 (hacker.example.com) 向包含会话 cookie 的第三方 (baz.qux.com) 执行经过身份验证的请求，可以帮助防止 CSRF。

### First-Party Sets & SameParty

> 此节摘自[这里](https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490863&idx=1&sn=a9cfa840c4c2c664aab28b6c70245dc9&chksm=c2e2e804f5956112bc39d08c696ba232949d58cf447387bcbfc330a3d4cd6eb84d2e082e4dea&token=406950475&lang=zh_CN&scene=21#wechat_redirect) 👈

Cookie 本质上不区分第一方或第三方，它取决于包含 Cookie 的当前上下文。我们还用之前的老例子：

```text
如果是你正常的正在逛着天猫，天猫会把你的信息写入一些 Cookie 到 .tmall.com 这个域下，然而打开控制台你会看到，并不是所有 Cookie 都是 .tmall.com 这个域下的，里面还有很多其他域下的 Cookie，这些所有非当前域下的 Cookie 都属于第三方 Cookie，虽然你可能从来没访问过这些域，但是他们已经悄悄的通过这些第三方 Cookie 来标识你的信息，然后把你的个人信息发送过去了。

而 .tmall.com 这个域下的 Cookie 都属于第一方 Cookie，那么为什么还需要第三方 Cookie 呢？再打开 taobao.com，你会发现你已经不需要再登录了，因为淘宝、天猫都属于阿里旗下的产品，阿里为他们提供统一的登录服务，同时，你的登录信息也会存到这个统一登录服务的域下，所以存到这个域下的 Cookie 就成了三方 Cookie。
```

但是由于涉及到用户隐私，各大主流浏览器正在逐步禁用三方 Cookie。但是一个公司或组织往往在不同业务下会有多个不同的域名，例如 taobao.com、tianmao.com，所以很多正常的业务场景也许要借助三方 Cookie 来实现（比如单点登录和 consent 管理），直接禁用后可能会给我们的业务带来很大影响，而且之前一直以来都没有很好的解决方案，这也是 Chrome 禁用三方 Cookie 进展非常缓慢的原因。因此 Chrome 在之前的版本为 Cookie 新增了一个 SameSite 属性来限制三方 Cookie 的访问，具体参考上一节，在 Chrome 80 版本后 SameSite 的默认值被设定为 `SameSite=Lax`。

在上面正常的业务场景中，所有不同的域名基本上都来自同一个组织或企业，我们希望在同一个运营主体下不同域名的 Cookie 也能共享。这里就需要使用 **First-Party Sets** 策略，即不得在不相关的站点之间交换用户信息，或对不属于同一实体的站点进行分组。

W3C 目前正在讨论新的 First-Party Sets 的配置和验证，其中一个考虑的选项是由独立实体而非浏览器公司处理验证。目前 First-Party Sets 已经确定的原则如下：

1. First-Party Sets 中的域必须由同一组织拥有和运营
1. 所有域名应该作为一个组被用户识别
1. 所有域名应该共享一个共同的隐私政策

每一个需要用到 First-Party Sets 策略的域名都应该把一个 JSON 配置托管在 `/.well-known/first-party-set` 路由下。例如 brandx.site 的配置应该托管在 `https://brandx.site/.well-known/first-party-set` 下：

```json
{
  "owner": "brandx.site",
  "version": 1,
  "members": ["fly-brandx.site", "drive-brandx.site"]
}
```

另外 members 里的两个域名均需要增加所有者的配置：

```json
{ "owner": "brandx.site" }
```

First-Party Sets 还有一些限制：

1. 一个集合可能只有一个所有者
1. 一个成员只能属于一个集合，不能重叠或混合
1. 域名列表不要过大

需要注意的是，所有开启了 First-Party Sets 域名下需要共享的 Cookie 都需要增加 **SameParty** 属性，例如，如果我在 brandx.site 下设置了下面的 Cookie：

```text
Set-Cookie: name=tate; Secure; SameSite=Lax; SameParty
```

这时我在 fly-brandx.site 下发送 brandx.site 域名的请求，Cookie 也可以被携带了，但是如果我在另外一个网站，例如 hotel.xyz 下发送这个请求，Cookie 就不会被携带。在 SameParty 被广泛支持之前，你可以把它和 SameSite 属性一起定义来确保 Cookie 的行为降级，另外还有一些额外的要求：

1. SameParty Cookie 必须包含 Secure.
1. SameParty Cookie 不得包含 SameSite=Strict.

![sameparty](https://wd.imgix.net/image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/bmNqQh85YU16Bw2YEi5L.png?auto=format&w=1600)

### CHIPS

**具有独立分区状态的 Cookie (CHIPS - Cookies Having Independent Partitioned State)** 是一项隐私沙盒提案，它允许开发人员将 cookie 选择到“分区(partitioned)”存储中，每个顶级站点都有单独的 cookie jar。分区的第三方 cookie 与最初设置的顶级站点相关联，无法从其他地方访问。其目的是允许第三方服务设置 cookie，但只能在最初设置它们的顶级站点的上下文中读取。看使用场景：

![chips demo](https://wd.imgix.net/image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/jsxgCpkMRXwXughPjg7j.png?auto=format&w=800)

```text
假如我们现在有一个通用的聊天服务，由第三方服务 support.chat.example 提供支持，我们的网站 retail.example 希望用 iframe 的方式嵌入这个聊天框。这个嵌入式的聊天服务可能会依赖 Cookie 来保存用户的交互历史记录。

假如没有了设置跨站点三方 Cookie 的能力，则 support.chat.example 可能需要更改为依赖 retail.example 传递给他们的第一方会话的一些标识符。在这种情况下，每个嵌入 support.chat.example 聊天服务的网站都需要额外的设置来传递状态，这大大增加了开发成本。

或者，我们也可以允许 support.chat.example 请求 retail.example 页面上的 JavaScript。这引入了非常大的安全风险，也不是个靠谱的方法。
```

那我们可以怎么做呢？

```text
<!-- Partitioned cookies must be set with Secure and Path=/ and without the Domain attribute.  -->
<!-- It is recommended to use the __Host prefix when setting partitioned cookies to make them bound to the hostname (and not the registrable domain). -->
Set-Cookie: __Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;
```

![chips demo 2](https://wd.imgix.net/image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/PODInBIXZrgGeUoFhipj.png?auto=format&w=1600)

```text
还是上面的例子，我们在站点 A 中通过 iframe 嵌入了一个站点 C，正常情况下如果三方 Cookie 被禁用后，C 是无法在 A 站点访问到它的 Cookie 的。

如果 C 在它的 Cookie 上指定了 Partitioned 属性，这个 Cookie 将保存在一个特殊的分区 jar 中。它只会在站点 A 中通过 iframe 嵌入站点 C 时才会生效，浏览器会判定只会在顶级站点为 A 时才发送该 Cookie。

当用户访问一个新站点时，例如站点 B，如果也它通过 iframe 嵌入了站点 C，这时在站点 B 下的站点 C 是无法访问到之前在 A 下面设置的那个 Cookie 的。
```

如果用户直接访问站点 C，一样也是访问不到这个 Cookie 的。这就在保护了用户隐私的情况下完美的解决了 iframe 页面三方 Cookie 的问题：

![chips demo 3](https://wd.imgix.net/image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/FaQYaZyTsAxCm8GvvVc8.png?auto=format&w=800)

下面是启用了 CHIPS 后 Cookie 的分区键(partition key)的变化：

![partition key](https://wd.imgix.net/image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/ZZm3G3cCgziUK2eezdiu.png?auto=format&w=1600)

当域名都属于同一个 First-Party Set 配置里时，Cookie 的 partition key 都一样：

![patrtion key 2](https://wd.imgix.net/image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/ho7jqWrZzBxmX3fsIpTt.png?auto=format&w=1600)

### fenced frames

上述提到的 Cookie 还很大程度影响到广告投放，我们的业务大多可能会使用 iframe 去嵌入一些智能推荐的广告，而我们的顶级站点可以读取到  iframe 的 src 属性，这就以为着顶级站点可以从广告的 URL 推断有关访问者兴趣的信息，这在一定程度上就泄露了用户隐私。这种技术主要还是通过使用第三方 Cookie 跨站点共享信息的跟踪技术来实现的。

| Feature | \<iframe\> | \<fencedframe\> |
| Embed  content | Yes | Yes |
| Embedded  content can access embedding context DOM | Yes | No |
| Embedding  context can access embedded content DOM | Yes | No |
| Observable  attributes, such as name | Yes | No |
| URLs  (http://example.com) | Yes | Yes(mode-dependent) |
| Browser -managed opaque source (urn:uuid) | No | Yes |
| Access  to unpartitioned storage | No | Yes |

使用 Fenced frames ，我们依然可以显示与访问者兴趣相匹配的广告，但顶级站点是无法从 frame 的 src 属性中推断出用户的兴趣信息的，这个信息只有广告商知道。当我们需要在同一页面上显示来自不同顶级分区的数据时，建议使用 Fenced frames，如果嵌入的网页是受信任的，还是用更灵活的 iframe 即可。

常规的用法和 iframe 一样，我们可以用 src 属性来引入一个嵌入的内容：

```html
<fencedframe src="demo_fenced_frame.html"></fencedframe>
```

另外 Fenced frames 可能会和其他的[隐私沙盒](https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490934&idx=1&sn=4c5c086d3b736c6397212740005ee040&chksm=c2e2e85df595614b90ae2c04198e19377fdf386b8569bdfbb70127cfec2d5be8c9726040ef98&scene=21&cur_album_id=2160442714947911680#wechat_redirect)的 API 来配合使用，浏览器可能会为 Fenced frames 生成一个不透明的 URL 。例如，配合 [FLEDGE](https://developer.chrome.com/docs/privacy-sandbox/fledge/)，浏览器可以生成一个 urn:uuid，来映射智能广告推荐的 URL：

```html
<fencedframe src="urn:uuid:c36973b5-e5d9-de59-e4c4-364f137b3c7a" mode="opaque-ads" ></fencedframe>
```

只有在 Fenced frames 内部嵌入的广告商的站点才能获取到 urn:uuid 和 URL 的真实映射关系，外部的顶级站点是获取不到的。需要注意的是，Fenced frames 不能使用 postMessage 与它的父元素进行通信。但是可以和作为 Fenced frames 子级的 iframes 进行通信。

浏览器会给从 Fenced frames 和嵌入在 Fenced frames 中的 iframes 发出的请求设置 Header：

```text
Sec-Fetch-Dest: fencedframe
```

对应的，为了正常响应 Fenced frames 嵌入的文档，服务端也需要设置下面的 Header：

```text
Supports-Loading-Mode: fenced-frame
```

![fenced frames]( {{site.url}}/style/images/smms/fenced-frames.jpg )

有了 Fenced frames ，我们就可以在不和嵌入的广告商共享用户信息的情况下实现智能广告推荐了，相信它未来将是禁用三方 Cookie 后智能广告推荐领域的主要解决方案。

## session

**session** 是一种服务器端的机制，内容通常是保存在服务器的内存中，也可以保存在文件、数据库等等。session 对象存储特定用户会话所需的属性及配置信息。这样，当用户在应用程序的 Web 页之间跳转时，存储在 session 对象中的变量将不会丢失。通常用来保存用户的登录状态。

实现流程机制:

* 客户端发送第一次请求，服务器端根据会话生成对应 **sessionID**。其中 session 内容存储在服务器端，session 由客户端和服务器端通过 sessionId 来关联;
* 服务器端把生成的 sessionID 通过响应头字段 set-cookie 返回给客户端，实际上是新建一个包含 sessionId 的 cookie;
* 每次 HTTP 请求时，sessionId 都会随着对应 cookie 被发送到服务器端;
* 服务器可通过 sessionId 取到对应的信息，来判断这个请求来自于哪个客户端/用户，从而进行有状态的会话。

常见的购物车案例:

![session - cookie]( {{site.url}}/style/images/smms/session-workingprinciple.png )

session 也可设置过期时间，禁用 cookie 并不一定无法使用 session。除了 cookie，客户端还可以将发送给服务器的数据包含在请求的 URL 中:

![http-cookie-session.png]( {{site.url}}/style/images/smms/http-cookie-session.png )

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

### Web SQL(*deprecated*)

**Web SQL** 是属于前端的**关系型数据库**，由一张张的二维表组成的，它也是本地存储的一种，使用 SQLite 实现，可通过 SQL(即操作关系型 DB 的语言)支持增删查改等。同样的关系型数据库比如有 MySQL、SQLite、SQL Server、Oracle 等。

关系型数据库的缺点是:

* 不方便横向扩展，例如给数据库表添加一个字段，如果数据量达到亿级，那么这个操作的复杂性将会是非常可观的。
* 海量数据用 SQL 联表查询，性能将会非常差
* 关系型数据库为了保持事务的一致性特点，难以应对高并发

### IndexedDB

**IndexedDB** 属于**非关系型数据库(NoSQL = not only sql)**，非关系型数据库根据它的存储特点，常用的有:

* key-value 型，如 Redis、IndexedDB，value 可以为任意数据类型
* json / document 型，如 MongoDB，可对 value 的字段做索引，IndexedDB 也支持

它的特点是存储比较灵活，但是查找没有像关系型数据库一样好用。适用于数据量很大，只需要单表 key 查询，一致性不用很高的场景。具体操作请[参考这里](https://fed.renren.com/2017/06/11/sql/)。

## 参考链接

1. [SameSite 那些事](https://segmentfault.com/a/1190000040161207) By 公子
2. [fencedframe 可以替代 iframe 吗？](https://cloud.tencent.com/developer/article/2009308) By ConardLi
3. [First-Party Sets and the SameParty attribute](https://developer.chrome.com/blog/first-party-sets-sameparty/)
4. [Cookies Having Independent Partitioned State (CHIPS)](https://developer.chrome.com/docs/privacy-sandbox/chips/)

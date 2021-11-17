---
layout: blog
front: true
comments: True
flag: Express
background: gray
category: 后端
title: 安全漏洞与防范
date: 2021-11-17 20:30:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- Node
---
# {{ page.title }}

## CSRF

**CSRF（Cross-site request forgery）** 跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

一个典型的 CSRF 攻击有着如下的流程：

1. 受害者登录 a.com，并保留了登录凭证（Cookie）。
1. 攻击者引诱受害者访问了 b.com。
1. b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会默认携带 a.com 的 Cookie。
1. a.com 接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
1. a.com 以受害者的名义执行了 act=xx。
1. 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 a.com 执行了自己定义的操作。

CSRF 攻击的特点如下：

1. 攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。
1. 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据。
1. 整个过程攻击者并不能获取到受害者的登录凭证，仅仅是 “冒用”。
1. 跨站请求可以用各种方式：图片 URL、超链接、CORS、Form 提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。

### 示例

比如有个看似图片的东西，实际上是请求银行接口去取钱：

```html
<img src="https://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
```

然鹅这个时候你恰巧也登陆过银行，cookie 还有效，当你在第三方网页加载了这张图片的时候，就会请求 src 上的接口并带上你的 cookie，你的钱就被哗啦啦转走了。这个适用于 get 请求，如果是 post 请求的话，可以在页面加载时模拟表单提交。

```html
<form action="https://bank.example.com/withdraw" method="POST">
  <input type="hidden" name="account" value="bob">
  <input type="hidden" name="amount" value="1000000">
  <input type="hidden" name="for" value="mallory">
</form>
<script>window.addEventListener('DOMContentLoaded', (e) => { document.querySelector('form').submit(); }</script>
```

### 如何防范

针对上述特点，我们可以针对以下两个方向去做防范：

1. 阻止不明外域的访问
   1. 同源检测 - 检测 origin header 或者 referer header。但是每个浏览器对于 Referer 的具体实现可能有差别，而且我们可以移除该字段，具体[参考这一章节]( {{site.url}}/2019/06/06/express-helmet.html#referrer-policy )
   2. SameSite Cookie - 可以参考[这一章节的 cookie 设置]( {{site.url}}/2018/03/02/http-cookie-session.html#samesite )
2. 提交时要求附加本域才能获取的信息
   1. CSRF Token - 大概思路是用户打开页面的时候，服务器需要给这个用户生成一个 token，该 token 通过加密算法对数据进行加密，一般包括随机字符串和时间戳的组合，之后每次请求都会带上这个 token。此方式较为繁琐，而且不能在通用的拦截上统一处理所有的接口
   2. 双重 Cookie 验证 - 无需使用 session，实施成本更低，但安全性还是没有 CSRF Token 高
      1. 在用户访问网站页面时，向请求域名注入一个 Cookie，内容为随机字符串（如 csrfcookie=v8g9e4ksfhw）
      2. 在前端向后端发起请求时，取出 Cookie，并添加到 URL 的参数中（如 POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw）。
      3. 后端接口验证 Cookie 中的字段与 URL 参数中的字段是否一致，不一致则拒绝。

我们还可以通过一些测试工具去进行测试，比如 [**CSRFTester**](https://www.hacking.reviews/2017/08/csrftester-cross-site-request-forgery.html?m=1)，原理是使用代理抓取我们在浏览器中访问过的所有的连接以及所有的表单等信息，通过在 CSRFTester 中修改相应的表单等信息，重新提交，相当于一次伪造客户端请求，如果修改后的测试请求成功被网站服务器接受，则说明存在 CSRF 漏洞。

## XSS

**XSS(Cross-site scripting)** 跨站脚本攻击：允许攻击者将恶意客户端代码注入网站，此代码由受害者执行，让攻击者绕过访问控制并冒充用户。其攻击的特点如下：

1. 在 HTML 中内嵌的文本中，恶意内容以 script 标签形成注入
2. 在内联的 JavaScript 中，拼接的数据突破了原本的限制（字符串，变量，方法名等）
3. 在标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签
4. 在标签的 href、src 等属性中，包含 javascript: 等可执行代码
5. 在 onload、onerror、onclick 等事件中，注入不受控制代码
6. 在 style 属性和标签中，包含类似 background-image:url("javascript:..."); 的代码（新版本浏览器已经可以防范）
7. 在 style 属性和标签中，包含类似 expression(...) 的 CSS 表达式代码（新版本浏览器已经可以防范）

总之，如果开发者没有将用户输入的文本进行合适的过滤，就贸然插入到 HTML 中，这很容易造成注入漏洞。攻击者可以利用漏洞，构造出恶意的代码指令，进而利用恶意代码危害数据安全。根据攻击的来源，XSS 攻击可分为**存储型、反射型和 DOM 型**三种：

一、**存储型 XSS 的攻击步骤** - 常见于论坛发帖、商品评论、用户私信等：

1. 攻击者将恶意代码提交到目标网站的数据库中
2. 用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作

二、**反射型 XSS 的攻击步骤** - 常见于网站搜索、跳转等：

1. 攻击者构造出特殊的 URL，其中包含恶意代码
2. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作

三、**DOM 型 XSS 的攻击步骤**：

1. 攻击者构造出特殊的 URL，其中包含恶意代码
1. 用户打开带有恶意代码的 URL
1. 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行
1. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作

> DOM 型 XSS 攻击取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞

### 示例

可以参考 [express helmet 章节的示例]( {{site.url}}/2019/06/06/express-helmet.html#xss-filter )。我们再举个 QQ 邮箱 m.exmail.qq.com 域名反射型 XSS 漏洞的例子。

攻击者发现 `http://m.exmail.qq.com/cgi-bin/login?uin=aaaa&domain=bbbb` 这个 URL 的参数 uin、domain 未经转义直接输出到 HTML 中。于是攻击者构建出一个 URL，并引导用户去点击： `http://m.exmail.qq.com/cgi-bin/login?uin=aaaa&domain=bbbb%26quot%3B%3Breturn+false%3B%26quot%3B%26lt%3B%2Fscript%26gt%3B%26lt%3Bscript%26gt%3Balert(document.cookie)%26lt%3B%2Fscript%26gt%3B`。用户点击这个 URL 时，服务端取出 URL 参数，拼接到 HTML 响应中：

```html
<script>
getTop().location.href="/cgi-bin/loginpage?autologin=n&errtype=1&verify=&clientuin=aaa"+"&t="+"&d=bbbb";return false;</script><script>alert(document.cookie)</script>"+"...
```

浏览器接收到响应后就会执行 `alert(document.cookie)`，攻击者通过 JavaScript 即可窃取当前用户在 QQ 邮箱域名下的 Cookie，进而危害数据安全。

### 如何防范

1. 输入过滤
   1. 存储型和反射型 XSS 都是在服务端取出恶意代码后，插入到响应 HTML 里的，攻击者刻意编写的“数据”被内嵌到“代码”中，被浏览器所执行。可以改成纯前端渲染，把代码和数据分隔开。并对 HTML 做充分转义。但对于性能要求高，或有 SEO 需求的页面，我们仍然要面对拼接 HTML 的问题
   2. DOM 型 XSS 攻击，实际上就是网站前端 JavaScript 代码本身不够严谨，把不可信的数据当作代码执行了
2. **CSP(Content Security Policy)** - 可以参考 [express helmet 这一章节]( {{site.url}}/2019/06/06/express-helmet.html#content-security-policy )
   1. 禁止加载外域代码，防止复杂的攻击逻辑
   2. 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域
   3. 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）
   4. 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）
   5. 合理使用上报可以及时发现 XSS，利于尽快修复问题
3. 其他
   1. 输入内容长度控制
   2. HTTP-only Cookie: 禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie
   3. 验证码：防止脚本冒充用户提交危险操作

对于 DOM 型 XSS 攻击的防范再补充下，在使用 `.innerHTML、.outerHTML、document.write()` 时要特别小心，不要把不可信的数据作为 HTML 插到页面上，而应尽量使用 `.textContent、.setAttribute()` 等。DOM 中的内联事件监听器，如 `location、onclick、onerror、onload、onmouseover` 等，\<a\> 标签的 href 属性，JavaScript 的 `eval()、setTimeout()、setInterval()` 等，都能把字符串作为代码运行。如果不可信的数据拼接到字符串中传递给这些 API，很容易产生安全隐患，请务必避免。

```html
<!-- 内联事件监听器中包含恶意代码 -->
![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/3e724ce0.data:image/png,)

<!-- 链接内包含恶意代码 -->
<a href="UNTRUSTED">1</a>

<script>
// setTimeout()/setInterval() 中调用恶意代码
setTimeout("UNTRUSTED")
setInterval("UNTRUSTED")

// location 调用恶意代码
location.href = 'UNTRUSTED'

// eval() 中调用恶意代码
eval("UNTRUSTED")
</script>
```

当然我们也可以通过一些工具去检测，比如我们使用以下这个字符串，具体解释[可以参考这里](https://github.com/0xsobky/HackVault/wiki/Unleashing-an-Ultimate-XSS-Polyglot)，里面还提供了很多 demo，可以点进去试试，比如 [kixepi](https://output.jsbin.com/kixepi)：

```text
jaVasCript:/*-/*`/*\`/*'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert()//>\x3e
```

只要在网站的各输入框中提交这个字符串，或者把它拼接到 URL 参数上，就可以进行检测了。除了手动检测之外，还可以使用自动扫描工具寻找 XSS 漏洞，例如 `Arachni、Mozilla HTTP Observatory、w3af` 等。

> 一些 XSS 攻击小游戏 --> [alert(1) to win](https://alf.nu/alert1)、[prompt(1) to win](http://prompt.ml/0)、[XSS game](https://xss-game.appspot.com) 👈

## SQL 注入

**SQL 注入**：web 应用程序对用户输入数据的合法性没有判断或过滤不严，攻击者可以在 web 应用程序中事先定义好的查询语句的结尾上添加额外的 SQL 语句，在管理员不知情的情况下实现非法操作，以此来实现欺骗数据库服务器执行非授权的任意查询，从而进一步得到相应的数据信息。

根据输入的参数，可将SQL注入方式大致分为两类：

一、**数字型注入**

当输入的参数为整型时，如 ID、年龄、页码等，如果存在注入漏洞，则可以认为是数字型注入。这种数字型注入最多出现在 ASP、PHP 等弱类型语言中，弱类型语言会自动推导变量类型，例如，参数 id=8，PHP 会自动推导变量 id 的数据类型为 int 类型，那么 `id=8 and 1=1`，则会推导为 string 类型，这是弱类型语言的特性。而对于 Java、C# 这类强类型语言，如果试图把一个字符串转换为 int 类型，则会抛出异常，无法继续执行。所以，强类型的语言很少存在数字型注入漏洞。

二、**字符型注入**

当输入参数为字符串时，称为字符型。数字型与字符型注入最大的区别在于：数字型不需要单引号闭合，而字符串类型一般要使用单引号来闭合。

### 示例

比如某个网站的登入验证的 SQL 查询代码为：

```sql
strSQL = "SELECT * FROM users WHERE (name = '" + userName + "') and (pw = '"+ passWord +"');"
```

此时恶意填入：

```text
userName = "1' OR '1'='1";
passWord = "1' OR '1'='1";
```

上述的 SQL 语句即被篡改，可以看到这样子就拿到了所有的用户表信息：

```sql
strSQL = "SELECT * FROM users WHERE (name = '1' OR '1'='1') and (pw = '1' OR '1'='1');"

-- 等同于
strSQL = "SELECT * FROM users;"
```

### 如何防范

1. 使用参数化查询（Parameterized Query）来设计资料存取功能
2. 检查数据格式，使用数据库特定的敏感字符转义函数把用户提交上来的非数字数据进行转义
3. 严格限制 web 应用对于操作数据库的权限
4. 当数据库操作失败的时候，尽量不要将原始错误日志返回，比如类型错误、字段不匹配等，把代码里的 SQL 语句暴露出来，以防止攻击者利用这些错误信息进行 SQL 注入
5. 使用其他更安全的方式连接 SQL 资料库。例如已修正过 SQL 注入问题的资料库连接元件，例如 ASP.NET 的 SqlDataSource 物件或是 LINQ to SQL
6. 增强 WAF 的防御力

SQL 注入的检测方式目前主要有两大类：

* **动态监测** - 即在系统运行时，通常在系统验收阶段或上线运行阶段使用该方法，使用动态监测攻击对其系统进行扫描，然后依据扫描结果判断是否存在 SQL 注入漏洞。动态监测分为两类：手工监测以及工具监测。
* **静态检测** - 又称静态代码扫描，对代码做深层次分析。

## 参考链接

1. [前端安全系列（一）：如何防止 XSS 攻击？](https://tech.meituan.com/2018/09/27/fe-security.html) by 美团技术团队
2. [前端安全系列（二）：如何防止 CSRF 攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html) by 美团技术团队

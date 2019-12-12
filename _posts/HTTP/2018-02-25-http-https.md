---
layout: blog
front: true
comments: True
flag: HTTP
background: orange
category: 前端
title: HTTPS
date:   2018-02-26 18:45:00 GMT+0800 (CST)
update: 2019-12-12 18:39:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/02/26/5a941e489c7af.png
tags:
- http
---
# {{ page.title }}

## 什么是 HTTP

**超文本传输协议(HyperText Transfer Protocol)**，是用于传输诸如 HTML 的超媒体文档的[应用层协议](https://zh.wikipedia.org/wiki/OSI%E6%A8%A1%E5%9E%8B)。HTTP 是[无状态协议](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%8A%B6%E6%80%81%E5%8D%8F%E8%AE%AE)，意味着服务器不会在两个请求之间保留任何数据。

HTTP 的缺点:

* 窃听风险 - 通信使用未加密的明文
* 伪装风险 - 不验证通信方的身份
* 篡改风险 - 无法验证报文的完整性

## 什么是 HTTPS

**超文本传输安全协议(Hypertext Transfer Protocol Secure)**，HTTPS 经由 HTTP 进行通信，但利用 **[SSL/TLS](https://zh.wikipedia.org/wiki/%E5%82%B3%E8%BC%B8%E5%B1%A4%E5%AE%89%E5%85%A8%E6%80%A7%E5%8D%94%E5%AE%9A)** 来加密数据包。SSL 是个加密套件，负责对 HTTP 的数据进行加密，**TLS(Transport Layer Security)** 的前身即是 **SSL(Secure Sockets Layer)**。

HTTPS 与 HTTP 的区别:

| 区别 | HTTP | HTTPS |
|:-------------|:------------|:-------------|
| URL | http:// | https:// |
| 端口 | 80 | 443 |
| 证书 | 无 | 需要向 CA(证书颁发机构) 申请证书 |
| 加密 | 直接将数据给到 TCP 进行传输 | 先将数据给到 SSL/TLS 进行加密，然后再由 TCP 进行传输 |

## 请求报文

![request](http://dl2.iteye.com/upload/attachment/0069/3451/412b4451-2738-3ebc-b1f6-a0cc13b9697b.jpg)

## 响应报文

![response](http://dl2.iteye.com/upload/attachment/0069/3492/bddb00b6-a3e1-3112-a4f4-4b3cb8687c70.jpg)

## 状态码

状态码是由 3 位数组成，第一个数字定义了响应的类别，且有五种可能取值:

| 状态码 | 描述 | 备注 |
|:-------------|:------------|:-------------|
| 1xx | 指示信息 | 请求已接收，继续处理 |
| 2xx | 成功 | 请求已被成功接收、理解、接受 |
| 3xx | 重定向 | 要完成请求必须进行更进一步的操作 |
| 4xx | 请求错误 | 请求含有词法错误或者无法被执行 |
| 5xx | 服务端错误 | 服务器在处理某个正确请求时发生错误 |

## 加密算法

HTTPS 的加密方式主要有以下几种:

| 加密方式 | 描述 | 举个栗子 |
|:-------------|:------------|:-------------|
| **对称加密** | 加密数据用的密钥与解密数据用的密钥一致 | DES、AES、RC5、RC6 |
| **非对称加密** | 加密数据用的密钥(公钥)与解密数据用的密钥(私钥)不一致 | RSA、DH |
| **Hash 算法** | 将任意长度的信息转换为较短的固定长度的值，通常其长度要比信息小得多，且算法不可逆 | MD5、SHA-1、SHA-2、SHA-256 |
| **数字签名** | 用于验证传输的内容是是否为真实服务器发送的数据 | 先将数据给到 SSL/TLS 进行加密，然后再由 TCP 进行传输 |

**对称加密(Symmetric-key algorithm)** 算法加密、解密效率较高，而数据发送方、数据接收方需要协商、共享同一把密钥，并确保密钥不泄露给其他人，因此密钥如何安全的发送给接收方成为了一个问题。

**非对称加密(public-key cryptography)** 可以解决秘钥配送的安全问题，算法性能较低，但是安全性较强，由于其加密特性，非对称加密算法能加密的数据长度也是有限的。

![非对称加密](https://foofish.net/images/public-key.jpg)

## OSI 模型

**OSI 模型** 网络七层协议，复杂而不实用:

| OSI 层 | 描述 | TCP/IP 协议族 |
|:-------------|:------------|:-------------|
| **应用层** | 提供为应用软件而设的界面，以设置与另一应用软件之间的通信 | HTTP、SMTP、SNMP、FTP、Telnet、SIP、SSH |
| **表示层** | 数据格式化，代码转换，数据加密 | XDR、ASN.1、SMB、AFP、NCP |
| **会话层** | 解除或建立与别的接点的联系 | NetBIOS、ASP、IGMP |
| **传输层** | 提供端对端的接口 | TCP，UDP |
| **网络层** | 为数据包选择路由 | IP、ICMP、IPX、BGP |
| **数据链路层** | 传输有地址的帧以及错误检测功能 | 以太网、令牌环、HDLC |
| **物理层** | 以二进制数据形式在物理媒体上传输数据 | 无线电、光纤 |

**TCP/IP 协议族** 并不是 TCP 和 IP 的统称，而是一个四层体系结构。而从实质上讲，TCP/IP 只有最上面三层，网络接口层并没有什么内容，因此介绍网络原理时采取上述优点，折中为一个五层体系结构。

![OSI.png](https://i.loli.net/2018/02/26/5a93eb5d8223f.png)

## TCP

**传输控制协议(TCP)**是一种面向连接的、可靠的、基于字节流的传输层通信协议。

### 三次握手

**三次握手(three-way handshake)** 建立一个 TCP 连接。

每次握手(发送数据请求或应答)时，发送的数据为 TCP 报文，其中包含了一些标志位：

| 标志位 | 描述 |
|:-------------|:------------|
| SYN | 同步序号 |
| ACK | 应答回复 |
| RST | 复位连接，消除旧有的同步序号 |
| PSH | 尽可能的将数据送往接收进程 |
| FIN | 发送方完成数据发送 |

![三次握手](https://i.loli.net/2018/02/26/5a941d1fe7629.png)

握手流程：

* **第一次握手**：客户端向服务器端发送连接请求包 SYN(syn=j)，等待服务器回应；
* **第二次握手**：服务器端响应后发送两个包给客户端，并进入 SYN_RECV 状态;
  * 向客户端发送确认自己收到其连接请求的确认包 ACK(ack=j+1)
  * 向客户端发送连接询问请求包 SYN(syn=k)，询问客户端是否已经准备好建立连接
* **第三次握手**：客户端收到服务器的两个包后，向服务器发送连接建立的确认包 ACK(ack=k+1)，服务器收到后，服务器与客户端进入 ESTABLISHED 状态，开始进行数据传送。

### 为什么三次

那么问题来了，为什么握手是三次，而不是两次或四次呢？

因为 TCP 主要是为了**保证数据可靠传输，又要提高传输的效率**。因此需要找到最少的步骤而达到最可靠最高效的传输，我们可以[参考知乎这篇回答](https://www.zhihu.com/question/24853633): TCP 的可靠连接是靠 `seq(sequence numbers 序列号)` 来达成的。TCP 设计中一个基本设定就是，通过 TCP 连接发送的每一个包，都有一个 seq。而因为每个包都是有序列号的，所以都能被确认收到这些包。接收方接收到第一个 SYN 时，没有办法知道这个 SYN 是是否延迟了很久而失效了，因为有可能之前某次请求在某个网络节点长时间的滞留。所以为了安全，接收方一定需要跟发送方确认 SYN，而这个步骤最少就是三步。

### SYN 攻击

服务器端的资源分配是在二次握手时分配的，而客户端的资源是在完成三次握手时分配的，所以服务器容易受到 [**SYN 攻击**](https://baike.baidu.com/item/SYN攻击/14762413)。SYN 攻击就是 Client 在短时间内伪造大量不存在的 IP 地址，并向 Server 不断地发送 SYN 包，Server 则回复确认包，并等待 Client 确认，由于源地址不存在，因此 Server 需要不断重发直至超时，这些伪造的 SYN 包将长时间占用未连接队列，导致正常的 SYN 请求因为队列满而被丢弃，从而引起网络拥塞甚至系统瘫痪。SYN 攻击是一种典型的 DoS/DDoS 攻击。

检测 SYN 攻击非常的方便，当你在服务器上看到大量的半连接状态时，特别是源 IP 地址是随机的，基本上可以断定这是一次 SYN 攻击。在 Linux/Unix 上可以使用系统自带的 `netstats` 命令来检测 SYN 攻击:

```SHELL
netstat -n -p TCP | grep SYN_RECV
```

常见的防御 SYN 攻击的方法有如下几种:

1. 缩短超时（SYN Timeout）时间
1. 增加最大半连接数
1. 过滤网关防护
1. SYN cookies 技术

### 四次挥手

**四次挥手(four-way wavehand)**用来终止 TCP 连接，由于 TCP 的半关闭特性，TCP连接时数据在两个方向上能同时传递，因此每个方向必须单独的进行关闭。

![四次挥手](https://i.loli.net/2018/02/26/5a941d204af5e.png)

假设客户端 A 向服务器 B 请求终止 TCP 连接，则挥手流程：

* **第一次挥手**：A 向 B 发送 FIN 包，请求断开 A->B 的连接;
* **第二次挥手**：B 收到 A 发送的 FIN 包，并向 A 发送 ACK 包，A->B 的连接关闭;
* **第三次挥手**：B 向 A 发送 FIN 包，请求断开 B->A 的连接;
* **第四次挥手**：A 收到 B发送的 FIN 包，并向 B 发送 ACK 包，B->A 的连接关闭。

### 为什么四次

那么问题来了，第二次和第三次为啥不能整合，只用三次挥手就行了？

因为当服务端收到客户端的 SYN 连接请求报文后，可以直接发送 SYN+ACK 报文。其中 ACK 报文是用来应答的，SYN 报文是用来同步的。但是关闭连接时，当服务端收到 FIN 报文时，很可能并不会立即关闭 SOCKET，所以只能先回复一个 ACK 报文，告诉客户端，"你发的 FIN 报文我收到了"。只有等到我服务端所有的报文都发送完了，我才能发送 FIN 报文，因此不能一起发送。故需要四次挥手。

## UDP

**用户数据包协议(UDP)**是一个简单的面向数据报的传输层协议，只提供数据的不可靠传递，一旦把应用程序发给网络层的数据发送出去，就不会保留数据备份。与 TCP 的区别如下:

| 比较 | TCP | UDP |
|:-------------|:------------|:-------------|
| 连接 | 面向连接，管发管到 | 面向非连接，管发不管到 |
| 握手 | 三次握手，四次挥手 | 无 |
| 可靠性 | 可靠 | 不可靠 |
| 应用场合 | 大量数据，如文件传输 | 少量数据，如广播通信 |
| 速度 | 慢 | 快 |
| 其他协议使用 | HTTP、HTTPS、FTP、SMTP、Telnet | DNS、DHCP |

## Get 与 Post 请求的区别

> tldr - 两者本质上区别不大，都是基于 TCP/IP 协议传输，更多是语义上的一些区别，再加上 HTTP 其他的一些规定和浏览器和服务器等的限制，导致他们的行为有所不同

上面已经说了本质一样，但是行为有区别，到底区别在哪儿呢，我们接着看:

1、Get

```TEXT
<!-- 查询字符串（名称/值对）是在 GET 请求的 URL 中发送的 -->
/test/demo_form.asp?name1=value1&name2=value2
```

1. 幂等
1. 请求可被缓存
1. 请求保留在浏览器历史记录中
1. 请求可被收藏为书签
1. 请求不应在处理敏感数据时使用
1. 请求有长度限制
1. 请求只应当用于取回数据

2、Post

```TEXT
<!-- 查询字符串（名称/值对）是在 POST 请求的 HTTP 消息主体中发送的 -->
POST /test/demo_form.asp HTTP/1.1
Host: w3schools.com
name1=value1&name2=value2
```

1. 不幂等
1. 请求不会被缓存
1. 请求不会保留在浏览器历史记录中
1. 不能被收藏为书签
1. 请求对数据长度没有要求

| 维度        |   Get   | Post |
| ------------ | ------- | ------- |
| 后退按钮/刷新 | 无害 | 数据会被重新提交（浏览器应该告知用户数据会被重新提交）。 |
| 书签 | 可收藏为书签 | 不可收藏为书签 |
| 缓存 | 能被缓存 | 不能缓存 |
| 编码类型 | `application/x-www-form-urlencoded` | `application/x-www-form-urlencoded` 或 `multipart/form-data`。为二进制数据使用多重编码 |
| 历史 | 参数保留在浏览器历史中 | 参数不会保存在浏览器历史中 |
| 对数据长度的限制 | 是的。当发送数据时，GET 方法向 URL 添加数据；URL 的长度是受限制的（URL 的最大长度是 2048 个字符） | 无限制 |
| 对数据类型的限制 | 只允许 ASCII 字符 | 没有限制。也允许二进制数据 |
| 安全性 | 与 POST 相比，GET 的安全性较差，因为所发送的数据是 URL 的一部分。在发送密码或其他敏感信息时绝不要使用 GET | POST 比 GET 更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中 |
| 可见性 | 数据在 URL 中对所有人都是可见的 | 数据不会显示在 URL 中 |

## 参考链接

1. [HTTP、HTTP2.0、SPDY、HTTPS 你应该知道的一些事](http://www.alloyteam.com/2016/07/httphttp2-0spdyhttps-reading-this-is-enough/) By  TAT.tennylv
2. [HTTPS 科普扫盲帖](https://segmentfault.com/a/1190000004523659) By 程序猿小卡_casper
3. [HTTPS 的中那些加密算法](https://foofish.net/https-symmetric.html) By liuzhijun
4. [HTTPS 为什么更安全，先看这些](https://foofish.net/https-story-1.html) By liuzhijun
5. [OSI 七层模型详解 TCP/IP 协议](http://www.cnblogs.com/jeanschen/p/3762475.html) By jeans chen
6. [TCP 三次握手原理详解](http://www.cnblogs.com/super86/p/3387457.html) By super 86
7. [TCP vs. UDP](https://www.diffen.com/difference/TCP_vs_UDP)
8. [HTTP 请求行、请求头、请求体详解](https://blog.csdn.net/u010256388/article/details/68491509) By 咚浸暖的过去
9. [面试官，不要再问我三次握手和四次挥手](https://juejin.im/post/5d9c284b518825095879e7a5) By 猿人谷

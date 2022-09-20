---
layout: blog
front: true
comments: True
flag: HTTP
background: orange
category: 前端
title: HTTPS & TCP
date:   2018-02-26 18:45:00 GMT+0800 (CST)
update: 2022-09-20 17:25:00 GMT+0800 (CST)
description: add signature & CA
background-image: /style/images/smms/three-way-handshake.png
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

## 加密算法及数字签名

HTTPS 的加密方式主要有以下几种:

| 加密方式 | 描述 | 举个栗子 |
|:-------------|:------------|:-------------|
| **对称加密** | 加密数据用的密钥与解密数据用的密钥一致 | DES、AES、RC5、RC6 |
| **非对称加密** | 加密数据用的密钥(公钥)与解密数据用的密钥(私钥)不一致 | RSA、DH |
| **Hash 算法** | 将任意长度的信息转换为较短的固定长度的值，通常其长度要比信息小得多，且算法不可逆 | MD5、SHA-1、SHA-2、SHA-256 |
| **数字签名及证书** | 用于验证传输的内容是是否为真实服务器发送的数据，并校验数据完整性 | 先将数据给到 SSL/TLS 进行加密，然后再由 TCP 进行传输 |

**对称加密(Symmetric-key algorithm)** 算法加密、解密效率较高，而数据发送方、数据接收方需要协商、共享同一把密钥，并确保密钥不泄露给其他人，因此密钥如何安全的发送给接收方成为了一个问题。

**非对称加密(public-key cryptography)** 可以解决秘钥配送的安全问题，算法性能较低，但是安全性较强，由于其加密特性，非对称加密算法能加密的数据长度也是有限的。基本过程是：Alice 生成一对密钥并将公钥公开，需要向 Alice 发送信息的 Bob 使用该密钥 (Alice 给的公钥) 对机密信息进行加密后再发送给 Alice；Alice 再用自己私钥对加密后的信息进行解密。Alice 想要回复 Bob 时正好相反，使用 Bob 的公钥对数据进行加密，同理，Bob 使用自己的私钥来进行解密。它消除了最终用户交换密钥的需要。

![非对称加密](https://foofish.net/images/public-key.jpg)

> 公钥和私钥理论上是可以互相推导的，但是难度太大，收益不高。

**非对称加密可以保障内容安全性，而数字签名(signature)目的是为了提升解密效率和验证数据的完整性**，试想一下，如果要对较大内容进行加密和解密，耗时是一个问题。操作方式是 Alice 采用 hash 算法对内容生成摘要(digest)，然后通过私钥进行加密，生成数字签名，和原本的内容一起发送出去。当 Bob 在接收信息后，通过公钥解密拿到摘要，同时通过 hash 算法对内容也生成一份摘要做对比，如果一致，说明传输内容没有被篡改。

然而，内容没有被篡改就一定安全吗？Bob 如何识别这个信息一定是 Alice 发的呢？如果 Alice 给 Bob 的公钥已经被 David 劫持更换了呢，David 用自己的私钥给 Bob 发信息，Bob 却浑然不知。

为了解决这个问题，保障公钥不被篡改，于是就引入了**数字证书**，需要找可信的第三方来帮我们签名，即**证书颁布机构（CA）**，CA 会将：证书的颁布机构、有效期、公钥、持有者(subject)等信息用 CA 的私钥进行签名。这样，Alice 就可以去 CA 申请一个证书，然后将自己的证书发给 Bob，那么 Bob 如何验证这个证书确实是 Alice 的呢？当然是使用 CA 的公钥进行验签。CA 的公钥也是需要使用证书来分发的，所以 Bob 的电脑必须安装 CA 的证书，证书里包含了 CA 的公钥。

至此，Alice 发送了三部分信息，“内容 + 数字签名 + 数字证书”，Bob 使用 CA 的公钥进行验证，验证通过即证明这确实是 Alice 发的，也就可以使用证书中包含的 Alice 的公钥，之后流程不变。那么问题又来了，数字证书就一定是可信的吗？答案其实是一定的，毕竟是权威机构，如果这也存在篡改，那世界真的就塌房了。当然，我们也经常会看到证书不可信的提示，原因可能如下：

1. 证书不是权威 CA 颁发
2. 证书过期 - 有效期一般就是一年或者两年的时间，赶紧续签
3. 证书部署错误 - 需要和持有人信息匹配

> 了解更多数字签名和数字证书，可以[参考这里](https://www.ruanyifeng.com/blog/2011/08/what_is_a_digital_signature.html) 👈

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

![OSI.png]( {{site.url}}/style/images/smms/OSI.png )

## TCP

**传输控制协议(TCP)**是一种面向连接的、可靠的、基于字节流的传输层通信协议。它完成第四层传输层所指定的功能。

当传输数据时，TCP 把数据流分割成适当长度的报文段（通常受该计算机连接的网络的数据链路层的**最大传输单元（MTU）**的限制）。之后 TCP 把结果包传给 IP 层，由它来透过网络将包传送给接收端实体的 TCP 层。TCP 为了保证不发生丢包，就给每个包一个序号，同时序号也保证了传送到接收端实体的包的按序接收。然后接收端实体对已成功收到的包发回一个相应的确认信息（ACK）；如果发送端实体在合理的往返时延（RTT）内未收到确认，那么对应的数据包就被假设为已丢失并进行重传。TCP 用一个校验和函数来检验数据是否有错误，在发送和接收时都要计算校验和。

在 TCP 的数据传送状态，很多重要的机制保证了 TCP 的可靠性和强壮性。它们包括：使用序号，对收到的 TCP 报文段进行排序以及检测重复的数据；使用校验和检测报文段的错误，即无错传输；使用确认和计时器来检测和纠正丢包或延时，丢失包的重传等。

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

![三次握手]( {{site.url}}/style/images/smms/three-way-handshake.png )

握手流程：

* **第一次握手**：客户端向服务器端发送连接请求包 SYN(syn=j)，等待服务器回应，这里的 syn 即代表 SEQ 随机序列号，此时确认号无效；
* **第二次握手**：服务器端响应后发送两个包给客户端(组合成单一讯息)，并进入 `SYN_RECV` 状态;
  * 向客户端发送确认自己收到其连接请求的确认包 ACK(ack=j+1)
  * 向客户端发送连接询问请求包 SYN(syn=k)，询问客户端是否已经准备好建立连接
* **第三次握手**：客户端收到服务器的两个包后，向服务器发送连接建立的确认包 ACK(syn=j+1,ack=k+1)，服务器收到后，服务器与客户端进入 `ESTABLISHED` 状态，开始进行数据传送。

```TEXT
Connection set-up uses the SYN flags. They are not used except for connection set-up. The establish a connection the initiator (active open) selects an initial sequence number X and sends a packet with sequence number X and SYN flag 1. The other machine (server, passive open) will select its own initial sequence number Y and will send a packet with sequence number Y, SYN flag 1, acknowledgement number Y+1 and ACK flag 1. The initiator will complete the three way handshake by sending a packet with ACK flag 1 and acknowledgement number Y+1. The connection is now established.
```

#### 为什么三次

那么问题来了，为什么握手是三次，而不是两次或四次呢？

因为 TCP 主要是为了**保证数据可靠传输，又要提高传输的效率**。因此需要找到最少的步骤而达到最可靠最高效的传输，我们可以结合以上步骤[参考知乎这篇回答](https://www.zhihu.com/question/24853633): TCP 的可靠连接是靠 **SEQ(Sequence Numbers)** 序列号来达成的，它是 TCP 表头栏位之一，栏位大小为 32 bits，因此其数值范围为 0 ~ 2^32 – 1。而正是因为每个包都是有序列号的(虽然并不唯一)，所以都能被确认和接收。接收方接收到第一个 SYN 时，没有办法知道这个 SYN 是是否延迟了很久而失效了，因为有可能之前某次请求在某个网络节点长时间的滞留。所以为了安全，接收方一定需要跟发送方确认 SYN，而这个步骤最少就是三步。

![seq](https://s3.notfalse.net/wp-content/uploads/2017/03/12013524/TCP-Header-Format-SEQ.png)

> 简而言之，三次握手的目的：消除旧有连接请求的 SYN 消息对新连接的干扰，同步连接双方的序列号和确认号并交换 TCP 窗口大小信息

#### SEQ 序列号

```TEXT
All bytes in a TCP connection are numbered, beginning at a randomly chosen initial sequence number (ISN). The SYN packets consume one sequence number, so actual data will begin at ISN+1. The sequence number is the byte number of the first byte of data in the TCP packet sent (also called a TCP segment). The acknowledgement number is the sequence number of the next byte the receiver expects to receive. The receiver ack'ing sequence number x acknowledges receipt of all data bytes less than (but not including) byte number x.

The sequence number is always valid. The acknowledgement number is only valid when the ACK flag is one. The only time the ACK flag is not set, that is, the only time there is not a valid acknowledgement number in the TCP header, is during the first packet of connection set-up.
```

> Packets in TCP are called **segments**.

> TCP 使用**确认号(Acknowledgment Number)**栏位，指出下一个期望接收的 SEQ。仅在有 ACK 标志位时生效，即除了第一次连接时发送的包

#### ISN 初始序列号

TCP 协议是不限制一个特定的连接被重复使用的。所以这样就有一个问题：这条连接突然断开重连后，TCP 怎么样识别之前旧链接重发的包？这就需要 **ISN(初始序列号)** 机制。一个新连接建立时，初始序列号生成器会生成一个新的 32 位的 ISN。这个生成器会用一个 32 位长的时钟，差不多 4µs 增长一次，因此 ISN 会在大约 4.55 小时循环一次，而一个分段(segment)在网络中并不会比**最大分段寿命(MSL)**(Maximum Segment Lifetime，默认为 2 分钟)长，MSL 比 4.55 小时要短，所以我们可以认为 ISN 会是唯一的。

还有个问题就是初始序列号之所以是动态的，而不都以 0 开始，就是为了安全起见。试想一下，如果每个新的 TCP 连接 SEQ 是 0，那就很难区分这些请求，也很容易模拟出确认号进行网络劫持。

> An ISN is designed to randomly select a SEQ(sequence number) for the first byte of data transmitted in a new TCP connection.

#### 半连接队列

服务器第一次收到客户端的 SYN 之后，就会处于 `SYN_RECV` 状态，此时双方还没有完全建立其连接，服务器会把此种状态下请求连接放在一个队列里，我们把这种队列称之为**半连接队列**。当然还有一个**全连接队列**，就是已经完成三次握手，建立起连接的就会放在全连接队列中。如果队列满了就有可能会出现丢包现象。这里在补充一点关于 SYN-ACK 重传次数的问题：服务器发送完 SYN-ACK 包，如果未收到客户确认包，服务器进行首次重传，等待一段时间仍未收到客户确认包，进行第二次重传，注意每次重传等待的时间不一定相同。如果重传次数超过系统规定的最大重传次数，系统将该连接信息从半连接队列中删除。

#### SYN 攻击

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

**四次挥手(four-way wavehand)**用来终止 TCP 连接，由于 TCP 的**双全工(full duplex)**特性，TCP 连接时数据在两个方向上能同时传递，因此每个方向必须单独的进行关闭。

![四次挥手]( {{site.url}}/style/images/smms/four-way-wavehand.png )

假设客户端 A 向服务器 B 请求终止 TCP 连接，则挥手流程：

* **第一次挥手**：A 向 B 发送 FIN 包，请求断开 A->B 的连接;
* **第二次挥手**：B 收到 A 发送的 FIN 包，并向 A 发送 ACK 包，A->B 的连接关闭;
* **第三次挥手**：B 向 A 发送 FIN 包，请求断开 B->A 的连接;
* **第四次挥手**：A 收到 B发送的 FIN 包，并向 B 发送 ACK 包，B->A 的连接关闭。

> 第四次挥手时，虽然 A 向 B 发送了确认包，但是 A 此时进入 `TIME_WAIT` 状态，TCP 连接未释放掉，需要经过时间等待计时器设置的时间 2MSL 后，客户端才进入 CLOSED 状态

#### 为什么四次

那么问题来了，第二次和第三次为啥不能整合，只用三次挥手就行了？

因为当服务端收到客户端的 SYN 连接请求报文后，可以直接发送 SYN+ACK 报文。其中 ACK 报文是用来应答的，SYN 报文是用来同步的。但是关闭连接时，当服务端收到 FIN 报文时，很可能并不会立即关闭 SOCKET，所以只能先回复一个 ACK 报文，告诉客户端，"你发的 FIN 报文我收到了"。只有等到我服务端所有的报文都发送完了，我才能发送 FIN 报文，因此不能一起发送。故需要四次挥手。

#### 2MSL 等待状态

为什么 A 要先进入 `TIME_WAIT` 状态，等待 2MSL 时间后才进入 CLOSED 状态？ 目的就是为了保证 B 能收到 A 的确认应答。 若 A 发完确认应答后直接进入 CLOSED 状态，那么如果该应答丢失，B 等待超时后就会重新发送连接释放请求，但此时 A 已经关闭了，不会作出任何响应，因此 B 永远无法正常关闭。

另一方面也是为了防止“已失效的连接请求报文段”出现在本连接中。客户端在发送完最后一个 ACK 报文段后，再经过 2MSL，就可以使本连接持续的时间内所产生的所有报文段都从网络中消失，使下一个新的连接中不会出现这种旧的连接请求报文段。

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

## http 迁移至 https 的一些问题

### HSTS

**HTTP Strict Transport Security**（通常简称为 HSTS）是一个安全功能，它告诉浏览器只能通过 HTTPS 访问当前资源，而不是 HTTP。那么问题来了，如果我们本地开发的确有需要用到 http 的场景呢，一般情况下浏览器会自动给我们重定向到 https，那这样就面临一个是否允许跨域的问题。要想解决这个问题，可以先查下下 MDN 看它是怎么工作的:

当你的网站第一次通过 HTTPS 请求，服务器响应 `Strict-Transport-Security` 头，浏览器记录下这些信息，然后后面尝试访问这个网站的请求都会自动把 HTTP 替换为 HTTPS。每次浏览器接收到 `Strict-Transport-Security` 头，它都会更新这个网站的过期时间，当 HSTS 头设置的过期时间到了，后面通过 HTTP 的访问才恢复到正常模式，不会再自动跳转到 HTTPS。所以在 Chrome、Firefox 等浏览器里，当您尝试访问该域名下的内容时，会产生一个 **307  Internal Redirect**（内部跳转），自动跳转到 HTTPS 请求。

那么我们接下来就知道了，只要清除浏览器的 HSTS 记录即可:

* Safari
  * 完全关闭 Safari
  * 删除 `~/Library/Cookies/HSTS.plist` 这个文件
  * 重新打开 Safari 即可
  * 极少数情况下，需要重启系统
* Chrome
  * 地址栏中输入 `chrome://net-internals/#hsts`
  * 在 Delete domain 中输入 api 域名，并 Delete 删除
  * 可以在 `Query HSTS/PKP domain` 测试是否删除成功

> 当然需要注意的是，清除工作只是临时的，因为下次请求过来，浏览器仍然会继续记录 `Strict-Transport-Security` 这些信息

### 本地启动 https 服务

迁移后，如果本地还是要启动 https 服务，这时候访问的话页面直接会抛出 `This site can’t be reached`，拿 `Create React App` 项目来说，可以参考 [Using HTTPS in Development](https://create-react-app.dev/docs/using-https-in-development/)，我们需要做的是：

1. 在启动脚本中增加 `HTTPS=true` 环境变量，如 `HTTPS=true npm start`;
2. 在启动服务默认端口那里将 80 改为 443;
3. 此时访问页面时，还是会提示页面不安全，继续点击下方不安全的网址直接跳转即可。

> 如果步骤 3 没有显示可跳转的不安全网址，这时候可以直接在页面里(切记不是窗口输入框 😺)输入 **thisisunsafe** 来忽略并继续访问。这是针对每个站点的。因此，如果您键入一次，则只能访问该站点，而所有其他站点都需要进行类似的键入。

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
10. [TCP 序列號 (Sequence Number, SEQ)](https://notfalse.net/26/tcp-seq) By 鄭中勝
11. [一文彻底搞懂加密、数字签名和数字证书！](https://segmentfault.com/a/1190000024523772) By 编程指北

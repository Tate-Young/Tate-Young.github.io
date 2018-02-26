---
layout: blog
front: true
comments: True
flag: HTTP
background: orange
category: 前端
title: HTTPS
# date:   2018-02-21 00:52:00 GMT+0800 (CST)
background-image: https://qph.ec.quoracdn.net/main-qimg-176d344916dc3fef608ebff2c2bb2324.webp
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

![HTTPS](http://tenny.qiniudn.com/HTTPQUBIE2.png)

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

**OSI 模型** 网络七层协议:

| OSI 层 | 描述 | TCP/IP 协议族 |
|:-------------|:------------|:-------------|
| **应用层** | 文件传输，电子邮件，文件服务，虚拟终端 | TFTP，HTTP，SNMP，FTP，SMTP，DNS，Telnet 等 |
| **表示层** | 数据格式化，代码转换，数据加密 | 无 |
| **会话层** | 解除或建立与别的接点的联系 | 无 |
| **传输层** | 提供端对端的接口 | TCP，UDP |
| **网络层** | 为数据包选择路由 | IP，ICMP，OSPF，EIGRP，IGMP |
| **数据链路层** | 传输有地址的帧以及错误检测功能 | SLIP，CSLIP，PPP，MTU |
| **物理层** | 以二进制数据形式在物理媒体上传输数据 | ISO2110，IEEE802，IEEE802.2 |

## TCP

## UDP

## 参考链接

1. [HTTP、HTTP2.0、SPDY、HTTPS 你应该知道的一些事](http://www.alloyteam.com/2016/07/httphttp2-0spdyhttps-reading-this-is-enough/) By  TAT.tennylv
1. [HTTPS 科普扫盲帖](https://segmentfault.com/a/1190000004523659) By 程序猿小卡_casper
1. [HTTPS 的中那些加密算法](https://foofish.net/https-symmetric.html) By liuzhijun
1. [HTTPS 为什么更安全，先看这些](https://foofish.net/https-story-1.html) By liuzhijun
1. [OSI 七层模型详解 TCP/IP 协议](http://www.cnblogs.com/jeanschen/p/3762475.html) By jeans chen
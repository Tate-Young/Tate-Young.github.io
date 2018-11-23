---
layout: blog
tool: true
comments: True
flag: Other
background: green
category: 前端
title: 记各种调试和兼容问题
date:   2018-07-20 11:01:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- Other
---
# {{ page.title }}

## 抓包

### Charles

[Charles](https://www.charlesproxy.com/) 主要的功能包括:

* 截取 Http 和 Https 网络封包
* 支持重发网络请求，方便后端调试
* 支持修改网络请求参数
* 支持网络请求的截获并动态修改 Edit
* 支持模拟慢速网络 Throttle

在做移动开发时，常常需要截取网络封包来分析，更多使用方法可[参考这里](https://blog.devtang.com/2015/11/14/charles-introduction/):

1、在 Charles 设置代理，端口默认为 8888

[![charles-proxy.png](https://i.loli.net/2018/07/20/5b5141425a210.png)](https://i.loli.net/2018/07/20/5b5141425a210.png)

2、在 移动端 设置代理，服务器地址即是本机的 ip 地址，端口号即在步骤 1 中设置的 Charles 代理端口号

[![charles-iphone-proxy.jpg](https://i.loli.net/2018/07/20/5b5141421339c.jpg)](https://i.loli.net/2018/07/20/5b5141421339c.jpg)

若针对 https 抓包:

1、首先在<code>Help --> SSL Proxying --> Install Charles Root Certificate</code>安装根证书;

2、在钥匙串中选择始终信任:

![debugger-charles-ssl.png](https://i.loli.net/2018/11/23/5bf7700990d1e.png)

3、其次点击<code>Help --> SSL Proxying --> Install Charles Root Certificate ... or Remote Browser</code>，按照提示在手机等设备安装证书，网址 <code>chls.pro/ssl</code>，切记安装完后，ios 一般要在 <code>设置 --> 通用 --> 关于本机 --> 证书信任设置</code> 里设置证书启用完全信任:

![debugger-charles-ssl-device.png](https://i.loli.net/2018/11/23/5bf770e96b33b.png)

4、点击<code>Proxy --> SSL Proxying Settings</code>进行 SSL 代理设置，https 端口设置 443:

![debugger-charles-ssl-settings.png](https://i.loli.net/2018/11/23/5bf7740529688.png)

### mitmproxy

1、安装和设置代理

```SHELL
brew install mitmproxy
```

2、启动服务，端口默认为 8080

```SHELL
mitmproxy -p 8888
```

3、在 移动端 设置代理，同上

4、在 移动端 安装 CA 证书(https 抓包)，直接在浏览器输入地址 <code>mitm.it</code> 并安装对应证书即可

![debugger-mitmproxy.jpg](https://i.loli.net/2018/11/16/5bedb616ee92d.jpg)

常用的快捷键操作:

| 快捷键           | 描述      |
| ------------ | ------- |
| q | 返回 |
| z | 清空 |
| f | 过滤 filter |
| i | 拦截 intercept |
| r | 重新请求 |
| esc | 退出编辑 |

## 手机网页调试

### IOS

1、直接打开<code>设置 --> safari 浏览器 --> 高级 --> Web 检查器/Javascript</code>;

2、将手机连接至电脑，在 safari 开发者模式下调试就 OK 了。

### android

1、一般是打开<code>设置 --> 开发者选项 --> USB 调试</code>;

2、在 chrome 浏览器输入 <code>chrome://inspect/#devices</code> 打开 inspect 调试器，上面会显示所连接的设备上的页面，点击 inspect 就可以调试啦。

![debugger-inspect.png](https://i.loli.net/2018/11/22/5bf616017176c.png)

## safari

### 事件监听点击失效

比如存在如下标签，绑定了事件监听:

```HTML
<div>按钮</div>
```

在手机 safari 浏览器中点击该按钮会发现无法触发点击事件，解决方案如下:

* 直接在按钮上绑定事件处理器
* 在 div 上添加样式 <code>cursor: pointer</code>
* 给 div 上加 <code>onclick='void(0);'</code>
* 将 div 换成其他可点击元素 a、button 等

## 小技巧

### ID 生成器

```JS
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};
```

> 未完待续

1. [Charles 从入门到精通](https://blog.devtang.com/2015/11/14/charles-introduction/) By 唐巧
2. [iOS Safari 点击事件失效](https://blog.zfanw.com/ios-safari-click-not-working/) By 陈三
3. [ID - a unique ID/name generator for JavaScript](https://gist.github.com/gordonbrander/2230317) By gordonbrander
4. [Charles](https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/)

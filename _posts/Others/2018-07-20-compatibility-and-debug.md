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

## Charles 抓包

[Charles](https://www.charlesproxy.com/) 主要的功能包括:

* 截取 Http 和 Https 网络封包
* 支持重发网络请求，方便后端调试
* 支持修改网络请求参数
* 支持网络请求的截获并动态修改 Edit
* 支持模拟慢速网络 Throttle

在做移动开发时，常常需要截取网络封包来分析，更多使用方法可[参考这里](https://blog.devtang.com/2015/11/14/charles-introduction/):

1、在 Charles 设置代理，默认为 8888

[![charles-proxy.png](https://i.loli.net/2018/07/20/5b5141425a210.png)](https://i.loli.net/2018/07/20/5b5141425a210.png)

2、在 移动端 设置代理，服务器地址即是本机的 ip 地址，端口号即在步骤 1 中设置的 Charles 代理端口号

[![charles-iphone-proxy.jpg](https://i.loli.net/2018/07/20/5b5141421339c.jpg)](https://i.loli.net/2018/07/20/5b5141421339c.jpg)

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

> 未完待续

1. [Charles 从入门到精通](https://blog.devtang.com/2015/11/14/charles-introduction/) By 唐巧
2. [iOS Safari 点击事件失效](https://blog.zfanw.com/ios-safari-click-not-working/) By 陈三

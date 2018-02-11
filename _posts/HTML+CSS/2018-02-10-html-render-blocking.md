---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端
title:  加载阻塞
date:   2018-02-11 11:38:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- html
---
# {{ page.title }}

## CSS阻塞

CSS 属于 **render blocking resource**，无论外链或内联，都会阻塞渲染树的渲染。一般情况下，CSS 会延迟脚本执行和 DOMContentLoaded 事件。

```HTML
<body>
  <h1>Tate</h1>
  <script>
    function print(){
        console.log('first print', document.querySelectorAll('h1'));
    }
    print();
    setTimeout(print);
  </script>
  <!-- 外链 -->
  <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <h1>Snow</h1>
  <!-- 内联 -->
  <script> console.log('second print'); </script>
  <style> h1{color: orange;} </style>
</body>
```

当注释掉 CSS 外链时，打印顺序为

```js
first print NodeList [h1]
// 页面出现 h1 标签内容，即渲染完成
second print
first print NodeList(2) [h1, h1] // 异步
```

当加载 CSS 样式文件时，此时通过 Chrome Network 调试工具勾选 "Disabled cache"，再设置 "Throtting" 来模拟缓慢网络下的加载过程。打印顺序为

```js
first print NodeList [h1]
first print NodeList(2) [h1, h1]
// ---------------加载和解析 CSS 文件中，延迟---------------
// 页面出现 h1 标签内容，即渲染完成
second print
```

因此可看出

* CSS 加载延迟了后续脚本的加载;
* 加载样式文件时，渲染一直未完成，说明 CSS 阻塞渲染;
* 第一次打印为 h1，说明 JS 会阻塞后续的解析和渲染，以及其他资源的加载;
* 第二次打印为 h1 和 h2，说明 CSS 不阻塞 DOM 的解析;

> 利用媒体类型和查询来解除 CSS 对渲染的阻塞，详见[上一节页面渲染]( {{site.url}}/2018/02/10/html-how-browsers-work.html#%E9%98%BB%E5%A1%9E%E6%B8%B2%E6%9F%93 )。

## JS阻塞

### 阻塞 DOM 解析

* JS 属于 **parser blocking resource**;
* 立即加载和执行;
* 除非将 JavaScript 显式声明为异步，否则它会阻止构建 DOM 和后续的渲染。

```HTML
<body>
  <h1>Tate</h1>
  <script>
    function print(){
        console.log('first print', document.querySelectorAll('h1'));
    }
    print();
    setTimeout(print);
  </script>
  <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <h1>Snow</h1>
  <script> console.log('second print'); </script>
  <style> h1{color: orange;} </style>
</body>
```

打印顺序为

```js
first print NodeList [h1]
first print NodeList [h1]
// 页面出现 'Tate'
// ---------------加载和执行 JS 文件中，延迟---------------
// 页面出现 'Snow'
second print
```

因此可看出

* JS 文件同步加载和执行。
* JS 会阻塞后续的解析和渲染，以及其他资源的加载;

![script](https://bitsofco.de/content/images/2017/02/Normal-Execution.png)

> 样式表、图片等资源文件的下载不会暂停 DOM 解析。浏览器会并行地下载这些文件，但通常会限制并发下载数。

### 延迟脚本 defer

立即下载，但脚本会延迟到整个页面都解析完毕后再运行。

```HTML
<!-- 只适用于外链 -->
<script defer src="script.js">
<!-- 内联无效 -->
<script defer> console.log('defer'); </script>
```

![script-defer](https://bitsofco.de/content/images/2017/02/Defer-Execution.png)

### 异步脚本 async

立即下载，期间不会阻塞 DOM 解析，等下载完成并执行时，才会阻塞解析。

```HTML
<!-- 只适用于外链 -->
<script async src="script.js">
<!-- 内联无效 -->
<script async> console.log('async'); </script>
```

![script-async](https://bitsofco.de/content/images/2017/02/Async-Execution.png)

> 延迟和异步脚本一定会在 load 事件前执行，但可能在 DOMContentLoaded 事件触发之前或之后执行。

## 参考链接

1. [Google-使用 JavaScript 添加交互](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript)
1. [Asynchronous vs Deferred JavaScript](https://bitsofco.de/async-vs-defer/)
1. [CSS/JS对DOM渲染的影响](http://harttle.land/2016/11/26/static-dom-render-blocking.html)
1. [异步脚本载入提高页面性能](http://harttle.land/2016/05/18/async-javascript-loading.html)
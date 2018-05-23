---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端
title:  页面生命周期
date:   2018-02-11 17:33:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- html
---
# {{ page.title }}

页面事件的生命周期：

* **DOMContentLoaded** 事件在 DOM 树解析完成后被触发。
* **load** 事件在页面所有资源被加载完毕后触发。
* **beforeunload** 在用户即将离开页面时触发，它返回一个字符串，浏览器会向用户展示并询问这个字符串以确定是否离开。
* **unload** 在用户已经离开时触发。
* **document.readyState** 表示页面的加载状态，可以在 **readystatechange** 中追踪页面的变化状态：
  * **loading** — 页面正在加载中。
  * **interactive** -- 页面解析完毕，和 DOMContentLoaded 几乎同时发生，不过顺序在它之前。
  * **complete** -- 页面上的资源都已加载完毕，和 window.onload 几乎同时发生，不过顺序在他之前。

## DOMContentLoaded

[上一节加载阻塞]( {{site.url}}/2018/02/11/html-render-blocking.html )已解释过，CSS的加载或阻塞 DOM 解析的行为都可以延迟 DOMContentLoaded 事件的执行。此时 async 和 defer 的脚本可能还没有执行。图片及其他资源文件可能还在下载中。

```js
// 通过事件监听可以捕获
document.addEventListener("DOMContentLoaded", readyFn);
```

## window.onload

window 对象上的 **onload** 事件在所有文件包括样式表，图片和其他资源下载完毕后触发。

## window.onunload

window 对象上的 **onunload** 会在用户已离开页面的时候触发。这个阶段仅可以做一些没有延迟的操作，由于种种限制，很少被使用。

## window.onbeforeunload

window 对象上的 **onbeforeunload** 会在用户即将离开页面或者关闭窗口时触发。

```js
// 通常用于离开页面时候的提示
window.onbeforeunload = function() {
  return "There are unsaved changes. Leave now?";
};
```

## readyState

**document.readyState** 属性提供我们文档加载的信息，可以追踪页面加载的情况，有三个可能的值：

* loading - document 仍在加载。
* interactive - 文档已解析完成，但是诸如图像、样式表和框架之类的子资源可能仍在加载。
* complete - 文档和所有子资源已完成加载。表示 load 事件即将被触发。

每当文档的加载状态改变的时候就有一个 **readystatechange** 事件被触发。

```HTML
<script>
  var n = 1;
  function log(text){console.log(n + ': ' + text);n++; }
  log('initial readyState:' + document.readyState);

  document.addEventListener('readystatechange', () => log('readyState:' + document.readyState));
  document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));

  window.onload = () => log('window onload');
</script>

<iframe src="iframe.html" onload="log('iframe onload')"></iframe>

<img src="http://en.js.cx/clipart/train.gif" id="img">
<script>
  img.onload = () => log('img onload');
</script>
```

打印如下:

```js
1: initial readyState:loading
2: readyState:interactive
3: DOMContentLoaded
4: iframe onload
5: img onload
6: readyState:complete
7: window onload
```

## $.ready

实现大概思路:

```js
document.ready = function(callback) {
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
      document.removeEventListener('DOMContentLoaded', arguments.callee, false);
      callback();
    }, false);
  }else if (document.attachEvent) { // 兼容 ie
    document.attachEvent('onreadytstatechange', function() {
      if (document.readyState == "complete") {
        document.detachEvent("onreadystatechange", arguments.callee);
        callback();
      }
    });
  }
}
```

## 参考链接

1. [Page lifecycle: DOMContentLoaded, load, beforeunload, unload](http://javascript.info/onload-ondomcontentloaded#domcontentloaded)

---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  页面可见性 API
date:   2018-03-06 12:40:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- JavaScript
---
# {{ page.title }}

## 什么是页面可见性

合理的页面可见性优化是在用户使用切换标签等方式来浏览网页时，任何在后台页面都不应该展示给用户，使用场景:

* 网站有图片轮播效果，只有在用户观看轮播的时候，才会自动展示下一张幻灯片
* 显示信息仪表盘的应用程序不希望在页面不可见时轮询服务器进行更新
* 页面想要检测是否正在渲染，以便可以准确的计算网页浏览量
* 当设备进入待机模式时，网站想要关闭设备声音

## onfocus / onblur

之前的做法通常采用 **onfocus** / **onblur** 来监听用户与页面的交互。但缺点是如果存在另一个窗口显示且聚焦时，之前的窗口会触发失去焦点事件。

```JS
// 当前窗口得到焦点
window.onfocus = function() {
  // 动画
  // ajax 轮询等
};
```

## Page Visibility API

**Page Visibility API** 可以有效的解决上述问题，该 API 由以下三部分组成:

* **document.hidden** - 表示页面是否隐藏的布尔值。页面隐藏包括 浏览器最小化 或者 页面在后台标签页中(页面遮盖不包含在内)
* **document.visibilityState** - 表示下面 4 个可能状态的值
  * hidden：页面在后台标签页中或者浏览器最小化
  * visible：页面在前台标签页中
  * prerender：页面在屏幕外执行预渲染处理，此时 document.hidden 为 true
  * unloaded：页面正在从内存中卸载
* **visibilitychange** - 浏览器标签页被隐藏或显示的时候会触发该事件

以下为视频播放标签页切换示例:

<video id="videoElement" controls="" poster="thumbnail.jpg">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-Mobile.mp4" type="video/mp4" media="all and (max-width:680px)">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-Mobile.webm" type="video/webm" media="all and (max-width:680px)">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-SD.mp4" type="video/mp4">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-SD.webm" type="video/webm">
  <p>Sorry, there's a problem playing this video. Please try using a different browser.</p>
</video>

<script>
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

var videoElement = document.getElementById("videoElement");

function handleVisibilityChange() {
  if (document[hidden]) {
    videoElement.pause(); // 如果页面是隐藏状态，则暂停视频
  } else {
    videoElement.play(); // 如果页面是展示状态，则播放视频
  }
}

// 如果浏览器不支持addEventListener 或 Page Visibility API 给出警告
if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  // 处理页面可见属性的改变
  document.addEventListener(visibilityChange, handleVisibilityChange, false);

  // 当视频暂停，设置title
  // This shows the paused
  videoElement.addEventListener("pause", function () {
    document.title = 'Paused';
  }, false);

  // 当视频播放，设置title
  videoElement.addEventListener("play", function () {
    document.title = 'Playing';
  }, false);
}
</script>

```HTML
<video id="videoElement" controls="" poster="thumbnail.jpg">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-Mobile.mp4" type="video/mp4" media="all and (max-width:680px)">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-Mobile.webm" type="video/webm" media="all and (max-width:680px)">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-SD.mp4" type="video/mp4">
  <source src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-SD.webm" type="video/webm">
  <p>Sorry, there's a problem playing this video. Please try using a different browser.</p>
</video>
```

```JS
// 兼容性
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

var videoElement = document.getElementById("videoElement");

function handleVisibilityChange() {
  if (document[hidden]) {
    videoElement.pause(); // 如果页面是隐藏状态，则暂停视频
  } else {
    videoElement.play(); // 如果页面是展示状态，则播放视频
  }
}

// 如果浏览器不支持addEventListener 或 Page Visibility API 给出警告
if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  // 处理页面可见属性的改变
  document.addEventListener(visibilityChange, handleVisibilityChange, false);

  // 当视频暂停，设置title
  // This shows the paused
  videoElement.addEventListener("pause", function () {
    document.title = 'Paused';
  }, false);

  // 当视频播放，设置title
  videoElement.addEventListener("play", function () {
    document.title = 'Playing';
  }, false);
}
```

> [在线视频例子](http://daniemon.com/tech/webapps/page-visibility/) 👈👈👈

## 参考链接

1. [MDN - Page Visibility API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API)

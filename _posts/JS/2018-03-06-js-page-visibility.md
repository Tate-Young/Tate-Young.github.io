---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  页面可见性 API
date:   2018-03-06 12:40:00 GMT+0800 (CST)
update: 2019-10-11 18:49:00 GMT+0800 (CST)
background-image: /style/images/js.png
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
  * prerender：页面在屏幕外执行预渲染处理，此时 `document.hidden` 为 true
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

## Page Lifecycle API

场景：Android、iOS 和最新的 Windows 系统可以随时自主地停止后台进程，及时释放系统资源。也就是说，网页可能随时被系统丢弃掉。Page Visibility API 只在网页对用户不可见时触发，至于网页会不会被系统丢弃掉，它就无能为力了。因此 W3C 新制定了一个 [**Page Lifecycle API**](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)，统一了网页从诞生到卸载的行为模式，并且定义了新的事件，允许开发者响应网页状态的各种转换。首先我们看生命周期:

| state        |   描述   |
| ------------ | ------- |
| **Active** | 网页处于可见状态，有输入焦点 |
| **Passive** | 网页处于可见状态，无输入焦点 |
| **Hidden** | 网页不可见，但尚未冻结 |
| **Frozen** | 如果网页处于 Hidden 阶段的时间过久或者可见状态下长时间不操作，用户又不关闭网页，浏览器就有可能冻结网页。这个阶段的特征是，网页不会再被分配 CPU 计算资源。定时器、回调函数、网络请求、DOM 操作都不会执行，不过正在运行的任务会执行完 |
| **Terminated** | 网页被浏览器内存所卸载和清除，一般是用户主动操作 |
| **Discarded** | 浏览器自动卸载网页，清除该网页的内存占用，一般是在用户没有介入的情况下，由系统强制执行 |

![page lifecycle](https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png)

接下来总结下事件:

| event        |   描述   | 状态可能变化 |
| ------------ | ------- | ------ |
| **focus** | 页面获得输入焦点时触发 | Passive --> Active |
| **blur** | 页面失去输入焦点时触发 | Active --> Passive |
| **visibilitychange** | 网页可见状态发生变化时触发 | |
| **freeze** | 网页进入 Frozen 阶段时触发 | hidden --> Frozen |
| **resume** | 网页离开 Frozen 阶段，变为 Active / Passive / Hidden 阶段时触发 | Frozen --> Active / Passive / Hidden |
| **pageshow** | 只跟浏览器的 History 记录的变化有关。用户加载网页时触发。有可能是全新的页面加载，也可能是从缓存中获取的页面。如果是从缓存中获取，则该事件对象的 event.persisted 属性为 true，否则为 false | Frozen --> Active / Passive / Hidden |
| **pagehide** | 只跟浏览器的 History 记录的变化有关。用户离开当前网页、进入另一个网页时触发。如果浏览器能够将当前页面添加到缓存以供稍后重用，则事件对象的 event.persisted 属性为 true。 如果为 true 且页面添加到了缓存，则页面进入 Frozen 状态，否则进入 Terminatied 状态 | hidden --> Frozen / Terminated |
| **beforeunload** | 页面即将卸载时触发 | hidden --> Terminated |
| **unload** | 页面正在卸载时触发 | hidden --> Terminated |

在 Chrome68 版本中，新增了 `document.wasDiscarded` 来判断页面是否被丢弃:

```JS
if (document.wasDiscarded) {
  // Page was previously discarded by the browser while in a hidden tab.
}
```

另外通过 **visibilityState** 属性，我们可以直接判断当前网页是否处于 Active、Passive 或 Hidden 阶段:

```JS
const getState = () => {
  if (document.visibilityState === 'hidden') {
    return 'hidden'
  }
  if (document.hasFocus()) {
    return 'active'
  }
  return 'passive'
}
```

如果网页处于 `Frozen` 和 `Terminated` 状态，由于定时器代码不会执行，只能通过事件监听判断状态。进入 Frozen 阶段，可以监听 `freeze` 事件；进入 Terminated 阶段，可以监听 `pagehide` 事件。因此我们可以通过下列代码来监听不同状态:

```JS
// Stores the initial state using the `getState()` function (defined above).
let state = getState();

// Accepts a next state and, if there's been a state change, logs the
// change to the console. It also updates the `state` value defined above.
const logStateChange = (nextState) => {
  const prevState = state;
  if (nextState !== prevState) {
    console.log(`State change: ${prevState} >>> ${nextState}`);
    state = nextState;
  }
};

// These lifecycle events can all use the same listener to observe state
// changes (they call the `getState()` function to determine the next state).
['pageshow', 'focus', 'blur', 'visibilitychange', 'resume'].forEach((type) => {
  window.addEventListener(type, () => logStateChange(getState()), {capture: true});
});

// The next two listeners, on the other hand, can determine the next
// state from the event itself.
window.addEventListener('freeze', () => {
  // In the freeze event, the next state is always frozen.
  logStateChange('frozen');
}, {capture: true});

window.addEventListener('pagehide', (event) => {
  if (event.persisted) {
    // If the event's persisted property is `true` the page is about
    // to enter the page navigation cache, which is also in the frozen state.
    logStateChange('frozen');
  } else {
    // If the event's persisted property is not `true` the page is
    // about to be unloaded.
    logStateChange('terminated');
  }
}, {capture: true});
```

## 参考链接

1. [MDN - Page Visibility API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API)
2. [Google Developer - Page Lifecycle API](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)
3. [Page Lifecycle API 教程](http://www.ruanyifeng.com/blog/2018/11/page_lifecycle_api.html) By 阮一峰

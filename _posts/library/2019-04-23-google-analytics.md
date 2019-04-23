---
layout: blog
tool: true
comments: True
flag: JS
background: green
category: 前端
title:  Google Analytics 埋点
date:   2019-04-24 00:08:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/04/23/5cbf2ec3702de.png
tags:
- js
- ga
---
<!-- markdownlint-disable MD024 -->
# {{ page.title }}

## 什么是 Google Analytics

**Google Analytics** 是一个多平台埋点分析工具，即只要在平台上添加相关的追踪代码(tracking code)，GA 就可以监测和收集使用者在平台上的各种行为资料，比如页面停留时长、访问次序、点击了哪些内部链接等等。下面只是针对 JS 来添加 SDK，这里介绍两种方式: `analytics.js` 和 `gtag.js`。

## analytics.js

### 引入

将 `GA_TRACKING_ID` 替换为接收您数据的 Google Analytics **媒体资源 ID**。每个网页只需要一个全局代码段。

```JS
<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-XXXXX-Y', 'auto'); // 创建跟踪器对象
ga('send', 'pageview'); // 发送当前网页的浏览数据
</script>
<!-- End Google Analytics -->
```

虽然上述 JavaScript 跟踪代码段可以确保该脚本在所有浏览器中加载和异步执行，但不足之处是不能让新型浏览器预加载该脚本:

```JS
<!-- Google Analytics -->
<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>
<!-- End Google Analytics -->
```

> 提示：如果您不知道自己的媒体资源 ID，可使用[帐号浏览器查找](https://ga-dev-tools.appspot.com/account-explorer/?hl=zh-cn) 👈

![ga-tracking-id.png](https://i.loli.net/2019/04/23/5cbefb4f30659.png)

> 另外全局变量 ga 可以修改，[详情可参考这里](https://developers.google.com/analytics/devguides/collection/analyticsjs/renaming-the-ga-object?hl=zh-cn) 👈

### 创建跟踪器

上面的全局 **ga** 函数又称为**命令队列**，是因为该函数不会立即执行其中的命令，而是将这些命令加入到队列中，将这些命令的执行延迟到 analytics.js 库加载完成后进行。那我们是如何收集和存储数据的呢，就是通过**跟踪器对象**，可以通过 `create` 方法来创建:

```JS
// 将跟踪 ID 和 Cookie 网域字段分别作为第二个和第三个参数传递给该命令：
ga('create', 'UA-XXXXX-Y', 'auto'); // 默认跟踪器

// 还可以选择传递字段对象，通过这种方式可以在创建时设置任何 analytics.js 字段
// 以便将这些字段存储在跟踪器中并应用于所有要发送的匹配
ga('create', 'UA-XXXXX-Y', 'auto', 'myTracker', {
  userId: '12345'
});

// 也可使用字段对象一次指定所有字段
ga('create', {
  trackingId: 'UA-XXXXX-Y',
  cookieDomain: 'auto',
  name: 'myTracker',
  userId: '12345'
});
```

> 一般推荐 **cookieDomain** 字段设置为字符串 'auto'[，详情可以查看这里](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id?hl=zh-cn) 👈

在一些情况下，您可能想要从单个页面发送数据到多个媒体资源。这对由多名负责人分别管理各个版块的网站非常有用；每名负责人都可以查看自己的媒体资源:

```JS
ga('create', 'UA-XXXXX-Y', 'auto');
ga('create', 'UA-XXXXX-Z', 'auto', 'clientTracker');
```

然后我们可以针对特定跟踪器执行命令:

```JS
ga('send', 'pageview');
ga('clientTracker.send', 'pageview'); // 使用指定的跟踪器
```

> 我们也可以通过 ga 对象方法获取跟踪器，[详情查看这里](https://developers.google.com/analytics/devguides/collection/analyticsjs/accessing-trackers?hl=zh-cn) 👈

### 网页跟踪

可以通过网页跟踪来衡量网站上特定网页获得的浏览次数，使用 **send** 命令并将 **hitType** 指定为 **pageview** 来发送网页浏览命中。对于 pageview 命中类型，send 命令会使用以下签名:

| 字段 | 描述 |
|:--------------|:---------|
| **title** | 文字 | 否 | 网页的标题（例如“首页”）|
| **location** | text | 否 * | 所跟踪网页的网址 |
| **page** | text | 否 * | 网址的路径部分。此值应以斜杠 (/) 字符开头 |

```JS
ga('send', 'pageview', [page], [fieldsObject]);
```

```JS
ga('send', 'pageview', location.pathname);

// or
ga('send', {
  hitType: 'pageview',
  page: location.pathname
});
```

### 事件跟踪

“事件”是指用户与内容进行的互动，可以独立于网页或屏幕的加载而进行衡量，可以使用 **send** 命令并将 **hitType** 指定为 **event** 来发送事件匹配。用于发送 event 匹配类型的 send 命令使用以下签名:

| 字段 | 描述 |
|:--------------|:---------|
| **eventCategory** | text | 是 | 通常是用户与之互动的对象（例如 'Video'）|
| **eventAction** | 文字 | 是 | 互动类型（例如 'play'）|
| **eventLabel** | text | 否 | 用于对事件进行分类（例如 'Fall Campaign'）|
| **eventValue** | 整数 | 否 | 与事件相关的数值（例如 42）|

```JS
ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
```

比如以下命令向 Google Analytics 发送一个事件，指明用户播放了秋季广告系列推广视频:

```JS
ga('send', 'event', 'Videos', 'play', 'Fall Campaign');

// or
ga('send', {
  hitType: 'event',
  eventCategory: 'Videos',
  eventAction: 'play',
  eventLabel: 'Fall Campaign'
});
```

### 应用/屏幕跟踪

通过衡量屏幕浏览量，您可以了解用户浏览最多的是哪些内容，以及他们如何在不同的内容之间跳转。可以通过使用 **send** 命令并将 **hitType** 指定为 **screenview** 来发送屏幕匹配。对于 screenview 匹配类型，send 命令会使用以下签名:

```JS
ga('send', 'screenview', [fieldsObject]);
```

比如以下命令向 Google Analytics 发送了一个屏幕浏览匹配，应用名为“myAppName”，屏幕为“Home”:

```JS
ga('send', 'screenview', {
  'appName': 'myAppName', // 应用名称，必填
  'screenName': 'Home' // 屏幕名称，必填
});
```

由于发送所有应用匹配时都必须包含 appName 字段，一般来说最好使用 **set** 命令设置该字:

```JS
ga('create', 'GA_MEASUREMENT_ID', 'auto');
ga('set', 'appName', 'myAppName');

// The `appName` field is now set, so screenview hits don't need to include it.
ga('send', 'screenview', { screenName: 'Home' });
```

### 用户计时

可以使用 **send** 命令并将 **hitType** 指定为 **timing** 来发送用户计时匹配。用于发送 timing 匹配类型的 send 命令使用以下签名:

| 字段 | 描述 |
|:--------------|:---------|
| **timingCategory** | text | 是 | 用于将所有用户计时变量归类到相应逻辑组的字符串（例如 'JS Dependencies'）|
| **timingVar** | text | 是 | 用于标识要记录的变量（例如 'load'）的字符串 |
| **timingValue** | integer | 是 | 向 Google Analytics（分析）报告的，以毫秒为单位的历时时间（例如 20）|
| **timingLabel** | text | 否 | 可用于提高报告中显示用户计时数据灵活性的字符串（例如 'Google CDN'）|

```JS
ga('send', 'timing', [timingCategory], [timingVar], [timingValue], [timingLabel], [fieldsObject]);
```

比如以下命令向 Google Analytics 发送用户计时匹配，指明当前网页加载其所有外部 JavaScript 依赖关系耗时 3549 毫秒:

```JS
ga('send', 'timing', 'JS Dependencies', 'load', 3549);

// or
ga('send', {
  hitType: 'timing',
  timingCategory: 'JS Dependencies',
  timingVar: 'load',
  timingValue: 3549
});
```

对于衡量时间的方法，可以采用 [**performance.now()**](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now) 方法，该方法返回从网页最初开始加载到目前为止的时长:

```js
// Feature detects Navigation Timing API support.
if (window.performance) {
  // Gets the number of milliseconds since page load
  // (and rounds the result since the value must be an integer).
  var timeSincePageLoad = Math.round(performance.now());

  // Sends the timing hit to Google Analytics.
  ga('send', 'timing', 'JS Dependencies', 'load', timeSincePageLoad);
}
```

### 自定义维度和指标

网络开发者可以使用自定义维度和指标来细分并衡量登录和退出的用户之间、网页作者之间、游戏中的关卡之间或页面上存在的任何其他业务数据之间的差异:

| 字段 | 描述 |
|:--------------|:---------|
| **dimension**[0-9]+ | text | 否 | 维度索引。每个自定义维度都有关联的索引。自定义维度最多可以有 20 个（Analytics 360 帐号为 200 个）。索引后缀必须是大于 0 的正整数（如 dimension3）|
| **metric**[0-9]+ | integer | 否 | 指标索引。每个自定义指标都有关联的索引。自定义指标最多可以有 20 个（Analytics 360 帐号为 200 个）。索引后缀必须是大于 0 的正整数（如 metric5）|

自定义维度或指标数据只能与现有的匹配一起发送。例如，要为 pageview 类型的匹配发送索引为 15 的自定义维度:

```JS
ga('send', 'pageview', {
  'dimension15':  'My Custom Dimension'
});

// 在某些情况下，您可能想要将某个自定义维度或指标与指定网页上的所有匹配一起发送
ga('set', 'dimension5', 'custom data');
```

### beacon

默认情况下，analytics.js 会选择 HTTP 方法和传输机制以优化匹配的发送。使用这种机制时有三种选项，分别为:

* **image** - 使用 Image 对象
* **xhr** - 使用 XMLHttpRequest 对象
* **beacon** -使用新的 [**navigator.sendBeacon**](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon) 方法

前两种方法都具有上一部分所描述的问题（如果遇到网页卸载的情况匹配往往无法发送）。相比之下，navigator.sendBeacon 方法则是为解决此问题而创建的全新 HTML 功能

```JS
ga('create', 'UA-XXXXX-Y', 'auto');

// Updates the tracker to use `navigator.sendBeacon` if available.
ga('set', 'transport', 'beacon');
```

或者我们也可以单独设置:

```JS
ga('send', 'event', {
  eventCategory: 'Outbound Link',
  eventAction: 'click',
  eventLabel: event.target.href,
  transport: 'beacon'
});
```

### 实现异步回调 hitCallback

要在匹配发送完成时收到通知，您需要设置 **hitCallback** 字段。hitCallback 是一个函数，当匹配发送成功时该函数会立即得到调用，但存在一个严重问题：如果（无论是由于何种原因）无法加载 analytics.js 库，则 hitCallback 函数将永远无法运行。如果 hitCallback 函数无法运行，用户将永远无法提交表单。以下示例同时也处理了超时的情况:

```JS
// Gets a reference to the form element, assuming
// it contains the id attribute "signup-form".
var form = document.getElementById('signup-form');

// Adds a listener for the "submit" event.
form.addEventListener('submit', function(event) {

  // Prevents the browser from submitting the form
  // and thus unloading the current page.
  event.preventDefault();

  // Creates a timeout to call `submitForm` after one second.
  setTimeout(submitForm, 1000);

  // Keeps track of whether or not the form has been submitted.
  // This prevents the form from being submitted twice in cases
  // where `hitCallback` fires normally.
  var formSubmitted = false;

  function submitForm() {
    if (!formSubmitted) {
      formSubmitted = true;
      form.submit();
    }
  }

  // Sends the event to Google Analytics and
  // resubmits the form once the hit is done.
  ga('send', 'event', 'Signup Form', 'submit', {
    hitCallback: submitForm
  });
});
```

如果您在整个网站中多处使用了上述处理模式，则创建一个辅助函数来处理超时更为方便:

```JS
function createFunctionWithTimeout(callback, opt_timeout) {
  var called = false;
  function fn() {
    if (!called) {
      called = true;
      callback();
    }
  }
  setTimeout(fn, opt_timeout || 1000);
  return fn;
}
```

```JS
// Gets a reference to the form element, assuming
// it contains the id attribute "signup-form".
var form = document.getElementById('signup-form');

// Adds a listener for the "submit" event.
form.addEventListener('submit', function(event) {

  // Prevents the browser from submitting the form
  // and thus unloading the current page.
  event.preventDefault();

  // Sends the event to Google Analytics and
  // resubmits the form once the hit is done.
  ga('send', 'event', 'Signup Form', 'submit', {
    hitCallback: createFunctionWithTimeout(function() {
      form.submit();
    })
  });
});
```

## gtag

### 引入

同样，我们需要安装全局追踪代码片段:

```JS
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GA_TRACKING_ID');
</script>
```

此代码段的默认操作是向 Google Analytics 发送网页浏览匹配。大多数情况下这符合用户要求，当然也可以取消:

```JS
gtag('config', 'GA_TRACKING_ID', { 'send_page_view': false });
```

要设置随网页的每个事件发送的值，请使用要发送的值更新媒体资源的 config，以下是设置一些永久性值的方法:

```JS
gtag('config', 'GA_TRACKING_ID', {
  'currency': 'USD',
  'country': 'US'
});
```

如果要在一个页面上配置多个媒体资源，那么，使用 set 命令可提高效率:

```JS
gtag('set', {
  'currency': 'USD',
  'country': 'US'
});
gtag('config', 'GA_TRACKING_ID_1');
gtag('config', 'GA_TRACKING_ID_2');
```

### 网页跟踪

gtag 使用 **config** 命令发送网页浏览，字段和 ga 类似:

| 字段 | 描述 |
|:--------------|:---------|
| **page_title** | 文字 | 否 | 网页的标题（例如“首页”）|
| **page_location** | text | 否 * | 所跟踪网页的网址 |
| **page_page** | text | 否 * | 网址的路径部分。此值应以斜杠 (/) 字符开头 |

```JS
gtag('config', 'GA_TRACKING_ID', {
  'page_title' : 'homepage',
  'page_path': '/home'
});
```

### 事件跟踪

```JS
gtag('event', <action>, { // <action> 事件报告中显示为事件操作的字符串
  'event_category': <category>, // 显示为事件类别的字符串
  'event_label': <label>, // 显示为事件标签的字符串
  'value': <value> // 显示为事件价值的非负整数
});
```

看个栗子和对应后台的数据:

```JS
gtag('event', 'click', {
  'event_category': 'logo',
  'event_label': 'Tate & Snow',
  'value': Date.now(),
});
```

![ga-event-click.png](https://i.loli.net/2019/04/23/5cbf35a1885a2.png)

### 应用/屏幕跟踪

```JS
gtag('event', 'screen_view', {
  'app_name': 'myAppName',
  'screen_name' : 'Home'
});
```

### 用户计时

```JS
// Feature detects Navigation Timing API support.
if (window.performance) {
  // Gets the number of milliseconds since page load
  // (and rounds the result since the value must be an integer).
  var timeSincePageLoad = Math.round(performance.now());

  // Sends the timing event to Google Analytics.
  gtag('event', 'timing_complete', {
    'name': 'load',
    'value': timeSincePageLoad,
    'event_category': 'JS Dependencies'
  });
}
```

### 自定义维度和指标

gtag 使用 **custom_map** 参数即可实现自定义维度和指标:

```JS
// Configures custom dimension<Index> to use the custom parameter
// 'dimension_name' for 'GA_TRACKING_ID', where <Index> is a number
// representing the index of the custom dimension.
gtag('config', 'GA_TRACKING_ID', {
  'custom_map': {'dimension<Index>': 'dimension_name'}
});

// Sends the custom dimension to Google Analytics.
gtag('event', 'any_event_name', {'dimension_name': dimension_value});
```

举个栗子:

```JS
gtag('config', 'GA_TRACKING_ID', {
  'custom_map': {
    'dimension2': 'age',
    'metric5': 'avg_page_load_time'
  }
});

gtag('event', 'foo', {'age': 12, 'avg_page_load_time': 1});
```

### beacon

```JS
gtag('config', 'GA_TRACKING_ID', { 'transport_type': 'beacon'});
```

### 实现异步回调 event_callback

```JS
// Gets a reference to the form element, assuming
// it contains the ID attribute "signup-form".
var form = document.getElementById('signup-form');

// Adds a listener for the "submit" event.
form.addEventListener('submit', function(event) {

  // Prevents the browser from submitting the form
  // and thus unloading the current page.
  event.preventDefault();

  // Sends the event to Google Analytics and
  // resubmits the form once the hit is done.
  gtag('event', 'signup_form', { 'event_callback': {
    createFunctionWithTimeout(function() {
      form.submit();
    })
  }});
});
```

## Measurement Protocol

[**Measurement Protocol**](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide?hl=zh-cn)可让开发者通过 HTTP 请求直接向 Google Analytics 服务器发送原始用户互动数据。这样，开发者就可以衡量在各种环境中用户与商家互动的情况。开发者可以使用 Measurement Protocol 实现以下目标：

* 衡量新环境中的用户活动。
* 将线上和线下行为联系在一起。
* 同时从客户端和服务器发送数据

## 后台报表界面

![ga-admin.png](https://i.loli.net/2019/04/23/5cbf35a12f7b5.png)

这里再介绍两个术语:

* **平均工作阶段时间长度** - 每个工作阶段平均耗时，计算方式为 [最后一次互动时间 - 第一次互动时间]，其中注意的是最后一次互动时间指的操作页面的时间点，即使用户浏览一个页面，也沒有做任何互动，GA 就沒有計算工作阶段时间长度的依据，所以该次的时间长度为 0
* **跳出率** - 用户进站后没有产生第二个互动的百分比。其中注意的是，即使进入一个页面停留 N 长时间，但是没有任何互动，也会视为调出

![ga](https://pickydigest.com/wp-content/uploads/2018/03/google-analytics-getting-started_image6.png)

## 参考链接

1. [Google Analytics（分析）--> 衡量 --> analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs/?hl=zh-cn)
2. [Google Analytics（分析）--> 衡量 --> gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs/?hl=zh-cn)
3. [从 analytics.js 迁移至 gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs/migration?hl=zh-cn)
4. [[Google Analytics] 超詳細GA網站分析入門教學，看這篇就對了！](https://pickydigest.com/digital-marketing/google-analytics-getting-started/)

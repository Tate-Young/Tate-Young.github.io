---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  移动端跨平台方案
date:   2020-04-30 17:24:00 GMT+0800 (CST)
update: 2022-05-17 14:56:00 GMT+0800 (CST)
description: add taro & uni-app
background-image: https://cdn.merixstudio.com/media/uploads/2019/12/12/react-native-use-cases-copy.png
tags:
- JavaScript
---
# {{ page.title }}

## 核心理念

我们经历了纯 web 开荒的年代，用户体验和兼容性让我们泪目；我们又经历了 hybrid 开发的年代，似乎慢慢看到了希望，鱼和熊掌不可得兼？可是大人，食大便了，现如今我们有多种选择方案。本质上，**跨平台开发是为了增加代码复用，减少开发者对多个平台适配的工作量，降低开发成本，提高业务专注的同时，提供比 web 更好的体验**。

> **Write Once，Run Anywhere**            ---- 鲁迅

## 如何实现

我们都知道，iOS 开发需要用到 `OC/Swift`，android 开发则需要用到 `Java/Kotlin`。对于开发者而言，不同平台同样的需求，要运用不同编程语言来实现，是很拉垮的，成本太高。当然如果我们抛弃他们，就要面对可能带来的性能问题和用户体验问题，但是随着技术革新，这些差异也会越来越小，跨平台的优势也将越来越大。说到跨平台实现的基础，我们可以大致总结为两条:

1. 编程语言层面的跨平台
2. 图形渲染组件的跨平台一致性

### 编程语言

首先我们编程语言分为两大阵营:

* 解释型 - 需要解释器提供“实时翻译”。如 python、JavaScript、Dart
* 编译型 - 需要预编译，执行效率高，但跨平台能力差。如 C/C++、Java、Dart

现在不管事解释型还是编译型语言，基本都能够实现跨平台，只不过对运行环境可能有些要求。比如 Java 编译出来的是一种字节码，这种字节码必须在 Java 的虚拟机(JVM)上才能运行，Java 虚拟机会屏蔽不同操作系统和 CPU 之间的差异。像 C 这种则需要根据不同平台分别进行编译才能运行。

我们可以看到 **Dart** 语言比较特殊，因为它可以通过 `AOT(Ahead Of Time)` 编译成快速、可预测的本地代码，也可以通过 `JIT(Just In Time)` 即时编译。开发周期快，工作流颠覆常规(包括 Flutter 流行的秒级有状态热重载)。

### 图形渲染组件

* 基于 web 的跨平台 - [Cordova/PhoneGap](http://cordova.axuer.com)、[ionic](https://ionicframework.com)
* 基于 DOM -> 原生 View 桥接的跨平台 - React Native、Weex
* 基于底层图形引擎的跨平台 - Flutter、Cocos2d-x、Unity3D

> 当然 PWA 也是一种解决方案，并且现在技术越来越成熟，也可以在通过一些工具打包成应用，具体可以[参考之前的这篇文章]( {{site.url}}/2019/04/07/progressive-web-app.html ) 👈

以下是根据 [google trends](https://trends.google.com/trends/explore?cat=31&date=2017-12-01%202019-12-12&q=React%20Native,Flutter,NativeScript,Xamarin) 搜索的最近比较热门的跨平台框架: `React Native, Flutter, NativeScript, and Xamarin`:

![google trends](https://cdn.merixstudio.com/media/uploads/2019/12/12/react-native-flutter-nativescript-xamarin-popularity-check.png)

| 比较内容        |   cordova/ionic | react-native/weex | flutter | native   |
| ------------ | ------- | ------- | ------- | ------- |
| 语言 | JS | RN：React/Weex：Vue | Dart | Android：Java/Kotlin/iOS：OC/Swift |
| 平台实现 | JS 引擎解释执行JS代码 | JS 引擎解释执行JS代码 | 开发版本：Dart 虚拟机解释执行 发布版本：Dart 代码编译成目标机器码 | Android：安装时编译成目标机器码/iOS：构建时编译成目标机器码 |
| 绘制 | 1、Html+css 2、浏览器引擎绘制 | 1、JS 生成 DOM 树 2、Native 端解析 DOM 树，转换成原生 View 显示 | 1、使用 Dart 实现 UI 组件 2、Skia Engine 渲染 | 原生 View |
| 控件效果 | 1、样式一致 2、交互效果和原生控件有差距 | 1、不同平台样式不一致 2、本身就是原生控件 | 1、样式一致 2、交互效果和原生控件很接近 | / |
| 流畅度 | 一般 | 较好 | 和原生相同 | 好 |
| 动画 | 差 | 一般 | 和原生相同 | 好 |
| 比较内容 | cordova/ionic | react-native/weex | flutter | native |
| 跨平台支持 | Android、iOS、Web | RN：Android、iOS/Weex：Android、iOS、Web | Android、iOS（2019.5 发布 Web 端预览版，bug 多，性能差） | / |
| 动态更新 | 支持 | 支持 | 不支持 | 不支持 |
| 页面开发 | 整体 APP、模块、单页面 | RN：整体 APP、模块、单页面/Weex：单页面 | 整体 APP、模块、单页面 | / |
| 社区支持 | 丰富 | 第三方库多，但质量良莠不齐 | 第三方库较少 | 丰富 |
| 原生UI组件 | 不能桥接 | 可以桥接 | 可以桥接（性能差） | / |
| 安装包大小增加 | 1MB | 8MB/10MB | 10MB | / |

以下会提一些主流的解决方案，部分文字介绍[摘自知识小集的这篇文章](https://juejin.im/post/5b076e3af265da0dce48fe95)。

## React Native

[**React Native**](https://reactnative.dev) 是 Facebook 于 2015 年 4 月开源的跨平台移动应用开发框架，是 Facebook 早先开源的 UI 框架 React 在原生移动应用平台的衍生产物，目前支持 iOS 和 Android 两大平台。它使用 JavaScript 语言、以及类似于 HTML 的 JSX 和 CSS 来开发移动应用，因此熟悉 Web 前端开发的技术人员只需很少的学习即可快速上手。

RN 现在已经比较成熟，虽然至今没有发布 1.0 版本，但其社区很活跃，并且为 RN 贡献了大量的开源代码。国内很多公司也对 RN 做了很多研究，并有相应的产出，如一些基于 RN 发展出来的跨三端（Android/iOS/Web）的技术。其理念始终贯彻 "“**learn once, write anywhere**"!

> 开源库 [awesome-react-native](https://github.com/jondot/awesome-react-native)，收集了大量 React Native 的开发资源 👈

以下是利用该框架开发的 app 代表，包括 `Facebook, Instagram, Tesla, Uber, Pinterest, and Skype`:

![RN apps](https://cdn.merixstudio.com/media/uploads/2019/12/12/react-native-use-cases-copy.png)

## Weex

2016 年 4 月 21 日，阿里巴巴在 Qcon 大会上发布跨平台移动开发工具 [**Weex**](https://weex.incubator.apache.org)，同年 12 月 15 日，阿里巴巴宣布将移动开源项目 Weex 捐赠给 Apache 基金会开始孵化。Weex 致力于使开发者能基于当代先进的 Web 开发技术，使用同一套代码来构建 Android、iOS 和 Web 应用。具体来讲，在集成了 WeexSDK 之后，你可以使用 JavaScript 和流行的前端框架（如 Vue.js 和 Rax）来开发移动应用。

Weex 的另一个主要目标是跟进当代先进的 Web 开发和原生开发的技术，使生产力和性能共存。在开发 Weex 页面就像开发普通网页一样；在渲染 Weex 页面时和渲染原生页面一样。我们可以发现，Weex 在很大程度上借鉴了 React Native 的思想和方式，目标都是通过 JS 语法渲染 Native 页面，但由于起步比较晚，社区没有 React Native 活跃，资料和开源项目也相对较少。

> 同样，也有 Weex 资源收集项目 [awesome-weex](https://github.com/joggerplus/awesome-weex) 👈

## Flutter

Flutter 是 Google 在 2017 年的 Google I/O 上推出的移动端 UI 开发框架，可以快速在 iOS 和 Android 上构建高质量的原生用户界面，于 2018 年发布。Flutter 与 React Native/Weex 本质上是不同的，它并没有使用 WebView、JavaScript 解释器或者系统平台自带的原生控件，而是有自己专属的一套 Widget，界面开发使用 Dart 语言，而底层渲染使用自身的高性能 C/C++ 引擎自绘。具体 Flutter 和 RN 的对比，可以[参考 Release Flutter 的最后一公里 这篇文章](https://juejin.im/post/5b456ebee51d4519277b7761)。

Flutter 的一个主要优点是，它的性能比大多数跨平台移动开发框架都要好。 这可以归因于 Dart 的原生编译器和 Flutter 的专属 Widget。由于不需要 JavaScript 桥接，因此可以与平台进行更快、更直接的通信。而这些 Widget 组件也是使用 Flutter 定义的的 `UI-as-a-code` 方式来用 Dart 编写的，从而也提高了代码的可重用性。

另一方面，Flutter 的热重新加载可帮助您快速轻松地实验，构建 UI，添加功能以及更快地修复错误。在 iOS 和 Android 的模拟器和硬件上体验亚秒级重新加载时间，而不会丢失状态:

<video width="100%" height="50%" controls>
  <source src="{{site.url}}/style/videos/media1.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Flutter 还内置了精美的 `Material Design` 和 `Cupertino（iOS 风格`）小部件，提供丰富的 API 构建，可以实现流畅的滚动效果:

<video width="100%" height="50%" controls>
  <source src="{{site.url}}/style/videos/media2.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Flutter 拥有丰富的工具和库，可以帮助你轻松地同时在 iOS 和 Android 系统中实现你的想法和创意。如果你没有任何移动端开发体验，Flutter 是一种轻松快捷的方式来构建漂亮的移动应用程序。如果你是一位经验丰富的 iOS 或 Android 开发人员，则可以使用 Flutter 作为视图(View)层， 并可以使用已经用 `Java/OC/Swift` 完成的部分，可以支持混合开发。通过平台相关的 API、第三方 SDK 和原生代码让应用变得强大易用。Flutter 允许复用现有的原生代码，访问 iOS 和 Android 上的原生系统功能和系统 SDK。

> 同样，也有 Flutter 资源收集项目 [awesome-flutter](https://mp.weixin.qq.com/s/spPVJ4Mki7RYjGOtO_Zw8g) 👈

以下是利用该框架开发的 app 代表，包括 `Alibaba, Google Ads, Groupon, Philips Hue, or Hamilton`:

![Flutter apps](https://cdn.merixstudio.com/media/uploads/2019/12/12/flutter-use-cases.png)

## NativeScript

如果你要开始开发革命性的产品，那么 React Native 和 Flutter 并不是唯一的解决方案。[**NativeScript**](https://www.nativescript.org) 是一个可能在 2020 年代初适合您的企业的替代框架。该开源框架于 2015年3月 公开发布，并迅速成为一种流行的解决方案。

在使用 NativeScript 构建跨平台应用程序时，开发人员首先使用 JavaScript 及其超集 TypeScript 编写代码。然后，将代码库编译为各个平台固有的编程语言。Telerik 框架的一项与技术相关的主要优势是，它使软件工程师在选择附带的技术堆栈方面拥有极大的自由度，因为该框架不仅与 JavaScript 兼容，而且与 Angular 和 Vue.js 都兼容。说到不同的解决方案，值得一提的是，使用 NativeScript 的开发人员还可以在不使用包装的情况下利用第三方库（CocoaPods 和 Android SDK）:

![NativeScript](https://cdn.merixstudio.com/media/uploads/2019/12/12/how-nativescript-works.png)

与 React Native 相似，NativeScript 允许访问 Android 和 iOS 原生 API，这对跨平台应用程序具有明显的积极影响。但是，不同之处在于，尽管前者要求构建桥接 API，但后者“将所有 iOS 和 Android API 都注入了 JavaScript 虚拟机”，而且代码复用率很高。

以下是利用该框架开发的 app 代表，包括 `Sennheiser Smart Control, MyPUMA, California Court Access App or Portable North Pole`

![NativeScript apps](https://cdn.merixstudio.com/media/uploads/2019/12/12/nativescript-use-cases.png)

## Xamarin

[**Xamarin**][https://dotnet.microsoft.com/apps/xamarin]('zæmərɪn) 是微软子公司提供的一个跨平台开发软件，通过使用 `C#/.NET` 共享的代码库，开发人员可以在 Xamarin 工具上，使用本地用户界面编写原生的 Android、iOS 和 Windows 应用程序，并跨多个平台（包括 Windows 和 macOS）共享代码。使用 Xamarin 生成的应用从外观上看与原生的一样，因为它们就是原生的:

![Xamarin](https://visualstudio.microsoft.com/wp-content/uploads/2019/11/CsharpdiagramXamarinpage.svg)

以下是利用该框架开发的 app 代表，包括 `OLO, MRW, Storyo, and Captio`:

![Xamarin apps](https://cdn.merixstudio.com/media/uploads/2019/12/12/xamarin-use-cases.png)

## 小程序

像微信这种月活用户超过 10 亿的超级 App，已经足以跟操作系统抗衡了，我们把它称为“微信系统”也不为过。如果能在微信生态中提供自己的服务，为“微信系统”开发 App 或许是很多开发者的向往。微信小程序，是一种不需要下载安装即可使用的应用，它实现了应用“触手可及”的梦想，用户在微信里扫一扫或搜一下即可打开应用。2017 年 1 月 9 日，张小龙在 2017 微信公开课 Pro 上正式发布小程序，并在 2017 年底上线了小游戏。

小程序开发本质上还是前端 `HTML + CSS + JS` 那一套逻辑，它基于 WebView 和微信自己定义的一套 `JS/WXML/WXSS/JSON` 来开发和渲染页面。微信官方文档里提到，小程序运行在三端：iOS、Android 和用于调试的开发者工具，三端的脚本执行环境以及用于渲染非原生组件的环境是各不相同的:

1. 在 iOS 上，小程序的 JavaScript 代码是运行在 `JavaScriptCore` 中，是由 `WKWebView` 来渲染的，环境有 iOS 8+；
2. 在 Android 上，小程序的 JavaScript 代码是通过 `X5 JSCore` 来解析，是由 X5 基于 `Mobile Chrome 53/57` 内核来渲染的；
3. 在 开发工具上， 小程序的 JavaScript 代码是运行在 `nwjs` 中，是由 `Chrome Webview` 来渲染的。

> [微信小程序官网](https://mp.weixin.qq.com/cgi-bin/wx) 👈，[支付宝小程序官网](https://open.alipay.com/channel/miniIndex.htm) 👈

## taro & uni-app

![跨平台](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fdeadbc467240c8a6c47c7ed527f7a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.image)

[**taro**](https://github.com/NervJS/taro) 是京东开发的开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发微信/京东/百度/支付宝/字节跳动/QQ 小程序/H5/React Native 等应用。

[**uni-app**](https://github.com/dcloudio/uni-app) 是 DCloud 开发的使用 Vue 语法开发小程序、H5、App 的统一框架。集成了 HBuilder 编辑器，对于跨平台开发十分友好，比如支持直接跳转到微信开发者工具调试，支持真机实时预览，支持直接打包小程序和App，零门槛上手。

[**mpvue**](https://github.com/Meituan-Dianping/mpvue) 是美团开发的基于 Vue 的小程序开发框架。目前支持微信小程序、百度智能小程序，头条小程序和支付宝小程序。框架基于 Vue.js，修改了的运行时框架 runtime 和代码编译器 compiler 实现，使其可运行在小程序环境中，从而为小程序开发引入了 Vue.js 开发体验。

## 参考链接

1. [Cross-platform mobile development 2020: trends and frameworks](https://www.merixstudio.com/blog/cross-platform-mobile-development/)
2. [浅谈 2018 移动端跨平台开发方案](https://juejin.im/post/5b076e3af265da0dce48fe95) By 知识小集
3. [凹凸技术揭秘 · Taro · 开放式跨端跨框架之路](https://jelly.jd.com/article/6001048e131539014c10a0a6)
4. [小程序框架对比（Taro VS uni-app）](https://juejin.cn/post/6974584590841167879) By sherryhe

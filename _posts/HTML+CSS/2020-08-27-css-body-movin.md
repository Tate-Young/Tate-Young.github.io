---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端
title:  Bodymovin & Lottie
date:   2020-08-27 20:07:00 GMT+0800 (CST)
background-image: https://aescripts.com/media/catalog/product/cache/1/image/800x600/040ec09b1e35df139433887a97daa66f/1/2/1240x496_shadow_tn.png
tags:
- CSS
- JavaScript
---
# {{ page.title }}

## Bodymovin

[**Bodymovin**](https://exchange.adobe.com/creativecloud.details.12557.bodymovin.html) 是一款 Adobe AE 插件，可以将特效或者动画转成 html、json、svg 或者 canvas。下面是一则介绍 Bodymovin 的 vimeo 视频，[来源是  aeplugins 这里](https://aescripts.com/bodymovin/)，同样也可以从这里下载插件:

<iframe title="vimeo-player" src="https://player.vimeo.com/video/217683641" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>

## Lottie

因为 json 格式的文件在各平台上兼容性很好，因此导出的文件可以通过 [**bodymovin player**](https://loupthibault.github.io/bodymovin-player/) 或者 Airbnb 提供的 [**Lottie**](https://lottiefiles.com/featured) 开源库在 web 上播放其动画，Lottie 还支持原生的 iOS 和安卓:

* Web - [**lottie-web**](https://github.com/airbnb/lottie-web)
* Android - [lottie-android](https://github.com/airbnb/lottie-android)
* iOS - [lottie-ios](https://github.com/airbnb/lottie-ios)
* React Native - [lottie-react-native](https://github.com/react-native-community/lottie-react-native)

![lottie](https://raw.githubusercontent.com/airbnb/lottie-web/master/gifs/Example1.gif)

### 操作流程

整理下在 web 端展现的整个使用的过程:

* AE
  * Open your AE project and select the bodymovin extension on `Window > Extensions > bodymovin`
  * A Panel will open with a Compositions tab listing all of your Project Compositions.
  * Select the composition you want to export.
  * Select a Destination Folder.
  * Click Render
  * look for the exported json file (if you had images or AI layers on your animation, there will be an images folder with the exported files)
* HTML
  * get the lottie.js file from the build/player/ folder for the latest build
  * include the .js file on your html (remember to gzip it for production)

`loadAnimation` 可以支持以下配置:

* **animationData** - an Object with the exported animation data.
* **path** - the relative path to the animation object. (animationData and path are mutually exclusive)
* **loop** - true / false / number
* **autoplay** - true / false it will start playing as soon as it is ready
* **name** - animation name for future reference
* **renderer** - 'svg' / 'canvas' / 'html' to set the renderer
* **container** - the dom element on which to render the animation

### lottie-web

以 `lottie-web` 为例，我们可以看下具体怎么使用，其实很简单:

```JS
// data.json 即从 AE 导出的 json 文件，包含动画信息
const animation = bodymovin.loadAnimation({
  container: document.getElementById('bm'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'data.json'
})
```

<div id="tate-bm"> </div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.3/lottie.min.js" integrity="sha512-35O/v2b9y+gtxy3HK+G3Ah60g1hGfrxv67nL6CJ/T56easDKE2TAukzxW+/WOLqyGE7cBg0FR2KhiTJYs+FKrw==" crossorigin="anonymous"></script>

<script>
var animation = bodymovin.loadAnimation({
  container: document.getElementById('tate-bm'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/style/files/bodymovin.json'
})
</script>

> 更多 codepen 示例可以[点击这里](https://codepen.io/collection/nVYWZR/) 👈

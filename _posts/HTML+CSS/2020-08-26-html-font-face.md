---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端
title:  动态加载字体
date:   2020-08-26 18:03:00 GMT+0800 (CST)
background-image: https://www.gstatic.com/images/icons/material/apps/fonts/1x/opengraph_color_blue_1200dp.png
tags:
- HTML
- CSS
- JavaScript
---
# {{ page.title }}

现在是这么一个情况，后台有个富文本组件，可以配置很多字体，前台渲染的话要根据这些配置的字体动态去加载。如何用最优雅的方式去处理呢，这就是下面要讨论的，当然可能有更好地方式 🤔️

## @font-face

首先我们要了解的是 `@font-face`，它指定了一个用于显示文本的自定义字体，**字体能从远程服务器或者用户本地安装的字体加载**:

* **local()** - 取用户本地安装的字体
* **url()** - 取远程服务器的字体

`@font-face` 规则不仅仅使用在 CSS 的顶层，还可以用在任何 CSS [**条件组规则**](https://developer.mozilla.org/zh-CN/docs/Web/CSS/At-rule#Conditional_Group_Rules) 中:

```CSS
@font-face {
  font-family: 'Cairo';
  font-style: normal;
  font-weight: 400;
  src: url('/font/cairo-v5-latin_arabic-regular.eot'); /* IE9 Compat Modes */
  src: local('Cairo'), local('Cairo-Regular'),
    url('/font/cairo-v5-latin_arabic-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('/font/cairo-v5-latin_arabic-regular.woff2') format('woff2'), /* Super Modern Browsers */
    url('/font/cairo-v5-latin_arabic-regular.woff') format('woff'), /* Modern Browsers */
    url('/font/cairo-v5-latin_arabic-regular.ttf') format('truetype'), /* Safari, Android, iOS */
    url('/font/cairo-v5-latin_arabic-regular.svg#Cairo') format('svg'); /* Legacy iOS */
  }
```

我们可以看到，不同浏览器可能支持的字体格式不一样，大家可以看自己需要。如果 cdn 上需要存放这些格式的字体包，这里推荐一下 [**google-webfonts-helper**](https://google-webfonts-helper.herokuapp.com/fonts/abel?subsets=latin)，可以下到各种不同格式的字体文件，并且自动生成上面的 `@font-face` 样式供拷贝。

> 常用的开源字体库网站有 [Google Fonts](https://fonts.google.com), [Typekit](https://fonts.adobe.com), [fontdeck](http://fontdeck.com), [fonts.com](https://www.fonts.com), [webtype](https://www.webtype.com) 等 👈

ok 有了 `@font-face` 的帮忙，而且兼容性超棒，浏览器现在可以获取对应的字体了。但是不同浏览器对于处理字体又各有不同，具体可以分为以下两类:

## FOIT - Flash Of Invisible Text

**FOIT** 即 `Flash Of Invisible Text`，缺点是文字长时间被隐藏，体验不是很好:

1. 字体开始下载；
2. 请求网络字体时字体不可见；
3. 网络字体下载完毕；
4. 字体呈现。

## FOUT - Flash of Unstyled Text

**FOUT** 即 `Flash of Unstyled Text`，缺点是字体替换时可能会抖动:

1. 字体开始下载；
2. 字体呈现，并采用配置的备份字体；
3. 网络字体下载完毕；
4. 字体替换为网络字体。

## 方案一 - 监听字体加载

此方案目的就是让所有浏览器都表现为 FOUT，提升用户体验，即在自定义字体加载完成之前，先显示降级字体。那么问题就是如何监听字体加载完成。这里可以用 `@font-face loader`: [fontfaceobserver](https://github.com/bramstein/fontfaceobserver)，用法很简单:

```JS
// 下载并监听字体，字体来源可以是 Google Fonts, Typekit, and Webtype or be self-hosted
const font = new FontFaceObserver('My Family', {
  weight: 400
})

font.load().then(function () {
  document.documentElement.classList.add('font-loaded')
})
```

```less
@fallback: Georgia, serif;

h1, .h1 {
  // 备份字体
  font-family: @fallback;

  .font-loaded & {
    font-family: "My Family";
  }
}
```

注意上述 less 的写法，之前没这么用过，这么好用的功能竟然现在才知道 🤦‍♂️，它相当于:

```CSS
h1, .h1 {
  font-family: Georgia, serif;
}
.font-loaded h1, .font-loaded .h1 {
  font-family: "My Family";
}
```

> 由于 fontfaceobserver api 使用了 Promise，对于不支持 Promise 的则需要 polyfill，或者直接引用 `fontfaceobserver.js`，否则引用 `fontfaceobserver.standalone.js`

> 使用原生的 [**FontFaceSet**](https://developer.mozilla.org/zh-CN/docs/Web/API/FontFaceSet) API 可以用来管理字体下载的状态，但是目前兼容性不太好。

## 方案二 - 字体子集化

方案一还是不能解决一些字体库太大的问题，特别是弱网下，全量加载这个等待时间是很长的。因此我们可以想到采用字体子集化，服务器接受到客户端发来的请求后，去截取并只下载我们需要用到的文字。这里也推荐一个第三方库：[fontmin](https://github.com/ecomfe/fontmin):

```JS
const Fontmin = require('fontmin')
const Promise = require('bluebird')

async function extractFontData(fontPath) {
  const fontmin = new Fontmin()
    .src('./font/senty.ttf')
    .use(Fontmin.glyph({
      text: '字体预览'
    }))
    .use(Fontmin.ttf2woff2())
    .dest('./dist')

  await Promise.promisify(fontmin.run, { context: fontmin })()
}
extractFontData()
```

## 方案三 - Web Font Loader

[**Web Font Loader**](https://github.com/typekit/webfontloader) 可以让你在使用 `@font-face` 的时候去控制它的状态，同样它支持的字体数据源也很多，是由 Google 和 Typekit 联合推出的，和方案一类似:

```JS
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
<script>
  WebFont.load({
    google: {
      families: ['Droid Sans', 'Droid Serif']
    }
  })
</script>
```

上面是最简单的方式，但是有个问题就是影响 DOM 的解析和渲染，因此我们也可以采用创建动态链接的方式，当然这样做存在一个问题就是可能文字内容先渲染了，会造成上述的 FOUT:

```JS
<script>
  window.WebFontConfig = {
    google: { families: ['Droid Sans', 'Droid Serif:bold'] }
  }

  (function(d) {
    var wf = d.createElement('script'), s = d.scripts[0]
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    wf.async = true
    s.parentNode.insertBefore(wf, s)
  })(document)
</script>
```

`WebFontConfig` 包含了全局的配置，我们可以在里面定义数据源，比如:

```JS
// You can find the Kit ID within Typekit's Kit Editor interface
WebFontConfig = {
  typekit: { id: 'xxxxxx' }
}
```

还可以定义一些事件钩子，方便我们进行监听和操作:

* **loading** - This event is triggered when all fonts have been requested.
* **active** - This event is triggered when the fonts have rendered.
* **inactive** - This event is triggered when the browser does not support linked fonts or if none of the fonts could be loaded.
* **fontloading** - This event is triggered once for each font that's loaded.
* **fontactive** - This event is triggered once for each font that renders.
* **fontinactive** - This event is triggered if the font can't be loaded.

不同状态，html 上也会添加不同的 CSS 类名:

```TEXT
.wf-loading
.wf-active
.wf-inactive
.wf-<familyname>-<fvd>-loading
.wf-<familyname>-<fvd>-active
.wf-<familyname>-<fvd>-inactive
```

The `<familyname>` placeholder will be replaced by a sanitized version of the name of each font family. Spaces and underscores are removed from the name, and all characters are converted to lower case. For example, Droid Sans becomes droidsans.

The `<fvd>` placeholder is a Font Variation Description. Put simply, it's a shorthand for describing the style and weight of a particular font:

```CSS
/* n4 */
@font-face { font-style: normal; font-weight: normal; }

/* i7 */
@font-face { font-style: italic; font-weight: bold; }
```

当然我们也可以去掉这些默认行为，那它啥都不会监听，就只是单纯的插入 `@font-face` 到文档中:

```JS
WebFontConfig = {
  events: false,
  classes: false,
};
```

方案三一般情况下我们都会采用异步去加载文件的方式，那么我们还是可以尽可能地去优化 FOUT，我们可以在配置项中监听字体渲染完的事件:

```JS
WebFontConfig = {
  // other options and settings
  active: function() {
    sessionStorage.fonts = true // 表示字体已经渲染完
  }
}
```

然后我们可以在 `head` 中插入以下脚本，可以及时判断 `sessionStorage` 是否存在这个 key，并尽快给 html 上添加样式:

```HTML
<head>
  <script>
    (function() {
      if (sessionStorage.fonts) {
        console.log("Fonts installed.");
        document.documentElement.classList.add('wf-active');
      } else {
        console.log("No fonts installed.");
      }
    })();
  </script>
</head>
```

## 参考链接

1. [Loading Web Fonts with the Web Font Loader](https://css-tricks.com/loading-web-fonts-with-the-web-font-loader/) by Robin Rendle
2. [Web 中文字体处理总结 - 凹凸实验室](https://aotu.io/notes/2020/02/28/webfont-processing/index.html)

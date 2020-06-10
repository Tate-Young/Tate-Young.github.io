---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端优化
title:  Skeleton Screen
date:   2018-03-07 00:50:00 GMT+0800 (CST)
background-image: /style/images/smms/skeleton-screen.jpg
tags:
- html
---
# {{ page.title }}

## 什么是骨架屏

网页加载通常的做法是采用菊花图，可以通过 CSS 来制作各种 loading 动画，用来提升用户在等待时间内的感知体验。更多可以[参见这里](https://www.qianduan.net/free-html5-css3-loaders-preloaders/) 👈👈👈:

![loading](https://i.imgur.com/W9XBuNV.gif)

**骨架屏(skeleton screen)** 则体验上会比菊花图更好，在数据加载完成之前会通过"骨架"来填充页面，例如:

![skeleton-screen]( {{site.url}}/style/images/smms/skeleton-screen.jpg )

## 骨架屏示例

以 facebook 加载为例，[参见 codepen](https://codepen.io/lilugirl/pen/XNRZrJ):

![skeleton-screen-facebook]( {{site.url}}/style/images/smms/skeleton-screen-facebook.gif )

<script async src="//jsfiddle.net/fh5whLfd/808/embed/html,css,result/"></script>

```HTML
<div class="timeline-wrapper">
<div class="timeline-item">
    <div class="animated-background">
        <div class="background-masker header-top"></div>
        <div class="background-masker header-left"></div>
        <div class="background-masker header-right"></div>
        <div class="background-masker header-bottom"></div>
        <div class="background-masker subheader-left"></div>
        <div class="background-masker subheader-right"></div>
        <div class="background-masker subheader-bottom"></div>
        <div class="background-masker content-top"></div>
        <div class="background-masker content-first-end"></div>
        <div class="background-masker content-second-line"></div>
        <div class="background-masker content-second-end"></div>
        <div class="background-masker content-third-line"></div>
        <div class="background-masker content-third-end"></div>
    </div>
</div>
```

```CSS
.timeline-item {
   background: #fff;
   border: 1px solid;
   border-color: #e5e6e9 #dfe0e4 #d0d1d5;
   border-radius: 3px;
   padding: 12px;
   margin: 0 auto;
   max-width: 472px;
   min-height: 200px;
}


@keyframes placeHolderShimmer{
    0%{
        background-position: -468px 0
    }
    100%{
        background-position: 468px 0
    }
}

.animated-background {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    height: 96px;
    position: relative;
}


.background-masker {
    background: #fff;
    position: absolute;
}

/* Every thing below this is just positioning */

.background-masker.header-top,
.background-masker.header-bottom,
.background-masker.subheader-bottom {
    top: 0;
    left: 40px;
    right: 0;
    height: 10px;
}

.background-masker.header-left,
.background-masker.subheader-left,
.background-masker.header-right,
.background-masker.subheader-right {
    top: 10px;
    left: 40px;
    height: 8px;
    width: 10px;
}

.background-masker.header-bottom {
    top: 18px;
    height: 6px;
}

.background-masker.subheader-left,
.background-masker.subheader-right {
    top: 24px;
    height: 6px;
}


.background-masker.header-right,
.background-masker.subheader-right {
    width: auto;
    left: 300px;
    right: 0;
}

.background-masker.subheader-right {
    left: 230px;
}

.background-masker.subheader-bottom {
    top: 30px;
    height: 10px;
}

.background-masker.content-top,
.background-masker.content-second-line,
.background-masker.content-third-line,
.background-masker.content-second-end,
.background-masker.content-third-end,
.background-masker.content-first-end {
    top: 40px;
    left: 0;
    right: 0;
    height: 6px;
}

.background-masker.content-top {
    height:20px;
}

.background-masker.content-first-end,
.background-masker.content-second-end,
.background-masker.content-third-end{
    width: auto;
    left: 380px;
    right: 0;
    top: 60px;
    height: 8px;
}

.background-masker.content-second-line  {
    top: 68px;
}

.background-masker.content-second-end {
    left: 420px;
    top: 74px;
}

.background-masker.content-third-line {
    top: 82px;
}

.background-masker.content-third-end {
    left: 300px;
    top: 88px;
}
```

## 参考链接

1. [HTML5+CSS3 loading 效果收集](https://www.qianduan.net/free-html5-css3-loaders-preloaders/)
1. [PHPgang - Facebook style timeline content loading placeholder with CSS](https://www.phpgang.com/facebook-style-timeline-content-loading-placeholder-with-css_4994.html)
1. [Building Skeleton Screens with CSS Custom Properties](https://css-tricks.com/building-skeleton-screens-css-custom-properties/) BY Max Bock
1. [使用 Skeleton Screen 提升用户感知体验](https://cloud.tencent.com/developer/article/1006169) By 陈纬杰

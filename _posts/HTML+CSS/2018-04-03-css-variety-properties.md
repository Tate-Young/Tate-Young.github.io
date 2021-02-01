---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  CSS 属性集合
date:   2018-04-03 16:46:00 GMT+0800 (CST)
update: 2021-01-27 11:49:00 GMT+0800 (CST)
background-image: /style/images/smms/html-css.png
tags:
- css
---
# {{ page.title }}

## box-shadow

### 取值

设置或检索对象阴影，可以设定多组效果，每组参数值以逗号分隔，取值为:

* none - 无阴影
* \<length\>① - 第 1 个长度值用来设置对象的阴影水平偏移值。可以为负值
* \<length\>② - 第 2 个长度值用来设置对象的阴影垂直偏移值。可以为负值
* \<length\>③ - 如果提供了第 3 个长度值则用来设置对象的阴影模糊值。不允许负值
* \<length\>④ - 如果提供了第 4 个长度值则用来设置对象的阴影外延值。可以为负值
* \<color\> - 设置对象的阴影的颜色。
* inset - 设置对象的阴影类型为内阴影。该值为空时，则对象的阴影类型为外阴影

<style>
.test li {
  margin-top: 20px;
  list-style: none;
  width: 400px;
  color: black;
  padding: 10px;
  background: #eee;
}
.test .outset {
  box-shadow: 5px 5px rgba(0, 0, 0, .6);
}
.test .outset-blur {
  box-shadow: 5px 5px 5px rgba(0, 0, 0, .6);
}
.test .outset-extension {
  box-shadow: 5px 5px 5px 10px rgba(0, 0, 0, .6);
}
.test .inset {
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, .6) inset;
}
.test .multiple-shadow {
  box-shadow:
    0 0 5px 3px rgba(255, 0, 0, .6),
    0 0 5px 6px rgba(0, 182, 0, .6),
    0 0 5px 10px rgba(255, 255, 0, .6);
}
</style>

<ul class="test">
  <li class="outset">外阴影常规效果<br />box-shadow:5px 5px rgba(0,0,0,.6);</li>
  <li class="outset-blur">外阴影模糊效果<br />box-shadow:5px 5px 5px rgba(0,0,0,.6);</li>
  <li class="outset-extension">外阴影模糊外延效果<br />box-shadow:5px 5px 5px 10px rgba(0,0,0,.6);</li>
  <li class="inset">内阴影效果<br />box-shadow:2px 2px 5px 1px rgba(0,0,0,.6) inset;</li>
  <li class="multiple-shadow">外阴影模糊效果<br />box-shadow:5px 5px 5px rgba(0,0,0,.6);</li>
</ul>

### 示例

#### 卡片阴影+动画效果

<link rel='stylesheet prefetch' href='http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'>
<style>
  /**
* Title
**/
.title {
  text-align: center;
  -webkit-transform: translateY(20px);
          transform: translateY(20px);
  font-size: 45px;
  color: coral;
  text-transform: uppercase;
}
/**
* CARD
**/
.card {
  /* position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%) translateZ(0);
  transform: translateX(-50%) translateY(-50%) translateZ(0); */
  position: relative;
  width: 370px;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  -webkit-transition: box-shadow 0.5s;
  transition: box-shadow 0.5s;
}
.card a {
  color: inherit;
  text-decoration: none;
}
.card:hover {
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
}
/**
* DATE
**/
.card__date {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 45px;
  height: 45px;
  padding-top: 10px;
  background-color: coral;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  font-weight: 700;
  line-height: 13px;
}
.card__date__day {
  font-size: 14px;
}
.card__date__month {
  text-transform: uppercase;
  font-size: 10px;
}
/**
* THUMB
**/
.card__thumb {
  height: 245px;
  overflow: hidden;
  background-color: #000;
  -webkit-transition: height 0.5s;
  transition: height 0.5s;
}
.card__thumb img {
  display: block;
  width: 100%;
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: opacity 0.5s, -webkit-transform 0.5s;
  transition: opacity 0.5s, -webkit-transform 0.5s;
  transition: opacity 0.5s, transform 0.5s;
  transition: opacity 0.5s, transform 0.5s, -webkit-transform 0.5s;
}
.card:hover .card__thumb {
  height: 130px;
}
.card:hover .card__thumb img {
  opacity: 0.6;
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}
/**
* BODY
**/
.card__body {
  position: relative;
  height: 185px;
  padding: 20px;
  -webkit-transition: height 0.5s;
  transition: height 0.5s;
}
.card:hover .card__body {
  height: 300px;
}
.card__category {
  position: absolute;
  top: -25px;
  left: 0;
  height: 25px;
  padding: 0 15px;
  background-color: coral;
  color: #fff;
  text-transform: uppercase;
  font-size: 11px;
  line-height: 25px;
}
.card__title {
  margin: 0;
  padding: 0 0 10px 0;
  color: #000;
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
}
.card__subtitle {
  margin: 0;
  padding: 0 0 10px 0;
  font-size: 19px;
  color: coral;
}
.card__description {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 56px;
  margin: 0;
  padding: 0;
  color: #666C74;
  line-height: 27px;
  opacity: 0;
  -webkit-transform: translateY(45px);
  transform: translateY(45px);
  -webkit-transition: opacity 0.3s, -webkit-transform 0.3s;
  transition: opacity 0.3s, -webkit-transform 0.3s;
  transition: opacity 0.3s, transform 0.3s;
  transition: opacity 0.3s, transform 0.3s, -webkit-transform 0.3s;
  -webkit-transition-delay: 0s;
  transition-delay: 0s;
}
.card:hover .card__description {
  opacity: 1;
  -webkit-transform: translateY(0);
  transform: translateY(0);
  -webkit-transition-delay: 0.2s;
  transition-delay: 0.2s;
}
.card__footer {
  position: absolute;
  bottom: 12px;
  left: 20px;
  right: 20px;
  font-size: 11px;
  color: #A3A9A2;
}
.icon {
  display: inline-block;
  vertical-align: middle;
  margin: -2px 0 0 2px;
  font-size: 18px;
}
.icon + .icon {
  padding-left: 10px;
}
</style>

<article class="card">
  <header class="card__thumb">
    <a href="#"><img src="{{ site.url}}/style/images/darling.jpg"/></a>
  </header>
  <date class="card__date">
    <span class="card__date__day">3</span>
    <br/>
    <span class="card__date__month">April</span>
  </date>
  <div class="card__body">
    <div class="card__category"><a href="#卡片阴影动画效果">Photos</a></div>
    <p class="card__title"><a href="#卡片阴影动画效果">Tate & Snow</a></p>
    <div class="card__subtitle">Welcome to my house!</div>
    <p class="card__description">⁶⁶66⁶⁶⁶⁶     ⁶⁶⁶⁶⁶⁶卧槽    ⁶⁶666⁶⁶⁶⁶⁶⁶⁶⁶⁶卧槽   ⁶⁶⁶⁶⁶⁶    ⁶⁶66⁶⁶⁶⁶     卧槽⁶⁶⁶⁶⁶⁶     ⁶6666⁶⁶666   666   ⁶⁶⁶⁶⁶⁶   666666    ⁶⁶⁶   66666   ⁶⁶⁶⁶⁶⁶⁶⁶⁶     卧槽⁶⁶⁶⁶⁶</p>
  </div>
  <footer class="card__footer">
    <span class="icon ion-clock"></span> 6min ago
    <span class="icon ion-chatbox"></span><a href="#卡片阴影动画效果"> 2333 comments</a>
   </footer>
</article>

[卡片栗子来源处](http://www.5iweb.com.cn/html5-css3-effects/942.html)，查看 JSFiddle 示例代码:

<script async src="//jsfiddle.net/Tate_Young/v6dsujLu/2/embed/html,css,result/"></script>

#### 阴影动画

[上一节动画](/2018/04/02/css-animation.html#css-动画示例)里有演示主要根据 box-shadow 来创建的动画。

<style>
.animation-content{
  width: 100%;
  background-color: rgba(0, 0, 0, .05);
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
}
.animation-content div{
  display: inline-block;
  vertical-align: middle;
  margin-right: 30px;
}
/*eye ball*/
.eye{
  width: 20px;
  height: 20px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 50%;
  box-shadow: 30px 0px 0px 0px rgba(255,255,255,0.8);
  position: relative;
}
.eye:after{
  background-color: #59488b;
  width: 10px;
  height: 10px;
  box-shadow: 30px 0px 0px 0px #59488b;
  border-radius: 50%;
  left: 9px;
  top: 8px;
  position: absolute;
  content: "";
  -webkit-animation: eyeball 1s linear infinite alternate;
  -moz-animation: eyeball 1s linear infinite alternate;
  animation: eyeball 1s linear infinite alternate;
}
@-webkit-keyframes eyeball{
  0%{left: 9px;}
  100%{left: 1px;}
}
@-moz-keyframes eyeball{
  0%{left: 9px;}
  100%{left: 1px;}
}
@keyframes eyeball{
  0%{left: 9px;}
  100%{left: 1px;}
}
.typing_loader {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  -webkit-animation: typing 1s linear infinite alternate;
  -moz-animation: Typing 1s linear infinite alternate;
  animation: typing 1s linear infinite alternate;
  position: relative;
  margin-left: 30px;
}
@-webkit-keyframes typing {
  0% {
    background-color: rgba(0, 0, 0, 1);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 1);
  }
}
@-moz-keyframes typing {
  0% {
    background-color: rgba(0, 0, 0, 1);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 1);
  }
}
@keyframes typing {
  0% {
    background-color: rgba(0, 0, 0, 1);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 1);
  }
}
</style>

<div class="animation-content">
  <div class="eye"></div>
  <div class="typing_loader"></div>
</div>

```CSS
.typing_loader {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  -webkit-animation: typing 1s linear infinite alternate;
  -moz-animation: Typing 1s linear infinite alternate;
  animation: typing 1s linear infinite alternate;
  position: relative;
  margin-left: 30px;
}
@keyframes typing {
  0% {
    background-color: rgba(0, 0, 0, 1);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 2), 24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2), 24px 0px 0px 0px rgba(0, 0, 0, 1);
  }
}
```

## filter 滤镜

CSS **滤镜(filter)** 属提供的图形特效，像模糊、锐化或元素变色。过滤器通常被用于调整图片，背景和边界的渲染。

| Filter | 描述 |
|:--------------|:---------|
| **blur(px)** | 高斯模糊 |
| brightness(%) | 调整图像的明暗度，100% 无变化 |
| contrast(%) | 调整图像的对比度，100% 无变化 |
| drop-shadow() | 图像设置一个阴影效果，参数类似 box-shadow(除开 inset 关键字) |
| grayscale(%) | 将图像转换为灰度图像，值在 0% 到 100% 之间，100% 为完全灰度 |
| hue-rotate(deg) | 给图像应用色相旋转。默认值为 0deg，则图像无变化 |
| invert(%) | 反转输入图像。值在 0% 和 100% 之间，100% 是完全反转 |
| opacity(%) | 转化图像的透明程度。值在 0% 和 100% 之间，100% 无变化。该函数与已有的 opacity 属性很相似，不同之处在于通过 filter，一些浏览器为了提升性能会提供硬件加速 |
| saturate(%) | 转换图像饱和度。100% 无变化 |
| sepia(%) | 将图像转换为深褐色。值在0%到100%之间，100% 则完全为深褐色 |
| url() | URL 函数接受一个 XML 文件，该文件设置了 一个 SVG 滤镜，且可以包含一个锚点来指定一个具体的滤镜元素 |

举个颜色图标点亮的示例:

<style>
.test-div:hover .test-sspai {
  filter: none;
}
.test-sspai {
  height: 22px;
  filter: contrast(0) brightness(130%);
  transition: 0.5s;
}
</style>

<div class="test-div" style="cursor:pointer">
  <img class="test-sspai" src="https://pasteapp.me/images/logos/sspai.png">
</div>

```CSS
img {
  filter: contrast(0) brightness(130%);
}
```

各种效果比较可查看 JSFiddle 示例:

<script async src="//jsfiddle.net/Tate_Young/r88t8kcg/3/embed/html,css,result/"></script>

## pointer-events

**pointer-events** 设置或检索在何时成为属性事件的 target，取值为:

* **auto** - 与 pointer-events 属性未指定时的表现效果相同
* **none** - 元素永远不会成为鼠标事件的 target。但是，当其后代元素的 pointer-events 属性指定其他值时，鼠标事件可以指向后代元素，在这种情况下，鼠标事件将在捕获或冒泡阶触发父元素的事件侦听器

```CSS
 /* 其他针对 SVG 的属性: visiblepainted | visiblefill | visiblestroke | visible | painted | fill | stroke | all */
pointer-events：auto | none
```

## 伪对象选择符

### ::placeholder

**::placeholder** 伪元素用于控制表单输入框占位符的外观，默认的文字占位符为浅灰色，可修改文字占位符的样式。

<style>
input{
  -webkit-appearance:none;
  border:1px solid #35495e;
  border-radius:10px;
  outline:none;
  padding: 0 14px;
}
input::-webkit-input-placeholder {
  color: #41b883;
}
input:-ms-input-placeholder { // IE 10+
  color: #41b883;
}
input:-moz-placeholder { // Firefox 4-18
  color: #41b883;
}
input::-moz-placeholder { // Firefox 19+
  color: #41b883;
}
</style>

<input placeholder="我就是文字占位符">

```CSS
input::-webkit-input-placeholder {
  color: #41b883;
}
input:-ms-input-placeholder { // IE 10+
  color: #41b883;
}
input:-moz-placeholder { // Firefox 4-18
  color: #41b883;
}
input::-moz-placeholder { // Firefox 19+
  color: #41b883;
}
```

### ::selection

<style>
  .selection{user-select:all;}
  .selection::selection{background-color:#41b883;color:white;}
  .selection strong::selection{background-color:#41b883;color:white;}
</style>

<p class="selection"><strong>::selection</strong> 用来设置被选中时的样式，只能定义被选择时的 background-color、color 及 text-shadow(IE11 尚不支持定义该属性)，选择这段话试试。</p>

```CSS
p::selection {
  background-color: #41b883;
  color: white;
}
```

## 移动端常用的属性

### -webkit-touch-callout

当触摸并按住目标，如一个链接，Safari 浏览器将显示链接有关的系统默认菜单。这个属性可以让你禁用系统默认菜单。取值为:

* **none** - 系统默认菜单被禁用
* **default** - 系统默认菜单不被禁用，默认值

```CSS
-webkit-touch-callout: none;
```

### -webkit-tap-hightlight-color

当用户点击 Safari 浏览器中的链接或其他可点击的元素时，会出现一个半透明的灰色背景，使用该属性可以覆盖显示的高亮颜色，取值为:

* color - 颜色值
* transparent - 透明值

```CSS
-webkit-tap-highlight-color: rgba(0,0,0,0);
```

### user-select

```CSS
user-select：none | text | all | element
```

**user-select** 用来设置用户是否允许用户选中文本，取值为:

* **none** - 文本不能被选择
* **text** - 默认值，文本可以被选择
* **all** - 当所有内容作为一个整体时可以被选择

尝试选择以下几个栗子:

<style>
  .user-select-none{
    user-select: none;
    -webkit-user-select: none;
  }
  .user-select-all{
    user-select: all;
    -webkit-user-select: all;
  }
</style>

<p class="user-select-none"><strong>none</strong> --> 我猜你们根本就选择不到我</p>
<p class="user-select-all"><strong>all</strong> --> 你只需要点我试一试</p>

## 子元素 :fisrt-child / :first-of-type

**:first-child** 选择器是 CSS2 中定义的，即第一个子元素:

```HTML
<div>
  <p>第一个子元素</p>
  <a>第二个子元素</a>
  <span>第三个子元素</span>
  <span>第四个子元素</span>
</div>
```

1. `p:first-child` - 匹配到的是 p 元素,因为 p 元素是 div 的第一个子元素 ✅
2. `a:first-child` - 匹配不到任何元素，因为在这里 a 是 div 的第二个子元素
3. `span:first-child` - 匹配不到任何元素，同上

在 CSS3 中又定义了 `:first-of-type` 这个选择器，这个有什么区别呢？还是看上面那个栗子:

1. `p:first-of-type` - 匹配到的是 p 元素,因为 p 元素是 div 里所有元素类型为 p 的第一个 ✅
2. `a:first-of-type` - 匹配到的是 a 元素,因为 a 元素是 div 里所有元素类型为 a 的第一个 ✅
3. `span:first-of-type` - 匹配到的是 span 第三个子元素,因为它是 div 里所有元素类型为 span 的第一个 ✅

> 其他同样类型的选择器 `:last-child` 和 `:last-of-type`，`:nth-child(n)` 和 `:nth-of-type(n)` 同上 👈

## prefer-color-scheme

严格来讲这不属于 CSS 的范畴，我们可以通过 [**matchMedia**](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia) 来查询用户系统中设置的主题偏好模式，比如 light 或 dark，从而使用我们默认的模式来进行匹配:

```JS
const isDark = matchMedia('(prefers-color-scheme: dark)').matches
```

## 参考链接

1. [CSS3 - 参考手册 - box-shadow](http://www.css88.com/book/css/properties/border/box-shadow.htm)
2. [MDN - filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

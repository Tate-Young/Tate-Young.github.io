---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  CSS 盒子模型与定位
date:   2018-04-12 16:00:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- css
---
# {{ page.title }}

## 什么是盒子模型

盒子模型包含 4 个属性，即**内容(content)**、**填充(padding)**、**边框(border)**、**边界(margin)**。目前有两种模型:

* **标准盒子模型**
* **IE 盒子模型**

### 标准盒子模型

![box-model-w3c.png](https://i.loli.net/2018/04/12/5acf03bbc4f3c.png)

### IE 盒子模型

![box-model-ie.png](https://i.loli.net/2018/04/12/5acf03ba00bd0.png)

可以看出和标准 W3C 盒子模型不同的是，IE 盒子模型的 content 部分包含了 border 和 padding。

### box-sizing

CSS3 引进了 **box-sizing** 属性，用来设置或检索对象的盒模型组成模式，取值为:

* **content-box** - 使用标准盒子模型，默认
* **border-box** - 使用 IE 盒子模型

```CSS
box-sizing：content-box | border-box
```

如下例子，盒子模型下的四个属性都一致时的表现:

<style>
.test{width:200px;height:70px;padding:10px;border:15px solid #999;-moz-box-sizing:content-box;-ms-box-sizing:content-box;box-sizing:content-box;background:#eee;}
.test2{width:200px;height:70px;padding:10px;border:15px solid #999;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;background:#eee;margin-top:20px;}
</style>

<div class="test">content-box</div>
<div class="test2">border-box</div>

利用盒子模型还可以画出常用的倒三角:

<style>
/*向上的三角*/
.arrow-up {
  width:0;
  height:0;
  border-left:30px solid transparent;
  border-right:30px solid transparent;
  border-bottom:30px solid orange;
}
/*箭头向下*/
.arrow-down {
  width:0;
  height:0;
  border-left:20px solid transparent;
  border-right:20px solid transparent;
  border-top:20px solid #0066cc;
}
/*箭头向左*/
.arrow-left {
  width:0;
  height:0;
  border-top:30px solid transparent;
  border-bottom:30px solid transparent;
  border-right:30px solid yellow;
}
/*箭头向右*/
.arrow-right {
  width:0;
  height:0;
  border-top:50px solid transparent;
  border-bottom:50px solid transparent;
  border-left:50px solid green;
}
</style>

<div class="arrow-up"><!--向上的三角--></div>
<div class="arrow-down"><!--向下的三角--></div>
<div class="arrow-left"><!--向左的三角--></div>
<div class="arrow-right"><!--向右的三角--></div>

```CSS
/*箭头向下*/
.arrow-down {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid #0066cc;
}
```

## 定位 position

**定位(position)**用来设置定位方式，当 position 的值为非 static 时，其层叠级别通过 **z-index** 属性定义，偏移量通过 **top**、**right**、**bottom**、**left** 这 4 个定位偏移属性进行定义。position 属性有以下几个值：

* **static** - 默认值，对象遵循常规流，此时 4 个定位偏移属性不会被应用
* **relative** - 对象遵循常规流，并且参照自身在常规流中的位置进行偏移时不会影响常规流中的任何元素，即原本的空间仍然保留
* **absolute** - 对象脱离常规流，此时偏移属性参照的是离自身最近的定位祖先元素，如果没有定位的祖先元素，则一直回溯到 body 元素。盒子的偏移位置不影响常规流中的任何元素，其 margin 不与其他任何 margin 折叠
* **fixed** - 同 absolute，但偏移定位是以窗口为参考。当出现滚动条时，对象不会随着滚动
* **center** - 同 absolute，但偏移定位是以定位祖先元素的中心点为参考。盒子在其包含容器垂直水平居中（CSS3）
* **page** - 同 absolute。元素在分页媒体或者区域块内，元素的包含块始终是初始包含块，否则取决于每个 absolute 模式（CSS3）
* **sticky** - 对象在常态时遵循常规流。它就像是 relative 和 fixed 的合体，当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如 fixed。该属性的表现是现实中你见到的吸附效果（CSS3）

### relative

先看个默认下 static 的栗子:

<style>
.fir-color{
  width:200px;
  height:200px;
  background-color:#41b883;
}
.fir-color-relative{
  position:relative;
  width:200px;
  height:200px;
  left:100px;
  top:100px;
  background-color:#41b883;
}
.fir-color-absolute{
  position:absolute;
  width:200px;
  height:200px;
  right:0;
  top:-100px;
  background-color:#41b883;
}
.fir-color-absolute-2{
  position:absolute;
  width:100px;
  height:100px;
  bottom:0;
  right:0;
  background-color:#41b883;
}
.sec-color{
  width:100px;
  height:100px;
  background-color:#35495e;
}
.sec-color-relative{
  position:relative;
  width:200px;
  height:200px;
  background-color:#35495e;
}
.orange{
  position:fixed;
  top:250px;
  right:14rem;
  width:100px;
  height:100px;
  background-color:orange;
}
</style>

<div class="fir-color">static</div>
<div class="sec-color"></div>

在上面方块样式中添加 <code>position:relative</code>，并用 top 等定位偏移属性进行调整，可见其原本的空间仍然保留，不会影响常规流中的任何元素:

<div class="fir-color-relative">relative</div>
<div class="sec-color"></div>

### absolute

再看看 absolute 绝对定位，已经脱离文档流:

<div style="position:relative;">
  <div class="fir-color-absolute">absolute: 我感觉我跑偏了 😭</div>
  <div class="sec-color"></div>
</div>

这次将小方块作为父元素，设置为 relative，里面嵌套了绿色方块，且设置为 absolute，则子元素绝对定位是依赖于父元素的:

<div class="sec-color-relative">
  <div class="fir-color-absolute-2">absolute: 在呵护下成长 😁</div>
</div>

其规则为: 当元素设置 <code>position:absolute</code> 时，位置就是以其父代元素 position 不为 static 的元素作为参考，若都为 static，则以一直回溯到 body 元素。

### fixed

再看看 fixed 固定定位，是以窗口为参考的，在下面的栗子中，虽然它被包裹在褐色方块下，但它其实一直在你屏幕的右上角:

<div class="sec-color-relative">
  <div class="orange">fixed: 是不是觉得我很烦，因为我是下面栗子要用到的</div>
  <div class="fir-color-absolute-2">absolute: 在呵护下成长 😁，fixed 兄弟仍在外流浪</div>
</div>

利用 fixed 居中显示的一个方法:

```CSS
.center{
  position: fixed;
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color:orange;
}
```

## 参考链接

1. [css 盒模型和定位扫盲](https://zhuanlan.zhihu.com/p/24778275)
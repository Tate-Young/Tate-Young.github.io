---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端
title:  页面渲染
# date:   2018-01-29 23:23:00 GMT+0800 (CST)
background-image: https://sfault-image.b0.upaiyun.com/235/151/2351517245-5972085e433ea
tags:
- html
---
# {{ page.title }}

## 渲染步骤

根据 webkit 渲染引擎工作流可总结以下五个步骤:

1. HTML Parser 将 HTML 解析成 **DOM Tree**;
1. CSS Parser 将 CSS 解析成 **CSSOM Tree**;
1. 结合 DOM Tree 和 CSSOM Tree，生成一棵渲染树 **Render Tree**;
1. 生成布局(layout)，即将所有渲染树的所有节点进行平面合成;
1. 将布局绘制(paint)在屏幕上。

![webkit渲染引擎]( {{page.background-image}} )

## DOM Tree

**DOM Tree** 是由 DOM 元素和属性节点构成的树结构。根节点是 Document 对象。

**DOM(Document Object Model)** 文档对象模型，是 HTML 和 [XML](https://developer.mozilla.org/zh-CN/docs/XML_%E4%BB%8B%E7%BB%8D) 文档的编程接口。它提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构，样式和内容。一个 web 页面即是一个文档。

```HTML
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
    <title>Critical Path</title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
  </body>
</html>
```

![DOM Tree](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/dom-tree.png?hl=zh-cn)

## CSSOM Tree

**CSSOM Tree** 也称为 Style Rules，将样式表中的规则映射到页面对应的元素上。。

**CSSOM(CSS Object Model)** 是一组允许用 JavaScript 操纵 CSS 的 API，从而能够动态地读取和修改 CSS 样式。

```CSS
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }
```

![CSSOM Tree](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/cssom-tree.png?hl=zh-cn)

> 当遇到 script 标签的时候，解析器会立即解析脚本(除开延迟和异步脚本)，停止解析文档。

## Render Tree

### 构建过程

DOM 树与 CSSOM 树合并后形成**渲染树(Render Tree)**，浏览器大体上完成了下列工作：

1. 从 DOM 树的根节点开始遍历每个 *可见节点*;
1. 对于每个可见节点，为其找到适配的 CSSOM 规则并应用它们(创建对应呈现器);
1. 发射可见节点，连同其内容和计算的样式。

注：visibility: hidden 与 display: none 是不一样的。前者隐藏元素，但元素仍占据着布局空间（即将其渲染成一个空框），而后者 (display: none) 将元素从渲染树中完全移除，元素既不可见，也不是布局的组成部分。

### 呈现器

**呈现器(Renderer)** 也称为渲染器或呈现对象，包含诸如宽度、高度和位置等几何信息。由上可知，呈现器是和 DOM 元素相对应的，但并非一一对应。

有一些 DOM 元素对应多个可视化对象。它们往往是具有复杂结构的元素，例如，“select”元素有 3 个呈现器：一个用于显示区域，一个用于下拉列表框，还有一个用于按钮。如果由于宽度不够，文本无法在一行中显示而分为多行，那么新的行也会作为新的呈现器而添加。

![Render Tree](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/render-tree-construction.png)

> 在 WebKit 中，解析样式和创建呈现器的过程称为 attachment，每个 DOM 节点有一个 attach 方法，attachment 的过程是同步的，调用新节点的 attach 方法将节点插入到 DOM 树中。

## 布局

**布局(Layout)** 以计算每个节点的几何信息。布局流程的输出是一个“盒模型”，它会精确地捕获每个元素在视口内的确切位置和尺寸，所有相对测量值都转换为屏幕上的绝对像素。

### 回流

**回流(reflow)** 当对 DOM 进行修改时，可能会进行重新布局，分为:

* 全局布局 - 影响所有呈现器(Renderer)的全局样式更改，例如改变字体大小、屏幕大小等
* 增量布局 - 只对 dirty 呈现器进行布局

HTML 采用基于流的布局模型，这意味着大多数情况下只要一次遍历就能计算出几何信息。处于流中靠后位置元素通常不会影响靠前位置元素的几何特征，因此布局可以按从左至右、从上至下的顺序遍历文档。但是也有例外情况，比如 HTML 表格的计算就需要不止一次的遍历。

### Dirty 位系统

为避免对所有细小更改都进行回流，浏览器使用了脏位系统，只有一个呈现器改变了或者某呈现器及其子呈现器脏位值为”dirty”时，说明需要回流。表示需要布局的脏位值有两种：

* dirty – 自身改变
* children are dirty – 子节点改变

## 参考链接

1. [How browsers work](http://taligarsiel.com/Projects/howbrowserswork1.htm)
1. [How browsers work(译)](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
1. [Youtube-The Render Tree - Website Performance Optimization](https://www.youtube.com/watch?v=lvb06W_VKVE)
1. [Google-染树构建、布局及绘制](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)
1. [网页性能管理详解](http://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)
1. [浏览器渲染页面过程与页面优化](https://segmentfault.com/a/1190000010298038)
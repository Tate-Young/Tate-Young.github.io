---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端
title:  页面渲染
date:   2018-02-10 20:39:00 GMT+0800 (CST)
background-image: https://sfault-image.b0.upaiyun.com/235/151/2351517245-5972085e433ea
tags:
- html
---
# {{ page.title }}

## 渲染步骤

根据 Webkit 渲染引擎工作流可总结以下五个步骤:

1. HTML Parser 将 HTML 解析成 **DOM** ;
1. CSS Parser 将 CSS 解析成 **CSSOM**;
1. 结合 DOM 和 CSSOM，生成一棵渲染树 **Render Tree**;
1. **布局(layout)**，计算每个节点的几何信息;
1. **绘制(painting)**，将渲染器的内容显示在屏幕上。

![webkit渲染引擎]( {{page.background-image}} )

## DOM

**DOM(Document Object Model)** 文档对象模型，使用对象的表示方式来表示对应的文档结构及其中的内容。通过使用它提供的 API 可以动态地修改节点(node)。DOM树的根节点是 Document 对象。

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

![DOM](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/dom-tree.png?hl=zh-cn)

## CSSOM

**[CSSOM(CSS Object Model)](https://www.w3.org/TR/cssom/)** CSS对象模型，CSS样式表(CSS style sheet)以 CSSStyleSheet 对象呈现，可以通过其提供的API，动态地读取和修改 CSS 样式。

```CSS
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }
```

![CSSOM](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/cssom-tree.png?hl=zh-cn)

> 当遇到 script 标签的时候，解析器会立即解析脚本(除开延迟和异步脚本)，停止解析文档，详见[加载阻塞]( {{site.url}}/2018/02/10/html-render-blocking.html )。

## Render Tree

### 构建过程

DOM 树与 CSSOM 合并后形成**渲染树(Render Tree)**，这是由可视化元素按照其显示顺序而组成的树，浏览器大体上完成了下列工作：

1. 从 DOM 树的根节点开始遍历每个 *可见节点*;
1. 对于每个可见节点，为其找到适配的 CSSOM 规则并应用它们(创建对应渲染器);
1. 发散(emit)可见节点，包含其内容和计算的样式。

注：visibility: hidden 与 display: none 是不一样的。前者隐藏元素，但元素仍占据着布局空间（即将其渲染成一个空框），而后者 (display: none) 将元素从渲染树中完全移除，元素既不可见，也不是布局的组成部分。

### 渲染器

**渲染器(Renderer)** 也称为呈现器或呈现对象，包含诸如宽度、高度和位置等几何信息。由上可知，渲染器是和 DOM 元素相对应的，但并非一一对应。

有一些 DOM 元素对应多个可视化对象。它们往往是具有复杂结构的元素，例如，“select”元素有 3 个渲染器：一个用于显示区域，一个用于下拉列表框，还有一个用于按钮。如果由于宽度不够，文本无法在一行中显示而分为多行，那么新的行也会作为新的渲染器而添加。

> 在 WebKit 中，解析样式和创建渲染器的过程称为附加(attachment)，每个 DOM 节点有一个 attach 方法，附加的过程是同步的，调用新节点的 attach 方法将节点插入到 DOM 树中。

### 阻塞渲染

在渲染树构建中，关键渲染路径包含了 DOM 和 CSSOM。由于HTML 和 CSS 都是阻塞渲染的资源，这会给性能造成影响。因此要尽早的加载 CSS，并利用媒体类型和查询来解除对渲染的阻塞(DOM 解析依然正常进行)。

```HTML
<!-- 始终阻塞渲染 -->
<link href="style.css" rel="stylesheet">
<!-- 打印内容时使用，不阻塞渲染 -->
<link href="print.css" rel="stylesheet" media="print">
<!-- 只有满足条件时阻塞渲染 -->
<link href="other.css" rel="stylesheet" media="(min-width: 40em)">
```

> 无论哪一种情况，浏览器仍会下载 CSS 资源，只不过不阻塞渲染的资源优先级较低罢了。对于 CSS 本身的优化也至关重要，比如选择器的优先级使用、减少层级、避免使用 table 等等。

![Render Tree](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/render-tree-construction.png)

## 布局

**布局(Layout)** 以计算每个节点的几何信息。布局流程的输出是一个“盒模型”，它会精确地捕获每个元素在视口内的确切位置和尺寸，所有相对测量值都转换为屏幕上的绝对像素。

### 重排

**重排(reflow)** 当对 DOM 进行修改时，可能会进行重新布局，分为:

* 全局布局 - 影响所有渲染器(Renderer)的全局样式更改，例如改变字体大小、屏幕大小等，一般是同步执行
* 增量布局 - 只对 dirty 渲染器进行布局，一般是异步执行

HTML 采用基于流的布局模型，这意味着大多数情况下只要一次遍历就能计算出几何信息。处于流中靠后位置元素通常不会影响靠前位置元素的几何特征，因此布局可以按从左至右、从上至下的顺序遍历文档。但是也有例外情况，比如 HTML 表格(table)的计算就需要不止一次的遍历。

### 脏位系统

为避免对所有细小更改都进行重排，浏览器使用了脏位系统(dirty bit system)，只有一个渲染器改变了或者某渲染器及其子渲染器脏位值为”dirty”时，说明需要重排。表示需要布局的脏位值有两种：

* dirty – 自身改变
* children are dirty – 子节点改变

## 绘制

在**绘制(painting)**阶段，系统会遍历渲染树，并调用渲染器的“paint”方法，将渲染器的内容显示在屏幕上。绘制工作是使用用户界面基础组件完成的。

和重排一样，也会出现**重绘(repaint)**，分为全局绘制和增量绘制。重绘一般针对于修改背景色、边框等，不会造成几何信息变化。

```js
// 重排必然导致重绘
$('body').css('color', 'orange'); // repaint
$('body').css('margin', '10px'); // reflow, repaint

var bodyStyle = document.body.style; // cache

bodyStyle.padding = "20px"; // reflow, repaint
bodyStyle.border = "1px solid black"; //  再一次的 reflow 和 repaint

bodyStyle.color = "blue"; // repaint
bodyStyle.backgroundColor = "#333"; // repaint

bodyStyle.fontSize = "1rem"; // reflow, repaint

// new DOM element - reflow, repaint
document.body.appendChild(document.createTextNode('Tate'));
```

> WebKit 有用于执行增量布局的计时器，满足触发条件后才会对渲染树进行遍历，并对 dirty 渲染器进行布局。并不是没修改一次就遍历一次。一般情况下，全局布局是同步执行，调整窗口大小或改变了页面默认的字体等都会造成立即重排。

## 参考链接

1. [How browsers work](http://taligarsiel.com/Projects/howbrowserswork1.htm)
1. [How browsers work(译)](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
1. [Youtube-The Render Tree - Website Performance Optimization](https://www.youtube.com/watch?v=lvb06W_VKVE)
1. [Understanding the Critical Rendering Path](https://bitsofco.de/understanding-the-critical-rendering-path/)
1. [Google-染树构建、布局及绘制](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)
1. [浏览器渲染页面过程与页面优化](https://segmentfault.com/a/1190000010298038)
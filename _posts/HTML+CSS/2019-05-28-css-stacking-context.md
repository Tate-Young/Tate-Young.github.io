---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  CSS 层叠上下文
date:   2019-05-28 17:37:00 GMT+0800 (CST)
background-image: /style/images/smms/html-css.webp
tags:
- css
---
# {{ page.title }}

## 什么是层叠上下文

[**层叠上下文(the stacking context)**](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context) 是 HTML 元素的三维概念，每个盒模型的位置是三维的，分别是平面画布上的 X 轴，Y 轴以及表示层叠的 Z 轴。HTML 元素依据其自身属性按照优先级顺序占用层叠上下文的空间。对于用户的感知而言，元素位于 z 轴越高，则离用户越近，较低的元素则可能被覆盖。

这样又牵扯到另一个概念，即**层叠等级**(stacking level)，其表示的是:

* 同一个层叠上下文中，元素在 Z 轴上的层叠顺序
* 普通元素中，元素在 Z 轴上的层叠顺序

> 层叠等级的比较只有在当前层叠上下文元素中才有意义。不同层叠上下文中比较层叠等级是没有意义的。

## 如何产生层叠上下文

文档中的层叠上下文由满足以下任意一个条件的元素形成，更多[可以参考这里](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context) 👈:

* 根元素 html，即"根层叠上下文"
* **z-index** 值不为 "auto" 的绝对/相对定位
* z-index 值不为 "auto" 的 flex 项目，即父元素 `display: flex|inline-flex`
* **opacity** 属性值小于 1 的元素
* **transform** 属性值不为 "none" 的元素
* **filter** 值不为 "none" 的元素
* mix-blend-mode 属性值不为 "normal" 的元素

下面采用[这篇文章的简单示例](https://juejin.im/post/5b876f86518825431079ddd6)做讲解:

```HTML
<style>
  div {  
    position: relative;  
    width: 100px;  
    height: 100px;  
  }  
  p {  
    position: absolute;  
    font-size: 20px;  
    width: 100px;  
    height: 100px;  
  }  
  .a {  
    background-color: blue;  
    z-index: 1;  
  }  
  .b {  
    background-color: green;  
    z-index: 2;  
    top: 20px;  
    left: 20px;  
  }  
  .c {  
    background-color: red;  
    z-index: 3;  
    top: -20px;  
    left: 40px;  
  }
</style>

<body>  
  <div>  
    <p class="a">a</p>  
    <p class="b">b</p>  
  </div>

  <div>  
    <p class="c">c</p>  
  </div>  
</body>
```

![css-stacking-context-1.jpeg]( {{site.url}}/style/images/smms/css-stacking-context-1.jpeg )

因为 p.a、p.b、p.c 三个的父元素 div 都没有设置 z-index 属性，不会产生层叠上下文。所以 .a、.b、.c 都处于根层叠上下文中，属于同一个层叠上下文，值大的在上。再看看下一个栗子:

```HTML
<style>
  div {
    width: 100px;
    height: 100px;
    position: relative;
  }
  .box1 {
    z-index: 2;
  }
  .box2 {
    z-index: 1;
  }
  p {
    position: absolute;
    font-size: 20px;
    width: 100px;
    height: 100px;
  }
  .a {
    background-color: blue;
    z-index: 100;
  }
  .b {
    background-color: green;
    top: 20px;
    left: 20px;
    z-index: 200;
  }
  .c {
    background-color: red;
    top: -20px;
    left: 40px;
    z-index: 9999;
  }
</style>

<body>
  <div class="box1">
    <p class="a">a</p>
    <p class="b">b</p>
  </div>

  <div class="box2">
    <p class="c">c</p>
  </div>
</body>
```

![css-stacking-context-2.jpeg]( {{site.url}}/style/images/smms/css-stacking-context-2.jpeg )

我们可以看到虽然 p.c 元素的 z-index 值为 9999，远大于 p.a 和 p.b，但是由于 p.a、p.b 的父元素 .box1 产生的层叠上下文的 z-index 的值为 2，p.c 的父元素 .box2 所产生的层叠上下文的 z-index 值为 1，所以 p.c 永远在 p.a 和 p.b 下面 😱。

## 层叠顺序

对于生成的层叠上下文，我们也有对应的**层叠顺序**规则:

* 左上角层叠上下文的 `background/border` 指的是层叠上下文元素的背景和边框，注意前提是层叠上下文元素
* `inline/inline-block` 元素的层叠顺序要高于 block(块级)/float(浮动)元素
* 单纯考虑层叠顺序，`z-index: auto` 和 `z-index: 0` 在同一层级，但这两个属性值本身是有根本区别的。**设置为 auto 不会产生层叠上下文**

![css-stacking-context-3.jpeg]( {{site.url}}/style/images/smms/css-stacking-context-3.jpeg )

这就可以解释为什么定位元素会层叠在普通元素的上面，因为定位元素 z-index 会自动设置为默认的 auto，根据上面的层叠顺序表，就会覆盖普通的 inline 或 block 等元素。

> 当两个元素层叠等级相同、层叠顺序相同时，在 DOM 结构中后面的元素层叠等级在前面元素之上。

让我们再看看几个栗子:

```HTML
<style>
  .parent {
    width: 200px;
    height: 100px;
    background: #168bf5;
    /* 虽然设置了 z-index，但是没有设置 position 定位，z-index 无效，.parent 还是普通元素，没有产生层叠上下文 */
    z-index: 1;
  }
  .child {
    width: 100px;
    height: 200px;
    background: #32d19c;
    position: relative;
    z-index: -1;
  }
</style>
</head>

<body>
  <div class="box">
    <div class="parent">
      parent
      <div class="child">child</div>
    </div>
  </div>
</body>
```

![css-stacking-context-4.jpeg]( {{site.url}}/style/images/smms/css-stacking-context-4.jpeg )

显而易见，在层叠顺序规则中，`z-index < 0` 的 .child 会被普通的 block 块级元素 .parent 覆盖。如果其他不变，只改变 .box 样式:

```CSS
.box {
  display: flex;
}
```

![css-stacking-context-5.jpeg]( {{site.url}}/style/images/smms/css-stacking-context-5.jpeg )

我们可以看到，当给父级元素 .box 设置 `display: flex` 时，.parent 就变成层叠上下文元素，根据层叠顺序规则，层叠上下文元素的`background/border` 的层叠等级小于 `z-index < 0` 的元素的层叠等级，所以 .child 在 .parent 上面。

最后，我们自己再在线调试一下吧:

<script async src="//jsfiddle.net/Tate_Young/7vr4a3d9/embed/html,css,result/"></script>

## 参考链接

1. [深入理解 CSS 中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/) By 张鑫旭
2. [彻底搞懂 CSS 层叠上下文、层叠等级、层叠顺序、z-index](https://juejin.im/post/5b876f86518825431079ddd6) By MagicEyes

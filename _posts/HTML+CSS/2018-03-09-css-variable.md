---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  CSS 变量
date:   2018-03-09 14:29:00 GMT+0800 (CST)
background-image: http://www.ruanyifeng.com/blogimg/asset/2017/bg2017050901.jpg
tags:
- css
---
# {{ page.title }}

## 变量申明

使用过 Less 或者 SASS 的同学肯定知道样式中的变量，原生 CSS 也支持变量的自定义。**CSS 变量(variables)**使用自定义属性来设置变量名，并使用特定的 **var()** 函数来访问。

```HTML
<p class="sub-demo">Tate</p>
<div>520</div>
<div class="demo"><p class="sub-demo">Snow</p></div>
```

```CSS
/* :root 声明一个全局变量，变量名大小写敏感 */
:root {
  --global-color: #666;
}

/* 使用一个全局变量，变量不可用作属性名*/
/* .demo 下定义的变量的作用域是当前选择器的生效范围，继承有效 */
.demo {
  color: var(--global-color);

  /* 可选第二个默认值参数，若 foo 变量不存在，则使用默认值 #333 */
  color: var(--foo, #333);

  /* 可在变量中使用另一个变量 */
  --size: 10px;
  --font-size: var(--size);

  /* 使用变量数值带单位的情况 */
  --margin: 10;
  /* 无效 */
  /* margin-top: var(--margin)rem; */
  /* 须使用calc()函数 */
  margin-top: calc(var(--margin) * 1rem);
}

/* 在作用域内生效，即只有 Snow 才会响应字体变化 */
.sub-demo {
  font-size: var(--font-size);
}

/* media queries 在 Less 和 SASS 使用其变量无效，然而 CSS 变量阔以 */
@media screen and (max-width: 768px) {
  .demo {
    --font-size:  2rem;
    --margin: 2rem;
  }
}
```

## 兼容性处理

目前几乎所有主流浏览器都支持，具体[可查看 caniuse](https://caniuse.com/#feat=css-variables) 👈👈👈

```CSS
@supports ( (--a: 0)) {
  /* supported */
}

@supports ( not (--a: 0)) {
  /* not supported */
}
```

JS 也可检测浏览器兼容性:

```JS
const isSupported =
  window.CSS &&
  window.CSS.supports &&
  window.CSS.supports('--a', 0);

if (isSupported) {
  /* supported */
} else {
  /* not supported */
}
```

## JS 交互

### getPropertyValue()

JS 操作 CSS 变量:

```JS
const demo = document.querySelector('.demo');

// 读取
const size = getComputedStyle(demo).getPropertyValue('--size').trim(); // 10px
// 设置
demo.style.setProperty('--size', '20px');
// 删除
demo.style.removeProperty('--size');
```

### getComputedStyle()

**getComputedStyle()** 和 **element.style** 的相同点就是二者返回的都是 CSSStyleDeclaration 对象，取相应属性值得时候都是采用的 CSS 驼峰式写法。一般情况下可以通过使用 getComputedStyle() 读取样式，通过 element.style 修改样式:

| 不同点 | getComputedStyle() | element.style |
|:--------------|:---------|:---------|
| 读取范围 |  读取的样式是最终样式，包括了“内联样式”、“嵌入样式”和“外部样式” | 读取的只是元素的“内联样式”，即写在元素的 style 属性上的样式 |
| 写入 |  仅支持 `读` | 支持 `读写` |
| 兼容性 |  IE9 以下使用 **element.currentStyle** | 无 |

```JS
// 兼容性方法
function readStyle(element, cssPropertyName){
  if(getComputedStyle) { // 如果支持 getComputedStyle 属性(IE9 及以上，ie9 以下不兼容)
    return getComputedStyle(element)[cssPropertyName];
  } else { // 如果支持 currentStyle(IE9 以下使用)
    return element.currentStyle[cssPropertyName];
  }
}
```

1. [MDN - 使用 CSS 变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_variables)
1. [CSS 变量教程](http://www.ruanyifeng.com/blog/2017/05/css-variables.html) By 阮一峰
1. [It's Time To Start Using CSS Custom Properties](https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/) By Serg
1. [Winning with CSS Variables](https://vgpena.github.io/winning-with-css-variables/) By violet
1. [window.getComputedStyle() 方法的使用](http://blog.csdn.net/s110902/article/details/73312802?locationNum=12&fps=1) By sico123

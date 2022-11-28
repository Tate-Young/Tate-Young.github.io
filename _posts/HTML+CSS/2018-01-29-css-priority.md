---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  CSS 选择器优先级
date:   2018-01-29 23:23:00 GMT+0800 (CST)
background-image: /style/images/smms/html-css.webp
tags:
- css
---
# {{ page.title }}

## 什么是CSS选择器

### 基础选择器

| 基础选择器 | 举个栗子 |
|:-------------|:------------------|
| 标签选择器 | div、span |
| ID选择器 | #id |
| 类选择器 | .class |
| 伪类选择器 | :hover、:first-of-type、:before |
| 属性选择器 | [attr=val]、[attr~=val]、[attr^=val] |

### 组合选择器

| 组合选择器 | 名称 | 描述 |
|:-------------|:------------------|:------------------|
| E,F | 多元素选择器 | 选择所有 E 元素和 F 元素 |
| E F | 后代选择器 | 选择 E 元素内部的所有 F 元素 |
| E>F | 子选择器 | 选择父元素为 E 元素的所有 F 元素 |
| E+F | 相邻兄弟选择器 | 选择紧接在 E 元素之后的所有 F 元素 |
| E~F | 通用兄弟选择器 | 选择前面有 E 元素的每个 F 元素 |

## CSS选择器优先级

### 优先级权重

| 优先级 | 描述 | 权重 |
|:-------------|:------------------|:------------------|
| 赛高 | !important(慎用) | 无 |
| 甲等 | 内联样式，如：style="xxx" | 1000 |
| 乙等 | ID选择器，如：#id | 100 |
| 丙等 | 类、伪类和属性选择器，如.class、:hover、[attr] | 10 |
| 丁等 | 标签选择器，如div、p | 1 |
| 戍等 | 通用选择器、子选择器和相邻兄弟选择器等，如*、>、+ | 0 |

### 优先级权重计算

* 优先级就是分配给指定的 CSS 声明的一个权重，它由匹配的选择器中的每一种选择器类型的数值决定。
* 而当优先级与多个 CSS 声明中任意一个声明的优先级相等的时候，CSS 中最后的那个声明将会被应用到元素上。
* 当同一个元素有多个声明的时候，优先级才会有意义。因为每一个直接作用于元素的 CSS 规则总是会接管或覆盖该元素从祖先元素继承而来的规则。

```CSS
/* 权值计算 100(#content) + 1(div) + 100(#main-content) + 1(h2) = 202 */
#content div#main-content h2{
  color:red;
}
```

```CSS
/* 权值计算 100(#main-content) + 1(div) + 10(.paragraph) + 1(h2) = 112 */
#main-content div.paragraph h2 {
  color:orange;
}
```

```CSS
/* 权值计算 100(#main-content) + 10(class="paragraph") + 1(h2) = 111 */
#main-content [class="paragraph"] h2 {
  color:yellow;
}
```

```HTML
<!-- 栗子转载于链接3，感谢提供 -->
<div id="content">
  <div id="main-content">
    <h2>CSS简介</h2>
    <p>CSS（Cascading Style Sheet，可译为“层叠样式表”或“级联样式表”）是一组格式设置规则，用于控制Web页面的外观。</p>
    <div class="paragraph">
      <h2 class="first">使用CSS布局的优点</h2>
      <p>1、表现和内容相分离 2、提高页面浏览速度 3、易于维护和改版 4、使用CSS布局更符合现在的W3C标准.</p>
    </div>
  </div>
</div>
```

## 参考链接

1. [w3school - 选择器](http://www.w3school.com.cn/cssref/css_selectors.ASP)
1. [MDN - CSS优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)
1. [简书 - CSS选择器的权重与优先级](https://www.jianshu.com/p/f31d03f6ebe3) By DHFE

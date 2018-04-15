---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  CSS 换行与断词
date:   2018-04-13 09:59:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- css
---

# {{ page.title }}

## 换行属性

CSS 里涉及到换行的与断词几个属性晒一晒:

* **word-break** - 用于处理单词换行和断词规则
* **word-wrap** - 设置当内容超过指定容器的边界时是否断词
* **white-space** - 设置空格处理方式

### word-break

```CSS
word-break：normal | keep-all | break-all
```

**word-break** 用于处理单词换行和断词规则，取值为:

* **normal** - 使用浏览器默认的换行规则
* **keep-all** - 单词太长，换行 + 溢出
* **break-all** - 单词太长，断词

<style>
li,.post-content p{word-wrap:normal !important;word-break:normal !important;}
.test p{width:150px;border:1px solid #000;background-color:#eee;}
.normal p{word-break:normal !important;}
.break-all p{word-break:break-all !important;}
.keep-all p{word-break:keep-all !important;}
.wrap-normal p{word-wrap:normal !important;}
.break-word p{word-wrap:break-word !important;}
</style>

<ul class="test">
	<li class="normal">
		<strong>normal：</strong>
		<p>iamalonglonglonglonglonglonglonglonglongword</p>
	</li>
	<li class="keep-all">
		<strong>keep-all：</strong>
		<p>iamalonglonglonglonglonglonglonglonglongword</p>
	</li>
	<li class="keep-all">
		<strong>keep-all：</strong>
		<p>This is a very looooooooooooooooooooooooog word</p>
	</li>
	<li class="break-all">
		<strong>break-word：</strong>
		<p>iamalonglonglonglonglonglonglonglonglongword</p>
	</li>
	<li class="break-all">
		<strong>break-word：</strong>
		<p>This is a very looooooooooooooooooooooooog word</p>
	</li>
</ul>

### word-wrap

```CSS
word-wrap：normal | break-word
```

**word-wrap** 设置当内容超过指定容器的边界时是否断词，取值为:

* **normal** - 单词太长，换行 + 溢出
* **break-word** - 单词太长，换行 + 断词

<ul class="test">
	<li class="wrap-normal">
		<strong>normal：</strong>
		<p>This is a very looooooooooooooooooooooooog word</p>
	</li>
	<li class="break-word">
		<strong>break-word：</strong>
		<p>This is a very looooooooooooooooooooooooog word</p>
	</li>
</ul>

### white-space

```CSS
white-space：normal | pre | pre-wrap | pre-line  | nowrap
```

**white-space** 设置空白处理方式，取值为:

* **normal** - 默认浏览器处理方式
* **pre** - 保留所有的空格和回车，且不允许换行
* **pre-wrap** - 保留所有的空格和回车，但是允许换行
* **pre-line** - 会合并空格，且允许换行
* **no-wrap** - 强制在同一行内显示所有文本，合并文本间的多余空白，直到文本结束或者遭遇 br 对象

<style>
.pre p{white-space:pre !important;}
.pre-wrap p{white-space:pre-wrap !important;}
.pre-line p{white-space:pre-line !important;}
.nowrap p{white-space:nowrap !important;}
.nowrap-clip p{white-space:nowrap !important;text-overflow:clip;overflow:hidden}
.nowrap-ellipsis p{white-space:nowrap !important;text-overflow:ellipsis;overflow:hidden}
</style>

<ul class="test">
	<li class="normal">
		<strong>normal：</strong>
		<p>轻轻地我走了
	正如我轻轻地来</p>
	</li>
	<li class="pre">
		<strong>pre：</strong>
		<p>轻轻地我走了（这里接很多测试文字）
	正如我轻轻地来</p>
	</li>
	<li class="pre-wrap">
		<strong>pre-wrap：</strong>
		<p>轻轻地    我走了（这里接很多测试文字）
	正如我轻轻地来</p>
	</li>
	<li class="pre-line">
		<strong>pre-line</strong>
		<p>轻轻地    我走了（这里接很多测试文字）
	正如我轻轻地来</p>
	</li>
	<li class="nowrap">
		<strong>nowrap：</strong>
		<p>轻轻地我走了
	正如我轻轻地来</p>
	</li>
</ul>

配合 **text-overflow** 样式，取值为:

* **clip** - 当内联内容溢出块容器时，将溢出部分裁切掉
* **ellipsis** - 当内联内容溢出块容器时，将溢出部分替换为(...)

<ul class="test">
	<li class="nowrap-clip">
		<strong>clip：</strong>
		<p>轻轻地我走了
	正如我轻轻地来</p>
	</li>
	<li class="nowrap-ellipsis">
		<strong>ellipsis：</strong>
		<p>轻轻地我走了
	正如我轻轻地来</p>
	</li>
</ul>

```CSS
.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
```

## 块级 / 内联

在文档流里，会涉及到**块级元素(block-level elements)**和**内联元素(inline elements)**，区别为:

| 区别 | 块级元素 | 内联元素 |
|:--------------|:---------|:---------|
| display | block | inline |
| 行显示 | 独占一行 | 在一行显示，直到排满 |
| 宽高 | 支持 width、height 属性 | 不支持 width、height 属性 |
| 补白 | 支持 padding、margin 属性 | 不支持 padding、margin 竖直方向的属性 |
| 元素类别 | div、form、h1~h6、li、p 等 | a、span、input 等 |

通过 **display** 属性可以设置元素的布局行为，相关常用的取值为:

* **none** - 隐藏对象，与 <code>visibility: hidden</code>不同，该值不保留隐藏对象的物理空间
* **inline** - 指定对象为内联元素
* **block** - 制定对象为块级元素
* **inline-block** - 指定对象为内联块元素，呈现为 inline 对象，但是对象的内容作为 block 对象呈现
* **flex** - 将对象作为弹性伸缩盒显示，详细请[查看 flex 布局]( {{site.url}}/2018/02/12/css-flex.html )

```CSS
display：none | inline | block | inline-block | flex | (...)
```

## 参考链接

1. [CSS 单词换行 and 断词，你真的完全了解吗](http://www.alloyteam.com/2016/05/css-word-for-word-breaker-do-you-really-understand/)
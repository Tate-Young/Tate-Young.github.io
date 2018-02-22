---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  包装对象
date:   2018-02-01 23:27:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- JavaScript
---
# {{ page.title }}

## 怎么理解JS一切都是对象

对象是拥有属性和方法的特殊数据类型，个人认为基本类型其实不属于对象，因为他们是immutable不可变的，也没有属性和方法而言。然而如下例子

```js
var s = 'Tate';
console.log(s.length); // 4
console.log(s.toUpperCase()); // TATE
console.log(s.replace('T', 't')) // tate
console.log(s); // 'Tate' 基本类型值不可变
```

为什么基本类型也拥有类似对象的特性，原因就在于调用属性和方法的时候，JS会自动将其转换成对应的包装对象(只读)，调用结束后这个临时对象会被销毁。

## 什么是包装对象

所谓“**包装对象(Wrapper Object)**”，就是分别与数值、字符串、布尔值相对应的**Number、String、Boolean**三个原生对象。这三个原生对象可以把原始类型的值包装成对象。

```js
// 以上例子实际等同于
var s = 'Tate';
var S = new String(s);
console.log(S.length);
// S {
//   0: "T", 1: "a", 2: "t", 3: "e", length: 4, [[PrimitiveValue]]: "Tate"
// }
console.log(S.toUpperCase());
```

上面代码中，字符串的包装对象有每个位置的值、有length属性、还有一个内部属性[[PrimitiveValue]]保存字符串的原始值。这个[[PrimitiveValue]]内部属性，外部是无法调用，仅供valueOf()或toString()这样的方法内部调用。

![包装对象实现原理]({{ site.url }}/style/images/wrapper-obj.png)

## 参考链接

1. [包装对象](http://javascript.ruanyifeng.com/stdlib/wrapper.html)
1. [简书 - javascirpt 包装对象(wrapper object)](https://www.jianshu.com/p/7e585f06d029)
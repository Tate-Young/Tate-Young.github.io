---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  记一些小技巧和代码块
date:   2018-07-20 11:01:00 GMT+0800 (CST)
update: 2019-08-07 16:36:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- JavaScript
---
# {{ page.title }}

这篇算是收录的简单**小技巧(Tips)**和**代码块(Code Snippets)**，之前很多都没有记录下来，从头开始吧 🤷‍♀️

## 小技巧

### ID 生成器

```JS
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9)
}
```

### 跳出 for 循环

* **break** - 终止循环
* **continue** - 跳出本次循环，继续下次循环

```JS
for (var n = 0; n < 5; n += 1) {
  if (n === 2) {
    // break
    continue
  }
  // break output --> 0, 1
  // continue output --> 0, 1, 3, 4
  console.log(n)
}
```

### sort 对非 ASCII 字符排序

一般 [**sort**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 默认是按照字符串 Unicode 码点升序排列:

```JS
const arr = ['c', 'a', 'b']
arr.sort() // ['a', 'b', 'c']

const numbers = [1, 30, 4, 21, 100000]
numbers.sort() // [1, 100000, 21, 30, 4]
```

为了解决上面的数字排序问题，可以添加比较函数作为 sort 方法的参数:

```JS
// 常规写法
function compare(a, b) {
  if (a < b ) {
    return -1
  }
  if (a > b ) {
    return 1
  }
  // a must be equal to b
  return 0
}

// better 更简洁
function compare(a, b) {
  return +(a > b) || +(a === b) - 1
}

numbers.sort(compare)
```

要比较数字而非字符串，比较函数可以简单的以 a 减 b，如下的函数将会将数组升序排列:

```JS
function compareNumbers(a, b) {
  return a - b
}

// 或者
numbers.sort((a, b) => a - b)
```

对非 ASCII 字符排序，可以使用 [**localeCompare**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) 函数排序到正确的顺序，localeCompare 方法返回一个数字来指示一个参考字符串是否在排序顺序前面或之后或与给定字符串相同:

```JS
const arr = ['呲', '啊', '博']
arr.sort((a, b) => a.localeCompare(b)) // ["啊", "博", "呲"]
```

`compareFunction` 可能需要对元素做多次映射以实现排序，尤其当 compareFunction 较为复杂，且元素较多的时候，某些 compareFunction 可能会导致很高的负载。使用 map 辅助排序将会是一个好主意。基本思想是首先将数组中的每个元素比较的实际值取出来，排序后再将数组恢复:

```JS
// 需要被排序的数组
var list = ['Delta', 'alpha', 'CHARLIE', 'bravo']

// 对需要排序的数字和位置的临时存储
var mapped = list.map(function(el, i) {
  return { index: i, value: el.toLowerCase() }
})

// 按照多个值排序数组
mapped.sort(function(a, b) {
  return +(a.value > b.value) || +(a.value === b.value) - 1
})

// 根据索引得到排序的结果
var result = mapped.map(function(el){
  return list[el.index]
})
```

### 判断元素是否位于视窗内

通常有两种方法来进行判断，以下图和栗子引用自[这篇博客](https://imweb.io/topic/5c7bc84ebaf81d7952094978?utm_source=tuicool&utm_medium=referral):

* [**Element.getBoundingClientRect()**](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) - 返回元素的大小及其相对于视口的位置，包括 top、bottom、left 和 right
* [**Intersection Observer API**](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API) - 提供了一种异步观察目标元素与祖先元素或顶级文档 viewport 的交集中的变化的方法。目前兼容性堪忧，但是有 [w3c - IntersectionObserver Polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) 👈

#### Element.getBoundingClientRect()

通过 Element.getBoundingClientRect()，我们可以拿到素的大小及其相对于视口的位置:

```JS
const target = document.querySelector('.target')
const clientRect = target.getBoundingClientRect()

console.log(clientRect)

// {
//   bottom: 556.21875,
//   height: 393.59375,
//   left: 333,
//   right: 1017,
//   top: 162.625,
//   width: 684
// }
```

该方法返回值是一个 **DOMRect** 对象，这个对象是由该元素的 `getClientRects()` 方法返回的一组矩形的集合，除了 width 和 height 外的属性都是相对于视口的左上角位置而言的:

![getBoundingClientRect](https://mdn.mozillademos.org/files/15087/rect.png)

因此我们直接可以进行以下的兼容性判断:

```JS
function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth
  const viewHeight = window.innerHeight || document.documentElement.clientHeight
  const {
    top,
    right,
    bottom,
    left,
  } = element.getBoundingClientRect()

  return (
    top >= 0 &&
    left >= 0 &&
    right <= viewWidth &&
    bottom <= viewHeight
  );
}

console.log(isInViewPort(document.querySelector('.target'))) // true or false
```

#### Intersection Observer API

Intersection Observer 即重叠观察者，从这个命名就可以看出它用于判断两个元素是否重叠。需要 **创建观察者** 和 **传入被观察者**:

1、创建观察者

```JS
const options = {
  // 表示重叠面积占被观察者的比例，从 0 - 1 取值，
  // 1 表示完全被包含
  threshold: 1.0,
}

const callback = (entries, observer) => { ....}
// 传入的参数 callback 在重叠比例超过 threshold 时会被执行
const observer = new IntersectionObserver(callback, options)
```

2、传入被观察者

```JS
const target = document.querySelector('.target')
observer.observe(target);

// 上段代码中被省略的 callback
const callback = function(entries, observer) {
  entries.forEach(entry => {
    entry.time               // 触发的时间
    entry.rootBounds         // 根元素的位置矩形，这种情况下为视窗位置
    entry.boundingClientRect // 被观察者的位置矩形
    entry.intersectionRect   // 重叠区域的位置矩形
    entry.intersectionRatio  // 重叠区域占被观察者面积的比例（被观察者不是矩形时也按照矩形计算）
    entry.target             // 被观察者 👈
  })
}
```

根据在线栗子，我们来对比下两者的实践和性能。首先是使用 Element.getBoundingClientRect() 进行计算实现的效果，可以看到有非常明显的卡顿，主要是因为需要对每一个元素都进行计算，判断它们是否在视窗之内。具体的代码可以[点击查看](https://codepen.io/elvinn/pen/YgWKGy):

![1](https://ww1.sinaimg.cn/large/005XbUDxgy1g0pv2uwf6zg30iz0bln3w.gif)

然后是使用 Intersection Observer API 进行注册回调实现的效果，可以看出来十分流畅。具体的代码可以[点击查看](https://codepen.io/elvinn/pen/jJrNyZ):

![2](https://ws1.sinaimg.cn/large/005XbUDxgy1g0pv6x5m2qg30ir0bkwnf.gif)

## 代码块

### webStore 简单封装

```JS
const webStore = {
  storeEngine: window.localStorage,
  set(name, value) {
    this.storeEngine.setItem(name, JSON.stringify(value))
    return this
  },
  get(name) {
    return JSON.parse(this.storeEngine.getItem(name))
  },
  remove(name) {
    Array.isArray(name) // eslint-disable-line no-unused-expressions
      ? name.forEach(n => this.storeEngine.removeItem(n))
      : this.storeEngine.removeItem(name)
    return this
  },
  flushAll() {
    this.storeEngine.clear()
    return this
  },
}
```

### 获取 query 参数

```JS
// 获取 query 参数
const getQueries = (str = '') => {
  const queries = {}

  if (str) {
    const reg = /[^&=?]+=[^&]*/g
    const matchArr = str.match(reg)

    if (matchArr.length) {
      matchArr.forEach((item) => {
        const [key, value] = item.split('=')
        queries[key] = value
      })
    }
  }

  return queries
}
```

### 首字母 capitalize

```JS
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
```

## 参考链接

1. [ID - a unique ID/name generator for JavaScript](https://gist.github.com/gordonbrander/2230317) By gordonbrander
2. [判断元素是否在视窗之内 - IMWeb](https://imweb.io/topic/5c7bc84ebaf81d7952094978?utm_source=tuicool&utm_medium=referral)

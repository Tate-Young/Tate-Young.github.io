---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  记一些小技巧和代码块
date:   2018-07-20 11:01:00 GMT+0800 (CST)
update:   2019-05-29 11:45:00 GMT+0800 (CST)
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

## 参考链接

1. [ID - a unique ID/name generator for JavaScript](https://gist.github.com/gordonbrander/2230317) By gordonbrander

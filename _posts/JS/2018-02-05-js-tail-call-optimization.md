---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  尾调用优化
date:   2018-02-05 23:26:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- JavaScript
- ES6
---
# {{ page.title }}

## 什么是尾调用和尾递归

**尾调用(Tail Call)** 是指一个函数里的最后一个动作是一个函数调用，这种情形下称该调用位置为尾位置。若这个函数在尾位置调用本身（或是一个尾调用本身的其他函数等等），则称这种情况为 **尾递归**。

```js
function foo(x){
  return bar(x);
}

// 以下均不属于尾调用
function foo(x){
  return bar(x) + 1;
}

function foo(x){
  var b = bar(x);
  return b;
}
```

## 尾调用优化

[上一篇事件循环]( {{ site.url }}/2018/02/05/js-event-loop.html )有介绍栈帧和调用栈。使用尾调用优化后由于不会用到外层函数栈帧里的调用位置、内部变量等信息，所以不会在调用栈上增加新的栈帧，而是更新它，如同迭代一般。既节省了内存，又避免了爆栈的可能性。

> 尾调用优化是在支持 ES6 的解释器里添加的，只在ES6严格模式下生效。

## 尾递归优化

由于递归有过多的函数调用，会产生比较多的栈帧，所以十分消耗内存空间，很容易发生 **[堆栈溢出(stack overflow)](https://zh.wikipedia.org/wiki/%E5%A0%86%E7%96%8A%E6%BA%A2%E4%BD%8D)**。但对于尾递归来说，则只存在一个栈帧。

```js
// Bad
function factorial(n) {
  if (n === 1) return 1; // 基准条件，停止递归调用
  return n * factorial(n - 1);
}

factorial(5) // 120
```

上面代码是一个阶乘函数，计算n的阶乘，最多需要保存n个调用记录，复杂度 [O(n)](https://zh.wikipedia.org/wiki/%E5%A4%A7O%E7%AC%A6%E5%8F%B7)。如果改写成尾递归，只保留一个调用记录，复杂度降至 O(1) 。

```js
// Good
function factorial(n, m) {
  if (n === 1) return m;
  return factorial(n - 1, n * m);
}

factorial(5, 1) // 120
```

此处实行函数式编程里的 **[柯里化(currying)](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)**，把接受多个参数的函数变换成接受一个单一参数的函数。

```js
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}

function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorial, 1);

factorial(5) // 120
```

或者直接使用ES6函数默认值：

```js
// Best
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120
```

## ES5替代方案

```js
// 堆栈溢出示例
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum(1, 100000) // Uncaught RangeError: Maximum call stack size exceeded
```

在当前的JS版本（ES5）中可以使用以下方式来优化递归。我们可以定义一个 **trampoline(蹦床)** 函数来解决参数过大造成的“堆栈溢出”问题。其原理是将递归执行转为循环执行。

```js
//放入trampoline中的函数将被转换为函数的输出结果
function trampoline(f) {
    while (f && f instanceof Function) {
        f = f();
    }
    return f;
}

function sum(x, y) {
    function recur(x, y) {
        if (y > 0) {
          return recur.bind(null, x + 1, y - 1); // recur函数的每次执行，都会返回自身的另一个版本
        } else {
          return x;
        }
    }
    return trampoline(recur.bind(null, x, y));
}

sum(1, 100000); // => 100001
```

> 以上替代方案实际改变了递归函数本身，是属于“入侵式”的。关于如何实现“非入侵式”，可以参考更多以下链接。

## 参考链接

1. [函数的扩展](http://es6.ruanyifeng.com/#docs/function#%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96)
1. [JS 的递归与 TCO 尾调用优化](https://segmentfault.com/a/1190000004018047)
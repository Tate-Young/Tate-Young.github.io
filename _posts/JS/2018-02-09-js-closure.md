---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  闭包
date:   2018-02-09 16:35:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- JavaScript
---
# {{ page.title }}

## 什么是闭包

**闭包(closure)**: 指有权访问另一个函数作用域中的变量的函数。

```js
// 创建闭包的常见方式，就是在一个函数内部创建另一个函数。
var name = 'Tate';
function person(){
    var name = 'Snow';
    function sayName(){
        return name;
    }
    return sayName;
}

person()(); // 'Snow'
```

通过上一节[执行上下文]( {{site.url}}/2018/02/09/js-scope.html )来解释，person 函数执行完毕时，执行上下文会从调用栈上 pop 出来，然后压入 sayName 函数并执行。然而变量 name 是存在于 person 的上下文中的，sayName 函数创建的执行上下文是如何通过作用域链访问到的呢？

原因就在于，即使 person 执行上下文销毁，但是其活动对象VO仍然会留在内存中，实际上 sayName 维护的作用域链可抽象为

```js
sayNameContext = {
    Scope: [AO, personContext.AO, globalContext.VO]
}
```

> 此处讨论的闭包皆为 *实践角度*，按照 *技术角度* 来讲，所有函数都是闭包，详情可查看参考链接。

## 闭包的用处

### for 循环计数器

引用[变量提升]( {{site.url}}/2018/02/08/js-hoisting.html#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F )一节中 for 循环的计数器的问题。

```js
var a = [];
for (var i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i);
    };
}
var b = a[5];
b(); // 10
```

当执行到 b() 前，此时全局上下文的变量对象如下，因此当其执行时，通过作用域链寻找到此全局变量 i，即为 10。

```js
globalContext = {
    VO: {
        a: [...],
        i: 10
    }
}
```

通过闭包改写

```js
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = (function(i) {
    return function() {
      console.log(i);
    }
  })(i)
}
var b = a[5];
b(); // 5
```

当执行到 b() 前，全局对象与改写前一样，执行时，匿名函数又会创新新的执行上下文，作用域链可表示为

```js
a[0]Context = {
    Scope: [AO, 匿名函数Context.AO, globalContext.VO]
}
```

而匿名函数执行上下文的活动变量如下，因此通过作用域链寻找到变量 i 的值后，不会再去全局对象中寻找了。

```js
匿名函数Context = {
    AO: {
        arguments: {
            0: 5,
            length: 1
        },
        i: 5
    }
}
```

### 私有成员

 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法，私有方法不仅仅有利于限制对代码的访问，还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。

```js
var person = (function () {
    // 变量作用域为函数内部，外部无法访问
    var name = 'Tate';

    return {
        getName: function () {
            return name;
        },
        setName: function (anotherName) {
            name = anotherName;
        }
    }
})()

person.getName(); // 'Tate'
```

## 闭包的缺点

### 性能考量

闭包在处理速度和内存消耗方面对脚本性能具有负面影响，由于闭包会携带包含它的函数的作用域，因此会增大内存使用量，使用不当很容易造成内存泄露，降低程序的性能。

```js
function assignHandler() {
    var element = document.getElementById('someElement');
    element.onclick = function() {
        alert(element.id);
    };
}
```

1. 通过把 element.id 的一个副本保存在变量中，消除其在闭包中的循环引用。
2. 通过把 element 变量设置为 null，可以解除 DOM 对象的引用，顺利地减少其引用数，确保正常回收其占用的内存。

```js
function assignHandler() {
    var element = document.getElementById('someElement');
    var id = element.id;
    element.onclick = function() {
        alert(id);
    };

    element = null;
}
```

## 参考链接

1. [MDN-闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
1. [mqyqingfeng-JavaScript深入之闭包](https://github.com/mqyqingfeng/Blog/issues/9)
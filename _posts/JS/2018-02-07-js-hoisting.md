---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  变量提升
date:   2018-02-08 15:05:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- JavaScript
- ES6
---
# {{ page.title }}

## 什么是变量提升

**变量提升(Hoisting)** 其实是[执行上下文]( {{site.url}}/2018/02/09/js-scope.html )工作的一种表现形式。表现为在其当前作用域范围内，声明前可以使用该变量(未初始化)或者函数。

## 变量声明

```js
var name = 'Tate';
(function (){
    console.log(name); // undefined
    var name = 'Snow';
})();
```

按照变量提升相当于执行如下：

```js
var name;
name = 'Tate';
(function (){
    var name;
    console.log(name); // undefined
    name = 'Snow';
})();
```

因此可抽象理解为：

* var 变量声明会"提升"到当前作用域中函数的顶部;
* 只是声明被提前，初始化不提前，初始化仍在原始位置进行;
* 在初始化之前变量的值是 undefined。

## 函数声明

```js
sayName(); // 'Tate'
sayAnotherName(); // TypeError: sayAnotherName is not a function

// function () {} // 匿名函数

function sayName() { // 函数声明
    console.log('Tate');
}

var sayAnotherName = function() { // 函数表达式
    console.log('Snow');
};
```

按照变量提升相当于执行如下：

```js
var sayAnotherName; // undefined

function sayName() { // 函数声明 整个函数体提升
    console.log('Tate');
}

sayName(); // 'Tate'
sayAnotherName(); // TypeError

sayAnotherName = function() { // 函数表达式
    console.log('Snow');
};
```

## ES6 Hoisting

### let

let 不存在 Hoisting。

```js
name = 'Tate'; var name;
name; // 'Tate'

anotherName = 'Snow'; let anotherName;
anotherName; // ReferenceError: anotherName is not defined
```

### class

class 不存在 Hoisting。

```js
var a = new A(); // ReferenceError: A is not defined
class A = {};
```

## let 和 var 区别

**let** 主要的不同表现在

* 不存在变量提升;
* 不能重复申明；
* 增加了块级作用域;
* 存在暂时性死区(temporal dead zone)。

### 块级作用域

ES5 中只存在全局作用域和函数作用域，let 实际上新增了块级作用域。

```js
if(true) {
    var name = 'Tate';
    let anotherName = 'Snow';
}
name; // 'Tate'
anotherName; // ReferenceError
```

let 可以通过块级作用域有效解决 for 循环的计数器的问题。

```js
var a = [];
for (var i = 0; i < 10; i++) { // var 改为 let
    a[i] = function () {
        console.log(i);
    };
}
a[5](); // 10 用来计数的循环变量泄露为全局变量

// a[5]() // 若将 var 改为 let，结果为 5
```

ES5 可以通过闭包解决此问题([原理可跳转至闭包]( {{site.url}}/2018/02/09/js-closure.html )):

```js
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = (function(i) {
    return function() {
      console.log(i);
    }
  })(i)
}
a[5](); // 5
```

### 暂时性死区(TDZ)

如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

```js
if (true) {
  // TDZ开始
  name = 'Tate'; // ReferenceError
  console.log(name); // ReferenceError

  let name; // TDZ结束
  console.log(name); // undefined

  name = 123;
  console.log(name); // 123

//   let name; // SyntaxError 不能重复声明
}
```

### const

**const** 声明一个只读的常量，一旦声明，常量的值就不能改变。const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。对于基本类型，值就保存在变量指向的那个内存地址，因此等同于常量。但对于引用类型，变量指向的内存地址，保存的只是一个指针，const 只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了。

```js
const val = 1;
val = 5; // TypeError: Assignment to constant variable

const p1 = {name: 'Tate'};
p1.name = 'Snow'; // 'Snow'

// 可用 Object.freeze() 冻结
const p2 = Object.freeze({name: 'Tate'});
p2.name = 'Snow'; // 'Tate' 严格模式下报错 TypeError
```

## 参考链接

1. [MDN - 变量提升](https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)
1. [let 和 const 命令](http://es6.ruanyifeng.com/#docs/let) By 阮一峰
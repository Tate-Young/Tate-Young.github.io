---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  数据检测
date:   2018-02-04 01:18:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- JavaScript
---
# {{ page.title }}

## typeof

**typeof** 是一个一元运算，运算数可以是任意类型。它返回值是一个字符串，代表其数据类型，
包括以下 7 种：string、number、boolean、symbol、object、undefined、function 。

```js
typeof 'Tate'; // string
typeof 1; // number
typeof true; // boolean
typeof Symbol(); // symbol
typeof NaN; // number
typeof undefined; // undefined
typeof null; // object 出乎意外!!
typeof []; // object
typeof {}; // object
typeof new Date(); // object
typeof function(){}; // function
```

所以 typeof 一般只用作检测除 null 以外的基本类型或方法。**isNaN()** 一般用来判断是否为 NaN((Not-A-Number))，会将判断对象先包装成数字类型。

```js
// isNaN() 实际转化后判断是否为非数字
isNaN(NaN); // true
isNaN({}); // true
isNaN([1,2]); // true
isNaN(undefined); // true
isNaN('Tate'); // true
isNaN('12'); // false 可被转换为12
isNaN(''); // false 空字符串可被转换为0
isNaN(new Date()); // false 可被转换为毫秒数
isNaN(null); // false 可被转换为new Number(null)即0
```

ES6 提供 Number.isNaN() 来增强判断，参数类型只要不是数值，则一律返回 false。

```js
Number.isNaN(NaN); // true
Number.isNaN({}); // false
Number.isNaN(undefined); // false
Number.isNaN('12'); // false 可被转换为12
```

## instanceof

**instanceof** 通过原型判断前者是否是后者的实例。

```js
// a instanceof b <==> a.__proto__ === b.prototype
[] instanceof Array; // true
new Date() instanceof Date; // true

function Person(){};
new Person() instanceof Person;

var person = {name: 'Tate'};
person instanceof Object; // true

// 所有引用类型都可看做 Object 的实例，故
[] instanceof Object; // true
new Date() instanceof Object; // true
new Person() instanceof Object; // true
```

instanceof 操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境。

```js
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
anotherArray = window.frames[0].Array;
var arr = new anotherArray(1,2); // [1,2]
arr instanceof Array; // false
```

针对数组的这个问题，ES5 提供了 Array.isArray() 方法。

## constructor

对象的 **constructor** 属性总是返回它的的构造函数。constructor 属性定义在 prototype 对象上面，可以被所有实例对象继承。

```js
// Array.prototype.constructor 指向 Array 构造函数本身
[].constructor === Array.prototype.constructor // true

[].constructor === Array;
'Tate'.constructor === String;
true.constructor === Boolean;
new Date().constructor === Date;
new Function().constructor === Function;

Array.constructor === Function;
Object.constructor === Function;
String.constructor === Function;

function Person(){};
var p = new Person();
p.constructor === Person; // true
```

然而当重写 prototype 后，原有的 constructor 引用会丢失

```js
function Person(){};
// Person.prototype.sayHello = function(){ alert('hello'); } // 不会影响constructor指向
Person.prototype = { // 重写 prototype
    sayHello: function(){}
}

var p = new Person();
p.constructor === Person; // false
p.constructor === Object; // true
p.constructor === Person.prototype.constructor; // true
```

## toString()

**toString()** 是 Object 的原型方法，调用该方法，默认返回当前对象的内部属性 [[Class]] ，其格式为 [object X] ，其中 X 就是对象的类型。

对于 Object 对象，直接调用 toString()  就能返回 [object Object] 。而对于其他对象，则需要通过 call / apply 来调用才能返回正确的类型信息。

```js
Object.prototype.toString.call('Tate'); // [object String]
Object.prototype.toString.call(1); // [object Number]
Object.prototype.toString.call(true) ; // [object Boolean]
Object.prototype.toString.call(undefined); // [object Undefined]
Object.prototype.toString.call(null); // [object Null]
Object.prototype.toString.call([]); // [object Array]
Object.prototype.toString.call({}); // [object Object]
Object.prototype.toString.call(new Function()) ; // [object Function]
Object.prototype.toString.call(new Date()); // [object Date]
Object.prototype.toString.call(document); // [object HTMLDocument]
Object.prototype.toString.call(window); // [object Window]
```

## $.type()

**$.type()** 是 jQuery 封装的函数，用于确定JavaScript内置对象的类型，并返回小写形式的类型名称

```js
$.type("tate") === "string";
$.type(1) === "number";
$.type(true) === "boolean";
$.type(undefined) === "undefined";
$.type(null) === "null";
$.type(function(){}) === "function";
$.type([]) === "array";
$.type(new Date()) === "date";
$.type(/tate/) === "regexp";
$.type(document) === 'object';
$.type(window) === 'object';
```

## 参考链接

1. [Understanding JavaScript Constructors](https://css-tricks.com/understanding-javascript-constructors)
1. [判断 JS 数据类型的四种方法](http://www.cnblogs.com/onepixel/p/5126046.html)
1. [简书 - JavaScript 中对象的 constructor 的深入理解](https://www.jianshu.com/p/18f6c0868e71)

---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  浅拷贝和深拷贝
date:   2018-01-31 17:15:00 GMT+0800 (CST)
background-image: https://user-gold-cdn.xitu.io/2017/2/9/7c13147ecfecd8a6ce7f0b5a9782dd30?imageslim
tags:
- JavaScript
---
# {{ page.title }}

## 什么是浅拷贝和深拷贝

### 数据类型存储位置

| 数据类型 | 基本类型 | 引用类型 |
|:-------------|:------------|:-------------|
| 举个栗子 | Undefined、Null、Boolean、Number、String、Symbol |  Function、Array、Object、String、Number等 |
| 存储位置 | 保存在栈区 | 引用存放在栈区，实际对象保存在堆区 |
| 访问方式 | 存放在栈中的简单数据段，可按值访问 | 首先从栈中获得该对象的地址指针，然后再从堆中取得所需的数据 |

```TEXT
Primitive values are data that are stored on the stack.
Primitive value is stored directly in the location that the variable accesses.
Reference values are objects that are stored in the heap.
Reference value stored in the variable location is a pointer to a location in memory where the object is stored.
```

### 什么是栈内存和堆内存

在 JS 中，每一个数据都需要一个内存空间。内存空间又被分为两种，栈内存(stack)与堆内存(heap)。

**栈内存**主要存储基本类型和对象的引用，内存空间是在程序运行前静态分配的，其优势是存取速度比堆要快，但缺点是存在栈中的数据大小与生存期必须是确定的，缺乏灵活性。

**堆内存**用于存储引用类型，内存空间是在程序运行时动态分配的，因此存取速度较慢，动态分配的内存在被程序员明确释放或被垃圾回收之前一直有效，没有一个固定的生存期。

> 从数据结构层面来讲，栈和队列可以指串列形式的**[数据结构](https://segmentfault.com/a/1190000004305771)**。堆则指一种**[树形数据结构](https://zh.wikipedia.org/wiki/%E5%A0%86_(%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84))**。

### 栈内存和堆内存的区别

```js
// 内存地址指系统 RAM 中的特定位置，通常以十六进制的数字表示
var a1 = 0;   // 栈内存
var a2 = 'this is string'; // 栈内存
var a3 = null; // 栈内存

var b = { m: 20 }; // 变量b存在于栈内存中，{m: 20} 作为对象存在于堆内存中
var c = [1, 2, 3]; // 变量c存在于栈内存中，[1, 2, 3] 作为对象存在于堆内存中
```

![栈内存和堆内存]({{ page.background-image }})

### 深拷贝和浅拷贝的区别

由于基本类型都是直接操作保存在变量中的实际值，故针对引用类型

| 浅拷贝 | 拷贝的是对象的引用 |
| 深拷贝 | 拷贝的是对象实际的值，开辟新的内存地址 |

## 浅拷贝(shallow copy)

### 浅拷贝 DIY

```js
// 仅参考
function shallowCopy(source) {
    if (!source || typeof source !== 'object') {
        throw new Error('error arguments');
    }
    var targetObj = source.constructor === Array ? [] : {};
    for (var keys in source) {
        if (source.hasOwnProperty(keys)) {
            targetObj[keys] = source[keys];
        }
    }
    return targetObj;
}
```

### 第一种浅拷贝

拷贝对象的引用

```js
var p1 = ['Tate', {age: 18}];
var p2 = p1; // 赋值，指针实际指向同一个对象

console.log(p1 === p2); // true
p2[0] = 'Snow';
console.log(p1[0]); // "Snow"
p2[1].age = 26;
console.log(p1[1].age); // 26
```

### 第二种浅拷贝

构造新的对象，并对源对象进行拷贝，但是对其内部的引用类型值，拷贝的是其引用

```js
// Array的slice()和concat()方法和Object.assign()、$.extend({}, obj)方法类似
// $.extend(true, {}, obj)为深拷贝
var p1 = ['Tate', {age: 18}];
var p2 = p1.slice();

console.log(p1 === p2); // false
p2[0] = 'Snow';
console.log(p1[0]); // "Tate"
p2[1].age = 26;
console.log(p1[1].age); // 26
```

> 可参考下 [slice 源码](https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js)，可看出它类似"浅拷贝 DIY"，只对最外层属性做了赋值操作，并没有继续做递归进行深拷贝。

## 深拷贝(deep copy)

### 深拷贝 DIY

```js
// 递归实现一个深拷贝
function deepCopy(source){
   if(!source || typeof source !== 'object'){
     throw new Error('error arguments', 'shallowClone');
   }
   var targetObj = source.constructor === Array ? [] : {};
   for(var keys in source){
      if(source.hasOwnProperty(keys)){
         if(source[keys] && typeof source[keys] === 'object'){
           targetObj[keys] = source[keys].constructor === Array ? [] : {};
           targetObj[keys] = deepCopy(source[keys]);
         }else{
           targetObj[keys] = source[keys];
         }
      }
   }
   return targetObj;
}
```

### 深拷贝实现

可用 JSON 对象中的 parse() 和 stringify() 实现深拷贝，不足之处从以下例子可见，源对象的方法在拷贝的过程中丢失了，这是因为 JSON 语法不支持函数，详见[链接3](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)。

```js
// 利用JSON序列化实现一个深拷贝
function deepCopy(source){
  return JSON.parse(JSON.stringify(source));
}
var o1 = {
  arr: [1, 2],
  age: undefined,
  obj: {
    name: 'Tate'
  },
  func: function(){
    return 18;
  }
};
var o2 = deepCopy(o1);
console.log(o2); // {"arr":[1,2],"obj":{"name":"Tate"}}
```

> 也可用 $.extend(true, {}, obj) 实现深拷贝，[源码可见](https://github.com/jquery/jquery/blob/1472290917f17af05e98007136096784f9051fab/src/core.js#L121)

## 参考链接

1. [前端基础进阶：详细图解 JavaScript 内存空间](https://juejin.im/entry/589c29a9b123db16a3c18adf) By 这波能反杀
1. [JavaScript 中的浅拷贝和深拷贝](https://segmentfault.com/a/1190000008637489) By Darko
1. [MDN - JSON.stringify()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
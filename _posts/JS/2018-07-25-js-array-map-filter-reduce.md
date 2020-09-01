---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  数组 map filter reduce
date:   2018-07-27 11:15:00 GMT+0800 (CST)
update: 2020-09-01 14:07:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- JavaScript
---
# {{ page.title }}

## 转换

借用[这篇文章](https://atendesigngroup.com/blog/array-map-filter-and-reduce-js)的图例，很方便看出来三者的区别:

![array-map-filter-reduce.png]( {{site.url}}/style/images/smms/array-map-filter-reduce.png )

或者 emmm... 可以参考下图:

![array-map-filter-reduce-funny.png]( {{site.url}}/style/images/smms/array-map-filter-reduce-funny.png )

### map

```JS
// 完整语法
Array.prototype.map(callback(element[, index[, array]])[, thisArg])
```

参数:

* callback 为生成新数组元素的函数，使用三个参数:
  * **currentValue** - 数组中正在处理的当前元素
  * index - 可选。数组中正在处理的当前元素的索引
  * array - 可选。map 方法被调用的数组
* thisArg - 可选。执行 callback 函数时使用的 this 值

举个栗子 🌰:

```JS
const array1 = [1, 4, 9, 16];

const map1 = array1.map(x => x * 2); // [2, 8, 18, 32]
```

```JS
var elems = document.querySelectorAll('select option:checked');
var values = Array.prototype.map.call(elems, function(obj) {
  return obj.value;
});
```

### filter

```JS
// 完整语法
Array.prototype.filter(callback(element[, index[, array]])[, thisArg])
```

参数同 map，举个栗子 🌰:

```JS
function isBigEnough(element) {
  return element >= 10;
}
var filtered = [12, 5, 8, 130, 44].filter(isBigEnough); // [12, 130, 44]
```

```JS
// 数组去重
var r,
  arr = ['apple', 'strawberry', 'banana', 'pear', 'apple', 'orange', 'orange', 'strawberry'];
r = arr.filter(function (element, index, self) {
  return self.indexOf(element) === index;
});
```

我们经常还可以看到一种写法，简写的遍历移除所有转布尔值为 false 的元素 :

```JS
// 简写
arr.filter(Boolean)
// 等价于
arr.filter(a => Boolean(a))
```

### reduce

```JS
// 完整语法
// 从左到右遍历是 reduce，反之则可用 reduceRight 方法
Array.prototype.reduce(callback(accumulator, currentValue[, index], array]), initialValue)
```

参数:

* callback 为生成新数组元素的函数，使用四个参数:
  * **accumulator** - 累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或 initialValue
  * **currentValue** - 数组中正在处理的元素
  * index - 可选。数组中正在处理的当前元素的索引
  * array - 可选。reduce 方法被调用的数组
* initialValue - 可选。用作第一个调用 callback 的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素

举个栗子 🌰:

```JS
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer)); // 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5)); // 15
```

```JS
// 数组去重
let arr = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
let result = arr.sort().reduce((init, current) => {
  if (init.length === 0 || init[init.length-1] !== current) {
    init.push(current);
  }
  return init;
}, []);
console.log(result); // [1, 2, 3, 4, 5]
```

## 分割

### slice 数组/字符串

**slice** 方法对数组或字符串进行部分截取，并返回一个数组副本。且原始数组不会被修改，可进行简单的浅拷贝:

```JS
// 截取包含 begin，但不包含 end
array.slice([begin], end])
```

```JS
var a = [1, 2, 3, 4];
var b = a.slice();  // [1, 2, 3, 4]
var c = a.slice(2); // [3, 4]
console.log(a) // [1, 2, 3, 4]

// 若存在参数为负数，则 array.length 会和它们相加，试图让它们成为非负数
var b = a.slice(-1);  // [4] 等价于 a.slice(3)
var c = a.slice(1, -2);  // [2] 等价于 a.slice(1, 2)

// 若存在参数为负数，且绝对值大于 array.length 时，会截取整个数组
var b = a.slice(-5);  // [1, 2, 3, 4]

// 若存在参数大于 array.length 时，将返回一个空数组
var b = a.slice(5);　　// []
```

```JS
// 字符串
var str = 'hello tate'
str.slice(6) // 'tate'
```

### splice 数组

**splice** 方法通过删除现有元素和或添加新元素来更改一个数组的内容。注意原始数组会改变:

```JS
// deleteCount 表示要移除或添加的数组元素的个数，为 0 则表示添加
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])

// ①、从s tart 位置开始删除[start，end]的元素。
array.splice(start)
// ②、从 start 位置开始删除[start，Count]的元素。
array.splice(start, deleteCount)
// ③、从 start 位置开始添加 item1, item2, ...元素。
array.splice(start, 0, item1, item2, ...)
```

```JS
var a = [1, 2, 3, 4]
var b = a.splice(0, 2, 5, 6) // [1, 2]
console.log(a) // [5, 6, 3, 4] 原始数组改变

// 若存在参数为负数，则 array.length 会和它们相加，试图让它们成为非负数
a.splice(-1, 1, 7) // [4] 等价于 a.splice(3, 1, 7)
console.log(a) // [5, 6, 3, 7]

// 若存在参数为负数，且绝对值大于 array.length 时，会从 start=0 开始截取
a.splice(-5, 1, 8) // [5] 相当于 a.splice(0, 1, 8)
console.log(a) // [8, 6, 3, 7]

// 若存在参数大于 array.length 时，将返回一个空数组，原数组末尾添加传入参数
a.splice(5, 2, 1, 2) // []
console.log(a) // [8, 6, 3, 7, 1, 2]
```

### split 字符串

**splice** 方法用来分割字符串并返回分割后的数组，原始字符串不会改变:

```JS
// limit 限定返回的分割片段数量
str.split([separator[, limit]])
```

```JS
'hello tate'.split(' ') // ['hello', 'tate']
'hello tate'.split(' ', 1) // ['hello']

// 移出字符串中的空格
var names = "Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand ";
var re = /\s*;\s*/;
var nameList = names.split(re);
```

## 参考链接

1. [MDN - Array.prototype.reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
2. [Array Map, Filter and Reduce in JS](https://atendesigngroup.com/blog/array-map-filter-and-reduce-js) By John Ferris

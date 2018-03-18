---
layout: blog
front: true
comments: True
flag: ES6
background: blue
category: 前端
title:  对象扩展(上)
date:   2018-03-15 16:00:00 GMT+0800 (CST)
background-image: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2447683882,2644927629&fm=27&gp=0.jpg
tags:
- ES6
---
# {{ page.title }}

## 字符串扩展

ES6 中字符串主要扩展:

| 扩展 | 描述 |
|:--------------|:---------|
| Unicode 表示法 | <code>\u{20BB7}</code>codePointAt()、String.fromCodePoint() |
| 新增方法 | includes()、startsWith()、padStart()、repeat() 等 |
| 字符串模板 | \`这是值 ${value}\` |
| 标签模板 | fn\`这是参数 ${param}\` |

### Unicode 表示法

具体可以参考 [Unicode 一节]( {{site.url}}/2018/03/08/http-unicode.html )。

### includes()

ES6 之前只有 indexOf 方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法，这三个方法都支持第二个参数，表示开始搜索的位置:

* **includes()** - 返回布尔值，表示是否找到了参数字符串
* **startsWith()** - 返回布尔值，表示参数字符串是否在原字符串的头部
* **endsWith()** - 返回布尔值，表示参数字符串是否在原字符串的尾部

```JS
const name = 'Tate';

// ES5
name.indexOf('a') !== -1; // true

// ES6
name.includes('a'); // true
name.startsWith('T'); // true
name.endsWith('e'); // true

name.includes('a', 2); // false
```

### padStart()

字符串补全长度的功能，即如果某个字符串不够指定长度，会在头部或尾部补全，否则返回原字符串。一共接收两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串:

* **padStart()** - 头部补全
* **padEnd()** - 尾部补全

```JS
'a'.padStart(6, 'tate'); // 'tateta'
'a'.padEnd(3, '10'); // 'a10'

// 原字符串的长度不小于指定的最小长度，则返回原字符串
'ab'.padStart(1, 'tate'); // 'ab'
```

### repeat()

**repeat** 方法返回一个新字符串，表示将原字符串重复 n 次。

```JS
'a'.repeat(3); // 'aaa'

// 参数如果是小数，会被取整
'a'.repeat(2.9); // 'aa'

// 如果repeat的参数是负数或者Infinity，会报错
// 如果参数是 0 到- 1 之间的小数，则等同于 0，因为会先进行取整
'a'.repeat(-1); // RangeError
'a'.repeat(-0.9); // ''

// 如果repeat的参数是字符串，则会先转换成数字
'a'.repeat(NaN); // ''
'a'.repeat('3'); // 'aaa'
```

### 模板字符串 ``

**模板字符串(template string)** 是增强版的字符串，用反引号 **(`)** 标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

```JS
// ES5
$('#body').append('Welcome to <b>'
    + person.house
    + '</b> '
    + '.We are '
    + '<em>'
    + person.name
    + '</em> and glad to see you all here!'
);

// ES6
$('#body').append(
    `Welcome to <b>${person.house}</b>.We are <em>${person.name}</em> and glad to see you all here!`
);
```

### 标签模板

**标签模板(tagged template)** 中"标签"指的就是函数，紧跟在后面的模板字符串就是它的参数。

```JS
function tag(stringArr, value1, value2){
  // ...
}
```

* tag 函数的第一个参数是一个数组，该数组的成员是模板字符串中那些没有变量替换的部分
* tag 函数的其他参数，都是模板字符串各个变量被替换后的值，以此类推

```JS
const t = 'tate', s = 'snow';

tag`Hi ${t} and ${s}`;
// stringArr - ["Hi ", " and ", "", raw: Array(3)]
// value1 - tate
// value2 - snow

// 相当于调用
tag(['Hi ', ' and ', ''], 'tate', 'snow');

// 国际化的使用案例
i18n`${boy} is getting along well with ${girl} and they are managing to get married!`
```

## 数值扩展

ES6 中数值主要扩展:

| 扩展 | 描述 |
|:--------------|:---------|
| 新增方法 | Number.isFinite()、Number.isNaN()、Number.isInteger() |
| 指数运算符 | <code>**</code> |

### Number.isNaN()

ES6 中新增了数据类型的检测:

* **Number.isFinite()** - 检测一个数值是否为有限的(finite)，即不是 Infinity
* **Number.isNaN()** - 检测一个值是否为 NaN
* **Number.isInteger()** - 检测一个数值是否为整数

前两个在 ES5 中都有对应的 isFinite() 和 isNaN()，但他们在判断的时候都会先转换成数字类型，具体参照[类型检测一节]( {{site.url}}/2018/02/04/js-data-detection.html )。

```JS
isNaN([1, 2]); // true
Number.isNaN([1, 2]); // false
Number.isNaN(NaN); // true

isFinite('10'); // true
Number.isFinite('10'); // false
Number.isFinite(Infinity); // false
```

### Number.parseInt()

ES6 将全局方法 parseInt() 和 parseFloat()，移植到 Number 对象上面，行为完全保持不变。

```JS
parseInt('2.333'); // 2
parseInt('110', 2); // 6

Number.parseInt('2.333'); // 2
Number.parseInt === parseInt; // true
```

### 指数运算符 **

**指数运算符(\*\*)** 可以与等号结合，形成一个新的赋值运算符(**=)，指数运算符类似于 Math 对象的 pow 方法。

```JS
2 ** 2; // 4
Math.pow(2, 2); // 4

let a = 2;
a **= 2; // a = 4
```

## 数组扩展

ES6 中数组主要扩展:

| 扩展 | 描述 |
|:--------------|:---------|
| 扩展运算符 | <code>...numbers</code> |
| 新增方法 | Array.from()、Array.of()、find()、fill()、includes() 等 |
| 空位优化| 明确将空位转为 undefined |

### 扩展运算符 ...

**扩展运算符(spread)** 是三个点(...)，即 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列，可以代替 apply 方法。任何 Iterator 接口的对象，都可以用扩展运算符转为真正的数组，其调用的实际上是**遍历器接口(Symbol.iterator)**。

```JS
console.log(...[1, 2, 3]); // 1, 2, 3
[...'hello']; // [ "h", "e", "l", "l", "o" ]

// ES5
Math.max.apply(null, [1, 3, 2])

// ES6
Math.max(...[1, 3, 2])

// 等同于
Math.max(1, 3, 2); // 3
```

再举个栗子 🌰:

```JS
// ES5
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
Array.prototype.push.apply(arr1, arr2);

// ES6
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
arr1.push(...arr2);
```

```JS
// 合并数组
// ES5
[1, 2].concat(more)

// ES6
[1, 2, ...more]
```

扩展运算符进行复制数组时也是浅拷贝，类似于 concat()，可参考 [深浅拷贝这一节]( {{site.url}}/2018/01/31/js-deep-copy.html#%E7%AC%AC%E4%BA%8C%E7%A7%8D%E6%B5%85%E6%8B%B7%E8%B4%9D )。

### Array.from()

**Array.from** 方法用于将两类对象转为真正的数组:

* 类似数组的对象(array-like object)
* 可遍历(iterable)的对象，包括 ES6 新增的数据结构 Set 和 Map

类似数组的对象转换示例:

```JS
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// ES5
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

可遍历对象转换示例:

```JS
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']

let tempSet = new Set(['a', 'b']);
Array.from(tempSet); // ['a', 'b']
```

Array.from 还可以接受第二个参数，作用类似于数组的 map 方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

```JS
Array.from([1, , 2, 3], (n) => n ** 2 || 0); // [1, 0, 4, 9]

Array.from({ length: 2 }, () => 'tate'); // ['tate', 'tate']
```

### Array.of()

**Array.of** 方法用于将一组值，转换为数组。

```JS
Array.of(1, 2, 3); // [1, 2, 3]

// ES5 的实现
function ArrayOf(){
  return [].slice.call(arguments);
}
```

### find()

**find** 方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为 true 的成员，然后返回该成员，否则返回 undefined。**findIndex** 方法则返回第一个符合条件的数组成员的索引值。

```JS
// 可以接收三个参数，依次为当前的值、索引值和原数组
[1, 2, 3, 4].find(function(value, index, arr) {
  return value > 2;
}) // 3
```

### fill()

**fill** 方法使用给定值，填充一个数组。可以接收第二个和第三个参数，用于指定填充的起始位置和结束位置。

```JS
new Array(3).fill(1); // [1, 1, 1]

['a', 'b', 'c'].fill('d', 1, 2); // ['a', 'd', 'c']
```

### entries()

以下三个方法均用于遍历数组。它们都返回一个遍历器对象，可以用 for...of 循环进行遍历或者调用遍历器对象的 next 方法，进行遍历:

* **keys()** - 对键名的遍历
* **values()** - 对键值的遍历，需要浏览器支持
* **entries()** - 对键值对的遍历

```JS
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem); // 0, 'a'  1, 'b'
}

let entries = ['a', 'b'].entries();
entries.next().value; // [0, 'a']
entries.next().value; // [1, 'b']
entries.next().value; // undefined
```

### includes()

**includes** 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 includes 方法类似。

```JS
[1, 2, 3].includes(2); // true
[1, 2, 3].includes(2, 2); // false

// ES5
// indexOf 内部使用严格相等运算符（===）进行判断，因此 NaN 判断有误 NaN !== NaN
[NaN].indexOf(NaN); // -1

// ES6
[NaN].includes(NaN); // true
```

### 数组空位

空位不是 undefined，一个位置的值等于 undefined，依然是有值的。空位是没有任何值。

```JS
Array(3) // [, , ,]

0 in [undefined, undefined] // true
0 in [, ,] // false
```

ES5 对空位的处理，大多数情况下会忽略。

* forEach()、filter()、reduce()、every() 和 some() 都会跳过空位。
* map() 会跳过空位，但会保留这个值
* join() 和 toString() 会将空位视为 undefined，而 undefined 和 null 会被处理成空字符串。

```JS
// forEach 方法
[, 'a'].forEach((x, index) => console.log(index)); // 1

// map 方法
[, 'a'].map(x => 1); // [, 1]

// join 方法
[, 'a', undefined, null].join('-'); // "-a--"
```

ES6 则是明确将空位转为 undefined，for of 也可以遍历空位:

```JS
Array.from([, 'a']); // [undefined, 'a']
[...[, 'a']]; // [undefined, 'a']
```

## 参考链接

1. [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/string) By 阮一峰
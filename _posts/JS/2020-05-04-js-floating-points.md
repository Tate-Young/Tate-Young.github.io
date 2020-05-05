---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  浮点数处理
date:   2020-05-05 17:52:00 GMT+0800 (CST)
background-image: https://camo.githubusercontent.com/bf8105e7f04644cd3537caa0f06e479e0080ba32/68747470733a2f2f696d672e616c6963646e2e636f6d2f7466732f5442317747647a584d6e44384b4a6a793158645858615a735658612d313238302d3334362e706e67
tags:
- JavaScript
---
# {{ page.title }}

<style>
  /* 本文插入 img 暂时宽度都调成 100% */
  img {
    width: 100%;
  }
</style>

## 问题描述

在我们日常撸代码的时候，肯定多多少少碰到过以下浮点数计算的问题:

```JS
0.1 + 0.1 // 0.2 ✅
0.1 + 0.2 // 0.30000000000000004
0.3 - 0.2 // 0.09999999999999998
19.9 * 10 * 10 // 1990 ✅
19.9 * 100 // 1989.9999999999998
0.3 / 0.1 // 2.9999999999999996
```

刚碰到的时候一脸问号，难道这是 bug ❓接下来就针对这个问题解释下，看下结果是怎么计算出来的，为啥会有误差，本文主要[摘自这里](https://github.com/camsong/blog/issues/9)。 👈

## IEEE 754 标准

JS 遵循的是目前最广泛使用的浮点数运算 [**IEEE 754 标准**](https://zh.wikipedia.org/wiki/IEEE_754)，使用 64 位固定长度来表示，也就是 [**double 双精度浮点数**](https://en.wikipedia.org/wiki/Double-precision_floating-point_format):

* 符号位 S - 第 1 位是正负数符号位（sign），0 代表正数，1 代表负数
* 指数位 E - 中间的 11 位存储指数（exponent），用来表示次方数。决定了数字的大小
* 尾数位 M - 最后的 52 位是尾数（fraction），超出的部分自动进一舍零。决定了数字的精度。

![64-bits](https://upload.wikimedia.org/wikipedia/commons/a/a9/IEEE_754_Double_Floating_Point_Format.svg)

> **注意 fraction 由于整数部分肯定是 1，所以一般默认不写，实际上是有 53 位的**。比如 0.1 转换成二进制就是 `0.000110011001100...`，[**科学记数法**](https://zh.wikipedia.org/wiki/科学记数法)表示是 `1.10011...*10^-4`，舍去 1 后 `M = 10011...`:

![fraction](https://camo.githubusercontent.com/61cae30c09580aba68ffbfcf3b080e9688fd7609/687474703a2f2f617461322d696d672e636e2d68616e677a686f752e696d672d7075622e616c6979756e2d696e632e636f6d2f36313561643436316130653836343166316238393837316532656666383765662e706e67)

## 简单计算过程

标准已经有了，接下来在做浮点数计算的时候，大致要分为三个步骤:

1. 浮点数 --> 二进制
2. 用二进制科学记数法表示
3. 遵循 IEEE 754 标准进行展示

第一步和第三步由于要做数据转换，所以可能会出现精度丢失的情况。我们直接来分析个例子:

```JS
// 0.1 和 0.2 都转化成二进制后再进行运算
0.00011001100110011001100110011001100110011001100110011010 +
0.0011001100110011001100110011001100110011001100110011010 =
0.0100110011001100110011001100110011001100110011001100111

// 转成十进制则为 0.30000000000000004
```

> 在线的 demical --> binary [转换工具](http://www.binaryconvert.com/convert_double.html) 👈

## 最大安全整数 MAX_SAFE_INTEGER

由于 fraction 固定长度是 52 位，再加上上面提到省略的一位，最多可以表示的数是 `2^53=9007199254740992`，对应科学记数法尾数是 `9.007199254740992`，这也是 JS 最多能表示的精度。它的长度是 16，所以可以使用 `toPrecision(16)` 来做精度运算，超过的精度会自动做凑整处理。于是就有:

```JS
// 返回 0.1000000000000000，去掉末尾的零后正好为 0.1
0.10000000000000000555.toPrecision(16)

// 采用高精度则会有误差
0.1.toPrecision(21) = 0.100000000000000005551
```

JS 的**最大安全整数**即为 `2^53 - 1`，用常量 [**Number.MAX_SAFE_INTEGER**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) 表示，安全存储区间即为 `(-2^53, 2^53)`。这里安全存储的意思是指能够准确区分两个不相同的值:

```JS
Number.MAX_SAFE_INTEGER // 9007199254740991
Math.pow(2, 53) - 1     // 9007199254740991

// 安全存储的意思是指能够准确区分两个不相同的值，以下判断在数学上是错误的
Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2 // true
```

> 我们可以通过 `Number.isSafeInteger()` 方法用来判断传入的参数值是否是一个"安全整数"(safe integer)。

那有小盆友就问了，为啥 `2^53` 就不是安全整数了呢？

`2^53` 的确不是一个安全整数，它能够使用 `IEEE 754` 表示，但是 `2^53 + 1` 不能使用 `IEEE 754` 直接表示，在就近舍入和向零舍入中，会被舍入为 `2^53`。因此 `2^53` 不是安全整数。

## 最大整数 MAX_VALUE

JS 同时也定义了最大和最小整数，如果溢出的话会返回无穷大或无穷小，全局变量 `Infinity` 表示无穷大:

```JS
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324
Number.POSITIVE_INFINITE // Infinity
Number.NEGATIVE_INFINITE // -Infinity
```

```JS
Math.pow(2, 1023) // 8.98846567431158e+307

Math.pow(2, 1024) // Infinity
```

## toPrecision / toFixed

我们经常用到的将数字转成字符串，通常有以下两个方法:

* **toPresicion** - 以指定的精度返回该数值对象的字符串表示
* **toFixed** - 使用定点表示法来格式化一个数值

两者都能对多余数字做凑整处理，有时候也用 toFixed 来做四舍五入，但有些情况却是有问题的，一定要注意，比如:

```JS
1.005.toFixed(2) // 1.00, not 1.01
```

上述结果并不是我们想要的结果 1.001，原因就是 1.005 实际对应的数字是 1.00499999999999989，四舍五入后就成了 1.00。一般情况下我们要做数据展示的话还是推荐用以下封装的方法:

```JS
const strip: (p: number, k: number) => number = (num, precision = 12) => +parseFloat(num.toPrecision(precision))

strip(1.000000001) === 1 // true
```

如果要进行各种运算的话，这里推荐一个第三方库 [number-precision](https://github.com/nefe/number-precision):

```JS
import NP from 'number-precision'
NP.strip(0.09999999999999998) // = 0.1
NP.plus(0.1, 0.2)             // = 0.3, not 0.30000000000000004
NP.plus(2.3, 2.4)             // = 4.7, not 4.699999999999999
NP.minus(1.0, 0.9)            // = 0.1, not 0.09999999999999998
NP.times(3, 0.3)              // = 0.9, not 0.8999999999999999
NP.times(0.362, 100)          // = 36.2, not 36.199999999999996
NP.divide(1.21, 1.1)          // = 1.1, not 1.0999999999999999
NP.round(0.105, 2)            // = 0.11, not 0.1
```

## 参考链接

1. [JavaScript 浮点数陷阱及解法](https://github.com/camsong/blog/issues/9) By camsong

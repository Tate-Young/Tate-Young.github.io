---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  事件循环
date:   2018-02-05 16:58:00 GMT+0800 (CST)
background-image: https://sfault-image.b0.upaiyun.com/360/409/3604095867-59a67ae56079d_articlex
tags:
- JavaScript
---
# {{ page.title }}

## 进程和线程

**进程(process)** 是系统进行资源分配和调度的基本单位，任一时刻，单核CPU总是运行一个进程，其他进程处于非运行状态。

**线程(thread)** 是系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。

一个进程可以包括多个线程，一个进程的内存空间是共享的，每个线程都可以使用这些共享内存。而通过**[互斥锁(Mutex)](https://zh.wikipedia.org/wiki/%E4%BA%92%E6%96%A5%E9%94%81)**，可防止多个线程同时读写某一块内存区域。**[信号量(Semaphore)](https://zh.wikipedia.org/wiki/%E4%BF%A1%E8%99%9F%E6%A8%99)** 适用于控制一个仅支持有限个用户的共享资源，是一种不需要使用忙碌等待(busy waiting)的方法。

## 调用栈(Call Stack)

函数调用形成了一个栈帧(Call Frame)，多个栈帧堆叠形成一个**[调用栈(执行栈)](https://zh.wikipedia.org/wiki/%E5%91%BC%E5%8F%AB%E5%A0%86%E7%96%8A)**，实行先进后出。

```js
function foo(b) {
    var a = 1;
    return a + b + 2;
}

function bar(x) {
    var y = 3;
    return foo(x * y) + 1;
}

bar(520); // 1564
```

1. 当调用bar时，创建了第一个帧，帧中包含了bar的参数和局部变量。
1. 当bar调用foo时，第二个帧就被创建，并被压到第一个帧之上，帧中包含了foo的参数和局部变量。
1. 当foo返回时，最上层的帧就被弹出栈（剩下bar函数的调用帧 ）。
1. 当bar返回的时候，栈被清空。

## 事件循环(Event Loop)

JavaScript 属于单线程语言，执行的任务可分为同步和异步，ES6诞生以前，异步编程的方法，大概有下列四种：

* 回调函数
* 事件监听
* 发布/订阅
* Promise 对象

在主线程中，如果有定时器或者其他异步操作，他们会被添加到 **Event Table** 中，当事件(timeout, click, mouse move)满足触发条件后，它会将其发送至 **事件队列(Event Queue)**，实行先进先出。

事件循环是个进程，会持续监测调用栈是否为空，若为空，则监测事件队列，将里面的事件移至调用栈执行，如此循环。

### 定时器

调用 **setTimeout** 函数会在一个时间段后在队列中添加一个事件。这个时间段作为函数的第二个参数被传入。如果队列中没有其它事件，事件会被马上处理。但是，如果有其它事件，setTimeout事件必须等待其它事件处理完。因此第二个参数仅仅表示最少的时间 而非确切的时间。同样在零延迟调用 setTimeout 时，其并不是过了给定的时间间隔后就马上执行回调函数，其等待的时间基于队列里正在等待的事件数量。

```js
console.log('start');

setTimeout(function(){
    console.log('hello');
}, 200);

setTimeout(function(){
    console.log('world');
}, 300);

// 模拟阻塞
for (var i = 0; i <= 10000; i++){
    console.log(i);
}

setTimeout(function(){
    console.log('Tate');
}, 100);

console.log('end');
// start
// 1...10000
// hello
// world
// Tate
```

事件循环过程可以参考如下(Timer模块改为Event Table，Task queue改为Event Queue):

![事件循环示范图](https://sfault-image.b0.upaiyun.com/360/409/3604095867-59a67ae56079d_articlex)

## 参考链接

1. [MDN - 并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)
1. [JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
1. [干货 原来你是这样的 setTimeout](https://segmentfault.com/a/1190000010929918)
1. [Understanding JS: The Event Loop](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40)
---
layout: blog
front: true
comments: True
flag: Node
background: gray
category: 后端
title:  Node 事件循环
date:   2018-04-21 13:01:00 GMT+0800 (CST)
background-image: /style/images/smms/node.jpg
tags:
- Node
---
# {{ page.title }}

## Node 简述

官方简述: Node 是一个基于 Chrome V8 引擎的 JavaScript 运行环境；使用了一个**事件驱动**、**非阻塞式 I/O** 的模型，使其轻量又高效。Node 是单进程单线程应用程序，但是通过事件和回调支持并发，所以性能非常高。

## Event Loop

当 Node 启动时会初始化 **Event Loop**，会包含如下六个循环阶段，具体[参考官方文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/):

```TEXT
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

* **timers** - 执行 setTimeout() 和 setInterval() 中预设的回调
* **I/O callbacks** - 执行大部分的回调，除开 timers、close callbacks 和 setImmediate()
* **idle, prepare** - 仅内部使用
* **poll** - 获取新的 I/O 事件，在适当的条件下 Node 会阻塞在这个阶段
* **check** - 执行 setImmediate() 的回调
* **close callbacks** - 执行 close 事件的回调，例如 socket.on("close",func)

上述阶段中，每个阶段都有一个包含回调 的 FIFO 队列。每当进入一个阶段，都会从所属的队列中取出回调来执行，直到队列为空或者被执行回调的数量达到系统上限时，才会进入下一阶段。这六个阶段都执行完毕称为一轮循环。

### timers

此阶段指定线程执行定时器(setTimeout 和 setInterval)的回调函数，但是大多数的时候定时器的回调函数执行的时间要远大于定时器设定的时间。因为必须要等 poll phrase 中的 poll queue 队列为空时，poll 才会去查看 timers 中有没有到期的定时器并执行。

```JS
const fs = require('fs');

function someAsyncOperation(callback) {
  // Assume this takes 95ms to complete
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);


// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  const startCallback = Date.now();

  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```

执行的结果打印为:

```TEXT
105ms have passed since I was scheduled
```

分解事件循环步骤:

1. 当事件循环进入到 poll phase，此时队列为空，fs.readFile 未完成;
2. 95ms 后，文件读取完成并执行回调，此时会添加至 poll queue 并执行;
3. 当回调执行完后，该队列为空，此时 poll 会去 timers 查看有没有到期的定时器，有即执行。

### I/O callbacks

此阶段执行一些诸如 TCP 的 errors 回调函数，比如 TCP socket 接收到 "ECONNREFUSED" 错误尝试连接时，部分系统会暂缓报告错误，这个时候会被添加到 I/O callbacks 阶段。

一些应该在上轮循环 poll 阶段执行的 callback，因为某些原因不能执行(比如执行数超过最大限制)，也会被延迟到这一轮的循环的 I/O callbacks 阶段执行。

### poll

此阶段有两个重要的任务:

* 执行 poll 队列里面的回调
* 当 timers 的定时器到时后，执行定时器(setTimeout 和 setInternal)的回调函数

![poll](https://upload-images.jianshu.io/upload_images/704770-bf3f64513807886f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)

> 在 poll phrase，一旦 poll queue 为空，Event Loop 就会去检测 timers 有没有到期的定时期需要执行。如果有，就会按循环顺序进入 timers 阶段并执行相应的回调函数。

### check

如果 poll 中已没有排队的队列，并且存在 setImmediate() 立即执行的回调函数，这时 Event Loop 不会在 poll 阶段阻塞等待相应的 I/O 事件，而是直接去 check 阶段执行 setImmediate() 函数。

### close callbacks

循环关闭所有的 closing handles。当一个 socket or handle 突然关闭时会触发(如 socket.destroy())，'close' 事件会在此阶段触发，否则会通过 process.nextTick() 触发。

## setImmediate() / setTimeout()

* setImmediate() - Event Loop 的 poll phase 中，poll queue 执行后为空或是执行的回调数目达到上限后，直接进入 check 阶段执行setImmediate 函数。
* setTimeout/setInterval - poll queue 执行后为空或是执行的回调数目达到上限后，按照循环顺序返回到 timers phase 执行已到期的定时器的回调函数。

关于两者的执行顺序，可以参考:

```TEXT
This code will execute after any I/O operations in the current event loop and before any timers scheduled for the next event loop
```

举个栗子，试试两者的打印顺序，会发现顺序并不确定，原因是运行的当前上下文环境中存在其他的程序影响了执行顺序，不处于一个 I/O 循环(cycle)中:

```JS
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

写入到一个 I/O 循环中再试试，setImmediate 方法总是先执行:

```JS
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});

// immediate
// timeout
```

## process.nextTick()

尽管 process.nextTick() 也是一个异步的函数，但是它并没有出现在上面 Event Loop 的结构图中。无论当前正处于 Event Loop 的哪个阶段，在进入下个阶段前会执行 process.nextTick() 注册的回调。process.nextTick() 会生成一个 "**nextTickQueue**" 队列。

```JS
var fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate');
    process.nextTick(()=>{
      console.log('nextTick3');
    })
  });
  process.nextTick(()=>{
    console.log('nextTick1');
  })
  process.nextTick(()=>{
    console.log('nextTick2');
  })
});

// nextTick1
// nextTick2
// setImmediate
// nextTick3
// setTimeout
```

```JS
// process.nextTick() 还可以接受第二个参数，传入到回调中
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(callback, new TypeError('argument should be string'));
}
```

应用场景:

* Event Loop 在准备进入下一个阶段前处理异常、清理一些无用或无关的资源等
* At times it's necessary to allow a callback to run after the call stack has unwound but before the event loop continues

举个栗子:

```JS
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
  this.emit('event');
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

在构造函数 MyEmitter 中，不能立即发射(emit)事件，because the script will not have processed to the point where the user assigns a callback to that event，因此在构造函数内部，需要通过 `process.nextTick()` 设置一个回调来发射事件。因此构造函数改为:

```JS
function MyEmitter() {
  EventEmitter.call(this);

  // use nextTick to emit the event once a handler is assigned
  process.nextTick(() => {
    this.emit('event');
  });
}
```

> 感觉这一块儿理解的不是很深，基本都是按照官网贴上去的，未完待续...

## 参考链接

1. [The Node.js Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
2. [不要混淆 nodejs 和浏览器中的 event loop](https://cnodejs.org/topic/5a9108d78d6e16e56bb80882) By youth7
3. [Node.js Event Loop 的理解 Timers，process.nextTick()](https://cnodejs.org/topic/57d68794cb6f605d360105bf) By  vincentLiuxiang
4. [Nodejs 解读 event loop 的事件处理机制](https://www.jianshu.com/p/2a7ac1b3b382) By 编程 go
5. [[译]理解 Node.js 里的 process.nextTick()](https://www.oschina.net/translate/understanding-process-next-tick?cmp)
6. [Event loop in JavaScript](https://acemood.github.io/2016/02/01/event-loop-in-javascript/) By AceMood

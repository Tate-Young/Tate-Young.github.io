---
layout: blog
front: true
comments: True
flag: HTML
background: purple
category: 前端
title:  Web Worker
date:   2020-02-21 17:59:00 GMT+0800 (CST)
background-image: https://bitsofco.de/content/images/2018/11/web-worker.jpg
tags:
- HTML
- JavaScript
---
# {{ page.title }}

## 什么是 Web Worker

我们都知道 JavaScript 是单线程的，也就是说代码同步执行时，后续代码必须等到前面代码执行完了才能执行。但是如果前面代码耗时较长怎么办，不能干等着，有些场景我们可以用异步来处理，比如 ajax 请求服务器数据，但是这仍然没有改变代码单线程执行的本质，我们依旧不能把耗时的复杂运算放在页面上执行，不然会造成无响应，影响用户体验。因此为了实现多线程，就必须用到 [**Web Worker**](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)。

HTML5 提出了 Web Worker 标准，表示 JavaScript 允许有多个线程，但是子线程完全受主线程的控制，且子线程**不能操作 DOM。由于位于外部文件，也不能访问 Window、Document 等对象**。并且规范出 Web Worker 的三大主要特征:

1. 能够长时间运行和响应
2. 理想的启动性能
3. 理想的内存消耗

HTML5 中的多线程是这样一种机制，它允许在 Web 程序中并发执行多个 JavaScript 脚本，每个脚本执行流都称为一个线程，彼此间互相独立，并且有浏览器中的 JavaScript 引擎负责管理。它是运行在后台的 JavaScript，独立于其他脚本，一般不会影响页面的性能。因此我们常常可以把一些耗时和复杂计算的操作放到后台去执行，接下来便可以继续做任何你想做的事情：点击、选取内容等等。

HTML5 中的 Web Worker 可以分为两种不同线程类型，一个是**专用线程(Dedicated Worker)**，一个是**共享线程(Shared Worker)**。两种类型的线程各有不同的用途，下面分别来介绍下。

> 本篇的数据通信和实例摘自阮一峰的 [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html) 👈

![Web Worker](https://bitsofco.de/content/images/2018/11/web-worker.jpg)

## 专用线程

### 创建线程

创建子线程的方法很简单，直接通过构造函数 Worker 创建实例即可，它只执行 URL 指定的脚本。Worker 不指定 URL 时，而由使用 Blob 创建:

```JS
// 根据指定的 worker.js 来创建 Web Worker 实例，从而开辟子线程
const worker = new Worker("/javascripts/worker.js")
```

需要注意的是，**参数 URL 不能是本地的文件，只能是通过网络来下载的文件并且是同源**，如果下载失败。则不会创建子线程。比如上述的 `"/javascripts/worker.js"` 就是 Express 项目启动后所访问的资源文件路径。

```TEXT
# 引用本地文件报错
Uncaught DOMException: Failed to construct 'Worker': Script at 'file:///Users/xxx/worker.js' cannot be accessed from origin 'null'.
```

### 线程通信

在创建了子线程后，我们需要在主线程和子线程中互相通信。主线程和 Worker 线程提供以下常用的方法和事件句柄:

* 主线程
  * **Worker.postMessage** - 发送一条消息到最近的外层对象，消息可由任何 JavaScript 对象组成
  * **Worker.terminate** - 立即在主线程终止 worker。另外关闭页面也可以终止。在子线程中关闭则需要使用 **close** 方法
  * **Worker.onmessage** - 当 MessageEvent 类型的事件冒泡到 worker 时，事件监听函数 EventListener 被调用，消息保存在事件对象的 data 属性中
  * **Worker.onmessageerror** - 指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件
  * **Worker.onerror** - 当 ErrorEvent 类型的事件冒泡到 worker 时，事件监听函数 EventListener 被调用
* Worker 线程
  * **self.name** - 指定 Worker 的名称，用来区分多个 Worker 线程
  * **self.postMessage** - 向产生这个 Worker 线程的线程发送消息
  * **self.close** - 关闭 Worker 线程
  * **self.onmessage** - 指定 message 事件的监听函数
  * **self.onmessageerror** - 指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件

> 也可以选择使用 **addEventListener** 方法，它最终的实现方式和作用和 onmessage 相同

> Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动(比如用户点击按钮、提交表单)打断。这样有利于随时响应主线程的通信，但是也造成了一定的资源浪费，所以不再使用时应该调用 **terminate** 或 **close** 方法进行关闭，从而释放资源

我们来看下最简单的示例:

```JS
// main.js
// create worker
const worker = new Worker("/javascripts/worker.js")

// Send message to worker
worker.postMessage("这是主线程发送的信息")

// Receive message from worker
worker.onmessage = (e) => {
  console.log(e.data)
}

// worker,onerror = ...
```

```JS
// worker.js
name = 'Tate' // 指定 Worker 的名称，用来区分多个 Worker 线程

// Receive message from main file
onmessage = (e) => {
  console.log(e.data)
  // Send message to main file
  postMessage("这是 worker 发送的信息")
}

// self.close() // 关闭该子线程

// self 和 this 代表子线程自身，即子线程的全局对象
console.log('this or self', self, this)
console.log('location', location)
```

当我们运行项目时，便能看到对应的打印信息，我们可以看到，在后台我们仍然可以访问如下 API 和处理事件监听:

```TEXT
# this or self
name: "Tate"
onmessage: (e) => {…}
onmessageerror: null
self: DedicatedWorkerGlobalScope {name: "", onmessageerror: null, onmessage: ƒ, postMessage: ƒ, close: ƒ, …}
location: WorkerLocation {href: "http://localhost:3000/javascripts/worker.js", origin: "http://localhost:3000", protocol: "http:", host: "localhost:3000", hostname: "localhost", …}
onerror: null
onlanguagechange: null
navigator: WorkerNavigator {hardwareConcurrency: 12, appCodeName: "Mozilla", appName: "Netscape", appVersion: "5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKi…L, like Gecko) Chrome/79.0.3945.130 Safari/537.36", platform: "MacIntel", …}
onrejectionhandled: null
onunhandledrejection: null
isSecureContext: true
origin: "http://localhost:3000"
```

```TEXT
# location
href: "http://localhost:3000/javascripts/worker.js"
origin: "http://localhost:3000"
protocol: "http:"
host: "localhost:3000"
hostname: "localhost"
port: "3000"
pathname: "/javascripts/worker.js"
search: ""
hash: ""
```

### 数据通信

主线程与 Worker 之间的通信内容，可以是文本，也可以是对象。需要注意的是，**这种通信是拷贝关系，即是传值而不是传址**，Worker 对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原。主线程与 Worker 之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等类型，也可以在线程之间发送:

```JS
// 主线程
var uInt8Array = new Uint8Array(new ArrayBuffer(10))

for (var i = 0 i < uInt8Array.length ++i) {
  uInt8Array[i] = i * 2 // [0, 2, 4, 6, 8,...]
}

worker.postMessage(uInt8Array)

// Worker 线程
self.onmessage = function (e) {
  var uInt8Array = e.data
  postMessage('Inside worker.js: uInt8Array.toString() = ' + uInt8Array.toString())
  postMessage('Inside worker.js: uInt8Array.byteLength = ' + uInt8Array.byteLength)
}
```

但是，拷贝方式发送二进制数据，会造成性能问题。比如，主线程向 Worker 发送一个 500MB 文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面。这种转移数据的方法，叫做 [**Transferable Objects**](http://w3c.github.io/html/infrastructure.html#transferable-objects)。这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担。如果要直接转移数据的控制权，就要使用下面的写法:

```JS
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer])

// 例子
var ab = new ArrayBuffer(1)
worker.postMessage(ab, [ab])

// 高效的发送 ArrayBuffer 数据代码
worker.postMessage({
 operation: 'list_all_users',
 // ArrayBuffer object
 input: buffer,
 threshold: 0.8,
}, [buffer]);
```

### importScripts

Worker 内部还可以使用 **importScripts** 方法来加载其他的脚本文件:

```JS
/**
 * 需要注意的是 importScripts 是同步方法
 * 使用 importScripts 方法引入外部资源脚本，在这里我们使用了数学公式计算工具库 math_utilities.js
 * 当 JavaScript 引擎对这个资源文件加载完毕后，继续执行下面的代码。同时，下面的的代码可以访问和调用在资源文件中定义的变量和方法。
 **/
importScripts('math_utilities.js')

// 引入多个脚本文件
importScripts('script1.js', 'script2.js')
```

## 共享线程

共享线程是为了避免线程的重复创建和销毁过程，降低了系统性能的消耗，共享线程 SharedWorker 可以同时有多个页面的线程链接。使用 SharedWorker 创建共享线程，也需要提供一个脚本文件的 URL 地址或 Blob，该脚本文件中包含了我们在线程中需要执行的代码:

```JS
// 第二个参数 mysharedworker 代表了共享线程的名称
const worker = new SharedWorker('sharedworker.js', 'mysharedworker')
```

共享线程也使用了 message 事件监听线程消息，但使用 SharedWorker 对象的 `port` 属性与线程进行通信:

```JS
// 从端口接收数据, 包括文本数据以及结构化数据
worker.port.onmessage = function (event) { define your logic here... }
// 向端口发送普通文本数据
worker.port.postMessage('put your message here … ')
// 向端口发送结构化数据
worker.port.postMessage({ username: 'usertext'; live_city: ['data-one', 'data-two', 'data-three','data-four']})
```

## 实例：Worker 线程复杂计算

我们知道当有复杂耗时计算的时候，往往会影响后续代码的执行，而且会影响用户体验，因此在后台去计算不失为一个好的方法:

```JS
// main.js
const worker = new Worker("/javascripts/worker.js")

worker.postMessage({
  first: 3477340803423744400,
  second: 34237444003423744400,
})

worker.onmessage = function (event) {
  // 显示计算之后拿到的数值
  document.getElementById('computation_result').textContent = event.data
}
```

```JS
// worker.js
// calculate the greatest common divisor
const divisor = (a, b) => a % b == 0 ? b : divisor(b, a % b)

// calculate the least common multiple
const multiple = (a,  b) => a * b / divisor(a, b) || 0

/*
* calculate the least common multiple
* and the greatest common divisor
*/
const calculate = (first, second) => {
  // do the calculation work
  const common_divisor = divisor(first, second)
  const common_multiple = multiple(first, second)
  postMessage(`Work done!The least common multiple is ${common_divisor} and the greatest common divisor is ${common_multiple}`)
}

/**
 * This worker is used to calculate
 * the least common multiple
 * and the greatest common divisor
 */
onmessage = function (event) {
  const { data: { first, second } = {} } = event
  calculate(first, second)
}
```

## 实例：Worker 线程完成轮询

有时，浏览器需要轮询服务器状态，以便第一时间得知状态改变。这个工作可以放在 Worker 里面。Worker 每秒钟轮询一次数据，然后跟缓存做比较。如果不一致，就说明服务端有了新的变化，因此就要通知主线程:

```JS
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() +')()'])
  var url = window.URL.createObjectURL(blob)
  var worker = new Worker(url)
  return worker
}

var pollingWorker = createWorker(function (e) {
  var cache

  function compare(new, old) { ... }

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json()

      if (!compare(data, cache)) {
        cache = data
        self.postMessage(data)
      }
    })
  }, 1000)
})

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init')
```

## 实例：共享线程处理多用户并发连接

由于线程的构建以及销毁都要消耗很多的系统性能，例如 CPU 的处理器调度，内存的占用回收等，在一般的编程语言中都会有**线程池**的概念，线程池是一种对多线程并发处理的形式，在处理过程中系统将所有的任务添加到一个任务队列，然后在构建好线程池以后自动启动这些任务。处理完任务后再把线程收回到线程池中，用于下一次任务调用。线程池也是共享线程的一种应用。

在 HTML5 中也引入了共享线程技术，但是由于每个共享线程可以有多个连接，HTML5 对共享线程提供了和普通工作线程稍微有些区别的 API 接口。下面我们给出一个例子：创建一个共享线程用于接收从不同连接发送过来的指令，然后实现自己的指令处理逻辑，指令处理完成后将结果返回到各个不同的连接用户:

```HTML
<body>
  <output id='response_from_worker'>
  send instructions to shared worker:
  <input type="text" autofocus oninput="postMessageToSharedWorker(this);return false;">
</body>
<script>
 var worker = new SharedWorker('sharedworker.js')
 var log = document.getElementById('response_from_worker')
 worker.port.addEventListener('message', function(e) {
  // log the response data in web page
  log.textContent = e.data
  }, false)
 worker.port.start() // 启动端口，用于 addEventListener 来监听 message
 worker.port.postMessage('ping from user web page..')
  
 // following method will send user input to sharedworker
 function postMessageToSharedWorker(input) {
  //define a json object to construct the request
  var instructions = { instruction: input.value }
  worker.port.postMessage(instructions)
 }
</script>
```

接下来是用于处理用户指令的共享线程代码，创建一个共享线程用于接收从不同连接发送过来的指令，指令处理完成后将结果返回到各个不同的连接用户。:

```JS
/*
* define a connect count to trace connecting
* this variable will be shared within all connections
*/
var connect_number = 0

onconnect = function(e) {
  connect_number = connect_number + 1;
  // get the first port here
  var port = e.ports[0]
  // 每次刷新页面，共享线程重新实例化的时候会进行连接，此时连接数加 1
  port.postMessage('A new connection! The current connection number is ' + connect_number)
  port.onmessage = function(e) {
  // get instructions from requester
  var instruction = e.data.instruction
  var results = execute_instruction(instruction)
  port.postMessage('Request: ' + instruction + ' Response ' + results + ' from shared worker...')
 }
}

/*
* this function will be used to execute the instructions send from requester
* @param instruction
* @return
*/
function execute_instruction(instruction) {
  var result_value
  // implement your logic here
  // execute the instruction...
  return result_value
}
```

在上面的共享线程例子中，在主页面即各个用户连接页面构造出一个共享线程对象，然后定义了一个方法 `postMessageToSharedWorker` 向共享线程发送来之用户的指令。同时，在共享线程的实现代码片段中定义 `connect_number` 用来记录连接到这个共享线程的总数。之后，用 `onconnect` 事件处理器接受来自不同用户的连接，解析它们传递过来的指令。最后，定义一个了方法 `execute_instruction` 用于执行用户的指令，指令执行完成后将结果返回给各个用户。

这里我们并没有跟前面的例子一样使用到了工作线程的 `onmessage` 事件处理器，而是使用了另外一种方式 `addEventListener`。实际上，这两种的实现原理基本一致，只有有些稍微的差别，如果使用到了 `addEventListener` 来接受来自共享线程的消息，那么就要使用 `worker.port.start()` 方法来启动这个端口。之后就可以像工作线程的使用方式一样正常的接收和发送消息。

> 更多场景和示例可以参考 IBM 的这篇[多线程编程](https://www.ibm.com/developerworks/cn/web/1112_sunch_webworker/) 👈

## 参考链接

1. [IBM - 深入 HTML5 Web Worker 应用实践：多线程编程](https://www.ibm.com/developerworks/cn/web/1112_sunch_webworker/)
2. [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html) By 阮一峰
3. [bitsofcode - Web workers vs Service workers vs Worklets](https://bitsofco.de/web-workers-vs-service-workers-vs-worklets/)

---
layout: blog
front: true
comments: True
flag: ES6
background: blue
category: 前端
title:  Promise & Observable
date:   2018-03-21 15:07:00 GMT+0800 (CST)
update: 2019-12-17 14:18:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- ES6
---
# {{ page.title }}

## Promise

### 三种状态

**Promise** 是异步编程的一种解决方案，ES6 将其写进了语言标准，统一了用法。Promise 对象有三种状态:

* **pending** - 进行中
* **fulfilled** - 已成功 - Promise.resolve()
* **rejected** - 已失败 - Promise.reject()

只有异步操作的结果可以决定当前是哪一种状态，任何其他操作都无法改变这个状态，即一旦状态改变，就不会再变化。Promise 对象的缺点:

* 一旦执行便无法取消
* 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部
* 当处于 pending 状态时，无法得知目前进展到哪一个阶段

ES6 规定，Promise 对象是一个构造函数，用来生成 Promise 实例，Promise 常见的问题可[参见这里](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html) 👈。

```JS
const promise = new Promise((resolve, reject) => {
  if (/* 异步操作成功 */){
    resolve(value)
  } else {
    reject(error)
  }
})
```

```JS
promise
  .then(function(value) {
    // 这里如何操作
  })
  .catch(function(err) {
    // err
  })
```

如上，这里如何操作，通常有三种选择:

* return another promise
* return a synchronous value (or undefined)
* throw a synchronous error

举个用 Promise 对象实现的 Ajax 操作的栗子 🌰:

```JS
const getJSON = (url) => {
  const promise = new Promise((resolve, reject) => {
    const handler = _ => {
      if (this.readyState !== 4) {
        return
      }
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    const client = new XMLHttpRequest()
    client.open("GET", url)
    client.onreadystatechange = handler
    client.responseType = "json"
    client.setRequestHeader("Accept", "application/json")
    client.send()

  })

  return promise
}

getJSON("/posts.json").then((json) => {
  console.log('Contents: ' + json)
}, (err) => {
  console.error('出错了', err)
})
```

### then / catch / finally

**then** 方法返回的是一个新的 Promise 实例(若不是 Promise 实例，则会调用 Promise.resolve 方法，将返回值转为 Promise 实例)，因此可以采用链式写法。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

```JS
promise.then((data) => {
  return data.info
}).then((info) => {
  // ...
})
```

**catch** 是用于指定发生错误时的回调函数，可以捕获 then 方法里回调函数运行中抛出的错误和 rejected 状态。跟传统的 try/catch 代码块不同的是，如果没有使用 catch 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码。

```JS
getJSON('/post/test.json').then((post) => {
  return getJSON(post.commentURL)
}).then((comments) => {
  // some code
}).catch((error) => {
  // 捕获前面三个 Promise 产生的错误或 rejected 状态
})
```

注意 then(resolveHandler, rejectHandler) 方法的第二个参数 rejectHandler 无法捕获 resolveHandler 自身抛出的错误:

```JS
Promise.resolve().then(function () {
  console.log('previous then')
}).then(function () {
  throw new Error('current then')
}, function (err) {
  console.log(err) // 无法捕获错误
})

Promise.resolve().then(function () {
  throw new Error('previous then')
}).then(function () {
  throw new Error('current then')
}, function (err) {
  console.log(err) // 捕获错误: 'previous then'
})
```

因此建议使用 catch 进行捕获。若在 then 之前调用 catch 方法，则 catch 只会捕获之前产生的错误。

```JS
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  })

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  })
```

**finally** 是 ES2018 引入标准的新方法，不管 promise 最后的状态如何，在执行完 then 或 catch 指定的回调函数以后，都会执行 finally 方法指定的回调函数。
实现方式如下:

```JS
Promise.prototype.finally = function(callback) {
  let P = this.constructor
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
```

### Promise.all

**Promise.all** 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```JS
const p = Promise.all([p1, p2, p3]).then(...)
```

* 只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数
* 只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数

如果作为参数的 Promise 实例定义了 catch 方法，那么它一旦处于 rejected 状态，将不会触发 `Promise.all()` 的 catch 方法:

```JS
const p1 = new Promise((resolve, reject) => {
  resolve('tate')
})

const p2 = new Promise((resolve, reject) => {
  throw new Error('something goes wrong')
})
.then(result => result)
.catch(e => e) // 返回值状态变为 resovled，将会执行下面的 then 回调，除非显示 Promise.reject(e) 才会被 下面的 catch 捕获

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e)) // ["tate", Error: something goes wrong at Promise]
```

其原理很简单，我们可以[参考这里](https://github.com/Youthink/promise-all/blob/master/index.js)的简单实现:

```JS
function promiseAll(promises) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('arguments must be an array'))
    }
    var resolvedCounter = 0
    var promiseNum = promises.length
    var resolvedValues = new Array(promiseNum)
    for (var i = 0 i < promiseNum i++) {
      (function(i) {
        Promise.resolve(promises[i]).then(function(value) {
          resolvedCounter++
          resolvedValues[i] = value
          if (resolvedCounter == promiseNum) {
            return resolve(resolvedValues)
          }
        }, function(reason) {
          return reject(reason)
        })
      })(i)
    }
  })
}
```

### Promise.race

**Promise.race** 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```JS
const p = Promise.race([p1, p2, p3]).then(...)
```

* 只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。率先改变的 Promise 实例的返回值，就传递给 p 的回调函数

其实现同样也很简单，我们可以参考 [es6-promise](https://github.com/stefanpenner/es6-promise/blob/master/lib/es6-promise/promise/race.js) 的实现:

```JS
export default function race(entries) {
  /*jshint validthis:true */
  let Constructor = this

  if (!isArray(entries)) {
    return new Constructor((_, reject) => reject(new TypeError('You must pass an array to race.')))
  } else {
    return new Constructor((resolve, reject) => {
      let length = entries.length
      for (let i = 0 i < length i++) {
        Constructor.resolve(entries[i]).then(resolve, reject)
      }
    })
  }
}
```

我们可以看到，race 并不是真正意义上的让 entries 都在同一起跑线，由于使用了遍历，在某些情况下，只要靠前的产生了结果，就会提前返回结果，我们不妨来看个例子:

```JS
const promise1 = new Promise((resolve, reject) => setTimeout(resolve, 1000, 'tate'))

const promise2 = new Promise((resolve, reject) => setTimeout(resolve, 500, 'snow'))

// 很显然 promise2 跑得快
Promise.race([promise1, promise2]).then((value) => console.log(value)) // snow

// 由于这里加了定时器，且让他们都能够在 1s 之内全部执行完
// 我们可以看到，对于全部执行完达标的 promise，谁先遍历谁先输出
setTimeout(() => {
  Promise.race([promise1, promise2]).then((value) => console.log(value)) // tate
  Promise.race([promise2, promise1]).then((value) => console.log(value)) // snow
}, 1000)
```

## Observable

### 核心概念

**RxJS** 是 ReactiveX 编程理念的 JavaScript 版本。ReactiveX 来自微软，它是一种针对异步数据流的**响应式编程**。简单来说，它将一切数据，包括 HTTP 请求、DOM 事件或者普通数据等包装成流的形式，然后用强大丰富的操作符对流进行处理，使你能以同步编程的方式处理异步数据，并组合不同的操作符来轻松优雅的实现你所需要的功能。RxJS 中解决异步事件管理的基本概念如下:

* **Observable** 可观察对象 - 单播，表示一个可调用的未来值或者事件的集合
* **Observer** 观察者 - 一个回调函数集合,它知道怎样去监听被 Observable 发送的值
* **Subscription** 订阅 -  表示一个可观察对象的执行，主要用于取消执行
* **Operators** 操作符 -  纯粹的函数，使得以函数式编程的方式处理集合，比如 map、filter、contact、flatmap
* **Subject** 主题 - 多播，是允许值被多播到多个观察者的一种特殊的 Observable，同时也可作为 Observer
* **Schedulers** 调度者 -  用来控制并发，当计算发生的时候允许我们协调，比如 setTimeout、requestAnimationFrame

在代码中使用时避免添加整个 RxJS 库:

```JS
// bad
import Rx from 'rxjs/Rx'
Rx.Observable.of(1,2,3)

// good
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
Observable.of(1,2,3).map(x => x + '!!!') // etc
```

Observable 可以和 Promise 之间互相转换:

```JS
const ob = Observable.fromPromise(somePromise) // Promise --> Observable
const promise = someObservable.toPromise() // Observable --> Promise
```

举个栗子 🌰，例如注册事件监听:

```JS
// 以往
var button = document.querySelector('button')
button.addEventListener('click', () => console.log('Clicked!'))
```

```JS
// Observable
var button = document.querySelector('button')
Observable.fromEvent(button, 'click').subscribe(() => console.log('Clicked!'))
```

栗子拓展开，比如每秒最多只能点击一次的实现:

```JS
// 纯 JS
var count = 0
var rate = 1000
var lastClick = Date.now() - rate
var button = document.querySelector('button')
button.addEventListener('click', () => {
  if (Date.now() - lastClick >= rate) {
    console.log(`Clicked ${++count} times`)
    lastClick = Date.now()
  }
})
```

```JS
// Observable
var button = document.querySelector('button')
Observable.fromEvent(button, 'click')
.throttleTime(1000)
.scan(count => count + 1, 0) // 类似 reduce，回调函数的返回值将成为下一次回调函数运行时要传递的下一个参数值
.subscribe(count => console.log(`Clicked ${count} times`))
```

### Observable 可观察对象

**Observable** 可观察对象，简单来说数据就在 Observable 中流动，你可以使用各种 **operator** 操作符对流进行处理。作为 Observable 序列必须被"订阅"才能够触发上述过程，也就是 **subscribe**(发布/订阅模式)。订阅是完全同步的，就像调用一个函数。

```JS
const ob = Observable.interval(1000) // 每隔 1000ms 发射一个递增的数据，即 0 -> 1 -> 2 ...
ob.take(3).map(n => n * 2).filter(n => n > 0).subscribe(n => console.log(n)) // take(3) 为取前三个数据
// 2 第二秒
// 4 第三秒
```

下面是可观察对象执行可以发送的三种类型的值:

* **next** - 发送一个数字 / 字符串 / 对象等值。
* **error** - 发送一个错误或者异常。
* **complete** - 不发送值。

```JS
// create 方法用于创建一个新的 Observable 对象，接收 Observer 观察者参数
var foo = Observable.create((observer) => {
console.log('tate')
observer.next(0)
observer.next(1)
observer.next(2)
// observer.complete()
})

console.log('before')
foo.subscribe((x) => { // 同步 返回一个 subscription 对象
console.log(x)
})
console.log('after')
// 'before' 'tate' 0 1 2 'after'
```

### Observer 观察者

**Observer** 观察者是可观察对象所发送数据的消费者，观察者简单而言是一组回调函数，分别对应一种被可观察对象发送的通知的类型，即 next, error 和 complete。要想使用观察者，需要订阅可观察对象，即 `observable.subscribe(observer)`。

```JS
observable.subscribe({
  next: x => console.log(x),
  error: err => console.error(err),
  complete: () => console.log('end of the stream')
})

// 当订阅一个可观察对象，你可能仅仅提供回调来作为参数就够了，并不需要完整的观察者对象，作为示例:
observable.subscribe(x => console.log('Observer got a next value: ' + x))

// 或者通过将三个函数作为参数提供三种回调
observable.subscribe(
  x => console.log('Observer got a next value: ' + x),
  err => console.error('Observer got an error: ' + err),
  () => console.log('Observer got a complete notification')
)
```

### Subscription 订阅

**Subscription** 订阅通常是一个可观察对象的执行，订阅对象有一个 **unsubscribe** 方法用来释放资源或者取消可观察对象的执行。

```JS
var observable = Observable.from([10, 20, 30]) // from 可将几乎所有的东西转化一个可观察对象
var subscription = observable.subscribe(x => console.log(x))
// Later:
subscription.unsubscribe()
```

### Subject 主题

#### Subject

**Subject** 主题是允许值被多播到多个观察者的一种特殊的 Observable，然而纯粹的可观察对象是单播的(每一个订阅的观察者拥有单独的可观察对象的执行)。

* **每一个 Subject 都是一个 Observable 可观察对象** - 给定一个 Subject 后，你可以订阅它，提供的观察者将会正常的开始接收值。从观察者的角度来看，它不能判断一个可观察对象的执行时来自于单播的 Observable 还是来自于一个 Subject
* **每一个 Subject 都是一个 Observer 观察者对象** - 它是一个拥有 next/error/complete 方法的对象。要想 Subject 提供一个新的值，只需调用 next()，它将会被多播至用来监听Subject 的观察者

```JS
// import { BehaviorSubject, Observable, Subscription } from 'rxjs'
// Subject 有两个观察者
var subject = new Subject()

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
})
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
})

subject.next(1) // observerA: 1 observerB: 1
subject.next(2) // observerA: 2 observerB: 2
```

由于 Subject 也是一个观察者，这就意味着你可以提供一个 Subject 当做 observable.subscribe() 的参数，如下:

```JS
var observable = Observable.from([1, 2, 3])

observable.subscribe(subject) // You can subscribe providing a Subject
// observerA: 1 observerB: 1
// observerA: 2 observerB: 2
// observerA: 3 observerB: 3
```

#### BehaviorSubject

**BehaviorSubject** 也属于 Subject，它储存着要发射给消费者的最新的值。无论何时一个新的观察者订阅它，都会立即接受到这个来自 BehaviorSubject 的当前值。对于表示"随时间的值"是很有用的。举个例子，人的生日的事件流是一个 Subject,然而人的年龄的流是一个 BehaviorSubject。

在下面的例子中，BehaviorSubject 被初始化为 0，第一个观察者将会在订阅的时候接收到这个值。第二个观察者接收数值 2，即使它是在数值 2 被发送之后订阅的:

```JS
var subject = new BehaviorSubject(0) // 0 is the initial value

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
})

subject.next(1)
subject.next(2)

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
})

subject.next(3)
// observerA: 0
// observerA: 1
// observerA: 2 observerB: 2
// observerA: 3 observerB: 3
```

#### ReplaySubject

**ReplaySubect** 类似于 BehaviorSubject，一个 ReplaySubject 从一个可观察对象的执行中记录多个值，并且可以重新发送给新的订阅者。

```JS
var subject = new ReplaySubject(3) // buffer 3 values for new subscribers ，注:缓存了三个值。
// 除了指定缓存值个数之外，还可以指定一个以毫秒为单位的时间，表示这个有效时间段内的有效个数
// var subject = new ReplaySubject(3, 500 /* windowTime */)

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
})

subject.next(1)
subject.next(2)
subject.next(3)
subject.next(4)

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
})

subject.next(5)
// observerA: 1 observerA: 2 observerA: 3 observerA: 4
// observerB: 2 observerB: 3 observerB: 4
// observerA: 5 observerB: 5
```

#### AsyncSubject

**AsyncSubject** 仅在执行结束(complete)时发送给观察者可观察对象执行的最新值。

```JS
var subject = new AsyncSubject()

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
})

subject.next(1)
subject.next(2)

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
})

subject.next(3)
subject.complete() // observerA: 3 observerB: 3
```

### Operators 操作符

#### 操作符一览表

**Operators** 操作符是可观察对象上定义的方法。每一个操作符都是基于当前可观察对象创建一个新的可观察对象的函数。这是一个单纯无害的操作，之前的可观察对象仍然保持不变。

常用操作符一览:

* **创建操作符**

| 创建操作符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **create** | 创建一个新的 Observable | `Observable.create((observer) => ...)` |
| **empty** | 仅仅发出 complete 通知，其他什么也不做 | `Observable.empty()` |
| **from** | 转化为一个 Observable | `Observable.from([1, 2, 3])` |
| **fromEvent** | 创建一个来自于 DOM 事件，或者 Node 的 EventEmitter 事件或者其他事件的 Observable | `Observable.fromEvent(document, 'click')` |
| **fromPromise** | 将 Promise 转化为一个 Observable | `Observable.fromPromise(fetch('http://myserver.com/'))` |
| **of** | 创建一个 Observable，连续发射指定参数的值，最后发出 complete | `Observable.of(1, 2, 3)` |
| **interval** | 返回一个在固定时间间隔发出无限自增的序列整数,如每 1 秒发出自增的数字  | `Observable.interval(1000)` |
| **timer** | 同 interval，但增加延迟执行，如每隔 1 秒发出自增的数字，5 秒后开始发送 | `Observable.timer(5000, 1000)` |
| **range** | 发出区间范围内的数字序列 | `Observable.range(1, 10)` |
| **error** | 仅仅发出 error 通知，其他什么也不做 | `Observable.throw(new Error('oops!'))` |

* **转换操作符**

| 转换操作符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **map** | 同 Array.prototype.map() | `ob.map(ev => ev.clientX)` |
| **mapTo** | 可以把传进来的值改成一个固定的值 | `ob.mapTo(1)` |
| **scan** | 类似 reduce + last，回调函数的返回值将成为下一次回调函数运行时要传递的下一个参数值 | `ob.scan((count) => count + 1, 0)` |
| **mergeMap** | 将每个源值投射成 Observable，再将该 Observable 会合并到输出 Observable 中 | `ob.mergeMap(x => Observable.interval(1000).map(i => x+i)))` |
| **switchMap** | 将每个值映射成 Observable，然后使用 switch 打平所有的内部 Observable | `ob.switchMap((ev) => Observable.interval(1000))` |

```JS
const source = Rx.Observable.of('Hello')
//map to inner observable and flatten
const example = source.mergeMap(val => Observable.of(`${val} World!`))
const subscribe = example.subscribe(val => console.log(val)) // 'Hello World!'
```

* **过滤操作符**

| 过滤操作符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **debounceTime** | 延时执行，但是只通过每次大量发送中的最新值 | `ob.debounceTime(500)` |
| **distinct** | 得到的不同的值 | `Observable.of(1, 2, 2, 3).max()` |
| **distinctUntilChanged** | 得到的与前一项不同的值 | `Observable.of(1, 2, 2, 3).distinctUntilChanged()` |
| **distinctUntilKeyChanged** | 基于指定的 key 得到与前一项不同的值 | `ob.distinctUntilKeyChanged()` |
| **filter** | 同 Array.prototype.filter() | `ob.filter(x => x % 2 === 1)` |
| **first** | 只发出第一次满足条件的值，反之则为 last | `ob.first(x => x % 2 === 1)` |
| **skip** | 跳过发出的前 n 个值，跳过后 n 个值则为 skipLast | `ob.skip(2)` |
| **throttleTime** | 让一个值通过，然后在接下来的 duration 毫秒内忽略源值 | `ob.throttleTime(1000)` |

```JS
Observable.of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4)
  .distinctUntilChanged()
  .subscribe(x => console.log(x)) // 1, 2, 1, 2, 3, 4

Observable.of<Person>(
  { age: 1, name: 'tate'},
  { age: 2, name: 'snow'},
  { age: 3, name: 'tate'},
  { age: 4, name: 'tate'})
  .distinctUntilKeyChanged('name')
  .subscribe(x => console.log(x.age)) // 1, 2, 3
```

* **组合操作符**

| 组合操作符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **concat** | 拼接，按照顺序将发出的多个值拼接起来，可以有静态方法和实例方法 | `ob.concat(ob1)` |
| **merge** | 合并，把多个值合并到一个值中，可以有静态方法和实例方法| `ob.merge(ob1)` |
| **forkJoin** | 同 Promise.all，等到所有的 Observable 都完成后，才一次性返回值 | `ob.forkJoin(ob1, ob2)` |
| **race** | 类似 Promise.race，返回组合中第一个发出项的 Observable 的镜像 | `ob.race(ob1, ob2)` |
| **startWith** | 先发出指定项，然后发出由源 Observable 发出的项 | `ob.startWith(1)` |

注意 concat 和 merge 的区别，concat 是按顺序拼接值:

```JS
var source = Observable.interval(500).take(3)
var source2 = Observable.interval(300).take(6)
var example = source.merge(source2)
example.subscribe({
    x =>  console.log(x)
})
// 0 0 1 2 1 3 2 4 5
```

按照 **Marble Diagram** 图解的话:

```TEXT
source : ----0----1----2|
source2: --0--1--2--3--4--5|
            merge()
example: --0-01--21-3--(24)--5|
            concat()
example: ----0----1----2--0--1--2--3--4--5|
```

* **其他操作符**

| 其他操作符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **delay** | 延迟执行，每个数据项的发出时间都往后推移固定的毫秒数 | `ob.delay(1000)` |
| **toPromise** | 转换为 Promise | `ob.toPromise()` |
| **max** | 获取一连串数字中的最大值，反之为 min | `Observable.of(1, 2, 3).max()` |
| **every** | 返回布尔值，所有项是否都满足指定条件 | `Observable.of(1, 2, 3).every(x => x > 0)` |
| **find** | 找到第一个通过测试的值并将其发出，findIndex 则返回索引值 | `Observable.of(1, 2, 3).find(x => x > 0)` |
| **count** | 计算源的发送数量，并当源完成时发出该数值 | `ob.count(x => x > 0)` |
| **reduce** | 当源 Observable 完成时，返回 累加的结果，只会返回一个值 | `ob.reduce((acc, one) => acc + one, seed)` |

```JS
// 使用比较函数 max 来获取最大值的项
interface Person {
  age: number,
  name: string
}
Observable.of<Person>(
  {age: 26, name: 'tate'},
  {age: 18, name: 'snow'})
  .max<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1)
  .subscribe((x: Person) => console.log(x.name)) // 'tate'
```

#### mergeMap / forkJoin

举个栗子 🌰，如果发送的一个请求时，需要依赖于上一个请求的数据，嵌套的写法很冗长:

```JS
// Angular
apiUrl = 'https://jsonplaceholder.typicode.com/users'
username: string = ''
user: any

ngOnInit() {
  this.http.get(this.apiUrl)
    .map(res => res.json())
    .subscribe(users => {
      let username = users[0].username
      this.http.get(`${this.apiUrl}?username=${username}`)
        .map(res => res.json())
        .subscribe(
          user => {
            this.username = username
            this.user = user
          })
    })
  }
```

使用 mergeMap 可以优化改写为:

```JS
ngOnInit() {
  this.http.get(this.apiUrl)
    .map(res => res.json())
    .mergeMap(users => {
      this.username = users[0].username
      return this.http.get(`${this.apiUrl}?username=${this.username}`)
        .map(res => res.json())
    })
    .subscribe(user => this.user = user)
}
```

若对于并发的 http 请求，则可以采用类似 Promise.all 的写法，即使用 forkJoin():

```JS
ngOnInit() {
  let post1 = this.http.get(`${this.apiUrl}/1`)
  let post2 = this.http.get(`${this.apiUrl}/2`)

  Observable.forkJoin(post1, post2)
    .subscribe(results => {
      this.post1 = results[0]
      this.post2 = results[1]
    })
  }
```

#### switchMap

switchMap 操作符用于对源 Observable 对象发出的值，做映射处理。若有新的 Observable 对象出现，会在新的 Observable 对象发出新值后，退订前一个未处理完的 Observable 对象。举个搜索的栗子 🌰，摘自 Angular 官网:

```JS
export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>
  private searchTerms = new Subject<string>() // 创建一个主题
  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router) {}
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term)
  }
  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.heroSearchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<Hero[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error)
        return Observable.of<Hero[]>([])
      })
  }
  gotoDetail(hero: Hero): void {
    this.router.navigate(['/detail', hero.id])
  }
}
```

## 参考链接

1. [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/promise) By 阮一峰
1. [RxJS - 官方译文](http://cn.rx.js.org/)
1. [Introduction to RxJS](https://segmentfault.com/a/1190000012252368) By TonyZhu
1. [使用 RxJS 处理多个 Http 请求](https://segmentfault.com/a/1190000010088631) By semlinker
1. [Observable 的 Operators 集合](http://www.cnblogs.com/solodancer/p/7954846.html) By soloDancer_讠
1. [We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html) By Nolan Lawson

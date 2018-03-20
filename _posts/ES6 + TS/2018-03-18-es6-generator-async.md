---
layout: blog
front: true
comments: True
flag: ES6
background: blue
category: 前端
title:  Generator & Async
date:   2018-03-20 15:47:00 GMT+0800 (CST)
background-image: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2447683882,2644927629&fm=27&gp=0.jpg
tags:
- ES6
---
# {{ page.title }}

## Generator 函数

### yield / next

**Generator** 函数是 ES6 提供的一种异步编程解决方案，执行 Generator 函数会返回一个指向内部状态的遍历器对象。Generator 函数是分段执行的，yield 表达式是暂停执行的标记，而 next 方法可以恢复执行。

```JS
function* helloTate() {
  yield 'tate';
  yield 'loves';
  return 'snow';
}

var ht = helloTate();
ht.next(); // {value: 'tate', done: false}
ht.next(); // {value: 'loves', done: false}
ht.next(); // {value: 'snow', done: false}
ht.next(); // {value: undefined, done: true}
```

Generator 函数执行后，返回一个遍历器对象。该对象本身也具有 Symbol.iterator 属性，执行后返回自身:

```JS
function* gen(){ }

var g = gen();
g[Symbol.iterator]() === g; // true
```

作为对象属性的 Generator 函数写法:

```JS
let obj = {
  *myGeneratorMethod() { }
};

// 等价于
let obj = {
  myGeneratorMethod: function* () { }
};
```

next 带参数的情况:

```JS
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

// 由于 next 方法的参数表示上一个 yield 表达式的返回值，所以在第一次使用 next 方法时，传递参数是无效的
var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}

var b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }
```

### throw

Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```JS
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
  i.throw('c'); // 不会再执行
  // throw new Error('d'); // 注意全局 throw 命令的不同，只能被函数体外的 catch 捕获
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a // 第一个错误被 Generator 函数体内的 catch 语句捕获
// 外部捕获 b // 由于上述 Generator 函数体内的 catch 已经执行捕获，因此第二个错误被函数体外的 catch 捕获
```

throw 方法被捕获以后，会附带执行下一条 yield 表达式。即执行一次 next 方法:

```JS
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) { }

  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next(); // a
g.throw(); // b 若 Generator 函数体内没有 try catch 代码块进行捕获错误则会中断执行
g.next(); // c
```

### return

Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终止遍历 Generator 函数。

```JS
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next(); // { value: 1, done: false }
g.return('tate'); // { value: 'tate', done: true } 不提供参数则为 undefined
g.next(); // { value: undefined, done: true }
```

如果 Generator 函数内部有 try...finally 代码块，那么return方法会推迟到finally代码块执行完再执行

```JS
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.return(7); // { value: 4, done: false }
g.next(); // { value: 5, done: false }
g.next(); // { value: 7, done: true }
```

### yield*

**yield*** 表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数。

```JS
function* foo() {
  yield 'a';
  yield 'b';
}

// 任何数据结构只要部署 Iterator 接口，就可以被 yield* 遍历
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
  yield [1, 2];
  yield* [1, 2];
}

for (let v of bar()){
  console.log(v); // a x b y [1, 2] 1 2
}
```

注意 yield* 中 return 语句的返回值:

```JS
function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'c';
}
function* logReturned(genObj) {
  console.log(yield* genObj); // c
}

[...logReturned(genFuncWithReturn())] // ['a', 'b']
```

举个栗子 🌰，使用 yield* 语句遍历完全二叉树:

```JS
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

// 下面是中序(inorder)遍历函数。
// 由于返回的是一个遍历器，所以要用 generator 函数。
// 函数体内采用递归算法，所以左树和右树要用 yield* 遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}

result; // ['a', 'b', 'c', 'd', 'e', 'f', 'g']
```

### 上下文

在[执行上下文一节]( {{site.url}}/2018/02/09/js-scope.html )已经介绍过可执行代码产生如何产生执行上下文。而 Generator 函数却不同，其执行产生的上下文，一旦遇到 yield 命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行 next 命令时，这个执行上下文又会重新加入调用栈，冻结的变量和对象恢复执行。

### 状态机

**[状态机](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)**是表示有限个状态以及在这些状态之间的转移和动作等行为的数学模型，Generator 可以实现状态机。举个栗子 🌰:

```JS
// 通常写法 clock 即是一个状态机
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}
```

```JS
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};
```

### 控制流程管理案例

假设有多个异步操作需要执行，采用回调的写法:

```JS
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // do something
      });
    });
  });
});
```

采用 Promise 的写法:

```JS
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // do something
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done();
```

采用 Generator 函数的写法，但只支持多任务的同步执行:

```JS
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // do something
  } catch (e) {
    // Handle any error from step1 through step4
  }
}

run(longRunningTask(initialValue));

// 此时的 task 都是同步执行，因为只要有返回值就继续往下执行，没有判断异步操作何时完成。
function run(task) {
  var taskObj = task.next(task.value);
  // 如果 Generator 函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value;
    run(task);
  }
}
```

Generator 就是一个异步操作的容器。它的自动执行需要一种机制(执行器)，当异步操作有了结果，能够自动交回执行权。有两种方法可以实现，即 yield 命令后面，只能是 Thunk 函数或 Promise 对象:

* 回调函数 - 将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。例如[模块 Thunkify](https://github.com/tj/node-thunkify)
* Promise - 将异步操作包装成 Promise 对象，用 then 方法交回执行权。例如[模块 co](https://github.com/tj/co)

关于 Thunk 函数可以[参考这里](http://es6.ruanyifeng.com/#docs/generator-async#Thunk-%E5%87%BD%E6%95%B0)，其本质是传名调用，只包含一个参数和一个回调。

```JS
// ES5
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};

var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```

## async 函数

### 语法糖

**async** 函数就是 Generator 函数的语法糖。async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖，对比 Generator 主要有以下四点改进:

* **内置执行器**

Generator 函数的执行必须靠执行器，所以才有了 co 模块，而 async 函数自带执行器，如 asyncReadFile();

* **更好的语义**

async 和 await，比起星号 * 和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

* **更广的适用性**

co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值(数值、字符串和布尔值，但这时等同于同步操作)。

* **返回值是 Promise**

async 函数的返回值是 Promise 对象，而 Generator 函数的返回值是 Iterator 对象。

```JS
// Generator
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

var g = gen();
g.next();
```

```JS
// async
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
asyncReadFile(); // 内置执行器
```

### 书写形式

```JS
// 函数声明
async function foo() {}

// 函数表达式
const foo = async () => {};

// 对象的方法
let person = { async sayName() {return 'tate'} };

person.sayName().then((data) => console.log(data)); // 'tate'

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('tate').then(…);
```

### 实现原理

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```JS
async function fn(args) { }

// 等价于
function fn(args) {
  return spawn(function* () { });
}
```

```JS
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

### 按顺序完成异步操作

例如依次远程读取 URL，并按照读取顺序输出结果:

```JS
async function logInOrder(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

上述例子中所有远程操作都是继发，即只有前一个 URL 返回结果，才会去读取下一个 URL，会影响效率，改写如下:

```JS
async function logInOrder(urls) {
  // 并发读取远程 URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

> 本节内容不是很了解，未完待续。直接[参考阮一峰 ES6 入门](http://es6.ruanyifeng.com/#docs)。

## 参考链接

1. [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/iterator) By 阮一峰
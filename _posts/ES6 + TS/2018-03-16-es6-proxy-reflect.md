---
layout: blog
front: true
comments: True
flag: ES6
background: blue
category: 前端
title:  Proxy & Reflect
date:   2018-03-17 11:09:00 GMT+0800 (CST)
background-image: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2447683882,2644927629&fm=27&gp=0.jpg
tags:
- ES6
---
# {{ page.title }}

## Proxy

### 使用方法

**Proxy** 代理用于修改某些操作的默认行为，可以对外界的访问进行过滤和改写。

```JS
// 使用方法
var proxy = new Proxy(target, handler);
```

```JS
var handler = {
  get(target, key) {
    if (key === 'prototype') {
      return Object.prototype;
    }
    return 'Hi, ' + key;
  },
  apply(target, thisBinding, args) {
    return args[0];
  },
  construct(target, args) {
    return {value: args[1]};
  }
};

var proxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

proxy(1, 2); // 1
new proxy(1, 2); // {value: 2}
proxy.prototype === Object.prototype; // true
proxy.tate; // 'Hi, tate'
```

下面是 Proxy 支持的拦截操作一览，一共 13 种:

| 命令 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **get**(target, propKey, receiver) | 拦截对象属性的读取 | proxy.foo 和 proxy['foo'] |
| **set**(target, propKey, value, receiver) | 拦截对象属性的设置 | proxy.foo = bar 或 proxy['foo'] = bar，返回一个布尔值 |
| **has**(target, propKey) | 拦截 in 遍历 | propKey in proxy 的操作，返回一个布尔值 |
| **deleteProperty**(target, propKey) | 拦截 delete 操作 | delete proxy[propKey] 的操作，返回一个布尔值 |
| **ownKeys**(target) | 拦截 Object 遍历 | Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性 |
| **getOwnPropertyDescriptor**(target, propKey) | 拦截描述符的获取 | Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象 |
| **defineProperty**(target, propKey, propDesc) | 拦截对象的定义 | Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值 |
| **preventExtensions**(target) | 拦截对象的不可扩展 | Object.preventExtensions(proxy)，返回一个布尔值 |
| **isExtensible**(target) | 拦截判断对象是否可扩展 | Object.isExtensible(proxy)，返回一个布尔值 |
| **getPrototypeOf**(target) | 拦截对象__proto__指针的获取 | Object.getPrototypeOf(proxy)，返回一个对象 |
| **setPrototypeOf**(target, proto) | 拦截对象__proto__指针的设置 | Object.setPrototypeOf(proxy, proto)，返回一个布尔值 |
| **apply**(target, object, args) | 拦截 Proxy 实例作为函数调用的操作 | proxy(...args)、proxy.call(object, ...args)、proxy.apply(...) |
| **construct**(target, args) | 拦截 Proxy 实例作为构造函数调用的操作 | new proxy(...args) |

### 使用案例

* 剥离验证逻辑

```JS
const handler = {
  set(target, key, value, proxy) {
    if (typeof value !== 'number') {
      throw Error("Properties can only be numbers");
    }
    return Reflect.set(target, key, value, proxy);
  }
};

function numericLimit(target) {
  return new Proxy(target, handler);
}

let numericDataStore = numericLimit({
  count: 0,
  total: 10
});

numericDataStore.count = 'foo'; // 报错
numericDataStore.count = 1;
```

* 私有属性

```JS
let api = {
  _pcode: '591550',
  /* mock methods that use this._pcode */
  getUsers: function(){ },
  getUser: function(userId){ },
  setUser: function(userId, config){ }
};

// Add other restricted properties to this array
const RESTRICTED = ['_pcode'];

api = new Proxy(api, {
  get(target, key, proxy) {
    if(RESTRICTED.includes(key)) {
      throw Error(`${key} is restricted. Please see api documentation for further info.`);
    }
    return Reflect.get(target, key, proxy);
  },
  set(target, key, value, proxy) {
    if(RESTRICTED.includes(key)) {
      throw Error(`${key} is restricted. Please see api documentation for further info.`);
    }
    return Reflect.get(target, key, value, proxy);
  },
  has(target, key) {
    return (RESTRICTED.includes(key)) ? false : Reflect.has(target, key);
  }
});

api._pcode; // 报错
api._pcode = '01102618'; // 报错
'_pcode' in api; // false
```

* 预警和拦截

```JS
let dataStore = {
  noDelete: 10,
  oldMethod: function() { },
  doNotChange: 'tate'
};

const NODELETE = ['noDelete'];
const DEPRECATED = ['oldMethod'];
const NOCHANGE = ['doNotChange'];

dataStore = new Proxy(dataStore, {
  set(target, key, value, proxy) {
    if (NOCHANGE.includes(key)) {
      throw Error(`Error! ${key} is immutable.`);
    }
    return Reflect.set(target, key, value, proxy);
  },
  deleteProperty(target, key) {
    if (NODELETE.includes(key)) {
      throw Error(`Error! ${key} cannot be deleted.`);
    }
    return Reflect.deleteProperty(target, key);

  },
  get(target, key, proxy) {
    if (DEPRECATED.includes(key)) {
      console.warn(`Warning! ${key} is deprecated.`);
    }
    var val = target[key];

    return typeof val === 'function' ?
      function(...args) {
        Reflect.apply(target[key], target, args);
      } :
      val;
  }
});

// these will throw errors or log warnings, respectively
dataStore.doNotChange = 'foo';
delete dataStore.noDelete;
dataStore.oldMethod();
```

> ES7 中定义的 [Decorator]( {{site.url}}/2018/03/16/es6-class-decorator.html ) 修饰符也可以实现上述部分功能。Proxy 的核心作用是控制外界对被代理者内部的访问，Decorator 的核心作用是增强被装饰者的功能。

## Reflect

### 设计目的

**Reflect** 对象设计的目的:

* 将 Object 对象的一些明显属于语言内部的方法(比如 Object.defineProperty)，放到 Reflect 对象上
* 修改某些 Object 方法的返回结果，让其变得更合理

```JS
// 老写法
try {
  Object.defineProperty(target, property, attributes); // 无法定义属性时会抛出错误
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) { // 无法定义属性时会返回 false
  // success
} else {
  // failure
}
```

* 让 Object 操作都变成函数行为

```JS
// 老写法 命令式
'assign' in Object; // true

Object.hasOwnProperty('assign'); // true

// 新写法 函数式
Reflect.has(Object, 'assign'); // true
```

* Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法

```JS
// 每一个Proxy对象的拦截操作（get、delete、has），内部都调用对应的Reflect方法，保证原生行为能够正常执行
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
});
```

```JS
Math.max.apply(null, [1, 2, 3]);
Math.max.call(null, 1, 2, 3);
Function.prototype.apply.call(Math.max, null, [1, 2, 3]);
Reflect.apply(Math.max, null, [1, 2, 3]);
```

### 静态方法

Reflect 对象一有共 13 种静态方法，大部分与 Object 对象的同名方法的作用都是相同的，而且它与 Proxy 对象的方法是一一对应的。

| 方法 | 描述 | 栗子 |
|--------------|---------|---------|
| Reflect.apply(target, thisArg, args) | Function.prototype.apply.call(func, thisArg, args)，用于绑定 this 对象后执行给定函数 | `Reflect.apply(Math.min, Math, ages)` |
| Reflect.construct(target, args) | new target(...args)，调用构造函数 | `const person = Reflect.construct(Person, ['tate', 18])` |
| Reflect.get(target, name, receiver) | 查找并返回 target 对象的 name 属性 | `Reflect.get(obj, 'foo')` |
| Reflect.set(target, name, value, receiver) | 设置 target 对象的 name 属性等于 value | `Reflect.set(obj, 'foo', 'bar')` |
| Reflect.defineProperty(target, name, desc) | 同 Object.defineProperty，但返回布尔值 | `Reflect.defineProperty(obj, 'foo', {value: 'bar'})` |
| Reflect.deleteProperty(target, name) | 用于删除对象的属性 | `Reflect.deleteProperty(obj, 'foo')` |
| Reflect.has(target, name) | 对应 name in obj 里面的 in 运算符 | `Reflect.has(obj, 'foo')` |
| Reflect.ownKeys(target) | 返回对象的所有属性 | `Reflect.ownKeys(obj)` |
| Reflect.isExtensible(target) | 同 Object.isExtensible | `Reflect.isExtensible(obj)` |
| Reflect.preventExtensions(target) | 同 Object.preventExtensions | `Reflect.preventExtensions(obj)` |
| Reflect.getOwnPropertyDescriptor(target, name) | 同 Object.getOwnPropertyDescriptor | `Reflect.getOwnPropertyDescriptor(obj, 'foo');` |
| Reflect.getPrototypeOf(target) | 同 Object.getPrototypeOf(obj) | `Reflect.getPrototypeOf(obj)` |
| Reflect.setPrototypeOf(target, prototype) | 同 Object.setPrototypeOf(obj, newProto) | `Reflect.setPrototypeOf(obj, newProto)` |

## 参考链接

1. [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/proxy) By 阮一峰
1. [实例解析 ES6 Proxy 使用场景](https://www.w3cplus.com/javascript/use-cases-for-es6-proxies.html) By loveky

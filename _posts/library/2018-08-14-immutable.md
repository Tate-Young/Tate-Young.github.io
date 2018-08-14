---
layout: blog
tool: true
comments: True
flag: JS
background: green
category: 前端
title:  Immutable
# date:   2018-08-13 22:16:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/08/14/5b726b7f8d3b1.jpg
tags:
- immutable
- redux
- js
---
# {{ page.title }}

## 什么是 Immutable

本段[摘自 CamSong 的 Github 上的博客](https://github.com/camsong/blog/issues/3)

JavaScript 中的对象一般是**可变的(Mutable)**，因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。如 <code>foo={a: 1}; bar=foo; bar.a=2</code> 你会发现此时 <code>foo.a</code> 也被改成了 2。虽然这样做可以节约内存，但当应用复杂后，这就造成了非常大的隐患，Mutable 带来的优点变得得不偿失。为了解决这个问题，一般的做法是使用 [**shallowCopy(浅拷贝)** 或 **deepCopy(深拷贝)**]( {{site.url}}/2018/01/31/js-deep-shallow-copy.html ) 来避免被修改，但这样做造成了 CPU 和内存的浪费。因此通常会采用本文介绍的 **Immutable** 不可变对象。

对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。Immutable 实现的原理是 **Persistent Data Structure(持久化数据结构)**，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 **Structural Sharing(结构共享)**，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享:

![Structual Sharing](https://camo.githubusercontent.com/9e129aaf95d2a645a860dc26532796817e8085c0/687474703a2f2f696d672e616c6963646e2e636f6d2f7470732f69322f5442317a7a695f4b5858585858637458465858627262384f5658582d3631332d3537352e676966)

使用 Immutable 的优点有:

* Immutable 降低了 Mutable 带来的复杂度
* 节省内存 - Immutable.js 使用了 Structure Sharing 会尽量复用内存，甚至以前使用的对象也可以再次被复用。没有被引用的对象会被垃圾回收。
* Undo/Redo，Copy/Paste - 每次数据都是不一样的，只要把这些数据放到一个数组里储存起来，想回退到哪里就拿出对应数据即可，很容易开发出撤销重做这种功能
* 并发安全 - 传统的并发非常难做，因为要处理各种数据不一致问题，而 Immutable 不需要并发锁
* 拥抱函数式编程 - Immutable 本身就是函数式编程中的概念，纯函数式编程比面向对象更适用于前端开发

然而缺点也是很明显的，就是与原生交互操作会困难，要保证 Immutable 其不可变，你的数据就必须封装在 Immutable 对象（例如：Map 或 List 等）中。一旦使用这种方式包裹数据，这些数据就很难与其他普通的 JavaScript 对象进行交互操作。Immutable 对象确实包含 toJS() 方法，该方法会返回普通 JavaScript 数据结构形式的对象，但这种方法非常慢，广泛使用将会失去 Immutable 提供的性能优势。

目前常用的两个 Immutable 库是 [**immutable.js**](https://github.com/facebook/immutable-js/) 和 [**seamless-immutable**](https://github.com/rtfeldman/seamless-immutable)。

## Immutable.js

### 数据类型

Imutable.js 中常用的数据类型有:

* **List** - 有序索引集，类似 js 中的 Array
* **Map** - 无序索引集，类似 js 中的 Object
* **Set** - 没有重复值的集合，同 ES6 的 set
* **Stack** - 有序集合，支持使用 unshift()和 shift() 增加和删除

```JS
import Immutable from 'immutable';

var map1 = Immutable.Map({ a: 1, b: 3 });
var map2 = map1.set('a', 2);

map1.get('a'); // 1
map2.get('a'); // 2
```

### 常用 API

[常用的 API](https://facebook.github.io/immutable-js/docs/#/) 有:

* **fromJS()** - 将一个 js 数据转换为 Immutable 类型的数据
* **toJS()** - 将一个 Immutable 数据转换为 JS 类型的数据
* **is()** - 对两个对象进行比较。在 js 中比较两个对象的内存地址，但是在 Immutable 中比较的是这个对象 **hashCode** 和 valueOf，只要两个对象的 hashCode 相等，值就是相同的，避免了深度遍历，提高了性能
* **get()** - 获取属性，**getIn()** 可以在一个数据结构中获得深处的值，传递一个数组，如 <code>data.getIn(['key', 2])</code>
* **set()** - 设置属性，**setIn()** 可以在一个数据结构中设置深处的值
* **has()** - 判断是否有该属性，**hasIn()** 同上
* **delete()** - 删除属性，**deleteIn()** 同上，**deleteAll()** 可以删除多个属性，如 <code>data.deleteAll([ 'a', 'c' ])</code>
* **update()** - 对对象中的某个属性进行更新，可对原数据进行相关操作，**updateIn() **同上
* **clear()** - 清除数据
* **merge()** - 浅合并，新数据与旧数据对比，不存在则新增，有则覆盖。**mergeDeep()** 为深合并

```JS
// 1. Map 大小
const map1 = Map({ a: 1 });
map1.size
// => 1

// 2. 新增或取代 Map 元素
const map2 = map1.set('a', 7)
// => Map { "a": 7 }

// 3. 删除元素
const map3 = map1.delete('a')
// => Map {}

// 4. 清除 Map 内容
const map4 = map1.clear()
// => Map {}

// 5. 更新 Map 元素
const map5 = map1.update('a', () => (7))
// => Map { "a": 7 }

// 6. 合并 Map
const map6 = Map({ b: 3 })
map1.merge(map6)
// => Map { "a": 1, "b": 3 }
```

更多 getIn 和 setIn 方法的栗子:

```JS
const a = Map({ x: { y: { z: 123 }}})
a.getIn(['x', 'y', 'z']) // 123
a.setIn(['x', 'y', 'z'], 456)

const b = List([1, [2, 3]])
b.getIn([1, 0]) // 2
b.setIn([1, 1], 4)

b.set(0, 5) // [5, [2, 3]]
b.setIn([0], 5) // 同上
```

is 方法的比较如下:

```JS
import { Map, is } from 'immutable'

const map1 = Map({ a: 1, b: 1, c: 1 })
const map2 = Map({ a: 1, b: 1, c: 1 })
map1 === map2   // false
Object.is(map1, map2) // false
is(map1, map2) // true
```

合并的方法还有其他几个，区别如下:

```JS
const Map1 = Immutable.fromJS({a:1, b:2, c:{d:3, e:4}})
const Map2 = Immutable.fromJS({a:1, b:2, c:{e:4, f:5}})

const Map3 = Map1.merge(Map2)
// Map {a:1, b:2, c:{e:4, f:5}}
const Map4 = Map1.mergeDeep(Map2)
// Map {a:1, b:2, c:{d:3, e:4, f:5}}
const Map5 = Map1.mergeWith((oldData,newData,key) => {
  if (key === 'a') {
    return 6
  } else {
    return newData
  }
}, Map2);
// Map {a:6, b:2, c:{e:4, f:5}}
```

### Cursor

由于 Immutable 数据一般嵌套非常深，为了便于访问深层数据，**Cursor** 提供了可以直接访问这个深层数据的引用。

```JS
import { fromJS } from 'immutable';
import Cursor from 'immutable/contrib/cursor';

let data = fromJS({ a: { b: { c: 1 } } });
// 让 cursor 指向 { c: 1 }
let cursor = Cursor.from(data, ['a', 'b'], newData => {
  // 当 cursor 或其子 cursor 执行 update 时调用
  console.log(newData);
});

cursor.get('c'); // 1
cursor = cursor.update('c', x => x + 1);
cursor.get('c'); // 2
```

### withMutations

**withMutations** 主要用来提升性能，将需要多次创建的 Imutable 合并成一次:

```JS
const { List } = require('immutable')

const list1 = List([1, 2, 3]);
var list2 = list1.withMutations(function (list) {
    // 经过优化，会合并中间装填，仅仅会生成最后一次 Imutable
    list.push(4).push(5).push(6);
});
// 每一个 push 会生成一个新的 Imutable
var list3 = list1.push(4).push(5).push(6);
console.log(list2.equals(list3))
```

## Redux 中实践

使整个 Redux state tree 成为 Immutable.JS 对象，因为对于使用 Redux 的应用程序来说，你的整个 state tree 应该是 Immutable.JS 对象，根本不需要使用普通的 JavaScript 对象。

* 使用 Immutable.JS 的 fromJS() 函数创建树。
* 使用 combineReducers 函数的 Immutable.JS 的感知版本，比如 **redux-immutable** 中的版本，因为 Redux 本身会将 state tree 变成一个普通的 JavaScript 对象。
* 当使用 Immutable.JS 的 update、merge 或 set 方法将一个 JavaScript 对象添加到一个 Immutable.JS 的 Map 或者 List 中时，要确保被添加的对象事先使用了 fromJS() 转为一个 Immutable 的对象。

```JS
// 避免
const newObj = { key: value }
const newState = state.setIn(['prop1'], newObj)
// newObj 作为普通的 JavaScript 对象，而不是 Immutable.JS 的 Map 类型。

// 推荐
const newObj = { key: value }
const newState = state.setIn(['prop1'], fromJS(newObj))
// newObj 现在是 Immutable.JS 的 Map 类型。
```

### toJS()

使用[**高阶组件(HOC)**](https://doc.react-china.org/docs/higher-order-components.html)来转换从 [**Smart**](https://jaketrent.com/post/smart-dumb-components-react/) 组件的 Immutable.JS props 到 **Dumb** 组件的 JavaScript props，它只需从 Smart 组件中获取 Immutable.JS props，然后使用 toJS() 将它们转换为普通 JavaScript props，然后传递给你的 Dumb 组件，还[可以参考这里](https://www.developmentsindigital.com/posts/2018-03-13-using-immutable-with-redux/):

```JS
import React from 'react'
import { Iterable } from 'immutable'

export const toJS = WrappedComponent => wrappedComponentProps => {
  const KEY = 0
  const VALUE = 1

  const propsJS = Object.entries(
    wrappedComponentProps
  ).reduce((newProps, wrappedComponentProp) => {
    newProps[wrappedComponentProp[KEY]] = Iterable.isIterable(
      wrappedComponentProp[VALUE]
    )
      ? wrappedComponentProp[VALUE].toJS()
      : wrappedComponentProp[VALUE]
    return newProps
  }, {})

  return <WrappedComponent {...propsJS} />
}
```

在 smart 组件中使用，通过在 HOC 中将 Immutable.JS 对象转换为纯 JavaScript 值，我们实现了 Dumb 的可移植性，也没在 Smart 组件中使用 toJS() 影响性能:

```JSX
import { connect } from 'react-redux'

import { toJS } from './to-js'
import DumbComponent from './dumb.component'

const mapStateToProps = state => {
  return {
    // obj 是一个 Smart 组件中的不可变对象，但它通过 toJS 被转换为普通 JavaScript 对象，并以纯 JavaScript 的形式传递给 Dumb 组件对象。
    // 因为它在 mapStateToProps 中仍然是 Immutable.JS 对象，虽然，这是无疑是错误重新渲染。
    obj: getImmutableObjectFromStateTree(state)
  }
}
export default connect(mapStateToProps)(toJS(DumbComponent))
```

> 更多[可以参考这里](https://cn.redux.js.org/docs/recipes/UsingImmutableJS.html) 👈

### redux-immutable

[**redux-immutable**](https://github.com/gajus/redux-immutable) 通过使用 Redux 中 **combineReducers** 一样的方法来合并 reducers，并将 store 转化为 Immutable 对象。

```JSX
// import { combineReducers } from 'redux'; // 旧的方法
import { combineReducers } from 'redux-immutable'; // 新的方法
import laptopReducer from '../laptop/duck/reducers'

export default combineReducers({
  laptop: laptopReducer,
})
```

在 reducer 中操作 state:

```JSX
// ../laptop/duck/reducers
// Immutable State
// reduxsauce 的写法
const editComponent = (state = INITIAL_STATE, action) => state.set('activeData', action.component)
```

## 参考链接

1. [Immutable 官方文档](https://facebook.github.io/immutable-js/)
2. [Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3) By CamSong
3. [Smart and Dumb Components in React](https://jaketrent.com/post/smart-dumb-components-react/)
4. [Using immutable with Redux](https://www.developmentsindigital.com/posts/2018-03-13-using-immutable-with-redux/)
5. [Imutable 使用 withMutations 提升性能](https://blog.csdn.net/ISaiSai/article/details/77878863) By isaisai

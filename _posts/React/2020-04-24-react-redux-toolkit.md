---
layout: blog
front: true
comments: True
flag: react
background: green
category: 前端
title:  Redux Toolkit
date:   2020-04-28 14:11:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/08/08/5b6a497fea578.png
tags:
- React
---
# {{ page.title }}

## 什么是 RTK

之前我们已经介绍过了 [React-Redux]( {{site.url}}/2018/08/07/react-redux.html ) 状态管理工具，对于一些大型项目，我们更容易去追踪数据的变化和进行管理，让我们维护起来更加方便，但是它仍然让人诟病，简单的总结下:

1. 样板代码太多 - 对于用过 mobx 的同学，redux 的样板代码无疑是很多的，而且阅读性并不是很好，当然样板代码对于我们书写和 debug 是有很大帮助的，顺着藤我们就能摸到瓜。但是我们怎样才能去精简呢，之前我们有用到 [**reduxsauce**](https://github.com/jkeam/reduxsauce)，这是一款很不错的第三方库，顾名思义，它是我们 redux 管理中的调味料，提供更好的书写和阅读性，当然我们还可以做得更多
2. duck 模式下文件拆分很细，反而不易维护和理解，即 `action、action type、reducer、saga、selector` 等元素充斥在不同的文件中，我们可以进行一定的整合
3. immutable.js 的引入虽然帮助我们更好的处理状态的变更，但是也提高了学习和使用成本，属性的获取和设置远远没有点语法便捷，而且难与其他数据处理库结合，需要对数据进行各种转换。另一方面 Typescript 的接入并不是很友好

**RTK** 即 [**Redux Toolkit**](https://redux-toolkit.js.org/tutorials/basic-tutorial)，v1.0.4 之前称为 `Redux Starter Kit`。要想在项目中使用 RTK 的话，可以参考以下命令:

```SHELL
# 新建项目，并集成 RTK
npx create-react-app my-app --template redux

# 现有项目
ya @reduxjs/toolkit
```

需要注意的是，**RTK 依然沿用了 Redux 的核心思想，只是提供了新的 API 来精简代码**，旨在让工具变得更加高效。我们先简单的看一个官方栗子:

```JS
// counter application before
// 定义 action type
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

// 定义 action
const increment = () => ({
  type: INCREMENT,
})

const decrement = () => ({
  type: DECREMENT,
})

// 监听 action type
function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}

const store = Redux.createStore(counter)

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(increment()) // 分发 action
})
```

```JS
// counter application after
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1
  }
})

const store = configureStore({
  reducer: counterSlice.reducer
})

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(counterSlice.actions.increment())
})
```

ok，看起来是不是更加简洁了，虽然 API 目前还不太熟，但是感觉还可以，接下来往下走先介绍下 API。这里我们提前总结一下:

* **configureStore**: creates a Redux store instance like the original createStore from Redux, but accepts a named options object and sets up the Redux DevTools Extension automatically
* **createAction**: accepts an action type string, and returns an action creator function that uses that type
* **createReducer**: accepts an initial state value and a lookup table of action types to reducer functions, and creates a reducer that handles all of those action types
* **createSlice**: accepts an initial state and a lookup table with reducer names and functions, and automatically generates action creator functions, action type strings, and a reducer function.

## configureStore

通常情况下，我们可以通过 **createStore** 方法来创建 Redux store，用以维护整个应用的 state。[**configureStore**](https://redux-toolkit.js.org/api/configureStore) 也做了同样的事情，但是通过这个方法也可以创建其他的一些有用的开发工具:

```JS
// Before:
const store = createStore(counter)

// After:
const store = configureStore({
  reducer: counter
})
```

从上面栗子看来，书写上没啥两样，但是 store 其实已经被设置为可以使用 [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) 来追踪状态变化，同样也包含了一些[默认的中间件](https://redux-toolkit.js.org/api/getDefaultMiddleware)。想想我们以前是怎么添加 RDE 工具来调试的:

```JS
import { compose, createStore, applyMiddleware } from 'redux'

const composeEnhancers = (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middlewares),
))
```

我们再来看看它所支持的以及默认的一些配置:

```JS
type ConfigureEnhancersCallback = (
  defaultEnhancers: StoreEnhancer[]
) => StoreEnhancer[]

interface ConfigureStoreOptions<S = any, A extends Action = AnyAction> {
  /**
   * A single reducer function that will be used as the root reducer, or an
   * object of slice reducers that will be passed to `combineReducers()`.
   */
  reducer: Reducer<S, A> | ReducersMapObject<S, A>

  /**
   * An array of Redux middleware to install. If not supplied, defaults to
   * the set of middleware returned by `getDefaultMiddleware()`.
   */
  middleware?: Middleware<{}, S>[]

  /**
   * Whether to enable Redux DevTools integration. Defaults to `true`.
   *
   * Additional configuration can be done by passing Redux DevTools options
   */
  devTools?: boolean | DevToolsOptions

  /**
   * The initial state, same as Redux's createStore.
   * You may optionally specify it to hydrate the state
   * from the server in universal apps, or to restore a previously serialized
   * user session. If you use `combineReducers()` to produce the root reducer
   * function (either directly or indirectly by passing an object as `reducer`),
   * this must be an object with the same shape as the reducer map keys.
   */
  preloadedState?: DeepPartial<S extends any ? S : S>

  /**
   * The store enhancers to apply. See Redux's `createStore()`.
   * All enhancers will be included before the DevTools Extension enhancer.
   * If you need to customize the order of enhancers, supply a callback
   * function that will receive the original array (ie, `[applyMiddleware]`),
   * and should return a new array (such as `[applyMiddleware, offline]`).
   * If you only need to add middleware, use the `middleware` parameter instead.
   */
  enhancers?: StoreEnhancer[] | ConfigureEnhancersCallback
}

function configureStore<S = any, A extends Action = AnyAction>(
  options: ConfigureStoreOptions<S, A>
): EnhancedStore<S, A>
```

然后直接贴一下示例:

```JS
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

// We'll use redux-logger just as an example of adding another middleware
import logger from 'redux-logger'

// And use redux-batch as an example of adding enhancers
import { reduxBatch } from '@manaflair/redux-batch'

import todosReducer from './todos/todosReducer'
import visibilityReducer from './visibility/visibilityReducer'

const reducer = {
  todos: todosReducer,
  visibility: visibilityReducer
}

const middleware = [...getDefaultMiddleware(), logger]

const preloadedState = {
  todos: [
    {
      text: 'Eat food',
      completed: true
    },
    {
      text: 'Exercise',
      completed: false
    }
  ],
  visibilityFilter: 'SHOW_COMPLETED'
}

const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
  enhancers: [reduxBatch]
})

// The store has been created with these options:
// - The slice reducers were automatically passed to combineReducers()
// - redux-thunk and redux-logger were added as middleware
// - The Redux DevTools Extension is disabled for production
// - The middleware, batch, and devtools enhancers were automatically composed together
```

## createAction

[**createAction**](https://redux-toolkit.js.org/api/createAction) 接收一个 `action type` 字符串作为参数，然后返回一个 `action creator` 函数来使用该参数:

```JS
// Original approach: write the action type and action creator by hand
const INCREMENT = 'INCREMENT'

function incrementOriginal() {
  return { type: INCREMENT }
}

console.log(incrementOriginal())
// { type: "INCREMENT" }

// Or, use `createAction` to generate the action creator:
const increment = createAction('INCREMENT')

console.log(increment())
// { type: "INCREMENT" }

console.log(increment.toString())
console.log(increment.type) // 包含了 type 属性
// "INCREMENT"
```

我们可以看到，通过使用 createAction 方法，可以更加语义化，一看就知道在做什么，这样改造上述的栗子后，我们可以得到:

```JS
const increment = createAction('INCREMENT')
const decrement = createAction('DECREMENT')

function counter(state = 0, action) {
  switch (action.type) {
    case increment.type:
      return state + 1
    case decrement.type:
      return state - 1
    default:
      return state
  }
}

// ...
```

当然它还可以接收第二个参数，可以通过 `prepare callbacks` 来定义 action 内容。不如来个例子:

```JS
function createAction(type, prepareAction?)
```

```JS
import v4 from 'uuid/v4'

const addTodo = createAction('todos/add', function prepare(text) {
  return {
    payload: {
      text,
      id: v4(),
      createdAt: new Date().toISOString()
    }
  }
})

console.log(addTodo('Write more docs'))
/**
 * {
 *   type: 'todos/add',
 *   payload: {
 *     text: 'Write more docs',
 *     id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
 *     createdAt: '2019-10-03T07:53:36.581Z'
 *   }
 * }
 **/
```

## createReducer

到现在，我们还是能看到那一坨显眼的 switch 语句，是时候拿他开刀了。[**createReducer**](https://redux-toolkit.js.org/api/createReducer) 可以让你通过 `lookup table` 对象来编写 reducer，每个 key 对应着 `action type` 字符串，值为 `reducer function`:

```JS
const increment = createAction('INCREMENT')
const decrement = createAction('DECREMENT')

const counter = createReducer(0, {
  [increment.type]: state => state + 1,
  [decrement.type]: state => state - 1
})
```

由于无论包含某个变量，计算属性语法都会调用 `toString()` 方法，而上面我们知道它返回的就是 `action type`，因此可进一步简化:

```JS
const counter = createReducer(0, {
  [increment]: state => state + 1,
  [decrement]: state => state - 1
})
```

## createSlice

以上 API 只是针对现有的代码进行一定的精简，目前整体看起来是这样子的:

```JS
const increment = createAction('INCREMENT')
const decrement = createAction('DECREMENT')

const counter = createReducer(0, {
  [increment]: state => state + 1,
  [decrement]: state => state - 1
})

const store = configureStore({
  reducer: counter
})

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(increment())
})
```

这看起来已经很不错了，但我们还需要再做一次最核心的改变。我们可以看到，现在我们仍然需要单独地去创建 `action creator`，然后根据 `action type` 去调用对应 `reducer function`，很显然最重要的就是最后一步，这也就是 [**createSlice**](https://redux-toolkit.js.org/api/createSlice) 方法的由来。

createSlice 允许我们提供一个包含 `reducer function` 的对象，并且会根据我们列出来的 reducer 名称来自动创建 `action creator` 和 `action type` 字符串:

```JS
const counterSlice = createSlice({
  // A name, used in action types
  name: 'counter',
  // The initial state for the reducer
  initialState: 0,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1
  }
})

const { reducer. actions } = counterSlice

const store = configureStore({
  reducer,
})

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(actions.increment())
})
```

从上面可以看到，调用 createSlice 方法后，返回的对象如下:

```JS
{
  name : string,
  reducer : ReducerFunction,
  actions : Object<string, ActionCreator>,
}
```

通过改造后，之前 duck 文件夹下的代码结构将会有所精简，`action、action type、reducer` 文件将会由一个 `*slice.js` 文件替换。另一方面 createSlice 也提供了 `extraReducers` 配置，用以相应其他未自动生成的 `action type`，举个栗子:

```JS
const incrementBy = createAction('incrementBy') // 其他方式生成，并非写在 reducers 里

createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [incrementBy]: (state, action) => {
      return state + action.payload
    }
  }
  // The "builder callback" API for extraReducers, recommended for TypeScript users
  // extraReducers: builder => {
  //   builder.addCase(incrementBy, (state, action) => {
  //     // action is inferred correctly here with `action.payload` as a `number`
  //     return state + action.payload
  //   })
  // }
})
```

## 参考链接

1. [Redux Toolkit 官网](https://redux-toolkit.js.org/tutorials/basic-tutorial)

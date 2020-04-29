---
layout: blog
front: true
comments: True
flag: react
background: green
category: 前端
title:  Redux Toolkit
date:   2020-04-28 14:11:00 GMT+0800 (CST)
UPdate: 2020-04-29 17:56:00 GMT+0800 (CST)
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

### configureStore

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
// 当重新自定义中间件时，有需要的话，要手动把默认中间件添加进来
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

### createAction

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

### createReducer

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

>  Since the "lookup table" approach is popular, Redux Toolkit includes a createReducer function similar to the one shown in the Redux docs. However, our createReducer utility has some special "magic" that makes it even better. It uses the **Immer** library internally, which lets you write code that "mutates" some data, but actually applies the updates immutably. This makes it effectively impossible to accidentally mutate state in a reducer.

### createSlice

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

### createSelector

[**createSelector**](https://github.com/reduxjs/reselect) 其实是 re-export 自 **Reselect** 库，用来创建 `memoized selectors`。它带来的好处有以下几点:

* Selectors can compute derived data, allowing Redux to store the minimal possible state.
* Selectors are efficient. A selector is not recomputed unless one of its arguments changes.
* Selectors are composable. They can be used as input to other selectors.

```JS
import { createSelector } from 'reselect'

const shopItemsSelector = state => state.shop.items
const taxPercentSelector = state => state.shop.taxPercent

const subtotalSelector = createSelector(
  shopItemsSelector,
  items => items.reduce((acc, item) => acc + item.value, 0)
)

const taxSelector = createSelector(
  subtotalSelector,
  taxPercentSelector,
  (subtotal, taxPercent) => subtotal * (taxPercent / 100)
)

export const totalSelector = createSelector(
  subtotalSelector,
  taxSelector,
  (subtotal, tax) => ({ total: subtotal + tax })
)

let exampleState = {
  shop: {
    taxPercent: 8,
    items: [
      { name: 'apple', value: 1.20 },
      { name: 'orange', value: 0.95 },
    ]
  }
}

console.log(subtotalSelector(exampleState)) // 2.15
console.log(taxSelector(exampleState))      // 0.172
console.log(totalSelector(exampleState))    // { total: 2.322 }
```

## 接入 Typescript

Redux Toolkit 本身由 TS 编写，它的 API 设计也更贴合 TS 的应用。我们还是按照上一节的顺序来分别看下:

一、configueStore state

```JS
import { combineReducers } from '@reduxjs/toolkit'
// 提前定义 rootReducer
const rootReducer = combineReducers({})
// 提取对应 ReturnType
export type RootState = ReturnType<typeof rootReducer>
```

如果没有提前定义 rootReducer 的话，而是通过 createSlice 直接将 reducer 给到 configueStore，写法将会有一点变化:

```JS
import { configureStore } from '@reduxjs/toolkit'
// ...
const store = configureStore({
  reducer: {
    one: oneSlice.reducer,
    two: twoSlice.reducer
  }
})
export type RootState = ReturnType<typeof store.getState>
```

二、configueStore dispatch

要想获取 dispatch 的类型，可以在创建 store 的时候提取:

```JS
const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
// Export a hook that can be resused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>()
]
```

三、createAction

```JS
// 接收的参数
export interface IActionParams {
  id: number
  level: '1' | '2' | '3'
}

const getListData = createAction<IActionParams>('reducerName/getListData')
```

四、createSlice

```JS
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CurrentDisplay {
  displayType: 'issues' | 'comments'
  issueId: number | null
}

interface CurrentDisplayPayload {
  displayType: 'issues' | 'comments'
  issueId?: number
}

interface CurrentRepo {
  org: string
  repo: string
}

type CurrentDisplayState = {
  page: number
} & CurrentDisplay & CurrentRepo

let initialState: CurrentDisplayState = {
  org: 'rails',
  repo: 'rails',
  page: 1,
  displayType: 'issues',
  issueId: null
}

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    // We don't have to declare a type for state, because createSlice already knows that
    // this should be the same type as our initialState: the CurrentDisplayState type.
    displayRepo(state, action: PayloadAction<CurrentRepo>) {
      const { org, repo } = action.payload
      state.org = org
      state.repo = repo
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setCurrentDisplayType(state, action: PayloadAction<CurrentDisplayPayload>) {
      const { displayType, issueId = null } = action.payload
      state.displayType = displayType
      state.issueId = issueId
    }
  }
})

export const {
  displayRepo,
  setCurrentDisplayType,
  setCurrentPage
} = issuesDisplaySlice.actions

export default issuesDisplaySlice.reducer
```

如果 reducers 里面定义太多，为了避免混乱，我们也可以提取出来，定义类型为 **CaseReducer**:

```JS
type State = number
const increment: CaseReducer<State, PayloadAction<number>> = (state, action) => state + action.payload

createSlice({
  name: 'test',
  initialState: 0,
  reducers: {
    increment,
  }
})
```

如果想提取和复用公共的 reducer 逻辑，我们则需要用到 [**higher-order reducers**](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic#customizing-behavior-with-higher-order-reducers)。我们直接来看个示例:

```JS
interface GenericState<T> {
  data?: T
  status: 'loading' | 'finished' | 'error'
}

const createGenericSlice = <
  T,
  Reducers extends SliceCaseReducers<GenericState<T>>
>({
  name = '',
  initialState,
  reducers
}: {
  name: string
  initialState: GenericState<T>
  reducers: ValidateSliceCaseReducers<GenericState<T>, Reducers>
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      start(state) {
        state.status = 'loading'
      },
      /**
       * If you want to write to values of the state that depend on the generic
       * (in this case: `state.data`, which is T), you might need to specify the
       * State type manually here, as it defaults to `Draft<GenericState<T>>`,
       * which can sometimes be problematic with yet-unresolved generics.
       * This is a general problem when working with immer's Draft type and generics.
       */
      success(state: GenericState<T>, action: PayloadAction<T>) {
        state.data = action.payload
        state.status = 'finished'
      },
      ...reducers
    }
  })
}

const wrappedSlice = createGenericSlice({
  name: 'test',
  initialState: { status: 'loading' } as GenericState<string>,
  reducers: {
    magic(state) {
      state.status = 'finished'
      state.data = 'hocus pocus'
    }
  }
})
```

## immer

上面介绍 createReducer 的时候已经提到，RTK 为 reducer 集成了 [**immer**](https://immerjs.github.io/immer/docs/introduction) 来有效处理不可变数据。它的理念基于 **copy-on-write**，即写入时复制，可以显著减少未修改副本的资源消耗，同时为资源修改操作增加少量开销。`Mobx` 的作者也是 [Michel Weststrate](https://github.com/mweststrate)，强无敌 👍。

具体操作就是，你的所有修改将应用到临时的 `draftState`，它其实是 `currentState` 的代理。一旦所有数据变化已完成，immer 就会根据 draftState 的变化来创建 `nextState`。这意味着你可以通过简单地修改数据而与数据进行交互，同时保留不可变数据的所有优点。

![immer draftState](https://immerjs.github.io/immer/img/immer.png)

> **Freeze** indicates that the state tree has been frozen after producing it. This is a development best practice, as it prevents developers from accidentally modifying the state tree.

让我们看个简单的官方栗子，是不是很简洁:

```JS
import produce from "immer"

const baseState = [{
  todo: "Learn typescript",
  done: true
}, {
  todo: "Try immer",
  done: false
}]

const nextState = produce(baseState, draftState => {
  draftState.push({ todo: "Tweet about it" })
  draftState[1].done = true
})
```

![immer performance](https://immerjs.github.io/immer/img/performance.png)

> 之前也有介绍 [**immutable.js**](( {{site.url}}/2018/08/14/immutable.html )) 的文章，可以比较下两者具体的差异。immer 相较之下更轻便，学习成本低，与 TS 结合更好，更重要的是可以直接操作原生数据结构，可以抛弃 fromJS 和 toJS 大法，真香 🍚。

### produce

为了防止数据被无意间修改，库一般都不会暴露数据给外界，而是需要通过特定的 API 来操作(例如 immutable.js 中的 get、getIn、set、setIn 等)，而 immer 则是通过 [**Proxy**](2018/03/17/es6-proxy-reflect.html) 来实现的。Proxy 在我们日常工作中其实很少用到，简而言之，它用于修改某些操作的默认行为，可以对外界的访问进行过滤和改写。我们先看看核心方法 **produce** 的实现:

```JS
export class Immer {
  produce(base, recipe, patchListener) {
    // ...
    // Only plain objects, arrays, and "immerable classes" are drafted.
    if (isDraftable(base)) {
      const scope = ImmerScope.enter() // 生成一个 ImmerScope 的实例，即 scope
      const proxy = this.createProxy(base) // 基于 baseState 创建 proxy
      let hasError = true
      try {
        result = recipe(proxy) // recipe 是我们对数据进行操作的方法，实际上我们操作的是代理
        hasError = false
      } finally {
        // finally instead of catch + rethrow better preserves original stack
        if (hasError) scope.revoke()
        else scope.leave()
      }
      if (result instanceof Promise) {
        return result.then(
          result => {
            scope.usePatches(patchListener)
            return this.processResult(result, scope)
          },
          error => {
            scope.revoke()
            throw error
          }
        )
      }
      scope.usePatches(patchListener)
      return this.processResult(result, scope)
    } else {
      result = recipe(base)
      if (result === NOTHING) return undefined
      if (result === undefined) result = base
      this.maybeFreeze(result, true) // 通过 Object.freeze 冻结对象
      return result
    }
  },
  processResult(result, scope) {
    const baseDraft = scope.drafts[0]
    const isReplaced = result !== undefined && result !== baseDraft
    this.willFinalize(scope, result, isReplaced)
    if (isReplaced) {
      if (baseDraft[DRAFT_STATE].modified) {
        scope.revoke()
        throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.") // prettier-ignore
      }
      if (isDraftable(result)) {
        // Finalize the result in case it contains (or is) a subset of the draft.
        // Finalize a draft, returning either the unmodified base state or a modified copy of the base state.
        // 最终会调用 generatePatches(state, path, scope.patches, scope.inversePatches)
        result = this.finalize(result, null, scope)
        this.maybeFreeze(result)
      }
      if (scope.patches) {
        scope.patches.push({
          op: "replace",
          path: [],
          value: result
        })
        scope.inversePatches.push({
          op: "replace",
          path: [],
          value: baseDraft[DRAFT_STATE].base
        })
      }
    } else {
      // Finalize the base draft.
      result = this.finalize(baseDraft, [], scope)
    }
    scope.revoke()
    if (scope.patches) {
      // 用户根据传递的 patchListener 接收 patches 数据，从而自定义一些操作
      scope.patchListener(scope.patches, scope.inversePatches)
    }
    return result !== NOTHING ? result : undefined
  },
  finalize(draft, path, scope) {
    // ...
    if (!state.finalized) {
      state.finalized = true
      this.finalizeTree(state.draft, path, scope)
      // ...
    }
  },
  finalizeTree(root, rootPath, scope) {
    const state = root[DRAFT_STATE]
    if (state) {
      if (!this.useProxies) {
        // Create the final copy, with added keys and without deleted keys.
        state.copy = shallowCopy(state.draft, true)
      }
      root = state.copy
    }

    const needPatches = !!rootPath && !!scope.patches
    const finalizeProperty = (prop, value, parent) => {
      if (value === parent) {
        throw Error("Immer forbids circular references")
      }

      // In the `finalizeTree` method, only the `root` object may be a draft.
      const isDraftProp = !!state && parent === root

      if (isDraft(value)) {
        const path =
          isDraftProp && needPatches && !state.assigned[prop]
            ? rootPath.concat(prop)
            : null

        // Drafts owned by `scope` are finalized here.
        value = this.finalize(value, path, scope)

        // Drafts from another scope must prevent auto-freezing.
        if (isDraft(value)) {
          scope.canAutoFreeze = false
        }

        // Preserve non-enumerable properties.
        if (Array.isArray(parent) || isEnumerable(parent, prop)) {
          parent[prop] = value
        } else {
          Object.defineProperty(parent, prop, {value})
        }

        // Unchanged drafts are never passed to the `onAssign` hook.
        if (isDraftProp && value === state.base[prop]) return
      }
      // Unchanged draft properties are ignored.
      else if (isDraftProp && is(value, state.base[prop])) {
        return
      }
      // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
      else if (isDraftable(value) && !Object.isFrozen(value)) {
        each(value, finalizeProperty)
        this.maybeFreeze(value)
      }

      if (isDraftProp && this.onAssign) {
        this.onAssign(state, prop, value)
      }
    }
    // 对 root 的属性和值进行一些列操作
    each(root, finalizeProperty)
    return root
  }
}
```

> immer createProxy 方法源码[可以参考这里](https://github.com/immerjs/immer/blob/9064d26aaaa4e6d5cc447b1b140f4c891286e813/src/proxy.js) 👈

我们可以看到 produce 做了最主要的三件事:

1. 调用 `createProxy` 基于 baseState 来创建代理 proxy
2. 调用传入的第二个参数 `recipe`，入参为 proxy。进行拦截读写操作
3. 调用 `processResult` 方法获取最终结果并返回给用户，核心操作为 `finalize` 方法

### scope / patches

上面我们可以看到一个名词 scope，每个 scope 代表了一次 `produce` 的调用，我们来看看它的实现:

```JS
import { DRAFT_STATE } from "./common"

/** Each scope represents a `produce` call. */
export class ImmerScope {
  constructor(parent) {
    this.drafts = []
    this.parent = parent

    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    this.canAutoFreeze = true

    // To avoid prototype lookups:
    this.patches = null
  }
  usePatches(patchListener) {
    if (patchListener) {
      this.patches = []
      this.inversePatches = []
      this.patchListener = patchListener
    }
  }
  revoke() {
    this.leave()
    this.drafts.forEach(revoke)
    this.drafts = null // Make draft-related methods throw.
  }
  leave() {
    if (this === ImmerScope.current) {
      ImmerScope.current = this.parent
    }
  }
}

ImmerScope.current = null
ImmerScope.enter = function() {
  return (this.current = new ImmerScope(this.current))
}

function revoke(draft) {
  draft[DRAFT_STATE].revoke()
}
```

我们继续来看下应用 patches 的实现，实际对应着三种操作，即 `replace、add、remove`:

```JS
export const applyPatches = (draft, patches) => {
  for (const patch of patches) {
    const {path, op} = patch
    const value = clone(patch.value) // used to clone patch to ensure original patch is not modified, see #411

    if (!path.length) throw new Error("Illegal state")

    let base = draft
    for (let i = 0; i < path.length - 1; i++) {
      base = base[path[i]]
      if (!base || typeof base !== "object")
      throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/")) // prettier-ignore
    }

    const key = path[path.length - 1]
    switch (op) {
      case "replace":
        // if value is an object, then it's assigned by reference
        // in the following add or remove ops, the value field inside the patch will also be modifyed
        // so we use value from the cloned patch
        base[key] = value
        break
      case "add":
        if (Array.isArray(base)) {
          // TODO: support "foo/-" paths for appending to an array
          base.splice(key, 0, value)
        } else {
          base[key] = value
        }
        break
      case "remove":
        if (Array.isArray(base)) {
          base.splice(key, 1)
        } else {
          delete base[key]
        }
        break
      default:
        throw new Error("Unsupported patch operation: " + op)
    }
  }
  return draft
}
```

> During the run of a producer, Immer can record all the patches that would replay the changes made by the reducer. This is a very powerful tool if you want to fork your state temporarily and replay the changes to the original.

### 一些注意点

当然了还有一些细节需要我们关注的，比如我们在操作 draftState 的时候，不同返回值 immer 的处理会稍不同，我们其实从源码上就能看出来:

```JS
import produce, { nothing } from "immer"

const state = {
  hello: "world"
}

produce(state, draft => {})
produce(state, draft => undefined)
// Both return the original state: { hello: "world"}

produce(state, draft => nothing)
// Produces a new state, 'undefined'
```

而且我们在操作的时候不要去重定义 draft，如 `draft = myCoolNewState`，而是要去修改 draft 或者返回一个新的 state。还有一点就是尽量地减少 produce 的调用，毕竟都会去重新创建 Proxy:

```JS
// bad
for (let x of y) produce(base, d => d.push(x))

// good
produce(base, d => { for (let x of y) d.push(x) })
```

> 更多注意点可以看[官方文档里的 pitfalls](https://immerjs.github.io/immer/docs/pitfalls) 👈

## 参考链接

1. [Redux Toolkit 官网](https://redux-toolkit.js.org/tutorials/basic-tutorial)
2. [Immer 全解析](https://juejin.im/post/5c70e50f51882562276c47ef) By Sheepy

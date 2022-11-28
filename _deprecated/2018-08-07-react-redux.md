---
layout: blog
front: true
comments: True
flag: Redux
background: green
category: 前端
title:  Redux & Redux-Saga
date:   2018-08-07 18:15:00 GMT+0800 (CST)
update: 2020-11-23 15:32:00 GMT+0800 (CST)
background-image: /style/images/smms/redux.webp
tags:
- React
---
# {{ page.title }}

## Redux & Flux

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。和 Flux 一样，Redux 规定，将模型的更新逻辑全部集中于一个特定的层(Flux 里的 **store**，Redux 里的 **reducer**)。两者都不允许程序直接修改数据，而是用一个叫作 "**action**" 的普通对象来对更改进行描述。而不同于 Flux ，Redux 并没有 **dispatcher** 的概念。原因是它依赖纯函数来替代事件处理器。纯函数构建简单，也不需额外的实体来管理它们。Flux 常常被表述为 `(state, action) => state`。从这个意义上说，Redux 无疑是 Flux 架构的实现，且得益于纯函数而更为简单。

> Redux 和 React 之间没有关系。Redux 支持 React、Angular、Ember、jQuery 甚至纯 JavaScript。尽管如此，Redux 还是和 React 和 Deku 这类库搭配起来用最好，因为这类库允许你以 state 函数的形式来描述界面，Redux 通过 action 的形式来发起 state 变化。

## 概念

![redux-pattern-diagram]( {{site.url}}/style/images/smms/redux-pattern-diagram.webp )

### Action

**Action** 是把数据从应用传到 store 的有效载荷。它是 store 数据的唯一来源。一般通过 `store.dispatch()` 将 action 传到 store。一般约定 action 是一个拥有 **type** 属性的对象。然后按 type 决定如何处理 action。当然，action 依旧可以拥有其他属性，你可以任意存放想要的数据:

```JS
// action 示例
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

action 可以通过 **action creator** 创建:

```JS
// action creator 就是函数而已...
function addTodo (text) {
  return {
    type: 'ADD_TODO',
    text
  }
}
```

### Reducer

**Reducers** 函数是 action 的订阅者，指定了应用状态的变化如何响应 actions 并发送到 store 的，记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 **state**。在 Redux 应用中，所有的 state 都被保存在一个单一对象中，一个 state 对应一个 view，如下:

```JS
// state
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

现在我们已经确定了 state 对象的结构，就可以开始开发 reducer。reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state : `(previousState, action) => newState`。需要谨记 reducer 是[纯函数](https://zh.wikipedia.org/wiki/%E7%BA%AF%E5%87%BD%E6%95%B0)，不要执行有副作用的操作，如 API 请求和路由跳转。

```JS
export default (state = 0, action) => { // 首次执行时，state 为 undefined，需要定义初始值
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state // 默认返回传入的旧 state
  }
}
```

**切记不能修改 state**，否则会报错。此时应当采用拷贝或者直接使用 immutable 库或 rtk 的 immer 库:

```JSX
// 不能修改 state
function reducer (state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
  // 或者 immutable
  return state.set('thingToChange', action.counter)
}
```

一个 reducer 可以处理很多的 action，但维护将变得艰难。多个 reducer 的合并可以使用 **combineReducers()**:

```JS
// 在这种多个 reducer 的模式下，我们可以让每个 reducer 只处理整个应用的部分 state 。
var userReducer = function (state = {}, action) {
  console.log('userReducer was called with state', state, 'and action', action)

  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    // etc.
    default:
      return state;
  }
}
var itemsReducer = function (state = [], action) {
  console.log('itemsReducer was called with state', state, 'and action', action)

  switch (action.type) {
    case 'ADD_ITEM':
      return [
        ...state,
        action.item
      ]
    // etc.
    default:
      return state;
  }
}
```

```JS
import { createStore, combineReducers } from 'redux'

var reducer = combineReducers({
    user: userReducer,
    items: itemsReducer
})
var store_0 = createStore(reducer)

// 创建并发送一个 action
var setNameActionCreator = function(name) {
  return {
    type: 'SET_NAME',
    name: name
  }
}

store_0.dispatch(setNameActionCreator('bob'))
// 输出：
// userReducer was called with state {} and action { type: 'SET_NAME', name: 'bob' }
// itemsReducer was called with state [] and action { type: 'SET_NAME', name: 'bob' }
console.log('store_0 state after action SET_NAME:', store_0.getState())
// 输出：
// store_0 state after action SET_NAME: { user: { name: 'bob' }, items: [] }
```

### Store

store 由 `createStore(reducer， defaultState)` 这个方法生成，在整个应用中是唯一的，功能如下:

* 维持应用的 state；
* 提供 getState() 方法获取 state；
* 提供 dispatch(action) 方法更新 state；
* 通过 subscribe(listener) 注册监听器，一旦 state 发生变化，就自动执行这个函数;
* 通过 subscribe(listener) 返回的函数注销监听器

![react-redux-store]( {{site.url}}/style/images/smms/react-redux-store.webp )

```JS
// 整个流程可总结为: 用户发出 Action，Reducer 函数算出新的 State，View 重新渲染
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import Counter from './components/Counter'
import counter from './reducers'

const store = createStore(counter) // counter 属于 reducer
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
  <Counter
    value={store.getState()}
    onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
  />,
  rootEl
)

render()
store.subscribe(render) // 监听并修改视图
```

当需要把多个 store 增强器依次执行的时候，可以使用 [**compose**](https://www.kancloud.cn/allanyu/redux-in-chinese/82435) 方法，从右到左把接收到的函数合成后的最终函数。compose 做的只是让你不使用深度右括号的情况下来写深度嵌套的函数:

```JS
const store = compose()(createStore)(counter)
```

对上述 action、reducer 和 store 三者关系的一个整理:

![react-redux-action]( {{site.url}}/style/images/smms/react-redux-action.webp )

### 异步 Action & 中间件

#### applyMiddlewares()

**applyMiddlewares** 方法将所有中间件组成一个数组，依次执行。比如执行日志中间件:

```JS
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
  reducer,
  applyMiddleware(logger)
);
```

#### 异步 Redux-Thunk

同步操作只要发出一种 Action 即可，异步操作的差别是它要发出三种 Action。

* 一种通知 reducer 请求开始的 Action
* 一种通知 reducer 请求成功的 Action
* 一种通知 reducer 请求失败的 Action

Action 的设置无非两种情况:

```JS
// 同一种 type，但不同 status
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }

// 或者不同 type
{ type: 'FETCH_POSTS_REQUEST' }
{ type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
{ type: 'FETCH_POSTS_SUCCESS', response: { ... } }
```

异步操作的 state 也要进行改造，反映不同的操作状态:

```JS
let state = {
  // ...
  isFetching: true, // 表示是否在抓取数据
  didInvalidate: true, // 表示数据是否过时
  lastUpdated: 'xxxxxxx' // 表示上一次更新时间
};
```

整个流程思路即:

1、操作开始时，送出一个 action，触发 state 更新为"正在操作"状态，view 重新渲染
2、操作结束后，再送出一个 action，触发 state 更新为"操作结束"状态，view 再一次重新渲染

接下来通过中间件 **redux-thunk** 进行异步 action 的创建，具体可查看下节异步示例:

```JS
// 虽然内部操作不同，你可以像其它 action 创建函数 一样使用它：store.dispatch(fetchPosts('reactjs'))
// store.dispatch 方法正常情况下，参数只能是对象，不能是函数，就要使用中间件 redux-thunk
export function fetchPosts(subreddit) {

  // Thunk middleware 知道如何处理函数。
  // 这里把 dispatch 方法通过参数的形式传给函数，以此来让它自己也能 dispatch action。

  return function (dispatch) {

    // 首次 dispatch：更新应用的 state 来通知 API 请求发起了。

    dispatch(requestPosts(subreddit))

    // thunk middleware 调用的函数可以有返回值，它会被当作 dispatch 方法的返回值传递。
    // 这个案例中，我们返回一个等待处理的 promise。这并不是 redux middleware 所必须的，但这对于我们而言很方便。

    return fetch(`http://www.subreddit.com/r/${subreddit}.json`)
      .then(
        response => response.json(),
        // 不要使用 catch，因为会捕获在 dispatch 和渲染中出现的任何错误，导致 'Unexpected batch number' 错误。
         error => console.log('An error occurred.', error)
      )
      .then(json =>
        // 可以多次 dispatch！这里，使用 API 请求结果来更新应用的 state。

        dispatch(receivePosts(subreddit, json))
      )
  }
}
```

> 异步建议使用 **redux-saga** 来处理数据的读取。不同于 redux-thunk，你不会再遇到回调地狱了，你可以很容易地测试异步流程并保持你的 action 是干净的。当然我们现在有更多选择，比如 [**redux-observable**](https://redux-observable.js.org/docs/basics/Epics.html)

## React-Redux

我们当然可以直接在 React 中使用 Redux：在最外层容器组件中初始化 store，然后将 state 上的属性作为 props 层层传递下去，最佳的方式是使用 **React-Redux** 提供的 **Provider** 和 **connect** 方法。React-Redux 将所有组件分成两大类：UI 组件（presentational component）和容器组件（container component）。UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。

![react-redux]( {{site.url}}/style/images/smms/react-redux.webp )

### Provider

connect 方法生成容器组件以后，需要让容器组件拿到 state 对象，才能生成 UI 组件的参数。最关键的作用就是在 context 中放入 Redux 的 store，方便子组件获取:

```JSX
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  // 使用的时候容器组件会被包裹在 Provider 组件下面，这样这些组件就可以获得 Provider 挂在 context 上的 state 了
  // Provider 内的任何一个组件（比如这里的 App），如果需要使用 state 中的数据，就必须是「被 connect 过的」组件——使用 connect 方法对「你编写的组件（MyApp）」进行包装后的产物
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

**context** 属于 React 的一个重要属性。被隐式地传递给后代组件(类似于全局变量的作用，所有组件都可以访问):

* React.withContext ：会执行一个指定的上下文信息的回调函数，任何在这个回调函数里面渲染的组件都有这个 context 的访问权限。
* getChildContext ：和 React.withContext 一样的作用，指定的传递给子组件的属性。不过与 React.withContext 写法不同，且要先通过 childContextTypes 来指定类型，不然会产生错误。
* childContextTypes ：声明传递给子组件的属性的数据类型。
* contextTypes ：任何想访问 context 里面的属性的组件都必须显式地指定一个 contextTypes 的属性。如果没有指定该属性，那么组件通过 this.context 访问属性将会出错。

Provider 就是使用了 getChildContext 将 store 绑到 context 上使子元素都可以访问到。通过 context 传递属性的方式要优于通过 props 逐层传递属性的方式。这样可以减少组件之间的直接依赖关系。

### connect

**connect** 负责与 React 的展示组件进行交互，更新。容器组件在使用的时候会被包裹在 Provider 组件下面，这样这些组件就可以获得 Provider 挂在 context 上的 state。connect 作为高阶函数包裹这些容器组件就可以接收到 state，并且可以:

1、将指定 state 和 action 作为 props 绑定到组件上方便调用

2、帮助组件订阅监听 state 的变化

```JSX
import { connect } from 'react-redux'

class MyComp extends Component {
  // ...
}
const Comp = connect(...args)(MyComp);
```

```JSX
// 可以接收四个参数，后两个参数一般省略，不做分析
connect([mapStateToProps], [mapDispatchToProps], [mergeProps],[options])
```

要做 TS 迁移的话，类型检查可以使用 `ConnectedProps<T>`，可以直接[参考官方文档](https://react-redux.js.org/using-react-redux/static-typing):

```JS
// alternately, declare `type Props = Props From Redux & {backgroundColor: string}`
interface Props extends PropsFromRedux {
  backgroundColor: string;
}

const MyComponent = (props: Props) => /* same as above */

const connector = connect(/* same as above*/)

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(MyComponent)
```

#### mapStateToProps()

**mapStateToProps** 将 store 中的数据作为 props 绑定到组件上。接收的第一个参数是我们需要从 Redux 中提取的状态，第二个可选参数是组件本身的 props。不必将 Redux 中所有的 state 数据都传进组件，可以结合 ownProps 进行筛选，传入需要的最少属性。

```JSX
const mapStateToProps = (state, ownProps) => {
  // state 是 {userList: [{id: 0, name: '王二'}]}
  return {
    user: _.find(state.userList, {id: ownProps.userId})
  }
}

class MyComp extends Component {
  static PropTypes = {
    userId: PropTypes.string.isRequired,
    user: PropTypes.object
  };
  
  render(){
    return <div>用户名：{this.props.user.name}</div>
  }
}

const Comp = connect(mapStateToProps)(MyComp);
```

当 state 变化，或者 ownProps 变化的时候，mapStateToProps 都会被调用，计算出一个新的 stateProps。

#### mapDispatchToProps()

**mapDispatchToProps** 将 action 作为 props 绑定到组件上:

```JSX
//将 state.counter 绑定到 props 的 count
const mapStateToProps = state => ({
  count: state.counter
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // 由于 mapDispatchToProps 方法返回了具有 increase 属性和 decrease 属性的对象，这两个属性也会成为 MyComp 的 props
  increase: (...args) => dispatch(actions.increase(...args)),
  decrease: (...args) => dispatch(actions.decrease(...args))
})

class MyComp extends Component {
  render(){
    // 从组件的 props 属性中导入两个方法和一个变量 count
    const {count, increase, decrease} = this.props;

    return (<div>
      <div>计数：{count}次</div>
      <button onClick={increase}>增加</button>
      <button onClick={decrease}>减少</button>
    </div>)
  }
}

const Comp = connect(mapStateToProps， mapDispatchToProps)(MyComp);
```

上面的 state 对象的 key 为 counter，取决于这里的设置:

```JSX
import counter from './crement'
import { combineReducers } from 'redux';
export default combineReducers({
  counter, // 通过 state.counter 访问
})
```

#### QA

> [参考至这里](https://www.cntofu.com/book/4/docs/faq/ReactRedux.md) 👈

##### 为何组件没有被重新渲染

目前来看，**导致组件在 action 分发后却没有被重新渲染，最常见的原因是对 state 进行了直接修改。Redux 期望 reducer 以 “不可变的方式” 更新 state，实际使用中则意味着复制数据，然后更新数据副本**。如果直接返回同一对象，即使你改变了数据内容，Redux 也会认为没有变化。类似的，React Redux 会在 **shouldComponentUpdate** 中对新的 state/props 进行浅层的判等检查，以期提升性能。如果所有的引用都是相同的，则返回 false 从而跳过此次对组件的更新。函数组件已经替换为 **memo**，具体事例可以[参考 react hooks 章节]( {{site.url}}/2019/04/16/react-hooks.html#usecallback--usememo )

需要注意的是，不管何时更新了一个嵌套的值，都必须同时返回上层的任何数据副本给 state 树。如果数据是 state.a.b.c.d，你想更新 d，你也必须返回 c、b、a 以及 state 的拷贝。state 树变化图展示了树的深层变化为何需要改变途经的结点:

![state tree](http://arqex.com/wp-content/uploads/2015/02/trees.png)

“以不可变的方式更新数据” 并不代表你必须使用 immutable.js，我们可以使用类似于 Object.assign() 或者 _.extend() 的方法复制对象， slice() 和 concat() 方法复制数组。当然目前为止，RTK 内置的 immer.js 是更好的选择，具体可以[参考 RTK 章节]( {{site.url}}/2020/04/28/react-redux-toolkit.html#immer )

##### 为何组件频繁的重新渲染

React Redux 采取了很多的优化手段，保证组件直到必要时才执行重新渲染。一种是对 mapStateToProps 和 mapDispatchToProps 生成后传入 connect 的 props 对象进行浅层的判等检查。默认情况下，React Redux 使用 === 比较（“浅相等性”检查），在返回对象的每个字段上确定从 mapStateToProps 返回的对象的内容是否不同。如果任何字段已更改，则将重新渲染您的组件，以便它可以将更新的值作为 prop 接收。请注意，修改并返回相同引用的对象是一个常见错误，它可能导致组件在预期时无法重新呈现。总结如下:

|  | `(state) => stateProps` | `(state, ownProps) => stateProps` |
| ------------ | ------- | ----- |
| mapStateToProps runs when: | store state changes | store state changes or any field of ownProps is different |
| component re-renders when: | any field of stateProps is different | any field of stateProps is different or any field of ownProps is different |

> it calls `store.getState()` and checks to see if `lastState === currentState`. If the two state values are identical by reference, then it will not re-run your mapStateToProps function

**shallowEqual** 会比较 `Object.keys(state \| props)` 的长度是否一致，每一个 key 是否两者都有，并且是否是同一个引用。如果不是同一个引用的话，自然是判断失效。但是如果返回新的对象或数组引用，即使数据实际上相同，这也会导致组件重新渲染。常见的一些会导致创建新的对象或数组引用的方式:

1. Creating new arrays with `someArray.map()` or `someArray.filter()`
1. Merging arrays with `array.concat`
1. Selecting portion of an array with `array.slice`
1. Copying values with `Object.assign`
1. Copying values with the spread operator `{ ...oldState, ...newData }`

这种额外的重新渲染也可以避免，使用 reducer 将对象数组保存到 state，**利用 reselect 缓存映射的数组**，或者在组件的 shouldComponentUpdate 方法中，采用 `_.isEqual` 等对 props 进行更深层次的比较。注意在自定义的 shouldComponentUpdate() 方法中不要采用了比重新渲染本身更为昂贵的实现。可以使用分析器评估方案的性能。

对于独立的组件，也许你想检查传入的 props。一个普遍存在的问题就是在 render 方法中绑定父组件的回调，比如 `<Child onClick={this.handleClick.bind(this)} />`。这样就会在每次父组件重新渲染时重新生成一个函数的引用。所以只在父组件的构造函数中绑定一次回调是更好的做法，可以使用 **useCallback** 等，具体也可以[参考 react hooks 章节]( {{site.url}}/2019/04/16/react-hooks.html#usecallback--usememo )。

### Hooks

#### useSelector

> 好消息好消息，在 React hooks 火遍大江南北之后，React Redux 也终于抛弃了 HOC connect，提供了几个实用的钩子，下面就来简单介绍下，详细可以[参考下文档](https://react-redux.js.org/api/hooks#useselector-examples) 👈

这个 selector 方法类似于上述的 connect 的 mapStateToProps 参数的概念，并且 useSelector 会订阅 store, 当 action 被 dispatched 的时候，会运行 selector。两者有以下的一些差异:

* selector 会返回任何值作为结果，并不仅限于对象
* 对于 mapState 而言，所有值都会合并成一个对象进行返回，这个对象无所谓是新引用还是旧引用，因为 connect 都会一一做比较；而对于 useSelector 默认使用 === (严格相等)进行相等性检查，每次返回新的对象都会触发新的渲染，当然如果要使用浅比较的话，可以传入第二个参数: `useSelector(selector, shallowEqual)`
* selector 不会接收 ownProps 参数，但是，可以通过闭包或使用柯里化 selector 来使用 props
* 每次组件渲染都会生成一个 selector 实例，只要是不用维护组件内部 state，都是 ok 的。否则推荐使用 `memoizing selectors` （如 reselect）

```JS
const result: any = useSelector(selector: Function, equalityFn?: Function)
```

为啥默认使用 ===，而不是 shallowEqual，我们不妨来做个组件渲染的对比:

```JS
// https://stackoverflow.com/questions/58212159/strict-equality-versus-shallow-equality-checks-in-react-redux
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  keyA: state.reducerA.keyA, // string
  keyB: state.reducerB.keyB,
})
export default connect(mapStateToProps)(MyComponent)
```

我们可以看到，mapStateToProps 返回了一组拼接的对象，只要 store 变化就会触发，无论是否修改 keyA 或 keyB，都需要通过浅比较来判断是否需要渲染（当然如果 keyA 和 keyB 都没改变的话，不用触发重新渲染，但是浅比较还是依然执行的），我们改造下:

```JS
import { useSelector } from 'react-redux'

function MyComponent(props) {
  const keyA = useSelector(state => state.reducerA.keyA)
  const keyB = useSelector(sate => state.reducerB.keyB)
  // ...
}
```

我们可以看到，keyA 和 keyB 都可以写成独立的，不再是一个拼接的对象，从这一角度来讲，useSelector 默认用 === 来比较的话更适合。如果我们需要引入多个 selector 怎么办，目前有以下三种方式:

* **多次调用 useSeletor** - 就像上面展示的，如果我们要用多个 selector 值，没关系，多次调用 useSelector 都会创建 redux store 的单个订阅。由于 react-redux v7 版本使用的 react 的批量(batching)更新行为，同个组件中，多次 useSelector 返回的值只会重新渲染一次。
* **使用 memoized selector** - 我们也可以借助之前讲到的 reselect 库，可以将数据一并处理并统一返回单个 memoized selector。使用时必须考虑多个组件实例且需要获取组件 props 的情况，具体可以参考 [reselect 章节]( {{site.url}}/2020/04/28/react-redux-toolkit.html#createselector--reselect )
* **使用 shallowEqual** - 仍旧返回一个合并对象，但是可以传入第二个参数: `useSelector(selector, shallowEqual)`

这里也举个例子:

```JS
import React from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const selectNumOfTodosWithIsDoneValue = createSelector(
  state => state.todos,
  (_, isDone) => isDone, // 依赖于组件 props
  (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
)

export const TodoCounterForIsDoneValue = ({ isDone }) => {
  const NumOfTodosWithIsDoneValue = useSelector(state =>
    selectNumOfTodosWithIsDoneValue(state, isDone)
  )

  return <div>{NumOfTodosWithIsDoneValue}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <TodoCounterForIsDoneValue isDone={true} />
    </>
  )
}
```

当这个 selector 在多个组件实例内运行的时候，我们必须要保证在每个组件实例中获取自己的 selector 实例，改造如下:

```JS
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const makeNumOfTodosWithIsDoneSelector = () =>
  createSelector(
    state => state.todos,
    (_, isDone) => isDone,
    (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
  )

export const TodoCounterForIsDoneValue = ({ isDone }) => {
  const selectNumOfTodosWithIsDone = useMemo(makeNumOfTodosWithIsDoneSelector, [])

  const numOfTodosWithIsDoneValue = useSelector(state =>
    selectNumOfTodosWithIsDone(state, isDone)
  )

  return <div>{numOfTodosWithIsDoneValue}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <TodoCounterForIsDoneValue isDone={true} />
      <span>Number of unfinished todos:</span>
      <TodoCounterForIsDoneValue isDone={false} />
    </>
  )
}
```

#### useDispatch

我们同样可以利用 useDispatch 来分发 action，在使用的时候注意利用 `useCallback` 来避免不必要的渲染:

```JS
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  const incrementCounter = useCallback(
    () => dispatch({ type: 'increment-counter' }),
    [dispatch]
  )

  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onIncrement={incrementCounter} />
    </div>
  )
}

export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Increment counter</button>
))
```

## Redux-Saga

**redux-saga** 是一个用于管理应用程序 **Side Effect**(副作用，例如异步获取数据，访问浏览器缓存等)的库，它的目标是让副作用管理更容易，执行更高效，测试更简单，在处理故障时更容易。redux-saga 使用了 ES6 的 **Generator** 功能，让异步的流程更易于读取，写入和测试。可以想像为，一个 saga 就像是应用程序中一个单独的线程，它独自负责处理副作用。 redux-saga 是一个 redux 中间件，意味着这个线程可以通过正常的 redux action 从主应用程序启动，暂停和取消，它能访问完整的 redux state，也可以 dispatch redux action。

### createSagaMiddleware()

```JS
// 创建一个 saga 中间件并连接至 Redux Store
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { helloSaga } from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// 启动 Generators，参数必须是 Generator function
sagaMiddleware.run(helloSaga)
```

### Saga 辅助函数

redux-saga 提供了一些辅助函数，包装了一些内部方法，用来在一些特定的 action 被发起到 Store 时派生任务，常用的两个辅助函数为:

* **takeEvery** - 是一个使用 take 和 fork 构建的高级 API。每次指定 action 被发起时，来启动一个新的 saga 任务
* **takeLatest** - 同上，但会自动取消之前所有已经启动但仍在执行中的 saga 任务。

```JS
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from '...'

// 创建异步任务，将在 USER_FETCH_REQUESTED action 被 dispatch 时调用
function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId); // call 属于声明式调用，创建一个纯文本对象描述函数调用
    yield put({type: "USER_FETCH_SUCCEEDED", user: user}); // put 用于创建 dispatch Effect
  } catch (e) {
    yield put({type: "USER_FETCH_FAILED", message: e.message});
  }
}

function* watchFetchData() {
  yield* takeEvery("FETCH_REQUESTED", fetchData)
}

// 上面 generator 函数等价于
function* watchFetchData() {
  while (true) {
    yield take('FETCH_REQUESTED');
    yield fork(fetchData);
  }
}

function* mySaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
}
```

### Effect 创建器

redux-saga 库提供了很多创建 effect 的函数，常用的有以下这些，更多[参考这里](https://redux-saga-in-chinese.js.org/docs/api/):

* **put**(action)
* **call**(fn, ...args)
* **fork**(fn, ...args)
* **cancel**(...tasks)
* **take**(pattern) - 监听未来的 action
* **select**(selector, ...args)

1、**put**

创建一个 Effect 描述信息，用来命令 middleware 向 Store 发起一个 action。 这个 effect 是非阻塞型的，并且所有向下游抛出的错误（例如在 reducer 中），都不会冒泡回到 saga 当中:

```JS
yield put({type: "USER_FETCH_SUCCEEDED", user: user});
```

2、**call**

创建一个 Effect 描述信息，用来命令 middleware 以参数 args 调用函数 fn，fn 即可以是一个 普通 函数，也可以是一个 Generator 函数。call 函数也是**阻塞** effect:

```JS
const user = yield call(Api.fetchUser, action.payload.userId);
```

类似于 `Promise.all` 同时执行多个任务:

```JS
import { call } from 'redux-saga/effects'

// effects 将会同步执行。generator 会被阻塞直到所有的 effects 都执行完毕，或者当一个 effect 被拒绝
const [users, repos] = yield [
  call(fetch, '/users'),
  call(fetch, '/repos')
]
```

3、**fork**

fork 类似于 call，可以用来调用普通函数和 Generator 函数。不过，fork 的调用是**非阻塞**的，Generator 不会在等待 fn 返回结果的时候被 middleware 暂停；相反，它在 fn 被调用时便会立即恢复执行:

```JS
export default function* rootSaga() {
  // 下面的四个 Generator 函数会一次执行，不会阻塞执行
  yield fork(addItemFlow)
  yield fork(removeItemFlow)
  yield fork(toggleItemFlow)
  yield fork(modifyItemFLOW)
}
```

4、**cancel**

创建一个 Effect 描述信息，一旦任务被 fork，可以用来中止任务执行:

```JS
function* main() {
  while ( yield take(START_BACKGROUND_SYNC) ) {
    // 启动后台任务
    const bgSyncTask = yield fork(bgSync)

    // 等待用户的停止操作
    yield take(STOP_BACKGROUND_SYNC)
    // 用户点击了停止，取消后台任务，这会导致被 fork 的 bgSync 任务跳进它的 finally 区块
    yield cancel(bgSyncTask)
  }
}
```

在上面的示例中，取消 bgSyncTask 将会导致 Generator 跳进 finally 区块。可使用 `yield cancelled()` 来检查 Generator 是否已经被取消:

```JS
function* saga() {
  try {
    // ...
  } finally {
    if (yield cancelled()) {
      // 只应在取消时执行的逻辑
    }
    // 应在所有情况下都执行的逻辑（例如关闭一个 channel）
  }
}
```

5、**take**

它创建了一个命令对象，告诉 middleware 等待一个特定的 action， Generator 会暂停，直到一个与 pattern 匹配的 action 被发起，才会继续执行下面的语句，也就是说，take 是一个阻塞的 effect。

```JS
function* loginFlow() {
  while (true) {
    yield take('LOGIN')
    // ... perform the login logic
    yield take('LOGOUT')
    // ... perform the logout logic
  }
}
```

6、**select**

创建一个 Effect，用来命令 middleware 在当前 Store 的 state 上调用指定的选择器，如果调用 select 的参数为空(即 yield select())，那么 effect 会取得完整的 state(与调用 `store.getState()` 的结果相同):

```JS
export function* toggleItemFlow() {
  // 通过 select effect 来获取 全局 state上的 `getTodoList` 中的 list
  let tempList = yield select(state => state.getTodoList.list)
}
```

### Effect 组合器

Effect 组合器包含两种方法:

* **race** - 传入的是 effect 的数组，进行"竞赛"
* **all** - 并行地运行多个 Effect，并等待它们全部完成

1、**race**

```JS
import { take, call, race } from `redux-saga/effects`
import fetchUsers from './path/to/fetchUsers'

// 如果 call(fetchUsers) 先 resolve（或 reject），那么 response 将是 fetchUsers 的结果，并且 cancel 将是 undefined，反之同理
function* fetchUsersSaga {
  const [response, cancel] = yield race([
    call(fetchUsers),
    take(CANCEL_FETCH)
  ])
}
```

2、**all**

举个多个 Generator 的栗子，此时可以采用 all 组合器方法一起启动:

```JS
import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects'

function* incrementAsync() {
  yield delay(1000) // 延迟 1s
  yield put({ type: 'INCREMENT' }) // 触发 action
}

function* watchIncrementAsync() { // 在每个 INCREMENT_ASYNC action spawn 一个新的 incrementAsync 任务
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

// notice how we now only export the rootSaga single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}
```

## reduxsauce

[**reduxsauce**](https://github.com/infinitered/reduxsauce) 就是一个 "调味剂"，虽然不是必需品。但有它可以让代码更 "美味"。大家已经看到上面的 reducer 常规写法就是包含篇幅巨大的 switch 语法，看起来比较混乱。先看看它提供的几个 API:

* **createReducer** - 让 reducers 更易于阅读和测试
* **createTypes** - 从字符串中定义你的类型对象
* **createActions** - 同时创建 Action Types 和 Action Creators
* **resettableReducer** - 允许重置 reducers

1、初始化:

```JSX
const INITIAL_STATE = { name: null, age: null }

// 如果使用 immutable
import { fromJS } from 'immutable'
const INITIAL_STATE = fromJS({ name: null, age: null })
```

2、运行

```JSX
const sayHello = (state = INITIAL_STATE, action) => {
  const { age, name } = action
  return { ...state, age, name }
}
```

3、触发

在 redux 中，reducers 会被 action 触发，通过 `action.type` 上的 switch 所驱动。现在只需要一个简单的对象，将所有 actions 映射到 reducer 函数上:

```JSX
import Types from './actionTypes'
import { Types as ReduxSauceTypes } from 'reduxsauce'

const HANDLERS = {
  [Types.SAY_HELLO]: sayHello,
  [Types.SAY_GOODBYE]: sayGoodbye,
  [ReduxSauceTypes.DEFAULT]: defaultHandler, // default handler
}
```

4、注入

```JSX
// Injecting Into The Global State Tree
export default createReducer(INITIAL_STATE, HANDLERS)
```

完整的示例如下:

```JSX
// sampleReducer.js
import { createReducer, Types as ReduxSauceTypes } from 'reduxsauce'
import Types from './actionTypes'

// the initial state of this reducer
export const INITIAL_STATE = { error: false, goodies: null }

// the eagle has landed
export const success = (state = INITIAL_STATE, action) => {
  return { ...state, error: false, goodies: action.goodies }
}

// uh oh
export const failure = (state = INITIAL_STATE, action) => {
  return { ...state, error: true, goodies: null }
}

// map our action types to our reducer functions
export const HANDLERS = {
  [Types.GOODS_SUCCESS]: success,
  [Types.GOODS_FAILURE]: failure,
  [ReduxSauceTypes.DEFAULT]: (state = INITIAL_STATE) => state,
}

export default createReducer(INITIAL_STATE, HANDLERS)
```

## redux-logger

[**redux-logger**](https://github.com/evgenyrodionov/redux-logger) 可以用来打印日志，可配置的属性有:

```JS
{
  predicate, // if specified this function will be called before each action is processed with this middleware.
  collapsed, // takes a Boolean or optionally a Function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
  duration = false: Boolean, // print the duration of each action?
  timestamp = true: Boolean, // print the timestamp with each action?

  level = 'log': 'log' | 'console' | 'warn' | 'error' | 'info', // console's level
  colors: ColorsObject, // colors for title, prev state, action and next state: https://github.com/evgenyrodionov/redux-logger/blob/master/src/defaults.js#L12-L18
  titleFormatter, // Format the title used when logging actions.

  stateTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
  actionTransformer, // Transform action before print. Eg. convert Immutable object to plain JSON.
  errorTransformer, // Transform error before print. Eg. convert Immutable object to plain JSON.

  logger = console: LoggerObject, // implementation of the `console` API.
  logErrors = true: Boolean, // should the logger catch, log, and re-throw errors?

  diff = false: Boolean, // (alpha) show diff between states?
  diffPredicate // (alpha) filter function for showing states diff, similar to `predicate`
}
```

```JSX
// store.js
import { compose, createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'

const middlewares = []

if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger')
  middlewares.push(createLogger({
    stateTransformer: (state) => {
      if (state.toJS) return state.toJS()
      const entries = Object.entries(state)
      return entries.reduce((obj, entry) => {
        entry[1].toJS ? (obj[entry[0]] = entry[1].toJS()) : (obj[entry[0]] = entry[1]) // eslint-disable-line
        return obj
      }, {})
    },
  }))
}

const store = compose(
  applyMiddleware(...middlewares),
)(createStore)(rootReducer)

export default store
```

![redux-logger](https://camo.githubusercontent.com/73b5dc54ec615f18746e8472e02d130f79a3cf9f/687474703a2f2f692e696d6775722e636f6d2f43674175486c452e706e67)

## Redux DevTools Extension

[**Redux DevTools Extension**](https://github.com/zalmoxisus/redux-devtools-extension) 是用来调试 redux 应用的插件，可以监测到 state 的变化并提供可视化的功能，以谷歌为例[安装插件](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd):

![Redux DevTools Extension](https://user-images.githubusercontent.com/7957859/48663602-3aac4900-ea9b-11e8-921f-97059cbb599c.png)

在项目中针对最基本的 store:

```JSX
/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
/* eslint-enable */
```

如果有用到中间件的话，修改如下:

```JSX
 import { createStore, applyMiddleware, compose } from 'redux'

+ const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
+ const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
- const store = createStore(reducer, /* preloadedState, */ compose(
    applyMiddleware(...middleware)
  ))
```

上述方法在项目中无需安装第三方库，当然也可以通过安装 `redux-devtools-extension` 来实现:

```JSX
// yarn add -D redux-devtools-extension

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
))
```

## 示例

Redux 运行 Counter 示例，在实际的项目中，推荐使用 React 和更高效的 React-Redux 绑定，[参考 demo](https://github.com/lipeishang/react-redux-connect-demo):

<iframe src="https://codesandbox.io/embed/github/reactjs/redux/tree/master/examples/counter" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

React-Redux 运行 TodoList 示例:

<iframe src="https://codesandbox.io/embed/github/reactjs/redux/tree/master/examples/todos-with-undo" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Redux-thunk 运行 异步请求 示例:

<iframe src="https://codesandbox.io/embed/github/reactjs/redux/tree/master/examples/async" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

更多示例[请参考这里](http://cn.redux.js.org/docs/introduction/Examples.html)。

## Ducks 文件结构

依照[官方组织代码的文章](https://redux.js.org/faq/codestructure)，大致可分为三种文件结构:

* **Rails 风格**
* **应用领域风格(Domain)**
* **鸭子(Ducks)**

1、 **Rails风格**

又可以称为"依照类型(by type)"的集中组织方式。用 actions、constants、reducers、containers、components 等目录区分，文档名可以依功能或应用命名区分，这大概是最常见的一种:

```TEXT
actions/
    CommandActions.js
    UserActions.js
components/
    Header.js
    Sidebar.js
    Command.js
    User.js
    UserProfile.js
    UserAvatar.js
containers/
    App.js
    Command.js
    User.js
reducers/
    index.js
    command.js
    user.js
routes.js
index.js
rootReducer.js
```

2、**应用领域风格(Domain)**

又可以称为"依照功能(by feature)"的集中组织方式。先以功能或应用领域不同的目录区分，目录里有各自的 reducer、action 等等文档，可以用文档命名再作类型区分:

```TEXT
app/
    Header.js
    Sidebar.js
    App.js
    rootReducer.js
    routes.js
product/
    Product.js
    ProductContainer.js
    ProductActions.js
    ProductList.js
    ProductItem.js
    ProductImage.js
    productReducer.js
user/
    User.js
    UserContainer.js
    UserActions.js
    UserProfile.js
    UserAvatar.js
    userReducer.js
```

3、**鸭子(Ducks)**

鸭子是一种模组化 Redux 的代码组识方法，它是把 reducers、constants、action types 与 actions 打包成模组来用。鸭子可以减少很多目录与文档结构:

```TEXT
|_ containers
|_ constants
|_ reducers
|_ actions
```

改用鸭子后就会变成只有两个目录，也就是说把 constants, reducers, actions 都合并为模组就是:

```TEXT
|_ containers
|_ modules
```

鸭子有一些优点，也有一些明显的缺点。它在小型应用中是很理想的作法，你不用为了要加一个功能，至少需要开三、四个代码文档。它仍然有自订的空间，[详细请参考这篇文章](https://hackernoon.com/my-journey-toward-a-maintainable-project-structure-for-react-redux-b05dfd999b5)。

## 参考链接

1. [Redux 中文文档](http://cn.redux.js.org/)
2. [react-guide/redux-tutorial-cn](https://github.com/react-guide/redux-tutorial-cn#redux-tutorial)
3. [Redux 入门教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html) By 阮一峰
4. [react-redux 详解](https://cisy.me/react-redux/) By Cisy
5. [React 实践心得：react-redux 之 connect 方法详解](http://taobaofed.org/blog/2016/08/18/react-redux-connect/) By 叶斋
6. [探索 react-redux 的小秘密](http://www.alloyteam.com/2016/03/10532/)
7. [Redux-Saga 中文文档](https://redux-saga-in-chinese.js.org/)
8. [redux-saga 框架使用详解及 Demo 教程](https://www.jianshu.com/p/7cac18e8d870) By 光强_上海
9. [Github - reduxsauce](https://github.com/infinitered/reduxsauce)
10. [关于 redux 项目结构问题](https://segmentfault.com/q/1010000008187210) By eyesofkids
11. [My journey toward a maintainable project structure for React/Redux](https://hackernoon.com/my-journey-toward-a-maintainable-project-structure-for-react-redux-b05dfd999b5) By Matteo Mazzarolo
12. [Redux 关系图解](https://segmentfault.com/a/1190000011473973) By Yawenina
13. [对 React、Redux、React-Redux 详细剖析](https://juejin.im/post/5b2e3b9451882574934c3c8d) By 段亦心

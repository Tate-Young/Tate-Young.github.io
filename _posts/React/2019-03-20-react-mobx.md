---
layout: blog
front: true
comments: True
flag: mobx
background: green
category: 前端
title:  MobX 简介
date:   2019-03-20 18:54:00 GMT+0800 (CST)
update: 2019-03-21 17:25:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/03/20/5c921f1c29709.png
tags:
- React
- Mobx
---
# {{ page.title }}

## 什么是 MobX

[**MobX**](https://cn.mobx.js.org) 可提供简单、可扩展的状态管理。React 和 MobX 是一对强力组合。React 通过提供机制把应用状态转换为可渲染组件树并对其进行渲染。而 MobX 提供机制来存储和更新应用状态供 React 使用。

## 响应式

![MobX](https://cn.mobx.js.org/flow.png)

> 核心: 通过 action 触发 state 的变化，进而触发 state 的**衍生(Derivations)对象**(computed value & Reactions)。

使用 MobX 和 [**MobX-React**](https://github.com/mobxjs/mobx-react) 将一个应用变成响应式的可归纳为以下三个步骤:

1、**定义状态并使其可观察**

通常支持转换成 observable 的类型有三个，分别是 `Object、Array、Map`，对于原始类型，可以使用 `Obserable.box` 包装:

```JS
import { observable } from 'mobx'

// 转成 observable 对象，通过 toJS 方法可转成普通的 JavaScript 对象
var appState = observable({
  timer: 0
})

// 原始类型
const cityName = observable.box('vanilla')
```

2、**创建视图以响应状态的变化**

```JS
import { observer } from 'mobx-react'

@observer
class TimerView extends React.Component {
  render() {
    return (
      <button onClick={this.onReset.bind(this)}>
        Seconds passed: {this.props.appState.timer}
      </button>
    )
  }

  onReset() {
    this.props.appState.resetTimer()
  }
}

ReactDOM.render(<TimerView appState={appState} />, document.body)
```

3、**更改状态**

**Action** 动作是任一一段可以改变状态的代码，如用户事件、后端数据推送、预定事件等。在 MobX 中可以显式地定义动作，它可以帮你把代码组织的更清晰。 注意 MobX 和 Redux 不同，它并不强制所有 state 的改变必须通过 action 来改变，如果是在严格模式下使用 MobX 的话，则会强制:

```JS
import { action, configure } from 'mobx'

// 强制使用 action 来修改状态
configure({enforceActions: true})

appState.resetTimer = action(function reset() {
  appState.timer = 0
})

setInterval(action(function tick() {
  appState.timer += 1
}), 1000)
```

action 包装/装饰器只会对当前运行的函数作出反应，而不会对当前运行函数所调用的函数（不包含在当前函数之内）作出反应！ 这意味着如果 action 中存在 `setTimeout`、`promise` 的 `then` 或 `async` 语句，并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 action 中。创建异步 action 有几种方式[可以移步这里](#action-异步处理) 👈

> MobX 支持单向数据流，也就是动作改变状态，而状态的改变会更新所有受影响的视图，即 **Action --> State --> Views**

## Observable State 可观察树

MobX 通过使用 `@observable` 装饰器，为现有的数据结构(如对象，数组和类实例)添加了可观察的功能:

```JS
// ESNext
import { observable } from 'mobx'

class Todo {
  id = Math.random()
  @observable title = ''
  @observable finished = false
}
```

```JS
// ES5
import { decorate, observable } from 'mobx'

class Todo {
  id = Math.random()
  title = ''
  finished = false
}
decorate(Todo, {
  title: observable,
  finished: observable
})
```

## Computed Values 计算值

使用 MobX，你可以定义在相关数据发生变化时自动更新的值。通过 `@computed` 装饰器或者利用 `(extend)Observable` 时调用的 `getter / setter` 函数来进行使用:

```JS
// 当添加了一个新的 todo 或者某个 todo 的 finished 属性发生变化时，MobX 会确保 unfinishedTodoCount 自动更新
class TodoList {
  @observable todos = []
  @action addTask(task) { /* ... */ }
  @computed get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length
  }
}
```

> 如果你有一个函数应该自动运行，但不会产生一个新的值，请使用 `autorun`。 其余情况都应该使用 computed。autorun 通常用来执行一些有副作用，如打印日志，更新 UI 等。

## Reactions 反应

**Reaction** 对于如何追踪 observable 赋予了更细粒度的控制，一共可接收三个参数:

* 函数参数 1 - 用来追踪并返回数据作为第二个函数的输入
* 函数参数 2 - 接收两个参数，第一个参数是由 data 函数返回的值。 第二个参数是当前的 reaction，可以用来在执行期间清理 reaction
* 参数3 - options，比如 delay 等，具体可[参考这里](https://cn.mobx.js.org/refguide/reaction.html)

```JS
reaction(() => data, (data, reaction) => { sideEffect }, options?)
```

```JS
const todos = observable([
  {
    title: 'Make coffee',
    done: true,
  },
  {
    title: 'Find biscuit',
    done: false
  }
])

// reaction 的错误用法: 对 length 的变化作出反应, 而不是 title 的变化!
const reaction1 = reaction(
  () => todos.length,
  length => console.log('reaction 1:', todos.map(todo => todo.title).join(', '))
)

// reaction 的正确用法: 对 length 和 title 的变化作出反应
const reaction2 = reaction(
  () => todos.map(todo => todo.title),
  titles => console.log('reaction 2:', titles.join(', '))
)

// autorun 对它函数中使用的任何东西作出反应
const autorun1 = autorun(
  () => console.log('autorun 1:', todos.map(todo => todo.title).join(', '))
)

todos.push({ title: 'explain reactions', done: false })
// 输出:
// reaction 1: Make coffee, find biscuit, explain reactions
// reaction 2: Make coffee, find biscuit, explain reactions
// autorun 1: Make coffee, find biscuit, explain reactions

todos[0].title = 'Make tea'
// 输出:
// reaction 2: Make tea, find biscuit, explain reactions
// autorun 1: Make tea, find biscuit, explain reactions
```

在下面的示例中，reaction3 会对 counter 中的 count 作出反应。 当调用 reaction 时，第二个参数会作为清理函数使用。下面的示例展示了 reaction 只会调用一次:

```JS
const counter = observable({ count: 0 })

// 只调用一次并清理掉 reaction : 对 observable 值作出反应。
const reaction3 = reaction(
  () => counter.count,
  (count, reaction) => {
    console.log('reaction 3: invoked. counter.count = ' + count)
    reaction.dispose()
  }
)

counter.count = 1
// 输出: reaction 3: invoked. counter.count = 1

counter.count = 2
// 输出: (There are no logging, because of reaction disposed. But, counter continue reaction)

console.log(counter.count)
// 输出: 2
```

> 粗略地讲，reaction 是 `computed(expression).observe(action(sideEffect))` 或 `autorun(() => action(sideEffect)(expression))` 的语法糖

## Action 异步处理

和 Redux 不同的是，Mobx 在异步处理上并不复杂，不需要引入额外的类似 `redux-thunk、redux-saga` 这样的库。唯一需要注意的是，在严格模式下，对于异步 action 里的回调，若该回调也要修改 observable 的值，那么该回调也需要绑定 action。

**action.bound** 可以用来自动地将动作绑定到目标对象，注意不要和箭头函数一起使用，箭头函数已经是绑定过的并且不能重新绑定:

```JS
class Store {
  @observable a = 123

  @action
  changeA() {
    this.a = 0
    setTimeout(this.changeB, 1000)
  }
  @action.bound
  changeB() {
    this.a = 1000
  }
}
var s = new Store()
autorun(() => console.log(s.a))
s.changeA()
```

当然也可以直接用 action 包装:

```JS
@action
changeA() {
  this.a = 0
  setTimeout(action('changeB',() => {
    this.a = 1000
  }), 1000)º
}
```

更好的办法是使用工具函数 `runInAction` 来简化操作，runInAction(f) 即是 action(f)() 的语法糖:

```JS
@action
changeA() {
  this.a = 0
  setTimeout(
    runInAction(() => {
      this.a = 1000
    }),
    1000
  )
}
```

## MobX-React

### observer

**observer** 函数/装饰器可以用来将 React 组件转变成响应式组件。 它用 `mobx.autorun` 包装了组件的 render 函数以确保任何组件渲染中使用的数据变化时都可以强制刷新组件:

```JS
import { observer } from 'mobx-react'

// ---- ES5 syntax ----
var TodoView = observer(
  React.createClass({
    displayName: 'TodoView',
    render() {
      return <div>{this.props.todo.title}</div>
    }
  })
)

// ---- ES6 syntax ----
const TodoView = observer(
  class TodoView extends React.Component {
    render() {
      return <div>{this.props.todo.title}</div>
    }
  }
)

// ---- ESNext syntax with decorators ----
@observer
class TodoView extends React.Component {
  render() {
    return <div>{this.props.todo.title}</div>
  }
}

// ---- or just use a stateless component function: ----
const TodoView = observer(({ todo }) => <div>{todo.title}</div>)
```

### Observer 组件

Observer is a React component, which applies observer to an anonymous region in your component. It takes as children a single, argumentless function which should return exactly one React component. The rendering in the function will be tracked and automatically re-rendered when needed. This can come in handy when needing to pass render function to external components (for example the React Native listview), or if you dislike the observer decorator / function:

```JS
// 或者写成 <Observer render={() => <div>{this.props.person.name}</div>} />
class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.person.name}
        <Observer>{() => <div>{this.props.person.name}</div>}</Observer>
      </div>
    )
  }
}

const person = observable({ name: 'John' })

React.render(<App person={person} />, document.body)
person.name = 'Mike' // will cause the Observer region to re-render
```

### provider & inject

**Provider** is a component that can pass stores (or other stuff) using React's context mechanism to child components. This is useful if you have things that you don't want to pass through multiple layers of components explicitly.

**inject** can be used to pick up those stores. It is a higher order component that takes a list of strings and makes those stores available to the wrapped component.

```JS
@inject('color')
@observer
class Button extends React.Component {
  render() {
    return <button style={ { background: this.props.color } }>{this.props.children}</button>
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    )
  }
}

class MessageList extends React.Component {
  render() {
    const children = this.props.messages.map(message => <Message text={message.text} />)
    return (
      <Provider color='red'>
        <div>{children}</div>
      </Provider>
    )
  }
}
```

Instead of passing a list of store names, it is also possible to create a custom mapper function and pass it to inject. The mapper function receives all stores as argument, the properties with which the components are invoked and the context, and should produce a new set of properties, that are mapped into the original:

```JS
mapperFunction: (allStores, props, context) => additionalProps
```

```JS
const NameDisplayer = ({ name }) => <h1>{name}<\/h1>

const UserNameDisplayer = inject(stores => ({
  name: stores.userStore.name
}))(NameDisplayer)

const user = observable({
  name: 'Noa'
})

const App = () => (
  <Provider userStore={user}>
    <UserNameDisplayer />
  </Provider>
)

ReactDOM.render(<App />, document.body)
```

### disposeOnUnmount

Function (and decorator) that makes sure a function (usually a disposer such as the ones returned by reaction, autorun, etc.) is automatically executed as part of the **componentWillUnmount** lifecycle event.

```JS
import { disposeOnUnmount } from 'mobx-react'

class SomeComponent extends React.Component {
  // decorator version
  @disposeOnUnmount
  someReactionDisposer = reaction(...)

  // function version over properties
  someReactionDisposer = disposeOnUnmount(this, reaction(...))

  // function version inside methods
  componentDidMount() {
    // single function
    disposeOnUnmount(this, reaction(...))

    // or function array
    disposeOnUnmount(this, [
      reaction(...),
      reaction(...)
    ])
  }
}
```

### onError

If a component throws an error, this logs to the console but does not 'crash' the app, so it might go unnoticed. For this reason it is possible to attach a global error handler using **onError** to intercept any error thrown in the render of an observer component. This can be used to hook up any client side error collection system.

```JS
import { onError } from 'mobx-react'

onError(error => {
  console.log(error)
})
```

## 理解 MobX 对什么作出反应

MobX 会对在追踪函数执行过程中读取现存的可观察属性做出反应，具体可以[参考官方文档这一节](https://cn.mobx.js.org/best/react.html):

* 读取 - 是对象属性的间接引用，可以用过 . (例如 user.name) 或者 [] (例如 user['name']) 的形式完成
* 追踪函数 - 是 computed 表达式、observer 组件的 render() 方法和 when、reaction 和 autorun 的第一个入参函数
* 过程(during) - 意味着只追踪那些在函数执行时被读取的 observable 。这些值是否由追踪函数直接或间接使用并不重要


额外说下新增属性的监听:

```JS
let ob = observable({ a: 1, b: 1 })
autorun(() => {
  if (ob.c) {
    console.log('ob.c:', ob.c)
  }
})
ob.c = 1 // 并未监听到
```

此时可以通过 `extendObservable(target, props)` 方法来为对象新增加 observable 属性:

```JS
let ob = observable({ a: 1, b: 2 })
extendObservable(ob, { c: 1 }) // 输出 1
autorun(() => console.log(ob.c))
ob.c = 3 // 输出 3
```

> 如果想通过 demo 快速上手的话，这里有一个 [mobx-react-demo](https://github.com/Tate-Young/mobx-react-demo) 👈

## 参考链接

1. [MobX 官方文档](https://mobx.js.org)
2. [Ten minute introduction to MobX and React](https://mobx.js.org/getting-started.html)
3. [mobx 学习总结](https://segmentfault.com/a/1190000013810512) By 阿阿阿阿阿光

---
layout: blog
front: true
comments: True
flag: react
background: green
category: 前端
title:  React Hooks
date:   2019-04-16 20:33:00 GMT+0800 (CST)
update: 2020-10-05 17:41:00 GMT+0800 (CST)
background-image: /style/images/smms/react.png
tags:
- React
---
# {{ page.title }}

## 什么是 Hooks

[**Hooks**](https://react.docschina.org/docs/hooks-intro.html) 是 `React v16.7.0-alpha` 中加入的新特性。它可以让你在 class 以外使用 state 和其他 React 特性。需要注意的是 Hooks 在 classes 中是不生效的，除非你使用下面要介绍的 **function components(函数组件)**。那么 Hooks 解决了什么问题呢？

### stateful logic

针对这个问题，之前的方案有两种，即使用[**高阶函数(HOC)**](https://react.docschina.org/docs/higher-order-components.html)或[**渲染属性(Render props)**](https://react.docschina.org/docs/render-props.html)。

#### 高阶函数 HOC

高阶函数用来重用组件逻辑，本质就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件:

```JSX
// Our HOC
export default function withData(Component) {
  return class extends React.Component {
    render() {
      return <Component {...this.props} myProp="some text" />;
    }
  }
}
```

```JSX
// Our component that uses our HOC
import React from "react";
import { withData } from "./withData";

export class MyComponent extends React.Component {
  render() {
    return <div>{this.props.myProp}</div>
  }
}

export default withData(MyComponent);
```

让我们来看一个完整的栗子(来自[这里](https://pawelgrzybek.com/cross-cutting-functionality-in-react-using-higher-order-components-render-props-and-hooks/))，假设我们定义了两个组件 Home 和 About:

```JSX
import React, { Component } from "react";

export class Home extends Component {
  state = {
    content: "Loading…"
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then(response => response.json())
      .then(data => this.setState({ content: data.title }))
      .catch(() => this.setState({ content: "Error" }))
  }

  render() {
    return (
      <article>
        <h1>Content</h1>
        <p>{this.state.content}</p>
      </article>
    )
  }
}
```

而 About 结构和 Home 类似，这里偷懒省略不写啦 😀，这样我们可以提取出公共部分:

```JSX
import React, { Component } from "react";

export const withContent = WrappedComponent =>
  class extends Component {
    state = {
      content: "Loading…"
    }
  
    componentDidMount() {
      fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then(response => response.json())
        .then(data => this.setState({ content: data.title }))
        .catch(() => this.setState({ content: "Error" }))
    }
  
    render() {
      return <WrappedComponent content={this.state.content} {...this.props} />;
    }
  };
```

然后我们分别将之前写好的组件进行改造，并使用上面的 withContent 高阶函数进行包裹:

```JSX
import React from "react";
import withContent from "./withContent";

const Content = ({ content }) => (
  <article>
    <h1>Content</h1>
    <p>{content}</p>
  </article>
);

export default withContent(Content);
```

```JSX
import React from "react";
import withContent from "./withContent";

const Sidebar = ({ content }) => (
  <article>
    <h1>Sidebar</h1>
    <p>{content}</p>
  </article>
);

export default withContent(Sidebar);
```

#### 渲染属性 Render props

渲染属性通过 props 接收一个返回 react element 的函数，来动态决定自己要渲染的内容。相较于 HOC，它少了一些样本代码，而且更清晰，让我们再看看怎么改造上面那个栗子:

```JSX
import { Component } from "react";

export class RenderProps extends Component {
  state = {
    content: "Loading…"
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then(response => response.json())
      .then(data => this.setState({ content: data.title }))
      .catch(() => this.setState({ content: "Error" }))
  }

  render() {
    return this.props.render(this.state.content);
  }
}
```

我们再看看怎么去使用这个组件:

```JSX
// About，Home 同理
import React, { Component } from "react";
import { RenderProps } from "../common";

const Func = ({ content }) => (
  <article>
    <h1>Content</h1>
    <p>{content}</p>
  </article>
)

export class About extends Component {
  render() {
    return (
      <RenderProps render={c => <Func content={c} />} />
    )
  }
}
```

但上述无论哪种方法，都无法摆脱**嵌套地狱(Wrapper Hell)**的问题，因此可以采用我们下面会介绍的自定义 Hook。

### lifecycle spaghetti

我们在刚开始构建我们的组件时它们往往很简单，然而随着开发的进展它们会变得越来越大、越来越混乱，各种逻辑在组件中散落的到处都是。每个生命周期钩子中都包含了一堆互不相关的逻辑。比如我们常常在 **componentDidMount** 和 **componentDidUpdate** 中拉取数据，同时 compnentDidMount 方法可能又包含一些不相干的逻辑，比如设置事件监听（之后需要在 **componentWillUnmount** 中清除）。最终的结果是强相关的代码被分离，反而是不相关的代码被组合在了一起。这显然会导致大量错误。

下面我们会提到怎么用 useEffect 有效去管理这些副作用。它结合了上述的三个生命周期，这样状态和相关的处理逻辑可以按照功能进行划分也同时很大程度降低了开发和维护的难度。

### confusing classes

类对于 react 来说本身就增添了学习曲线，我们仍然要考虑 this 指针的问题，同时也有其他的一些问题。而使用函数组件就可以有效的去规避这些问题。

## useState

**useState** 可以将 state 添加到函数组件中。而在以往，我们要使用**无状态组件(stateless components)**时，都会去创建一个纯函数组件，但是需要用到内部状态 state 的话，必须又要改写成类组件。我们先看一个用类编写的案例:

```JSX
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

通过使用 useState 钩子，改写为:

```JSX
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

> useState 方法返回一对值: 当前的 state 和用来更新它的 function，所以这里我们采用解构。

### useReducer

**useReducer** 其实是 useState 的另一种写法，它的使用和 redux 如出一辙，这样的话，我们对于状态的管理更加清晰，让我们看看改造后的变化:

```JSX
// useState
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  );
}
```

```JSX
// useReducer
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'reset'})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

> useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values. It also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks

在日常使用中，我们可能要定义很多个 `useState` 钩子，有关联性的话我们可以整合成一个，比如:

```JS
const [count, setCount] = useState({
  prevCount: 0,
  nextCount: 0,
})

// 修改其中一个的时候可能会麻烦点，不像之前类组件 setState 方法一样可以浅拷贝
// this.setState({ prevCount: 1 })
setCount({ ...count, prevCount: 1 })
```

还有一种写法，比较适用于一起改动的，比如:

```JS
const [[page, direction], setPage] = useState([0, 0])

setPage([newPage, newDirection])
```

## useEffect

有时我们想要在 React 更新过 DOM 之后执行一些额外的操作。 比如网络请求、手动更新 DOM 、以及打印日志，这些都称为**副作用(effects)**。而 **useEffects** 可以有效的去进行管理，同样先看看类组件的写法:

```JSX
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

通过 useEffect 改写后，我们可以看到相关的逻辑更加清晰:

```JSX
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // React 在每次组件 unmount 的时候执行清理
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

> 另外我们可以使用多个 useEffect 来实现关注点分离，Hook 让我们根据代码的作用将它们拆分，而不是根据生命周期。React 将会按照指定的顺序应用每个 effect。

在有些时候，我们并不想每次渲染时候都操作副作用，所以我们可能这么写:

```JSX
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

如果通过 useEffect 改写的话，我们只用传进去一个数组参数即可进行 effect 的条件执行:

```JSX
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行，即采用类似于 `componentDidMount` 和 `componentWillUnmount` 的思维模式:

```JSX
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, []); // 这个 effect 从不会重新执行
```

> useEffect Hook 可以看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

在使用 useEffect 的时候，我们可能会碰到这种情况，即 state 无法更新，举个栗子:

```JSX
function Clock() {
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(time + 1);
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div>Seconds: {time}</div>
  );
}
```

我们会看到 time 从初始化的 0 变为 1，之后就不会再改变了。原因就是只在第一次渲染时候，useEffect 接收了 time 参数并执行，此时为 0，而之后 useEffect 没有被调用，也就无法获取最新的 time 值。可[参考这里](https://stackoverflow.com/questions/53024496/state-not-updating-when-using-react-state-hook-within-setinterval) 👈

当然我们也可以在 useEffect 加入第二个参数 time，即 time 变化时重新去调用。除此之外我们还有其他一些方式来修改:

```JSX
React.useEffect(() => {
  const timer = window.setInterval(() => {
    // setTime(time + 1);
    setTime(prevTime => prevTime + 1); // change this line
  }, 1000);
  return () => {
    window.clearInterval(timer);
  };
}, []);
```

或者我们可以利用下面讲到的 useRef，它不仅只针对于 DOM refs，还可以在 current 可变属性中存入任何数值:

```JSX
const [time, setTime] = useState(0);
const timeRef = useRef()

React.useEffect(() => {
  timeRef.current = time; // 存储 time 值
}, [time]);

React.useEffect(() => {
  const timer = window.setInterval(() => {
    setTime(timeRef.current + 1);
    console.log('ttt', time)
  }, 1000);
  return () => {
    window.clearInterval(timer);
  };
}, []);
```

### useLayoutEffect

大多数情况下，我们都可以使用 useEffect 处理副作用。但是，如果副作用要在 DOM 更新之后同步执行，就需要使用 **useLayoutEffect**。这里引用下[这篇文章](https://zhuanlan.zhihu.com/p/51356920)的示例:

```JSX
function App() {
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const title = document.querySelector('#title')
    const titleWidth = title.getBoundingClientRect().width
    if (width !== titleWidth) {
        setWidth(titleWidth)
    }
  })
  return <div>
    <h1 id="title">hello</h1>
    <h2>{width}</h2>
  </div>
}
```

## useRef

```JSX
const refContainer = useRef(initialValue)
```

**useRef** 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变，之前 Refs 的用法[可参考 React 简介]( {{site.url}}/2018/08/06/react-profile.html#refs ):

```JSX
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

请记住，当 ref 对象内容发生变化时，useRef 并不会通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用[**回调 ref**](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node) 来实现:

```JSX
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []); // 传递了 [] 作为 useCallback 的依赖列表。这确保了 ref callback 不会在再次渲染时改变

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

当然也可以把这个逻辑抽取出来作为一个可复用的 Hook:

```JSX
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```

## useCallback / useMemo

**useMemo** 和 **useCallback** 都会在组件第一次渲染的时候执行，之后会在其依赖的变量发生改变时再次执行。useMemo 返回缓存的计算值，useCallback 则返回缓存的函数。这两者有什么用途呢:

1、把内联回调函数及依赖项数组作为参数传入 **useCallback**，它将返回返回一个 [**memoized**](https://en.wikipedia.org/wiki/Memoization) 回调函数，该回调函数仅在某个依赖项改变时才会更新:

```JSX
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

举个栗子，每次修改 count，set.size 就会 +1，这说明 useCallback 依赖变量 count，count 变更时会返回新的函数；而 val 变更时，set.size 不会变，说明返回的是缓存的旧版本函数:

```JSX
import React, { useState, useCallback } from 'react';

const aSet = new Set();
const bSet = new Set();

export default function Callback() {
  const [count, setCount] = useState(1);
  const [val, setVal] = useState('');

  const callback = useCallback(() => {
    console.log(count);
  }, [count]);

  function callback2() { // 作对比
    console.log('callback test')
  }
  aSet.add(callback);
  bSet.add(callback2);

  console.log(`aSet size: ${aSet.size}, bSet size: ${bSet.size}`)

  return <div>
    <h4>{count}</h4>
    <h4>{set.size}</h4>
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <input value={val} onChange={event => setVal(event.target.value)}/>
    </div>
  </div>;
}
```

2、把"创建"函数和依赖项数组作为参数传入 **useMemo**，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算:

```JSX
// 先编写在没有 useMemo 的情况下也可以执行的代码 —— 之后再在你的代码中添加 useMemo，以达到优化性能的目的
// 如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值
// 记住，传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

> memoized(非 memorized) 是一种提高程序运行速度的优化技术。通过储存大计算量函数的返回值，当这个结果再次被需要时将其从缓存提取，而不用再次计算来节省计算时间。 
记忆化是一种典型的时间存储平衡方案

> `useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`

下面介绍一个使用场景: 有一个父组件，其中包含子组件，子组件接收一个函数作为 props；通常而言，如果父组件更新了，子组件也会执行更新；但是大多数场景下，更新是没有必要的，我们可以借助 useMemo 来返回函数，然后把这个函数作为 props 传递给子组件；这样，子组件就能避免不必要的更新:

```JSX
import React, { useState, useMemo, useEffect } from 'react'
function Parent() {
  const [count, setCount] = useState(1)
  const [val, setVal] = useState('')

  // 当 count 没变时，不会产生新的函数，即不会触发数据传递
  const callback = useMemo(() => {
    return count
  }, [count])

  return <div>
      <h4>{count}</h4>
    <Child callback={callback}/>
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <input value={val} onChange={event => setVal(event.target.value)}/>
    </div>
  </div>
}

function Child({ callback }) {
  const [count, setCount] = useState(() => callback())
  useEffect(() => {
    setCount(callback())
  }, [callback])
  return <div>
    {count}
  </div>
}
```

### shouldComponentUpdate

为了优化组件的性能，我们应当阻止不必要的渲染。对于上面举的场景栗子，以往的解决方案则是用 `shouldComponentUpdate` 或 `PureComponent`:

```JSX
// 利用 shouldComponentUpdate 生命周期
shouldComponentUpdate(nextProps, nextState) {
  // 当 count 变化时，才会去渲染
  if (this.state.count === nextState.count) {
    return false
  }
  return true
}
```

### PureComponent

React v15.5 中新加了一个 **PureComponent** 类，可以让我们避免写一堆 shouldComponentUpdate 代码，用法很简单，只要把继承类从 Component 换成 PureComponent 即可:

```JSX
- class TestC extends React.Component {
+ class TestC extends React.PureComponent {
```

它的原理是当组件更新时，如果组件的 props 和 state 都没发生改变，render 方法就不会触发，省去 Virtual DOM 的生成和比对过程，达到提升性能的目的。具体就是 React 自动帮我们做了一层浅比较，**shallowEqual** 会比较 Object.keys(state \| props) 的长度是否一致，每一个 key 是否两者都有，并且是否是同一个引用:

```JS
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState)
}
```

其实现如下:

```JS
// https://github.com/reduxjs/react-redux/blob/master/src/utils/shallowEqual.js
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export default function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false
    }
  }

  return true
}
```

> 如果 PureComponent 里有 shouldComponentUpdate 函数的话，则直接使用 shouldComponentUpdate 的结果作为是否更新的依据

另外再提一下，使用纯组件时，props 和 state 不能使用同一个引用，不然即使你改变了值，而引用不变，还是不会渲染的，举个栗子:

```JSX
class App extends PureComponent {
  state = {
    items: [1, 2, 3]
  }
  handleClick = () => {
    const { items } = this.state
    items.pop()
    this.setState({ items })
  }
  render() {
    return (< div>
      < ul>
        {this.state.items.map(i => < li key={i}>{i}< /li>)}
      < /ul>
      < button onClick={this.handleClick}>delete< /button>
    < /div>)
  }
}
```

会发现，无论怎么点 delete 按钮，li 都不会变少，因为用的是一个引用，shallowEqual 的结果为 true，所以组件压根儿就没渲染，改正如下:

```JSX
handleClick = () => {
  const { items } = this.state
  items.pop()
  this.setState({ items: [].concat(items) })
}
```

### React.memo

当我们通过函数组件使用 hooks 的时候，我们没办法再去像类一样使用 PureComponent，因此 **React.memo** 油然而生，它是 React v16.6 引进来的新属性，其实就是函数组件的 React.PureComponent:

```JSX
const Funcomponent = ()=> {
  return (
    <div>
      Hiya!! I am a Funtional component
    </div>
  )
}

const MemodFuncComponent = React.memo(FunComponent)
```

React.memo 会返回一个纯化(purified)的组件 **MemoFuncComponent**，这个组件将会在 JSX 标记中渲染出来。当组件的参数 props 和状态 state 发生改变时，React 将会检查前一个状态和参数是否和下一个状态和参数是否相同，如果相同，组件将不会被渲染，如果不同，组件将会被重新渲染，表现上和 PureComponent 一致。它还可以接收第二个参数:

```JSX
React.memo(Funcomponent, (nextProps, prevProps) => {
  // 类似 shouldComponentUpdate
})
```

> 注意如果 props 相等，则返回 true，否则返回 false。这与 shouldComponentUpdate 方法的返回值刚好相反

综上所述，我们解决组件性能优化问题无外乎两个方面:

* setState 会触发组件的重新渲染，无论值是否改变 --> 避免不必要的渲染
* 父组件更新，子组件也会自动更新 --> 避免不必要的子组件渲染

## 自定义 Hook

当我们要分享或者复用一个有状态的组件时，我们可以将状态单独提取出来，并创建一个自定义的 Hook，通常我们命名以 'use' 开头，让我们再次回到最初那个示例:

```JSX
import { useState, useEffect } from "react";

export function useContent() {
  const [content, setContent] = useState("Loading…");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then(response => response.json())
      .then(data => setContent(data.title))
      .catch(() => setContent("Error"))
  }, []);
  
  return content;
}
```

然后改写之前写好的 Home 和 About 组件即可，比起之前的方法，是不是就简单多了呢:

```JSX
// Home，About 同理
import React, { Component } from "react";
import { useContent } from "../common";

export function Home() {
  const content = useContent()

  return (
    <article>
      <h1>Content</h1>
      <p>{content}</p>
    </article>
  )
}
```

然我们来看看另一个完整的栗子，来自[这里](https://medium.com/frontmen/react-hooks-why-and-how-e4d2a5f0347):

<iframe src="https://codesandbox.io/embed/kw864l6l07?fontsize=14" title="List of Users with shortcuts custom effect" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> React Hooks 不仅仅是这些，还有很多其他的，详情可以[参考 API](https://react.docschina.org/docs/hooks-reference.html) 👈

> 其他钩子，比如 React Redux Hooks 可以[参考这里]( {{site.url}}/2018/08/07/react-redux.html#hooks )，还有 React Router 可以[参考这里]( {{site.url}}/2018/08/06/react-react-router.html#hooks )

## 参考链接

1. [React Hooks — Why and How](https://medium.com/frontmen/react-hooks-why-and-how-e4d2a5f0347) By Sebastiaan van Arkens
2. [cross-cutting functionality in react using higher-order components, render props and hooks](https://pawelgrzybek.com/cross-cutting-functionality-in-react-using-higher-order-components-render-props-and-hooks/)
3. [可能你的 react 函数组件从来没有优化过](https://juejin.im/post/5d26fdb8f265da1b5e731dfe) - 腾讯 IMWeb 团队
4. [Improving Performance in React Functional Components using React.memo()](https://blog.bitsrc.io/improve-performance-in-react-functional-components-using-react-memo-b2e80c11e15a) By Chidume Nnamdi
5. [React PureComponent 使用指南](https://juejin.im/entry/5934c9bc570c35005b556e1a) By yufeng
6. [useMemo 与 useCallback 使用指南](https://zhuanlan.zhihu.com/p/66166173) By Richard

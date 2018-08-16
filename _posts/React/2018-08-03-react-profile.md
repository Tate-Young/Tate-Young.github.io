---
layout: blog
tool: true
comments: True
flag: React
background: green
category: 前端
title:  React 简介
date:   2018-08-06 20:47:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/08/03/5b63ed4d906cd.png
tags:
- React
---
# {{ page.title }}

React 是一个 View 层的框架，用来渲染视图，它主要做几件事情:

* 组件化
* 利用 props 形成单向的数据流
* 根据 state 的变化来更新 view
* 利用虚拟 DOM 来提升渲染性能

## 安装

可以使用 npm 快速构建 React 开发环境，5.20+ 也可以使用包启动器 [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)。**create-react-app** 自动创建的项目基于 Webpack + ES6。

```SHELL
# npm
npm install -g create-react-app
create-react-app my-app

# npx
npx create-react-app my-app
```

## JSX

**JSX** 是一种 JavaScript 的语法扩展，在 JSX 当中的表达式要包含在大括号里，之后通过 **ReactDOM.render()** 渲染到页面。为了将组件是和模板紧密关联，可以把 HTML 模板直接嵌入到 JS 代码里面，但是 JS 不支持这种包含 HTML 的语法，所以需要通过工具将 JSX 编译输出成 JS 代码才能使用。

```JSX
// 如果 JSX 标签是闭合式的，那么你需要在结尾处用 />, 就好像 XML/HTML 一样：
const myDivElement = <div className="foo" />;
const element = <img src={user.avatarUrl} />;
```

> HTML 里的 class 在 JSX 里要写成 **className**，因为 class 在 JS 里是保留关键字。同理某些属性比如 for 要写成 **htmlFor**。

与 JS 的混合写法:

```JSX
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul> // 数组元素中使用的 key 在其兄弟之间应该是独一无二的，如 id
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
    {!isFetching && // isFetching 为 false 时才显示 button
      <button onClick={this.handleRefreshClick}>
        Refresh
      </button>
    }
  );
}
```

本质上来讲，JSX 只是为 **React.createElement(component, props, ...children)** 方法提供的语法糖，可[查看 babel 在线转换示例](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D):

```JSX
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>

// 编译为
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

如果你已经有了个 props 对象，并且想在 JSX 中传递它，你可以使用 ... 作为扩展操作符来传递整个属性对象。下面两个组件是等效的:

```JSX
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

// 等价于
function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

再看个完整的栗子 🌰:

```JSX
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

// 在一个组件的子元素位置使用注释要用 { } 包起来
const element = (
  {/* formatName */}
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

// React DOM 在渲染之前默认会 过滤 所有传入的值。它可以确保你的应用不会被注入攻击。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 XSS(跨站脚本) 攻击。
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

## 组件

### props 输入属性

组件从概念上看就像是函数，它可以接收任意的输入值(称之为 "props")，并返回一个需要在页面上展示的 React 元素。

```JSX
// 组件名采用大驼峰写法
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 等价于
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// React 元素也可以是用户自定义的组件
const element = <Welcome name="Sara" />;
```

类组件应始终使用 props 调用基础构造函数:

```JSX
class Header extends Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.sayName = this.sayName.bind(this)
  }
  sayName() {
    alert('tate')
  }
  render() {
    return (
      <header className = "App-header">
        <img src={this.props.avatar} className="App-logo" alt="logo" onClick={this.sayName}/>>
        <h1 className="App-title">Welcome to React</h1>
      </header>
    )
  }
}
```

### prop-types

更多关于类型检查[可以看 **prop-types**](https://doc.react-china.org/docs/typechecking-with-proptypes.html):

```JSX
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  // 如果 babel 使用了 transform-class-properties，也可以写静态属性
  static propTypes = {
    name: PropTypes.string.isRequired
  }
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// 常规写法
Greeting.propTypes = {
  name: PropTypes.string,
  optionalBool: PropTypes.bool,
  // 链式写法
  requiredFunc: PropTypes.func.isRequired,
  // 一个指定元素类型的数组
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
  // 限制它为列举类型之一的对象
  optionalUnion: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.instanceOf(Message)
  ]),
  // 一个指定属性及其类型的对象
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  // 自定义 validator
  customProp: function(props, propName, componentName) {
  if (!/matchme/.test(props[propName])) {
    return new Error(
      'Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.'
    );
  }
},
};

// 可以通过配置 defaultProps 为 props 定义默认值，类型检查发生在 defaultProps 赋值之后，所以类型检查也会应用在 defaultProps 上面
Greeting.defaultProps = {
  name: 'Tate'
};
```

> 无论是使用函数或是类来声明一个组件，它决不能修改它自己的 **props**。若应用的界面是随时间动态变化的，此时需要用到另一个属性 **state**。

### State 状态

[本节内容参考这里](https://juejin.im/entry/59522bdb6fb9a06b9a516113) 👈

State 必须能代表一个组件 UI 呈现的完整且最小状态集，即组件的任何 UI 改变，都可以从 State 的变化中反映出来。与 Props 的区别主要是 State 是可变的，而后者对于使用它的组件来说，是只读的，要想修改 Props，只能通过该组件的父组件修改。

```JSX
this.setState({name: 'Tate'})

// 错误的写法
this.state.title = 'Tate'
```

State 的更新是异步的，调用 setState，组件的 state 并不会立即改变，setState 只是把要修改的状态放入一个队列中，React 会优化真正的执行时机，并且 React 会出于性能原因，可能会将多次 setState 的状态修改合并成一次状态修改，因此可能出现一些问题。

举个例子，对于一个电商类应用，在我们的购物车中，当我们点击一次购买数量按钮，购买的数量就会加1，如果我们连续点击了两次按钮，就会连续调用两次 <code>this.setState({quantity: this.state.quantity + 1})<code>，在 React 合并多次修改为一次的情况下，相当于等价执行了如下代码:

```JSX
// 后面的操作覆盖掉了前面的操作，最终购买的数量只增加了 1 个
Object.assign(
  previousState,
  {quantity: this.state.quantity + 1},
  {quantity: this.state.quantity + 1},
)
```

因此需要额外参数的帮助:

```JSX
this.setState((preState, props) => {
  counter: preState.quantity + 1
})
```

State 的更新是一个**浅合并(Shallow Merge)**的过程。修改组件状态时，只需要传入发生改变的 State，而不是组件完整的 State:

```JSX
this.state = {
  title : 'React',
  content : 'React is an wonderful JS library!'
}

// 修改，React 会合并新的 title 到原来的组件状态中，同时保留原有的状态 content
this.setState({title: 'Reactjs'});
```

React 官方建议把 State 当作是 immutable 不可变对象，一方面是如果直接修改 this.state，组件并不会重新 render；另一方面 State 中包含的所有状态都应该是不可变对象。当 State 中的某个状态发生变化，我们应该重新创建这个状态对象，而不是直接修改原来的状态。对于状态类型是数组或者对象，可以采取下面这些方法:

```JSX
var books = this.state.books
this.setState({
  books: books.concat(['React Guide']);
})

// 或者
this.setState(preState => ({
  books: [...preState.books, 'React Guide'];
}))
```

### 生命周期

生命周期的方法有，可[查看此处示例](http://www.runoob.com/try/try.php?filename=try_react_life_cycle2):

| 生命周期方法 | 描述 |
|:--------------|:---------|
| componentWillMount | (Deprecated)在渲染前调用,在客户端也在服务端 |
| **componentDidMount** | 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的 DOM 结构，可以通过 this.getDOMNode() 来进行访问 |
| componentWillReceiveProps | (Deprecated)在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化 render 时不会被调用 |
| **static getDerivedStateFromProps** | 替代 componentWillReceiveProps。组件实例化后和接受新属性时将会调用。它应该返回一个对象来更新状态，或者返回 null 来表明新属性不需要更新任何状态 |
| **getSnapshotBeforeUpdate** | 在最新的渲染输出提交给 DOM 前将会立即调用。它让你的组件能在当前的值可能要改变前获得它们 |
| **shouldComponentUpdate** | 返回一个布尔值。在组件接收到新的 props 或者 state 时被调用。在初始化时或者使用 forceUpdate 时不被调用。可以在你确认不需要更新组件时使用。|
| componentWillUpdate | (Deprecated)在组件接收到新的 props 或者 state 但还没有 render 时被调用。在初始化时不会被调用 |
| **componentDidUpdate** | 在组件完成更新后立即调用。在初始化时不会被调用 |
| **componentWillUnmount** | 在组件从 DOM 中移除的时候立刻被调用 |

```JSX
class Example extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // 这一生命周期方法是静态的，它在组件实例化或接收到新的 props 时被触发
    // 若它的返回值是对象，则将被用于更新 state ；若是 null ，则不触发 state 的更新

    // 配合 `componentDidUpdate` 使用，这一方法可以取代 `componentWillReceiveProps`
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        isScrollingDown: nextProps.currentRow > prevState.lastRow,
        lastRow: nextProps.currentRow,
      };
    }
    // 默认不改动 state
    return null;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 该方法在实际改动（比如 DOM 更新）发生前的“瞬间”被调用，返回值将作为 `componentDidUpdate` 的第三个参数

    // 配合 `componentDidUpdate` 使用，这一方法可以取代 `componentWillUpdate`
  }

  componentDidUpdate(props, state, snaptshot) {
    // 新增的参数 snapshot 即是之前调用 getSnapshotBeforeUpdate 的返回值
  }
}
```

## Refs

在典型的 React 数据流中, 属性(props)是父组件与子组件交互的唯一方式。要修改子组件，你需要使用新的 props 重新渲染它。但是，某些情况下你需要在典型数据流外强制修改子组件。要修改的子组件可以是 React 组件的实例，也可以是 DOM 元素。对于这两种情况，React 提供了 **Refs**。

1、创建 Refs

使用的时候需要通过 <code>React.createRef()</code> 创建 refs，然后通过 ref 属性来获得 React 元素:

```JSX
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }
  render() {
    return <div ref={this.myRef} />
  }
}
```

> 注意不能在函数式组件上使用 ref 属性，因为他们没有实例，除非将其转换为 class 组件。

2、访问 Refs

当一个 ref 属性被传递给一个 render 函数中的元素时，可以使用 ref 中的 **current** 属性对节点的引用进行访问:

```JSX
const node = this.myRef.current
```

查看完整示例:

```JSX
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // 创建 ref 存储 textInput DOM 元素
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // 直接使用原生 API 使 text 输入框获得焦点。注意：通过 "current" 取得 DOM 节点
    this.textInput.current.focus();
  }

  render() {
    // 告诉 React 我们想把 <input> ref 关联到构造器里创建的 `textInput` 上
    return (
      <div>
        <input
          type="text"
          ref={this.textInput}} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

## React-hot-loader

[**React-hot-loader**](https://gaearon.github.io/react-hot-loader/) 可以在不刷新浏览器的情况下进行热更新，有两种使用方式:

```JSX
// 根组件 Counter.js
import { hot } from 'react-hot-loader';

class Counter extends Component {...}

export default hot(module)(Counter)
```

第二种方式在入口文件使用 **AppContainer**:

```JSX
// index.js
import { AppContainer } from 'react-hot-loader';
import Counter from './container'

const myRender = Component => {
  render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    rootEl
  );
}

myRender(Counter)
if (module.hot) module.hot.accept('./container', () => myRender(Counter));
```

针对 react-router 4.x 以上，可能会出现热更新失效的问题，可以采用以下方法解决:

```JSX
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const App = () => ( // 根 Router，在 key 值上加一个随机数
  <Router key={process.env.NODE_ENV === 'development' ? Math.random() : ''} />
);
```

## React Router

**React Router** 是一个基于 React 之上的强大路由库，它可以让你向应用中快速地添加视图和数据流，同时保持页面与 URL 间的同步。可以[查看官方 demo](https://github.com/reactjs/react-router-tutorial/tree/master/lessons)。路由算法会根据定义的顺序自顶向下匹配路由。

```JSX
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import App from './modules/App' // 传入各个组件
import About from './modules/About'
import Repos from './modules/Repos'

// 参数 history，它的值 hashHistory 表示，路由的切换由 URL 的 hash 变化决定，如 http://www.example.com/#/
// exact 控制匹配到 / 路径时不会再继续向下匹配
render((
  <Router history={hashHistory}>
    <Route exact path="/" component={App}/>
    <Route path="/repos" component={Repos}/>
    <Route path="/about" component={About}/>
  </Router>
), document.getElementById('app'))
```

> 本篇针对的是 React Router 3.X 版本，4 以上版本请[查看中文文档](http://reacttraining.cn/web/example/basic)。

### path 通配符

通配符规则如下:

| :paramName | 匹配 URL 的一个部分，直到遇到下一个 /、?、# 为止。这个路径参数可以通过 <code>this.props.params.paramName</code> 取出。
| () | 表示 URL 的这个部分是可选的。
| * | 匹配任意字符，直到模式里面的下一个字符为止。匹配方式是非贪婪模式。
| ** | 匹配任意字符，直到下一个 /、?、# 为止。匹配方式是贪婪模式。

```HTML
<Route path="/hello/:name">         // 匹配 /hello/tate 和 /hello/snow
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/tate 和 /hello/snow
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```

### 嵌套路由 Route & IndexRoute

```HTML
<!-- 参数 userName 和 repoName 可以在当前组件通过 this.props.params 来访问 -->
<Router history={hashHistory}>
  <Route path="/" component={App}>
    <Route path="/repos" component={Repos}>
      <Route path="/repos/:userName/:repoName" component={Repo}/>
    </Route>
    <Route path="/about" component={About}/>
  </Route>
</Router>
```

上面代码中，用户访问 /repos 时，会先加载 App 组件，然后在它的内部再加载 Repos 组件。App 组件中通过 <code>this.props.children</code> 访问子组件:

```JSX
export default React.createClass({
  render() {
    return (
      <div>
        <ul role="nav">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/repos">Repos</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})
```

想象一下当 URL 为 / 时，我们想渲染一个在 App 中的组件。不过在此时，App 的 render 中的 <code>this.props.children</code> 还是 undefined。这种情况我们可以使用 **IndexRoute** 来设置一个默认页面:

```HTML
<Router history={hashHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/repos" component={Repos}>
      <Route path="/repos/:userName/:repoName" component={Repo}/>
    </Route>
    <Route path="/about" component={About}/>
  </Route>
</Router>
```

### 路由跳转 Link & IndexLink

路由跳转有两种形式，一个是组件内，另一个组件外。先看第一种:

```HTML
<ul role="nav">
  <li><Link to="/about">About</Link></li>
  <li><Link to="/repos">Repos</Link></li>
</ul>

<!-- <Link> 可以知道哪个 route 的链接是激活状态的，并可以自动为该链接添加 activeClassName 或 activeStyle -->
<Link to="/about" activeClassName="active">About</Link>
<Link to="/about" activeStyle={ {color: 'red'} }>About</Link>
```

在组件外进行路由跳转:

```JSX
import { browserHistory } from 'react-router';

browserHistory.push('/some/path');
```

另外如果链接到根路由 /，不要使用 Link 组件，而要使用 **IndexLink** 组件，不然它会一直处于激活状态，因为所有的 URL 的开头都是 / :

```HTML
<Link to="/">Home</Link>

<!-- 改为 -->
<IndexLink to="/">Home</IndexLink>
<!-- 或者 IndexLink 就是对 Link 组件的 onlyActiveOnIndex 属性的包装 -->
<Link to="/" activeClassName="active" onlyActiveOnIndex={true}>
  Home
</Link>
```

### 路由重定向 Redirect & IndexRedirect

**Redirect** 组件用于路由的跳转，即用户访问一个路由，会自动跳转到另一个路由:

```HTML
<Router>
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard} />
    <Route path="about" component={About} />
    <Route path="inbox" component={Inbox}>
      <Route path="/messages/:id" component={Message} />

      {/* 跳转 /inbox/messages/:id 到 /messages/:id */}
      <Redirect from="messages/:id" to="/messages/:id" />
    </Route>
  </Route>
</Router>
```

**IndexRedirect** 组件用于访问根路由的时候，将用户重定向到某个子组件:

```HTML
<Route path="/" component={App}>
  ＜IndexRedirect to="/welcome" />
  <Route path="welcome" component={Welcome} />
  <Route path="about" component={About} />
</Route>
```

### 路由钩子

#### onEnter & onLeave

Route 可以定义 **onEnter** 和 **onLeave** 两个 hook ，这些 hook 会在页面跳转确认时触发一次。例如权限验证或者在路由跳转前将一些数据持久化保存起来。

```HTML
<!-- onEnter 实现 Redirect -->
<Route path="inbox" component={Inbox}>
  <Route
    path="messages/:id"
    onEnter={
      ({params}, replace) => replace(`/messages/${params.id}`)
    }
  />
</Route>
```

```JSX
// 权限验证
const requireAuth = (nextState, replace) => {
  if (!auth.isAdmin()) {
    // Redirect to Home page if not an Admin
    replace({ pathname: '/' })
  }
}
export const AdminRoutes = () => {
  return (
    <Route path="/admin" component={Admin} onEnter={requireAuth} />
  )
}
```

#### routerWillLeave

React Router 提供一个 **routerWillLeave** 生命周期钩子，这使得 React 组件可以拦截正在发生的跳转，或在离开 route 前提示用户。routerWillLeave 返回值有以下两种：

* return false 取消此次跳转
* return 返回提示信息，在离开 route 前提示用户进行确认。

```JSX
import { Lifecycle } from 'react-router'

const Home = React.createClass({

  // 假设 Home 是一个 route 组件，它可能会使用 Lifecycle mixin 去获得一个 routerWillLeave 方法。
  mixins: [ Lifecycle ],

  routerWillLeave(nextLocation) {
    if (!this.state.isSaved)
      return 'Your work is not saved! Are you sure you want to leave?'
  },
  // ...
})
```

### history 属性

React Router 是建立在 **history** 之上的。 简而言之，一个 history 知道如何去监听浏览器地址栏的变化， 并解析这个 URL 转化为 location 对象， 然后 router 使用它匹配到路由，最后正确地渲染对应的组件。常用的 history 有三种形式， 但是你也可以使用 React Router 实现自定义的 history。

* **browserHistory** - 使用了 HTML5 的 history API 来记录路由历史，如 example.com/some/path。需要服务器进行配置，具体[可参考这里](http://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)
* **hashHistory** - 路由将通过 URL 的 hash 部分（#）切换，URL 的形式类似 example.com/#/some/path
* **createMemoryHistory** - 不会在地址栏被操作或读取，需要手动创建。主要运用于服务器渲染

## 参考链接

1. [React 官网](https://doc.react-china.org/docs/hello-world.html)
2. [React - 菜鸟教程](http://www.runoob.com/react/react-tutorial.html)
3. [Introducing npx: an npm package runner](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) By Kat Marchán
4. [Controlled and uncontrolled form inputs in React don't have to be complicated](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) By Gosha Arinich
5. [React.createClass versus extends React.Component](https://toddmotto.com/react-create-class-versus-component/) By Todd Motto
6. [Convert React.createClass to ES6 Class](https://daveceddia.com/convert-createclass-to-es6-class/) By Dave Ceddia
7. [gitbook - react-router](http://react-guide.github.io/react-router-cn/docs/Introduction.html)
8. [React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html) By 阮一峰
9. [React Router 中文文档](http://reacttraining.cn/web/example/basic)
10. [Hot loader with react-loadable](https://medium.com/@giang.nguyen.dev/hot-loader-with-react-loadable-c8f70c8ce1a6) By Go to the profile of Giang Nguyen
11. [讲讲今后 React 异步渲染带来的生命周期变化](https://juejin.im/post/5abf4a09f265da237719899d) By Enix
12. [深入理解 React 组件状态(State)](https://juejin.im/entry/59522bdb6fb9a06b9a516113)

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

#### prop-types

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

### state 局部状态

举个官方栗子，时钟要不停刷新时间显示:

```JSX
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    // 使用 this.setState() 来更新组件局部状态
    // this.state.date = new Date() 无法触发更新
    this.setState({date: new Date()});
  }

  render() {
    return (
      <div>
        <h1>It is {this.state.date.toLocaleTimeString()}.</h1>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

### 生命周期

组件的生命周期可分成三个状态:

* **Mounting** - 已插入真实 DOM
* **Updating** - 正在被重新渲染
* **Unmounting** - 已移出真实 DOM

生命周期的方法有，可[查看此处示例](http://www.runoob.com/try/try.php?filename=try_react_life_cycle2):

| 生命周期方法 | 描述 |
|:--------------|:---------|
| **componentWillMount** | 在渲染前调用,在客户端也在服务端 |
| **componentDidMount** | 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的 DOM 结构，可以通过 this.getDOMNode() 来进行访问 |
| **componentWillReceiveProps** | 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化 render 时不会被调用 |
| **shouldComponentUpdate** | 返回一个布尔值。在组件接收到新的 props 或者 state 时被调用。在初始化时或者使用 forceUpdate 时不被调用。可以在你确认不需要更新组件时使用。|
| **componentWillUpdate** | 在组件接收到新的 props 或者 state 但还没有 render 时被调用。在初始化时不会被调用 |
| **componentDidUpdate** | 在组件完成更新后立即调用。在初始化时不会被调用 |
| **componentWillUnmount** | 在组件从 DOM 中移除的时候立刻被调用 |

## 表单

### 受控组件

在HTML当中，像 \<input\>,\<textarea\>, 和 \<select\>这类表单元素会维持自身状态，并根据用户输入进行更新。但在 React 中，可变的状态通常保存在组件的状态属性中，并且只能用 setState() 方法进行更新。其值由 React 控制的输入表单元素称为 **"受控组件"**。

```JSX
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

### 非受控组件

在大多数情况下，我们推荐使用受控组件来实现表单。 在受控组件中，表单数据由 React 组件处理。如果让表单数据由 DOM 处理时，替代方案为使用非受控组件，可以使用 [**ref**](https://doc.react-china.org/docs/refs-and-the-dom.html) 从 DOM 获取表单值。

```JSX
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      // 默认值为 defaultValue 属性
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" defaultValue="Bob" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## Component & createClass()

React.createClass 和 extends React.Component 两种语法的区别可以[查看这篇文章](https://toddmotto.com/react-create-class-versus-component/)，主要在于：

* propType 和 getDefaultProps
* 状态 state
* this 指针 - 前者的 this 指针自动绑定到 React 类的实例上
* Mixins - class 可以用 [react-mixin 库](https://github.com/brigand/react-mixin)

```JSX
import React from 'react';

const Contacts = React.createClass({  
  propTypes: {
    name: React.PropTypes.string
  },
  getDefaultProps() {
    return {
    };
  },
  // 设置 state 状态属性
  getInitialState() {
    return {
      isLoading: false
    }
  }
  handleClick() {
    console.log(this); // React Component instance
  },
  render() {
    return (
      <div onClick={this.handleClick}></div>
    );
  }
});

export default Contacts;  
```

```JS
import React, { Component } from 'react';

class Contacts extends Component {  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this) // 绑定 this 指针
    this.state = { // define this.state in constructor
      isLoading: false
    }
  }
  handleClick() {
    console.log(this); // React Component instance
  },
  render() {
    return (
      <div onClick={this.handleClick}></div>
    );
  }
}

Contacts.propTypes = {};
Contacts.defaultProps = {};

export default Contacts;  
```

另外 Mixins 的用法可以查看以下示例:

```JSX
import React from 'react';

var SomeMixin = {
  doSomething() { }
};
const Contacts = React.createClass({
  mixins: [SomeMixin],
  handleClick() {
    this.doSomething(); // use mixin
  },
  render() {
    return (
      <div onClick={this.handleClick}></div>
    );
  }
});

export default Contacts;
```

> React.createClass() 已弃用，推荐用 extends React.Component

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

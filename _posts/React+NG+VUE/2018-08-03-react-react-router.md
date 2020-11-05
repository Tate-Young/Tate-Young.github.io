---
layout: blog
front: true
comments: True
flag: React
background: green
category: 前端
title:  React & React Router
date:   2018-08-06 20:47:00 GMT+0800 (CST)
update: 2020-11-05 17:41:00 GMT+0800 (CST)
background-image: /style/images/smms/react.png
tags:
- React
---
# {{ page.title }}

React 是一个 View 层的框架，用来渲染视图，它主要做几件事情:

* 组件化
* 利用 props 形成单向的数据流
* 根据 state 的变化来更新 view
* 利用虚拟 DOM 来提升渲染性能

> React 将 DOM 抽象为 **虚拟 DOM**, 然后通过新旧虚拟 DOM 这两个对象的差异(**Diff** 算法)，将变化的部分重新渲染，具体可以[查看我的这篇博客]( {{site.url}}/2019/10/24/react-virtual-dom.html ) 👈

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

举个例子，对于一个电商类应用，在我们的购物车中，当我们点击一次购买数量按钮，购买的数量就会加1，如果我们连续点击了两次按钮，就会连续调用两次 `this.setState({quantity: this.state.quantity + 1})`，在 React 合并多次修改为一次的情况下，相当于等价执行了如下代码:

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

### children

在包含开始和结束标签的 JSX 表达式中，标记之间的内容作为特殊的参数传递：`props.children`:

```JSX
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

### 事件处理

```JSX
// 类的方法默认是不会绑定 this 的。如果你忘记绑定 this.sayName 并把它传入 onClick，当你调用这个函数的时候 this 的值会是 undefined
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
      <header className="App-header">
        <img src={this.props.avatar} className="App-logo" alt="logo" onClick={this.sayName}/>>
        <h1 className="App-title">Welcome to React</h1>
      </header>
    )
  }
}
```

或者采用以下方式(推荐):

```JSX
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

上面这个语法在 Create React App 中默认开启，如果没有使用属性初始化器语法，则写法为:

```JSX
// 每次 LoggingButton 渲染的时候都会创建一个不同的回调函数。在大多数情况下，这没有问题。
// 然而如果这个回调函数作为一个属性值传入低阶组件，这些组件可能会进行额外的重新渲染
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

向事件处理程序传递参数:

```JSX
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
// 通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
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

### 注意点

1、JavaScript 中的一些 “falsy” 值(比如数字0)，它们依然会被渲染。例如，下面的代码不会像你预期的那样运行，因为当 props.message 为空数组时，它会打印 0:

```JSX
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>

// 必须确保 && 前面的表达式始终为布尔值或强制转为 bool 类型也可以，!!props.messages.length
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

## Fragments

React 中的一个常见模式是一个组件返回多个元素。[**Fragments**](https://react.docschina.org/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax) 允许你将子列表分组，而无需向 DOM 添加额外节点:

```JSX
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

> Fragments 还支持短语法 `<>`，但是它需要工具编译支持，且不支持 key 或属性。

## Refs

在典型的 React 数据流中, 属性(props)是父组件与子组件交互的唯一方式。要修改子组件，你需要使用新的 props 重新渲染它。但是，某些情况下你需要在典型数据流外强制修改子组件。要修改的子组件可以是 React 组件的实例，也可以是 DOM 元素。对于这两种情况，React 提供了 **Refs**。

1、创建 Refs

使用的时候需要通过 `React.createRef()` 创建 refs，然后通过 ref 属性来获得 React 元素:

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

## React.forwardRef

**React.forwardRef** 会创建一个 React 组件，能够实现 [**Refs 转发**](https://zh-hans.reactjs.org/docs/forwarding-refs.html)，即这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中:

```JSX
// 当 React 附加了 ref 属性之后，ref.current 将直接指向 <button> DOM 元素实例。
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

## React.lazy / React.Suspense

[**React.lazy**](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy) 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。React.lazy 接受一个函数，这个函数需要动态调用 import()。它必须返回一个 Promise，该 Promise 需要 resolve 一个 defalut export 的 React 组件【:

```JSX
// 注意 - 使用 React.lazy 的动态引入特性需要 JS 环境支持 Promise
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

**React.Suspense** 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。目前，懒加载组件是 `<React.Suspense>` 支持的唯一用例:

```JSX
// 该组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

## react-refresh 热更新

之前一直用的是[**React-hot-loader**](https://gaearon.github.io/react-hot-loader/) 可以在不刷新浏览器的情况下进行热更新，但是有个问题就是不能监听样式修改，而且有其它一些小毛病。现在推荐使用 [**react-refresh**](https://github.com/pmmmwh/react-refresh-webpack-plugin)，配置很简单:

```JS
// webpack.config.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
// ... your other imports

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  // It is suggested to run both `react-refresh/babel` and the plugin in the `development` mode only,
  // even though both of them have optimisations in place to do nothing in the `production` mode.
  // If you would like to override Webpack's defaults for modes, you can also use the `none` mode -
  // you then will need to set `forceEnable: true` in the plugin's options.
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      // ... other rules
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          // ... other loaders
          {
            loader: require.resolve('babel-loader'),
            options: {
              // ... other options
              plugins: [
                // ... other plugins
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // ... other plugins
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  // ... other configuration options
};
```

## React-loadable

A higher order component for loading components with dynamic imports，能实现懒加载的功能:

```JSX
import Loadable from 'react-loadable'
import Loading from './Loading'

const components = {
  ListComponent: Loadable({
    loader: () => import('../list/ListComponent'),
    loading: Loading,
  }),
  LayoutComponent: Loadable({
    loader: () => import('../layout/LayoutComponent'),
    loading: Loading,
  }),
}

export default components
```

## React Router 4.x

### Router 组件

React Router 中有三种类型的组件，包括 **Routers**、**Router Matching**、和 **Navigtaion**:

```JS
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
```

#### Routers

包含 **\<BrowserRouter\>** 和 **\<HashRouter\>**，这两种 router 会为你创建专门的 history 对象。一般来说，如果数据是通过动态请求获取的，则使用 BrowserRouter。

#### Router Matching

匹配路由的组件有两种: **\<Route\>** 和 **\<Switch\>**。匹配路由的原理是比较 \<Route\> 中的 **path** 属性和当前地址的 **pathname**。若匹配，则 \<Route\> 中 **components** 属性所指定的组件就会被渲染出来。当 \<Route\> 不指定 path 属性的话则始终被渲染。

```JSX
import { Route, Switch } from "react-router-dom";
// when location = { pathname: '/about' }
<Route path='/about' component={About}/> // renders <About/>
<Route path='/contact' component={Contact}/> // renders null
<Route component={Always}/> // renders <Always/>
```

\<Route\> 的 **exact** 表示为 true 时则严格匹配:

| path | location.pathname | exact | matches? |
| ------------ | ------ | ------- | ------- |
| /one | /one/two |true | no |
| /one | /one/two |false | yes |

\<Switch\> 可以把这些 \<Route\> 整合到一起，遍历然后渲染第一个匹配当前地址的 \<Route\>:

```JSX
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/contact" component={Contact} />
  {/* when none of the above match, <NoMatch> will be rendered */}
  <Route component={NoMatch} />
</Switch>
```

#### Route Render Props

\<Route\> 有三种组件渲染的参数:

* **component** - 用来渲染一个已存在的组件
* **render** - 传递一个函数。传递局部变量到需要渲染的组件
* **children**

```JSX
const Home = () => <div>Home</div>;

const App = () => {
  const someVariable = true;

  return (
    <Switch>
      {/* these are good */}
      <Route exact path="/" component={Home} />
      <Route
        path="/about"
        render={props => <About {...props} extra={someVariable} />}
      />
    </Switch>
  );
};
```

#### Navigation

React Router 提供了以下三种组件用于在应用中创建链接:

*  **\<Link\>** - 会渲染成 HTML 中的 a 标签
*  **\<NavLink\>** - 是一种特殊类型的 \<Link\> 组件。当其 to 属性中指定的位置与当前位置匹配时，组件样式将会设置成 "active" 样式
*  **\<Redirect\>** - 强制跳转到 to 属性上指定的位置

```JSX
<Link to='/'>Home</Link>
// <a href='/'>Home</a>

// location = { pathname: '/react' }
<NavLink to='/react' activeClassName='hurray'>React</NavLink>
// <a href='/react' className='hurray'>React</a>

<Redirect to="/login" />
```

### WithRouters (Deprecated)

> 不如用钩子 😊

可通过 **withRouter** 高阶组件来获取 history 对象的属性和 \<Route\> 中的 match， withRouter 会将已更新的 **match**, **location**, 和 **history** 属性传递到被包裹的组件当中，无论它在哪儿渲染:

```JSX
import { withRouter } from "react-router";
...
<Route
  path="/order/:direction(asc|desc)"
  component={ComponentWithRegex}
/>

function ComponentWithRegex({ match }) {
  const { params: { direction } } = match
  return (
    <div>
      <h3>Only asc/desc are allowed: {direction}</h3>
    </div>
  );
}

...
const ShowTheLocationWithRouter = withRouter(ShowTheLocation);
```

### Hooks

喜大普奔，React Router 也更新提供了钩子，目前有这四个，我们可以愉快地扔掉高阶函数 withRouter 了:

* useHistory - 获取 history 事例，`history.push("/home")`
* useLocation - 获取 location 对象，`ga.send(["pageview", location.pathname])`
* useParams - 获取 `match.params` 路由参数
* useRouteMatch - It’s mostly useful for getting access to the match data without actually rendering a `<Route>`.

```JS
import { useParams } from 'react-router-dom'

const { client = '' } = useParams<IRouterParams>()
```

## 参考链接

1. [React 官网](https://doc.react-china.org/docs/hello-world.html)
2. [React - 菜鸟教程](http://www.runoob.com/react/react-tutorial.html)
3. [Introducing npx: an npm package runner](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) By Kat Marchán
4. [Controlled and uncontrolled form inputs in React don't have to be complicated](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) By Gosha Arinich
5. [React.createClass versus extends React.Component](https://toddmotto.com/react-create-class-versus-component/) By Todd Motto
6. [Convert React.createClass to ES6 Class](https://daveceddia.com/convert-createclass-to-es6-class/) By Dave Ceddia
7. [gitbook - react-router](http://react-guide.github.io/react-router-cn/docs/Introduction.html)
8. [React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html) By 阮一峰
9. [React Router 官方文档](https://reacttraining.com/react-router/web/guides/quick-start)
10. [Hot loader with react-loadable](https://medium.com/@giang.nguyen.dev/hot-loader-with-react-loadable-c8f70c8ce1a6) By Go to the profile of Giang Nguyen
11. [讲讲今后 React 异步渲染带来的生命周期变化](https://juejin.im/post/5abf4a09f265da237719899d) By Enix
12. [深入理解 React 组件状态(State)](https://juejin.im/entry/59522bdb6fb9a06b9a516113)
13. [React 虚拟 Dom 和 diff 算法](https://juejin.im/post/5a3200fe51882554bd5111a0) By Y__
14. [React Router 4.x 开发，这些雷区我们都帮你踩过了](http://jdc.jd.com/archives/212552) By sunyinfeng
15. [Virtual DOM in ReactJS](https://hackernoon.com/virtual-dom-in-reactjs-43a3fdb1d130) By Rupesh Mishra

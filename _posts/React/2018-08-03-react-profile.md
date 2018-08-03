---
layout: blog
tool: true
comments: True
flag: React
background: green
category: 前端
title:  React 简介
date:   2018-08-03 18:17:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/08/03/5b63ed4d906cd.png
tags:
- React
---
# {{ page.title }}

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
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string,
  // 一个指定元素类型的数组
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
  // 限制它为列举类型之一的对象
  optionalUnion: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.instanceOf(Message)
  ]),
};

// 可以通过配置 defaultProps 为 props 定义默认值，类型检查发生在 defaultProps 赋值之后，所以类型检查也会应用在 defaultProps 上面
Greeting.defaultProps = {
  name: 'Stranger'
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

## 参考链接

1. [React 官网](https://doc.react-china.org/docs/hello-world.html)
2. [React - 菜鸟教程](http://www.runoob.com/react/react-tutorial.html)
3. [Introducing npx: an npm package runner](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) By Kat Marchán
4. [Controlled and uncontrolled form inputs in React don't have to be complicated](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) By Gosha Arinich

---
layout: blog
front: true
comments: True
flag: Vue
background: green
category: 前端
title:  Angular、React 和 Vue
date:   2019-10-19 20:00:00 GMT+0800 (CST)
update: 2019-10-21 17:59:00 GMT+0800 (CST)
background-image: https://miro.medium.com/max/7680/1*MjrP9m07l0qJ0Y9TSH1QCA.jpeg
tags:
- Vue
- Angular
- AngularJS
- React
---
# {{ page.title }}

都 9102 年了，对于前端三大框架自己都有些接触，一直没有做一下总结，这次趁分享的机会好好理一下。我们接下来会探讨:

1. Angular、React 和 Vue 是什么，为什么存在？
2. 他们分别有什么特性？
3. AngularJS 和 Angular 有什么区别吗？Vue 是“抄袭” AngularJS 吗？
4. 他们在未来的发展趋势是什么
5. 我应该选择哪一个
6. 我学不动了怎么办

当然在介绍三大框架之前，我们先粗略看下这方面的前端发展史。

## 前端发展史

前端的发展一直都很迅速，这一切都可以总结为四个字，即 **业务驱动**。很好理解，场景和业务的复杂度越来越高，用户的需求也越来越多，用户体验也越来越严苛，因而我们的关注点和技术也时刻在变，如果不能顺应这股潮流，那么只能被淘汰。

1、针对于 PC

在很久很久之前，前端还在被叫做切图仔的时代，如何把图切得又精致又好看是门技术活儿，当然开玩笑，那时候前端还是主要负责做一个页面模板，然后拿给后端渲染。自从 ajax 横空出世，开创 web2.0 时代，开发模式也逐渐趋近于前后端分离，但是这个阶段主要还是根据 W3C 制定的标准来解决浏览器兼容性问题，因此 **jQuery** 应运而生，加上 api 简单易用，因此很大程度上流行了起来。但是它的缺点是什么呢，它的关注点一直在 DOM 而不是数据，而操作 DOM 一直是个繁琐的过程，而且对性能有很大影响。所以随着技术的演进，我们需要面向对象的编程思想，我们要能够提供一系列解决方案，因此前端的开发模式也逐渐演变至 MVVM，我们只需要关注数据，让框架自动去更新 DOM 状态就行了。在这种模式下，三足鼎立的局面就此呈现:

1. 2009 - AnguarJS
2. 2013 - React
3. 2014 - Vue
4. 2016 - Angular

![angular-react-vue-jquery.jpeg](https://i.loli.net/2019/10/19/ZsCdyIYibWFBa8X.jpg)

而关于 MVVM 的解释，这里引用[此篇博客](https://www.jcat.club/2018/10/23/mvm和mvvm区别/)的图:

![MVVM](https://img-blog.csdnimg.cn/20181103150157814.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzIxNjEwNQ==,size_16,color_FFFFFF,t_70)

2、 针对于 移动端

随着智能手机的普遍，移动端的需求也越来越多，因此更多关注响应式设计和用户体验。**hybrid** 应用也逐渐火热，但是它在体验和性能上，仍然比原生要差很远。所以之后阿里推出了 [weex](https://github.com/alibaba/weex)、facebook 推出了 [React Native](https://github.com/facebook/react-native)、Google 也推出了 [flutter](https://github.com/flutter/flutter)。而在网页开发技术上，Google 更是推出了 **PWA**，利用 Service workder 等技术来实现离线访问和消息推送等，具体可[参考我的这篇博客]( {{site.url}}/2019/04/07/progressive-web-app.html ) 👈

在未来的发展道路上，前端还有很多路要走，谁又能知道随着 VR、AR 等的普及，又有哪些框架能够站出来，或者哪些又要退出历史舞台。

## 他们分别有什么特性

### AngularJS

在讲 Angular 之前，必须要提到它的前身 **AngularJS**，作为老大哥，他 2009 年就出道了，它的背后就是 Google 大佬，因此它的出世必定受到世人的瞩目，那么它的出现给我们带来了什么 pros and cons:

* 模板 - 可复用的 html 片段
* 指令 - ng，操作 DOM 或复用模板，分为编译和链接两个阶段。[具体可以参考我之前这篇博客]( {{site.url}}/2018/01/30/js-this.html )
* 依赖注入(Dependency Injection) - 我需要什么服务或依赖，我自己注入进来即可
* 双向数据绑定 - 脏检测(Dirty Checking)，采用深度优先遍历原则。[具体可以参考我之前这篇博客]( {{site.url}}/2018/04/26/ng-two-way-data-binding.html )

> Angular 特指 2.x 以上版本，1.x 版本成为 AngularJS

让我们来看看一个标准的 AngularJS 的示例，`ng-app` 的启动过程可以[参考我的这篇博客]( {{site.url}}/2018/04/24/ng-bootstrap.html ):

```HTML
<html ng-app>
  <head>
    <script src="http://code.angularjs.org/angular-xxx.min.js"></script>
  </head>
  <body>
    <div>
      <label>Name:</label>
      <my-directive />
      <input type="text" ng-model="name" placeholder="Enter your name">
      <hr>
      <h1>Hello, { {  name || 'World' } }!</h1>
    </div>
  </body>
</html>
```

成也萧何，败也萧何。正是双向数据绑定的脏检测机制太消耗性能，对于中大型应用的话，每一次检测都是致命的，再加上 AngularJS 本身太臃肿，又对移动端的支持不是那么完善，因此它的替代者 Angular 出现了。

### Angular

虽然 Angular 在模式上一定程度上继承了 AngularJS，比如指令、双向绑定等，也有一些做了优化换了名字，比如 filter 改为 pipe 管道等，但是很多地方它的实现方式更加优化了，同时最大的改动是，它完全由 TypeScript 编写。因此从这个角度来看，Angular 完全是区别于 AngularJS 单独存在的，那它总共带来了哪些变化呢:

* 完全由 TypeScript 编写
* 提供 Angular CLI 脚手架
* 提供了更全面的生命周期钩子
* 提升移动端的性能和 [Ionic](https://ionicframework.com/docs/react/your-first-app) 的融合，提供 `@angular/service-worker` 组件，更易于实践 PWA
* 抛弃传统的 controller + $scope 的设计，拥抱组件式开发
* 集成 RxJS - 创建可观察对象，提供一系列操作符，替代 Promise，具体[参考我的这篇博客]( {{site.url}}/2018/03/21/es6-promise-observable.html )
* 修改脏检测机制，采用单向数据流
* AOT 预先编译机制 - 在浏览器下载和运行代码之前的编译阶段，AOT 会先把你的 Angular HTML 和 TypeScript 代码转换成高效的 JavaScript 代码，渲染更快，性能更好，体积更小

```JS
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.Emulated,
})

export class AppComponent {
  title = 'angular-demo';
}
```

对于双向数据绑定，Angular 通过 `Zone` 优化了脏检测的方式，采用**猴子补丁(Monkey-patched)**运行时动态替换的方式，将 JavaScript 中的异步任务都进行了包装，这使得这些异步任务都能运行在 Zone 的执行上下文中，每个异步任务在 Zone 中都是一个任务。从而实现了监听，然后去执行变化检测。对于 Angular，任何数据都是从顶部往底部流动，即单向数据流，而且我们可以通过 `onPush` 策略来控制哪些部分可以跳过检测，从而避免不必要的性能损耗。我们可以简单的看一下变化检测器的状态:

```JS
export declare enum ChangeDetectorStatus {
  CheckOnce = 0, // 表示在执行 detectChanges 之后，变化检测器的状态将会变成 Checked
  Checked = 1, // 表示变化检测将被跳过，直到变化检测器的状态恢复成 CheckOnce
  CheckAlways = 2, // 表示在执行 detectChanges 之后，变化检测器的状态始终为 CheckAlways
  Detached = 3, // 表示该变化检测器树已从根变化检测器树中移除，变化检测将会被跳过
  Errored = 4, // 表示在执行变化检测时出现异常
  Destroyed = 5 // 表示变化检测器已被销毁
}
```

> 同样，更多细节请[参考我的这篇博客]( {{site.url}}/2018/04/24/ng-bootstrap.html ) 👈

### React

**React** 是 facebook 于 2013 年推出的库，严格意义上并不是框架，它又带来了什么呢:

* 组件化，更灵活
* 利用 props 形成单向的数据流，根据 state 的变化来更新 view
* 万物皆可 JavaScript - JSX、[CSS In Js](2019/04/13/css-in-js.html)
* 利用虚拟 DOM 通过 diff 算法来提升渲染性能
* [React Hooks](2019/04/16/react-hooks.html)

React 作为一个库，优点就是灵活，但如果要开发项目时，就得入手 React 全家桶，虽然基本都是无缝式接入，但是还是要考虑其他依赖库的稳定性:

```JS
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById('hello-example')
);
```

> React 介绍可以[参考我的这篇博客]( {{site.url}}/2018/08/06/react-react-router.html ) 👈

### Vue

Vue 作为最后一个上场的，自然吸收了天地之精华，去粗取精，那么尤大又为它带来了什么呢:

* 模板
* 指令 - v，简化功能，只封装 DOM 操作
* 依赖注入
* 双向数据绑定
* 虚拟 DOM

额，这么一看，Vue 的确是在 AngularJS 和 React 身上取了不少经，但它自身也做了不少优化，比如指令简化了很多，双向数据绑定也是基于 `Object.defineProperty` 来实现，可以参考 [Vue 深入响应式原理]( {{site.url}}/2018/07/20/vue-reactivity-in-depth.html )。同时它也带来了新的一些特性，比如 computed 计算属性等:

```JS
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>
```

而 Vue3.0 也呼之欲出，我们可以提前看下它做出的一些变化，更多可以[参考这篇文章](https://juejin.im/post/5c3e89f651882524b333b3bd):

* 更小巧，对 `tree-shaking` 支持更好
* 采用 TypeScrip 重写，并增強对 TypeScript 的支持
* [Function-based api](https://zhuanlan.zhihu.com/p/68477600)

这个 api 写起来你会发现跟 React Hooks 极其相似，但是按照尤大的解释，性能上会好一些，而且写起来更简单:

```JS
# React Hooks
function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <button onClick={() => setCount(count - 1)}>add</button>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>remove</button>
    </div>
  );
}

# Vue Function-based
const App={
  template: `
    <div class="App">
      <button @click="addCount">add</button>
      <h2>{{count}}</h2>
      <button @click="removeCount">remove</button>
    </div>
  `,
  setup() {
    const count = value(0);
    const addCount = () => count.value++;
    const removeCount = () => count.value--;
    return {
      count,
      addCount,
      removeCount,
    }
  }
}
```

总结评价 Vue 的话，我觉得应该是"前启 Angular，后继 React"，毕竟它的确充分吸收了 Angular 和 React 这两位前辈的优点和长处，并更好的运用于自身。👍

> Vue 介绍可以[参考我的这篇博客]( {{site.url}}/2018/06/12/vue-profile.html ) 👈

## 他们在未来的发展趋势是什么

### 市场占有率及性能

三大框架目前市场趋势可以参考下面:

[谷歌趋势](https://trends.google.com/trends/?geo=US):

![angular-react-vue-google-trends.png](https://i.loli.net/2019/10/19/PG6g9eOfqKsdBCj.png)

[百度趋势](http://zhishu.baidu.com/v2/index.html#/):

![angular-react-vue-baidu-trends.png](https://i.loli.net/2019/10/19/EJGSiWtkLMNXpBn.png)

[npm 趋势](https://www.npmtrends.com):

![angular-react-vue-npm-trends.png](https://i.loli.net/2019/10/19/YCk84RHBo37Qg1A.png)

我们可以看到 Angular 和 React 在国际上使用还是很多的，而且发展趋于稳定，社区也比较强大。而 Vue 的话近几年发展速度很快，在国内已经达到很高的占有率，相比之下它的发展目前并不稳定。我们可以再看一看他们之间的[性能测试比较](https://www.stefankrause.net/js-frameworks-benchmark6/webdriver-ts-results/table.html):

![angular-react-vue-benchmark.png](https://i.loli.net/2019/10/21/qZJNmKtwMO1rnRu.png)

### 单向 or 双向数据绑定

数据绑定来说，单向和双向都有适合自己的场景，虽然双向绑定带来了很多便利，但仍有很多不容忽视的问题:

* 单向 - 实现简单，容易追踪数据变化
* 双向 - 实现复杂，不易追踪数据变化，但可以简化代码，数据模型和视图无缝同步，更适用于表单操作

### 状态管理

通过状态管理容器可以更方便管理数据和追踪变更，更容易维护和侦错。那是不是这样就完了，还有一个书写的问题，既然要有效管理这些数据，样板代码自然就多了，比如原生 redux 就一直被诟病，因此我们可以借助类似 `redux-sauce` 或者 `iron-redux` 来简化书写:

| Angular | React | Vue |
| ngrx/store | Mobx / Redux | Vuex |

### SSR

服务端渲染，相较于客户端渲染的两个比较大的优势:

* 更好的 SEO - 搜索引擎爬虫抓取工具可以直接查看完全渲染的页面
* 更快的内容到达时间 (time-to-content)，即首屏加载更快

| Angular | React | Vue |
| Angular Universal | Next | Nuxt |

### 支持原生开发

| Angular | React | Vue |
| Ionic / NativeScript | React-Native | Weex / NativeScript |

### CSS In JS or CSS Modules

CSS 模块化的解决方案有很多，主要是针对全局作用域问题，现主要有两类，具体[参考我的这篇博客]( {{site.url}}/2019/04/13/css-in-js.html ):

* CSS Modules - 采用 CSS，或者直接用 Sass/Less 预编译，搭配 webpack 使用
* CSS in JS - 抛弃 CSS，通过 JS 来写样式。缺点是不能利用成熟的 CSS 预处理器，复用性差，需要编辑器支持代码补全和高亮。目前比较好的集成于 React

### TypeScript

JS 的松散语法给我们带来便利的同时，也带来了一些隐患：一些（通常是低级的）错误，要等到运行时才会抛出来。而 **TypeScript** 增加了类型检查，加强了数据的可预测性，大大降低了 TypeError 的几率。代码的维护和重构也更加方便。具体细节可以[参考我的这篇博客]( {{site.url}}/2019/02/26/ts-profile.html ) 👈

> [Rollbar](https://rollbar.com)(类似 Sentry 可实时捕捉错误并汇集日志的平台) 于 2018 年总结的 [top10 JavaScript Errors](https://rollbar.com/blog/top-10-javascript-errors/)，大部分都可以杜绝

## 我应该选择哪一个

现代框架之间的差距日渐减少，在选型方面不用太过纠结，实在要说的话可以参考下:

* 大型项目 - Angular > React > Vue
* 中小型项目 - React > Vue > Angular
* 减少人力成本 - Vue > React > Angular
* 移动开发 - React > Angular > Vue

## 我学不动了怎么办

撸起袖子干

## 参考链接

1. [前端发展历程](https://juejin.im/post/5c130f6ee51d4571a157701f) By 411020382
2. [web2.0 時代](https://kknews.cc/tech/o53226p.html) By 前端探索旺
3. [前端三大框架数据流动和原理](https://recallhyx.github.io/2018/03/18/前端三大框架数据流动和原理/) By recallhyx
4. [React vs Angular vs Vue.js — What to choose in 2019?](https://medium.com/@TechMagic/reactjs-vs-angular5-vs-vue-js-what-to-choose-in-2018-b91e028fa91d) By TechMagic
5. [2019 年，Flutter 和 React Native 谁主沉浮](https://juejin.im/post/5d018eb8e51d4550723b13d9) By 前端小智
6. [给 2019 前端的 5 个建议](https://github.com/camsong/blog/issues/11) By camsong

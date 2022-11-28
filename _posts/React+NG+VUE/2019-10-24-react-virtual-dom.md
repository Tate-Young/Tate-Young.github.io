---
layout: blog
front: true
comments: True
flag: react
background: green
category: 前端
title:  React Virtual DOM
date:   2019-10-24 15:55:00 GMT+0800 (CST)
update: 2019-12-09 14:30:00 GMT+0800 (CST)
background-image: /style/images/smms/react.webp
tags:
- React
---
# {{ page.title }}

## Real DOM

为什么我们需要虚拟 DOM，因为更新真实 DOM 耗时耗力，我们可以先看下页面是怎么渲染构建的。根据 Webkit 渲染引擎工作流可总结以下五个步骤，具体可以[参考我的这篇博客]( {{site.url}}/2018/02/10/html-how-browsers-work.html ):

* HTML Parser 将 HTML 解析成 DOM;
* CSS Parser 将 CSS 解析成 CSSOM;
* 结合 DOM 和 CSSOM，生成一棵渲染树 Render Tree;
* 布局(layout)，计算每个节点的几何信息;
* 绘制(painting)，将渲染器的内容显示在屏幕上。

![webkit 渲染引擎](https://hackernoon.com/hn-images/1*4s99HTDCA0UUyOc39k5dag.png)

而当我们做如下操作，修改 DOM 的值时，它又会按照上述步骤来一遍。修改 n 遍就走 n 遍，性能自然就下来了:

```HTML
document.getElementById('elementId').innerHTML = "Tate & Snow"
```

## Virtual DOM

**Virtual DOM** 其实是通过 JavaScript 对象的形式来描述真实 DOM，它之所以更快是由于以下几点:

* 使用高效的 diff 算法来寻找变更
* 批量更新操作
* 高效地更新子节点
* 使用 observable 而不是脏检测

我们知道，在 state 或 props 更新的时候，就会触发组件的渲染，而在调用 Render 方法时，就会重新生成一个新的虚拟 DOM，再加上 React 启动时候生成的虚拟 DOM，我们就可以通过 diff 算法来比较两棵树的差异，从而以最小操作数来更新真实 DOM。那么它如何来查找这些差异的呢，主要有以下几个步骤:

1. 父节点更新则子节点全部更新 - 当然我们可以手动通过 hooks 等阻止不必要的渲染
2. 广度优先遍历 - 当遍历出来父节点被修改时，子节点就不用做多余的遍历了
3. [协调(Reconciliation)](https://www.reactjscn.com/docs/reconciliation.html) - 与真实 DOM 保持同步

![diff](https://i0.wp.com/programmingwithmosh.com/wp-content/uploads/2018/11/lnrn_0201.png?ssl=1)

有一些解决将一棵树转换为另一棵树的最小操作数算法问题的通用方案。然而，树中元素个数为 n，最先进的算法 的时间复杂度为 O(n^3) 。若我们在 React 中使用，展示 1000 个元素则需要进行 10 亿次的比较。这操作太过昂贵，相反，React 基于两点假设，实现了一个启发的 O(n) 算法。那么问题来了，为啥之前的先进算法时间复杂度都为 O(n^3)，而之后只有 O(n) 了呢，要回答这个问题可以依据[知乎这篇回答](https://www.zhihu.com/question/66851503/answer/246766239):

```TEXT
Prev                  Last
          A                     A  
         / \                   / \
        /   \                 /   \
       B     D     ====>     D     B
      /                             \
     C                               C
```

传统 Diff 算法的话，先要两两比对节点是否相同，时间复杂度为 O(n^2)，即:

```TEXT
PA -> LA
PA -> LB
PA -> LC
PA -> LD
PB -> LA
...
```

找到差异后还要计算最小转换方式，比如新增或删除，此时间复杂度为 O(n)，因此最终结果为 O(n^3)。React 的处理方式可以简化为以下，只用遍历一遍，因此时间复杂度为 O(n):

```TEXT
# 按叶子节点位置比较
PA -> LA   # 相同
PB -> LD   # 不同，删除 PB，添加 LD
PD -> LB   # 不同，更新
PC -> Null # Last 树没有该节点，所以删除 PC 即可
Null -> LC # Prev 树没有该节点，所以添加 C 到该位置
```

React 在更新节点上还遵循了以下两条规则，使得效率进一步提高:

* 两个不同类型的元素将产生不同的树 - 每当根元素有不同类型，React 将卸载旧树并重新构建新树。当比较两个相同类型的 React DOM 元素时，React 则会观察二者的属性，保持相同的底层 DOM 节点，并仅更新变化的属性
* 通过渲染器附带 key 属性 - 使用 key 来匹配原本树的子节点和新树的子节点，Keys 应该是稳定的，可预测的，且唯一的

第一点我们来举个栗子:

```JS
// 之前
<div>
  <Counter />
</div>

// 之后 - 将会销毁旧的 Counter 并重装新的 Counter
<span>
  <Counter />
</span>
```

```JS
// 之前
<div className="before" title="stuff" />

// 之后 - 仅更改底层 DOM 元素的 className
<div className="after" title="stuff" />
```

第二点我们来举个栗子，对比下不用 key 属性的后果:

```JS
// 不使用 key
// 之前
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

// 之后 - 会调整每个子节点，而不会保留未更改的子节点
<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

```JS
// 使用 key
// 之前
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

// 之后 - 只用新建 key='2014' 的子节点，其他子节点移动即可
<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

> 万不得已，你可以传递他们在数组中的索引作为 key。若元素没有重排，该方法效果不错，但重排会使得其变慢

## React Fiber

其实上述的协调比较广义，具体应该分为以下两个过程:

* **协调阶段**(reconciliation) - ：在这个阶段 React 会更新数据生成新的 Virtual DOM，然后通过 Diff 算法，快速找出需要更新的元素，放到更新队列中去，得到新的更新队列
* **渲染阶段**(commit) - 这个阶段 React 会遍历更新队列，将其所有的变更一次性更新到 DOM 上。commit 完成后，将执行 `componentDidMount` 函数

[React Fiber](https://github.com/acdlite/react-fiber-architecture) 是 React v16 发布的协调的新核心算法，即 `Fiber reconciler`，用以代替之前的 `Stack reconciler`。可以带来更好的性能优化，它是基于 `Scheduling`(决定工作什么时候执行)来实现的，总结来讲:

* pause work and come back to it later - 暂停工作，稍后回来
* assign priority to different types of work. - 为不同类型工作设置优先级
* reuse previously completed work. - 复用已经完成的工作
* abort work if it's no longer needed. - 中止不需要的工作

> The **reconciler** is the part of React which contains the algorithm used to diff one tree with another to determine which parts need to be changed

协调算法（Stack Reconciler）会一次同步处理整个组件树，来比较新旧两颗树，得到需要更新的部分。这个过程基于递归调用，一旦开始则很难去打断，而且涉及大量的计算就会堵塞整个主线程。因此我们可以根据优先级调整工作，使得大量的计算可以被拆解，异步化，浏览器主线程得以释放，保证了渲染的帧率，从而提高响应性。所以更优解是每次只做一个单元任务，然后回到主线程看下有没有什么更高优先级的任务需要处理，如果有则先处理，没有则继续执行:

![react-fiber]( {{site.url}}/style/images/smms/react-fiber.webp )

由于递归调用生成的调用栈我们本身无法控制，而 Fiber 实现了 **virtual stack frame**，可以去按需去手动控制。

> The advantage of reimplementing the stack is that you can keep stack frames in memory and execute them however (and whenever) you want. This is crucial for accomplishing the goals we have for scheduling.

React 主要使用 [**requestIdelCallback**](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback) API 来实现这种特性，对于不支持的会自动加上 pollyfill。通常客户端线程执行任务时会以帧的形式划分，大部分设备控制在 30-60 帧是不会影响用户体验；在两个执行帧之间，主线程通常会有一小段空闲时间，requestIdleCallback 可以在这个**空闲期（Idle Period）**调用**空闲期回调（Idle Callback）**从而执行一些任务:

![react-requestIdelCallback]( {{site.url}}/style/images/smms/react-requestIdelCallback.webp )

通过将协调过程，分解成小的工作单元的方式，可以让页面对于浏览器事件的响应更加及时。但是另外一个问题还是没有解决，就是如果当前在处理的 react 渲染耗时较长，仍然会阻塞后面的渲染。这就是为什么 `fiber reconciler` 增加了优先级策略:

```JS
module.exports = {
  NoWork: 0, // No work is pending.
  SynchronousPriority: 1, // For controlled text inputs. Synchronous side-effects.
  AnimationPriority: 2, // Needs to complete before the next frame.
  HighPriority: 3, // Interaction that needs to complete pretty soon to feel responsive.
  LowPriority: 4, // Data fetching, or result from updating stores.
  OffscreenPriority: 5, // Won't be visible but do the work in case it becomes visible.
}
```

另一方面由于协调阶段会被打断，可能会导致 commit 前的这些生命周期函数多次执行。react 官方目前已经把 `componentWillMount`、`componentWillReceiveProps` 和 `componetWillUpdate` 标记为 `unsafe`，并使用新的生命周期函数 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 进行替换。

![react-fiber-phase]( {{site.url}}/style/images/smms/react-fiber-phase.webp )

> 我们可以看下 youtube 发布的 stack 与 fiber 对比视频，[戳这里](https://www.youtube.com/watch?v=Qu_6ItnlDQg) 👈。完整[视频戳这里](https://www.youtube.com/watch?v=ZCuYPiUIONs) 👈

## snabbdom

Vue 则是基于 [**snabbdom**](https://github.com/snabbdom/snabbdom) VDOM 库来实现 diff 算法，它专注于使用的简单以及功能和的模型化，并在效率和性能上有着很好的表现。

在 snabbdom 中提供了 `h` 函数做为创建 VDOM 的主要函数，h 函数接受的三个参数同时揭示了 diff 算法中关注的三个核心：节点类型，属性数据，子节点对象。而 `patch` 方法即是用来创建初始 DOM 节点与更新 VDOM 的 diff 核心函数。一个使用 snabbdom 创建的 demo 是这样的:

```JS
import snabbdom from 'snabbdom';
import h from 'snabbdom/h'; // helper function for creating vnodes

const patch = snabbdom.init([
  require('snabbdom/modules/class'),          // makes it easy to toggle classes
  require('snabbdom/modules/props'),          // for setting properties on DOM elements
  require('snabbdom/modules/style'),          // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners'), // attaches event listeners
]);

var vnode = h('div', {style: {fontWeight: 'bold'}}, 'Hello world');
patch(document.getElementById('placeholder'), vnode)
```

> Therefore, the mainstream diff algorithm of VirtualDOM tends to be consistent at present. In the main diff idea, snabbdom and react have basically the same reconilation method.

## 参考链接

1. [Virtual DOM in ReactJS](https://hackernoon.com/virtual-dom-in-reactjs-43a3fdb1d130) By Rupesh Mishra
2. [React Virtual DOM Explained in Simple English](https://programmingwithmosh.com/react/react-virtual-dom-explained/) By Mosh Hamedani
3. [学习与理解 React Fiber](https://github.com/creeperyang/blog/issues/44) By creeperyang
4. [知乎 - 如何理解 React Fiber 架构？](https://www.zhihu.com/question/49496872)
5. [React Fiber](https://juejin.im/post/5ab7b3a2f265da2378403e57) - 妖僧风月
6. [探索 Virtual DOM 的前世今生](https://zhuanlan.zhihu.com/p/35876032) - 郭羽峰

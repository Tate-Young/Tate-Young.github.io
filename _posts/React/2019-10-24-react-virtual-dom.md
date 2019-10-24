---
layout: blog
front: true
comments: True
flag: react
background: green
category: 前端
title:  React Virtual DOM
date:   2019-10-24 15:55:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/08/03/5b63ed4d906cd.png
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

### 协调 Reconciliation

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

有一些解决将一棵树转换为另一棵树的最小操作数算法问题的通用方案。然而，树中元素个数为 n，最先进的算法 的时间复杂度为 O(n3) 。若我们在 React 中使用，展示 1000 个元素则需要进行10 亿次的比较。这操作太过昂贵，相反，React 基于两点假设，实现了一个启发的 O(n) 算法:

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

### React Fiber

[React Fiber](https://github.com/acdlite/react-fiber-architecture) 是 React v16 发布的协调的新核心算法，即 `Fiber reconciler`，用以代替之前的 `Stack reconciler`。可以带来更好的性能优化，它是基于 `Scheduling`(决定工作什么时候执行)来实现的，总结来讲:

* pause work and come back to it later - 暂停工作，稍后回来
* assign priority to different types of work. - 为不同类型工作设置优先级
* reuse previously completed work. - 复用已经完成的工作
* abort work if it's no longer needed. - 中止不需要的工作

协调算法（Stack Reconciler）会一次同步处理整个组件树，来比较新旧两颗树，得到需要更新的部分。这个过程基于递归调用，一旦开始则很难去打断，而且涉及大量的计算就会堵塞整个主线程。因此我们可以根据优先级调整工作，使得大量的计算可以被拆解，异步化，浏览器主线程得以释放，保证了渲染的帧率，从而提高响应性。

> The **reconciler** is the part of React which contains the algorithm used to diff one tree with another to determine which parts need to be changed

> 我们可以看下 youtube 发布的 stack 与 fiber 对比视频，[戳这里](https://www.youtube.com/watch?v=Qu_6ItnlDQg) 👈。完整[视频戳这里](https://www.youtube.com/watch?v=ZCuYPiUIONs) 👈

### batch update

根据 diff 算法找到需要更新的节点之后，为了考虑性能的影响，React 并没有直接去更新真实 DOM，而是将这些操作进行打包，统一更新。

## 参考链接

1. [Virtual DOM in ReactJS](https://hackernoon.com/virtual-dom-in-reactjs-43a3fdb1d130) By Rupesh Mishra
2. [React Virtual DOM Explained in Simple English](https://programmingwithmosh.com/react/react-virtual-dom-explained/) By Mosh Hamedani
3. [学习与理解 React Fiber](https://github.com/creeperyang/blog/issues/44) By creeperyang
4. [知乎 - 如何理解 React Fiber 架构？](https://www.zhihu.com/question/49496872)

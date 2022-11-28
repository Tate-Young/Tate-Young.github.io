---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  事件代理
date:   2018-03-26 14:38:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- JavaScript
---
# {{ page.title }}

## 事件流

几个重要的事件定义:

* **事件流** - 描述的是从页面中接收事件的顺序
* **事件** - 用户或浏览器自身执行的某种动作。比如 click、load、mouseover 等
* **事件处理程序** - 响应某个事件的函数就叫事件处理程序(或事件侦听器)

DOM 事件流主要包括三个阶段:

* **事件捕获(event capturing)** - 事件的传播是从最特定的事件目标到最不特定的事件目标。实际目标(`<div>`)在捕获阶段不会接收事件
* 处于目标阶段 - 实际的目标接收到事件，但是事件处理会被看成是冒泡阶段的一部分
* **事件冒泡(event bubbling)** - 事件的传播是从最不特定的事件目标到最特定的事件目标

![event-bubbling]( {{site.url}}/style/images/smms/event-bubbling.webp )

然而需要注意的是:

* 尽管 "DOM2级事件" 标准规范明确规定事件捕获阶段不会涉及事件目标，但是在 IE9、Safari、Chrome、Firefox 和 Opera9.5 及更高版本都会在捕获阶段触发事件对象上的事件。即在实际目标上可能会触发两次事件操作。
* 并非所有的事件都会经过冒泡阶段 。所有的事件都要经过捕获阶段和处于目标阶段，但是有些事件会跳过冒泡阶段，如 focus 和 blur。

## 事件模型

### DOM0 级事件

**DOM0 级事件**又称为原始事件模型，在该模型中，事件不会传播，即没有事件流的概念。事件绑定监听函数比较简单, 有两种方式:

* 内联事件 - 标签中的事件
* 动态绑定 - on + 事件名

```HTML
<!-- 内联 -->
<button id="myBtn" onclick="sayName()">click</button>
```

```JS
// 动态绑定
// 一个 DOM 对象只能注册一个类型的事件，否则覆盖
// 事件处理程序在当前元素的作用域中运行，this 指向当前元素
var btn = document.getElementById('myBtn')[];
btn.onclick = _ => console.log(this.id); // 'myBtn'

// 移除绑定事件
btn.onclick = null;
```

> 为什么木有 DOM1 级事件 ? 是因为 DOM1 标准中并没有定义事件相关的内容 😳。

### DOM2 级事件

#### addEventListener

**DOM2 级事件** 新增两个方法用来添加和移除事件处理程序，第三个参数表示采取哪种事件流处理程序，默认为 false，即冒泡；true 为捕获:

* **addEventListener()**
* **removeEventListener()**

```JS
// 一个 DOM 对象能够注册一个类型的多个事件，依次触发
btn.addEventListener('click', handler, false); // 冒泡

btn.addEventListener('click', function() {
  alert(this.id);
}, false);
```

```JS
// 移除事件监听，注意要对应同一个事件才有效。若直接采用匿名函数表示，则会识别成不同函数，此时移除无效
btn.removeEventListener('click', handler, false); // 有效

btn.removeEventListener('click', function() {
  alert(this.id);
}, false); // 无效
```

#### attachEvent

IE 事件处理程序实现了与 DOM 中类似的两个方法:

* **attachEvent()**
* **detachEvent()**

由于 IE8 及更早版本只支持冒泡事件，因此只能将添加的事件程序添加到冒泡阶段，且与 DOM0 级的主要区别是事件处理程序的作用域，皆为全局作用域:

```JS
// 和 DOM0 一样采用 on + 事件名
// attachEvent 方法也可对一个 DOM 对象注册一个类型的多个事件，但会反向触发
btn.attachEvent('onclick', _ => console.log(this === window)); // true

btn.attachEvent('onclick', _ => console.log('tate'); // 'tate' 先触发
```

#### 兼容写法

跨浏览器的事件处理的兼容性写法:

```JS
var EventUtil = {
  // 添加句柄
  addHandler(ele, type, handler) {
    if (ele.addEventListener) {
      ele.addEventListener(type, handler, false);
    } else if (ele.attachEvent) { // 兼容 IE8 及以下
      ele.attachEvent('on' + type, handler);
    } else {
      ele['on' + type] = handler;
    }
  },
  // 删除句柄
  removeHandler(ele, type, handler) {
    if (ele.removeEventListener) {
      ele.removeEventListener(type, handler, false);
    } else if (ele.detachEvent) {
      ele.detachEvent('on' + type, handler);
    } else {
      ele['on' + type] = null;
    }
  }
}
```

## 事件对象

当一个事件被触发时，会产生一个**事件对象(event)**, 这个对象里面包含了与该事件相关的属性或者方法。DOM 和 IE 中的事件常用对象相比较:

| 作用 | DOM | IE |
|:--------------|:---------|:---------|
| 获取事件类型 | `event.type` | `event.type` |
| 获取事件源 | `event.target` | `event.srcElement` |
| 阻止默认行为 | `event.preventDefault()` | `event.returnValue = false` |
| 阻止冒泡行为 | `event.stopPropagation()` | `event.cancelBubble = true` |

DOM 事件中还有个 `currentTarget` 属性，与 `target` 的区别是:

* **target** - 实际触发事件的目标
* **currentTarget** - 事件绑定的元素，总是与 this 指向一致

DOM 事件中还可以通过 `stopPropagation` 阻止冒泡行为，与 `stopImmediatePropagation` 的区别是:

* **stopPropagation()** - 阻止冒泡行为
* **stopImmediatePropagation()** - 同上，且当一个事件有多个事件处理程序时，该方法可以阻止之后事件处理程序被调用

在 DOM 事件中，兼容 DOM 的浏览器都会将一个 event 对象作为参数传入到事件处理程序中，而 IE 事件中的 event 是一个 window 全局对象:

```JS
// DOM 事件
btn.addEventListener('click', (event) => {
  console.log(event.type); // 'click'
}, false);

// IE 事件
btn.attachEvent('onclick', _ => console.log(window.event.type)); // 'click'
```

跨浏览器的事件对象的兼容性写法:

```JS
var EventUtil = {
  // 获取事件对象
  // IE 模型中 event 是一个全局唯一的对象绑定在 window 对象上
  getEvent(event) {
    return event ? event : window.event;
  },
  // 获取类型
  getType(event) {
    return event.type;
  },
  getElement(event) {
    return event.target || event.srcElement;
  },
  // 阻止默认事件
  preventDefault(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  // 阻止冒泡
  stopPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
}
```

## 事件代理

事件在冒泡过程中会上传到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为**事件代理(Event delegation)**。事件代理利用了事件冒泡，只指定一个事件处理程序，便可以管理某一类型的所有事件。

<script async src="//jsfiddle.net/4eyhd7zy/10/embed/js,html,result/"></script>

```HTML
<ul id="color-list">
  <li>red</li>
  <li>yellow</li>
  <li>green</li>
  <li>orange</li>
  <!-- ...动态扩展 -->
</ul>
```

```JS
var colorList = document.getElementById('color-list');
var liArr = colorList.querySelectorAll('ul li');

colorList.addEventListener('click', showColor, false);

function showColor(ev) {
  var event = ev || window.event;
  var targetElement = event.target || event.srcElement;

  var content = targetElement.innerHTML; // 获取标签内容
  var index = [].indexOf.call(liArr, targetElement); // 获取索引值

  if (targetElement.nodeName.toLowerCase() === 'li') {
    alert(index + ' : ' + content);
  }
}
```

## 事件模拟

**createEvent()** - 生成一个事件对象，参数是事件类型，比如:

| 事件类型 | 事件初始化方法 |
|:--------------|:---------|
| UIEvents | event.initUIEvent |
| MouseEvents | event.initMouseEvent |
| MutationEvents | event.initMutationEvent |
| HTMLEvents | event.initEvent |
| Event | event.initEvent |
| CustomEvent | event.initCustomEvent |
| KeyboardEvent | event.initKeyEvent |

**dispatchEvent()** - 当前节点上触发指定事件，从而触发监听函数的执行，参数是一个 Event 对象的实例，如果在事件传播过程中调用了 event.preventDefault 方法，则返回 false，否则返回 true。IE 用 fireEvent()

```JS
document.addEventListener('myEvent', function (event) {
  console.log('Name: %s, Age: %d', event.name, event.age); // Name: tate, Age: 18
}, false);

//创建 event 的对象实例。
var event = document.createEvent('HTMLEvents');
// 3个参数：事件类型，是否冒泡，是否阻止浏览器的默认行为
event.initEvent('myEvent', true, true);
// 自定义事件属性，只要你开心
event.name = 'tate';
event.age = 18;

//触发自定义事件
document.dispatchEvent(event);
```

IE 为 **createEventObject()**，不接受参数，返回通用 event 对象:

```JS
var event = document.createEventObject();
event.bubbles = true;
event.cancelable = true;
event.name = 'tate';
targetElement.fireEvent('onmouseover', event); // 触发事件
```

模拟事件示例如下:

<script async src="//jsfiddle.net/Tate_Young/ysmr0vLq/1/embed/js,html,result/"></script>

## 参考链接

1. [javaScript事件(一) 事件流](https://www.cnblogs.com/starof/p/4066381.html) By starof
1. [JS 事件模型](https://segmentfault.com/a/1190000006934031) By simon_woo
1. [事件触发器 - dispatchEvent](https://blog.csdn.net/magic__man/article/details/51831227) By magic__man
1. [深入理解 DOM 事件机制系列第四篇 —— 事件模拟](https://www.cnblogs.com/xiaohuochai/p/5880851.html) By 小火柴的蓝色理想

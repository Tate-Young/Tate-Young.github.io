---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  Touch & Drag 事件
date:   2018-03-28 09:52:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- JavaScript
---
# {{ page.title }}

## Touch 事件

**TouchEvent** 是一类描述手指在触摸平面(如触摸屏、触摸板等)的状态变化的事件。**TouchList** 对象代表多个触点的一个列表。每个 **Touch** 对象代表一个触点，每个触点都由其位置、大小、形状、压力大小和目标 element 描述。

### 触摸事件类型

主要有以下几种:

* **touchstart** - 当用户在触摸平面上放置了一个触点时触发
* **touchmove** - 当用户在触摸平面上移动触点时触发
* **touchend** - 当一个触点被用户从触摸平面上移除时触发
* **touchcancel** - 当触点由于某些原因被中断时触发，如由于某个事件取消了触摸或触点个数超过了设备支持的个数

```JS
document.addEventListener('touchstart', touchEvent ,false);
```

### TouchList

每个触摸事件被触发后，会生成一个 event 对象，event 对象里额外包括以下三个触摸列表:

* **touches** - 包含了所有当前接触触摸平面的触点的 Touch 对象
* **targetTouches** - 是包含了如下触点的 Touch 对象：触摸起始于当前事件的目标 element 上，并且仍然没有离开触摸平面的触点
* **changedTouches** - 包含了代表所有从上一次触摸事件到此次事件过程中，状态发生了改变的触点的 Touch 对象

### Touch

这些列表里的每次触摸由 Touch 对象组成，Touch 对象里包含着触摸信息，主要属性如下:

```JS
{
  screenX: 511,
  screenY: 400, // 触点相对于屏幕左边沿的Y坐标
  clientX: 244.37899780273438,
  clientY: 189.3820037841797, // 相对于可视区域
  pageX: 244.37,
  pageY: 189.37, // 相对于 HTML 文档顶部，当页面有滚动的时候与 clientX=Y 不等
  force: 1, // 压力大小，是从0.0(没有压力)到1.0(最大压力)的浮点数
  identifier: 1036403715, // 一次触摸动作的唯一标识符
  radiusX: 37.565673828125,  // 能够包围用户和触摸平面的接触面的最小椭圆的水平轴(X轴)半径
  radiusY: 37.565673828125,
  rotationAngle: 0, // 它是这样一个角度值：由 radiusX 和 radiusY 描述的正方向的椭圆，需要通过顺时针旋转这个角度值，才能最精确地覆盖住用户和触摸平面的接触面
  target: {}  // 此次触摸事件的目标 element
}
```

查看以下 JSFiddle 示例:

<script async src="//jsfiddle.net/Tate_Young/heyp0jxd/5/embed/"></script>

### Touch 案例

做一个移动端触摸点，仅限于屏幕窗口内移动，也可响应点击事件:

<script async src="//jsfiddle.net/Tate_Young/vjgpdqLt/25/embed/"></script>

```JS
var doc = document;
var screenW = doc.body.clientWidth || screen.width;
var screenH = doc.body.clientHeight || screen.height;
var width = 48;
var isMoved = false;
var backToTop = doc.querySelector('.back-to-top');

backToTop.addEventListener('touchstart', touchstart, false);
backToTop.addEventListener('touchmove', touchmove, false);
backToTop.addEventListener('touchend', touchend, false);

function touchstart(ev) {
  isMoved = false;
}

function touchmove(ev) {
  isMoved = true;

  var event = getEvent(ev);
  var coordinateX = event.changedTouches[0].clientX;
  var coordinateY = event.changedTouches[0].clientY;
  var left = parseFloat(coordinateX) - 20;
  var top = parseFloat(coordinateY) - 20;

  left = left <= 1.45 ? 1.45 : (left >= screenW - width ? screenW - width : left);
  top = top <= 1 ? 1 : (top >= screenH - width ? screenH - width : top);

  backToTop.style.left = left + 'px';
  backToTop.style.top = top + 'px';
  console.log('left: %f, top: %f', left, top);
}

function touchend(ev) {
  !isMoved && alert('click');
}

function getEvent(ev) {
  return ev ? ev : window.event;
}
```

## Drag 事件

**DragEvent** 鼠标进行拖拽(drag)和释放(drop)，一定要设置可拖拽目标，即设置属性 `draggable="true"`。

### 拖拽事件类型

* 被拖动的源对象可以触发的事件:
  * **dragstart** - 源对象开始被拖动
  * **drag** - 源对象被拖动过程中(鼠标可能在移动也可能未移动)
  * **dragend** - 源对象被拖动结束
* 拖动源对象到目标对象可以触发的事件:
  * **dragenter** - 源对象拖动进入目标对象时触发
  * **dragover** - 源对象拖动经过目标对象时触发
  * **dragleave** - 源对象拖动离开目标对象时触发
  * **drop** - 源对象放置于目标对象上时触发

### DataTransfer

拖拽事件周期中会初始化一个 DataTransfer 对象,用于保存拖拽数据和交互信息:

* dropEffect - 拖拽交互类型,通常决定浏览器如何显示鼠标光标并控制拖放操作.常见的取值有 copy、move、link、none
* effectAllowed - 指定允许的交互类型,可以取值: copy、move、link、copyLink、copyMove、limkMove、all、none，默认为 uninitialized(允许所有操作)
* **files** - 包含 File 对象的 FileList 对象，一般用于从本地向浏览器拖放文件.
* types - 保存 DataTransfer 对象中设置的所有数据类型.
* **setData(format, data)** - 以键值对设置数据,format 通常为数据格式,如 text、text/html
* **getData(format)** - 获取设置的对应格式数据,format 与 setData()中一致
* clearData(format) - 清除指定格式的数据
* setDragImage(imgElement, x, y) - 设置自定义图标

```JS
draggableElement.addEventListener('dragstart', function (event) {
  event.dataTransfer.setData('text', 'Hello World');
}, false);

draggableElement.ondragstart = function(event) {
  event.dataTransfer.setData('text', 'Hello World');
}
```

### Drag 案例

做一个 web 端触摸点，仅限于屏幕窗口内移动:

```JS
var doc = document;
var screenW = doc.body.clientWidth || screen.width;
var screenH = doc.body.clientHeight || screen.height;
var width = 48;
var offsetX = 0;
var offsetY = 0;
var backToTop = doc.querySelector('.back-to-top');

backToTop.addEventListener('dragstart', ondragstart, false);
backToTop.addEventListener('drag', ondrag, false);
backToTop.addEventListener('dragend', ondragend, false);

function ondragstart(ev) {
  var event = getEvent(ev);
  offsetX = event.offsetX;
  offsetY = event.offsetY;
}

function ondrag(ev) {
  var event = getEvent(ev);
  var coordinateX = event.clientX;
  var coordinateY = event.clientY;
  if (coordinateX === 0 && coordinateY === 0) {
    return; // 不处理拖动最后一刻X和Y都为0的情形
  }
  coordinateX -= offsetX;
  coordinateY -= offsetY;

  coordinateX = coordinateX <= 0 ? 0 : (coordinateX >= screenW - width ? screenW - width : coordinateX);
  coordinateY = coordinateY <= 0 ? 0 : (coordinateY >= screenH - width ? screenH - width : coordinateY);

  backToTop.style.left = coordinateX + 'px';
  backToTop.style.top = coordinateY + 'px';
  console.log('left: %f, top: %f', coordinateX, coordinateY);
}

function ondragend(ev) {
  console.log('drag end');
}
```

做一个垃圾回收示例 JSFiddle:

<script async src="//jsfiddle.net/Tate_Young/wb0dxtaj/6/embed/"></script>

拖拽图片预览 JSFiddle:

<script async src="//jsfiddle.net/Tate_Young/v7ccwr1L/6/embed/"></script>

## 事件对象的位置

* pageX = clientX + ScrollLeft(滚动条水平滚动距离)
* pageY = clientY + ScrollTop(滚动条垂直滚动距离)

![event-clientX.png]( {{site.url}}/style/images/smms/event-clientX.png )

## 参考链接

1. [MDN - TouchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent)
1. [移动端 Touch 事件介绍](http://caibaojian.com/mobile-touch-event.html) By kujian
1. [js 中的 touch 事件及 gesture(手势)事件详解 — 第13.4.9节](https://blog.csdn.net/flyingpig2016/article/details/53737348) By flyingpig2016
1. [原生拖拽,拖放事件(drag and drop)](https://segmentfault.com/a/1190000002810962) By qiu_deqing
1. [HTML5 -- 拖拽 API(含超经典例子)](https://blog.csdn.net/baidu_25343343/article/details/53215193) By 冯小东
1. [一张图轻松搞懂 javascript event 对象的 clientX、offsetX、screenX、pageX 区别](https://www.2cto.com/kf/201409/333401.html) By ruoyiqing

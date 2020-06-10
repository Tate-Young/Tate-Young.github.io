---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  JS 垃圾处理机制
date:   2020-02-13 15:09:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- JavaScript
---
# {{ page.title }}

## JS 垃圾回收

**垃圾回收(Garbage Collection)** 是一种自动的内存管理机制。当一个电脑上的动态内存不再需要时，就应该予以释放，以让出内存，从而不会出现内存泄漏问题。对于 JavaScript 也一样，我们知道不管是创建基础类型还是对象、函数等，都要用到内存，那么一旦我们不需要它了，JS 引擎如何去判断和清除呢？一般来讲有两种通用的方式来管理内存，即**标记清除**和**引用计数**。

## 标记清除

### 可达性

这里引用 JAVASCRIPT.INFO 里的[这篇文章](https://javascript.info/garbage-collection#reachability)来讲述。同时这里会引入到一个概念，即**可达性(Reachability)**。它指的就是在某些条件下能够访问或使用的值，而这些值是确保存储于内存当中的，也称之为**根(roots)**。比如全局变量、函数中的局部变量和参数等。

```JS
// user has a reference to the object
let user = {
  name: "Tate"
}
```

从上述栗子我们可以看到，全局变量 `user` 引用了对象 `{name: "Tate"}`，不妨简称为对象 `Tate`，如果我们覆盖 `user` 的值会怎样:

```JS
user = null
```

现在 `Tate` 是不可达的，因为它没有被引用，因此该数据会被清理而释放内存。假设我们定义了 `user` 和 `admin` 两个引用呢:

```JS
let admin = user
user = null
```

可想而知，`Tate` 仍然被引用，我们可以通过全局变量 `admin` 去访问，因此它并不会被清理，除非我们再次覆盖 `admin` 的值。

### 算法机制

上述只是一个简单的栗子，现实环境中肯定比这复杂很多，那么我们就需要一个算法来支撑，即**标记清除(mark-and-sweep)**，它定期会执行一次，步骤如下:

1. 垃圾回收器首先标记所有根(roots)
2. 访问和标记所有来自根的引用
3. 访问所标记的对象并继续标记他们的引用。注意所有访问过的对象会被标记，从而防止重复访问
4. 依次反复至所有可达引用被访问和标记
5. 所有未被标记的对象将被回收清除

![js-garbage-collection.png]( {{site.url}}/style/images/smms/js-garbage-collection.png )

当然 JS 引擎也做了一些优化，使其运行得更快，不至于影响正常代码的执行:

* **分代回收(Generational collection)** - 将对象分为“新对象”和“旧对象”。对于新对象而言，他们经常会被检测，从而被清除。那些幸存下来活得足够久的对象，会变“老”，接受检查的次数也会相应减少
* **增量回收(Incremental collection)** - 一次性访问和标记整个对象集显然很笨拙。因此，引擎会试图将垃圾回收分解为多个部分，然后各个击破。当然这需要额外的标记来跟踪变化，但是延迟会更小
* **空闲时间回收(Idle-time collection)** - 只在 CPU 空闲时运行，最大限度减少对正常执行的影响。

简而言之，我们可以得出以下一些结论:

* 垃圾回收是自动进行的，我们没办法去干涉
* 当对象是可达的，那么它必然是存储在内存当中的
* 被引用和可达不是一回事，就像上面栗子一样，即使有相互引用，但我们无法访问，依然会被回收清除

## 引用计数

之前有段时间学过 OC，emmm...，记得当时它内存管理的方式就是**引用计数(reference counting)**，即跟踪记录每个值被引用的次数。简而言之，就是当一个值被引用时，则该值的引用次数加 1，反之则减 1，为 0 时就会被回收。目前应该只存在于低版本的 IE。

但是该方式会引起内存泄漏，原因是它不能解决循环引用的问题，让我们来看下面这个栗子:

```JS
function test() {
  var a = {}
  var b = {}
  a.prop = b
  b.prop = a
}
```

我们可以看到每次调用 `test` 函数，a 和 b 相互引用，引用计数都为 2，会使这部分内存永远不会被释放，即造成内存泄漏。这种时候就需要手动去间接触发内存的释放，比如之前博客谈到的[闭包栗子里对 DOM 对象的引用]( {{site.url}}/2018/02/09/js-closure.html ):

```JS
function assignHandler() {
  var element = document.getElementById('someElement');
  element.onclick = function() {
    alert(element.id);
  };
}
```

```JS
// better
function assignHandler() {
  var element = document.getElementById('someElement');
  var id = element.id;
  element.onclick = function() {
    alert(id);
  };

  element = null;
}
```

## 内存泄漏

虽然有垃圾回收机制，但是我们仍然要关注以下这些可能带来的内存泄漏问题:

1. 全局变量 - 由于全局变量运行时不会被回收，因此需要及时手动去清理，比如运用规范校验或者严格模式
2. 闭包 - 闭包可以维持函数内局部变量，使其得不到释放，不宜滥用
3. DOM 对象引用 - 如上栗。如果某个 DOM 元素，在 js 中也持有它的引用时，那么它的生命周期就由 js 和是否在 DOM 树上两者决定
4. 遗忘的定时器和回调 - 没有及时清除定时器，尤其是持有该页面某些内容，如 setTimeout 和 setInterval

## 参考链接

1. [Garbage collection](https://javascript.info/garbage-collection#reachability)
2. [A tour of V8: Garbage Collection](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection)
3. [js 的内存泄漏场景、监控以及分析](https://www.cnblogs.com/dasusu/p/12200176.html) By dasu

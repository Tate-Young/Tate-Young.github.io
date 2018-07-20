---
layout: blog
tool: true
comments: True
flag: Vue
background: green
category: 前端
title:  Vue 深入响应式原理
# date:   2018-06-12 20:00:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/06/12/5b1f2d120e9e6.jpg
tags:
- Vue
---
# {{ page.title }}

## 更新检测

关于 Vue 如何实现响应式，可[参考官方文档](https://cn.vuejs.org/v2/guide/reactivity.html)，用一句话概括即: 当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 **Object.defineProperty** 把这些属性全部转为 **getter/setter**。每个组件实例都有相应的 **watcher** 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

关于如何理解 Object.defineProperty，可以参考以下示例:

```JS
var obj = {};
var name;
Object.defineProperty(obj, 'name', {
  get: function() {
    console.log('get name');
    return name;
  },
  set: function(newVal) {
    console.log('set name:' + newVal);
    name = newVal;
  }
});
obj.name; // get name
obj.name = 'tate'; // set name: tate
```

![Vue 响应式原理](https://cn.vuejs.org/images/data.png)

### 数组

Vue 包含一组观察数组的变异方法，所以它们也将会触发视图更新。这些方法比如有 push、pop、splice、sort 等；相反 filter、slice、concat 等方法不会改变原数组，所以不会触发视图更新，是非常高效的操作。举个栗子 🌰:

```JS
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```

解决方案:

```JS
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)

// 等价于 vm.$set 实例方法
vm.$set(vm.items, indexOfItem, newValue)

// 或者转换为变异方法
vm.items.splice(indexOfItem, 1, newValue)
```

### 对象

Vue 不能检测对象属性的添加或删除:

```JS
var vm = new Vue({
  data: {
    a: 1 // `vm.a` 现在是响应式的
  }
})

vm.b = 2 // `vm.b` 不是响应式的
```

当然可以采用上述数组中的 Vue.set 方法，如果利用 Object.assign 方法添加新的响应式属性:

```JS
// bad
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})

// good
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

### $nextTick

Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。

例如，当你设置 vm.someData = 'new value' ，该组件不会立即重新渲染。当刷新队列时，组件会在事件循环队列清空时的下一个“tick”更新。为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 **Vue.nextTick(callback)** 。这样回调函数在 DOM 更新完成后就会调用。

```JS
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

在组件内使用 **vm.$nextTick()** 实例方法特别方便，因为它不需要全局 Vue ，并且回调函数中的 this 将自动绑定到当前的 Vue 实例上:

```JS
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: '没有更新'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = '更新完成'
      console.log(this.$el.textContent) // => '没有更新'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => '更新完成'
      })
    }
  }
})
```

## 参考链接

1. [Vue 中文官网](https://cn.vuejs.org/)
2. [Vue2.0 源码阅读：响应式原理](https://zhouweicsu.github.io/blog/2017/03/07/vue-2-0-reactivity/) By zhouweicsu

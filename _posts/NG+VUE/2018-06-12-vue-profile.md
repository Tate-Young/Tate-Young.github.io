---
layout: blog
tool: true
comments: True
flag: Vue
background: green
category: 前端
title:  Vue 简介
date:   2018-06-12 20:00:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/06/12/5b1f2d120e9e6.jpg
tags:
- Vue
---
# {{ page.title }}

## Vue 实例

每个 Vue 应用都是通过创建一个新的 Vue 实例开始的，创建时都要经过一系列的初始化过程。如需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数。

```JS
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})

app.message // 'Hello Vue.js!'
app.$data // { message: 'Hello Vue.js' }
app.$el // document.getElementById('app')

// $watch 是一个实例方法，也可以直接提供监听属性 watch
app.$watch('message', function(newValue, oldValue) {
  // 这个回调将在 `app.message` 改变后调用
})
```

```HTML
<div id="app">
  <p>{ { message } }</p>
</div>
```

在每个 new Vue 实例的子组件中，其根实例可以通过 $root 属性进行访问，如 <code>this.$root.message</code>。

## 组件 component

### 组件注册

组件是可复用的 Vue 实例，为了能在模板中使用，这些组件必须先注册以便 Vue 能够识别。这里有两种组件的[注册类型](https://cn.vuejs.org/v2/guide/components-registration.html)：全局注册和局部注册。在注册之后可以用在任何新创建的 Vue 根实例 (new Vue) 的模板中:

```JS
// 定义一个名为 button-counter 的新组件，且为全局注册
// 与 Vue 实例接收相同的选项，除了 el 这样根实例特有的选项
Vue.component('button-counter', {
  data: function() { // 注意组件的 data 必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me { { count } } times.</button>'
})
new Vue({ el: '#components-demo' })
```

```HTML
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

### 数据传递 Prop

#### 静态和动态传值

为了复用和解耦，Prop 可以在组件上注册自定义特性，一个组件默认可以拥有任意数量的 prop，任何值都可以传递给任何 prop:

```JS
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{ { title } }</h3>'
})
```

```HTML
<!-- 静态传值，注意此处不能用 :title -->
<blog-post title="My journey with Vue"></blog-post>
<blog-post title="Tate and Snow"></blog-post>
```

再举个常见动态传值的栗子:

```JS
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue' },
      { id: 2, title: 'Blogging with Vue' },
      { id: 3, title: 'Why Vue is so fun' },
    ]
  }
})
```

```HTML
<blog-post
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
></blog-post>
```

#### prop 验证

```JS
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 匹配任何类型)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组且一定会从一个工厂函数返回默认值
      default: function() {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告。

#### $emit 触发和监听

如果需要通过事件向父级组件发送消息，可以通过 $emit 用来触发和监听事件，举个 todoList 的栗子:

<script async src="//jsfiddle.net/Tate_Young/s14cwxh6/2/embed/js,html,result/"></script>

还可以使用 $emit 的第二个参数来提供这个值，比如:

```JS
<button @click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```

然后当在父级组件监听这个事件的时候，我们可以通过 $event 访问到被抛出的这个值：

```HTML
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

或者，如果这个事件处理函数是一个方法:

```HTML
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

```JS
methods: { // 值将会作为第一个参数传入这个方法
  onEnlargeText: function(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### 组件内使用 v-model

v-model 是用来实现双向数据绑定的，其本质可理解为:

```HTML
<input v-model="searchText">

<!-- 等价于 -->
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

当在组件内使用时:

```HTML
<custom-input v-model="searchText"></custom-input>
```

```JS
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

### 动态组件

可以通过 Vue 的 <component> 元素加一个特殊的 **is** 特性来实现，详见 JSFiddle:

<script async src="//jsfiddle.net/chrisvfritz/o3nycadu/embed/"></script>

重新创建动态组件的行为通常是非常有用的，但是在这个案例中，我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。为了解决这个问题，我们可以用一个 <keep-alive> 元素将其动态组件包裹起来:

```HTML
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

另外提到解析 DOM 模板时的注意事项，有些 HTML 元素，诸如 <ul>、<ol>、<table> 和 \<select\>，对于哪些元素可以出现在其内部是有严格限制的。

```HTML
<!-- 配合组件使用时可能会发生解析问题 -->
<ul>
  <blog-post-row></blog-post-row>
</ul>
```

推荐的写法为搭配 **is** 属性:

```HTML
<ul>
  <li is="blog-post-row"></li>
</ul>
```

### 插槽 slot

#### 单个插槽

**插槽(slot)** 是用来作内容分发的，比如将父组件的内容放到子组件指定的位置，先看个例子:

```HTML
<navigation-link url="/profile">
  <!-- 添加一个 Font Awesome 图标 -->
  <span class="fa fa-user"></span>
  Your Profile
</navigation-link>
```

\<navigation-link\> 中模板的实现为:

```HTML
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

当组件渲染的时候，这个 \<slot\> 元素将会被替换为图标和 “Your Profile”。插槽内可以包含任何模板代码，包括 HTML。

#### 具名插槽

**具名插槽**则是提供了 name 属性的 slot。

```HTML
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

```HTML
<base-layout>
  <!-- 或者用 template 标签包裹 -->
  <h1 slot="header">Here might be a page title</h1>
  <!-- <template slot="header">
    <h1>Here might be a page title</h1>
  </template> -->

  <!-- 默认插槽内容 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</base-layout>
```

#### 作用域插槽

作用域插槽可以将子组件的值传到父组件供使用，需要在 slot 上绑定数据，以[此篇博客](https://segmentfault.com/a/1190000012996217)为例:

```JS
// 子组件
<template>
  <div class="child">
    <h3>这里是子组件</h3>

    <slot :data="data"></slot>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        data: ['Tate', 'Snow', 'Alice', 'Bob', 'Candy']
      }
    },
    ...
  }
</script>
```

```JS
// 父组件，数据由子组件提供，自己提供样式布局
<template>
  <div class="father">
    <h3>这里是父组件</h3>
    <child>
      <template slot-scope="user">
        <ul>
          <li v-for="item in user.data">{ { item } }</li>
        </ul>
      </template>
    </child>
  </div>
</template>

<script>
  import Child from './Child.vue'
  export default {
    data: function() {
      return {
        msg: ''
      }
    },
    components:{
      'child': Child
    }
  }
</script>
```

当我们使用 \<todo-list\> 组件的时候，

## 生命周期钩子

Vue 2.x 一共有十个钩子，具体可查看官网给出的图 - [生命周期钩子](https://cn.vuejs.org/images/lifecycle.png)。

| 钩子 | 描述 |
|:--------------|:---------|
| **beforeCreate** | 组件实例刚被创建，$data 和 $el 均未初始化 |
| **created** | 组件实例创建完成，$data 属性已绑定，但 $el 未初始化 |
| **beforeMount** | 模板编译/挂载之前，$el 初始化完毕，但未完成渲染(虚拟 DOM) |
| **mounted** | 模板编译/挂载之后，完成渲染(真实 DOM) |
| **beforeUpdate** | 组件更新之前 |
| **updated** | 组件更新之后 |
| **activated** | keep-alive 组件激活时 |
| **deactivated** | keep-alive 组件停用时 |
| **beforeDestroy** | 实例销毁之前 |
| **destroyed** | 实例销毁之后。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁 |

## 指令

### 常用指令

就如 AngularJS 中的 'ng' 指令，Vue 中的指令以 'v' 为前缀:

```HTML
<p v-if="seen">现在你看到我了</p>

<!-- 指令参数的使用 -->
<a v-bind:href="url">...</a>
<a v-on:click="doSomething">...</a>

<!-- 修饰符 -->
<!-- .prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault() -->
<form v-on:submit.prevent="onSubmit">...</form>
```

对于常用的 <code>v-bind</code> 和 <code>v-on</code> 可以采用缩写:

```HTML
<a v-bind:href="url">...</a>
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a :href="url">...</a>
<a @click="doSomething">...</a>
```

用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。这个类似 <code>track-by="$index"</code>，此时需要为每项提供一个唯一 key 属性:

```HTML
<!-- 遍历操作符 of 可以代替 in -->
<div v-for="item of items" :key="item.id">{ { item } }</div>
```

总结几个 class 类的绑定方式:

```HTML
<div :class="{ 'active': isActive, 'text-danger': isDangerous }"></div>
<div :class="['active list-id-' + myId, {'text-danger': isDangerous }]"></div>
```

### v-cloak

这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 <code>[v-cloak] { display: none }</code> 一起用时，这个指令可以隐藏未编译的插值表达式直到实例准备完毕。

```CSS
[v-cloak] {
  display: none;
}
```

```HTML
<div v-cloak>
  { { message } }
</div>
```

### 修饰符

修饰符可分为以下几类:

* **事件修饰符**:

| 修饰符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **.stop** | 阻止单击事件继续传播，event.stopPropagation() | <code><a @click.stop="doThis"></a></code> |
| **.prevent** | 阻止浏览器默认事件，event.preventDefault() | <code><form @submit.prevent="onSubmit"></form></code> |
| **.capture** | 采用事件捕获 | <code><a @click.capture="doThis"></a></code> |
| **.self** | 只当在 event.target 是当前元素自身时触发处理函数 | <code><a @click.self="doThis"></a></code> |
| **.once** | 事件只执行一次 | <code><button @click.once="showMsg">Add</button></code> |
| **.passive** | 滚动事件的默认行为将会立即触发，能够提升移动端的性能 | <code><div @scroll.passive="onScroll"></div></code> |

不同修饰符可以串联，但是要注意执行顺序:

```HTML
<a @click.stop.prevent="doThat"></a>
```

* **按键修饰符**

通过情况下会采用 keycode 来判断按键，Vue 为常用的一些按键提供别名，如 .enter、.space、.esc、.up 等:

```HTML
<!-- 只有在 `keyCode` 是 13 时调用 `vm.submit()` -->
<input @keyup.13="submit">

<!-- 等价于 -->
<input @keyup.enter="submit">
```

也可以通过全局 API 的 **[keyCodes](https://cn.vuejs.org/v2/api/#keyCodes)** 进行配置。在 Vue 2.5.0 也新增了直接将 **[KeyboardEvent.key](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key/Key_Values)** 暴露的任意有效按键名转换为 kebab-case 来作为修饰符:

```HTML
<input @keyup.page-down="onPageDown">
```

* **系统修饰键**

系统修饰键包含以下几个:

* .ctrl
* .alt
* .shift
* .meta - 对应 macOS 的 cmd；对应 Windows 的 ⊞

```HTML
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

* **v-model 修饰符**

| 修饰符 | 描述 | 栗子 |
|:--------------|:---------|:---------|
| **.lazy** | 在“change”时而非“input”时更新 | <code><\input v-model.lazy="msg"></code> |
| **.number** | 将用户的输入值转为数值类型 | <code><\input v-model.number="age" type="number"></code> |
| **.trim** | 自动过滤用户输入的首尾空白字符 | <code><\input v-model.trim="msg"></code> |

## 计算属性 computed

模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护。例如:

```HTML
<div id="example">
  { { message.split('').reverse().join('') } }
</div>
```

因此对于任何复杂逻辑，都应当使用计算属性，改进如下:

```HTML
<div id="example">
  <p>Original message: "{ { message } }"</p>
  <p>Computed reversed message: "{ { reversedMessage } }"</p>
</div>
```

```JS
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function() {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

当然也可以添加方法(method):

```HTML
<p>Reversed message: "{ { reversedMessage() } }"</p>
```

```JS
methods: {
  reversedMessage: function() {
    return this.message.split('').reverse().join('')
  }
}
```

上述两个方法的结果相同，但区别是计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。但是计算属性目前无法传参。

## 参考链接

1. [Vue 中文官网](https://cn.vuejs.org/)
2. [实例化 vue 发生了什么?(详解 vue 生命周期)](https://m.imooc.com/article/22885) By giveMeFivePlz
3. [深入理解 vue 中的 slot 与 slot-scope](https://segmentfault.com/a/1190000012996217) By 云荒杯倾
4. [Vue2.0 源码阅读：响应式原理](https://zhouweicsu.github.io/blog/2017/03/07/vue-2-0-reactivity/) By zhouweicsu

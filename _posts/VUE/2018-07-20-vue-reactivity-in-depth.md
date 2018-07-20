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

Vue 包含一组观察数组的**变异方法**，所以它们也将会触发视图更新。这些方法比如有 push、pop、splice、sort 等；相反 filter、slice、concat 等方法不会改变原数组，所以不会触发视图更新，是非常高效的操作。举个栗子 🌰:

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

## 深入响应式

Vue 数据响应式变化主要涉及 **Observer**、**Watcher**、**Dep** 这三个主要的类，下面根据[**源码**](https://github.com/huangzhuangjia/Vue-learn/blob/master/core/instance/init.js)进行简单的分析。

### 实例初始化

```JS
initLifecycle(vm) // 初始化生命周期
initEvents(vm) // 初始化事件
initRender(vm) // 初始化 render
callHook(vm, 'beforeCreate') // 调用 beforeCreate 钩子函数并且触发 beforeCreate 钩子事件
initInjections(vm) // resolve injections before data/props
initState(vm) // 初始化 props、methods、data、computed 与 watch
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created') // 调用 created 钩子函数并且触发 created 钩子事件
```

### initState 初始化

**initState** 方法主要用来初始化 props、methods、data、computed 与 watch，具体实现方式如下:

```JS
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    /* 该组件没有 data 的时候绑定一个空对象 */
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) initWatch(vm, opts.watch)
}
...
/* 初始化 data */
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}defi
  ...
  while (i--) { // 遍历data中的数据
    /* 保证 data 中的 key 不与 props 中的 key 重复，props 优先，如果有冲突会产生 warning */
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${keys[i]}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(keys[i])) {
      /* 将 data 上面的属性代理到了 vm 实例上 */
      proxy(vm, `_data`, keys[i])
    }
  }
  /* 这里通过 observe 实例化 Observe 对象，开始对数据进行绑定，asRootData 用来根数据，用来计算实例化根数据的个数，下面会进行递归 observe 进行对深层对象的绑定。则 asRootData 为非 true */
  observe(data, true /* asRootData */)
}
```

### observe 创建 Observer 实例

**observe** 方法对 data 定义的每个属性进行 getter/setter 操作，这里就是 Vue 实现响应式的基础:

```JS
 /* 尝试创建一个 Observer 实例（__ob__），如果成功创建 Observer 实例则返回新的 Observer实例，否则返回现有的 Observer 实例。*/
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value)) {
    return
  }
  let ob: Observer | void
  /*这里用 __ob__ 这个属性来判断是否已经有 Observer 实例 */
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    /* 这里的判断是为了确保 value 是单纯的对象，而不是函数或者是 Regexp 等情况。而且该对象在 shouldConvert 的时候才会进行 Observer。这是一个标识位，避免重复对 value 进行 Observer */
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value) // 将 data 转变可以成观察的
  }
  if (asRootData && ob) {
     /* 如果是根数据则计数，后面 Observer 中的 observe 的 asRootData 非 true */
    ob.vmCount++
  }
  return ob
}
```

### Observer 类

**Observer** 类是将每个目标对象 data 的键值转换成 getter/setter 形式:

```JS
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data
  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    /* 将 Observer 实例绑定到 data 的 __ob__ 属性上面去，之前说过 observe 的时候会先检测是否已经有 __ob__ 对象存放 Observer 实例了，def方法定义可以参考/src/core/util/lang.js */
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      /* 如果是数组，将修改后可以截获响应的数组方法替换掉该数组的原型中的原生方法，达到监听数组数据变化响应的效果。这里如果当前浏览器支持 __proto__ 属性，则直接覆盖当前数组对象原型上的原生数组方法，如果不支持该属性，则直接覆盖数组对象的原型。*/
      const augment = hasProto
        ? protoAugment  /* 直接覆盖原型的方法来修改目标对象 */
        : copyAugment   /* 定义（覆盖）目标对象或数组的某一个方法 */
      augment(value, arrayMethods, arrayKeys)
      /* 如果是数组则需要遍历数组的每一个成员进行 observe */
      this.observeArray(value)
    } else {
      /* 如果是对象则直接 walk 进行绑定 */
      this.walk(value)
    },
    walk (obj: Object) {
      const keys = Object.keys(obj)
      /* walk 方法会遍历对象的每一个属性进行 defineReactive 绑定*/
      for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i], obj[keys[i]])
      }
    }

    /**
    * Observe a list of Array items.
    */
    /*对一个数组的每一个成员进行observe*/
    observeArray (items: Array<any>) {
      for (let i = 0, l = items.length; i < l; i++) {
        /*数组需要遍历每一个成员进行observe*/
        observe(items[i])
      }
    }
  }
}
```

### defineReactive 设置存取器

至此，所有的数据都已经转换为 Observer 对象:

```JS
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: Function
) {
  /* 在闭包中定义一个 dep 对象*/
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
  /* 如果之前该对象已经预设了 getter 以及 setter 函数则将其取出来，新定义的 getter/setter 中会将其执行，保证不会覆盖之前已经定义的getter/setter */
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  /* 对象的子对象递归进行 observe 并返回子节点的 Observer 对象 */
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val /* 如果原本对象拥有 getter 方法则执行 */
      if (Dep.target) {
        dep.depend() /* 进行依赖收集 */
        if (childOb) {
          /* 子对象进行依赖收集，其实就是将同一个 watcher 观察者实例放进了两个 depend 中，一个是正在本身闭包中的 depend，另一个是子元素的depend */
          childOb.dep.depend()
        }
        if (Array.isArray(value)) {
          /* 是数组则需要对每一个成员都进行依赖收集，如果数组的成员还是数组，则递归 */
          dependArray(value)
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      /* 通过 getter 方法获取当前值，与新值进行比较，一致则不需要执行下面的操作 */
      const value = getter ? getter.call(obj) : val
      ...
      if (setter) {
        /* 如果原本对象拥有 setter 方法则执行 setter */
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      /* 新的值需要重新进行 observe，保证数据响应式 */
      childOb = observe(newVal)
      /* dep 对象通知所有的观察者 */
      dep.notify()
    }
  })
}
```

收集依赖的作用其实就是 getter 时收集依赖的 watcher，然后在 setter 操作时候通过 dep 去通知 watcher，此时 watcher 就执行更新。另外 Dep.target 的含义可以从以下示例看出，text3 并没有被绑定到模板中，为了提高代码执行效率，收集只在实际页面中用到的 data 数据，然后打上标记，这里就是标记为 Dep.target:

```JS
new Vue({
  template:
    `<div>
      <span>text1:</span> {{text1}}
      <span>text2:</span> {{text2}}
    <div>`,
  data: {
    text1: 'text1',
    text2: 'text2',
    text3: 'text3'
  }
});
```

### Dep 依赖

Dep 类是 Watcher 和 Observer 之间的纽带:

```JS
export default class Dep {
  static target: ? Watcher;
  id: number;
  subs: Array<Watcher>;
  constructor () {
    this.id = uid++
    this.subs = []
  }
  /* 添加一个观察者对象 */
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  /* 移除一个观察者对象 */
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  /* 依赖收集，当存在 Dep.target 的时候添加观察者对象 */
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  /* 通知所有订阅者 */
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update() // 更新数据
    }
  }
}
```

### Watcher 观察者对象

**Watcher** 是一个观察者对象。依赖收集以后 Watcher 对象会被保存在 Dep 的 subs 中，数据变动的时候 Dep 会通知 Watcher 实例，然后由 Watcher 实例回调进行视图的更新

```JS
export default class Watcher {
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    /*_ watchers 存放订阅者实例 */
    vm._watchers.push(this)
    ...
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      // 如果是函数，相当于指定了当前订阅者获取数据的方法，每次订阅者通过这个方法获取数据然后与之前的值进行对比
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)// 否则的话将表达式解析为可执行的函数
      ......
    }
    this.value = this.lazy
      ? undefined
      : this.get()   //如果 lazy 不为 true，则执行 get 函数进行依赖收集
  }
   /* 获得 getter 的值并且重新进行依赖收集 */
  get () {
    /* 将自身 watcher 观察者实例设置给 Dep.target，用以依赖收集。*/
    pushTarget(this)
    let value
    const vm = this.vm
    /*执行了getter操作，看似执行了渲染操作，其实是执行了依赖收集。
      在将Dep.target设置为自生观察者实例以后，执行getter操作。
      譬如说现在的的data中可能有a、b、c三个数据，getter渲染需要依赖a跟c，
      那么在执行getter的时候就会触发a跟c两个数据的getter函数，
      在getter函数中即可判断Dep.target是否存在然后完成依赖收集，
      将该观察者对象放入闭包中的Dep的subs中去。*/
    if (this.user) {
      try {
        value = this.getter.call(vm, vm)
      } catch (e) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      }
    } else {
      value = this.getter.call(vm, vm)
    }
    /* 如果存在 deep，则触发每个深层对象的依赖，追踪其变化 */
    if (this.deep) {
      /* 递归每一个对象或者数组，触发它们的 getter，使得对象或数组的每一个成员都被依赖收集，形成一个“深（deep）”依赖关系 */
      traverse(value)
    }
    /* 将观察者实例从 target 栈中取出并设置给 Dep.target */
    popTarget()
    this.cleanupDeps()
    return value
  }
  /* 添加一个依赖关系到 Deps 集合中 */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
   /*
      调度者接口，当依赖发生改变的时候进行回调。
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      /* 同步则执行 run 直接渲染视图 */
      this.run()
    } else {
      /* 异步推送到观察者队列中，下一个 tick 时调用 */
      queueWatcher(this)
    }
  }
   /*
      调度者工作接口，将被调度者回调。
    */
  run () {
    if (this.active) {
      /* get 操作在获取 value 本身也会执行 getter 从而调用 update 更新视图 */
      const value = this.get()
      if (
        value !== this.value ||
        // 即便值相同，拥有 Deep 属性的观察者以及在对象／数组上的观察者应该被触发更新，因为它们的值可能发生改变。
        isObject(value) ||
        this.deep
      ) {
        const oldValue = this.value
        this.value = value
        /* 触发回调 */
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
  /* 收集该 watcher 的所有 deps 依赖 */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  ...
}
```

依赖收集的整个流程图如下:

![vue-reactive.jpg](https://i.loli.net/2018/07/20/5b51aaa9e325e.jpg)

* 模板编译过程中的指令和数据绑定、computed 属性和 watch 函数中的对象也会生成 Watcher 实例，在模板编译的过程中，会执行 Watcher 实例的 expOrFn（初始化 Watcher 实例时传入的参数），进入 watcher.js 中的 get 函数 访问 expOrFn 涉及的所有属性；
* 访问属性之前，Watcher 会设置 Dep 的静态属性 Dep.target 指向其自身，然后开始依赖收集；
* 访问属性的过程中，属性的 getter 函数会被访问；
* 属性 getter 函数中会判断 Dep.target（target 中保存的是第 2 步中设置的 Watcher 实例）是否存在，若存在则将 getter 函数所在的 Observer 实例的 Dep 实例保存到 Watcher 的列表中，并在此 Dep 实例中添加 Watcher 为订阅者；
* 重复上述过程直至 Watcher 的 expOrFn 涉及的所有属性均访问结束（即 expOrFn 数中所有的数据的 getter 函数都已被触发），Dep.target 被置为 null，依赖收集完成；

### 总流程图

![vue-reactivity-full.png](https://i.loli.net/2018/07/20/5b51b7da34bbd.png)

总结来说就是：

* 在生命周期的 initState 方法中将 data、prop 中的数据劫持，通过 observe 方法与 defineReactive 方法将相关对象转换为 Observer 对象；
* 然后在 initRender 方法中解析模板，通过 Watcher 对象，Dep 对象与观察者模式将模板中的指令与对应的数据建立依赖关系，在这个依赖收集的过程中，使用了全局对象 Dep.target ；
* 最后，当数据发生改变时，触发 Object.defineProperty 方法中的 dep.notify 方法，遍历该数据的依赖列表，执行其 update 方法通知 Watcher 进行视图更新。

## 参考链接

1. [Vue 中文官网](https://cn.vuejs.org/)
2. [Vue2.0 源码阅读：响应式原理](https://zhouweicsu.github.io/blog/2017/03/07/vue-2-0-reactivity/) By zhouweicsu
3. [深入理解 Vue 响应式原理](http://jungahuang.com/2018/02/07/About-responsive-of-Vue/#more) By Junga Huang
4. [](https://zhouweicsu.github.io/blog/2017/03/07/vue-2-0-reactivity/) By zhouweicsu

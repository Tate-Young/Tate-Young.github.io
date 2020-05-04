---
layout: blog
front: true
comments: True
flag: NG
background: green
category: 前端
title: 双向数据绑定的实现
date: 2018-04-26 11:47:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/24/5ade80f820807.jpg
tags:
- AngularJS
- Angular
---
# {{ page.title }}

本文主要从 AngularJS 和 Angular 两个框架来讨论这个问题。

## AngularJS Dirty Checking

### Scope

**Scope(作用域)** 相当于 MVVM 中 ViewModel，是连接 View 与 Model 的桥梁，它也是一个对象，拥有很多内置的属性和方法:

```JS
function Scope() {
  this.$id = nextUid();
  /* ... */
}

Scope.prototype = {
  constructor: Scope,
  $new: function(isolate, parent) { /* ... */ },
  $watch: function(watchExp, listener, objectEquality, prettyPrintExpression) { /* ... */ }
  /* ... */
}
```

Scope 一个项目中可能存在多个，他们是通过原型继承进行关联的，根作用域为 $rootScope，在 AngularJS 创建控制器时，你可以将 $scope 对象当作一个参数传递，最简单的绑定栗子:

```HTML
<div ng-app="myApp" ng-controller="myCtrl">
  <h1>{{name}}</h1>
</div>
```

```JS
angular.module('myApp', [])
  .controller('myCtrl', function($scope) {
    // 根作用域为 $rootScope，$scope 的继承机制即是原型继承
    $scope.name = 'Tate';
  });
```

而 Scope 与双向数据绑定有着密不可分的关系，而数据的检测正是由**脏检查(dirty checking)**完成，因此涉及到 <code>$watch</code>、<code>$apply</code> 和 <code>$digest</code> 几个重要概念。

### $watch

如上述的栗子，AngularJS 是如何监听 name 变量的值呢，是因为在插值表达式中声明的表达式编译成函数并调用 $watch 方法，类似事件的注册和监听:

```JS
// Using a function as a watchExpression
$scope.$watch(
  function(scope) { return scope.name; }, // This function returns the value being watched. It is called for each turn of the $digest loop
  function(newValue, oldValue, scope) { // listener Callback called whenever the value of `watchExpression` changes.
    // listener code defined here
  }
);
```

以下是实现 $watch 的源码:

```JS
$watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
  var get = $parse(watchExp); // 对传入的 watchExpression 进行解析

  if (get.$$watchDelegate) {
    return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
  }
  var scope = this,
      array = scope.$$watchers, // 负责存储所有的 watcher
      watcher = { // watcher 主要针对 $scope 的某个属性进行监控
        fn: listener,
        last: initWatchVal, // 为 watcher 设置初始值，即相对于当前值的上一个值
        get: get,
        exp: prettyPrintExpression || watchExp,
        eq: !!objectEquality
      };
  lastDirtyWatch = null;
  /* ... */
  // we use unshift since we use a while loop in $digest for speed.
  // the while loop reads in reverse order.
  array.unshift(watcher);
  array.$$digestWatchIndex++;
  incrementWatchersCount(this, 1);

  return function deregisterWatch() { // 注销监听
    /* ... */
  };
}

/**
 * function used as an initial value for watchers.
 * because it's unique we can easily tell it apart from other values
 */
function initWatchVal() {}
```

注册过的 watcher 在检测到当前的值和上次检测的值不同时，才会调用 listener 函数，比较方法类似于 (!==)，这里的值可以分为三种情况:

* 基础类型值
* 引用类型值 - 根据 $watch 方法的第三个参数 objectEquality 来设置，true 时则使用 <code>angular.equals</code> 来判断，默认为 false
* 集合 - 可使用 $watchCollection，比如数组或对象，性能上会更好，详细分析[可参考这里](https://blog.csdn.net/dm_vincent/article/details/51620193)

当然也可以通过 $watch、**$watchGroup** 或 **$watchCollection** 方法手动去监听变量的值:

```JS
// $watchCollection 用法和 $watch 一致，只是第一个参数是传入的对象
$scope.$watch('name', function(newValue, oldValue) { // 'name' 即为上面定义的变量 name
    /* ... */
});

// $watchGroup 监听一组数据
$scope.$watchGroup(['teamScore', 'time'], function(newVal, oldVal) {
  if(newVal[0] > 20){
    $scope.matchStatus = 'win';
  } else if (newVal[1] > 60){
    $scope.matchStatus = 'times up';
  }
});
```

### $apply

**$apply** 是整个 digest 循环(Digest Cycle，简称 DC)的触发者，它最终调用的就是 **$digest** 方法:

```JS
$apply: function(expr) {
  try {
    beginPhase('$apply'); // 设置当前运行状态，$rootScope.$$phase = '$apply'，多次调用 $apply 则会抛出异常
    try {
      return this.$eval(expr);
    } finally {
      clearPhase(); // 清空当前运行状态，$rootScope.$$phase = null
    }
  } catch (e) {
    $exceptionHandler(e);
  } finally {
    try {
      $rootScope.$digest(); // 最终执行 $digest
    } catch (e) {
      $exceptionHandler(e);
      // eslint-disable-next-line no-unsafe-finally
      throw e;
    }
  }
},
$eval: function(expr, locals) { // 给定一个表达式，使用当前 scope 对象作为上下文进行该表达式的求值
  return $parse(expr)(this, locals);
}
```

一般情况下，AngularJS 总是将我们的代码包裹到一个 function 中并传入 $apply 方法，以此来执行 $digest 循环。而在超出 AngularJS 上下文的地方，则需要我们手动去调用 $apply 方法来触发 DC，例如 setTimeout 方法中我们去改变某个变量的值，会发现页面无更新，此时需要手动调用 $apply 方法才会触发脏检查。类似地，如果你有一个指令用来设置一个 DOM 事件 listener 并且在该 listener 中修改了一些 models，那么你也需要通过手动调用 $apply 方法来确保变更会被正确的反映到视图中。

```JS
// 直接使用封装好的 $timeout 服务，则不用手动调用 $apply，因为它已经帮你处理了
setTimeout(function() {
  $scope.$apply(function() {
    // wrapped this within $apply
    $scope.message = 'Fetched after 3 seconds';
    console.log('message:' + $scope.message);
  });
}, 2000);
```

### $digest

**$digest** 在 DC 中主要是对于 watchers 的若干次遍历，直到确定整个 scope 中的数据不再改变，整个数据检测的过程可以[参考此篇文章](https://blog.csdn.net/dm_vincent/article/details/51614721)，这里做一部分摘录:

```JS
$digest: function() {
  var next, current, target = this;
  beginPhase('$digest');
  /* ... */
  do { // "while dirty" loop
    dirty = false;
    current = target;

    /* ... */
    traverseScopesLoop:
    do { // "traverse the scopes" loop
      /* 遍历当前 current 对象上的 watchers */

      // 深度优先遍历  yes, this code is a bit crazy
      if (!(next = ((current.$$watchersCount && current.$$childHead) ||
          (current !== target && current.$$nextSibling)))) {
        while (current !== target && !(next = current.$$nextSibling)) {
          current = current.$parent;
        }
      }
    } while ((current = next));

    if ((dirty || asyncQueue.length) && !(ttl--)) {
      // 达到最大 digest 数量，抛出异常
    }
  } while (dirty || asyncQueue.length);
  /* ... */
}
```

解释下深度优先遍历中的两个条件语句:

```JS
current.$$watchersCount && current.$$childHead
```

假如当前 scope 与其子 scope 中 watchersCount 数量大于零，则将 next 取值为 $$childHead，即第一个子节点。

```JS
current !== target && current.$$nextSibling
```

假如当前 scope 不是 digest 循环的起始 scope，即 $rootScope，则 next 取值为 $$nextSibling，即第一个兄弟节点。

### Digest Cycle

假设存在如下的 scope 树形结构，每个 scope 都拥有各自注册的 watchers 以及对应的计数信息，根据 $digest 方法里的深度优先遍历，粗略还原下脏检查流程。

```TEXT
    A
   / \
  B   C
 / \
D   E
     \
      F
```

遍历过程( A --> B --> D --> E --> F --> C ):

1. 首先遍历 A，之后遍历其 $$childHead B，再遍历其 $$childHead D;
2. D 之后没有子节点，会去找 $$nextSibling E，然后在遍历其 $$childHead F;
3. F 之后没有子节点，也没有兄弟节点，则会执行回溯 <code>current = current.$parent</code>;
4. 回溯到 B 时，会去找 $$nextSibling C；
5. C 之后没有子节点，也没有兄弟节点，则同样执行回溯到 A，循环终止。

## Angular Change Detection

### Zone

**Change Detection(变化检测)** 是 Angular 中实现双向数据绑定的核心。当组件中的数据发生变化的时候，Angular 能检测到数据变化并自动反映到视图中。数据的改变一般都是通过异步来操作的，比如 UI 事件、ajax 请求和定时器等，如何检测到这些改变呢，Angular 不同于 AngularJS，它采用的机制为 **[Zone](https://domenic.github.io/zones/)**，并且内部实现了 NgZone 模块，它是用于拦截和跟踪异步工作的机制。

同样拿上文中 setTimeout 的示例，在 Angular 中执行会发现，仍然可以检测到其内部变量的改变，其原因就是在 Angular 中，setTimeout 方法已被覆写。其实在 Angular 应用程序启动之前，Zone 采用**猴子补丁(Monkey-patched)**运行时动态替换的方式，将 JavaScript 中的异步任务都进行了包装，这使得这些异步任务都能运行在 Zone 的执行上下文中(NgZone 拥有整个运行环境的执行上下文)，每个异步任务在 Zone 中都是一个任务。

实现了异步的监听，那如何去执行变化检测呢。Angular 有一个 ApplicationRef_ 类，其作用是用来监听 NgZone 中的 onMicrotaskEmpty 事件，无论何时只要触发这个事件，那么将会执行一个 tick 方法用来告诉 Angular 去执行变化检测:

```JS
class ApplicationRef_ extends ApplicationRef {
  constructor(_zone, _console, _injector, _exceptionHandler, _componentFactoryResolver, _initStatus) {
    super();
    /* ... */
    this._zone.onMicrotaskEmpty.subscribe({ next: () => { this._zone.run(() => { this.tick(); }); } });
    /* ... */
  }
  tick() {
    if (this._runningTick) { // 判断是否已执行
      throw new Error('ApplicationRef.tick is called recursively');
    }
    const /** @type {?} */ scope = ApplicationRef_._tickScope();
    try {
      this._runningTick = true;
      this._views.forEach((view) => view.detectChanges()); // 执行 Services.checkAndUpdateView(this._view);
      if (this._enforceNoNewChanges) {
        this._views.forEach((view) => view.checkNoChanges());
      }
    }
    catch (e) {
      // Attention: Don't rethrow as it could cancel subscriptions to Observables!
      this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(e));
    }
    finally {
      this._runningTick = false;
      wtfLeave(scope);
    }
  }
}
```

对于 Angular，任何数据都是从顶部往底部流动，即单向数据流:

![angular-data-detection.png](https://i.loli.net/2019/12/15/qJdrB5F1wXTuzUv.png)

### onPush

先看个栗子，栗子都[摘自这里](https://segmentfault.com/a/1190000008754052):

```JS
// profile-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'profile-card',
  template: `
    <div>
      <profile-name [name]='profile.name'></profile-name>
      <profile-age [age]='profile.age'></profile-age>
    </div>
  `
})
export class ProfileCardComponent {
  @Input() profile: { name: string; age: number }; // 输入属性
}
```

```JS
// app.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'exe-app',
  template: `<profile-card [profile]='profile'></profile-card>`
})
export class AppComponent  implements OnInit {
  profile: { name: string; age: number } = {
    name: 'Tate',
    age: 18
  };

  ngOnInit() {
    setTimeout(_ => {
      this.profile.name = 'Snow'; // 默认情况下 2s 后页面也相应改变
      console.log(this.profile.name); // 'snow'
    }, 2000);
  }
}
```

默认每当输入属性发生变化时，都会从根组件开始，从上往下在每个组件上执行变化检测。考虑到性能优化，可以使用 **onPush** 策略(默认为 Default 策略)，只有当**输入属性(@input)**引用发生变化时才进行变化检测(非输入属性无论怎么修改都无效)。直接设置在 metadata 元数据中:

```JS
// profile-card.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'profile-card',
  template: `
    <div>
      <profile-name [name]='profile.name'></profile-name>
      <profile-age [age]='profile.age'></profile-age>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

因此变化检测流程变成了下图:

![angular-data-detection-onpush.png](https://i.loli.net/2019/12/15/Ej6mhPB5NAweniS.png)

### Mutable / Immutable

上面栗子中可以看到数据已经改变，但页面中的名字却未同步，这里就涉及到数据的可变性(Mutable)，对于引用类型值，Angular 的处理方式类似以下示例:

```JS
var person = {
  name: 'Tate',
  age: 18
};

var anotherPerson = person;
person.name = 'Snow';
console.log(anotherPerson === person); // true
```

显而易见，两个对象被视为相等，即使其内部的值已经改变，但还是相同的引用。**Immutable** 即不可变，表示当数据模型发生变化的时候，我们不会修改原有的数据模型，而是创建一个新的数据模型。类似示例如下:

```JS
var person = {
  name: 'Tate',
  age: 18
};

var anotherPerson = Object.assign({}, person, { name: 'Snow' });;
console.log(anotherPerson === person); // false
```

而 OnPush 策略内部使用 **looseIdentical** 函数来进行对象的比较，looseIdentical 的实现如下:

```JS
function looseIdentical(a, b) {
  return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b); // 判断 NaN 和 NaN 的比较
}
```

因此当我们仅使用 OnPush 策略时，需要使用的 Immutable 的数据结构，才能保证程序正常运行。

### ChangeDetectorRef

**ChangeDetectorRef** 是组件的变化检测器的引用，我们可以在组件中的通过依赖注入的方式来获取该对象:

```JS
import { ChangeDetectorRef } from '@angular/core';

@Component({}) class MyComponent {
  constructor(private cdRef: ChangeDetectorRef) {}
}
```

该类拥有以下几个方法:

* **markForCheck()** - 在组件中设置了 onPush 策略，则变化检测不会再次执行，除非手动调用该方法
* **detach()** - 从变化检测树中分离变化检测器，该组件的变化检测器将不再执行变化检测，除非手动调用 reattach 方法
* **reattach()** - 重新添加已分离的变化检测器，使得该组件及其子组件都能执行变化检测
* **detectChanges()** - 从该组件到各个子组件执行一次变化检测

```JS
// profile-card.component.ts
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent implements OnInit {
  @Input() profile: { name: string; age: number };

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(_ => {
      this.profile.name = 'Snow';
      console.log(this.profile.name); // 'Snow' 同时页面发生变化
      this.cdRef.markForCheck(); // 执行 markForCheck 方法进行变化检测
    }, 2000);
  }
}
```

看 markForCheck 方法到底执行了什么:

```JS
markForCheck() { markParentViewsForCheck(this._view); }

function markParentViewsForCheck(view) {
  let /** @type {?} */ currView = view;
  while (currView) {
    if (currView.def.flags & 2 /* OnPush */) {
      currView.state |= 8 /* ChecksEnabled */;
    }
    currView = currView.viewContainerParent || currView.parent;
  }
}
```

变化检测器的状态有以下这些:

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

## 参考链接

1. [[AngularJS 面面观] 1. scope 中的 Dirty Checking(脏数据检查) --- 引言](https://blog.csdn.net/dm_vincent/article/details/50344395) By dm_vincent
2. [Understanding Angular’s $apply() and $digest()](https://www.sitepoint.com/understanding-angulars-apply-digest/) By Sandeep Panda
3. [$watch, $watchCollection, $watchGroup 的使用](https://www.cnblogs.com/mafeifan/p/6158260.html) By 飞凡123
4. [Angular 2 Change Detection - 1](https://segmentfault.com/a/1190000008747225) By semlinker
5. [zone.js - 暴力之美](https://www.cnblogs.com/whitewolf/p/zone-js.html) By 破狼

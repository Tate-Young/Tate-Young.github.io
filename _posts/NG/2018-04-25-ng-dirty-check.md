---
layout: blog
tool: true
comments: True
flag: NG
background: green
category: 前端
title:  双向数据绑定的实现
# date:   2018-04-24 16:35:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/24/5ade80f820807.jpg
tags:
- AngularJS
- Angular
---
# {{ page.title }}

本文主要从 AngularJS 和 Angular 两个框架来讨论这个问题。

## AngularJS dirty checking

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
var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
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

遍历过程:

1. 首先遍历 A，之后遍历其 $$childHead B，再遍历其 $$childHead D;
2. D 之后没有子节点，会去找 $$nextSibling E，然后在遍历其 $$childHead F;
3. F 之后没有子节点，也没有兄弟节点，则会执行回溯 <code>current = current.$parent</code>;
4. 回溯到 B 时，会去找 $$nextSibling C；
5. C 之后没有子节点，也没有兄弟节点，则同样执行回溯到 A，循环终止。

## Angular Zone

## 参考链接

1. [[AngularJS面面观] 1. scope中的Dirty Checking(脏数据检查) --- 引言](https://blog.csdn.net/dm_vincent/article/details/50344395) By dm_vincent
2. [Understanding Angular’s $apply() and $digest()](https://www.sitepoint.com/understanding-angulars-apply-digest/) By Sandeep Panda
3. [$watch, $watchCollection, $watchGroup 的使用](https://www.cnblogs.com/mafeifan/p/6158260.html) By 飞凡123
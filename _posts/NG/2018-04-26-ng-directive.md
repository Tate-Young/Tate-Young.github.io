---
layout: blog
tool: true
comments: True
flag: NG
background: green
category: 前端
title:  指令 Directive
date:   2018-04-27 15:35:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/24/5ade80f820807.jpg
tags:
- AngularJS
- Angular
---
# {{ page.title }}

一般情况下，我们通过**[指令(Directive)](https://docs.angularjs.org/guide/directive)**来操作 DOM 或者复用 html 模板片段，本文主要简单介绍两个框架里对于指令的使用。

## AngularJS 指令

### directive 属性

AngularJS 中的指令有很多属性:

```JS
angular.module('app', [])
  .directive('myDirective', function() {
    return {
      restrict: String, // 申明标识符在模板中作为 E(元素)、A(属性)、C(样式)、M(注释)，如 'EA'
      priority: Number, // 指令执行优先级
      terminal: Boolean, // 优先级低于此指令的其他指令不再执行
      template: String, // 指定字符串式的模板
      templateUrl: String, // 指定模板地址，通常配合 $templateCache 使用，也可通过 gulp-angular-templatecache 构建
      replace: Boolean, // true 时替换元素，否则拼接到当前元素
      scope: Boolean or Object, // 创建一个新的 Scope 作用域
      transclude: Boolean,
      controller: String or
      function(scope, element, attrs, transclude, otherInjectables) { ... }, // 指向控制器
      controllerAs: String, // 设置控制器别名，实例化
      require: String or Array, // 指令间通讯，如 '^anotherDirective'
      link: function(scope, iElement, iAttrs) { ... }, // 链接函数
      compile: // 返回一个对象或连接函数，如下所示：
      function(tElement, tAttrs, transclude) {
        return {
          pre: function(scope, iElement, iAttrs, controller) { ... },
          post: function(scope, iElement, iAttrs, controller) { ... }
        }
        return function postLink(...) { ... }
      }
    };
  });
```

### scope

scope 参数可以隔离作用域，有以下三种值:

* **false** - 继承父域，默认值
* **true** - 继承父域，且新建独立作用域
* **{}** - 独立作用域

当要创建一个可复用的 directive 时，便可考虑隔离 Scope，同时提供了三种方法同隔离之外的地方交互:

* **@** - 将本地作用域同 DOM 属性的值进行绑定，绑定时需要加上插值表达式，且单向引用父域对象
* **=** - 和父 scope 属性名之间建立双向绑定
* **&** - 调用父级函数

```HTML
<!--@ 是单向绑定父域的机制，记得加上插值表达式 -->
<my-directive my-name="name" my-country-attr="sexy" my-age="{{age}}" on-say-name="say()"></my-directive>
```

```JS
// 指令设置，指令中可通过 $scope 来访问所绑定的值
scope: {
  myName: '=', // same as '=myName'
  myCountry: '=myCountryAttr',
  myAge: '@',
  onSayName: '&'
},
```

### require

require 是指令与指令之间通讯的桥梁，支持两种指令策略符号:

* **?** - 在当前元素中查找，若未命中，不抛出错误，链接函数的第四个参数为 null
* **^** - 在当前元素中查找的同时，向所有父元素寻找，未命中则抛出错误

上述两种符号可以同时使用，都不使用则是在当前元素上寻找该指令，未命中时抛出错误。在 link 函数第四个参数中可以获取注入外部指令的控制器:

```JS
require: '^anotherDir',
link: function ($scope, $element, $attrs, ctrl) {
  // ctrl 指向 anotherDir 指令的控制器
}
```

```JS
angular.modeule('myapp', [])
  .directive('common', function() {
    return {
      /* ... */
      controller: function($scope) {
        this.method1 = function() {};
        this.method2 = function() {};
      },
      /* ... */
    }
  })
  .directive('myDirective', function() {
    return {
      /* ... */
      require: '?^common',
      link: function(scope, elem, attrs, common){
        scope.method1 = common.method1;
      }
      /* ... */
    }
  });
```

### controller / controllerAs

**controller** 通常为指令定义其内部作用域的行为，而 **controllerAs** 为控制器起别名，是 $scope 的语法糖(syntatic sugar)。比如在定义路由时:

```JS
.state('account.register', {
  url: '/register',
  templateUrl: 'app/account/register.html',
  controller: 'RegisterCtrl',
  controllrtAs: 'vm'
})
```

在 AngularJS 的源代码中，控制器实例赋给了 $scope 的 controllerAs 属性:

```JS
locals.$scope[state.controllerAs] = controllerInstance;
```

对于控制器，我们推荐以下写法:

```JS
/* avoid */
function CustomerController($scope) {
  $scope.name = 'Tate';
  $scope.sayName = function() { };
}

/* recommended */
// vm 代表 viewModel，捕获 this 的值，也防止方法里面 this 出现指向的问题
function CustomerController() {
  var vm = this;
  vm.name = 'Tate';
  vm.sayName = function() { };
}
```

![controllerAs](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-1.png)

在指令中使用 controllerAs 和数据绑定的 johnpapa 的栗子 🌰:

```HTML
<div my-example max="77"></div>

<!-- example.directive.html -->
<div>hello world</div>
<div>max={{vm.max}}<input ng-model="vm.max"/></div>
<div>min={{vm.min}}<input ng-model="vm.min"/></div>
```

```JS
angular
  .module('app')
  .directive('myExample', myExample);

function myExample() {
  var directive = {
    restrict: 'EA',
    templateUrl: 'app/feature/example.directive.html',
    scope: {
      max: '='
    },
    link: linkFunc,
    controller: ExampleController,
    // note: This would be 'ExampleController' (the exported controller name, as string)
    // if referring to a defined controller in its separate file.
    controllerAs: 'vm',
    bindToController: true // because the scope is isolated
  };

  return directive;

  function linkFunc(scope, el, attr, ctrl) {
    console.log('LINK: scope.min = %s *** should be undefined', scope.min);
    console.log('LINK: scope.max = %s *** should be undefined', scope.max);
    console.log('LINK: scope.vm.min = %s', scope.vm.min); // 或 ctrl.min
    console.log('LINK: scope.vm.max = %s', scope.vm.max); // 或 ctrl.max
  }
}

ExampleController.$inject = ['$scope'];

function ExampleController($scope) {
  // Injecting $scope just for comparison
  var vm = this;
  vm.min = 3;
  vm.$onInit = onInit; // 初始化方法，类似于 johnpapa 里约定的 activate()，生命周期同 Angular 的 ngOnInit()

  console.log('CTRL: $scope.vm.min = %s', $scope.vm.min);
  console.log('CTRL: $scope.vm.max = %s', $scope.vm.max);
  console.log('CTRL: vm.min = %s', vm.min);
  console.log('CTRL: vm.max = %s', vm.max);

  // Angular 1.5+ does not bind attributes until calling $onInit();
  function onInit() {
    console.log('CTRL-onInit: $scope.vm.min = %s', $scope.vm.min);
    console.log('CTRL-onInit: $scope.vm.max = %s', $scope.vm.max);
    console.log('CTRL-onInit: vm.min = %s', vm.min);
    console.log('CTRL-onInit: vm.max = %s', vm.max);
  }
}
```

### bindToController

**bindToController** 主要是为了将外层作用域绑定到指令控制器的作用域，看个例子:

```JS
app.directive('someDirective', someFn);

function someFn() {
  var directive = {
    scope: {},
    controller: function() {
      this.name = 'Tate';
    },
    controllerAs: 'ctrl',
    template: '<div>{ { ctrl.name } }</div>' // 这里插值表达式的空格请忽略，为了防止在页面中被解析成空白
  }
  return directive;
}
```

倘若 name 属性需要与父域共享，可以在 scope 中定义 <code>{ name: '=' }</code>。但外部的 name 属性发生变化并不会立即反应到内部的 controller 的 this 对象上。在 1.2 版本里面处理这种情况就是使用 $scope 服务上挂载的 $watch 方法去监听 name 属性的变化:

```JS
function someFn() {
  var directive = {
    scope: {
      name: '='
    },
    controller: function($scope) {
      this.name = 'Tate';

      $scope.$watch('name', function(newValue){
        this.name = newValue;
      }.bind(this));
    }
  }
  return directive;
}
```

bindToController 即针对此情况在 1.3 版本发布的，当 directive 使用独立作用域以及 controllerAs 语法，且 <code>bingToController=true</code> 时，该组件的属性都被绑定到 controller 上而不是 scope:

```JS
function someFn() {
  var directive = {
    scope: {
      name: '='
    },
    bindToController: true,
    controller: function () {
      this.name = 'Tate';
    },
    controllerAs: 'ctrl',
    template: '<div>{ {ctrl.name} }</div>'
  }
  return directive;
}
```

```JS
// 1.4 版本后可以写成以下形式，将独立作用域上的值绑定到 bindToController 上，以便于更清晰看到需要绑定的属性
var directive = {
  scope: {},
  bindToController: {
    name: '='
  },
  /* ... */
}
```

### compile / link

AngularJS 启动时，会对指令进行编译(compile)和链接(link)，作用域会同 HTML 进行绑定。简单来说:

* **编译阶段(compile)** - 负责将原始模板(source template)进行转换为实例模板(instance template)，并且为实例元素提供对应的 scope，以便于一起作为参数传入 link 函数，此 scope 取决于指令中定义的作用域。此阶段自定义的 link 函数无效，因为其本身会返回一个 link 函数进行后续处理，且无法访问 scope
* **链接阶段(link)** - 负责将作用域和 DOM 进行链接，包括注册事件、绑定数据等
  * **pre-link** - 在 post-link 执行前做一些逻辑处理，比如子指令需要父指令中定义的属性等
  * **post-link** - 主要在此阶段进行注册事件或操作 DOM 等。若自定义的指令中只有 link 函数，则它属于 post-link

栗子[摘自这里](https://www.jvandemo.com/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives/)，在指令中定义 compile、pre-link 及 post-link 函数。

<p data-height="265" data-theme-id="light" data-slug-hash="QrGbPa" data-default-tab="js,result" data-user="tate-young" data-embed-version="2" data-pen-title="QrGbPa" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/tate-young/pen/QrGbPa/">QrGbPa</a> by Tate (<a href="https://codepen.io/tate-young">@tate-young</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

打开控制台，可以看到大体的执行顺序，这里省略了打印的 html 信息:

```TEXT
// 这里的元素仍然是最原始的样板标签

// COMPILE 阶段
// levelOne:    原始 DOM 中 compile
// levelTwo:    原始 DOM 中 compile
// levelThree:  原始 DOM 中 compile

// 从这里开始，元素已经实例化且綁定了 SCOPE
// (例：NG-REPEAT 已有多重实例)

// PRE-LINK 阶段
// levelOne:    元素实例中 pre link
// levelTwo:    元素实例中 pre link
// levelThree:  元素实例中 pre link

// POST-LINK 阶段 (注意到順序相反)
// levelThree:  元素实例中 post link
// levelTwo:    元素实例中 post link
// levelOne:    元素实例中 post link
```

![compile](https://www.jvandemo.com/content/images/2014/Aug/cycle-2.png)

从上图可知，当 level-one 执行完 post-link 函数时，可以确保子元素全部已经执行过 post-link，因此此阶段被认为是操作指令逻辑最安全的地方，比如注册事件等。

这里涉及两个概念，具体[参考这里](https://stackoverflow.com/questions/24615103/angular-directives-when-and-how-to-use-compile-controller-pre-link-and-post/24615239#24615239):

* **Source template** - the markup to be cloned, if needed. If cloned, this markup will not be rendered to the DOM.
* **Instance template** - the actual markup to be rendered to the DOM. If cloning is involved, each instance will be a clone.

```HTML
<div ng-repeat="i in [0, 1, 2]">
  <my-directive>{{i}}</my-directive>
</div>
```

上面栗子的原始模板如下，但是它被包裹 ng-repeat 指令中，而且会被克隆三次。这些克隆就是 instance template，每个都会渲染到 DOM 中，并且绑定到相应的 scope 上:

```HTML
<my-directive>{{i}}</my-directive>
```

再看个 pre-link 的示例，示例[来源于这里](https://www.undefinednull.com/2014/07/07/practical-guide-to-prelink-postlink-and-controller-methods-of-angular-directives/):

<script async src="//jsfiddle.net/shidhincr/Bpxn2/2/embed/"></script>

如果不用父指令中的 pre-link，而改为 link，根据执行顺序可知 son 会先执行 link(即 post-link)，故此处拿不到 name。当然采用 pre-link 也可以，但一般数据共享可以通过 controller 配合 require 来处理:

<script async src="//jsfiddle.net/shidhincr/Bpxn2/3/embed/"></script>

> controller 执行顺序为: compile --> controller --> pre-link --> post-link。

## Angular 指令

### 指令类型及接口

在 Angular 中有三种类型的[指令](https://angular.cn/guide/attribute-directives):

* **组件** — 拥有模板的指令，继承与指令
* **结构型指令** — 通过添加和移除 DOM 元素改变 DOM 布局的指令，如 \*ngFor、\*ngIf 等
* **属性型指令** — 改变元素、组件或其它指令的外观和行为的指令

```JS
// angular/packages/core/src/metadata/directives.ts
export interface Directive {
  selector?: string; // 定义 selector 选择器
  inputs?: string[]; // 输入属性
  outputs?: string[]; // 输出属性
  host?: {[key: string]: string}; // 绑定宿主的属性、事件等
  providers?: Provider[]; // 服务
  exportAs?: string; // 导出指令，使得可以在模板中调用
  queries?: {[key: string]: any}; // 设置指令的查询条件
}

export interface Component extends Directive {
  changeDetection?: ChangeDetectionStrategy; // 变化检测策略，默认为 Default，可设置为 OnPush
  viewProviders?: Provider[]; // 设置组件及其子组件(不含 ContentChildren)可以用的服务
  moduleId?: string; // 包含该组件模块的 id
  templateUrl?: string; // 模板地址
  template?: string; // 模板
  styleUrls?: string[]; // 样式文件地址
  styles?: string[]; // 样式
  animations?: any[]; // 动画
  encapsulation?: ViewEncapsulation; // 视图封装，有三种形式
  interpolation?: [string, string]; // 设置默认的插值运算符，默认是"{{"和"}}"
  entryComponents?: Array<Type<any>|any[]>; // 设置需要被提前编译的组件
}
```

#### 属性型指令

这里采用官网的栗子，实现一个 highlight 效果:

```JS
<p appHighlight>Highlight me!</p>
```

根据 angular-cli 的命令 <code>ng g d highlight</code> 自动生成空的指令，简单的做下修改:

```JS
import { Directive, ElementRef } from '@angular/core'; // 注入 ElementRef，来引用宿主 DOM 元素

@Directive({ // @Directive 装饰器的配置属性中指定了该指令的 CSS 属性型选择器 [appHighlight]
  selector: '[appHighlight]'
})
export class HighlightDirective { // 控制器类叫 HighlightDirective，它包含了该指令的逻辑
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow'; // ElementRef 通过其 nativeElement 属性可以直接访问宿主 DOM 元素
  }
}
```

#### 结构型指令

结构性指令最明显的特征是星号(*)，星号是一个用来简化更复杂语法的“语法糖”。从内部实现来说，Angular 把 *ngIf 属性 翻译成一个 <code>ng-template</code> 元素 并用它来包裹宿主元素，在渲染视图之前，Angular 会把 <code>ng-template</code> 及其内容替换为一个注释，代码如下:

```HTML
<div *ngIf="hero" class="name">{ { hero.name } }</div>

<!-- 翻译为 -->
<!-- *ngIf 指令被移到了 ng-template 元素上。在那里它变成了一个属性绑定 [ngIf] -->
<ng-template [ngIf]="hero">
  <div class="name">{ { hero.name } }</div>
</ng-template>
```

另一个栗子，*ngFor:

```HTML
<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({ { i } }) { { hero.name } }
</div>

<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({ { i } }) { { hero.name } }</div>
</ng-template>
```

### 生命周期钩子

[指令生命周期钩子](https://angular.cn/guide/lifecycle-hooks)分为两大组:

* 指令与组件共有的钩子
  * **ngOnChanges** - 当数据绑定输入属性的值发生变化时调用
  * **ngOnInit** - 在第一次 ngOnChanges 后调用
  * **ngDoCheck** - 自定义的方法，用于检测和处理值的改变
  * **ngOnDestroy** - 指令销毁前调用，此时可以移除事件监听、清除定时器、退订 Observable 等。
* 组件特有的钩子
  * **ngAfterContentInit** - 在组件内容初始化之后调用，在组件使用 ng-content 指令的情况下，Angular 会在将外部内容放到视图后用。它主要用于获取通过 @ContentChild 或 @ContentChildren 属性装饰器查询的内容视图元素
  * **ngAfterContentChecked** - 组件每次检查内容时调用
  * **ngAfterViewInit** - 组件相应的视图初始化之后调用，在组件相应的视图初始化之后调用，它主要用于获取通过 @ViewChild 或 @ViewChildren 属性装饰器查询的视图元素
  * **ngAfterViewChecked** - 组件每次检查视图时调用

这里挑几个说一说:

1、**constructor**

组件的构造函数会在所有的生命周期钩子之前被调用，它主要用于依赖注入或执行简单的数据初始化操作:

```JS
constructor(public elementRef: ElementRef) { // 使用构造注入的方式注入依赖对象
  this.name = 'Tate'; // 初始化
}
```

2、**ngOnChanges**

当绑定的输入属性的值发生变化的时候触发。接受一个 SimpleChanges 对象，包含绑定属性的新值和旧值，它主要用于监测组件输入属性的变化:

```JS
import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'exe-child',
  template: `<p>{{ name }}</p>`
})
export class ChildComponent implements OnChanges{
  @Input() name: string;

  ngOnChanges(changes: SimpleChanges) {
    console.dir(changes); // 包含 currentValue 和 previousValue
  }
}
```

3、**ngOnInit**

在 ngOnChanges 执行后被调用，仅执行一次。它主要用于执行组件的其它初始化操作或获取组件输入的属性值:

```JS
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'exe-child',
  template: `<p>{{name}} </p>`
})
export class ChildComponent implements OnInit {
  @Input() name: string; // 来自父组件的输入属性 name

  constructor() {
      console.log('ChildComponent constructor', this.name); // undefined，此时无法拿到 name 的值
  }

  ngOnInit() {
      console.log('ChildComponent ngOnInit', this.name); // 输入的 name 值
  }
}
```

## 参考链接

1. [angular-styleguide johnpapa](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) By johnpapa
2. [AngularJS 指令开发（1）—— 参数详解](https://segmentfault.com/a/1190000003937942  ) By Tgor
3. [AngularJs 指令 directive 之 require](http://hudeyong926.iteye.com/blog/2074238) By hudeyong926
4. [使用 controllerAs 代替 $scope](https://segmentfault.com/a/1190000006624138?_ea=1121830) By Jax2000
5. [Controller As in Angularjs](https://segmentfault.com/a/1190000004164613) By 苹果小萝卜
6. [BINDING TO DIRECTIVE CONTROLLERS IN ANGULAR 1.3](https://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html) By Pascal Precht
7. [angular.js 中指令 compile 与 link 原理剖析](https://www.cnblogs.com/GoodPingGe/p/4361354.html) By 叶耶嘢
8. [The nitty-gritty of compile and link functions inside AngularJS directives](https://www.jvandemo.com/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives/) By Jurgen Van de Moere
9. [stackoverflow - Angular directives - when and how to use compile, controller, pre-link and post-link](https://stackoverflow.com/questions/24615103/angular-directives-when-and-how-to-use-compile-controller-pre-link-and-post/24615239#24615239)
10. [Practical Guide to PreLink, PostLink and Controller Methods of Angular Directives](https://www.undefinednull.com/2014/07/07/practical-guide-to-prelink-postlink-and-controller-methods-of-angular-directives/) By Shidhin
11. [Angular 2 Directive Lifecycle](https://segmentfault.com/a/1190000008716308) By semlinker
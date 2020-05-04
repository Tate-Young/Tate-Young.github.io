---
layout: blog
front: true
comments: True
flag: NG
background: green
category: 前端
title:  AngularJS 启动过程
date:   2018-04-24 16:35:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/24/5ade80f820807.jpg
tags:
- AngularJS
---
# {{ page.title }}

**AngularJS** 是一个 JavaScript 框架，可以构建一个单一页面应用程序(SPAs：Single Page Applications)，**ng-app** 指令定义一个 AngularJS 应用程序，决定整个框架的启动和作用范围。主要分为三个步骤(本文依据 AngularJS@1.6.4):

1. **bindJQuery()** - 绑定 jQuery 或 jQLite;
2. **publishExternalAPI(angular)** - 输出 angular 对象的 API;
3. **jqLite(function(){ angularInit(window.document, bootstrap) })** - DOM 解析完毕后，初始化并启动。

```JS
angular = window.angular || (window.angular = {})

if (window.angular.bootstrap) { // 判断 angular 是否已启动
  // AngularJS is already loaded, so we can return here...
  if (window.console) {
    console.log('WARNING: Tried to load angular more than once.');
  }
  return;
}
bindJQuery(); // 绑定 jQuery，默认为 jQLite
publishExternalAPI(angular);// 输出 angular 对象的 API
jqLite(function() { // 初始化和启动 angular
  angularInit(window.document, bootstrap);
});
```

这里引用作者城池的一张图:

![angularInit](https://i.loli.net/2018/04/24/5adef95123f4f.jpg)

## bindJQuery()

**bindJQuery()** 用于绑定 jQuery，默认为更轻量级的 [jQLite](https://docs.angularjs.org/api/ng/function/angular.element)。

```JS
if (jQuery && jQuery.fn.on) {
    jqLite = jQuery;
    /* ... */
  } else {
    jqLite = JQLite;
  }

  angular.element = jqLite;

  // Prevent double-proxying.
  bindJQueryFired = true;
}
```

**angular.element()** 与 jQuery 的 **$()** 类似，但只支持 DOM 元素或类似 html 元素的字符串，而不支持选择器:

```JS
angular.element('<div>');
angular.element(document.getElementById(‘myId’));

// angular.element('#myId'); // 错误的写法
```

## publishExternalAPI()

**publishExternalAPI()** 接受一个 angular 对象，用来输出对象上定义的接口。这一过程分为以下几个步骤:

1. 将工具函数拷贝到 angular 全局对象中;
2. 调用 setupModuleLoader 方法创建模块定义和加载工具;
3. 构建内置模块 ng;
4. 创建 ng 内置的 directive 和 provider，包括 $parse 和 $rootScope 等。

```JS
function publishExternalAPI(angular) {
  extend(angular, { // 将工具函数拷贝到 angular 全局对象中
    'errorHandlingConfig': errorHandlingConfig,
    'bootstrap': bootstrap,
    'copy': copy,
    'extend': extend,
    'merge': merge,
    'equals': equals,
    'element': jqLite,
    'forEach': forEach,
    /* ... */
  });

  angularModule = setupModuleLoader(window); // 创建模块加载器，主要作用是通过 angular.module 创建和获取模块

  angularModule('ng', ['ngLocale'], ['$provide',
    function ngModule($provide) {
      // $$sanitizeUriProvider needs to be before $compileProvider as it is used by it.
      $provide.provider({
        $$sanitizeUri: $$SanitizeUriProvider
      });
      $provide.provider('$compile', $CompileProvider).
        directive({ // //创建 ng 内置的 directive
          a: htmlAnchorDirective,
          input: inputDirective,
          ngBind: ngBindDirective,
          ngClass: ngClassDirective,
          ngController: ngControllerDirective,
          ngRepeat: ngRepeatDirective,
          ngShow: ngShowDirective,
          /* ... */
        }).
        directive({
          ngInclude: ngIncludeFillContentDirective
        }).
        directive(ngAttributeAliasDirectives).
        directive(ngEventDirectives);
      $provide.provider({ // 创建 ng 内置的 provider
        $filter: $FilterProvider,
        $http: $HttpProvider,
        $parse: $ParseProvider,
        $rootScope: $RootScopeProvider,
        $q: $QProvider,
        $sce: $SceProvider,
        $timeout: $TimeoutProvider,
        /* ... */
      });
    }
  ])
  .info({ angularVersion: '1.6.4' });
}
```

### setupModuleLoader()

**setupModuleLoader()** 的实现如下:

1. 主要为 angular 定义 module 属性;
2. 在 module 上挂载 controller、directive、service 等方法，注意此处只是定义服务，真正的创建是通过注入器来完成的。

```JS
function setupModuleLoader(window) {
  function ensure(obj, name, factory) { // 通过 ensure 方法得到的对象能够保证全局唯一性
    return obj[name] || (obj[name] = factory());
  }
  var angular = ensure(window, 'angular', Object); // 确保 window 对象拥有 angular 属性
  return ensure(angular, 'module', function() { // 返回 angular.module
    var modules = {};

    return function module(name, requires, configFn) { // name 用来定义模块的名称，requires 是一个数组对象，用来定义该模块以外的模块名称
      /* ... */
      return ensure(modules, name, function() { // 执行 angular.module() 后，在返回的 moduleInstance 实例上挂载以下方法，再次返回该实例。因此可以链式调用
        var moduleInstance = {
          // Private state
          _invokeQueue: invokeQueue, // // invokeQueue 会被初始化为一个空数组 []
          _configBlocks: configBlocks,
          _runBlocks: runBlocks,
          provider: invokeLaterAndSetModuleName('$provide', 'provider'),
          service: invokeLaterAndSetModuleName('$provide', 'service'),
          filter: invokeLaterAndSetModuleName('$filterProvider', 'register'),
          controller: invokeLaterAndSetModuleName('$controllerProvider', 'register'),
          directive: invokeLaterAndSetModuleName('$compileProvider', 'directive'),
          /* ... */
          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        }
        return moduleInstance;

        /* ... */
        function invokeLaterAndSetModuleName(provider, method, queue) { // 默认将参数 push 到 _invokeQueue 中稍后执行
          if (!queue) queue = invokeQueue;
          return function(recipeName, factoryFunction) {
            if (factoryFunction && isFunction(factoryFunction)) factoryFunction.$$moduleName = name;
            queue.push([provider, method, arguments]);
            return moduleInstance;
          };
        }
      });
    };
   });
};
```

因此，在声明 angular.module 后，可以在返回的对象上挂载控制器或服务等，且支持链式调用，如 <code>.controller().directive()</code>:

```JS
// 创建模块
var app = angular.module('myAPP', []);

// 获取模块
angular
  .module('myApp')
  .controller('myController', myController);

myController.$inject = ['$scope']; // 标注式依赖注入

function myController($scope) {
  $scope.name = 'tate';
}
```

## angularInit()

**angularInit** 方法定义了 angular 的初始化方法，查找 <code>ng-app='myApp'</code> 指令，得到名为 "myApp" 的模块，并在末尾直接调用了 **bootstrap** 方法启动:

```JS
var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];

function angularInit(element, bootstrap) {
  var appElement,
      module,
      config = {};

  // The element `element` has priority over any other element.
  // 寻找 ng-app 指令，包含 ng:app、x-ng-app 等
  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';

    if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
      appElement = element;
      module = element.getAttribute(name);
    }
  });
  forEach(ngAttrPrefixes, function(prefix) {
    /* ... */
  });
  if (appElement) {
    /* ... */
    bootstrap(appElement, module ? [module] : [], config);
  }
}
```

若页面存在多个 ng-app 指令，AngularJS 只会自动引导启动它找到的第一个 ng-app 应用，此时可以通过 <code>angular.bootstrap</code> 方法手动引导:

```JS
angular.bootstrap(element, [modules], [config]);
```

### bootstrap()

**bootstrap** 方法的主要实现如下:

```JS
function bootstrap(element, modules, config) {
  /* ... */
  var doBootstrap = function() {
    element = jqLite(element);

    if (element.injector()) {
      var tag = (element[0] === window.document) ? 'document' : startingTag(element);

    modules = modules || []; // 目前 modules = ['myApp']
    modules.unshift(['$provide', function($provide) {
      $provide.value('$rootElement', element);
    }]);
    modules.unshift('ng'); // 需要注入的模块数组

    // 创建根注入器，返回一个 instanceInjector 实例，继承 invoke、get 等方法
    // 此时 modules = ['ng',['$provider',function(){/.../}], 'myApp']
    var injector = createInjector(modules, config.strictDi);
    injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector',
       function bootstrapApply(scope, element, compile, injector) {
        scope.$apply(function() { // 调用 $apply 方法将将作用域转入 angular 作用域，即通过脏检查实现数据双向绑定
          element.data('$injector', injector);
          compile(element)(scope); // compile 编译，编译的核心是生成指令对应的 link 函数
        });
      }]
    );
    return injector;
  };
  /* ... */
}
```

### createInjector()

**createInjector** 方法用来创建根注入器，注入器是访问 AngularJS 所有功能的入口，而 AngularJS 的功能实现，是通过模块的方式组织的。所以在创建注入器的时候，需要告诉 AngularJS 载入哪些模块，即上述的 modules:

```JS
function createInjector(modulesToLoad, strictDi) {
  strictDi = (strictDi === true);
  var INSTANTIATING = {},
    providerSuffix = 'Provider',
    path = [],
    loadedModules = new NgMap(), // 操作存储模块的一个数据结构，如 get、set 等
    providerCache = {
      $provide: {
        provider: supportObject(provider),
        factory: supportObject(factory),
        service: supportObject(service),
        value: supportObject(value),
        constant: supportObject(constant),
        decorator: decorator
      }
    },
    providerInjector = (providerCache.$injector = // provider 注入器
      createInternalInjector(providerCache, function(serviceName, caller) {
        if (angular.isString(caller)) {
          path.push(caller);
        }
        throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
      })),
    instanceCache = {}, // // 所有被注入器管理的对象缓存
    protoInstanceInjector =
      createInternalInjector(instanceCache, function(serviceName, caller) {
        var provider = providerInjector.get(serviceName + providerSuffix, caller);
        return instanceInjector.invoke(
          provider.$get, provider, undefined, serviceName);
      }),
    instanceInjector = protoInstanceInjector;

  // 此处将实例注入器通过 $injectorProvider 这个键值给注册到了 providerCache 中去
  // 当你需要 $injector 时，实例注入器会委托给 provider 注入器，该注入器去寻找一个名为 $injectorProvider 的 provider 对象，并调用其 $get 方法返回真正的实例。
  providerCache['$injector' + providerSuffix] = { $get: valueFn(protoInstanceInjector) };
  instanceInjector.modules = providerInjector.modules = createMap();

  var runBlocks = loadModules(modulesToLoad); // 加载模块
  instanceInjector = protoInstanceInjector.get('$injector');
  instanceInjector.strictDi = strictDi;

  // 遍历并执行创建工作
  forEach(runBlocks, function(fn) { if (fn) instanceInjector.invoke(fn); });

  return instanceInjector; // 返回一个注入器实例

  ////////////////////////////////////
  // $provider
  ////////////////////////////////////
  function supportObject(delegate) {
    return function(key, value) {
      if (isObject(key)) {
        forEach(key, reverseParams(delegate));
      } else {
        return delegate(key, value);
      }
    };
  }

  function provider(name, provider_) {
    assertNotHasOwnProperty(name, 'service');
    if (isFunction(provider_) || isArray(provider_)) { // 如果提供的是 provider 是函数或者数组，直接使用 injector 实例化
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
    }
    return (providerCache[name + providerSuffix] = provider_);
  }

  function factory(name, factoryFn, enforce) { // factory 服务本质上调用的是 provider
    return provider(name, {
      $get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn
    });
  }

  function service(name, constructor) { // service 服务本质上调用的是 factory，只是书写形式不同而已
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
  }
}
```

可以看到在 **$provide** 的实现里有以下几个方法: provider、service、factory 等。内部其实调用的都是 provider 方法，provider 方法必须包含一个 $get 属性，但通过 service、factory 等方法创建的话，不必显式的调用 $get 属性，因为 factory 方法中已经帮你实现了。具体写法请[参考以下部分](#provider--factory--service)。

这里涉及几个重要的变量，一个是 **providerCache**，这个会保存一个 $provide 属性对象，此属性对象主要用来对外提供创建服务提供者(provider)的方法，同时，providerCache 会保存所有已经注入进来的 provider。providerCache 还有一个 $injector 属性对象，此属性对象就是一个注入器实例。它跟另一个变量 **providerInjector** 指向的是同一个注入器实例对象。

**instanceCache** 变量会保存所有已经实例化的 provider 对象，同时，这个变量的 $injector 属性值是一个注入器实例。它跟另外一个变量 **instanceInjector** 指向的是同一个注入器实例对象，这个注入器实例对象是用来真正实例化一个 provider 的。

```JS
providerCache = {
  $provide: {
    provider: supportObject(provider),
    factory: supportObject(factory),
    service: supportObject(service),
    value: supportObject(value),
    constant: supportObject(constant),
    decorator: decorator
  },
  $injector:{
    invoke:invoke,
    instantiate:instantiate,
    get:getService,
    annotate:annotate,
    has:has
  }
}

instanceInjector = {
  invoke: invoke,
  instantiate: instantiate,
  get: getService,
  annotate: annotate,
  has: has
}
```

### createInternalInjector()

```JS
function createInternalInjector(cache, factory) {
  // 获取服务的函数，函数体中的 cache 就是之前提到的 instanceCache
  function getService(serviceName, caller) {}

  function invoke(fn, self, locals, servicename) {}

  // module 上定义 service，provider 的时候，实际上内部就是调用的 instantiate 函数来完成对象的创建
  function instantiate(Type, locals, serviceName) {}

  return { // $injector 服务，返回五个方法
    invoke: invoke,
    instantiate: instantiate,
    get: getService,
    annotate: createInjector.$$annotate,
    has: function(name) {
      return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
    }
  };
}
```

**invoke** 方法可以直接调用一个用户自定义的函数体，并通过函数参数注入所依赖的服务对象，并进行实例化:

```JS
angular.injector(['ng'])
  .invoke(function($http){
    //do sth. with $http
  });
```

**annotate** 注释是实现依赖注入的关键元素之一，查看后文示例--[依赖注入的三种写法](#依赖注入的三种写法)，AngularJS 如何知道需要注入 $scope 以及 $rootScope 呢？详情可以[查看这篇博客](https://blog.csdn.net/dm_vincent/article/details/52081180)。

### loadModules()

在加载模块的时候，之前定义在任务队列(_invokeQueue)中的任务就会被执行:

```JS
function loadModules(modulesToLoad) {
  /* ... */
  forEach(modulesToLoad, function(module) { // 加载传入的每个模块
    function runInvokeQueue(queue) { // 运行传入的 _invokeQueue
      var i, ii;
      // 通过注入器得到对应的服务提供者 provider，然后调用服务提供者的实例化方法，创建这个服务的实例对象
      for (i = 0, ii = queue.length; i < ii; i++) {
        var invokeArgs = queue[i],
          provider = providerInjector.get(invokeArgs[0]); // 得到 $provide 对象

        provider[invokeArgs[1]].apply(provider, invokeArgs[2]); // 实际上的调用的是 $provide 对象上的 provider 方法
      }
    }

    try {
      if (isString(module)) { // 实例化
        moduleFn = angularModule(module); // 根据 module 拿到对应的实例，angularModule = setupModuleLoader(window)
        instanceInjector.modules[module] = moduleFn;
        // 递归进行 module 的加载工作，因为被依赖的 module 同样还可以依赖于别的 module
        runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
        // 开始执行 _invokeQueue 中的任务
        runInvokeQueue(moduleFn._invokeQueue);
        // 开始执行配置队列
        runInvokeQueue(moduleFn._configBlocks);
      } else if (isFunction(module)) {
        runBlocks.push(providerInjector.invoke(module));
      } else if (isArray(module)) {
        runBlocks.push(providerInjector.invoke(module));
      } else {
        assertArgFn(module, 'module');
      }
    } catch (e) {
      if (isArray(module)) {
        module = module[module.length - 1];
      }
      /* ... */
    }
  });
  return runBlocks; // 用于容纳注入器需要执行的任务的数组
}
```

## 依赖注入相关的三种队列

本部分摘自[配置队列以及运行队列](https://blog.csdn.net/dm_vincent/article/details/52199714)。

1、**任务队列(Invoke Queue)**

调用 module 上的高层 API 就会向任务队列中增加一个相应任务，比如 module.constant 的调用就导致了一个常量任务的创建，具体而言就是定义在依赖注入模块(injector.js)中的 constant 函数的执行：

```JS
function constant(name, value) {
  assertNotHasOwnProperty(name, 'constant');
  providerCache[name] = value;
  instanceCache[name] = value;
}
```

除此之外，还有对应于 config 中 factory、service 等方法的定义在注入器中的 factory 函数和 service 函数等。对于 factory、service 等任务而言，它们的执行并不会导致真正的对象被创建，而是注册一个具体的 provider，这个 provider 知道该如何创建真正的对象，待需要的时候创建之，从而实现”懒加载”。执行时机上，任务队列的执行发生在模块被加载的时候。

2、**配置队列(Config Queue)**

配置队列是为了提供一个配置各种 providers 的地方，通过 provider 注入器完成调用。任务队列和执行队列中定义的任务都是通过实例注入器进行调用的，因此它们无法直接地注入定义在 provider 注入器中的各种 providers。配置队列的执行时机和任务队列相似，都是在加载某个模块的时候就会被执行，但是在顺序上它的执行发生在同模块的任务队列执行之后。

3、**运行队列(Run Queue)**

它用于定义一些模块的初始化工作。和任务队列一样，定义在运行队列中的任务都是通过实例注入器完成实际的调用工作的。但是和它以及配置队列不一样的是，它的执行时机是在所有模块全部加载完毕之后，此时所有的服务都已经完成注册工作(各路 providers 都已经准备好，知道如何初始化托管对象)。所以当运行队列中的任务被执行时，它是可以将需要的各种依赖都声明在其参数列表中的，哪怕这些依赖被定义在不同的模块中。

## 依赖注入的三种写法

1、**标注式注入($inject)**

```JS
angular.module('myApp', []);
  .controller('myController', myFn);

myFn.$inject = ['Alice', 'Bob'];
function myFn(a, b) {
  // a 代表的就是 Alice 服务
  // b 代表的就是 Bob 服务
}
```

2、**内联式注入**

```JS
angular.module('myApp', []);
  .controller('myController', ['Alice', 'Bob', myFn]);

function myFn(a, b) {
  // a 代表的就是 Alice 服务
  // b 代表的就是 Bob 服务
}
```

3、**推断式注入**

```JS
angular.module('myApp', []);
  .controller('myController', myFn);

function myFn(Alice, Bob) {}
```

## provider / factory / service

三种写法如下，本质上一样:

```JS
// service
angular.module('myApp')
  .service('user', function($http) { // 隐式注入服务
    var self = this;  // service() 是通过构造函数创建的
    this.name = 'tate';
    this.setName = function(newName) {
      self.name = newName;
    }
  }
});
```

```JS
// service
angular.module('myApp')
  .factory('user', function($http) { // 隐式注入服务
    var user = {
      'name': 'tate',
      'setName': function(newName) {
        user.name = newName;
      }
    }
    return user; // 返回 user 对象
  }
});
```

```JS
// provider
angular.module('myApp')
  .provider('user', function() {
    this.$get = function($http) { // 隐式注入服务
      var user = {
        'name': 'tate',
        'setName': function(newName) {
        user.name = newName;
        }
      }
      return user; // 返回 user 对象
    }
  }
});
```

## 参考链接

1. [AngularJS 的启动引导过程](https://www.cnblogs.com/sealzrt/p/5465203.html) By sealzrt
2. [angularjs 源码分析之：angularjs 执行流程](https://www.cnblogs.com/wuya16/p/3769032.html) By 城池
3. [AngularJS 源码解析2：注入器的详解](https://www.cnblogs.com/chaojidan/p/4267846.html) By chaojidan
4. [[AngularJS面面观] 14. 依赖注入 --- module 的定义与实现](https://blog.csdn.net/dm_vincent/article/details/51884464) By dm_vincent
5. [AngularJS 中的 Provider 们：Service 和 Factory 等的区别](https://segmentfault.com/a/1190000003096933) By savokiss

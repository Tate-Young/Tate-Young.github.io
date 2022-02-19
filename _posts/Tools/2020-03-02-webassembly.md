---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  WebAssembly 与 JIT
date:   2020-03-02 17:02:00 GMT+0800 (CST)
update: 2022-02-19 17:15:00 GMT+0800 (CST)
description: add JS Runtime
background-image: /style/images/smms/webassembly.png
tags:
- JavaScript
---
# {{ page.title }}

## 什么是 WebAssembly

TLDR - 参考 MDN，我们得知 [**WebAssembly**](https://developer.mozilla.org/zh-CN/docs/WebAssembly) **是一种新的编码方式**，可以在现代浏览器中运行。它是一种低级的类汇编语言，具有紧凑的二进制格式，可以接近原生的性能运行，并为诸如 C/C++ 等语言提供一个编译目标，以便它们可以在 Web 上运行。它也被设计为可以与 JavaScript 共存，允许两者一起工作。

### asm.js / Emscripten

那么有同学就问了，为啥要编译 C/C++ 到网页上运行呢？我们知道 Web 技术发展迅猛，但是针对一些游戏或者使用该语言开发的应用，我们仍然没有办法让他们在浏览器上高效地运行。因此我们需要将编程语言转换为 JavaScript。[Alon Zakai](https://github.com/kripken?tab=repositories) 大佬为此专门做了一个编译器项目 [**Emscripten**](https://emscripten.org)。这个编译器可以将 C/C++ 代码编译成一种 JavaScript 的变体，即 [**asm.js**](http://asmjs.org)。

C/C++ 编译成 JS 有两个最大的难点，即:

1. C/C++ 是静态类型语言，而 JS 是动态类型语言。
2. C/C++ 是手动内存管理，而 JS 依靠垃圾回收机制。

asm.js 就是为了解决这两个问题而设计的：**asm.js 的变量一律都是静态类型，并且取消垃圾回收机制**。除了这两点，它与 JavaScript 并无差异，也就是说，asm.js 是 JavaScript 的一个高度优化的子集，只能使用后者的一部分语法。并且 JavaScript 引擎还会针对 asm.js 使用 AOT 预编译来优化提速。

> This specification defines asm.js, a strict subset of JavaScript that can be used as a low-level, efficient target language for compilers. This sublanguage effectively describes a sandboxed virtual machine for memory-unsafe languages like C or C++. A combination of static and dynamic validation allows JavaScript engines to employ an ahead-of-time (AOT) optimizing compilation strategy for valid asm.js code.

### WebAssembly

那还有原因就是 JavaScript 自身性能瓶颈问题，我们知道编程语言与计算机的交流必须依靠“翻译官”，让计算机明白你要干嘛。而这个“翻译官”就是解释器或编译器:

* **解释器(Interpreter)** - 一行行读取源代码，并且直接生成指令让计算机硬件执行，不会输出另外一种代码。相比下效率会较低
* **编译器(Compiler)** - 执行前翻译好，将源代码转换成其他的更低级的代码(例如二进制码、机器码)，但是不会执行它。执行的效率会更加高，预编译会消耗一些时间。

> **低级语言代码(Low-Level Code)** 是相对高级语言(High-Level Code)而言，少了更多的抽象概念，更加接近于汇编或者机器指令

而浏览器最开始使用的就是 JavaScript 解释器，在 2008 年，**即时编译器(JITs)** 一经推出，JavaScript 运行速度蹭蹭上涨，随着性能的改进，我们可以运用 JavaScript 做更多的事情，比如 Electron 构建跨平台应用程序等。可想而知，随着 WebAssembly 的盛行，Web 技术又将迎来一场革新，我们拭目以待。

![jits](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/01-02-perf_graph10.png)

> 有的小伙伴可能会问了，有了 JIT，JS 还算是解释型语言吗？这里 JIT 其实只是在执行前进行编译，并没有去转换为更低级的代码

那么 WebAssembly 究竟给我们带来了什么呢？首先我们知道，它跟 JavaScript 没有半毛钱关系，**WebAssembly 是经过编译器编译之后的代码，体积小、起步快。在语法上完全脱离 JavaScript，同时具有沙盒化的执行环境。WebAssembly 同样的强制静态类型，是 C/C++/Rust 的编译目标**。

综上描述，我们不难发现和 asm.js 有很多相似点，但是还是有一些地方不同，而 Emscripten 也支持转换两种不同的语言。不管你使用的什么工具链，最终的结果都应该是以 `.wasm` 结尾的文件:

1. asm.js 是文本，WebAssembly 是二进制字节码，因此运行速度更快、体积更小
2. asm.js 可以支持手写，更直观，不存在浏览器兼容性问题

总体而言，使用 WebAssembly，可以更快地在 web 应用上运行代码。它的运行速度比 JavaScript 高效的原因有以下几个:

1. 文件加载 - WebAssembly 文件体积更小，所以下载速度更快
2. 解析 - 解码 WebAssembly 比解析 JavaScript 要快
3. 编译和优化 - 编译和优化所需的时间较少，因为在将文件推送到服务器之前已经进行了更多优化，JavaScript 需要为动态类型多次编译代码
4. 重新优化 - WebAssembly 代码不需要重新优化，因为编译器有足够的信息可以在第一次运行时获得正确的代码
5. 执行 - 执行可以更快，WebAssembly 指令更接近机器码
6. 垃圾回收 - 目前 WebAssembly 不直接支持垃圾回收，垃圾回收都是手动控制的，所以比自动垃圾回收效率更高

下图是 Unity WebGL 使用 WebAssembly 和 asm.js 的评分，可以参考一下，更多对比可以[参考这里](https://blogs.unity3d.com/2018/09/17/webassembly-load-times-and-performance/) 👈:

目前常用的能支持编译成 WebAssembly 的工具有:

* Emscripten - 上面已经讲到了，也支持转换为 asm.js
* [**AssemblyScript**](https://github.com/AssemblyScript/assemblyscript) - 语法和 TypeScript 差不多，对于前端学习成本较低
* [WABT](https://github.com/WebAssembly/wabt) - 是将 WebAssembly 在字节码和文本格式相互转换的一个工具

> 这两种技术虽然都是极高提升 web 程序性能的技术，但一般开发中不会使用到，只有在密集型计算、图形处理等计算场景才能发挥出它们的巨大优势。比如 Google Earth，[一些游戏](https://www.youtube.com/watch?v=TwuIRcpeUWE)等。

> 具体实操的话可以参考下官网的[开发者引导](https://www.wasm.com.cn/getting-started/developers-guide/) 👈

## JIT

上面已经提到，**JIT(just-in-time)** 的加入使得 JS 运行速度有着质的飞跃。那么 JIT 是如何工作的呢？简单来说，浏览器在 JavaScript engine 中加入了一个 monitor，用来观察运行的代码。并记录下每段代码运行的次数和代码中的变量的类型。以下面这个方法为例子：

```js
function arraySum(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
}
```

### 一、warm / hot

先简单的使用解释器执行，当某一行代码被执行了几次，这行代码会被打上 **warm** 的标签；当某一行代码被执行了很多次，这行代码会被打上 **hot** 的标签：

![jit - 1](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/02-04-jit02.png)

### 二、Baseline compiler - warm

被打上 warm 标签的代码会被传给 **Baseline Compiler** 编译且储存，同时按照行数 (Line number) 和变量类型 (Variable type) 被索引（为什么会引入变量类型做索引很重要，后面会讲）。当发现执行的代码命中索引，会直接取出编译后的代码执行，从而不需要重复编译已经编译过的代码。

![jit - 2](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/02-05-jit06.png)

### 三、Optimizing compiler - hot

被打上 hot 标签的代码会被传给 **Optimizing compiler**，这里会对这部分带码做更优化的编译，执行速度会更快。但只能用概率模型做一些合理的 ”**假设 (Assumptions)**“。优化的算法有很多，这里只提到其中一种 - **type specialization**。

![jit - 3](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/02-06-jit09.png)

### Type Specialization

我们上面的循环中的代码 `sum += arr[i]`，尽管这里只是简单的 + 运算和赋值，但是因为 JavaScript 的动态类型 (Dynamic typing)，对应的编译结果有很多种可能（即动态类型的缺点）。下面的图可以看出，这么简单的一行代码对应有 2^4 = 16 种可能的编译结果：

![jit - 4](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/02-08-decision_tree01.png)

前面第二步的 Baseline compiler 做的就是这件事，所以上面说编译后的代码需要使用 line number 和 variable type 一起做索引，因为不同的 variable type 对应不同的编译结果。如果代码是 "warm" 的，JIT 的任务也就到此为止，后面每次执行的时候，需要先判断类型，再使用对应类型的编译结果就好。

![jit - 5](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/02-09-jit_loop02.png)

然而在每一次 loop 中如果能跳过上述那些询问的阶段岂不是更好，所以在 optimizing compiler 阶段，编译会做一些优化，即把类型检查提前到 loop 前：

![jit - 6](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/02-10-jit_loop02.png)

> Some JITs optimize this even further. For example, in Firefox there’s a special classification for arrays that only contain integers. If arr is one of these arrays, then the JIT doesn’t need to check if arr[i] is an integer. This means that the JIT can do all of the type checks before it enters the loop.

### 反优化 - Deoptimization

通过上面过程我们可以看到，hot 代码实际上在执行前会做类型检查，看假设是否成立，如果不成立执行就会被打回 interpreter 或者 baseline compiler 的版本，这个操作叫做 "**反优化 (deoptimization or bailing out)**"。可以看出，只要假设的成功率足够高，那么代码的执行速度就会快。但是如果假设的成功率很低，那么会导致比没有任何优化的时候还要慢（因为要经历 optimize => deoptimize 的过程）。这里就引申出两个问题:

一、如何做合理的假设？

The optimizing compiler uses the information the monitor has gathered by watching code execution to make these judgments. If something has been true for all previous passes through a loop, it assumes it will continue to be true.

二、假设失败率很高的时候怎么处理？

大多数浏览器会加入 optimization/deoptimization 循环的限制，比如 JIT 假设 10 次还不成功的话，则会终止尝试。

我们从中可以看到，为了让 js 执行速度更快，JIT 在运行时增加了不少的开销：

1. optimization and deoptimization
2. memory used for the monitor’s bookkeeping and recovery information for when bailouts happen
3. memory used to store baseline and optimized versions of a function

> 这里有很大改进的空间：可以消除开销，使性能更可预测。 这就是上述 WebAssembly 所做的事情之一。细节请[参考这里](https://hacks.mozilla.org/2017/02/a-crash-course-in-assembly/) 👈

## JS Runtime

JS 在浏览器中可以调用浏览器提供的 API，如 window 对象，DOM 相关 API 等。这些接口并不是由 V8 引擎提供的，是存在与浏览器当中的。因此简单来说，对于这些相关的外部接口，可以在运行时供 JS 调用，以及 JS 的事件循环 (Event Loop) 和事件队列 (Callback Queue)，把这些称为 **RunTime**。有些地方也把 JS 所用到的 core lib 核心库也看作 RunTime 的一部分。

![runtime](https://cdn-images-1.medium.com/max/1600/1*4lHHyfEhVB0LnQ3HlhSs8g.png)

## JS 引擎

> 本节[摘自这里](https://jishuin.proginn.com/p/763bfbd3c4e7) 👈

app 原生语言在开发效率上存在一定不足，并且从 APP 版本更新到应用市场审核发布，再到用户下载更新，总会存在一定的时间差，这样就导致新的功能无法及时覆盖全量用户，也可能存在一些新旧版本兼容问题。

为了解决这个问题，一般会引入脚本语言来提速 APP 的研发流程。在移动端应用比较广泛的脚本语言有 Lua 和 JavaScript，前者在游戏领域用的比较多，后者在应用领域用的比较多。我们从这个角度来分析下目前 JS 引擎的一个选用情况。

JavaScript 作为世界上最热门的脚本语言，有着非常多的引擎实现：有 Apple 御用的 JavaScriptCore，有性能最强劲的 V8，还有最近热度很高的 QuickJS ...... 如何从这些 JS 引擎里选出最适合的？考量点如下：

1. 性能 - 越快越好
2. 体积 - JS 引擎会增加一定的包体积
3. 内存占用 - 内存占用越少越好
4. JavaScript 语法支持程度 - 支持的新语法越多越好
5. 调试的便捷性 - 是否直接支持 debug？还是需要自己编译实现调试工具链
6. 应用市场平台规范 - 主要是 iOS 平台，平台禁止应用集成带 JIT 功能的虚拟机

比如说开启 JIT 的 V8 引擎，性能肯定是最好的，但它引擎体积就很大，内存占用也很高；在包体积上很占优势的 QuickJS，由于没有 JIT 加持，和有 JIT 的引擎比起来平均会有 5-10 倍的性能差距。

### JavaScriptCore

**JavaScriptCore** 是 WebKit 默认的内嵌 JS 引擎，基本垄断了 iOS 平台的 JS 引擎份额。很多人不知道 JSC 的 JIT 功能其实比 V8 还要早，放在十几年前是最好的 JS 引擎，只不过后来被 V8 追了上来。而且 JSC 有个重大利好，在 iOS7 之后，JSC 作为一个系统级的 Framework 开放给开发者使用，也就是说，如果你的 APP 使用 JSC，只需要在项目里 import 一下，包体积是 0 开销的！这点在今天讨论的 JS 引擎中，JSC 是最能打的。

虽然开启 JIT 的 JSC 性能很好，但是只限于苹果御用的 Safari 浏览器和 WKWebView，只有这两个地方 JIT 功能才是默认开启的，如果在项目里直接引入 JSC，JIT 功能是关闭的。解释是这样的：JIT 编译需要底层系统支持动态代码生成，对操作系统来说这意味着要支持动态分配带有“可写可执行”权限的内存页。当一个应用程序拥有请求分配可写可执行内存页的权限时，它会比较容易受到攻击从而允许任意代码动态生成并执行，这样就让恶意代码更容易有机可乘。

在 Android 系统上，JSC 的表现就不尽人意了。JSC 并没有对 Android 机型做很好的适配，虽然可以开启 JIT，但是性能表现并不好，这也是 Facebook 决心制作 [**Hermes**](https://github.com/facebook/hermes) 的一个原因。最后再说说 JSC 的调试支持情况。如果是 iOS 平台，我们可以直接用 Safari 的 debbuger 功能调试，如果是 Android 平台，目前还没有找到一个很好的真机调试方法。

综合来看，**JavaScriptCore 在 iOS 平台上有非常明显的主场优势，各个指标都是很优秀的，但在 Android 上因为缺乏优化，表现并不是很好。**

### V8

JavaScript 能有如今的地位，**V8** 功不可没。不过这里讨论移动端的表现。同样是 Google 自家的 Android 可以开启 JIT，但这些优势都是有代价的：开启 JIT 后内存占用高，并且 V8 的包体积也不小（大概 7 MB 左右）。

V8 在 2019 年推出了 **JIT-less V8**，也就是关闭 JIT 只使用 Ignition interpreter 解释执行 JS 文件，那么我们在 iOS 上集成 V8 就成了可能，因为 Apple 还是支持接入只有解释器功能的虚拟机引擎的。但是这样相较于 JSC 没有了比较明显的优势。

综合来看，**v8 在 Android 端使用时可以完全发挥它的威力，但是 iOS 平台因为主场劣势，并不是很推荐。**

### Hermes

Hermes 是 FaceBook 2019 年中旬开源的一款 JS 引擎，这个是专为 React Native 打造的 JS 引擎，可以说从设计之初就是为 Hybrid UI 系统打造，也是为了替换 JSC。Hermes 的特点主要是两个，一个是**不支持 JIT**，一个是**支持直接生成/加载字节码**。

Hermes 不支持 JIT 的主要原因有两个：加入 JIT 后，JS 引擎启动的预热时间会变长，一定程度上会加长首屏 TTI（页面首次加载可交互时间），现在的前端页面都讲究一个秒开，TTI 还是个挺重要的测量指标。另一个问题上 JIT 会增加包体积和内存占用，Chrome 内存占用高 V8 还是要承担一定责任的。

因为不支持 JIT，Hermes 在一些 CPU 密集计算的领域就不占优势了，所以在 Hybrid 系统里，最优的解决方案就是充分发挥 JavaScript 胶水语言的作用，CPU 密集的计算（例如矩阵变换，参数加密等）放在 Native 里做，算好了再传递给 JS 表现在 UI 上，这样可以兼顾性能和开发效率。

Hermes 最引人瞩目的就是支持生成字节码了。Hermes 加入 **AOT** 后，Babel、Minify、Parse 和 Compile 这些流程全部都在开发者电脑上完成，直接下发字节码让 Hermes 运行就行。Hermes 主要支持的是 ES6 语法，并且支持了 Chrome 的调试协议，我们可以直接用 Chrome 的 debugging 工具直接调试 Hermes 引擎。

> AOT 即提前编译，可以生成被直接执行的二进制代码，运行速度快、执行性能表现好，但每次执行前都需要提前编译，开发测试效率低。典型代表是 C/C++，它们必须在执行前编译成机器码。

综合来看，**Hermes 是一款专为移动端 Hybrid UI System 打造的 JS 引擎**。

### QuickJS

正式介绍 QuickJS 前我们先说说它的作者：Fabrice Bellard。

软件界一直有个说法，一个高级程序员创造的价值可以超过 20 个平庸的程序员，但 Fabrice Bellard 不是高级程序员，他是天才，在我看来他的创造力可以超过 20 个高级程序员，我们可以顺着时间轴理一下他创造过些什么：

```text
1997年，发布了最快速的计算圆周率的算法，此算法是 Bailey-Borwein-Plouffe 公式的变体，前者的时间复杂度是O(n^3)，他给优化成了O(n^2)，使得计算速度提高了 43%，这是他在数学上的成就
2000 年，发布了 FFmpeg，这是他在音视频领域的一个成就
2000，2001，2018 三年三度获得国际混淆 C 代码大赛
2002 年，发布了 TinyGL，这是他在图形学领域的成就
2005 年，发布了 QEMU，这是他在虚拟化领域的成就
2011 年，他用 JavaScript 写了一个 PC 虚拟机 Jslinux，一个跑在浏览器上的 Linux 操作系统
2019 年，发布了 QuickJS，一个支持 ES2020 规范的 JS 虚拟机
```

QuickJS 继承了 Fabrice Bellard 作品的一贯特色——小巧而又强大。只有几个 C 文件，没有乱七八糟的第三方依赖。但是他的功能又非常完善，JS 语法支持到 ES2020，Test262 的测试显示，QuickJS 的语法支持度比 V8 还要高。性能表现如下：

```text
1. 开启 JIT 的 V8 综合评分差不多是 QuickJS 的 35 倍，但是在同等主打轻量的 JS 引擎中，QuickJS 的性能还是很耀眼的
2. 在内存占用上，QuickJS 远低于 V8，毕竟 JIT 是是吃内存的大户，而且 QuickJS 的设计对嵌入式系统很友好
3. QuickJS 和 Hermes 的跑分情况相近
```

QuickJS 也支持生成字节码，但是与 Hermes 不同，QuickJS 会先把 js 文件生成一份字节码，然后拼到一个 .c 文件里，想跑起来还得再编译一次生成二进制文件。虽然直接生成字节码可以大大减少 JS 文件的解析时间，但是 QuickJS 还是更偏嵌入式一些。

综合来看，**QuickJS 是一款潜力非常大的 JS 引擎，在 JS 语法高度支持的前提下，还把性能和体积都优化到了极致。在移动端的 Hybrid UI 架构和游戏脚本系统都可以考虑接入。**

### 选型思路与调试

单引擎：

1. 统一采用 JSC：这个是 React Native 0.60 之前的方案
1. 统一使用 Hermes：这个是 React Native 0.64 之后的设计方案
1. 统一采用 QuickJS：QuickJS 体积很小，可以用来制作非常轻量的 Hybrid 系统

双引擎：

1. iOS 用 JSC，Android 用 V8：Weex/NativeScript 都是这样的，可以在包体积和性能上有较好的均衡
2. iOS 用 JSC，Android 用 Hermes：React Natvie 现如今的方案
3. iOS 用 JSC，Android 用 QuickJS：如滴滴的跨端框架 [**hummer**](https://github.com/didi/Hummer)

无论是单引擎还是双引擎，集成后的业务开发体验也很重要。对于自带 debugger 功能的引擎来说一切都不在话下，但是对于没有实现调试协议的引擎来说，缺少 debugger 还是会影响体验的。但不是也没有办法，一般来说我们可以曲线救国，类似于 React Native 的 Remote JS Debugging 的思路：

我们可以加个开关，把 JS 代码通过 websocket 传送到 Chrome 的 Web Worker，然后用 Chrome 的 V8 进行调试。这样做的优势是可以调整一些业务上的 BUG，劣势就是又会引入一个 JS 引擎，万一遇到一些引擎实现的 BUG，就很难 debug 了。

## 参考链接

1. [asm.js 和 Emscripten 入门教程](http://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html) By 阮一峰
2. [An Abridged Cartoon Introduction To WebAssembly](https://www.smashingmagazine.com/2017/05/abridged-cartoon-introduction-webassembly/) By Lin
3. [WebAssembly 完全入门 —— 了解 wasm 的前世今身](https://www.cnblogs.com/detectiveHLH/p/9928915.html) By detectiveHLH
4. [A crash course in just-in-time (JIT) compilers](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/) By Lin Clark
5. [V8、JSCore、Hermes、QuickJS，hybrid 开发 JS 引擎怎么选](https://jishuin.proginn.com/p/763bfbd3c4e7) By 魔术师卡颂

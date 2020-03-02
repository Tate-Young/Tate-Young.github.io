---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  WebAssembly
date:   2020-03-02 17:02:00 GMT+0800 (CST)
background-image: https://i.loli.net/2020/03/02/GaMNXmKHgqtPdzT.png
tags:
- JavaScript
---
# {{ page.title }}

## 什么是 WebAssembly

TLDR - 参考 MDN，我们得知 [**WebAssembly**](https://developer.mozilla.org/zh-CN/docs/WebAssembly) **是一种新的编码方式**，可以在现代浏览器中运行。它是一种低级的类汇编语言，具有紧凑的二进制格式，可以接近原生的性能运行，并为诸如 C/C++ 等语言提供一个编译目标，以便它们可以在 Web 上运行。它也被设计为可以与 JavaScript 共存，允许两者一起工作。

## asm.js / Emscripten

那么有同学就问了，为啥要编译 C/C++ 到网页上运行呢？我们知道 Web 技术发展迅猛，但是针对一些游戏或者使用该语言开发的应用，我们仍然没有办法让他们在浏览器上高效地运行。因此我们需要将编程语言转换为 JavaScript。[Alon Zakai](https://github.com/kripken?tab=repositories) 大佬为此专门做了一个编译器项目 [**Emscripten**](https://emscripten.org)。这个编译器可以将 C/C++ 代码编译成一种 JavaScript 的变体，即 [**asm.js**](http://asmjs.org)。

![Emscripten toolchain](https://emscripten.org/_images/EmscriptenToolchain.png)

C/C++ 编译成 JS 有两个最大的难点，即:

1. C/C++ 是静态类型语言，而 JS 是动态类型语言。
2. C/C++ 是手动内存管理，而 JS 依靠垃圾回收机制。

asm.js 就是为了解决这两个问题而设计的：**asm.js 的变量一律都是静态类型，并且取消垃圾回收机制**。除了这两点，它与 JavaScript 并无差异，也就是说，asm.js 是 JavaScript 的一个高度优化的子集，只能使用后者的一部分语法。并且 JavaScript 引擎还会针对 asm.js 使用 AOT 预编译来优化提速。

> This specification defines asm.js, a strict subset of JavaScript that can be used as a low-level, efficient target language for compilers. This sublanguage effectively describes a sandboxed virtual machine for memory-unsafe languages like C or C++. A combination of static and dynamic validation allows JavaScript engines to employ an ahead-of-time (AOT) optimizing compilation strategy for valid asm.js code.

## WebAssembly

那还有原因就是 JavaScript 自身性能瓶颈问题，我们知道编程语言与计算机的交流必须依靠“翻译官”，让计算机明白你要干嘛。而这个“翻译官”就是解释器或编译器:

* **解释器** - 一行行读取源代码，并且直接生成指令让计算机硬件执行，不会输出另外一种代码。相比下效率会较低
* **编译器** - 执行前翻译好，将源代码转换成其他的更低级的代码(例如二进制码、机器码)，但是不会执行它。执行的效率会更加高，预编译会消耗一些时间。

> **低级语言代码(Low-Level Code)** 是相对高级语言(High-Level Code)而言，少了更多的抽象概念，更加接近于汇编或者机器指令

而浏览器最开始使用的就是 JavaScript 解释器，在 2008 年，**即时编译器(JITs)** 一经推出，JavaScript 运行速度蹭蹭上涨，随着性能的改进，我们可以运用 JavaScript 做更多的事情，比如 Electron 构建跨平台应用程序等。可想而知，随着 WebAssembly 的盛行，Web 技术又将迎来一场革新，我们拭目以待。

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

![WebAssembly BenchMark](https://blogs.unity3d.com/wp-content/uploads/2018/09/image3-2.png)

目前常用的能支持编译成 WebAssembly 的工具有:

* Emscripten - 上面已经讲到了，也支持转换为 asm.js
* [**AssemblyScript**](https://github.com/AssemblyScript/assemblyscript) - 语法和 TypeScript 差不多，对于前端学习成本较低
* [WABT](https://github.com/WebAssembly/wabt) - 是将 WebAssembly 在字节码和文本格式相互转换的一个工具

> 这两种技术虽然都是极高提升 web 程序性能的技术，但一般开发中不会使用到，只有在密集型计算、图形处理等计算场景才能发挥出它们的巨大优势。比如 Google Earth。

> 具体实操的话可以参考下官网的[开发者引导](https://www.wasm.com.cn/getting-started/developers-guide/) 👈

## 参考链接

1. [asm.js 和 Emscripten 入门教程](http://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html) By 阮一峰
2. [An Abridged Cartoon Introduction To WebAssembly](https://www.smashingmagazine.com/2017/05/abridged-cartoon-introduction-webassembly/) By Lin
3. [WebAssembly 完全入门 —— 了解 wasm 的前世今身](https://www.cnblogs.com/detectiveHLH/p/9928915.html) By detectiveHLH

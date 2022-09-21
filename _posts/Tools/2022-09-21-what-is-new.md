---
layout: blog
front: true
comments: True
background: green
category: 前端
title: 记最近尝试的新技术
date: 2022-09-21 15:27:00 GMT+0800 (CST)
background-image: 
---

# {{ page.title }}

## corepack

### 什么是 corepack

[**corepack**](https://github.com/nodejs/corepack) 是跟随 nodejs v16.13 的实验性工具，简单来讲就是“**包管理器的管理器**”。现在 npm、yarn、pnpm、cnpm 等包管理器都有很多版本，项目中不好统一管理，而且需要全局安装。特别是不同版本的包管理器，在解析依赖树等过程中可能存在差异，导致项目构建或运行失败。

> 低版本 nodejs 是不支持 corepack 功能的

### 怎么启用

corepack 目前是实验性工具，默认不会启用。我们需要：

1. 手动运行 corepack enable  进行启动
2. 项目 package.json  中新增属性 packageManager ，并标注需要统一使用的包管理器版本

```json
{
  "packageManager": "pnpm@6.23.1"
}
```

之后我们在项目中首次运行 pnpm 的时候，corepack 会帮我们自动去安装 pnpm@6.23.1 这个版本，并保存在 corepack cache 下。
如果用非申明的包管理会怎么样？会自动拦截并报错

```shell
➜ yarn             
Usage Error: This project is configured to use pnpm
```

### corepack prepare

当在现有项目之外运行时（例如运行 yarn init 时），corepack 将默认使用与每个工具的最新稳定版本大致对应的预定义版本。 可以通过运行 corepack prepare 命令以及你希望设置的包管理器版本来覆盖这些版本。

## swc 替代 tsc

[**swc(Speedy Web Compiler)**](https://github.com/swc-project/swc) 是基于 rust 开发的 js/ts 编译器，官方宣称是 babel 的替代品，编译速度要快很多。以某项目的包为例：

1. tsc 执行时长为 4.9s
2. swc 执行时长为 0.7s

目前为止存在的问题

1. 编译 typescript 不能生成 d.ts
2. [打包功能尚有问题](https://swc.rs/docs/configuration/bundling)
3. 社区丰富程度较低，插件较少

swc 编译 typescript 不能生成 d.ts，所以还是必须通过 tsc 来处理，所以脚本变成了：

```json
"scripts": {
    "tsc": "tsc",
    "swc": "tsc --emitDeclarationOnly & swc src -d lib-bac --config-file ../../.swcrc",
 },
```

这样子 swc 编译速度快的优势就体现不出来了。[官方说是后续会加到 swc 功能中，观望......](https://github.com/swc-project/swc/issues/657#issuecomment-1026620842)

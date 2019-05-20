---
layout: blog
front: true
comments: True
flag: TS
background: blue
category: 前端
title: TypeScript 进阶
date:   2019-05-20 18:36:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/02/26/5c7546f407746.png
tags:
- TS
---
# {{ page.title }}

## tsconfig.json

如果一个目录下存在一个 `tsconfig.json` 文件，那么它意味着这个目录是 TypeScript 项目的根目录。 tsconfig.json 文件中指定了用来编译这个项目的根文件和编译选项，使用 `tsc --init`即可自动生成该文件，更多[配置查看这里](http://www.typescriptlang.org/docs/handbook/compiler-options.html) 👈:

```JSON
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "esnext",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],                             /* Specify library files to be included in the compilation. */
    "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "incremental": true,                   /* Enable incremental compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    "removeComments": true,                /* Do not emit comments to output. */
    "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    "isolatedModules": false,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
    "baseUrl": ".",
    "paths":{
      "appConfig": ["./src/config"],
    }
  }
}
```

> 注意，`tsc` 的命令行选项具有优先级，会覆盖 tsconfig.json 中的同名选项

我们还可以通过以下几种选项来决定需要编译的文件:

* **files** - 指定一个包含相对或绝对文件路径的列表
* **include** - 指定一个文件 glob 匹配模式列表，包含该列表
* **exclude** 同上，但排除该列表

```JS
{
  "compilerOptions": {
    "module": "system",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outFile": "../../built/local/tsc.js",
    "sourceMap": true
  },
  "files": [
    "core.ts",
    "sys.ts"
  ],
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

另外我们还可以使用 **extends** 继承配置:

```JSON
// configs/base.json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// tsconfig.json
{
  "extends": "./configs/base",
  "files": [
    "main.ts",
    "supplemental.ts"
  ]
}
```

### reslove.alias

在开发时有遇到一个问题，即编译时， [webpack 解析 resolve.alias](https://webpack.docschina.org/configuration/resolve/) 在 typescript 文件中提示找不到模块:

```JSON
{
  resolve: {
    alias: {
      'appConfig': path.resolve(__dirname, '..', 'src/config')
    }
  }
}
```

```JS
// test.ts 提示找不到 appConfig 模块
import { test } from 'appConfig'
```

此时需要将 `webpack.config.js` 中的 alias 路径同步到 tsconfig.json 中的 **paths**，且必须指定 **baseUrl**:

```JSON
{
  "compilerOptions" : {
    "baseUrl": ".",
    "paths":{
      "appConfig": ["./src/config"]
    }
  }
}
```

## DefinitelyTyped

TypeScript 经过了一系列的摸索，先后提出了 [tsd(已废弃)](https://github.com/DefinitelyTyped/tsd)、[typings(已废弃)](https://github.com/typings/typings)，最终在 TypeScript 2.0 的时候重新整理了类型定义，提出了 DefinitelyTyped。就是让你把**类型定义文件(*.d.ts)**发布到 npm 中，配合编辑器(或插件)，就能够检测到 JS 库中的静态类型。毫无疑问，[**DefinitelyTyped**](https://microsoft.github.io/TypeSearch/) 是 TypeScript 最大的优势之一，社区已经记录了 90% 的顶级 JavaScript 库。

### typeRoots

默认的，所有位于 `node_modules/@types` 路径下的模块都会引入到编译器。具体来说是，`./node_modules/@types` 、`../node_modules/@types`、`../../node_modules/@types` 等等。如果指定了 **typeRoots**，只有 typeRoots 下面的包才会被包含进来:

```JSON
// 这个配置文件会包含所有 ./typings 下面的包，而不包含 ./node_modules/@types 里面的包
{
  "compilerOptions": {
    "typeRoots" : ["./typings"]
  }
}
```

如果不希望自动引入 typeRoots 指定路径下的所有声明模块，那可以使用 **types** 指定自动引入那些模块:

```JSON
// 只会引入 node 、 lodash 和 express 三个声明模块，其它的声明模块则不会被自动引入
{
  "compilerOptions": {
    "types" : ["node", "lodash", "express"]
  }
}
```

> 自动引入只对包含全局声明的模块有效。比如 jQuery ，我们不用手动 `import` 或者 `///<reference/>` 即可在任何文件中使用 $ 的类型。

### @types

得力于 DefinitelyTyped，现在你可以通过 npm 来安装使用 **@types**，如下例所示，你可以为 jquery 添加声明文件:

```SHELL
npm install @types/jquery --save-dev
```

@types 支持全局和模块类型定义，默认情况下，TypeScript 会自动包含支持全局使用的任何定义。例如，对于 jquery，你应该能够在项目中开始全局使用 $。当然也可以作为模块使用:

```JS
import * as $ from 'jquery';
```

一般情况下我们应该避免全局泄漏。因此，你可以参考以上配置，引入有需要的类型：

```JSON
// 其他类型的申明文件如  @types/node，它的全局变量(例如 process)则不会泄漏到你的代码中
{
  "compilerOptions": {
    "types" : ["jquery"]
  }
}
```

## lib.d.ts

安装 TypeScript 时，会顺带安装 `lib.d.ts` 等声明文件。此文件包含了 JavaScript 运行时以及 DOM 中存在各种常见的环境声明，主要是一些变量声明(如：window、document、math)和一些类似的接口声明(如：Window、Document、Math)。但我们可以通过指定 `--noLib` 的编译器命令行标志(或者在 tsconfig.json 中指定选项 `noLib: true`)从上下文中排除此文件。这个文件有什么作用呢，我们从一个简单的栗子来看:

```JS
// lib.d.ts 为所有 JavaScript 对象定义了 toString 方法
const foo = 123;
const bar = foo.toString();
```

如果没有 lib.d.ts 文件:

```JS
const foo = 123;
const bar = foo.toString(); // Error: 属性 toString 不存在类型 number 上
```

一些时候，你想要解耦编译目标(生成的 JavaScript 版本)和环境库支持之间的关系。例如对于 Promise，你的编译目标是 --target es5，但是你仍然想使用它，这个时候，你可以使用 lib 对它进行控制，其分类如下:

* **JavaScript 功能** - es5、es6、esnext 等
* **运行环境** - dom、dom.iterate 等
* **ESNEXT 选项** - es2015.promise、es2015.reflect 等

```JSON
// 命令行 tsc --target es5 --lib dom,es6
{
  "compilerOptions": {
  "target": "es5",
  "lib": ["es6", "dom"]
}
}
```

## 高级类型

在[上一篇里]( {{site.url}}/2019/02/26/ts-profile.html )介绍了联合类型等，这里再介绍其他一些高级类型。

### 交叉类型 &

**交叉类型**将多个类型合并为一个类型，相当于新类型具有这多个类型的所有特性，相当于是一种并的操作，通常在使用混入(mixin)的场合使用交叉类型，交叉类型的形式如 `T & U`:

```JS
function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{}
  for (let key in first) {
    (<any>result)[key] = (<any>first)[key]
  }
  for (let key in second) {
    if (!result.hasOwnProperty(key)) {
      (<any>result)[key] = (<any>second)[id]
    }
  }
  return result
}
```

### 索引类型 keyof

**索引类型**能使编译器能够检查使用了动态属性名的代码，让我们先看一个栗子:

```JS
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n])
}

interface Person {
  name: string
  age: number
}

let p: Person = {
  name: 'Tate',
  age: 18
}

let res = pluck(p, ['name']) // 允许
```

这里 **keyof** 表示**索引类型查询操作符**，它能够获得任何类型T上已知的公共属性名的联合。如例子中:

1. `keyof T` 相当于 `'name' | 'age'`，而 `K extends keyof T` 表明 K 的取值限制于 `'name' | 'age'`
2. `T[K]` 则代表对象里相应 key 的元素的类型，所以在例子中，p 对象里的 name 属性，是 string 类型，所以此时 `T[K]` 相当于 `Person[name]`，即相当于类型 string，所以返回的是 `string[]`，所以 res 的类型为 string[]

再看个栗子:

```JS
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
let obj = {
  name: 'RuphiLau',
  age: 21,
  male: true
}
let x1 = getProperty(obj, 'name') // 允许，x1 的类型为 string
let x2 = getProperty(obj, 'age') // 允许，x2 的类型为 number
let x3 = getProperty(obj, 'male') // 允许，x3 的类型为 boolean
let x4 = getProperty(obj, 'hobby') // 报错：Argument of type '"hobby"' is not assignable to parameter of type '"name" | "age" | "male"'
```

### 映射类型 in

我们经常会将一个现有类型的属性变成可选或可读:

```JS
interface PersonPartial {
    name?: string
    age?: number
}
```

而现在typescript为我们提供了映射类型，能够使得这种转化更加方便，在映射类型里，新类型将以相同的形式去转换旧类型里每个属性，如以上例子可以改写为:

```JS
// 源码
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}
// -? 操作符，去除可选。即将传入的属性变为必选项
type Required<T> = {
  [P in keyof T]-?: T[P]
}

// 取出一个类型中的部分属性，生成另一个类型
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 获取一个函数的返回值的类型
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;

type PersonReadonly = Readonly<Person>
type PersonPartial = Partial<Person>
```

举个 pick 的栗子 🌰:

```JS
let defaultState = {
  foo: 7,
  bar: 'hello'
};

type PickedState = Pick<typeof defaultState, 'foo'>

let partialState: PickedState = {
  foo: 8,
  bar: 'world'
}
// bar 不在类型 Pick<{ foo: number; bar: string; }, "foo"> 中
```

## 其它

### ! - Non-null assertion operator

If you know from external means that an expression is not null or undefined, you can use the non-null assertion operator `!` to coerce away those types:

```JS
// Error, some.expr may be null or undefined
const x = some.expr.thing;
// OK
const y = some.expr!.thing;
```

### 箭头函数的类型注解

```JS
// 在一个以 number 类型为参数，以 string 类型为返回值的函数
const simple: (foo: number) => string = foo => foo.toString();

// or
function simple(foo: number): string {
  return foo.toString()
}
```

## 参考链接

1. [深入理解 TypeScript(译)](https://jkchao.github.io/typescript-book-chinese/#why) By Basarat
2. [JavaScript 和 TypeScript 交叉口 —— 类型定义文件(*.d.ts)](https://www.cnblogs.com/silin6/p/7793753.html) By linkFly
3. [Typescript学习记录：高级类型](https://www.ruphi.cn/archives/266/) By RuphiLau
4. [TS 一些工具泛型的使用及其实现](https://zhuanlan.zhihu.com/p/40311981) By 乱语

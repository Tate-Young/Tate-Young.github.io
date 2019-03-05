---
layout: blog
front: true
comments: True
flag: TS
background: blue
category: 前端
title: TypeScript 简介
date:   2019-02-26 17:54:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/02/26/5c7546f407746.png
tags:
- TS
---
# {{ page.title }}

## 什么是 TypeScript

**TypeScript** 是由微软开发的开源的编程语言。它是 **JavaScript** 的一个严格超集，并添加了可选的静态类型和基于类的面向对象编程。

## 基础类型

TypeScript 支持与 JavaScript 几乎相同的数据类型:

```JS
// 布尔值
const isDone: boolean = false
// 数字
const decLiteral: number = 6
// 字符串
const name: string = 'tate'
// 数组
const list: number[] = [1, 2, 3]
const list: Array<number> = [1, 2, 3] // 第二种方式是使用数组泛型，Array<元素类型>
```

### 元组

**元组**类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同:

```JS
// Declare a tuple type
let x: [string, number]
// Initialize it
x = ['hello', 10] // OK
// Initialize it incorrectly
x = [10, 'hello'] // Error
```

### 枚举

**enum** 类型是对 JavaScript 标准数据类型的一个补充:

```JS
enum Color {Red, Green, Blue}
const c: Color = Color.Green
```

默认情况下，从 0 开始为元素编号。 当然也可以手动的指定成员的数值:

```JS
enum Color {Red = 1, Green, Blue}
const colorName: string = Color[2] // 'Green'
```

### Any

**Any** 类型是指定那些在编程阶段还不清楚类型的变量，这些值可能来自于动态的内容:

```JS
let notSure: any = 4
notSure = 'maybe a string instead'
notSure = false // okay, definitely a boolean
const list: any[] = [1, true, 'free']
```

### Void

当一个函数没有返回值时，其类型可以用 **void**:

```JS
function warnUser(): void {
  console.log('This is my warning message')
}

// 声明一个void类型的变量没有什么大用，因为你只能为它赋予 undefined 和 null
const unusable: void = undefined
```

### Never

**never** 类型表示的是那些永不存在的值的类型。 比如那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型:

```JS
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message)
}
```

### 类型别名

**类型别名**可以通过 **type** 关键字给一个类型起个新名字，常用于联合类型:

```JS
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n
  }
  return n()
}
```

**联合类型**举个栗子:

```JS
// 注意我们没有让 b 成为可选的，因为签名的返回值类型不同
/* WRONG */
interface Moment {
  utcOffset(): number
  utcOffset(b: number): Moment
  utcOffset(b: string): Moment
}

/* OK */
interface Moment {
  utcOffset(): number
  utcOffset(b: number|string): Moment
}
```

### 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。类型断言有两种形式:

* **尖括号语法**
* **as 语法**

```JS
// 尖括号语法
const someValue: any = 'this is a string'
const strLength: number = (<string>someValue).length
// as 语法
const strLength: number = (someValue as string).length
```

## 接口 Interface

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。它有时被称做'鸭式辨型法'或'结构性子类型化'。 在 TypeScript 里，**接口**的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

```JS
// 不使用接口
// printLabel 有一个参数，并要求这个对象参数有一个名为 label 类型为 string 的属性
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label)
}

let myObj = { size: 10, label: 'Size 10 Object' }
printLabel(myObj)
```

```JS
// 使用接口
// 代表了有一个 label 属性且类型为 string 的对象
interface LabelledValue {
  label: string
  size?: number // 可选属性
  gender?: 'man' | 'woman'
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label)
}

let myObj = {size: 10, label: 'Size 10 Object'}
printLabel(myObj)
```

### readonly

一些对象属性只能在对象刚刚创建的时候修改其值。可以在属性名前用 **readonly** 来指定只读属性:

```JS
interface Point {
  readonly x: number
  readonly y: number
}
let p1: Point = { x: 10, y: 20 }
p1.x = 5 // error!
```

TypeScript 具有 **ReadonlyArray\<T\>** 类型，它与 **Array\<T\>** 相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改:

```JS
let a: number[] = [1, 2, 3, 4]
let ro: ReadonlyArray<number> = a
ro[0] = 12 // error!
ro.push(5) // error!
ro.length = 100 // error!
a = ro // error!
```

### 索引签名

如果能够确定某个对象可能具有某些做为特殊用途使用的额外属性，还能够添加一个字符串**索引签名**:

```JS
interface SquareConfig {
  color?: string
  width?: number
  [propName: string]: any
}
```

接口除了描述带有属性的普通对象外，也可以描述函数类型:

```JS
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc
// 如果你不想指定类型，TypeScript 的类型系统会推断出参数类型，因为函数直接赋值给了 SearchFunc 类型变量
mySearch = function(source: string, subString: string) {
  const result = source.search(subString)
  return result > -1
}
```

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如 a[10] 或 ageMap['daniel']。可索引类型具有一个**索引签名**，它描述了对象索引的类型，还有相应的索引返回值类型:

```JS
interface StringArray {
  [index: number]: string
}

let myArray: StringArray
myArray = ['Bob', 'Fred']

const myStr: string = myArray[0]
```

### 类类型

TypeScript 能够用它来明确的强制一个类去符合某种契约:

```JS
// 接口描述了类的公共部分
interface ClockInterface {
  currentTime: Date
  setTime(d: Date) // 可以在接口中描述一个方法，在类里实现它
}

class Clock implements ClockInterface {
  currentTime: Date
  setTime(d: Date) {
    this.currentTime = d
  }
  constructor(h: number, m: number) { }
}
```

类是具有两个类型的：静态部分的类型和实例的类型。我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口，`ClockConstructor` 为构造函数所用和 `ClockInterface` 为实例方法所用:

```JS
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface
}
interface ClockInterface {
  tick()
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute)
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
    console.log('beep beep')
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
    console.log('tick tock')
  }
}

let digital = createClock(DigitalClock, 12, 17)
let analog = createClock(AnalogClock, 7, 32)
```

### 接口继承

和类一样，接口也可以相互继承:

```JS
interface Shape {
  color: string
}

interface PenStroke {
  penWidth: number
}

// 一个接口可以继承多个接口，创建出多个接口的合成接口
interface Square extends Shape, PenStroke {
  sideLength: number
}

let square = <Square>{}
square.color = 'blue'
square.sideLength = 10
square.penWidth = 5.0
```

接口也可以继承类，它会继承类的成员但不包括其实现。这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现:

```JS
class Control {
  private state: any
}

// SelectableControl 包含了 Control 的所有成员，包括私有成员 state
// 因为 state 是私有成员，所以只能够是 Control 的子类们才能实现 SelectableControl 接口
interface SelectableControl extends Control {
  select(): void
}

class Button extends Control implements SelectableControl {
  select() { }
}

class TextBox extends Control {
  select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
  select() { }
}
```

## 泛型 Generics

### 类型变量

**泛型**支持多种类型的数据，增强了组件的可复用性。我们需要一种方法使返回值的类型与传入参数的类型是相同的:

```JS
// 类型变量 T 帮助我们捕获用户传入的类型，之后我们再次使用了 T 当做返回值类型
// 此时函数 identity 即叫做泛型，类型变量 T 代表的是任意类型
function identity<T>(arg: T): T {
  console.log(arg.length)  // Error: T doesn't have .length
  return arg
}
```

```JS
// 如果我们传入数字数组，将返回一个数字数组
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length) // Array has a .length, so no more error
  return arg
}
// or
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length)  // Array has a .length, so no more error
  return arg
}
```

当然我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以:

```JS
let myIdentity: <U>(arg: U) => U = identity

// 还可以使用带有调用签名的对象字面量来定义泛型函数
let myIdentity: {<T>(arg: T): T} = identity
```

我们定义了泛型函数后，可以通过两种方法来使用，推荐使用第二种，因为类型推论可帮助我们保持代码精简和高可读性:

```JS
// 第一种是，传入所有的参数，包含类型参数
let output = identity<string>('myString')  // type of output will be 'string'

// 第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定 T 的类型
let output = identity('myString')  // type of output will be 'string'
```

### 泛型接口

通过泛型还可以创建**泛型接口**:

```JS
interface GenericIdentityFn {
  <T>(arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn = identity
```

同样我们也可以把泛型参数当作整个接口的一个参数。 这样我们就能清楚的知道使用的具体是哪个泛型类型(比如 `Dictionary<string>` 而不只是 `Dictionary`)。 这样接口里的其它成员也能知道这个参数的类型了:

```JS
interface GenericIdentityFn<T> {
  (arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn<number> = identity
```

### 泛型类

泛型类指的是实例部分的类型，类的静态属性不能使用这个泛型类型:

```JS
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) { return x + y }
```

没有什么去限制它只能使用number类型。 也可以使用字符串或其它更复杂的类型:

```JS
let stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function(x, y) { return x + y }

console.log(stringNumeric.add(stringNumeric.zeroValue, 'test'))
```

### 泛型约束

回到第一个栗子，由于参数可以是任意类型，所以 length 属性不一定存在，为了约束，我们通过 **extends** 关键字可以这样写:

```JS
// 创建一个包含 .length 属性的接口
interface Lengthwise {
  length: number
}

// 它不再是适用于任意类型
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)  // Now we know it has a .length property, so no more error
  return arg
}

loggingIdentity(3)  // Error, number doesn't have a .length property
```

在泛型里使用类类型，使用原型属性推断并约束构造函数与类实例的关系:

```JS
class BeeKeeper {
  hasMask: boolean
}

class ZooKeeper {
  nametag: string
}

class Animal {
  numLegs: number
}

class Bee extends Animal {
  keeper: BeeKeeper
}

class Lion extends Animal {
  keeper: ZooKeeper
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c()
}

createInstance(Lion).keeper.nametag  // typechecks!
createInstance(Bee).keeper.hasMask   // typechecks!
```

## 命名空间

"内部模块"现在称做"**命名空间(namespace)**"，"外部模块"则简称为"**模块(module)**"，不应该对模块使用命名空间，使用命名空间是为了提供逻辑分组和避免命名冲突:

```JS
// Validation.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }
}
```

```JS
// 三斜线指令，用于声明文件间的依赖
/// <reference path='Validation.ts' />
// 尽管是不同的文件，它们仍是同一个命名空间
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s)
    }
  }
}
```

```JS
/// <reference path='Validation.ts' />
/// <reference path='LettersOnlyValidator.ts' />

let strings = ['Hello', '98052', '101']

// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {}
validators['Letters only'] = new Validation.LettersOnlyValidator()

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(`'${ s }' - ${ validators[name].isAcceptable(s) ? 'matches' : 'does not match' } ${ name }`)
  }
}
```

还可以为命名空间取别名，格式为 `import q = x.y.z`:

```JS
namespace Shapes {
  export namespace Polygons {
    export class Triangle { }
    export class Square { }
  }
}

import polygons = Shapes.Polygons // 取别名
let sq = new polygons.Square() // Same as 'new Shapes.Polygons.Square()'
```

## 声明文件 d.ts

TypeScript 相比 JavaScript 增加了类型声明，并要求开发者做到先声明后使用。这就导致在调用很多原生接口或者使用第三方模块的时候，因为变量未声明而导致编译器的类型检查失败:

```JS
// 比如在浏览器中以 script 标签引入 jQuery 并使用全局变量 $
// index.ts
$('selector') // ts error: can not find name '$'
```

故需要为 $ 提供全局的类申明:

```JS
// index.d.ts
declare const $: any
```

社区为普遍使用的模块提供了类型定义，通过 `npm install @types/[module-name]` 即可安装，而不需要自己手动声明。上面栗子的写法是针对变量的，对于其他写法如下，更多示例可以[参考官网](https://www.tslang.cn/docs/handbook/declaration-files/by-example.html):

```JS
// ---- 函数 ----
greet('hello, world')

declare function greet(greeting: string): void
```

```JS
// ---- 带属性的对象 使用 declare namespace 描述用点表示法访问的类型或值 ----
const result = myLib.makeGreeting('hello, world')
const count = myLib.numberOfGreetings

declare namespace myLib {
  function makeGreeting(s: string): string
  const numberOfGreetings: number
}
```

```JS
// ---- 可重用类型(类型别名) ----
// 可以提供一个 string，一个返回 string 的函数或一个 Greeter 实例
function getGreeting() {
  return 'howdy'
}
class MyGreeter extends Greeter { }

greet('hello')
greet(getGreeting)
greet(new MyGreeter())

// 可以使用类型别名来定义类型的短名
type GreetingLike = string | (() => string) | MyGreeter
declare function greet(g: GreetingLike): void
```

```JS
// ---- 类 ----
const myGreeter = new Greeter('hello, world')
myGreeter.greeting = 'howdy'
myGreeter.showGreeting()

class SpecialGreeter extends Greeter {
  constructor() {
    super('Very special greetings')
  }
}

declare class Greeter {
  constructor(greeting: string)

  greeting: string
  showGreeting(): void
}
```

## 参考链接

1. [TypeScript 中文文档](https://www.tslang.cn/docs/home.html)
2. [TypeScript 中的 .d.ts 文件有什么作用，这种文件的内如如何编写？ - 知乎](https://www.zhihu.com/question/52068257)

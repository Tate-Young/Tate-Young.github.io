---
layout: blog
front: true
comments: True
flag: TS
background: blue
category: 前端
title: TypeScript 简介
date:   2019-02-26 17:54:00 GMT+0800 (CST)
update: 2019-12-12 11:43:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/02/26/5c7546f407746.png
tags:
- TS
---
# {{ page.title }}

## 什么是 TypeScript

**TypeScript** 是由微软开发的开源的编程语言。它是 **JavaScript** 的一个严格超集，并添加了可选的静态类型和基于类的面向对象编程。

> 静态类型检查相对于动态类型检查，可以提前在编译阶段发现错误，

## 类型注解

### 特殊类型

#### 基础类型

TypeScript 支持与 JavaScript 几乎相同的数据类型，**类型注解**使用 `:TypeAnnotation` 语法:

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

#### 元组

**元组**类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同:

```JS
// Declare a tuple type
let x: [string, number]
// Initialize it
x = ['hello', 10] // OK
// Initialize it incorrectly
x = [10, 'hello'] // Error
```

#### 枚举

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

> 枚举类型的值，不仅可以是数字类型，也可以是字符串类型。

可以使用 enum + namespace 的声明的方式向枚举类型添加静态方法:

```JS
enum Weekday {
  Monday,
  Tuseday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

namespace Weekday {
  export function isBusinessDay(day: Weekday) {
    switch (day) {
      case Weekday.Saturday:
      case Weekday.Sunday:
        return false
      default:
        return true
    }
  }
}

const mon = Weekday.Monday
const sun = Weekday.Sunday

console.log(Weekday.isBusinessDay(mon)) // true
console.log(Weekday.isBusinessDay(sun))
```

#### Any / Unknown

**Any** 类型是指定那些在编程阶段还不清楚类型的变量，这些值可能来自于动态的内容，例子[来源于这里](https://mariusschulz.com/blog/the-unknown-type-in-typescript):

```JS
let value: any

value.foo.bar  // OK
value.trim()   // OK
value()        // OK
new value()    // OK
value[0][1]    // OK
```

TypeScript 3.0 引入了新的 **unknown** 顶级类型，与 any 的主要区别是 unknown 类型会更加严格，即 TypeScript 不允许我们对类型为 unknown 的值执行任意操作。相反，我们必须首先执行某种类型检查以缩小我们正在使用的值的类型范围。而且我们过多使用 any 类型，就无法享受 TypeScript 给予的保护机制:

```JS
let value: unknown

value.foo.bar  // Error
value.trim()   // Error
value()        // Error
new value()    // Error
value[0][1]    // Error
```

我们可以通过不同的方式将 unknown 类型缩小为更具体的类型范围，包括 `typeof`、`instanceof` 和自定义类型保护函数:

```JS
function stringifyForLogging(value: unknown): string {
  if (typeof value === 'function') {
    // Within this branch, `value` has type `Function`, so we can access the function's `name` property
    const functionName = value.name || '(anonymous)'
    return `[function ${functionName}]`
  }

  if (value instanceof Date) {
    // Within this branch, `value` has type `Date`, so we can call the `toISOString` method
    return value.toISOString()
  }
  
  return String(value)
}

// 如果要强制编译器信任类型为 unknown 的值为给定类型，则可以使用类似这样的类型断言
const value: unknown = 'Hello World'
const someString: string = value as string // 若不断言的话则会报错，因为 unknown 类型只能赋值给 unknown 或 any
// const value1: string = value   // Error
const otherString = someString.toUpperCase()  // 'HELLO WORLD'
```

#### Void / Never

当一个函数没有返回值时，其类型可以用 **void**:

```JS
function warnUser(): void {
  console.log('This is my warning message')
}

// 声明一个void类型的变量没有什么大用，因为你只能为它赋予 undefined 和 null
const unusable: void = undefined
```

**never** 类型表示的是那些永不存在的值的类型。比如那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型:

```JS
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message)
}
```

> void 指可以被赋值的类型(在 strictNullChecking 为 false 时)，但是 never 不能赋值给其他任何类型，除了 never。

> void 与 never 的区别 - void return void, never never return

#### Object / object / {}

首先，这三种类型都表示你的值是一个没有任何自定义属性的对象，只从 `Object.prototype` 继承了基本的方法。意味着 TypeScript 会有以下限制：

```JS
let user: object = { name: 'tate' }
user.toString() // OK
user.name // Error: Property 'name' does not exist on type 'object'.(2339)
```

另一方面，如果你之前不了解 {}, object, Object 分别代表哪些值，下面这段代码可能会让你感觉相当困惑:

```JS
let title: {}
title = {} // OK
title = [] // OK
title = 123 // OK

let content: object
content = {} // OK
content = [] // OK
content = 123 // Error: Type '123' is not assignable to type 'object'.ts(2322)
```

我们知道 JavaScript 中有多种原始类型 (primitive type): number、string、boolean、symbol、null 和 undefined。而 object (TypeScript v2.2 新加入的类型)就是用来表示**非原始类型**的。也就是说，如果一个变量的值是 object 类型，那么它可以是任何非原始类型值，比如上面的空对象和空数组，但是不能是原始类型值，比如 123。

{} 类型不仅包含非原始类型，还包含除 `null | undefined` 之外的其他原始类型，这也是为什么把 123 和 [] 赋值给 {} 类型都不会报错。清楚了每个类型所包含的值的范围，也就很好理解上面的代码为什么会有这样的差异了。至于 Object 的话，在行为上跟 {} 基本上是一样的。新增的 object 类型在某些情况下是有用的，比如用来限定 `Object.create` 方法的参数类型:

```JS
interface ObjectConstructor {
  // ...
  create(o: object | null): any
  // ...
}
```

### 联合类型 |

**联合类型**用于限制传入的值的类型只能是分隔的每个类型，如：`number | string | boolean` 表示一个值的类型只能是 number、string、boolean 中的一种:

```JS
interface Bird {
  fly()
  layEggs()
}
interface Fish {
  swim()
  layEggs()
}
let pet = getPet() // getPet() 的返回值类型是`Bird | Fish`
pet.layEggs() // 允许
pet.swim() // 报错
```

### 类型保护 is

联合类型可以让一个值可以为不同的类型，但随之带来的问题就是访问非共同方法时会报错。那么该如何区分值的具体类型，以及如何访问共有成员呢？我们可以使用后面要介绍的类型断言:

```JS
let pet = getPet()
if ((<Fish>pet).swim) {
  (<Fish>pet).swim()
} else {
  (<Bird>pet).fly()
}
```

我们可以看到这种书写方式很麻烦。那么有没有更好的方式可以判断类型呢？答案是：使用类型保护，如写一个类型判断函数，形式为 `param is SomeType`:

```JS
function isFish(pet: Bird | Fish): pet is Fish {
  return (<Fish>pet).swim !== undefined
}
```

这样之后，我们改写上面的判断:

```JS
if (isFish(pet)) {
  pet.swim()
} else {
  pet.fly()
}
```

### 类型别名 type

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

```JS
export type QRCodeErrorCorrectionLevel = "low" | "medium" | "quartile" | "high" | "L" | "M" | "Q" | "H"
```

### 类型断言 as

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。类型断言有两种形式:

* **尖括号语法**
* **as 语法**

```JS
// 尖括号语法
const someValue: any = 'this is a string'
const strLength: number = (<string>someValue).length
// as 语法(推荐)
const strLength: number = (someValue as string).length
```

类型断言的一个常见用例是当你从 JavaScript 迁移到 TypeScript 时:

```JS
const foo = {}
foo.bar = 123 // Error: 'bar' 属性不存在于 ‘{}’
foo.bas = 'hello' // Error: 'bas' 属性不存在于 '{}'
```

这里的代码发出了错误警告，因为 foo 的类型推断为 {}，即是具有零属性的对象。因此，你不能在它的属性上添加 bar 或 bas，你可以通过类型断言来避免此问题:

```JS
interface Foo {
  bar: number
  bas: string
}

const foo = {} as Foo
foo.bar = 123
foo.bas = 'hello'
```

让我们再看看**双重类型断言**的栗子:

```JS
function handler(event: Event) {
  // const mouseEvent = event as MouseEvent
  const element = event as HTMLElement // Error: 'Event' 和 'HTMLElement' 中的任何一个都不能赋值给另外一个
}
```

此时如果你仍然想使用那个类型，你可以使用双重断言。首先断言成兼容所有类型的 any，编译器将不会报错:

```JS
function handler(event: Event) {
  const element = (event as any) as HTMLElement // ok
}
```

## 接口 Interface

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。它有时被称做'鸭式辨型法'或'结构性子类型化'。 在 TypeScript 里，**接口**的作用就是为这些类型命名和为你的代码或第三方代码定义契约。一般自定义的接口建议用 `I` 前缀，如 IProps:

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
interface ILabelledValue {
  label: string
  size?: number // 可选属性
  gender?: 'man' | 'woman'
}

function printLabel(labelledObj: ILabelledValue) {
  console.log(labelledObj.label)
}

let myObj = {size: 10, label: 'Size 10 Object'}
printLabel(myObj)
```

### readonly

一些对象属性只能在对象刚刚创建的时候修改其值。可以在属性名前用 **readonly** 来指定只读属性:

```JS
interface IPoint {
  readonly x: number
  readonly y: number
}
let p1: IPoint = { x: 10, y: 20 }
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
interface ISquareConfig {
  color?: string
  width?: number
  [propName: string]: any
}
```

接口除了描述带有属性的普通对象外，也可以描述函数类型:

```JS
interface ISearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: ISearchFunc
// 如果你不想指定类型，TypeScript 的类型系统会推断出参数类型，因为函数直接赋值给了 SearchFunc 类型变量
mySearch = function(source: string, subString: string) {
  const result = source.search(subString)
  return result > -1
}
```

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如 a[10] 或 ageMap['daniel']。可索引类型具有一个**索引签名**，它描述了对象索引的类型，还有相应的索引返回值类型:

```JS
interface IStringArray {
  [index: number]: string
}

let myArray: IStringArray
myArray = ['Bob', 'Fred']

const myStr: string = myArray[0]
```

### 类类型

TypeScript 能够用它来明确的强制一个类去符合某种契约:

```JS
// 接口描述了类的公共部分
interface IClockInterface {
  currentTime: Date
  setTime(d: Date) // 可以在接口中描述一个方法，在类里实现它
}

class Clock implements IClockInterface {
  currentTime: Date
  setTime(d: Date) {
    this.currentTime = d
  }
  constructor(h: number, m: number) { }
}
```

类是具有两个类型的：静态部分的类型和实例的类型。我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口，`ClockConstructor` 为构造函数所用和 `ClockInterface` 为实例方法所用:

```JS
interface IClockConstructor {
  new (hour: number, minute: number): IClockInterface
}
interface IClockInterface {
  tick()
}

function createClock(ctor: IClockConstructor, hour: number, minute: number): IClockInterface {
  return new ctor(hour, minute)
}

class DigitalClock implements IClockInterface {
  constructor(h: number, m: number) { }
  tick() {
    console.log('beep beep')
  }
}
class AnalogClock implements IClockInterface {
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
interface IShape {
  color: string
}

interface IPenStroke {
  penWidth: number
}

// 一个接口可以继承多个接口，创建出多个接口的合成接口
interface ISquare extends IShape, IPenStroke {
  sideLength: number
}

let square = <ISquare>{}
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
interface ISelectableControl extends Control {
  select(): void
}

class Button extends Control implements ISelectableControl {
  select() { }
}

class TextBox extends Control {
  select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements ISelectableControl {
  select() { }
}
```

### interface 与 type 的区别

type alias 和 interface 在很多时候都可以相互替换使用，具体什么情况该用哪一个并没有强制的要求。相比直接提供一些使用的建议，我觉得把两者主要的差异点先列出来也许更有必要：

* 同一个作用域中同名的 interface 会**合并声明** (declaration merging)，而同一个作用域同名的 type alias 会报错
* type alias 的右值可以是任何类型，包括原始类型 (比如 string, number) 和类型表达式，interface 只能是对象类型 (shape)
* interface 可以继承 (extends) 其他 shape 类型

> 注意：上面有提到一个 shape 类型，其实就是非原始类型 object。很多人会误以为 interface 只能继承其他 interface、class 只能 implements interface，但实际上可以 extends 或者 implements 其他任何 shape 类型。

了解了这几个重要的差异之后，我们再回到 type alias 和 interface 的使用场景。一般来讲，使用哪种更多的是个人偏好，不过 type alias 似乎比 interface 要简洁通用一些 (type alias 支持类型表达式比如条件判断)。而如果你准备编写一个公共库，可能还需要仔细考虑库中定义的类型是否允许使用者扩展 (declaration merging)。

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

没有什么去限制它只能使用 number 类型。 也可以使用字符串或其它更复杂的类型:

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

## 命名空间 namespace

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

> **三斜线指令(Triple Slash Directive)** 一般用来为某一文件制定特殊的编译选项，或者指示某一文件依赖其他文件

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

declare function greet(name: string): void
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

从上面的例子我们可以看到 `d.ts` 文件和 `ts` 文件相比，就相当于代码减去值，只保留了类型信息。`d.ts` 是用来给 JavaScript 添加类型信息的，所以我们能够在 TypeScript 项目中安全的使用 JavaScript 模块。如果项目都是 TypeScript 代码，那么基本上不会用到 d.ts 文件，因为 .ts 文件本身就包含类型。但是如果我们某些依赖的模块是用 JavaScript 写的，并且没有对应的 `d.ts`**，DefinitelyTyped** 中也没有第三方贡献的 type 模块，这个时候可能需要我们自己在项目中新建一个 `d.ts` 文件，为这些 JavaScript 模块增加相应的类型。

> **declare** 关键字用来表示一个断言：如在相应的 JavaScript 模块中，一定导出了一个函数 greeting，它的类型是 `(name: string) => void`。注意只有在编写类型信息时才会用到该关键字

## 声明合并

### 接口合并

最简单也最常见的声明合并类型是接口合并。 从根本上说，合并的机制是把双方的成员放到一个同名的接口里:

```JS
interface IBox {
  height: number
  width: number
}

interface IBox {
  scale: number
}

let box: IBox = {height: 5, width: 6, scale: 10}
```

接口的非函数的成员应该是唯一的。如果它们不是唯一的，那么它们必须是相同的类型。如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错。对于函数成员，每个同名函数声明都会被当成这个函数的一个重载。同时需要注意，当接口 A 与后来的接口 A 合并时，后面的接口具有更高的优先级:

```JS
interface Cloner {
  clone(animal: Animal): Animal
}

interface Cloner {
  clone(animal: Sheep): Sheep
}

interface Cloner {
  clone(animal: Dog): Dog
  clone(animal: Cat): Cat
}

// 合并为
interface Cloner {
  clone(animal: Dog): Dog
  clone(animal: Cat): Cat
  clone(animal: Sheep): Sheep
  clone(animal: Animal): Animal
}
```

> 这个规则有一个例外是当出现特殊的函数签名时。如果签名里有一个参数的类型是单一的字符串字面量（比如，不是字符串字面量的联合类型），那么它将会被提升到重载列表的最顶端

### 命名空间合并

对于命名空间的合并，模块导出的同名接口进行合并，构成单一命名空间内含合并后的接口。对于命名空间里值的合并，如果当前已经存在给定名字的命名空间，那么后来的命名空间的导出成员会被加到已经存在的那个模块里:

```JS
namespace Animals {
  export class Zebra { }
}

namespace Animals {
  export interface Legged { numberOfLegs: number }
  export class Dog { }
}

// 合并为
namespace Animals {
  export interface Legged { numberOfLegs: number }

  export class Zebra { }
  export class Dog { }
}
```

除了这些合并外，你还需要了解非导出成员是如何处理的。 非导出成员仅在其原有的（合并前的）命名空间内可见。这就是说合并之后，从其它命名空间合并进来的成员无法访问非导出成员:

```JS
namespace Animal {
  let haveMuscles = true

  export function animalsHaveMuscles() {
    return haveMuscles
  }
}

namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles  // Error, because haveMuscles is not accessible here
  }
}
```

名空间还可以与其它类型的声明进行合并，只要命名空间的定义符合将要合并类型的定义，合并结果包含两者的声明类型。我们可以用以下方式表示内部类:

```JS
class Album {
  label: Album.AlbumLabel
}
namespace Album {
  export class AlbumLabel { }
}
```

除了内部类的模式，你在 JavaScript 里，创建一个函数稍后扩展它增加一些属性也是很常见的。 TypeScript 使用声明合并来达到这个目的并保证类型安全:

```JS
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix
}

namespace buildLabel {
  export let suffix = ""
  export let prefix = "Hello, "
}

console.log(buildLabel("Sam Smith"))
```

### 模块扩展

虽然 JavaScript 不支持合并，但你可以为导入的对象打补丁以更新它们。让我们考察一下这个玩具性的示例:

```JS
// observable.js
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.js
import { Observable } from "./observable"
Observable.prototype.map = function (f) {
  // ... another exercise for the reader
}
```

它也可以很好地工作在 TypeScript 中， 但编译器对 `Observable.prototype.map` 一无所知。 你可以使用扩展模块来将它告诉编译器:

```JS
// observable.ts stays the same
// map.ts
import { Observable } from "./observable"
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>
  }
}
Observable.prototype.map = function (f) {
  // ... another exercise for the reader
}


// consumer.ts
import { Observable } from "./observable"
import "./map"
let o: Observable<number>
o.map(x => x.toFixed())
```

再举个工作中遇到的例子，比如使用富文本导出 html 的库 `draft-js-export-html` 定义了以下接口，但是发现 Options 接口少定义了一个 `InlineStyleFn` 属性:

```JS
/// <reference types="draft-js" />

declare module 'draft-js-export-html' {
  import draftjs = require("draft-js");

  type BlockStyleFn = (block: draftjs.ContentBlock) => RenderConfig|undefined;
  type EntityStyleFn = (entity: draftjs.EntityInstance) => RenderConfig|undefined;
  type BlockRenderer = (block: draftjs.ContentBlock) => string;
  type RenderConfig = {
    element?: string;
    attributes?: any;
    style?: any;
  };

  export interface Options {
    defaultBlockTag?: string;
    inlineStyles?: { [styleName: string]: RenderConfig };
    blockRenderers?: { [blockType: string]: BlockRenderer };
    blockStyleFn?: BlockStyleFn;
    entityStyleFn?: EntityStyleFn;
  }

  export function stateToHTML(content: draftjs.ContentState, options?: Options): string;
}
```

于是重新创建一个声明文件进行补充和合并:

```JS
declare module 'draft-js-export-html' {
  import draftjs = require("draft-js")

  interface IInlineStyle {
    element: string,
    style: { [p: string]: string }
  }

  type InlineStyleFn = (styles: draftjs.DraftInlineStyle) => draftjs.DraftInlineStyle | IInlineStyle

  export interface Options {
    inlineStyleFn?: InlineStyleFn
  }
}

```

### 全局扩展

也可以在模块内部添加声明到全局作用域中:

```JS
// observable.ts
export class Observable<T> {
  // ... still no implementation ...
}

declare global {
  interface Array<T> {
    toObservable(): Observable<T>
  }
}

Array.prototype.toObservable = function () {
  // ...
}
```

## 参考链接

1. [TypeScript 中文文档](https://www.tslang.cn/docs/home.html)
2. [深入理解 TypeScript(译)](https://jkchao.github.io/typescript-book-chinese/#why) By Basarat
3. [TypeScript 中的 .d.ts 文件有什么作用，这种文件的内如如何编写？ - 知乎](https://www.zhihu.com/question/52068257)
4. [Typescript学习记录：高级类型](https://www.ruphi.cn/archives/266/) By RuphiLau
5. [Say Goodbye to ‘../../../..’ in your TypeScript Imports](https://decembersoft.com/posts/say-goodbye-to-relative-paths-in-typescript-imports/)

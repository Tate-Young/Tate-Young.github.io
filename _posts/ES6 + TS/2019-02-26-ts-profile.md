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
# {{ page.title }})

## 什么是 TypeScript

**TypeScript** 是由微软开发的开源的编程语言。它是 **JavaScript** 的一个严格超集，并添加了可选的静态类型和基于类的面向对象编程。**Angular** 就是基于 TypeScript 写的。

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
  gender？: 'man' | 'woman'
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

接口也可以继承类，它会继承类的成员但不包括其实现。这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现(implement):

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

## 参考链接

1. [TypeScript 中文文档](https://www.tslang.cn/docs/home.html)

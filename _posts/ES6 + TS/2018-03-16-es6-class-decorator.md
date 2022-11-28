---
layout: blog
front: true
comments: True
flag: ES6
background: blue
category: 前端
title:  Class & Decorator
date:   2018-03-16 16:07:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- ES6
---
# {{ page.title }}

## 什么是 class

### 定义 class

ES6 的 class 可以看作只是一个语法糖，本质是构造函数。类和模块的内部，默认就是严格模式，所以不需要使用 use strict 指定运行模式。

```JS
// ES5
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```

```JS
// ES6 注意 class 不存在变量提升
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var p = new Point(1, 2);
typeof Point // 'function'
Point === Point.prototype.constructor // true
```

由于类的方法都定义在 prototype 对象上面，所以类的新方法可以通过 **Object.assign** 方法添加到原型上。类的内部所有定义的方法，都是不可枚举的(non-enumerable)。

```JS
class Point { } // 不显示定义 constructor 构造方法的话默认会自动添加，默认返回实例对象

// Object.assign 往原型添加方法
Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});

Object.keys(Point.prototype); // [] 'toString' 在 ES5 中是可枚举的，但 ES6 中不可枚举
Object.getOwnPropertyNames(Point.prototype); // ['constructor', 'toString', 'toValue']
Object.getOwnPropertyNames(Point); // ['length', 'prototype', 'name']
```

### 实例属性

与 ES5 一样，实例的属性除非显式定义在其本身(即定义在 this 对象上)，否则都是定义在原型上(即定义在 class 上):

```JS
p.hasOwnProperty('x'); // true
p.hasOwnProperty('y'); // true
p.hasOwnProperty('toString'); // false
p.__proto__.hasOwnProperty('toString'); // true
```

### getter / setter

与 ES5 一样，在"类"的内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为:

```JS
class MyClass {
  constructor() { }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: ' + value);
  }
}

let inst = new MyClass();

inst.prop = 123; // setter: 123
inst.prop; // 'getter'
```

### 静态方法 static

通过关键字 **static** 可以设置静态方法，该方法不会被实例继承，而是直接通过类来调用。

```JS
class Person {
  static sayName() { // 静态方法
    return 'tate';
  }
}

Person.sayName(); // 'tate'

var person = new Person();
person.sayName(); // TypeError: person.sayName is not a function
```

父类的静态方法，可以被子类继承:

```JS
class AnotherPerson extends Person { }
AnotherPerson.sayName(); // 'tate'

// 或者通过 super 关键字调用父类的静态方法
class AnotherPerson extends Person {
  static sayName() {
    return super.sayName() + ' loves snow';
  }
}
```

### new.target

new 是从构造函数生成实例对象的命令。ES6 为 new 命令引入了一个 new.target 属性，该属性一般用在构造函数之中，返回 new 命令作用于的那个构造函数。如果构造函数不是通过 new 命令调用的，则 new.target 会返回 undefined。

```JS
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

// 子类继承时 new.target 会返回子类
class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var shape = new Shape();  // 报错
var rec = new Rectangle(1, 2);  // 正确
```

## class 继承

Class 可以通过 **extends** 关键字实现继承。关于继承详情可参考 [原型链与继承]( {{site.url}}/2018/02/06/js-prototype.html#class-%E7%BB%A7%E6%89%BF ) 一节。

```JS
class Shape { }
class Rectangle extends Shape { } // 继承
```

```JS
class Rectangle extends Shape {
  constructor(x, y, color) {
    // this.color = color; // ReferenceError 子类没有自己的 this 对象，必须继承于父类
    super(x, y); // 调用父类的 constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的 toString()
  }
}
```

## 修饰器 Decorator

### 类的修饰

**修饰器(Decorator)** 用来修改类的行为，目前只有提案。但在 TypeScript 里已做为一项实验性特性予以支持。更多修饰器可查看第三方模块 [core-decorator](https://github.com/jayphelps/core-decorators)。

```JS
// 修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升
@decorator
class A {}

// 等价于
class A {}
A = decorator(A) || A;
```

```JS
@testable
class MyTestableClass { }

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable; // true
```

### 方法的修饰

```JS
class Person {
  @readonly
  @nonenumerable
  get kidCount() { return this.children.length; }
}

function nonenumerable(target, name, descriptor) { // 接收三个参数
  descriptor.enumerable = false;
  return descriptor;
}
```

Angular 的组件 @Component 修饰符示例:

```JS
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
```

使用第三方模块里的修饰符，以 @deprecated 为例:

```JS
import { deprecate } from 'core-decorators';

class Person {
  @deprecate
  facepalm() {}

  @deprecate('We stopped facepalming')
  facepalmHard() {}

  @deprecate('We stopped facepalming', { url: 'http://knowyourmeme.com/memes/facepalm' })
  facepalmHarder() {}
}

let person = new Person();

person.facepalm();
// DEPRECATION Person#facepalm: This function will be removed in future versions.

person.facepalmHard();
// DEPRECATION Person#facepalmHard: We stopped facepalming

person.facepalmHarder();
// DEPRECATION Person#facepalmHarder: We stopped facepalming
//
//     See http://knowyourmeme.com/memes/facepalm for more details.
//
```

## 参考链接

1. [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/string) By 阮一峰

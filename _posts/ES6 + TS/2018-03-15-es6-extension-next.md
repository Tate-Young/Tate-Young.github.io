---
layout: blog
front: true
comments: True
flag: ES6
background: blue
category: 前端
title:  对象扩展(下)
date:   2018-03-16 11:43:00 GMT+0800 (CST)
background-image: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2447683882,2644927629&fm=27&gp=0.jpg
tags:
- ES6
---
# {{ page.title }}

## 函数扩展

ES6 中函数主要扩展:

| 扩展 | 描述 |
|:--------------|:---------|
| 默认值 | 可以使用参数默认值 |
| rest 参数 | <code>...args</code> |
| 函数名 | name |
| 箭头函数 | => |

### 默认值

ES6 可以为函数的参数指定默认值。

```JS
// ES5
function sayName(x, name) {
  name = name || 'snow';
  console.log(x, name);
}

sayName('hi', null); // hi snow
```

```JS
// ES6
function sayName(x, name = 'snow') {
  console.log(x, name);
}

sayName('hi'); // hi snow
sayName('hi', undefined); // hi snow
sayName('hi', null); // hi null，null 无法触发默认值
```

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域，等到初始化结束，这个作用域就会消失。

```JS
let x = 1;

// 函数调用时，函数体内部的局部变量 x 影响不到默认值变量x
function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

### length

**length** 属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同理，rest 参数也不会计入 length 属性。

```JS
(function (a, b, c = 2){}).length // 2
(function (...args){}).length // 0

// 若设置了默认值的参数不是尾参数，那么 length 属性也不再计入后面的参数了
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

### rest 参数

**rest 参数**(形式为...变量名)，用于获取函数的多余参数，这样就不需要使用 arguments 对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

```JS
// arguments 变量
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest 参数
const sortNumbers = (...numbers) => numbers.sort();
```

rest 参数只能在最后，否则报错:

```JS
function f(a, ...b, c) { } // SyntaxError: Rest parameter must be last formal parameter
```

### name

ES5 的 name 属性，会返回空字符串，而 ES6 的 name 属性会返回实际的函数名。

```JS
(function foo(){}).name; // 'foo'
(new Function).name; // 'anonymous'

// bind 返回的函数，name 属性值会加上 bound 前缀
(function foo(){}).bind({}).name // "bound foo"
```

### 箭头函数 =>

ES6 允许使用"箭头"**(=>)**定义函数。箭头函数里面实际上没有自己的 this 属性，而是引用外层的 this。 其指向定义时所在的对象，[详见 this]( {{site.url}}/2018/01/30/js-this.html )。

```JS
// ES5
var foo = function(bar) {
  return bar;
};

// ES6
let foo = bar => bar;

[1, 2, 3].map(x => x ** 2); // [1, 4, 9]
[1, 2, 3].map(x => {return x ** 2}); // 与上面等价，一般用于多条执行语句
```

```JS
// 返回一个对象
const increment = _ => ({
  type: 'INCREMENT'
})
```

除了 this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target。

```JS
var foo = bar => {console.log(arguments)}
foo('tate'); // ReferenceError: arguments is not defined
```

## 对象扩展

ES6 中对象主要扩展:

| 扩展 | 描述 |
|:--------------|:---------|
| 属性格式 | 更简洁 |
| 新增方法 | Object.is()、Object.assign()、Object.keys() |
| super 关键字 | 指向当前对象的原型对象 |

### 属性格式

```JS
var name = 'tate';

// ES5
var person = {
  name: name,
  method: function() {
    return 'snow';
  }
};
```

```JS
// ES6
let person = {
  name, // 等价于 name: name
  method() {
    return 'snow';
  }
};
```

ES6 允许字面量定义对象时，用表达式作为对象的属性名。属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串 [object Object]:

```JS
let name = 'tate';
let obj = {'age': 18};

let person = {
  [name]: 'snow',
  ['a' + 'bc']: 1,
  [obj]: 26
};

person.tate; // 'snow'
person.abc; // 1

Reflect.ownKeys(person); // ["tate", "abc", "[object Object]"]
```

### Object.is()

ES6 提出"Same-value equality"(同值相等)算法，用来比较两个值是否严格相等，与严格比较运算符 (===) 的行为基本一致。

```JS
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### Object.assign()

**Object.assign** 方法用于对象的合并，将源对象(source)的所有 *可枚举* 属性，复制到目标对象(target)。关于其浅拷贝可以参考 [深浅拷贝一节]( {{site.url}}/2018/01/31/js-deep-copy.html#%E7%AC%AC%E4%BA%8C%E7%A7%8D%E6%B5%85%E6%8B%B7%E8%B4%9D )。

```JS
const target = { a: 1, b: 1, c: {d: 4} };
const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

// 只要是同名属性就覆盖
Object.assign(target, source1, source2);
target; //  {a:1, b:2, c:3}
```

```JS
// 浅拷贝
let obj1 = { a: 1, b: 2 };
let obj2 = { ...obj1 };
obj2 // { a: 1, b: 2 }

// 等价于
Object.assign({}, obj1);
```

Object.assign 拷贝的属性是有限制的，只拷贝源对象的自身属性(不拷贝继承属性)，也不拷贝不可枚举的属性(enumerable: false):

```JS
Object.assign({name: 'tate'},
  Object.defineProperty({}, 'spouse', {
    enumerable: false,
    value: 'snow'
  })
)
// {name: 'tate'}
```

### 可枚举性

对象的每个属性都有一个**描述对象(Descriptor)**，用来控制该属性的行为。**Object.getOwnPropertyDescriptor** 方法可以获取该属性的描述对象。

```JS
Object.getOwnPropertyDescriptor(target, 'a');
// configurable:true - 当且仅当指定对象的属性描述可以被改变或者属性可被删除时，为true
// enumerable:true - 当且仅当指定对象的属性可以被枚举出时，为 true
// value:1 - 该属性的值
// writable:true - 当且仅当属性的值可以被改变时为true

Object.getOwnPropertyDescriptors(target); // 获取一个对象的所有自身属性的描述符
```

目前，有四个操作会忽略 enumerable:false 的属性。

* for...in循环 - 只遍历对象自身的和继承的可枚举的属性。
* Object.keys() - 返回对象自身的所有可枚举的属性的键名。
* JSON.stringify() - 只串行化对象自身的可枚举的属性。
* Object.assign() - 忽略不可枚举的属性，只拷贝对象自身的可枚举的属性。

另外，ES6 规定，所有 Class 的原型的方法都是不可枚举的。

```JS
Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo').enumerable; // false

Object.getOwnPropertyDescriptor([], 'length').enumerable； // false 数组的 length 属性不可枚举
```

### 遍历

目前一共有 5 种方法可以遍历对象的属性。

| 方法 | 属性 | 可枚举性 | Symbol | 描述 |
|:--------------|:---------|:---------|:---------|:---------|
| **for...in** | 自身和继承 | 可枚举 | 不含 Symbol |  循环遍历对象自身的和继承的可枚举属性(不含 Symbol 属性) |
| **Object.keys(obj)** | 自身 | 可枚举 | 不含 Symbol | 返回一个数组，包括对象自身的(不含继承的)所有可枚举属性(不含 Symbol 属性)的键名 |
| **Object.getOwnPropertyNames(obj)** | 自身 | 包括可枚举与不可枚举 | 不含 Symbol | 返回一个数组，包含对象自身的所有属性(不含 Symbol 属性，但是包括不可枚举属性)的键名 |
| **Object.getOwnPropertySymbols(obj)** | 自身 | 包括可枚举与不可枚举 | 只包含 Symbol | 返回一个数组，包含对象自身的所有 Symbol 属性的键名 |
| **Reflect.ownKeys(obj)** | 自身 |  包括可枚举与不可枚举 | 包含 Symbol | 返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举 |

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

1. 首先遍历所有数值键，按照数值升序排列;
1. 其次遍历所有字符串键，按照加入时间升序排列;
1. 最后遍历所有 Symbol 键，按照加入时间升序排列。

```JS
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 }); // ["2", "10", "b", "a", Symbol()]
```

### Object.keys()

以下三个方法均用于遍历对象，都返回一个数组，成员是针对参数对象自身的(不含继承的)所有可遍历（enumerable）属性。可以用 for...of 循环进行遍历:

* **Object.keys()** - 对键名的遍历
* **Object.values()** - 对键值的遍历
* **Object.entries()** - 对键值对的遍历

```JS
let {keys, values, entries} = Object;

for (let key of keys(obj)) { }
```

### super 关键字

this 关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字 **super**，指向当前对象的原型对象。只能用在对象的方法之中。

```JS
const person = {
  name: 'tate'
};

const anotherPerson = {
  name: 'snow',
  sayName() {
    return super.name;
  }
};

Object.setPrototypeOf(anotherPerson, person); // anotherPerson.__proto__ = person
anotherPerson.sayName(); // 'tate'
```

## Symbol

### Symbol()

**Symbol** 是 ES6 引入的一种新的原始数据类型，表示独一无二的值。

```JS
let a = Symbol();
let b = Symbol();
// Symbol函数的参数只是表示对当前 Symbol 值的描述
let c = Symbol('tate');

typeof a; // 'symbol'
a === b; // false
```

作为属性名的写法，可以通过 Object.getOwnPropertySymbols 返回包含所有 Symbol 值的数组:

```JS
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol]; // 'Hello!' 不能使用 点运算符.
Object.getOwnPropertySymbols(a); // '[Symbol()]'
```

### Symbol.for()

**Symbol.for** 可以复用同一个 Symbol 值，会被登记在全局环境中供搜索。

```JS
let a = Symbol.for('tate');
let b = Symbol.for('tate');

a === b; // true
```

### 内置 Symbol 值

除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。举两个栗子 🌰:

* Symbol.hasInstance

```JS
// foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass(); // true
```

* Symbol.replace

```JS
String.prototype.replace(searchValue, replaceValue)
// 等同于
searchValue[Symbol.replace](this, replaceValue)

const x = {};
x[Symbol.replace] = (...s) => console.log(s);

'Hello'.replace(x, 'World'); // ["Hello", "World"]
```

## 解构赋值

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为**解构(Destructuring)**，实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值:

```JS
const [a, b, c] = [1, 2, 3]
// a = 1
// b = 2
// c = 3
```

解构赋值允许指定默认值:

```JS
const [foo = true] = [];
foo // true

const [x, y = 'b'] = ['a']; // x='a', y='b'
const [x, y = 'b'] = ['a', undefined]; // x='a', y='b'

// 嵌套的写法
const { match: { params: { client } } } = this.props
```

> 注意如果解构的值为 null，默认值就不会生效

## 参考链接

1. [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/string) By 阮一峰

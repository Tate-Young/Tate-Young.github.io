---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  原型链与继承
date:   2018-02-06 23:03:00 GMT+0800 (CST)
background-image: http://ot1cc1u9t.bkt.clouddn.com/17-8-1/24280498.jpg
tags:
- JavaScript
---
# {{ page.title }}

许多OO语言都支持两种继承方式：接口继承和实现继承。接口继承只承认方法签名，而实现继承则继承实际的方法。由于函数没有签名，故 JavaScript 只支持实现继承。

大部分面向对象的编程语言，都以“类”（class）为基础，实现对象的继承，在 ES2015/ES6 中引入了 **class** 关键字，但只是语法糖，JavaScript 仍然是基于原型 **prototype** 实现继承的。

## 什么是原型(prototype)

每一个构造函数都有一个 **prototype** 属性，该属性是一个指针，指向其原型对象，原型对象里有个 **constructor** 指针，指向构造函数本身。使用原型对象的好处是可以让所有对象实例共享它所包含的引用类型值的属性和方法。

```js
function Dog(name, color) {
  this.name = name;
  this.color = color;
  this.eat = function () {
    console.log('eat');
  };
}

Dog.prototype.species = 'dog';
Dog.prototype.bark = function() { console.log('bark'); };

var dog1 = new Dog('小君家的二猫', '粉色');
var dog2 = new Dog('小君家的猫猫猫', '黑色');

Dog.prototype.constructor === Dog; // true

dog1.eat === dog2.eat; // false 实例无法共享此方法
dog1.bark === dog2.bark; // true 实例共享通过原型继承的此方法
```

![prototype]( {{site.url}}//style/images/prototype.png )

## 什么是原型链

每个对象都有一个私有属性 **[[prototype]]**，即**(__proto__)**指针，指向其构造函数的原型对象。而原型对象也有内部 __proto__ 指针，同样指向其构造函数的原型对象，如此形成 **原型链**。原型链的末端是 null。

```js
// p ---> Person.prototype ---> Object.prototype ---> null
function Person(){};
var p = new Person();

p.__proto__ === Person.prototype;
Person.prototype.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;
```

## Object原型方法

### Object.getPrototypeOf

返回指定对象的原型，即内部[[Prototype]]属性的值。

```js
Object.getPrototypeOf([1, 2]) === Array.prototype;
Object.getPrototypeOf({}) === Object.prototype;

Object.getPrototypeOf(Array) === Function.prototype;
Object.getPrototypeOf(Object) === Function.prototype;

Object.getPrototypeOf(Array.prototype) === Object.prototype;
Object.getPrototypeOf(Object.prototype) === null;
```

### Object.setPrototypeOf

设置一个指定的对象的原型，即内部 [[Prototype]] 属性到另一个对象或 null。

```js
// 以下两种写法等价
p.__proto__ = Person.prototype;
Object.setPrototypeOf(p, Person.prototype);
```

### Object.create

使用指定的原型对象及其属性去创建一个新的对象。

```js
// 本质上新建了一个构造函数，并且将其原型指针指向obj
Object.create = function(obj){
    function F() {}
    F.prototype = obj;
    return new F();
};
```

```js
var a = {a: 1};
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (继承而来)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null
```

Object.create 和 new 操作符的比较，new 操作符实际操作可参考之前[this指针]( {{ site.url }}/2018/01/30/js-this.html#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E5%AE%9E%E4%BE%8B%E5%8C%96%E6%9C%AC%E8%B4%A8 )一文。

```js
var Person = function () {
    this.name = 'Tate'
}
Person.prototype.name = 'Snow';

var p1 = new Person();
var p2 = Object.create(Person.prototype);
var p3 = Object.create(Person);

p1.name; // 'Tate'
p2.name; // 'Snow'
p3.name; // 'Person' 函数名
```

### isPrototypeOf

属于对象实例的一个方法，用来判断一个对象是否是另一个对象的原型。

```js
// 引用上述例子
Obj.prototype.isPrototypeOf(o1); // true
Obj.prototype.isPrototypeOf(o2); // true
```

## 继承

### 原型链

```js
// 每个实例都共享原型上的引用类型值的属性，一旦修改后，原型相应属性也会修改
// 没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数，
function SuperType() {
    this.name = 'Tate';
    this.arr = [1, 2, 3];
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
}
function SubType() {}
SubType.prototype = new SuperType();

var a = new SubType();
var b = new SubType();

a.arr.push(4); // [1, 2, 3, 4]
b.arr; // [1, 2, 3, 4]

a.name = 'Snow'; // 'Snow'
b.name; // 'Tate'

a.sayName(); // 'Snow'
```

### 借用构造函数

```js
// 可以在子类型构造函数中向超类型构造函数传递参数
// 在超类型原型中定义的属性和方法，无法在子类型中访问
function SuperType(name) {
    this.name = name;
    this.arr = [1, 2, 3];
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
}
function SubType() {
    SuperType.call(this, 'Tate'); // 继承了 SuperType
}

var a = new SubType();
var b = new SubType('Snow');

a.arr.push(4); // [1, 2, 3, 4]
b.arr; // [1, 2, 3, 4]

a.sayName(); // TypeError: a.sayName is not a function
```

### 组合继承

```js
// 结合上述两种继承的优点
function SuperType(name) {
    this.name = name;
    this.arr = [1, 2, 3];
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
}
function SubType(name, age) {
    SuperType.call(this,name); // 继承属性
    this.age = age;
}
//继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;

SubType.prototype.sayAge = function() {
    console.log(this.age);
}

var a = new SubType('Tate', 18);
var b = new SubType('Snow', 16);

a.arr.push(4); // [1, 2, 3, 4]
b.arr; // [1, 2, 3]

a.sayName(); // 'Tate'
b.sayName(); // 'Snow'

a.sayAge(); // 18
b.sayAge(); // 16
```

### 原型式继承

```js
// 通过 Object.create 可以实现原型式继承，思路是借助原型可以基于已有的对象创建新对象。
// 同原型链继承一样，包含引用类型的属性值始终都会被所有实例共享
var person = {
    name: 'Tate',
    interests: ['travel', 'badminton']
}

var p1 = Object.create(person);
var p2 = Object.create(person);

p1.name = 'Snow';
console.log(p2.name); // 'Tate'

p1.interests.push('coding');
console.log(p2.interests); // ['travel', 'badminton', 'coding']
```

## 寄生式继承

## 寄生组合式继承

## 参考链接

1. [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
1. [prototype 对象](http://javascript.ruanyifeng.com/oop/prototype.html)
---
layout: blog
front: true
comments: True
flag: Node
background: gray
category: 后端
title: Mongoose 驱动库
date: 2018-06-03 14:39:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/19/5ad8a8e7dce53.jpg
tags:
- Node
---
# {{ page.title }}

## 连接 Connection

```JS
mongoose.connect('mongodb://localhost/myblog');
```

也可以传递配置选项，具体可[查看这里](https://mongoose.shujuwajue.com/guide/connections.html)

```JS
mongoose.connect(uri, options);
```

## 模式 Schema

Mongoose 的一切都源于 Schema。每个 schema 映射到 [MongoDB](https://docs.mongodb.com/manual/crud/) 的**集合(collection)**和定义该集合中文档的形式。

```JS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
  title:  String, // String 为 schemaTypes，即内置的数据类型
  author: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  array: [],
  ofString: [String], // 数组
  ofNumber: [Number],
  mixed: Schema.Types.Mixed, // 混合类型，等价于空对象 {}，但是 Mongoose 会失去自动检测和保存这些变化的能力，除非手动调用 markModified 方法
  _someId: Schema.Types.ObjectId // 主键。每个 Schema 都会默认配置这个属性，属性名为 _id，自定义后会覆盖该属性
});
```

Schema 有几个可配置的选项，可以直接传递给构造函数或设置该配置，具体选项可[参考这里 Options](https://mongoose.shujuwajue.com/guide/schemas.html):

```JS
new Schema({..}, options);

// 等价于

var schema = new Schema({..});
schema.set(option, value);
```

> 更多 schemaTypes 可[查询这里](http://mongoosejs.com/docs/schematypes.html) 👈

## 模型 Model

schema 不具备操作数据库的能力，必须通过它创建模型:

```JS
var Blog = mongoose.model('Blog', blogSchema);
```

### 实例方法

模型的实例是**文档(Documents)**，具有很多内置的方法，具体可[查看这里](http://mongoosejs.com/docs/api.html#document-js)，也可以自定义:

```JS
// define a schema
var animalSchema = new Schema({ name: String, type: String });

// assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function(cb) {
  return this.model('Animal').find({ type: this.type }, cb);
};
```

```JS
var Animal = mongoose.model('Animal', animalSchema);
var dog = new Animal({ type: 'dog' });

dog.findSimilarTypes(function(err, dogs) {
  console.log(dogs); // woof
});
```

### 静态方法

```JS
// assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
};

var Animal = mongoose.model('Animal', animalSchema);
Animal.findByName('fido', function(err, animals) {
  console.log(animals);
});
```

### 虚拟属性

虚拟属性是文档属性，可以获取和设置但不保存到 MongoDB，用于格式化或组合字段。举个栗子:

```JS
// define a schema
var personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

// compile our model
var Person = mongoose.model('Person', personSchema);

// create a document
var bad = new Person({
  name: { first: 'Walter', last: 'White' }
});

// 打印全名
console.log(bad.name.first + ' ' + bad.name.last); // Walter White
```

打印全名时需要拼接字符串，此时可以通过虚拟属性来实现:

```JS
personSchema.virtual('name.full').get(function() {
  return this.name.first + ' ' + this.name.last;
});

console.log('%s is insane', bad.name.full); // Walter White is insane
```

当然通过全名来拆分亦可:

```JS
personSchema.virtual('name.full').set(function(name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});

mad.name.full = 'Breaking Bad';
console.log(mad.name.first); // Breaking
console.log(mad.name.last);  // Bad
```

### 构建文档

创建文档并保存到数据库的两种方式，删除则都是 **remove** 方法:

```JS
var Tank = mongoose.model('Tank', yourSchema);

var small = new Tank({ size: 'small' });
small.save(function(err) {
  if (err) return handleError(err);
  // saved!
})

// 等价于

Tank.create({ size: 'small' }, function(err, small) {
  if (err) return handleError(err);
  // saved!
})
```

## 查询 Queries

查询的 API 可[参考这里](https://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html)。

```JS
var Person = mongoose.model('Person', yourSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
})
```

实际上等同于执行了:

```JS
// find each person with a last name matching 'Ghost'
var query = Person.findOne({ 'name.last': 'Ghost' });

// selecting the `name` and `occupation` fields
query.select('name occupation');

// execute the query at a later time
query.exec(function(err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
})
```

同样以下两种写法也等价，可以建立一个查询使用链式语法，而不是指定一个 JSON 对象:

```JS
// With a JSON doc
Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(callback);
```

```JS
// Using query builder
Person.
  find({ occupation: /host/ }).
  where('name.last').equals('Ghost').
  where('age').gt(17).lt(66).
  where('likes').in(['vaporizing', 'talking']).
  limit(10).
  sort('-occupation').
  select('name occupation').
  exec(callback);
```

## 验证 Validation

验证是在 schemaType 中定义的中间件，常用的一些内置验证器有:

```JS
var breakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, 'Too few eggs'],
    max: 12
  },
  bacon: {
    type: Number,
    required: [true, 'Why no bacon?']
  },
  drink: {
    type: String,
    enum: ['Coffee', 'Tea']
  }
});
var Breakfast = db.model('Breakfast', breakfastSchema);

// 验证
var badBreakfast = new Breakfast({
  eggs: 2,
  bacon: 0,
  drink: 'Milk'
});
var error = badBreakfast.validateSync();

// error.errors 是错误集合，message 则是错误信息属性
assert.equal(error.errors['eggs'].message, 'Too few eggs');
assert.ok(!error.errors['bacon']);
assert.equal(error.errors['drink'].message, '`Milk` is not a valid enum value for path `drink`.');

badBreakfast.bacon = null;
error = badBreakfast.validateSync();
assert.equal(error.errors['bacon'].message, 'Why no bacon?');
```

还可以自定义验证器:

```JS
var userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    },
    required: [true, 'User phone number required']
  }
});

// 验证
var User = db.model('user', userSchema);
var user = new User();
var error;

user.phone = '555.0123';
error = user.validateSync();
assert.equal(error.errors['phone'].message, '555.0123 is not a valid phone number!');

user.phone = '';
error = user.validateSync();
assert.equal(error.errors['phone'].message, 'User phone number required');

user.phone = '201-555-0123';
// Validation succeeds! Phone number is defined
```

## 中间件 Middleware

中间件(也称为前置和后置钩子)是异步函数执行过程中传递的控制的函数。支持的主要有两种:

* 文档中间件
  * init
  * validate
  * save
  * remove
* 查询中间件
  * count
  * find
  * findOne
  * findOneAndRemove
  * findOneAndUpdate
  * update

**前置钩子(pre)** 也分为**串行(serial)**和**并行(parallel)**，**后置钩子(post)** 则一般用来做监听器。

```JS
var schema = new Schema(..);

// 串行中间件是一个接一个的执行，每个中间件调用 next 将执行权移交给下一个中间件
schema.pre('save', function(next) {
  // do stuff
  next();
});

// `true` means this is a parallel middleware. You **must** specify `true` as the second parameter if you want to use parallel middleware.
schema.pre('save', true, function(next, done) {
  // calling next kicks off the next middleware in parallel
  next();
  setTimeout(done, 100); // 除非完成 done 操作，否则 save 动作不会执行
});
```

## 联表 Population

## 索引 Index

## 插件 Plugins

> 未完待续

## 参考链接

1. [mongoose 4.5 中文文档](https://mongoose.shujuwajue.com/guide/schemas.html)
2. [mongoose 官网](http://mongoosejs.com/docs/index.html)
3. [Mongoose 学习参考文档 —— 基础篇](https://cnodejs.org/topic/504b4924e2b84515770103dd?utm_source=ourjs.com) By a272121742
4. [Node.js MongoDB Driver API](https://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html)

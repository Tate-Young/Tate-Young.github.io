---
layout: blog
front: true
comments: True
flag: HTTP
background: gray
category: 后端
title: REST or GraphQL
date:   2018-03-01 15:33:00 GMT+0800 (CST)
update: 2019-10-18 20:56:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- http
---
# {{ page.title }}

## 什么是 REST

**REST(Representational State Transfer)** 是一种架构风格，在遵循 REST 设计原则和约束条件的 **面向资源的体系架构(ROA - Resource-Oriented Architecture)** 应用中，服务是以资源为中心的，对每个资源的操作都是标准化的 HTTP 方法。简单来讲就是用 [URI](#uri--url) 定位资源，用 HTTP 方法描述操作，默认基于 JSON 作为传输格式。

**RESTful Web Services** 是一种遵循 REST 式风格的 Web 服务，应该满足以下几点:

* 可寻址 URI
* 接口的统一，CRUD(增删改查)
* 无状态，可缓存
* 处理结果由 HTTP 状态码通知

### 可寻址 URI

在定义资源的 URI 时，通过模拟目录结构来使用服务变得简单直观。URI 只应该指示资源，因此必须要使用概念清晰的名字来定义。

```HTTP
<!-- 接口表述规范 -->
Method /path[?query]

<!-- Bad，避免用动词 -->
GET /getUsers?name=tate

<!-- Good -->
GET /users?name=tate
```

复杂查询可捎带以下参数:

| 查询方式 | 参数 |
|:-------------|:------------|
| 过滤条件 | ?name=snow&age=18
| 排序 | ?sort=age,desc |
| 投影 | ?whitelist=id,name,email |
| 分页 | ?limit=10&offset=3 |

<!-- ![可寻址 URI](https://i.loli.net/2018/03/01/5a976732bacc2.jpg) -->

### 统一接口

* **安全性(Safety)** - 外部系统对该接口的访问，不会使服务端资源的状态发生改变
* **幂等性(Idempotence)** - 外部系统对同一接口的多次访问，得到的资源状态始终相同

| 处理 | HTTP 方法 | CRUD 操作 | 描述 |
|:-------------|:------------|:-------------|:-------------|
| 创建 | POST | CREATE | 不安全、不幂等 |
| 查询 | GET | READ | 安全、幂等 |
| 更新 | PUT | UPDATE | 不安全、幂等 |
| 删除 | DELETE | DELETE | 不安全、幂等 |

> PUT 更新完整资源对象，而 PATCH 则用来对已知资源进行局部更新，且不幂等。

### 无状态

在**[无状态(Stateless)](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%8A%B6%E6%80%81%E5%8D%8F%E8%AE%AE)**交互中，服务器不保留客户端会话信息。

* 优点 - 每个请求与之前任何请求都独立且无关，不会造成不必要的连接占用，响应较快
* 缺点 - 如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大

> 因为 HTTP 协议是无状态的，即服务器不知道用户上一次做了什么，这严重阻碍了交互式 Web 应用程序的实现，因此 [cookie 和 session](( {{site.url}}/2018/03/01/cookie.html )) 应运而生。

### 状态码

由于 REST 使用 HTTP 方法，因此返回 HTTP 状态代码是一种自然流程。常见的状态码如下，更多可[点击查看](https://httpstatuses.com/):

| 状态码 | 描述 |
|:-------------|:------------|
| 200 | 请求成功 |
| 201 | 创建、修改成功 |
| 204 | 删除成功 |
| 400 | 参数错误 |
| 401 | 需要身份验证 |
| 403 | 禁止访问 |
| 404 | 未找到资源 |
| 500 | 服务器错误 |

## RPC / SOAP

### RPC

**RPC(远程过程调用)** 是一个计算机通信协议。像调用本地服务(方法)一样调用服务器的服务(方法)。通常的实现有 XML-RPC、JSON-RPC，通信方式基本相同, 所不同的只是传输数据的格式。

RPC 调用的流程涉及到如下通信细节:

<!-- TODO: -->
<!-- ![RPC](https://i.loli.net/2018/03/01/5a97a9d5e8ec6.png) -->

XML-RPC 只能使用有限的数据类型种类和一些简单的数据结构，之后又有了更加强大的 SOAP , 用于一些比较复杂的系统之上。

### SOAP

**SOAP(简单对象访问协议)** 一种数据交换协议规范，是一种轻量的、简单的、跨语言和跨平台、基于 XML 的协议的规范，用于在 Web Service 中把远程调用和返回封装成机器可读的格式化数据，HTTP 用于实现 SOAP 的 RPC 风格的传输, 而 XML 是它的编码模式。

## GraphQL

### 特性及 GraphiQL

[**GraphQL**](https://graphql.cn) 是一种用于 API 的查询语言，它主要有以下特性:

* 总是返回可预测的结果，不多不少
* 典型的 REST API 请求多个资源时得载入多个 URL，而 GraphQL 可以通过一次请求就获取你应用所需的所有数据
* 使用类型来保证应用只请求可能的数据，还提供了清晰的辅助性错误信息

一个 GraphQL 服务是通过定义类型和类型上的字段来创建的，然后给每个类型上的每个字段提供解析函数。例如，一个 GraphQL 服务告诉我们当前登录用户是 me，这个用户的名称可能像这样:

```JS
type Query {
  me: User
}

type User {
  id: ID
  name: String
}
```

还有每个类型上字段的解析函数:

```JS
function Query_me(request) {
  return request.auth.user;
}

function User_name(user) {
  return user.getName();
}
```

旦一个 GraphQL 服务运行起来，它就能接收 GraphQL 查询，并验证和执行。接收到的查询首先会被检查确保它只引用了已定义的类型和字段，然后运行指定的解析函数来生成结果:

```JS
// 查询
{
  me {
    name
  }
}
```

```JS
// 查询结果
{
  "me": {
    "name": "Luke Skywalker"
  }
}
```

<video src='https://graphql.cn/img/graphiql.mp4?x' controls='controls'></video>

> 性感 GraphiQL 编辑器，[在线操作](https://graphql.org/swapi-graphql) 👈

### graphql.js

#### 基于 express 的配置

GraphQL 已有多种编程语言和框架支持，现在基于 express 来搭建试一试，具体语法可以[参考官方文档](https://graphql.cn/learn/queries/):

```JS
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello Tate!' };

var app = express();
// 通过访问 graphql 路由就可以打开上述的 GraphiQL 编辑页面
app.use('/graphql', graphqlHTTP({
  schema: schema, // A GraphQLSchema instance from GraphQL.js
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
```

> `graphql.js` 的用法[参考官方文档](https://graphql.org/graphql-js/) 👈

我们打开 `localhost:4000/graphql` 后，便可以看到上述的 GraphiQL 编辑页面，此时在控制台模拟下客户端请求代码:

```JS
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: "{ hello }"})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data)); // Hello Tate!
```

#### 基本类型

在绝大部分情况下，我们只用通过 GraphQL schema language 来指定 API 的类型，并作为参数传给 `buildSchema` 函数。目前支持的基本类型有五个 - `String, Int, Float, Boolean, and ID`。需要注意的是，默认情况下，这几种类型都可能返回 null，如果你确定他们是非 null 的话，可以直接在类型后加 "!"，如 `String!`。另外要表示数组的话，可以直接用 `[Int]`表示:

```JS
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
};
```

当然我们也可以自定义对象类型，操作起来与 ts 的接口很相似:

```JS
type RandomDie {
  numSides: Int!
  rollOnce: Int!
  roll(numRolls: Int!): [Int]
}

type Query {
  getDie(numSides: Int): RandomDie
}
```

#### 传递参数

```JS
var schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  rollDice: function ({ numDice, numSides }) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};
```

因此查询的时候一定要带上对应的参数:

```JS
{
  rollDice(numDice: 3, numSides: 6)
}
```

在客户端请求的时候，我们可以通过 "$" 定义 query 的变量，并将变量作为单独映射来传递:

```JS
var dice = 3;
var sides = 6;
var query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { dice, sides },
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```

> 使用 `$dice` 和 `$sides` 作为 GraphQL 中的变量，我们无需在客户端对它们进行转义

#### Mutation / Input Types

假设你有一个 API 入口端点用于修改数据，像是向数据库中插入数据或修改已有数据，在 GraphQL 中，你应该将这个入口端点做为 **Mutation** 而不是 **Query**:

```JS
type Mutation {
  setMessage(message: String): String
}

type Query {
  getMessage: String
}

...
var fakeDatabase = {};
var root = {
  setMessage: function ({message}) {
    fakeDatabase.message = message;
    return message;
  },
  getMessage: function () {
    return fakeDatabase.message;
  }
};
```

但是更多情况下，你会发现有多个不同的变更接受相同的输入参数。常见的案例是在数据库中创建对象和更新对象的接口通常会接受一样的参数。你可以使用“输入类型”来简化 schema，使用 **input** 关键字而不是 **type** 关键字即可:

```JS
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// 如果 Message 拥有复杂字段，我们把它们放在这个对象里面。
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// 映射 username 到 content
var fakeDatabase = {};

var root = {
  getMessage: function ({id}) {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: function ({input}) {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: function ({id, input}) {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
};
```

因此查询的时候如下写，并返回 id 等字段信息:

```JS
mutation {
  createMessage(input: {
    author: "andy",
    content: "hope is a good thing",
  }) {
    id
    author
  }
}
```

同样在客户端，我们可以这么写:

```JS
var author = 'andy';
var content = 'hope is a good thing';
var query = `mutation CreateMessage($input: MessageInput) {
  createMessage(input: $input) {
    id
    author
  }
}`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: {
      input: {
        author,
        content,
      }
    }
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```

## URI / URL

* URI(Uniform Resource Identifier) - 统一资源标志符
* URL(Uniform Resource Locator) - 统一资源定位符
* URN(Uniform Resource Name) - 统一资源名称

## 参考链接

1. [restful-api-design-references](https://github.com/aisuhua/restful-api-design-references) By aisuhua
2. [论文 - Representational State Transfer (REST)](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
3. [REST 入门基础知识](https://qiita.com/TakahiRoyte/items/949f4e88caecb02119aa) By TakahiRoyte
4. [Restful API 的设计规范](https://novoland.github.io/%E8%AE%BE%E8%AE%A1/2015/08/17/Restful%20API%20%E7%9A%84%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83.html) By novoland
5. [知乎 - 怎样用通俗的语言解释 REST，以及 RESTful？](https://www.zhihu.com/question/28557115)
6. [Web 服务编程，REST 与 SOAP](https://www.ibm.com/developerworks/cn/webservices/0907_rest_soap/)
7. [The Difference Between URLs and URIs](https://danielmiessler.com/study/url-uri/) By Daniel Miessler
8. [如何理解 HTTP 协议的 “无连接，无状态” 特点？](http://blog.csdn.net/fengyinchao/article/details/50774738) By fengyinchao
9. [SegmentFault - 什么是 RESTful ？到底 REST 和 SOAP、RPC 有何区别？](https://segmentfault.com/q/1010000003064904)
10. [MSDN - Service Station - More On REST](https://msdn.microsoft.com/en-us/magazine/dd942839.aspx) By Jon Flanders
11. [你应该知道的 RPC 原理](https://www.cnblogs.com/LBSer/p/4853234.html) By zhanlijun
12. [Getting Started With GraphQL.js](https://graphql.org/graphql-js/)

---
layout: blog
front: true
comments: True
flag: Other
background: green
category: 前端
title: TDD 测试驱动开发
date:   2019-01-31 16:23:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/01/31/5c5296c40ec9c.png
tags:
- Other
---
# {{ page.title }}

## 软件测试

**软件测试(software testing)**是描述一种用来促进鉴定软件的正确性、完整性、安全性和质量的过程。

### 流程

#### 单元测试

**单元测试(Unit Testing)**又称为模块测试，是用来对一个模块、一个函数或者一个类来进行正确性检验的测试工作，是编写可以执行最小"单元"代码的测试。比如对函数 abs()，我们可以编写出以下几个**[测试用例](https://zh.wikipedia.org/wiki/测试用例)**:

* 输入正数，比如 1、1.2、0.99，期待返回值与输入相同；
* 输入负数，比如 -1、-1.2、-0.99，期待返回值与输入相反；
* 输入 0，期待返回 0；
* 输入非数值类型，比如 None、[]、{}，期待抛出 TypeError。

把上面的测试用例放到一个测试模块里，就是一个完整的单元测试。若单元测试通过，则表明函数能够正常工作。这种以测试为驱动的开发模式最大的好处就是确保一个程序模块的行为符合我们设计的测试用例。在将来修改的时候，可以极大程度地保证该模块行为仍然是正确的。

#### 系统测试

**系统测试**主要包括功能测试、界面测试、可靠性测试、易用性测试、性能测试。 功能测试主要针对包括功能可用性、功能实现程度(功能流程&业务流程、数据处理&业务数据处理)方面测试。

#### 回归测试

**回归测试**指在软件维护阶段，为了检测代码修改而引入的错误所进行的测试活动。与普通的测试不同，在回归测试过程开始的时候，测试者有一个完整的测试用例集可供使用。

### 方法

#### 黑盒测试

**黑盒测试(black-box testing)**也称**功能测试**或**数据驱动测试**，已知产品的功能设计规格，可以进行测试证明每个实现了的功能是否符合要求。

不考虑程序内部结构和内部特性，而是从用户观点出发，针对程序接口和用户界面进行测试，根据产品应该实现的实际功能和已经定义好的产品规格，来验证产品所应该具有的功能是否实现，是否满足用户的要求。黑盒测试方法适合系统的功能测试、易用性测试，也适合和用户共同进行验收测试、软件确认测试。黑盒测试方法不适合单元测试、集成测试，而且测试结果的覆盖度不容易度量，其测试的潜在风险比较高。

#### 白盒测试

**白盒测试(white-box testing)**也称**结构测试**或**逻辑驱动测试**，已知产品的内部工作过程，可以通过测试证明每种内部操作是否符合设计规格要求，所有内部成分是否已经过检查。

针对性很强，可以对程序每一行语句、每一个条件或分支进行测试，测试效率比较高，而且可以清楚已测试的覆盖程度。如果时间足够多，可以保证所有的语句和条件得到测试，测试的覆盖程度达到很高。白盒测试方法所以适合单元测试、集成测试，而不适合系统测试。白盒测试方法准备的时间很长，如果要覆盖全部程序语句、分支的测试，一般花费比编程更长的时间。

#### 灰盒测试

**灰盒测试**，是介于白盒测试与黑盒测试之间的，灰盒测试关注输出对于输入的正确性，同时也关注内部表现，但这种关注不象白盒那样详细、完整，只是通过一些表征性的现象、事件、标志来判断内部的运行状态。

## TDD

**测试驱动开发**(Test-Driven Development)简称 **TDD**。其理念是，在编写任何代码之前，首先需要先编写一个单元测试，该测试充当代码应该执行的操作的规范，本质上是编写明确规范的实践，它能够在编写代码前自动检查。所以 TDD 颠倒了业务代码和测试代码的顺序。

TDD 的另一个价值在于保持代码精简和简洁。代码维护成本是高昂的。通过使用 TDD，你可以完全确定不会编写任何不必要的代码，因为你只会编写使测试通过的代码。软件开发中有一个称为 **YAGNI(You Aren't Gonna Need It)** 的准则，或许你不需要它了。TDD 避免了 YAGNI。

YAGNI 是一种[极限编程(Extreme programming，即 XP)](https://zh.wikipedia.org/wiki/极限编程)实践，表示程序员不应为目前还不需要的功能编写代码，即只在真正需要某些功能的时候才去实现它，而不是仅仅因为你预见到它将出现。

![TDD](https://i.loli.net/2019/01/31/5c5296c40ec9c.png)

TDD 的工作流总结如下，由于最初单元测试肯定会失败(红色)，因此这个流程被称为 `Red, Green, Refactor`。:

1. 当一个需求来的时候，我们首先要做的就是增加一个测试或者重写当前的相关测试。这个过程中，我们需要非常清楚的了解需求本质，反映在测试用例上，就是测试的输入是什么，得到的输出是什么。而测试数据也需要尽量包括真实数据和边界数据；
2. 运行测试，预期中，这个测试会失败，因为相关功能还没有被我们加在代码中；
3. 编写相关功能的代码，从而让测试通过；
4. 重新运行测试，这时候不仅要看第一步中的测试有没有通过，还需要看以前通过的测试有没有 fail。如果测试失败，那么需要重写编写代码或者更新相关测试；
5. 重构代码，为了让新增的测试通过，不免会堆积代码，所以要时候保持重构，去除代码中的"bad smell"。

## 测试框架

### Jest

**[Jest](https://jestjs.io)** 是 facebook 推的测试框架，这里只是简单介绍一下:

```JS
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

```JS
// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

在 `package.json` 里添加如下命令:

```JSON
{
  "scripts": {
    "test": "jest"
  }
}
```

运行 `yarn test` 或 `npm test` 则会打印如下信息:

```TEXT
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

## Mock

### Mock.js

**Mock** 是单元测试中重要的一环，在许多场景中需要 mock 一些外部依赖。这里介绍一下 [Mock.js](http://mockjs.com) 库，作用即为生成随机数据，拦截 Ajax 请求。[语法规范](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)包括以下两部分:

* **数据模板定义**(Data Temaplte Definition，DTD)
* **数据占位符定义**(Data Placeholder Definition，DPD)

数据模板中的每个属性由 3 部分构成：**属性名**、**生成规则**、**属性值**:

```TEXT
// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value
```

举几个栗子 🌰，更多语法请参考以上[语法规范](https://github.com/nuysoft/Mock/wiki/Syntax-Specification):

```TEXT
// 通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max
'name|min-max': string
// 通过重复 string 生成一个字符串，重复次数等于 count
'name|count': string

// 生成一个大于等于 min、小于等于 max 的整数，属性值 number 只是用来确定类型
'name|min-max': number
// 生成一个浮点数，整数部分大于等于 min、小于等于 max，小数部分保留 dmin 到 dmax 位
'name|min-max.dmin-dmax': number

Mock.mock({
  'number1|1-100.1-10': 1,
  'number2|123.1-10': 1,
  'number3|123.3': 1,
  'number4|123.10': 1.123,
  'regexp1': /[a-z][A-Z][0-9]/,
  'regexp2': /\w\W\s\S\d\D/,
  'regexp3': /\d{5,10}/
})
// =>
{
  "number1": 12.92,
  "number2": 123.51,
  "number3": 123.777,
  "number4": 123.1231091814,
  "regexp1": "pJ7",
  "regexp2": "F)\fp1G",
  "regexp3": "561659409"
}
```

占位符只是在属性值字符串中占个位置，并不出现在最终的属性值中，可以用 `@` 来标识其后的字符串是占位符:

```JS
Mock.mock({
  name: {
    first: '@FIRST',
    middle: '@FIRST',
    last: '@LAST',
    full: '@first @middle @last'
  }
})
// =>
{
  "name": {
    "first": "Charles",
    "middle": "Brenda",
    "last": "Lopez",
    "full": "Charles Brenda Lopez"
  }
}
```

<script async src="//jsfiddle.net/nuysoft/BeENf/6/embed/js,result/"></script>

这里再介绍下 **Mock.Random** 工具类，用于生成各种随机数据:

| Type | Method |
|:--------------|:---------|
| Basic | boolean, natural, integer, float, character, string, range, date, time, datetime, now |
| Image | image, dataImage |
| Color | color |
| Text | paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle |
| Name | first, last, name, cfirst, clast, cname |
| Web | url, domain, email, ip, tld |
| Address | area, region |
| Helper | capitalize, upper, lower, pick, shuffle |
| Miscellaneous | guid, id |

```JS
var Random = Mock.Random
Random.email()
// => "n.clark@miller.io"
Mock.mock('@email')
// => "y.lee@lewis.org"
Mock.mock( { email: '@email' } )
// => { email: "v.lewis@hall.gov" }
```

还可以为 Mock.Random 扩展方法，然后在数据模板中通过 @扩展方法 引用:

```JS
Random.extend({
  constellation: function(date) {
    var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
    return this.pick(constellations)
  }
})
Random.constellation()
// => "水瓶座"
Mock.mock('@CONSTELLATION')
// => "天蝎座"
Mock.mock({
  constellation: '@CONSTELLATION'
})
// => { constellation: "射手座" }
```

## 参考链接

1. [单元测试](https://www.liaoxuefeng.com/wiki/001374738125095c955c1e6d8bb493182103fac9270762a000/00140137128705556022982cfd844b38d050add8565dcb9000) By 廖雪峰
2. [单元测试和测试驱动开发 TDD 是怎么回事 - 译文](https://www.oschina.net/translate/tdd-unit-testing?lang=chs&p=2) By 班纳睿
3. [What is TDD? What is Unit Testing?](https://simpleprogrammer.com/tdd-unit-testing/) By John Sonmez
4. [TDD 及单元测试最佳实践](https://juejin.im/post/5c2ecf28e51d4552090d7d72) By JavaDog
5. [【软件测试】白盒测试方法与黑盒测试方法的区别](https://blog.csdn.net/qq_33642117/article/details/54571302) By 飘走的我
6. [如何使用 Jest 测试 React 组件 - 译文](https://www.oschina.net/translate/test-react-components-jest) By oschina

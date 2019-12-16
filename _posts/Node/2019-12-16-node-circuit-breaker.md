---
layout: blog
front: true
comments: True
flag: Express
background: gray
category: 后端
title: Node 熔断与容灾
date: 2019-12-16 15:51:00 GMT+0800 (CST)
background-image: https://martinfowler.com/bliki/images/circuitBreaker/sketch.png
tags:
- Node
---
# {{ page.title }}

## 熔断

**熔断(Circuit Breaker)**直译过来就是断路开关的意思，这是一种代码模式 (pattern)。电路我们都知道，开关闭合，电路通；开关打开，电路断；其实对应我们业务代码简单来讲的话，就是正常情况下每个用户请求过来时，我们正常调用提供服务的接口获取数据（开关闭合），业务正常跑。但是当调用的接口持续出现问题，比如超时或者报错，这时候作为调用方发现了这种情况的出现，应该不再继续去调出错的接口（开关打开）。这样接口（服务）提供方有机会能恢复自身的服务。当然这里说的不再继续调用并不是永远不再调用，而是一段时间内，比如 30s，过了 30s 后会再次尝试调用服务，如果这时候发现服务正常，则我们的接口调用逻辑也恢复。如果失败，那么 30s 后再次尝试，依次类推。

## 容灾

顾名思义。细想我们刚刚说的熔断里的“开关打开”的情况，当开关打开时，一段时间内我们是不去调用服务的，那么这时候对于用户来的请求该怎么办？最简单的办法就是直接返回一些错误提示，比如 `service unavailable` 等等。不过我们还有更好的处理方式：当“开关闭合”业务正常跑时，接口是能返回正确的数据的，这时我们可以有选择性的把之前返回的正确数据放入缓存中，如果接口出现问题”开关打开“，我们可以把缓存中的这些数据拿出来返回给用户而不是返回“服务不可用”这样的提示，这就叫容灾。之所以说是有选择性，是因为有些接口的数据可能因人而异，比如每个用户访问都会得到不同于其他人的结果（比如精准投放或者用户推荐），我们只能抽样选择部分接口的数据存入缓存，等接口出问题时再把这些数据返回给所有用户，这时提供的服务是有损的，不过对于容灾来讲已经足够了，至少用户能看到有意义的数据。

## opossum

### 三种状态

[**opossum**](https://github.com/nodeshift/opossum) 是一个基于 Node 的熔断和容灾处理库，举个例子:

```JS
const CircuitBreaker = require('opossum')

function asyncFunctionThatCouldFail (x, y) {
  return new Promise((resolve, reject) => {
    // Do something, maybe on the network or a disk
  })
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
}
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options)

breaker.fire(params)
  .then(console.log)
  .catch(console.error)
```

我们还可以利用回调做一些容灾的工作:

```JS
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options)
// if asyncFunctionThatCouldFail starts to fail, firing the breaker
// will trigger our fallback function
breaker.fallback(() => 'Sorry, out of service right now')
breaker.on('fallback', (result) => reportFallbackEvent(result))
```

![circuit breaker](https://martinfowler.com/bliki/images/circuitBreaker/sketch.png)

熔断触发后，`circuit breaker` 状态置为 **open**，open 状态下所有的请求会直接失败或者根据缓存的设定返回容灾数据。当我们设置的 `options.resetTimeout` 失效后，比如这里过 30s 后， `circuit breaker` 状态置为 **half open**，请求会再次到 api 服务，如果返回成功，则状态置为 **closed**，业务正常；如果返回失败，则重新进入 open 状态，且 30s 后重试，如此循环，即 **circuit trip**。

> When a fallback function is triggered, it's considered a failure, and the fallback function will continue to be executed until the breaker is closed.

![state switch](https://martinfowler.com/bliki/images/circuitBreaker/state.png)

### 事件监听

除了上述的 fallback，我们还可以针对其他一些事件进行监听:

* fire - emitted when the breaker is fired.
* reject - emitted when the breaker is open (or halfOpen).
* timeout - emitted when the breaker action times out.
* success - emitted when the breaker action completes successfully
* failure - emitted when the breaker action fails, called with the error
* open - emitted when the breaker state changes to open
* close - emitted when the breaker state changes to closed
* halfOpen - emitted when the breaker state changes to halfOpen
* fallback - emitted when the breaker has a fallback function and executes it
* semaphoreLocked - emitted when the breaker is at capacity and cannot execute the request
* healthCheckFailed - emitted when a user-supplied health check function returns a rejected promise

```JS
circuit.on('open',
  () => $(element).append(
    makeNode(`OPEN: The breaker for ${route} just opened.`)))

circuit.on('halfOpen',
  () => $(element).append(
    makeNode(`HALF_OPEN: The breaker for ${route} is half open.`)))

circuit.on('close',
  () => $(element).append(
    makeNode(`CLOSE: The breaker for ${route} has closed. Service OK.`)))
```

```TEXT
Circuit breakers are a valuable place for monitoring. Any change in breaker state should be logged and breakers should reveal details of their state for deeper monitoring. Breaker behavior is often a good source of warnings about deeper troubles in the environment. Operations staff should be able to trip or reset breakers.
```

## 参考链接

1. [CircuitBreaker](https://martinfowler.com/bliki/CircuitBreaker.html) By Martin Fowler

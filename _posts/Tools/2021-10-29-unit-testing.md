---
layout: blog
front: true
comments: True
background: green
category: 前端
title: 记一些单元测试
date: 2021-10-29 14:50:00 GMT+0800 (CST)
update: 2021-11-12 17:50:00 GMT+0800 (CST)
description: add jest.useFakeTimers() with default sinon timer fakers
background-image: /style/images/js.png
---

# {{ page.title }}

## 常用的单元测试仓库

* [**jest**](https://github.com/facebook/jest) - Delightful JavaScript Testing.
* [**ts-jest**](https://github.com/kulshekhar/ts-jest) - Jest to test projects written in TypeScript.
* [**tsd**](https://github.com/SamVerschueren/tsd) - Check TypeScript type definitions.
* [**@testing-library/react**](https://testing-library.com/docs/react-testing-library/intro/) - Test React UI components.
* [**@testing-library/react-hooks**](https://testing-library.com/docs/react-testing-library/intro/) - Simple and complete React hooks testing utilities.
* [**testing-library/jest-dom**](https://github.com/testing-library/jest-dom) - Custom jest matchers to test the state of the DOM.

## When testing, code that causes React state updates should be wrapped into act(...)

该问题产生的背景是我们在对 React 组件做单元测试时，需要将 render 以及更新操作包裹在 act 方法中，可以参考官方文档:

```js
// With react-dom/test-utils
it("should render and update a counter", () => {
  // Render a component
  act(() => {
    ReactDOM.render(<Counter />, container)
  })
  ...  

  // Fire event to trigger component update
  act(() => 
    button.dispatchEvent(new MouseEvent('click', {bubbles: true})) 
  })
  ...
})
```

而对于 React testing library 库，API 是已经集成了 act 方法，比如在使用 render、fireEvent 时，不需要重新再包裹 act 方法了:

```js
// With react-testing-library
it("should render and update a counter", () => {
  // Render a component
  const { getByText } = render(<Counter />
  ...  

  // Fire event to trigger component update
  fireEvent.click(getByText("Save"))
  ...
})
```

如果还是碰到上述问题，可以从以下几个方面来排查：

### 异步数据更新

```jsx
const MyComponent = () => {
  const [person, setPerson] = React.useState()

  const handleFetch = React.useCallback(async () => {
    const { data } = await fetchData()
    setPerson(data.person) // <- Asynchronous update
  }, [])

  return (
    <button type="button" onClick="handleFetch">
      {person ? person.name : "Fetch"}
    </button>
  )
}
```

假如单元测试如下，还是会报上述问题。原因是 fireEvent.click 触发了 fetchData 异步方法, 当有数据返回时, setPerson 才会被调用，而此时数据更新已经处于 React’s call stack 之外了。

```js
// With react-testing-library
it("should render and update a counter", () => {
  // Render a component
  const { getByText } = render(<Counter />
  ...  

  // Fire event to trigger component update
  fireEvent.click(getByText("Save"))
  ...
})
```

正确的做法是使用 **waitFor**:

```js
it("should fetch person name", async () => {
  const { getByText } = render(<MyComponent />)
  fireEvent.click(getByText("Fetch"))

  await waitFor(() => {
    expect(getByText("David")).toBeInTheDocument()
  })
})
```

### setTimeout or setInterval

```jsx
const Toast = () => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => { setIsVisible(false)}, 1000)
  }, [])

  return isVisible ? <div>Toast!</div> : null
}
```

一般处理这种问题需要用到 **Timer Mocks**:

```js
it("should display Toast in 1 sec", () => {
  jest.useFakeTimers()
  const { queryByText } = render(<MyComponent />)
  jest.advanceTimersByTime(1000)

  expect(queryByText("Toast!")).not.toBeInTheDocument()
})
```

但是单元测试并不知道在 setTimeout 里会处理数据更新操作，因此这里需要手动再包裹 act 方法来提示需要更新:

```js
it("should display Toast in 1 sec", () => {
  jest.useFakeTimers()
  const { queryByText } = render(<MyComponent />)

  act(() => {
    jest.advanceTimersByTime(1000)
  })
  
  expect(queryByText("Toast!")).not.toBeInTheDocument()
})
```

## getByText or queryByText

两者的相同点是都会返回所匹配的节点，区别为无法匹配时，getByText 会返回 error 错误信息，而 queryByText 则会返回 null，更方便用来判断元素是否存在。其他 API 同理。

## jest.useFakeTimers()

原生计时器函数（即 setTimeout、setInterval、clearTimeout、clearInterval）对于测试来说比较困难，因为它们依赖于真实流逝的时间。Jest 可以将计时器替换为允许控制时间流逝的功能，从而来让测试顺利进行。

需要注意的是，不管是运行 `jest.useFakeTimers()` 还是 `jest.useRealTimers()`，它都是**全局生效**的，会影响到同一个文件中其他测试，此外还需要在 `beforeEach` 中去调用该方法重制内部计数器。如果不想所有测试都用到 fake timers，那就要手动去清除定时器，以防造成内存泄漏：

```js
// timerGame.js
function timerGame(callback) {
  console.log('Ready....go!')
  setTimeout(() => {
    console.log("Time's up -- stop!")
    callback && callback()
  }, 1000)
}

module.exports = timerGame
```

```js
jest.useFakeTimers()

it('calls the callback after 1 second via advanceTimersByTime', () => {
  const timerGame = require('../timerGame')
  const callback = jest.fn()

  timerGame(callback)

  // At this point in time, the callback should not have been called yet
  expect(callback).not.toBeCalled()

  // Fast-forward until all timers have been executed
  jest.advanceTimersByTime(1000)

  // Now our callback should have been called!
  expect(callback).toBeCalled()
  expect(callback).toHaveBeenCalledTimes(1)
})
```

> 在测试中可以通过 `jest.clearAllTimers()` 清除所有挂起的计时器

需要注意的是，在 Jest 27 版本之后，支持传入 `modern/legacy` 参数，默认的 modern 会采用 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers) 来代替自身的 time fakers：

```js
jest.useFakeTimers('legacy')
```

## 一些调试的技巧

### screen.debug()

具体参考 screen api，方便打印 dom 树进行分析:

```js
import {screen} from '@testing-library/dom'

document.body.innerHTML = `
  <button>test</button>
  <span>multi-test</span>
  <div>multi-test</div>
`

// debug document
screen.debug()
// debug single element
screen.debug(screen.getByText('test'))
// debug multiple elements
screen.debug(screen.getAllByText('multi-test'))
```

### vscode launch.json 配置

分为 Debug Single Jest Tests 和 Debug All Jest Tests，可以给单元测试打断点:

```json
{
  "configurations": [
  {
    "type": "node",
    "name": "Debug All Jest Tests",
    "request": "launch",
    "program": "${workspaceFolder}/node_modules/jest/bin/jest",
    "args": [
      "--runInBand",
      "--watchAll=false"
    ],
    "cwd": "${workspaceFolder}",
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen",
    "disableOptimisticBPs": true,
    "windows": {
      "program": "${workspaceFolder}/node_modules/jest/bin/jest"
    }
  },
  {
    "name": "Debug Single Jest Tests",
    "type": "node",
    "request": "launch",
    "runtimeArgs": ["--inspect-brk", "${workspaceRoot}/node_modules/jest/bin/jest", "--runInBand"],
    "args": ["--env=jsdom", "${fileBasename}"],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen"
  }
  ]
}
```

### jest.spyOn()

在编写单元测试时，可能有一些操作或者信息打印是无关紧要或者预料之内的，我们可以使用 **spyOn** 方法来隐式输出:

```js
let spiedConsole

beforeEach(() => {
  spiedConsole = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  spiedConsole.mockRestore()
})
```

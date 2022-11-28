---
layout: blog
front: true
comments: True
flag: react
background: green
category: 前端
title:  pose 迁移至 motion
date:   2020-09-04 22:44:00 GMT+0800 (CST)
background-image: /style/images/smms/react.webp
tags:
- React
---
# {{ page.title }}

## Framer Motion

之前 React 项目引入的动画库为 [**POSE**](https://popmotion.io/pose/)，现在该仓库已经废弃，所以需要迁移到 [**Framer Motion**](https://www.framer.com/api/motion/)。这里主要介绍下 motion 库以及迁移过程中的一些问题，虽然官网也有一些介绍，但是这里根据我自己的思路再整理一遍:

## motion 组件

每个 HTML 和 SVG 元素都有对应的一个 motion 组件，例如 `motion.div`，`motion.circle` 等:

1. 采用申明式或命令式地处理组件动画 - Declaratively or imperatively animate components
2. 可以添加各种手势，比如拖动、点击和悬停等。动画可以响应各种手势
3. 通过 variants 对整个 React tree 进行深度动画处理

```JS
import { motion } from "framer-motion"

export const MyComponent = () => (
  <motion.div
    animate={\{ rotate: 360 \}}
    transition={\{ duration: 2 \}}
  />
)
```

### animate / variants

Framer Motion 的动画就是通过 motion 组件的 **animate** 属性来控制的。当组件加载完成后，如果 animate 与 **style** 或 **initial** 中的值不同，就会自动开启动画。也可以将 initial 设置为 false 来禁用初始动画，比如实现一个轮播动画，初始进来的时候并不需要轮播效果。我们可以透过 **variants** 属性来以申明式的方式编排这些动画:

```JS
const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

<motion.div
  initial="hidden"
  animate="visible"
  variants={variants}
/>
```

#### transition - when / staggerChildren

`variants` 中的变化还可以传递到子组件中，最常用的就是列表类的动画。一般情况下动画都是同步执行，我们可以通过 **transition** 下的属性 `when, delayChildren, staggerChildren` 来控制子组件动画的执行:

```JS
const list = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
}

const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 },
}

return (
  <motion.ul
    initial="hidden"
    animate="visible"
    variants={list}
  >
    <motion.li variants={item} />
    <motion.li variants={item} />
    <motion.li variants={item} />
  </motion.ul>
)
```

transition 的动画类型默认有三种，分别是 `spring, tween, inertia`。当使用关键帧 keyframes 动画，使用 `times` 属性可以决定每一帧的动画:

```JS
const animate = { scale: [0, 1, 0.5, 1] }
const transition = { times: [0, 0.1, 0.9, 1] }
<motion.div
  animate={animate}
  transition={transition}
/>
```

#### custom - Dynamic Variants

`variants` 的子项还可以定义为函数并支持动态传参，入参对应组件的 **custom** 属性:

```JS
const variants = {
  visible: i => ({
    opacity: 1,
    transition: {
      delay: i * 0.3,
    },
  }),
  hidden: { opacity: 0 },
}

return items.map((item, i) => (
  <motion.li
    custom={i}
    animate="visible"
    variants={variants}
  />
))
```

#### useAnimation - Animation Controls

上述的动画基本是基于 UI 交互的，但是可能有些动画时机会更复杂，因为我们需要一个触发器来控制动画的启动或停止，这就需要 **useAnimation** 钩子:

```JS
/*
* controls.set - Instantly set to a set of properties or a variant.
* controls.start - Starts an animation on all linked components.
* controls.stop - Stops animations on all linked components.
*/
const controls = useAnimation()

useEffect(() => {
  controls.start(i => ({
    opacity: 0,
    x: 100,
    transition: { delay: i * 0.3 },
  }))
  // controls.start("visible")
}, [])

return (
  <ul>
    <motion.li custom={0} animate={controls} />
    <motion.li custom={1} animate={controls} />
  </ul>
)
```

#### Exit - AnimatePresence

`AnimatePresence` 允许组件在 React tree 中卸载时候执行动画:

```JS
const motionProps = {
  variants: {
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        ease: 'easeInOut', // reference for [0.42, 0, 0.58, 1.0]
        duration: 0.5,
        delay: 0.3,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      y: 20,
    },
  },
  exit: 'exit',
  initial: 'exit',
  animate: 'enter',
}

<Route render={({ location, location: { key, pathname } }) => (
  <AnimatePresence>
    <motion.div key={key} {...motionProps}>
      // ...
    </motion.div>
  </AnimatePresence>
)}
/>
```

> 为啥要这么用 `AnimatePresence` 高阶组件呢？是因为 React 现在缺少一些生命周期，比如通知组件何时将要卸载并允许他们将卸载操作推迟到完成某个操作（例如动画）之后，如在路由切换时执行卸载动画

### Gestures

#### whileHover / whileTap

* **whileHover** - 可监听 `onHoverStart`, `onHoverEnd`
* **whileTap** - 可监听 `onTap`, `onTapStart`, `onTapCancel`
* pan - 可监听 `onPan`, `onPanStart`, `onPanCancel`，触发方式为按住一个组件并且拖动至少 3px

```JS
<motion.a
  whileHover={\{ scale: 1.2 }\}
  onHoverStart={e => {}}
  onHoverEnd={e => {}}
/>
```

#### drag

* **drag** - 拖动，可监听 `onDrag`, `onDragStart`, `onDragEnd`，可以设置 `x`, `y` 值来固定拖动方向
  * dragConstraints - 支持 `top, left, right, bottom` 来控制组件拖动的约束范围。也可以通过父组件 `ref` 来约束
  * dragElastic - 决定组件在约束范围外能够拖动的距离，取值为 [0, 1]，默认为 0.5。0 为不能超过约束范围
  * dragMomentum - 当使用 pan 手势滑动结束的时候给组件动量，默认为 true
  * dragTransition - 定义组件拖动的惯性参数，例如 `bounceStiffness`, `bounceDamping`
  * dragPropagation - 允许拖动传递给子组件，默认为 false

```JS
// [参考](https://codesandbox.io/s/framer-motion-drag-with-constraints-pjn6t?fontsize=14&module=/src/Example.tsx&file=/src/Example.tsx:138-477)
const constraintsRef = React.useRef(null)
const dragTransiton = { bounceStiffness: 600, bounceDamping: 10 }

return (
  <>
    <motion.div className="drag-area" ref={constraintsRef} />
    <motion.div
      drag='y'
      dragElastic={1}
      dragMomentum={false}
      dragTransition={dragTransition}
      dragConstraints={constraintsRef}
    />
  </>
)
```

## Layout 动画

### layout

有时候我们修改布局的时候就要触发相关动画，比如列表重排、组件宽度或位置的变化等等。比如下面这个栗子，我们仅仅是更改样式里的 `justify-content`:

```CSS
.switch {
  /* ...other styles */
  justify-content: flex-start;
}

.switch[data-isOn="true"] {
  justify-content: flex-end;
}
```

```JS
const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

export default function App() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => setIsOn(!isOn);

  return (
    // 通过修改属性名来匹配样式
    <div className="switch" data-isOn={isOn} onClick={toggleSwitch}>
      <motion.div className="handle" layout transition={spring} />
    </div>
  );
}
```

<iframe src="https://codesandbox.io/embed/framer-motion-2-layout-animations-kij8p?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Framer Motion 2: Layout animations"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

> 但是需要注意的是，所有 layout 动画均使用 transform 属性执行，从而获得平滑的帧速率。但是有时候这种动画会变形，为了纠正这种变形，还可以为元素的第一个子元素也赋予layout 属性，具体可以[参考这个示例](https://codesandbox.io/s/framer-motion-2-scale-correction-z4tgr?file=/src/App.js) 👈

### layoutId - AnimateSharedLayout

使用 **AnimateSharedLayout** 包裹组件可以使用共享的布局动画，只要他们使用同一个 **layoutId**，当组件添加或删除的时候，就会执行共享动画:

```JS
function List({ items, selectedId }) {
  return (
    <AnimateSharedLayout>
      {items.map(item => (
        <li>
          {item.title}
          {item.id === selectedId && (
            <motion.div layoutId="underline" /> // Shared layout animations
          )}
        </li>
      ))}
    </AnimateSharedLayout>
  )
}
```

<iframe src="https://codesandbox.io/embed/framer-motion-2-animatesharedlayout-animate-between-different-components-dy0bv?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Framer Motion 2:  AnimateSharedLayout animate between different components"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## MotionValue

### useMotionValue

motion 组件可以通过 **MotionValue** 来跟踪组件状态和动画，一般情况下会自动创建，但是有些场景需要你自己去定义这些关系:

```JS
import { motion, useMotionValue, useTransform } from "framer-motion"

const x = useMotionValue(0)
const input = [-200, 0, 200]
const output = [0, 1, 0]
// 根据拖动的距离 x 来改变 opacity 透明度的值
// 当 x 在 input 范围内时，map 到 output 中对应的值。即 x 拖动到 -200 时对应的时 output 的 0，同理 0 对应 1，200 对应 0
const opacity = useTransform(x, input, output)

return <motion.div drag="x" style={\{ x, opacity }\} />
```

### useTransform

**useTransform** 可以控制不同 MotionValue 之间的转换，有两种使用方式，一种如上，可以映射到对应的 MotionValue，最终值可以是数字、颜色、阴影等。另一种如下:

```JS
// useTransform(input, transformer): MotionValue<O>
const x = useMotionValue(10)
const y = useTransform(x, value => value * 2)

return <motion.div style={\{ x, y }\} />

// 还可以传递一个 MotionValue 数组来进行合并
const x = useMotionValue(0)
const y = useMotionValue(0)
const z = useTransform([x, y], [latestX, latestY] => latestX * latestY)

return <motion.div style={\{ x, y, z }\} />
```

### useViewportScroll

**useViewportScroll** 可以根据视口的滚动来更新 MotionValue，从而可以实现一些有趣的滚动动画:

```JS
// [参考](https://codesandbox.io/s/c4ww4?module=%2Fsrc%2FExample.tsx)
const { scrollYProgress } = useViewportScroll()
const scale = useTransform(scrollYProgress, [0, 1], [0.2, 2])
const style = { scaleY: scrollYProgress }

return (
  <motion.div style={{ scale }}>
    <motion.div style={style} />
  </motion.div>
)
```

> MotionValue 还有其他钩子，比如 `useMotionTemplate`, `useSpring` 等，详见文档

## Utilities

### Transform

使用上和上述的 `useTransform` 第一种方法类似，也是根据 `inputValue` 的值和 `inputRange` 映射到 `outputRange` 里对应的最终值:

```JS
// transform(inputValue, inputRange, outputRange, options): T
const inputRange = [-100, 0, 100]
const outputRange = ["#ff008c", "#7700ff", "rgb(230, 255, 0)"]
const output = transform(0, inputRange, outputRange)

// Returns "#7700ff"
return <div>{output}</div>
```

当不接收 `inputValue` 时，则返回一个函数，该函数入参就是它:

```JS
// transform(inputRange, outputRange, options): (inputValue: number) => T
const inputRange = [-200, -100, 100, 200]
const outputRange = [0, 1, 1, 0]
const convertRange = transform(inputRange, outputRange)
const output = convertRange(-150)

// Returns 0.5
return <div>{output}</div>
```

<iframe src="https://codesandbox.io/embed/framer-motion-spring-powered-characters-remaining-count-i1wgk?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Framer Motion: Spring-powered characters remaining count"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### useCycle

可以在一堆动画中循环，常用于 toggle 类动画:

```JS
// 每次点击，x 位移会在 0, 50, 100 中变化
const [x, cycleX] = useCycle(0, 50, 100)

return (
  <motion.div
    animate={\{ x }\}
    onTap={() => cycleX()}
  />
)
```

> 还有其他工具钩子比如 `useReducedMotion`, `usePresence` 等，详见官网

> codesandbox 的一些关于 [Framer Motion 的示例](https://codesandbox.io/search?refinementList%5Btemplate%5D=&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=framer-motion&page=1&configure%5BhitsPerPage%5D=12)

## 从 POSE 迁移中的一些问题

### 差异点

其实迁移的话官网已经给出很详细的对比了，[戳这里](https://www.framer.com/api/motion/migrate-from-pose/):

```JS
// Pose
const Posed = posed.div({
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
})

const MyComponent = () => {
  return <Posed initialPose="hidden" pose="visible" />
}

// Motion
const MyComponent = () => {
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    />
  )
}
```

有一点需要特别注意的是，`duration` 和 `delay` 在 POSE 中都是以毫秒表示的，但是 motion 中是以秒表示的:

```JS
// Pose - 毫秒
const duration = 1000

// Motion - 秒
const duration = 1
```

### 减少包大小

在项目中使用 motion 的话，会发现即使压缩后包也很大。这里分享一个方案，[官方也有给出](https://www.framer.com/api/motion/guide-reduce-bundle-size/)，步骤大致分为两步:

1. 引用较小的 m 依赖
2. 根据实际需要支持的 gestures 来通过 **MotionConfig** 定制化

```JS
// 我们可以定义一个组件，返回值如下
import { m as motion, MotionConfig } from "framer-motion"

export function ReduceMotion({ children, ...others }) {
  const features = [/* 我们需要的 gesture */]
  return (
    <MotionConfig features={features}>
      <motion.div {...others}>{children}</motion.div>
    </MotionConfig>
  )
}
```

gestures 有如下几种类型，需要哪些就放到上述 feature 数组中:

* **AnimationFeature** - For animate prop support. This includes variants and animation controls.
* **ExitFeature** - For exit prop support.
* **DragFeature** - For drag prop support.
* **GesturesFeature** - For all gesture callbacks including whileHover and whileTap.
* **AnimateLayoutFeature** - For layout and layoutId prop support.

还支持动态导入:

```JS
// motion-features.js
import { AnimationFeature } from "framer-motion"

export default [AnimationFeature]

// index.js
function App() {
  const [features, setFeatures] = useState([])

  useEffect(() => {
    import("./motion-features").then(res => {
      setFeatures(res.default)
    })
  }, [])

  return (
    <MotionConfig features={features}>
      <Component />
    </MotionConfig>
  )
}
```

---
layout: blog
front: true
comments: True
flag: HTML
background: green
category: 前端
title:  Webpack Bundle Analysis
date:   2020-07-21 12:05:00 GMT+0800 (CST)
background-image: https://miro.medium.com/max/2000/1*5DUZZ6hvP3eJX5BBLT1FxQ.png
tags:
- webpack
---
# {{ page.title }}

很多时候，为了减少压缩包的体积，加快网站的响应速度，我们必须要对这些压缩包进行分析，最大程度上去减少它的体积。现阶段有很多好用的工具，下面整理下:

1. [**webpack-chart**](https://alexkuz.github.io/webpack-chart/) - Interactive pie chart for webpack stats.
1. [**webpack-visualizer**](https://chrisbateman.github.io/webpack-visualizer/) - Visualize and analyze your bundles to see which modules are taking up space and which might be duplicates.
1. **webpack-bundle-analyzer** - A plugin and CLI utility that represents bundle content as a convenient interactive zoomable treemap.
1. [webpack bundle optimize helper](https://webpack.jakoblind.no/optimize/) - This tool will analyze your bundle and give you actionable suggestions on what to improve to reduce your bundle size.
1. [bundle-stats](https://github.com/relative-ci/bundle-stats) - Generate a bundle report(bundle size, assets, modules) and compare the results between different builds.

## webpack-bundle-analyzer

[**webpack-bundle-analyzer**](https://github.com/webpack-contrib/webpack-bundle-analyzer) 是一款打包文件体积可视化且可交互的 webpack 插件，可以帮助我们针对体积较大的压缩文件进行优化操作。首先看下怎么配置:

1、安装

```SHELL
ya -D webpack-bundle-analyzer
```

2、在 `webpack.config.js`(或其他文件，只是举例) 中配置

```JS
// 1、导入
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// ...
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
    // 默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
  ]
}
```

3、在 `package.json` 的脚本中插入命令

```JSON
{
  "scripts": {
    "analyse": "NODE_ENV=production npm_config_report=true npm run build"
  }
}
```

4、直接运行 `npm run analyse`，自动会在窗口打开 `http://127.0.0.1:8888` 访问分析结果:

![webpack-bundle-analyzer](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)

## 减少 lodash 体积

我们以 lodash 为示例，如果我们采用下面这种导入方式，则会引入 lodash 整个文件，这显示是不合理的:

```JS
import { set } from 'lodash'
```

![lodash1]( {{site.url}}/style/images/smms/webpack-bundle-analyzer-lodash-1.png )

### 单独引入

我们可以看到不压缩的情况下有 528.6kb，一般情况下怎么解决呢，引入的时候需要这么做:

```JS
import set from 'lodash/set'
```

![lodash2]( {{site.url}}/style/images/smms/webpack-bundle-analyzer-lodash-2.png )

我们再来对比下体积大小，一目了然，直接缩小到了 7.99kb，因为我们只引用了 set 这一个方法。但是这样做有个不方便的地方，就是如果引入很多个方法的时候，每个都要单独去导入，有没有什么方法可以两全其美呢？那就可以用这次要介绍的这个插件。 👇

### lodash-webpack-plugin

1、安装

```SHELL
npm i --save-dev lodash-webpack-plugin babel-core babel-loader babel-plugin-lodash babel-preset-env webpack
```

2、在 `webpack.config.js`(或其他文件，只是举例) 中配置

```JS
// 1、导入
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
// ...
module.exports = {
  'module': {
    'rules': [{
      'use': 'babel-loader',
      'test': /\.js$/,
      'exclude': /node_modules/,
      'options': {
        'plugins': ['lodash'], // 2、插件
        'presets': [['env', { 'modules': false, 'targets': { 'node': 4 } }]]
      }
    }]
  },
  'plugins': [
    new LodashModuleReplacementPlugin() // 3、插件
  ]
}
```

OK，我们接下来修改为最开始的导入方式，即 `import { set } from 'lodash'`，可以看到体积也减小到了 7.99kb，和单独引入一样。

### lodash-es

webpack 有好用的 **tree-shaking**，但是要使用它必然要保证引用的模块都是 ES6 规范的。**lodash-es** 则是具备 ES6 模块化的版本，只需要直接引入就可以。这也是官方推荐的一种减小压缩包体积的方式:

```JS
import { isEmpty, isObject, cloneDeep } from 'lodash-es'
```

![lodash3]( {{site.url}}/style/images/smms/webpack-bundle-analyzer-lodash-3.png )

## 代码分离 Code Splitting

## 动态导入 Dynamic Imports

### react - react-loadable

通过按需加载，动态导入，可以减少单个包的体积，比如 react 可以使用 **react-loadable**，这个之前已经介绍过了:

```JSX
import Loadable from 'react-loadable'
import Loading from './Loading'

const components = {
  ListComponent: Loadable({
    loader: () => import('../list/ListComponent'),
    loading: Loading,
  }),
  LayoutComponent: Loadable({
    loader: () => import('../layout/LayoutComponent'),
    loading: Loading,
  }),
}

export default components
```

### vue - magic comments

那么 vue 怎么实现的呢？官方给了一段异步组件的代码:

```JS
const AsyncComponent = () => ({
  // The component to load (should be a Promise)
  component: import('./MyComponent.vue'),
  // A component to use while the async component is loading
  loading: LoadingComponent,
  // A component to use if the load fails
  error: ErrorComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

接下来我们创建一个 `loadable.js` 的高阶组件，利用 render 函数生成组件并返回即可:

```JS
import LoadingComponent from './loading.vue'

export default (component) => {
  const asyncComponent = () => ({
    component: component(),
    loading: LoadingComponent,
    delay: 200,
    timeout: 3000
  })
  return {
    render(h) {
      return h(asyncComponent, {});
    }
  }
}
```

在路由(Vue Router 2.4.0+)中使用该组件:

```JS

import loadable from './loadable'

const routes = [{
  path: '/about',
  name: 'about',
  // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  component: loadable( () => import(/* webpackChunkName: "about" */ './views/About.vue')
}]
```

上面的内联注释，即 [**magic comments**](https://webpack.js.org/api/module-methods/#magic-comments)，可以进行诸如给 chunk 命名或选择不同模式的操作:

```JS
// Single target
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackExports: ["default", "named"] */
  'module'
);

// Multiple possible targets
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  `./locale/${language}`
);

// webpackIgnore：设置为 true 时，禁用动态导入解析，不进行代码分割
import(/* webpackIgnore: true */ 'ignored-module.js');
```

## Tree Shaking

> to be continued

---
layout: blog
tool: true
comments: True
flag: NPM
background: green
category: 前端
title: NPM Scripts
date:   2018-06-27 17:57:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/06/27/5b3360100dcd3.png

tags:
- NPM
---
# {{ page.title }}

## NPM Scripts

### package.json

**package.json** 文件定义了项目所需要的依赖模块和配置信息。可以通过<code>npm init</code>命令来创建 package.json 文件，使用参数 **-f** 可跳过此问答环节:

```SHELL
npm init

# 跳过问答环节，快速创建
npm init -f
```

当然也可以在初始化前通过<code>npm config set</code>命令去修改默认配置，之后通过初始化时都会套用此配置项:

```SHELL
npm config set init.author.name "tate"
npm config set init.author.email "smd.tate@gmail.com"
npm config set init.license "MIT"
```

创建的 package.json 文件大致如下:

```JSON
{
  "name": "npm_scripts",
  "version": "1.0.0",
  "description": "tate",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "tate <smd.tate@gmail.com>",
  "license": "MIT"
}
```

### 脚本命令 scripts

package.json 文件里的 scripts 属性下可以自定义执行命令，可以通过命令<code>npm run</code>进行查看:

```JSON
"scripts": {
  "call:tate": "echo tate",
  "call:snow": "echo snow",
}
```

可以通过符号 **&&** 和 **&** 实现串行和并行脚本:

```JSON
// 串行脚本 &&
"test": "npm run call:tate && npm run call:snow && ..."

// 并行脚本 &
"test": "npm run call:tate & npm run call:snow & ..."
```

运行的脚本比较多的话可以采用 **[npm-run-all](https://www.npmjs.com/package/npm-run-all)** 实现更轻量和简洁的多命令运行:

```JSON
// 串行脚本
"test": "npm-run-all call:tate call:snow ..."
// 优化
"test": "npm-run-all call:*"

// 并行脚本 --parallel
"test": "npm-run-all call:* --parallel"
```

### 传递参数 --

"**--**" 分隔符用来给实际运行的指令传递额外的参数，举个栗子 🌰:

```JSON
// 假设要传入一个 watch 参数
"call:tate": "echo tate",
"call:tate:watch": "echo tate --watch",

// 优化。通过 -- 分隔符传参数
// 实际执行的即是 echo tate --watch
"call:tate:watch": "npm run call:tate -- --watch",
```

### 钩子 hooks

内置的钩子可分为 **pre** 和 **post** 钩子脚本，如下:

```JSON
"test": "echo tate",
"pretest": "echo pre-tate",
"posttest": "echo post-tate"
```

当执行命令<code>npm test</code>时，实际执行了 "pretest ==> test ==> posttest"。自定义命令也适用。配合 git hooks 可以在提交代码前后进行一些校验输出，这里推荐使用 [husky](https://www.npmjs.com/package/husky)。

```JSON
"precommit": "npm test",
"prepush": "npm test"
```

在执行<code>git commit</code>命令时，precommit 钩子会自动生效。

### 变量 $npm_package

通过命令<code>npm run env</code>即可查看所有变量列表:

```SHELL
npm run env | grep npm_package | sort
```

要想在 scripts 内使用变量，不同环境下有两种访问方式，比如访问项目名称 name:

```JSON
// The following only works on Mac OS X/Linux (bash)
"bash-script": "echo Hello $npm_package_name",
// The following only works on a Windows machine
"win-script": "echo Hello %npm_package_name%"
```

跨平台使用的话可以使用 [cross-var](https://www.npmjs.com/package/cross-var) 或更轻量的 cross-var-no-babel:

```JSON
// 单命令写法
"script": "cross-var echo Hello $npm_package_name"
// 多命令写法
"build:css": "cross-var \"node-sass src/index.scss | postcss -c .postcssrc.json | cssmin > public/$npm_package_version/index.min.css\"",
```

### 跨平台兼容

除了上述的变量，还有文件系统的操作也需要考虑跨平台兼容，比如:

* rimraf 或 del-cli: 用来删除文件和目录，实现类似于 <code>rm -rf</code> 的功能；
* cpr: 用于拷贝、复制文件和目录，实现类似于 <code>cp -r</code> 的功能；
* make-dir-cli: 用于创建目录，实现类似于 <code>mkdir -p</code> 的功能

```JSON
"cover:cleanup": "rm -rf coverage && rm -rf .nyc_output",
// 跨平台转换
"cover:cleanup": "rimraf coverage && rimraf .nyc_output"
```

设置环境变量时可以采用 [cross-env](https://www.npmjs.com/package/cross-env):

```JSON
"test": "NODE_ENV=test mocha tests/",
// 跨平台转换
"test": "cross-env NODE_ENV=test mocha tests/",
```

## scripty

当脚本命令比较多的时候，可以通过[scripty](https://github.com/testdouble/scripty)可以从将 scripts 剥离到单独文件中管理，还是看最初的栗子:

```SHELL
"call:tate": "echo tate",
"call:snow": "echo snow",
```

对应根目录下创建脚本文件，注意在执行脚本时必须拥有可执行权限:

```SHELL
touch scripts/call/tate.sh # 内容为 echo 'tate in scripty'
touch scripts/call/snow.sh

# 添加可执行权限
chmod -R a+x scripts/**/*.sh
```

然后将 scripts 做修改:

```SHELL
"call:tate": "scripty",
"call:snow": "scripty",
```

执行命令<code>npm run call:tate</code>后，会打印如下信息:

```SHELL
> npm_scripts@1.0.0 call:tate /Users/tate/Desktop/lazyload-test
> scripty

Executing "/Users/tate/Desktop/lazyload-test/scripts/call/tate.sh":

> echo 'tate in scripty'
```

> 当然也可以直接通过 node 来管理，将 shell 脚本改为 node 脚本并执行，[shelljs](https://www.npmjs.com/package/shelljs)可以在 node 中使用 shell 命令。

## 构建流水线

由于目前没有实战，关于如何构建流水线可直接[参考小册这里](https://juejin.im/book/5a1212bc51882531ea64df07/section/5a1214e3f265da432b4a6ad2)。

## yarn & npm

**包管理器**: 代码通过包(package)或者称为模块(module)的方式来共享。一个包里包含所有需要共享的代码，以及描述包信息的文件，称为 package.json。和 NPM 5 的 <code>package-lock.json</code>类似，通过<code>yarn.lock</code>记录每一个依赖项的确切版本信息。

| npm 命令 | yarn 命令 | 功能描述 |
|:--------------|:---------|:---------|
| npm i | yarn (install) | 根据 package.json 安装所有依赖 |
| npm i (--save/-S) [package] | yarn add [package] | 添加依赖包至 dependencies |
| npm i [--save-dev/-D] [package] | yarn add [--dev/-D] [package] | 添加依赖包至 devDependencies |
| npm i [--global/-g] | yarn global add | 全局安装依赖包 |
| npm uninstall [package] | yarn remove [package] | 移除依赖包 |
| npm update | yarn upgrade | 升级依赖包 |
| npm init | yarn init | 互动式创建 package.json 文件 |
| npm run | yarn run | 运行 package.json 中预定义的脚本 |

yarn 在 mac 的两种安装方式:

```SHELL
# 通过 npm 安装
npm install --global yarn

# 通过 homebrew 安装
brew install yarn
```

更新方式:

```SHELL
# 通过 Homebrew 更新
brew upgrade yarn

# 通过 yarn 更新
yarn global add yarn
```

## 参考链接

1. [掘金小册 - 用 npm script 打造超溜的前端工作流](https://juejin.im/book/5a1212bc51882531ea64df07/section/5a1212bcf265da431c6fe677) By 王仕军
2. [npm scripts 使用指南](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html) By 阮一峰
3. [使用 npm scripts 构建项目](http://www.qcyoung.com/2016/02/28/%E4%BD%BF%E7%94%A8npm%20scripts%E6%9E%84%E5%BB%BA%E9%A1%B9%E7%9B%AE/#bei-jing) By 青春样
4. [yarn 官网](https://yarnpkg.com/zh-Hans/docs)
5. [Npm vs Yarn 之备忘详单](https://jeffjade.com/2017/12/30/135-npm-vs-yarn-detial-memo/) By 晚晴幽草轩轩主
6. [npm5 新版功能特性解析及与 yarn 评测对比](https://cloud.tencent.com/developer/article/1020507) By 马铖

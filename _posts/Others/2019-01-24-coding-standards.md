---
layout: blog
front: true
comments: True
flag: Other
background: green
category: 前端
title: 记各种代码规范实践
date:   2019-01-25 20:41:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/01/28/5c4ea7dbcf6f9.png
tags:
- Other
---
# {{ page.title }}

## ESLint

这里主要介绍 [airbnb-eslint](https://github.com/airbnb/javascript) 代码规范，支持 ES6 和 React 等，举个简单的 destructuring 栗子:

```JS
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

针对 React 项目，安装方式:

```SHELL
npm install --save-dev eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y eslint babel-eslint
```

在 `webpack` 中配置 `eslint-loader` 解析 `.eslintrc` 文件:

```JSON
// First, run the linter.
// It's important to do this before Babel processes the JS.
{
  test: /\.(js|jsx|mjs)$/,
  enforce: 'pre',
  use: [
    {
      options: {
        formatter: eslintFormatter,
        eslintPath: require.resolve('eslint'),
      },
      loader: require.resolve('eslint-loader'),
    },
  ],
  include: paths.appSrc,
},
```

然后配置 `.eslintrc` 文件，或者直接在 `package.json` 文件里的 `eslintConfig` 字段指定配置，ESLint 会查找和自动读取它们。具体字段解析可以直接[参考这里](http://eslint.cn/docs/user-guide/configuring):

```JSON
module.exports = {
  root: true, // 默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。"root": true，它就会停止在父级目录中寻找
  parser: 'babel-eslint', // 默认使用 Espree 作为其解析器
  parserOptions: { // 解析器选项
    'ecmaVersion': 7, // ECMAScript 版本
    'sourceType': 'module', // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    'ecmaFeatures': { // 使用的额外的语言特性
      'jsx': true, // 启用 JSX
    },
  },
  extends: 'airbnb', // 递归地进行扩展配置
  plugins: [ // 使用第三方插件
    'react',
    'import',
  ],
  rules: { // 要改变一个规则设置，你必须将规则 ID 设置为下列值之一 ['off', 'warn', 'error']
    'semi': ['error', 'never'],
    'global-require': 'off',
    'jsx-quotes': ["error", "prefer-single"],
    'prefer-const': 'error', // error 当被触发的时候，程序会退出
    'import/no-unresolved': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/forbid-prop-types': 'off',
    'no-script-url': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'camelcase': 'off', // 后端传的字段都是 camelcase
  },
  env: {
    browser: true, // 浏览器环境中的全局变量
    node: true, // Node.js 全局变量和 Node.js 作用域
    jest: true, // Jest 全局变量，测试框架
  },
}
```

可以通过在项目根目录创建一个 `.eslintignore` 文件告诉 ESLint 去忽略特定的文件和目录，采用 `glob` 模式:

```SHELL
# 除了 .eslintignore 文件中的模式，ESLint 总是忽略 /node_modules/* 和 /bower_components/* 中的文件
scripts/*.js
config/*.js
public/*.js
registerServiceWorker.js
```

推荐的跳过检测的方式除了可以直接在 rules 下进行配置规则外，还可以对区域代码进行注释:

```JS
# eslint 报错: Use array destructuring  prefer-destructuring
brand = brand_role[0]

# 跳过检测的两种方式，不推荐直接用 eslint-disable-line，而是后面跟上对应的一个或多个规则，用逗号隔开
// eslint-disable-next-line prefer-destructuring
brand = brand_role[0] // eslint-disable-line prefer-destructuring, max-len

# 如何想针对整个文件跳过检测规则的话，可以在顶部输入
/* eslint-disable */
```

添加 git 钩子，防止提交有报错的代码:

```JSON
"scripts":{
  "lint": "eslint --ext .js,.jsx src/",
}
"husky": {
  "hooks": {
    "pre-commit": "npm run lint"
  }  
}
```

## EditorConfig

[**EditorConfig**](https://editorconfig.org/) 也是多人开发常用的一种规范制定工具，配置文件为 `.editorconfig`, 配置规则为:

| 通配符 | 说明 |
|:--------------|:---------|
| * | 匹配除 `/` 之外的任意字符串 |
| ** | 匹配任意字符串 |
| ? | 匹配任意单个字符 |
| [name] | 匹配 `name` 字符 |
| [!name] | 匹配非 `name字` 符 |
| {s1,s3,s3} | 匹配任意给定的字符串 |

举个[配置示例](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties):

```SHELL
# 当打开文件时，该插件会在当前目录及所有父级目录搜索 .editorconfig 配置文件，
# 当搜索到根目录或者检测到 root = true 时，会停止接下来的搜索，然后由外到内读取配置
root = true

[*]
charset = utf-8
end_of_line = lf # 定义换行符，支持 lf、cr 和 crlf
indent_style = space # tab 为 hard-tabs，space 为 soft-tabs
indent_size = 2
insert_final_newline = true # 使文件以一个空白行结尾
trim_trailing_whitespace = true # 除去换行行首的任意空白字符

[*.md]
max_line_length = off # 行最大字符数，超过则自动换行
trim_trailing_whitespace = false

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

## 参考链接

1. [ESLint 官方文档](http://eslint.cn/docs/user-guide/configuring)
2. [全局配置 ESLint 之 React](http://techblog.sishuxuefu.com/atricle.html?5b2603c4ee920a003b731514) By 杨俊宁
3. [EditorConfig](https://editorconfig.org/)
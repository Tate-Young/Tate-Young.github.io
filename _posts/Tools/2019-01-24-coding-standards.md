---
layout: blog
front: true
comments: True
flag: Other
background: green
category: 前端
title: 记各种代码规范实践
date:   2019-01-25 20:41:00 GMT+0800 (CST)
update: 2019-10-15 16:41:00 GMT+0800 (CST)
background-image: /style/images/smms/eslint.png
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
// eslint 报错: Use array destructuring  prefer-destructuring
brand = brand_role[0]

// 跳过检测的两种方式，不推荐直接用 eslint-disable-line，而是后面跟上对应的一个或多个规则，用逗号隔开
// eslint-disable-next-line prefer-destructuring
brand = brand_role[0] // eslint-disable-line prefer-destructuring, max-len

// 如何想针对整个文件跳过检测规则的话，可以在顶部输入
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

## TSLint

> 可以用 [**typescript-eslint**](https://github.com/typescript-eslint/typescript-eslint) 代替 👈

**TSLint** 是 TypeScript 代码风格检查器，它能够在可读性、可维护性、代码正确性等方面为开发者提供帮助。其配置可[参考官方文档](https://palantir.github.io/tslint/usage/configuration/)，配置文件 `tslint.json` 参考:

```JSON
{
  "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
  "linterOptions": {
    "exclude": [
      "config/**/*.js",
      "node_modules/**/*.ts",
      "coverage/lcov-report/*.js"
    ]
  },
  "rules": {
    "semicolon": [true, "never"],
    "quotemark": [true, "single"],
    "trailing-comma": [true, { "multiline": "always", "singleline": "never" }],
    "jsx-no-multiline-js": false,
    "function-name": false,
    "ordered-imports": false,
    "object-literal-sort-keys": false,
    "arrow-parens": [true, "ban-single-arg-parens"],
    "no-empty": [true, "allow-empty-catch"],
    "max-line-length": [true, {"limit": 120, "ignore-pattern": "^import |^export {(.*?)}"}]
  },
}
```

> 当使用 cli 命令行或者相关编辑器插件时，则根据 `tslint.json` 或者 `tslint.yaml` 文件配置来运行对应的规则

当我们需要跳过检测时，用法和上述的 eslint 差不多，只是语法上稍微有点变化:

```JS
// block is empty (no-empty)tslint(1)
const noop = () => {}

// tslint:disable-next-line:no-empty
const noop = () => {} // tslint:disable-line:no-empty

// 如何想针对指定区间跳过检测规则的话，可以输入
/* tslint:disable:max-line-length */
// ... code here
/* tslint:enable:max-line-length */
```

## EditorConfig

[**EditorConfig**](https://editorconfig.org/) 是一套用于统一代码格式的解决方案。EditorConfig 包含一个用于定义代码格式的文件和一些编辑器插件，这些插件可以让编辑器读取配置文件并依此格式化代码。其配置文件为 `.editorconfig`, 配置规则为:

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

## commitlint

**[commitlint](https://github.com/marionebl/commitlint)** 主要用来检测 Git 提交信息是否符合 **[conventional commit format](https://www.conventionalcommits.org/en/v1.0.0-beta.3/)** 规范。常用的书写格式如下:

```TEXT
# scope is optional
type(scope?): subject

// 栗子
chore: run tests on travis ci
feat(blog): add comment section
```

安装方式:

```SHELL
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/{config-conventional,cli}
# For Windows:
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# Configure commitlint to use conventional config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

然后在 `package.json` 中添加 **husky** 的 `commit-msg` 钩子(注意前提是安装了 husky 库):

```JSON
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }  
  }
}
```

scope 可以用其他扩展(如 [commitlint-config-conventional (based on the the Angular convention)](https://github.com/marionebl/commitlint/tree/master/%40commitlint/config-conventional#type-enum))或者自定义。自定义的话需要用到配置文件 `commitlint.config.js`:

```JS
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 100],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新特性
        'fix', // 修复 bug
        'docs', // 文档
        'typo', // 修改简单的文字或变量名
        'style', // 样式
        'refactor', // 重构
        'test', // 测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'dev', // 笼统的新需求修改
      ],
    ],
  },
}
```

## markdownlint

**[markdownlint](https://github.com/DavidAnson/markdownlint)** 是一个针对 markdown 语法的规范，举个栗子:

* MD001 - heading-increment/header-increment - Heading levels should only increment by one level at a time
* MD002 - first-heading-h1/first-header-h1 - First heading should be a top level heading
* MD003 - heading-style/header-style - Heading style

如果用不到哪个规范，也可以单独禁用掉，多个用空格隔开:

* 禁用所有规范: `<!-- markdownlint-disable -->`
* 启用所有规范: `<!-- markdownlint-enable -->`
* 禁用单个或多个规范: `<!-- markdownlint-disable MD001 MD002 -->`
* 启用单个或多个规范: `<!-- markdownlint-enable MD001 MD002 -->`

```HTML
<!-- markdownlint-disable MD037 -->
deliberate space * in * emphasis
<!-- markdownlint-enable MD037 -->
```

## 参考链接

1. [ESLint 官方文档](http://eslint.cn/docs/user-guide/configuring)
2. [全局配置 ESLint 之 React](http://techblog.sishuxuefu.com/atricle.html?5b2603c4ee920a003b731514) By 杨俊宁
3. [EditorConfig 官方文档](https://editorconfig.org/)

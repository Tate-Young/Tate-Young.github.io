# HOW TO USE AND RUN

## bundle install

![Bundler's Purpose and Rationale ](https://bundler.io/v1.7/rationale.html)

## liquid 语法

[语法](https://shopify.github.io/liquid/basics/introduction/)

## 引入本地图片

( {{site.url}}/style/images/xxx.png )

## 引入其他文章

```TEXT
( {{site.url}}/2018/01/30/js-this.html )
```

直接选中文本粘贴，可以直接达成以下效果:

```TEXT
<!-- 原本 -->
测试

<!-- 选中后直接粘贴 -->
[测试](https://xxx.com)
```

## 表格绘制

| 快捷键        |   描述   |
| ------------ | ------- |
| q | 返回 |
| z | 清空 |

## 空行

`&nbsp;`

&nbsp;

## 一些读音纠正

yaml /ˈjæməl/

## yaml 格式

[yaml 在线 demo](http://nodeca.github.io/js-yaml/)

1、数组

```YAML
- Cat
- Dog
- Goldfish
```

## warning

1. commonmarker 安装失败 - 尝试用 rvm 换一个更高的 ruby 版本，比如 `rvm use ruby-2.4.6`

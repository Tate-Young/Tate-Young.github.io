---
layout: blog
tool: true
comments: True
flag: HTML
background: green
category: 前端
title:  Github Pages
date:   2019-10-10 22:13:00 GMT+0800 (CST)
background-image: https://i.loli.net/2019/10/10/9tMd8wKqhTeJujb.png
tags:
- html
---
<!-- markdownlint-disable MD024 -->
# {{ page.title }}

## 什么是 Github Pages

你现在正在浏览的这个网页就是 [**Github Pages**](https://pages.github.com)，创建方法很简单，分以下几步:

1. 前往 Github 创建仓库，命名为 [$username].github.io - create a repository
2. 克隆仓库 - Clone the repository
3. 添加 index.html，输入一些内容
4. 通过 Git 命令 push 到远端
5. 浏览器访问 https://[$username].github.io 即可

需要注意的是，每个 github 账号或组织只能搭建一个站点，但是以上搭建的页面太过简单，如果要使用博客等功能的话，则需要用到其他工具。比如当前网页，它其实是通过 [**Jekyll**](https://jekyllrb.com/docs/) 搭建的。

> 至于详细怎么搭建的后面有空再写，现在只是列一些比较容易忘记的名词

## Jekyll

**Jekyll** 是一个简单的静态站点生成器，它支持 **Markdown**、**liquid 模板**，因此可以将我们编写的 md 文档转化成一个完整的可发布的静态网站。也就是说，你可以使用 GitHub 的服务来搭建你的项目页面、博客或者网站，而且是完全免费的 😀。

Jekyll 本身是由 **Ruby** 语言编写的，因此我们要安装 Ruby 环境，这里我们推荐用 [**rvm**](https://github.com/rvm/rvm) 进行版本管理(类似于 node 版本管理工具 nvm 或 n)，安装和使用方法[直接参考下文](#rvm)，接下来:

```SHELL
# Install Jekyll and bundler gems
gem install jekyll bundler

# Create a new Jekyll site at ./my-awesome-site
jekyll new my-awesome-site

# Change into your new directory
cd my-awesome-site

# Build the site and make it available on a local server
# jekyll serve 动态编译，反之为 jekyll build
bundle install
bundle exec jekyll serve

# Now browse to http://localhost:4000
```

以上我们可能对一些名词比较生疏，下面做一些简单解释:

### Ruby

#### RubyGems / Gem

[**RubyGems**](https://rubygems.org) 是一个 Ruby 包管理器(package manager)，通过它我们可以来找、安装、升级和卸载软件包，即 gem 包。RubyGems 将所有的 gem 包安装到 `/[ruby root]/lib/ruby/gems/[ver]/` 目录下:

```SHELL
# 查看 RubyGems 软件的版本
gem -v

# 更新所有已安装的 gem 包
gem update

# 更新指定的 gem 包
# 注意：gem update [gemname]不会升级旧版本的包，可以使用 gem install [gemname] --version=[ver]代替
$ gem update [gemname]

# 安装指定 gem 包，程序先从本机查找 gem 包并安装，如果本地没有，则从远程 gem 安装。
gem install [gemname]

# 查看本机已安装的所有 gem 包, local gems
gem list

# 列出远程 RubyGems.org 上有此关键字的 gem 包（可用正则表达式）
gem list -r keyword
```

Ruby1.9.1 以后的版本自带 RubyGems，需要升级的话直接输入以下命令即可:

```SHELL
gem update --system
```

#### Bundler

[**bundler**](https://bundler.io/rationale.html) 是用来解决 gem 之间版本依赖问题的，它可以保证在不同环境中运行时，版本保持一致。首先我们要创建一个 `Gemfile` 文件:

```SHELL
# 初始化 Gemfile 文件
Bundle init
```

之后我们需要编辑 Gemfile 文件，指定源和声明一些依赖:

```SHELL
# 指定 rubygems 源，国内也可以换成淘宝地址
source "https://rubygems.org"

# 声明一些依赖
gem 'github-pages'
gem 'rails', '4.1.0.rc2' # 版本号即为 4.1.0.rc2
gem "jekyll", ">= 3.7.4"
gem 'nokogiri', '~> 1.6.1' # 版本号 >= 1.6.1，但 < 1.7.1
```

然后 bundler 会连接 `rubygems.org` 源去安装所有符合条件的 gems，包括他们自身的依赖。如果所需要的 gems 已经下载过了，bundler 会直接使用它们。安装完成后，bundler 会将所有 gems 和版本号写入到快照 `Gemfile.lock` 里:

```SHELL
bundle install # 'bundle' is a shortcut for 'bundle install'

# Fetching gem metadata from https://rubygems.org/.........
# Fetching additional metadata from https://rubygems.org/..
# Resolving dependencies...
# Using rake 10.3.1
# ...
# Installing rails 4.1.0.rc2
# Installing nokogiri 1.6.1
# Your bundle is complete!
# Use `bundle show [gemname]` to see where a bundled gem is installed.
```

### _config.yml

**_config.yml** 是管理包含全局配置和变量定义在内的配置文件，并且这些变量定义在执行时会被读取，更多变量[可以参考这里](http://jekyllcn.com/docs/variables/) 👈:

```TEXT
title:            "Tate & Snow"
description:      "Lovely Home"
url:              https://tate-young.github.io # 域名
# 分页
paginate: 15
paginate_path: "blog:num"
plugins: [jekyll-paginate]
...
```

一个基本的 jekyll [文件结构](https://jekyllrb.com/docs/structure/)如下:

```TEXT
.
├── _config.yml # 配置文件
├── _data # 动态页面中的数据库
|   └── members.yml
├── _drafts # Drafts are unpublished posts
|   ├── begin-with-the-crazy-ideas.md
|   └── on-simplicity-in-technology.md
├── _includes # 代码片段，可通过 include 嵌入
|   ├── footer.html
|   └── header.html
├── _layouts # 包裹在文章外部的模板
|   ├── default.html
|   └── post.html
├── _posts # 文件，命名需要以日期开头
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
|   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _sass
|   ├── _base.scss
|   └── _layout.scss
├── _site # 目标文件
├── .jekyll-metadata
└── index.html # can also be an 'index.md' with valid front matter
```

> 通过 jekyll 和其他插件或工具，我们还可以完成分页、评论、主题等功能，当然我们也可以用[现成的主题](http://jekyllthemes.org) 👈

> 评论插件之前用的国外的 [**disqus**](https://disqus.com)，现在换成了 [**gitalk**](https://github.com/gitalk/gitalk)

## liquid 模板

[**liquid**](https://shopify.github.io/liquid/basics/introduction/) 模板引擎也是通过 Ruby 编写的，使用方法可以直接参考官方文档，以下只是简单介绍下:

```HTML
<!-- Jekyll 预设了 site、layout、page、content 四个全局变量 -->
<!-- 此处 page.title 值其实就是此篇文章的标题，即 "Github Pages" -->
<title>{ { page.title } }</title>
```

**tags** create the logic and control flow for templates，即 `{ % ... % }`:

```HTML
{ % if product.type == "Shirt" and product.title contains "Pack" % }
  This is a pack shirt.
{ % endif % }
```

**filters** 通过使用 "\|" 来返回输出的值:

```HTML
{ { "adam!" | capitalize | prepend: "Hello " } }
<!-- Hello ADAM! -->
```

## rvm

**rvm** 是 Ruby 的版本管理工具，使用方法如下:

```SHELL
# 安装指定版本
rvm install "ruby-2.3.8"  

# 查看当前 ruby 版本和位置
ruby -v
# ruby 2.3.8p459 (2018-10-18 revision 65136) [x86_64-darwin19]
which ruby
# /Users/tate/.rvm/rubies/ruby-2.3.8/bin/ruby

# 列出所有 ruby 版本
rvm list
```

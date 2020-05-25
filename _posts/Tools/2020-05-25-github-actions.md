---
layout: blog
front: true
comments: True
flag: HTML
background: green
category: 前端
title:  Github Actions
date:   2020-05-25 18:05:00 GMT+0800 (CST)
background-image: https://www.wangbase.com/blogimg/asset/201909/bg2019091201.jpg
tags:
- html
---
# {{ page.title }}

## CI / CD

### 持续集成

**持续集成(Continuous Integration)**强调开发人员提交了新代码之后，立刻进行构建、测试。根据测试结果，我们可以确定新代码和原有代码能否正确地集成在一起，从而尽早地发现集成错误。测试方式有几种:

1. 单元测试 - 针对函数或模块的测试
2. 集成测试 - 针对整体产品的某个功能的测试，又称功能测试
3. 端对端测试 - 从用户界面直达数据库的全链路测试

> 之前提到的 `Cypress` 就可以完成上述的自动化测试

构建工具的话常用的也有以下几种, 它们都会将构建和测试，在一次运行中执行完成:

1. [**Jenkins**](https://www.jenkins.io)
1. [**Travis**](https://travis-ci.com)
1. Codeship
1. Strider

![integration](https://3lsqjy1sj7i027fcn749gutj-wpengine.netdna-ssl.com/wp-content/uploads/2015/12/409-images-for-snap-blog-postedit_image1.png)

### 持续交付

**持续交付(Continuous Delivery)**在持续集成的基础上，将集成后的代码部署到更贴近真实运行环境的「类生产环境」(production-like environments)中，比如灰度环境。如果代码没有问题，可以继续手动部署到生产环境中。

### 持续部署

**持续部署(Continuous Deployment)**则是在持续交付的基础上，把部署到生产环境的过程自动化。可以借助工具 `Ansible，Chef，Puppet` 等:

![deployment](https://3lsqjy1sj7i027fcn749gutj-wpengine.netdna-ssl.com/wp-content/uploads/2015/12/409-images-for-snap-blog-postedit_image3-auto.png)

## DevOps

### 什么是 DevOps

**DevOps** 是 `Development` 和 `Operations` 的结合，集文化理念、实践和工具于一身，可以提高组织高速交付应用程序和服务的能力。**其核心是通过打破组织孤岛，提高透明度并促进开发人员与 IT 运营团队之间的开放式沟通，为组织带来业务价值**，而上述提到的 CI / CD 则可以更好去驱动。

由于软件开发流程分为许多阶段，过去我们都常常将这些阶段视为各自独立，彼此任务完成后交付给下一个阶段的人员，这造成了许多人员沟通与合作上的屏障，而 DevOps 的出现就是为了解决这样一个问题，尤其是软件最后部署常常会出现问题。如造成时程的延迟，无法顺利交付等。

![old way](https://3lsqjy1sj7i027fcn749gutj-wpengine.netdna-ssl.com/wp-content/uploads/2016/01/457-image-for-devops-part-of-blog_old-way_1200x400.png)

但随着软体的发展，我们越来越需要快速迭代我们的软体版本周期，许多大型网路公司都希望能够更尽快地部署更新产品，同时，随着虚拟化技术与各种测试软体的演进，便在时代的演进下提倡出了一种 DevOps 的"多人运动"。在 DevOps 模式下，开发团队和运营团队都不再是“孤立”的团队。有时，这两个团队会合为一个团队，他们的工程师会在应用程序的整个生命周期（从开发测试到部署再到运营）内相互协作，开发出一系列不限于单一职能的技能:

![new way](https://3lsqjy1sj7i027fcn749gutj-wpengine.netdna-ssl.com/wp-content/uploads/2016/01/457-image-for-devops-part-of-blog_new-way_560x560.png)

若想要了解如果透过一些工具协助让你的公司拥有良好的 DevOps 文化，你可以参考以下的图:

![devops tools](https://media-exp1.licdn.com/dms/image/C4E12AQFDq_8TR87Mgg/article-inline_image-shrink_1000_1488/0?e=1596067200&v=beta&t=V4WviaiTdOL5TFHZj3PTjZzDlpKL0H-ftTpsu8bu-9U)

### 与敏捷开发的关系

首先我们要了解什么是敏捷开发？

**敏捷开发(agile development)**是一种以人为核心、迭代、循序渐进的开发方法，**核心就是迭代开发，每个 Sprint 的迭代周期末尾，都具备可以交付的功能**。在敏捷开发中，软件项目的构建被切分成多个子项目，各个子项目的成果都经过测试，具备集成和可运行的特征。换言之，就是把一个大项目分为多个相互联系，但也可独立运行的小项目，并分别完成，在此过程中软件一直处于可使用状态。简要列举一下它的特点:

1. TDD 测试驱动开发
2. 持续集成
3. 重构(Refactoring) - clean code that works
4. 结对编程(Pair-Programming) - 两个人在一起探讨很容易产生思想的火花
5. 站立会议(stand up) - 每天早上，项目组的所有成员都会站立进行一次会议。一般来说是 15-20 分钟。会议的内容并不是需求分析、任务分配等，而是每个人都回答三个问题：1. 你昨天做了什么？2. 你今天要做什么？ 3. 你遇到了哪些困难？站立会议让团队进行交流，彼此相互熟悉工作内容
6. 小版本发布(Frequent Releases) - 发布频繁，每一个版本新增的功能简单，不需要复杂的设计，这样文档和设计就在很大程度上简化
7. 以合作为中心，表现为代码共享；可调整计划；自动化测试等其他特点

> 敏捷开发方法很多，包括 `Scrum、极限编程、功能驱动开发以及统一过程（RUP）`等多种法，这些方法本质实际上是一样的，可以按照项目成员本身来灵活定制。

**DevOps 与敏捷开发是相辅相成的**。DevOps 是一种文化，旨在促进软体开发和维护过程中所有参与者间的共同作业。敏捷式开发可说是一项开发方法，旨在于需求不断变化的普遍现实情况下，保持生产力和加速发行。虽然 DevOps 与敏捷开发不同，但搭配使用时，这两种方法皆能提升效率与结果的可靠性。

### 与 ITSM / ITIL 的关系

**ITSM(IT Service Management)**是一个概念，指的是组织为设计、实施、改进和支持 IT 服务而执行的所有活动、流程、策略和过程。这是管理组织中的信息技术并为客户提供价值的一种战略方法。它的好处是:

1. 确定的角色和职责
2. 以低成本提供更好的服务
3. 提高生产率
4. 识别和解决问题的能力
5. 最终用户满意度

> **ITIL(IT Infrastructure Library)** 是 ITSM 的最佳实践框架。它有助于提供必要的工具和技术，以有效地提供那些服务。其他框架还有 `COBIT、FitSM、Lean 和 Agile and DevOps` 等。

有人可能会说 DevOps 会代替 ITIL？

事实并非如此。因为尽管 IT 部门可能摆脱了 ITIL 培训和流程孤岛，但他们仍然需要做一些服务管理方面的工作。这些是必不可少的业务功能，DevOps 并没有像 ITIL 那样为我们提供流程指导，因此，即使是只使用 DevOps ，现在仍然遵循某些 ITIL 流程或原则。

很显然，ITIL 和 DevOps 的基础并没有太大差异，它们的根源相似，旨在更好地协作和提高效率。DevOps 旨在通过自动化实现更快的周转和敏捷性，而 ITIL 还强调自动化以提高服务效率。成功的秘诀在于清楚地了解每个目标的目的，并针对正确的问题实施正确的方法。只要企业了解其动态，ITIL 和 DevOps 可以成为很好的朋友。

## Github Actions

回到我们的主题 - [**Github Actions**](https://help.github.com/en/actions/creating-actions/about-actions#versioning-your-action)。它其实是上面讲到的 CI / CD 工具。2019 年 8 月 8 日，GitHub 官方博客发文称，程序员期待已久的功能来了，Github Actions 终于支持内置 CI / CD 了，并对所有开源项目免费。GitHub Actions 的主要作用就是让用户能够在 GitHub 服务器上直接执行和测试代码，只需几个简单步骤就可以实现构建、共享和执行代码。下面主要摘自阮一峰的 [Github Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)。

> 当然，也会有人担心 Actions CI / CD 是否会与 `Jenkins、 AWS CodeDeploy 或 GitLab CI` 等其他 CI / CD 工具竞争。对此，GitHub 产品设计高级总监 Max Schoening 表示：“我们从未将其它 CI/CD 工具或厂商视为竞争对手，GitHub Actions 是社区驱动支持的工作流程自动化。GitHub 和我们的社区一直相信选择和开放的生态系统，这是我们对待每件事的态度。GitHub Actions 允许开发人员集成他们现有的所有工具，混合和匹配新的开发人员产品，并连接到软件生命周期的所有部分，包括现有的 CI / CD 合作伙伴。”

持续集成由很多操作组成，比如抓取代码、运行测试、登录远程服务器，发布到第三方服务等等。GitHub 把这些操作就称为 actions。不同项目下 actions 可能相同，因此我们可以创建一些脚本或者直接引用别人写好的，GitHub 做了一个[官方市场](https://github.com/marketplace?type=actions)，可以搜索到他人提交的 actions。另外还有一个 [awesome actions](https://github.com/sdras/awesome-actions) 的仓库，也收录和整理了不少 actions。

既然 actions 是代码仓库，当然就有版本的概念，用户可以引用某个具体版本的 action。下面都是合法的 action 引用，用的就是 Git 的指针概念:

```SHELL
actions/setup-node@74bc508 # 指向一个 commit
actions/setup-node@v1.0    # 指向一个标签
actions/setup-node@master  # 指向一个分支
```

Github Actions 有一些概念需要介绍下:

1. **workflow** - 持续集成一次运行的过程，就是一个 workflow
2. **job** - 一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务
3. **step** - 每个 job 由多个 step 构成，一步步完成
4. **action** - 每个 step 可以依次执行一个或多个命令(action)

我们来看看 Github Actions 配置文件的基本构成，配置文件格式是 `.yml`，示例如下:

```YAML
# workflow 名称
name: Github Action Example

# 触发 workflow 的事件
on:
  push:
    branches:
      - master # 只有 master 分支发生 push 事件时，才会触发 workflow

# 当前 workflow 要执行的一项或多项任务 jobs
jobs:
  # 一个 job 任务，任务名为 build
  build:
    # runs-on 指定 job 任务运行所需要的虚拟机环境(必填字段)
    runs-on: ubuntu-latest
    # steps 是每个 job 的运行步骤，可以包含一个或多个步骤
    steps:
      # action 命令，切换分支获取源码
      - name: Checkout
        # 使用 action 库 actions/checkout 访问仓库代码
        uses: actions/checkout@master
      # action 命令，安装 Node10
      - name: use Node.js 10
        # 使用 action 库  actions/setup-node 安装 node
        uses: actions/setup-node@v1
        with:
          node-version: 10
      # action 命令，install && test
      - name: npm install and test
        # 运行的命令或者 action
        run: | # 多行字符串可以使用 | 保留换行符，也可以使用 > 折叠换行
          npm install
          npm run test
        # 环境变量
        env:
          CI: true
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
```

当我们配置完后，将提交 push 到远端仓库时， Github 一旦发现了 workflow 文件以后，就会自动运行。并且可以在网站上实时查看运行日志，有不同的状态信息:

![actions 日志](https://i.loli.net/2020/05/25/Jc8KIdvpF1staCL.png)

## Gitlab CI / CD

对于日常团队开发，我们项目都是托管在 Gitlab 上，它也提供了相应的 CI / CD 功能，即 [**Gitlab CI / CD**](https://docs.gitlab.com/ee/ci/)。其配置文件位于根目录，名为 `.gitlab-ci.yml`，该文件创建一个**管道(pipeline)**，该管道运行以更改存储库中的代码。管道由一个或多个按顺序运行的阶段组成，每个阶段可以包含一个或多个并行运行的脚本。这些脚本由 `GitLab Runner` 代理执行。

![Gitlab CI / CD](https://about.gitlab.com/images/ci/ci-cd-test-deploy-illustration_2x.png)

Gitlab 提供了[一些模板](https://gitlab.com/gitlab-org/gitlab-foss/tree/master/lib/gitlab/ci/templates)供我们选择。当然我们还可以自定义，具体的配置可以[查看下官方文档](https://docs.gitlab.com/ee/ci/yaml/README.html)。这里只是简单介绍一些概念:

![Gitlab CI / CD templates](https://docs.gitlab.com/ee/ci/img/add_file_template_11_10.png)

1. **stages** - 定义 pipeline 的 job 数量和名称
2. **variables** - 定义流程中的一些环境变量
3. **before_scripts** - 在每个 job 的 scripts 执行前进行的命令集，一般是创建目录，打印 context 目录等操作，可类比 unittest 的 setUp 方法
4. **stage** - 定义了一个 job 的具体流程，可以在前面加上名称

```YAML
stages: # 包含了三个 job - test, build, deploy。分别实现自动测试，打包项目和部署
  - test
  - build
  - deploy

variables: # 设置一些变量
  GIT_STRATEGY: none
  PROJECT_REPO_NAMESPACE: test
  PROJECT_REPO_NAME: cicd_learn
  DEPLOYMENT_REPO_NAMESPACE: test
  DEPLOYMENT_REPO_NAME: deploy_test

before_script:
  - export ROOT_PATH=$(pwd)
  - echo 'root path:' $ROOT_PATH
  - mkdir $PROJECT_REPO_NAME
  - cd $PROJECT_REPO_NAME
  - <some git manipulation here>
  - echo 'date:' $DATE

test_stage:
  stage: test
  script:
    - <test related command here>
  artifacts: # 定义 job 的产出
    paths: # 数组内的 paths 和 when 分别定义报告的路径和产出场景。此处表示报告放置于根目录下，任何时候都要提供报告
      - xxx.html
    when: always
  allow_failure: false # 如果值为 true，那么即使没通过测试，也可以执行后续的 job

build_stage:
  stage: build
  script:
     - <build related command here>
  when: manual # 值为 manual 表示其需要在 Gitlab 上手动触发（页面上点击按钮即可）
  allow_failure: false
  only: # 表明只有 master 分支可以执行 build，如果要用排除法反向指定，可以用 except
    - master

deploy:
  stage: deploy
  script:
    - <deploy related command here>
  allow_failure: false
  only:
    - master
```

当然 GitLab CI / CD 不仅可以执行设置的脚本，还可以显示执行期间发生的情况，就像在终端机中看到的那样:

![Gitlab CI/CD job running](https://docs.gitlab.com/ee/ci/introduction/img/job_running.png)

## 参考链接

1. [The Product Managers’ Guide to Continuous Delivery and DevOps](https://www.mindtheproduct.com/what-the-hell-are-ci-cd-and-devops-a-cheatsheet-for-the-rest-of-us/) By SUZIE PRINCE
2. [敏捷开发 - MBA 智库](https://wiki.mbalib.com/wiki/敏捷开发)
3. [Atlassian - DevOps vs. ITIL -- Which matters for your team?](https://www.atlassian.com/itsm/itil/devops-vs-itil)
4. [GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html) By 阮一峰

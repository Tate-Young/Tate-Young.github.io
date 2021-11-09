---
layout: blog
front: true
comments: True
flag: HTML
background: green
category: 前端
title:  Github Actions
date:   2020-05-25 18:05:00 GMT+0800 (CST)
update: 2021-11-08 15:44:00 GMT+0800 (CST)
description: add Travis CI
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

若想要了解如果透过一些工具协助让你的公司拥有良好的 DevOps 文化，你可以参考以下的图，也可以[参考这篇文章](https://cloud.tencent.com/developer/news/613701):

![devops tools](http://www.jamesbowman.me/post/cdlandscape/ContinuousDeliveryToolLandscape-fullsize.jpeg)

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

当然，也会有人担心 Actions CI / CD 是否会与 `Jenkins、 AWS CodeDeploy 或 GitLab CI` 等其他 CI / CD 工具竞争。对此，GitHub 产品设计高级总监 Max Schoening 表示：“我们从未将其它 CI/CD 工具或厂商视为竞争对手，GitHub Actions 是社区驱动支持的工作流程自动化。GitHub 和我们的社区一直相信选择和开放的生态系统，这是我们对待每件事的态度。GitHub Actions 允许开发人员集成他们现有的所有工具，混合和匹配新的开发人员产品，并连接到软件生命周期的所有部分，包括现有的 CI / CD 合作伙伴。”

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

## Gitlab CI / CD

对于日常团队开发，我们项目都是托管在 Gitlab 上，它也提供了相应的 CI / CD 功能，即 [**Gitlab CI / CD**](https://docs.gitlab.com/ee/ci/)。其配置文件位于根目录，名为 `.gitlab-ci.yml`，该文件创建一个**管道(pipeline)**，该管道运行以更改存储库中的代码。管道由一个或多个按顺序运行的阶段组成，每个阶段可以包含一个或多个并行运行的脚本。这些脚本由 `GitLab Runner` 代理执行。

> **GitLab Runner** is an application that works with GitLab CI/CD to run jobs in a pipeline.

<!-- ![Gitlab CI / CD](https://about.gitlab.com/images/ci/gg_2x.png) -->

Gitlab 提供了[一些模板](https://gitlab.com/gitlab-org/gitlab-foss/tree/master/lib/gitlab/ci/templates)供我们选择。当然我们还可以自定义，具体的配置可以[查看下官方文档](https://docs.gitlab.com/ee/ci/yaml/README.html)。这里只是简单介绍一些概念:

<!-- ![Gitlab CI / CD templates](https://docs.gitlab.com/ee/ci/img/add_file_template_11_10.png) -->

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

> 关于 Github Actions 和 Gitlab CI / CD 的区别和迁移细节可以[参考这里](https://docs.github.com/en/actions/migrating-to-github-actions/migrating-from-gitlab-cicd-to-github-actions) 👈

## Jenkins

[**Jenkins**](https://www.jenkins.io/doc/) 的目标是要将软件开发生命周期的整个过程都自动化，从开发人员向代码库中提交代码开始，到将此代码投入生产环境中使用为止。为了使整个软件开发流程处于 DevOps 模式或自动化模式，我们就需要对 CI/CD 流水线进行自动化。因此，我们还需要一款自动化工具来做这件事情，它就是 Jenkins。Jenkins 是基于 Java 开发的持续集成工具，提供了 web 可视化配置管理页面，安装配置简单，插件资源丰富。

![jenkins](https://sdn.youdianzhishi.com/images/2019/12/30/7fdc1bd02af848df80d6c0951f9dd1af.png)

### pipeline

本质上，Jenkins 是一个自动化引擎，它支持许多自动模式。**流水线(pipeline)**向 Jenkins 添加了一组强大的工具，支持用例、简单的持续集成到全面的持续交付流水线。 通过对一系列的发布任务建立标准的模板，用户可以利用更多流水线的特性，比如：

1. 代码化：流水线是在代码中实现的，通常会存放到源代码控制，使团队具有编辑、审查和更新他们项目的交付流水线的能力。
1. 耐用性：流水线可以从 Jenkins 的 master 节点重启后继续运行。
1. 可暂停的：流水线可以由人功输入或批准继续执行流水线。
1. 解决复杂发布：支持复杂的交付流程。例如循环、并行执行。
1. 可扩展性：支持扩展 DSL 和其他插件集成。

流水线好比地铁，我们需要设计地铁的运行线路图（Jenkinsfile），在线路图中指定要经过的站点（stages）。**Jenkinsfile** 使用两种语法进行编写，分别是声明式和脚本式。声明式和脚本式的流水线从根本上是不同的，声明式流水线使编写和读取流水线代码更容易设计；脚本式的流水线语法，提供更丰富的语法特性。

```js
// 声明式语法
pipeline {
  // 指定运行此流水线的节点
  agent { node { label "build" } }

  // 流水线的阶段
  stages {
    // 阶段 1 获取代码
    stage("CheckOut") {
      steps{
        script{
          println("获取代码")
        }
      }
    }
    stage("Build"){
      steps{
        script{
          println("运行构建")
        }
      }
    }
  }
  post {
    always{
      script{
        println("流水线结束后，经常做的事情")
      }
    }
    success{
      script{
        println("流水线成功后，要做的事情")
      }
    }
    failure{
      script{
        println("流水线失败后，要做的事情")
      }
    }
    aborted{
      script{
        println("流水线取消后，要做的事情")
      }
    }
  }
}
```

![pipeline](https://www.k8stech.net/jenkins-docs/pipelinesyntax/chapter01/images/03-jenkinslog.png)

### 共享库与 Groovy

**共享库**这并不是一个全新的概念，其实具有编程能力的同学应该清楚一些。例如在编程语言 Python 中，我们可以将 Python 代码写到一个文件中，当代码数量增加，我们可以将代码打包成模块然后再以 import 的方式使用此模块中的方法。

在 Jenkins 中使用 [**Apache Groovy**](https://groovy-lang.org) 语法，共享库中存储的每个文件都是一个 groovy 的类，每个文件（类）中包含一个或多个方法。每个方法包含 groovy 语句块。如下，在 Jenkinsfile 中使用 `@Library ('jenkinslib') _` 来加载共享库，注意后面符号 _ 用于加载，最后再调用类中的方法。

Groovy 是一种强大的、可选类型的动态语言，具有静态类型和静态编译功能，用于 Java 平台，旨在通过简洁、熟悉且易于学习的语法提高开发人员的生产力。它可以与任何 Java 程序顺利集成，并立即为您的应用程序提供强大的功能，包括脚本功能、领域特定语言创作、运行时和编译时元编程以及函数式编程。

```js
#!groovy

@Library('jenkinslib') _     

// 类的实例化
def tools = new org.devops.tools()

pipeline {
  agent { node {  label "master" }}

  stages {
    // 下载代码
    stage("GetCode"){ 
      steps{  
        timeout(time:5, unit:"MINUTES"){   
          script{ 
            // 调用类实例上的方法
            tools.PrintMes("获取代码", 'green')
          }
        }
      }
    }
  }
}
```

### 流水线

Jenkins 流水线可以与以下工具进行集成：

1. 构建工具 - 如 Maven、Ant、Gradle、Npm
   1. Jenkins 调用这些工具的方式是通过环境变量调用。有两种方式，一种是在 Jenkins 系统配置中添加构建工具的环境变量；一种是直接在 Jenkinsfile 中定义。实现的效果没有区别，而后者更加灵活对于配置 Jenkins 无状态化有好处。具体可以[参考这里](https://www.k8stech.net/jenkins-docs/pipelineintegrated/chapter01/#jenkins) 👈
2. 发布工具 - 如 Saltstack、Ansible
3. 用户认证系统 - LDAP、Github、Gitlab
   1. Jenkins 默认使用自带数据库模式存储用户，在企业中一般都会有统一的认证中心，例如 LDAP、ActiveDirectory 中管理用户。可以配置 Jenkins 集成实现统一用户管理。
4. 版本控制工具 - Gitlab
   1. 当 Gitlab 中触发 push 操作，则触发相对应的 Jenkins 流水线构建。实现快速反馈与验证。
      1. 方式 1： 使用 **Gitlab CI**, 当有 push 请求，在 CI 脚本中远程触发 Jenkins 项目构建。需要准备 Gitlab runner。编写触发 Jenkins 脚本
      2. 方式 2： 使用 **Gitlab Webhook**, 当有 push 请求，直接触发 jenkins 项目构建。需要配置 Gitlab webhook。需要配置 Jenkins 项目 Hook
5. 代码质量管理平台 - Sonarqube
   1. 开发人员在 IDE 开发代码，可以安装 **SonarLint** 插件进行提交前代码扫描，当开发人员提交代码到版本控制系统中，自动触发 jenkins 进行代码扫描
6. 制品仓库 - 如 nexus、artiifactory
   1. 制品主要解决第三方依赖包下载管理混乱，没有准入管控以及针对引入进来的第三组件没有进行组件扫描，极易引入漏洞等。
7. 自动化测试 - 如 JMeter

### CubeSats

**Cubesats** 实际上可以理解为基于 `JAVA 后端服务 + Jenkins + Ansible + Nexus` 的一个 CICD 平台：

* Jenkins 负责处理各种构建，自动化测试等任务
* **Ansible** 负责部署产物等操作。Ansible 是一个自动化运维工具，可以很方便管理服务器，也可以通过调用接口的方式，在指定服务器上执行指定的脚本。部署过程实质上是调用了它的接口，然后执行在服务器上执行特定的部署脚本。
* Nexus 服务这里是提供制品库，可以用于存放各种产物包，包括 java 和 js，方便部署的时候提供下载。

我们来看下日常实际使用体验，包括**构建**和**部署**：

以提交到 Git 上为流程开始，在 Cubesats 上选择构建，Cubesats 会利用 Jenkins 创建一个任务分配，并且把该任务分配到一台用于构建的机器 (一般称为一个节点)，该任务会根据先前用户在 Cubesats 中配置的 Git 仓库地址，拉取对应的仓库代码到本地机器上。随后，Jenkins 会调用用户事先设置的构建脚本命令，通常都是 Shell 脚本。执行成功的话就会按照预先设定好的路径，把该路径的所有文件打包到一个压缩文件中，一般是 zip 或者 tar 结尾的文件，而这个压缩文件通常被称为产物。最后会把文件上传到一个专⻔用于存放产物的资源服务器上，如 Verdaccio。以上都完成后，在 Cubesats 中就能看到界面上显示构建成功。当然，以上过程其实还有很多细节没有提到，但是总结下其实就是 **找了台机器，把代码拉下来，然后构建一下，把 产物打个包放到另一个地方，而这个过程就被称为构建。**

当构建完成后，我们就会准备去对应的环境中选择发布我们刚才的构建好的产物。在点下发布按钮后，通常会在需要部署新版本产物的机器上执行相应的脚本，大体上就是在该机器上下载产物，然后把内容解压到某个路径下，这个路径通常是 Nginx 配置指定的静态资源路径。一般来说前端的发布要简单的多，如果涉及到后端服务的发布，则要复杂一些。例如发布一个 Node.js 的后端服务的时候，通常放在 PM2 启动入口的路径下，然后通过 PM2 去启动/更新 Node.js 的服务，这里就不细说了，因为具体部署因应用的不同而不同，也会取决于实机或者 k8s 这种集群容器的不同而差异很大。**总来的说，前端的部署大体上就是找到对应服务的机器，把产物下载下来，然后放在 WEB 服务容器 (Nginx 之类的) 中。**

我们再来看下示例图：

![ci]( {{site.url}}/style/images/smms/cicd-ci.png )
![cd]( {{site.url}}/style/images/smms/cicd-cd.png )

> 关于 PaaS 平台的内容可以查看[这一章节]( {{site.url}}/2021/11/09/docker-k8s.html ) 👈

### Travis CI

[**Travis CI**](https://travis-ci.org) 也是提供的持续集成服务，但它只支持 Github/Bitbucket 代码托管平台。Travis 要求项目的根目录下面，必须有一个 `.travis.yml` 文件。这是配置文件，指定了 Travis 的行为。一旦代码仓库有新的 Commit，Travis 就会去找这个文件并执行里面的命令。

它提供了许多自动 CI 选项，由于 Travis CI 服务器托管在云中，因此无需专用服务器，可以在运行于不同操作系统上的不同计算机上的不同环境中进行测试。相反 Jenkins 则需要搭建专用服务器，但其本身是免费的；Travis CI 对于开源项目是免费的，而对于商业项目则需要购买企业计划。

总结下两者的区别 - **小型开源项目最适合 Travis CI，因为它易于运行且设置迅速。大型企业最适合 Jenkins，因为它为私人项目提供免费许可并具有广泛的可定制功能**：

1. Travis CI 是商业 CI 工具，而 Jenkins 是开源工具。
2. Jenkins 需要精心设置时，Travis CI 花费的时间很少。
3. Travis CI 提供较少的自定义选项，而 Jenkins 提供大量的自定义选项。
4. Travis CI 有一个 YAML 配置文件，而 Jenkins 为用户提供了完整的配置选项。

## 其他相关知识

### Maven & Nexus

在了解 [**Maven**](https://www.liaoxuefeng.com/wiki/1252599548343744/1309301146648610) 之前，我们先来看看一个 Java 项目需要的东西。首先，我们需要确定引入哪些依赖包。例如，如果我们需要用到 commons logging，我们就必须把 commons logging 的 jar 包放入 classpath。如果我们还需要 log4j，就需要把 log4j 相关的 jar 包都放到 classpath 中。这些就是依赖包的管理。其次，我们要确定项目的目录结构。例如，src 目录存放 Java 源码，resources 目录存放配置文件，bin 目录存放编译生成的.class 文件。此外，我们还需要配置环境，例如 JDK 的版本，编译打包的流程，当前代码的版本号。最后，除了使用 Eclipse 这样的 IDE 进行编译外，我们还必须能通过命令行工具进行编译，才能够让项目在一个独立的服务器上编译、测试、部署。

这些工作难度不大，但是非常琐碎且耗时。如果每一个项目都自己搞一套配置，肯定会一团糟。我们需要的是一个标准化的 Java 项目管理和构建工具。Maven 就是专门为 Java 项目打造的管理和构建工具，它的主要功能有：

1. 提供了一套标准化的项目结构；
1. 提供了一套标准化的构建流程（编译，测试，打包，发布等）；
1. 提供了一套依赖管理机制。

一个使用 Maven 管理的普通的 Java 项目，它的目录结构默认如下：

```TEXT
a-maven-project
├── pom.xml // 项目描述文件
├── src
│   ├── main
│   │   ├── java
│   │   └── resources
│   └── test
│       ├── java
│       └── resources
└── target
```

我们再看下 `pom.xml` 长啥样：

```xml
<project ...>
 <modelVersion>4.0.0</modelVersion>
 <groupId>com.itranswarp.learnjava</groupId>
 <artifactId>hello</artifactId>
 <version>1.0</version>
 <packaging>jar</packaging>
 <properties>
  ...
 </properties>
 <dependencies>
  <dependency>
    <groupId>commons-logging</groupId>
    <artifactId>commons-logging</artifactId>
    <version>1.2</version>
  </dependency>
 </dependencies>
</project>
```

其中，`groupId` 类似于 Java 的包名，通常是公司或组织名称，`artifactId` 类似于 Java 的类名，通常是项目名称，再加上 `version`，一个 Maven 工程就是由 groupId，artifactId 和 version 作为唯一标识。我们在引用其他第三方库的时候，也是通过这 3 个变量确定。例如，依赖 commons-logging：

```xml
<dependency>
  <groupId>commons-logging</groupId>
  <artifactId>commons-logging</artifactId>
  <version>1.2</version>
</dependency>
```

> 使用 `<dependency>` 声明一个依赖后，Maven 就会自动下载这个依赖包并把它放到 classpath 中。

当我们使用上述 commons-logging 这些第三方开源库的时候，我们实际上是通过 Maven 自动下载它的 jar 包，并根据其 pom.xml 解析依赖，自动把相关依赖包都下载后加入到 classpath。那么问题来了：当我们自己写了一个牛逼的开源库时，非常希望别人也能使用，总不能直接放个 jar 包的链接让别人下载吧？

如果我们把自己的开源库放到 Maven 的 repo 中，那么，别人只需按标准引用 `groupId:artifactId:version`，即可自动下载 jar 包以及相关依赖。bingo，以下是 3 种最常用的方法：

1. 以静态文件发布
2. 通过 Nexus 发布到中央仓库 - 发布到 `central.sonatype.org`，它会定期自动同步到 Maven 的中央仓库
   1. 很多大公司内部都使用 Nexus 作为自己的私有 Maven 仓库，而这个 `central.sonatype.org` 相当于面向开源的一个 Nexus 公共服务
3. 发布到私有仓库 - 例如公司自己搭的 nexus 服务器
   1. 如果没有私有 Nexus 服务器，还可以发布到 GitHub Packages。GitHub Packages 是 GitHub 提供的仓库服务，支持 Maven、NPM、Docker 等。使用 GitHub Packages 时，无论是发布 Artifact，还是引用已发布的 Artifact，都需要明确的授权 Token，因此，GitHub Packages 只能作为私有仓库使用。

### Artifactory 与制品库

**制品**即构建过程的产物，是指由源码编译打包生成的二进制文件，不同的开发语言对应着不同格式的二进制文件，这些二进制通常可以直接运行在服务器上。**制品库**用来统一管理不同格式的软件制品。除了基本的存储功能，还提供了版本控制、访问控制、安全扫描、依赖分析等重要功能，是一种企业处理软件开发过程中产生的所有包类型的标准化方式。旨在解决以下痛点：

1. 第三方依赖包下载管理混乱，没有准入管控；
1. 交付包使用 FTP 或者 SVN 进行管理，管理粒度相对较粗；
1. 第三方依赖包的安全风险管理形同虚设，或者滞后；
1. 由于受到监管约束，一键部署是不可能任务，跨网段的包交付智能依赖于手工拷贝；
1. 团队内部搭建的制品库是单点的，缺乏集群部署；
1. 因为没有统一的制品库，存在重复建设的问题；维护成本高，或者说目前根本就没有维护；
1. 针对引入进来的第三组件没有进行组件扫描，极易引入漏洞；

> 制品库可以跟源代码协同进行版本化控制，可以与本地各构建工具和云上的持续集成，持续部署无缝结合，并支持漏洞扫描等特性。为研发团队提供优质高效的构建物管理服务，把控构建物质量。

拿 maven 举例子，程序员只需在 pom 文件配一个新依赖就可直接从中央库上拉取一个不知名的三方包，危险系数十分高。从趋势上来说，maven 中央库新增漏洞在 2018 年增长了 27%，npm 则增长了 47%。随着我们工程的依赖越多，我们引入漏洞的风险几率也是正比增加的；从依赖层次来说，npm、Maven 和 Ruby 中的大多数依赖项都是间接依赖项，间接依赖项中的漏洞占总体漏洞的 78%，漏洞难以发现并且难以维护。

因此我们采取的措施有安全左移，如下被动转主动：

![制品](https://static001.geekbang.org/infoq/9f/9f127af539eeb900fadf9283b342b1fe.png)

也可以建立安全白名单制度，大致方案如下：

1. 在外网建立安全漏洞库，开源的可以从 NVD、VnlrDB 定时更新，商业可以购买 synk 的服务；同步建设有白名单制度用于特殊包申请，统一整合到整体的信任规则库；
2. 在 DMZ 区建设 DMZ 代理公网镜像仓库，根据安全漏洞库的规则过滤从公网上拉取第三方包。如果第三方包是被扫描到漏洞的，则禁止拉取到内网的制品仓库。

![白名单](https://static001.geekbang.org/infoq/74/743e3731fa69a9ffdec8f329f0ce8a26.png)

> 现如今比较流行的制品库可以用 Nexus 和 [**Artifactory**](https://jfrog.com/artifactory/) 搭建，目前两者的对比可以[参考下这里](https://blog.csdn.net/jianghuafeng0/article/details/109518353) 👈

### Webhook

**Webhook** 是一个 API 概念，是微服务 API 的使用范式之一，也被成为反向 API，实质就是一个接收 HTTP POST（或 GET，PUT，DELETE）的 URL。不像传统的 APIs 方式，你需要用轮询的方式来获得尽可能实时的数据。一个实现了 Webhook 的 API 提供方就是在当事件发生的时候会向这个配置好的 URL 发送一条信息，与请求 - 响应式不同，使用 Webhook 你可以实时接收到变化。举个例子：

1. 传统做法 - 项目 A 需要不停轮询去拉取项目 B 的最新数据
2. webhook 机制 - 项目 A 提供一个 webhook url, 每次项目 B 创建新数据时，便会向项目 A 的 hook 地址进行请求，项目 A 收到项目 B 的请求，然后对数据进行处理

我们再以 [Github Webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) 为例，GitHub 允许为自己创建的仓库注册 Webhook，之后无论是 pull 拉取代码、push 推送代码还是填写 issues，我们都可以收到通知和详情。比如可以触发 CI 构建、更新备份镜像和自动化部署等。

我们在仓库下的 settings 即可设置 Webhook，里面包含了几个重要的信息：

1. **Playload URL** - 接收 Webhook 请求的服务器的地址
2. **Content type** - Webhooks can be delivered using different content types:
   1. The `application/json` content type will deliver the JSON payload directly as the body of the POST request.
   2. The `application/x-www-form-urlencoded` content type will send the JSON payload as a form parameter called payload.
3. **secret** - Setting a webhook secret allows you to ensure that POST requests sent to the payload URL are from GitHub. When you set a secret, you'll receive the `X-Hub-Signature` and `X-Hub-Signature-256` headers in the webhook POST request. For more information on how to use a secret with a signature header to secure your webhook payloads, see "[Securing your webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks)."

![github-webhook]( {{site.url}}/style/images/smms/github-webhook.png )

> Github 官方也提供了教程，需要搭建一个本地服务器来接收 Webhook 讯息，这里推荐的是 ngrok，下面会讲到。

### ngrok

**ngrok** 是一个反向代理工具，通过在公共的端点和本地运行的 Web 服务器之间建立一个安全的通道。ngrok 可捕获和分析所有通道上的流量，便于后期分析和重放。简单来说，**利用 ngrok 可以通过外网来访问部署在本地服务器的网站**，它还提供一个 Web 管理页来监控 HTTP 通信报文，方便程序员开发和调试。另外 ngrok 还支持 TCP 层端口映射，不局限于某一特定的服务。支持 Mac OS X，Linux，Windows 等平台。

![ngrok](https://camo.githubusercontent.com/c38e5f8cf24e62a3a2482897d4653b70e7d42649549b48cea4d90e873c5480c3/68747470733a2f2f6e67726f6b2e636f6d2f7374617469632f696d672f6f766572766965772e706e67)

> 传统的做法是利用花生壳等动态域名或自行搭建 VPN 做端口映射，而利用 ngrok 几条命令就搞定。

ngrok 使用方式很简单，以 macOS 为例，下载之后执行：

```shell
./ngrok http 80
```

之后会自动开启终端 UI 界面:

```TEXT
ngrok by @inconshreveable

Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://92832de0.ngrok.io -> localhost:80
Forwarding                    https://92832de0.ngrok.io -> localhost:80

Connnections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

打开 `localhost:4040` 页面可以监测请求详情：

![ngrok inspect](https://ngrok.com/static/img/inspect2.png)

## 参考链接

1. [The Product Managers’ Guide to Continuous Delivery and DevOps](https://www.mindtheproduct.com/what-the-hell-are-ci-cd-and-devops-a-cheatsheet-for-the-rest-of-us/) By SUZIE PRINCE
2. [敏捷开发 - MBA 智库](https://wiki.mbalib.com/wiki/敏捷开发)
3. [Atlassian - DevOps vs. ITIL -- Which matters for your team?](https://www.atlassian.com/itsm/itil/devops-vs-itil)
4. [GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html) By 阮一峰
5. [为什么我们需要制品管理](https://xie.infoq.cn/article/f5f72e8a25f5b6581c0a2fb66) By Man
6. [Maven 介绍](https://www.liaoxuefeng.com/wiki/1252599548343744/1309301146648610) By 廖雪峰

---
layout: blog
back: true
comments: True
flag: Operation
background: gray
category: 后端
title: 记一些运维实践
date:   2019-02-02 17:54:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/13/5ad0695146748.jpg
tags:
- Operation
---
# {{ page.title }}

刚工作时候，有个大学生优选培训计划，当时导师是运维老司机，所以跟随着他捣鼓了一些运维方面的问题，想想也都是几年前的事了，以下这些实践都是从印象笔记迁移过来的，就当留作个纪念吧 ~

## Oracle 11g 安装

什么？安装也要搬进来吗？是的，Oracle 的安装绝不简单，整个过程可以学到很多东西，关键点在于怎么去搜索和排错。

Oracle 具体安装步骤可以[参照文档](/style/files/Oracle11gInstallation.pdf) 👈

同时也记录下来操作过程中的[一些命令](/style/files/oracleInstallation.txt) 👈

## ESXI 虚拟化平台

**虚拟化**，简单讲，就是可以实现将一台计算机虚拟化为若干台逻辑计算机，每个逻辑计算机能运行不同操作系统而互不干扰，能较大提高资源利用率。通过虚拟化平台的搭建，可以通过客户端对不同服务器统一的管理，实现动态资源调度、安全部署和实时动态监控等功能。

**ESXI** 专为运行虚拟机、最大限度降低配置要求和简化部署而设计，其本身类似于一个操作系统，可安装至虚拟机，安装步骤可以[参照文档](/style/files/esxi.pdf) 👈

里面还涉及到 **Vmware vSphere Client** 和 **vCenter** 的概念，而 **VMware vSphere Hypervisor** 也就是指的 EXSI，只是不同的叫法而已。

## FTP 服务器

**FTP**(File Transfer Protocol Server) 服务器是依照 FTP 协议提供服务，在互联网上提供文件存储和访问服务的计算机。参考这里可以了解到如何在 Linux 和 window server 2008 R2 系统下进行 [FTP 服务器的搭建](/style/files/ftp.pdf) 👈

## 文件服务器

在局域网中，以文件数据共享为目标，需要将供多台计算机共享的文件存放于一台计算机中。这台计算机就被称为**文件服务器**。参考这里可以了解到如何在 Linux 和 window server 2008 R2 系统下进行[文件服务器的搭建](/style/files/fileServer.pdf) 👈

## 数据仓库及 ODS

**数据仓库**(Data Warehouse)：是一个面向主题的(Subject Oriented)、集成的(Integrated)、相对稳定的(Non-Volatile)、反映历史变化(Time Variant)的数据集合，用于支持管理决策(Decision Making Support)。

**ODS**(Operational Data Store)：是一个面向主题的、集成的、可变的、当前的细节数据集合，用于支持企业对于即时性的、操作性的、集成的全体信息的需求。

> ODS 是短期的实时的数据，供产品或者运营人员日常使用，而数据仓库是供战略决策使用的数据；前者是可以更新的数据，数据仓库是基本不更新的反应历史变化的数据

两者并存的其中一种方案:

![ods.png](https://i.loli.net/2019/02/03/5c564e1f55821.png)

**ETL** 分别是`Extract`、`Transform`、`Load`三个单词的首字母缩写，即"抽取"、"转换"、"装载"，由于不同原始数据库中的数据的来源、格式不一样，导致了系统实施、数据整合出现问题，ETL 就是用来解决这一问题的。ETL 包含了三方面:

* 抽取 - 将数据从各种原始的业务系统中读取出来，这是所有工作的前提
* 转换 - 按照预先设计好的规则将抽取得数据进行转换，使本来异构的数据格式能统一起来
* 装载 - 将转换完的数据按计划增量或全部导入到数据仓库中

## Zabbix

**Zabbix** 是一个基于 WEB 界面的提供分布式系统监视以及网络监视功能的企业级的开源解决方案，基于 `Server-Client` 架构。主要由两部分组成:

* **zabbix server** - 通过 SNMP、zabbix agent、ping，端口监视等方法提供对远程服务器/网络状态的监视，数据收集等功能
* **zabbix agent** - 安装在被监视的目标服务器上，它主要完成对硬件信息或与操作系统有关的内存、CPU 等信息的收集

具体安装方法可以[参考这篇文章](https://www.jianshu.com/p/49ef09f6d8db)

## Docker

**Docker** 容器并非虚拟机，但可以比喻为更轻量级的虚拟机。使用虚拟机运行多个相互隔离的应用时(以下翻译[参考自这里](http://www.techug.com/post/comparing-virtual-machines-vs-docker-containers.html)):

![virtual-machine-architecture.jpg](https://i.loli.net/2019/02/03/5c5653c5b5181.jpg)

* 基础设施(Infrastructure) - 可以是个人电脑，数据中心的服务器，或者是云主机。
* 主操作系统(Host Operating System) - 运行的可能是 MacOS，Windows 或者某个 Linux 发行版。
* 虚拟机管理系统(Hypervisor) - 利用 Hypervisor(即上述的 ESXI)，可以在主操作系统之上运行多个不同的从操作系统。
* 从操作系统(Guest Operating System) - 假设你需要运行 3 个相互隔离的应用，则需要使用 Hypervisor 启动 3 个从操作系统，也就是 3 个虚拟机。这些虚拟机都非常大，也许有 700MB，这就意味着它们将占用 2.1GB 的磁盘空间。更糟糕的是，它们还会消耗很多 CPU 和内存。
* 各种依赖 - 每一个从操作系统都需要安装许多依赖。如果你使用 Ruby 的话，应该需要安装 gems；如果使用其他编程语言，比如 Python 或者 Node.js，都会需要安装对应的依赖库。
* 应用 - 安装依赖之后，就可以在各个从操作系统分别运行应用了，这样各个应用就是相互隔离的。

使用 Docker 容器运行多个相互隔离的应用时:

![docker-container.jpg](https://i.loli.net/2019/02/03/5c5653c5b2a83.jpg)

* 基础设施(Infrastructure) - 同上
* 主操作系统(Host Operating System) - 所有主流的 Linux 发行版都可以运行 Docker。对于 MacOS 和 Windows，也有一些办法"运行" Docker。
* Docker守护进程(Docker Daemon) - Docker 守护进程取代了 Hypervisor，它是运行在操作系统之上的后台进程，负责管理 Docker 容器。
* 各种依赖 - 对于 Docker，应用的所有依赖都打包在 Docker 镜像中，Docker 容器是基于 Docker 镜像创建的。
* 应用 - 应用的源代码与它的依赖都打包在 Docker 镜像中，不同的应用需要不同的 Docker 镜像。不同的应用运行在不同的 Docker 容器中，它们是相互隔离的。

虚拟机和 Docker 的一些对比:

Docker 守护进程可以直接与主操作系统进行通信，为各个 Docker 容器分配资源；它还可以将容器与主操作系统隔离，并将各个容器互相隔离。虚拟机启动需要数分钟，而 Docker 容器可以在数毫秒内启动。由于没有臃肿的从操作系统，Docker 可以节省大量的磁盘空间以及其他系统资源。

但并不是说虚拟机就被取代了，因为两者有不同的使用场景。虚拟机更擅长于彻底隔离整个运行环境。例如，云服务提供商通常采用虚拟机技术隔离不同的用户。而 Docker 通常用于隔离不同的应用，例如前端，后端以及数据库。

## 参考链接

1. [zabbix 从听说到学会](https://www.jianshu.com/p/49ef09f6d8db) By JokerW
2. [Zabbix 3.0 从入门到精通(zabbix 使用详解)](https://www.cnblogs.com/clsn/p/7885990.html) By 惨绿少年
3. [Comparing Virtual Machines vs Docker Containers](https://nickjanetakis.com/blog/comparing-virtual-machines-vs-docker-containers) By Nick Janetakis

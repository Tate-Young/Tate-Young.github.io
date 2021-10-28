---
layout: blog
front: true
comments: True
flag: Ops
background: gray
category: 后端
title: 记一些运维实践
date:   2019-02-02 17:54:00 GMT+0800 (CST)
update: 2021-10-28 20:59:00 GMT+0800 (CST)
background-image: /style/images/smms/linux.jpg
tags:
- Ops
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

![ods.png]( {{site.url}}/style/images/smms/ods.png )

**ETL** 分别是`Extract`、`Transform`、`Load`三个单词的首字母缩写，即"抽取"、"转换"、"装载"，由于不同原始数据库中的数据的来源、格式不一样，导致了系统实施、数据整合出现问题，ETL 就是用来解决这一问题的。ETL 包含了三方面:

* 抽取 - 将数据从各种原始的业务系统中读取出来，这是所有工作的前提
* 转换 - 按照预先设计好的规则将抽取得数据进行转换，使本来异构的数据格式能统一起来
* 装载 - 将转换完的数据按计划增量或全部导入到数据仓库中

## Elasticsearch

### 全文检索

[**Elasticsearch**](https://github.com/elastic/elasticsearch) 是一个实时的分布式搜索分析引擎，底层是开源库 Apache Lucene。它屏蔽了 Lucene 各种复杂的设置，为开发人员提供了很友好的便利，很多传统的关系型数据库也提供全文检索，有的是基于 Lucene 内嵌，有的是基于自研，与 Elasticsearch 比较起来，功能单一，性能也表现不是很好，扩展性几乎没有。ES 能让你以前所未有的速度和规模，去探索你的数据。它被用作**全文检索**、结构化搜索、分析以及这三个功能的组合。GitHub 也是使用 Elasticsearch 对海量代码进行查询。

> 另一个比较流行的搜索引擎也是基于 Lucene 开发的 [Apache Solr](https://solr.apache.org)，读作 "solar"。

**Elasticsearch 本质是一个数据库**，也需要有专门的 DBA 运维，只是更偏重应用层面，所以运维职责相对传统 DBA 没有那么严苛。对于集群层面必须掌握集群搭建，集群扩容、集群升级、集群安全、集群监控告警等；另外对于数据层面运维，必须掌握数据备份与还原、数据的生命周期管理，还有一些日常问题诊断等。

> 详细教程可以[查看这里](https://www.sojson.com/blog/81.html) 👈

### ELK 之 Kibana

著名的 **ELK** 三件套，讲的就是 **Elasticsearch，Logstash，Kibana**，专门针对日志采集、存储、查询设计的产品组合。当然现在已经发展成了 [**Elastic Stack**](https://www.elastic.co/what-is/elk-stack)。

Logstash 是一个开源的服务器端数据处理管道，可以同时从多个数据源获取数据，并对其进行转换，然后将其发送到你最喜欢的“存储”（当然可以就是 Elasticsearch）。

Kibana is a data visualization and exploration tool used for log and time-series analytics, application monitoring, and operational intelligence use cases. It offers powerful and easy-to-use features such as histograms, line graphs, pie charts, heat maps, and built-in geospatial support. Also, it provides tight integration with Elasticsearch, a popular analytics and search engine, which makes Kibana the default choice for visualizing data stored in Elasticsearch.

## ZooKeeper

[**ZooKeeper**](https://github.com/apache/zookeeper) 是开源的分布式应用程序协调服务。它是一个为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。已经作为核心组件被广泛应用在很多大型分布式系统中，包括 Hadoop、Hbase、Storm、Kafka、Dubbo 等。

Zookeeper 是一个由多个 server 组成的集群，一个 leader，多个 follower（这个不同于我们常见的 Master/Slave 模式）。leader 为客户端服务器提供读写服务，除了 leader 外其他的机器只能提供读服务。每个 server 保存一份数据副本全数据一致，分布式读 follower，写由 leader 实施更新请求转发，由 leader 实施更新请求顺序进行，来自同一个 client 的更新请求按其发送顺序依次执行数据更新原子性，一次数据更新要么成功，要么失败。全局唯一数据视图，client 无论连接到哪个 server，数据视图都是一致的实时性，在一定事件范围内，client 能读到最新数据。

![zookeeper](https://zookeeper.apache.org/doc/r3.7.0/images/zkservice.jpg)

## Kafka

## Zabbix

**Zabbix** 是一个基于 web 界面的提供分布式系统监视以及网络监视功能的企业级的开源解决方案，基于 `Server-Client` 架构。主要由两部分组成:

* **zabbix server** - 通过 SNMP、zabbix agent、ping，端口监视等方法提供对远程服务器/网络状态的监视，数据收集等功能
* **zabbix agent** - 安装在被监视的目标服务器上，它主要完成对硬件信息或与操作系统有关的内存、CPU 等信息的收集

具体安装方法可以[参考这篇文章](https://www.jianshu.com/p/49ef09f6d8db)

## Docker

**Docker** 容器并非虚拟机，但可以比喻为更轻量级的虚拟机。使用虚拟机运行多个相互隔离的应用时(以下翻译[参考自这里](http://www.techug.com/post/comparing-virtual-machines-vs-docker-containers.html)):

![virtual-machine-architecture.jpg]( {{site.url}}/style/images/smms/virtual-machine-architecture.jpg )

* 基础设施(Infrastructure) - 可以是个人电脑，数据中心的服务器，或者是云主机。
* 主操作系统(Host Operating System) - 运行的可能是 MacOS，Windows 或者某个 Linux 发行版。
* 虚拟机管理系统(Hypervisor) - 利用 Hypervisor(即上述的 ESXI)，可以在主操作系统之上运行多个不同的从操作系统。
* 从操作系统(Guest Operating System) - 假设你需要运行 3 个相互隔离的应用，则需要使用 Hypervisor 启动 3 个从操作系统，也就是 3 个虚拟机。这些虚拟机都非常大，也许有 700MB，这就意味着它们将占用 2.1GB 的磁盘空间。更糟糕的是，它们还会消耗很多 CPU 和内存。
* 各种依赖 - 每一个从操作系统都需要安装许多依赖。如果你使用 Ruby 的话，应该需要安装 gems；如果使用其他编程语言，比如 Python 或者 Node.js，都会需要安装对应的依赖库。
* 应用 - 安装依赖之后，就可以在各个从操作系统分别运行应用了，这样各个应用就是相互隔离的。

使用 Docker 容器运行多个相互隔离的应用时:

![docker-container.jpg]( {{site.url}}/style/images/smms/docker-container.jpg )

* 基础设施(Infrastructure) - 同上
* 主操作系统(Host Operating System) - 所有主流的 Linux 发行版都可以运行 Docker。对于 MacOS 和 Windows，也有一些办法"运行" Docker。
* Docker守护进程(Docker Daemon) - Docker 守护进程取代了 Hypervisor，它是运行在操作系统之上的后台进程，负责管理 Docker 容器。
* 各种依赖 - 对于 Docker，应用的所有依赖都打包在 Docker 镜像中，Docker 容器是基于 Docker 镜像创建的。
* 应用 - 应用的源代码与它的依赖都打包在 Docker 镜像中，不同的应用需要不同的 Docker 镜像。不同的应用运行在不同的 Docker 容器中，它们是相互隔离的。

虚拟机和 Docker 的一些对比:

Docker 守护进程可以直接与主操作系统进行通信，为各个 Docker 容器分配资源；它还可以将容器与主操作系统隔离，并将各个容器互相隔离。虚拟机启动需要数分钟，而 Docker 容器可以在数毫秒内启动。由于没有臃肿的从操作系统，Docker 可以节省大量的磁盘空间以及其他系统资源。

但并不是说虚拟机就被取代了，因为两者有不同的使用场景。虚拟机更擅长于彻底隔离整个运行环境。例如，云服务提供商通常采用虚拟机技术隔离不同的用户。而 Docker 通常用于隔离不同的应用，例如前端，后端以及数据库。

## AWS 云对象存储

随着业务的发展，需要管理急剧增加并且孤立的大量数据，这些数据来自很多被任意数量的应用程序和业务流程使用的来源。现在，很多公司都面临着碎片化存储产品带来的挑战。这些产品不仅增加了业务应用程序的复杂性，还减缓了其创新速度。对象存储能够提供可以大规模扩展并且经济高效的存储来以原生格式存储任何类型的数据，从而打破这些限制。

**AWS(Amazon Web Services)** 是 Amazon 公司旗下云计算服务平台，为全世界范围内的客户提供云解决方案。面向用户提供包括弹性计算、存储、数据库、应用程序在内的一整套云计算服务，帮助企业降低 IT 投入成本和维护成本。同类型的还可以了解下 [Azure](https://zh.wikipedia.org/wiki/Microsoft_Azure)、阿里云、腾讯云等。

## 端口映射和 DMZ 主机

**端口映射**是 [**网络地址转换(NAT)**](https://zh.wikipedia.org/wiki/网络地址转换) 的一种，就是将外网主机的 IP 地址的一个端口映射到内网中一台机器，提供相应的服务。当用户访问该 IP 的这个端口时，服务器自动将请求映射到对应局域网内部的机器上。端口映射有动态和静态之分。

内网的一台电脑要上因特网或者给因特网启动服务，就需要端口映射。例如要映射一台 IP 地址为 192.168.111.10 的 WEB 服务器，只需把服务器的 IP 地址和提供 web 服务的 TCP 端口 80 填入到路由器的端口映射表中即可。

**DMZ(demilitarized zone)** ，即"隔离区"或"非军事化区"。它是为了解决安装防火墙后外部网络不能访问内部网络服务器的问题，而设立的一个非安全系统与安全系统之间的缓冲区，这个缓冲区位于企业内部网络和外部网络之间的小网络区域内，在这个小网络区域内可以放置一些必须公开的服务器设施，如企业 Web 服务器、FTP 服务器和论坛等。另一方面，通过这样一个 DMZ 区域，更加有效地保护了内部网络，因为这种网络部署，比起一般的防火墙方案，对攻击者来说又多了一道关卡。 DMZ 主机就是一个开放所有端口的虚拟服务器。

> 端口映射只是映射指定的端口，DMZ 相当于映射所有的端口，并且直接把主机暴露在网关中，比端口映射方便但是不安全。且当设置了 DMZ 主机后，所有端口的映射都将指向 DMZ 主机，指向其他电脑的端口映射将无效。

## 全链路压测

### 压测指标及工具

**全链路压测**是基于线上真实环境和实际业务场景，通过模拟海量的用户请求，来对整个系统进行压力测试。相对于比较简单的压测，比如只对线上的单机或集群发起服务调用；将线上流量进行录制，然后在单台机器上进行回放等。能够更全面地进行链路覆盖。以下是我们需要关注的一些指标：

| 指标        |   描述   |
| ------------ | ------- |
| **qps**(query per second) | 每秒处理请求数 |
| **tps**(transactions per second) | 每秒处理的事务 |
| **hps**(hits per second) | 每秒点击次数 |
| **rt**(response time) | 响应时间，相当于 latency |
| CPU 使用率 | 出于节点宕机后负载均衡的考虑，一般 CPU 使用率小于 75% 比较合适 |
| 内存使用率 | 内存占用情况，一般观察内存是否有尖刺或泄露 |
| 缓存命中率 | 多少流量能命中缓存层（redis、memcached 等） |

> tps 一个完整事务可能包含一些列的请求过程。比如访问一个网页，可以当做一个事务，但是访问一个网页可能会对多个服务器发起多次请求，这些请求会当做多次 qps 计算在内。

> 一般情况下用 tps 来衡量整个业务流程，用 qps 来衡量接口查询次数，用 hps 来表示对服务器单击请求。

压测工具的选择也有很多，比如 [**Apache ab**](https://httpd.apache.org/docs/2.4/programs/ab.html)、[**Apache JMeter**](https://jmeter.apache.org)、[**locust**](https://locust.io) 等。也有一些轻量级的工具，如 [**wrk**](https://github.com/wg/wrk) 等，我们简单看下 wrk 的输出：

```shell
# This runs a benchmark for 30 seconds, using 12 threads, and keeping 400 HTTP connections open.
$ wrk -t12 -c400 -d30s http://127.0.0.1:8080/index.html

Running 30s test @ http://127.0.0.1:8080/index.html
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   635.91us    0.89ms  12.92ms   93.69%
    Req/Sec    56.20k     8.07k   62.00k    86.54%
  22464657 requests in 30.00s, 17.76GB read
Requests/sec: 748868.53
Transfer/sec:    606.33MB
```

### 流量录制及回放

一般针对比较大型的项目，容易出现漏测或者有很多没评估到的地方，如果用线上流量做一次回归测试，可以进一步减少 bug 的风险，同时大大节省构造测试数据的时间，提高测试效率。

![stress-testing]( {{site.url}}/style/images/smms/stress-testing.png )

> 一般流量回放只回放 get 请求，因为其他请求可能会对用户数据进行操作，有风险需要排除掉。

## API 网关

### 网关的作用

[摘自知乎](https://www.zhihu.com/question/309582197/answer/2077037990)。假设你正在开发一个电商网站，那么这里会涉及到很多后端的微服务，比如会员、商品、推荐服务等等。那么这里就会遇到一个问题，APP/Browser 怎么去访问这些后端的服务? 如果业务比较简单的话，可以给每个业务都分配一个独立的域名(https://service.api.company.com)，但这种方式会有几个问题:

1. 每个业务都会需要鉴权、限流、权限校验等逻辑，需要进行剥离
2. 比如淘宝、亚马逊打开一个页面可能会涉及到数百个微服务协同工作，如果每一个微服务都分配一个域名的话，一方面客户端代码会很难维护，另一方面是连接数的瓶颈。而且每上线一个新的服务，都需要运维参与，申请域名、配置 Nginx 等，当上线、下线服务器时，同样也需要运维参与，另外采用域名这种方式，对于环境的隔离也不太友好，调用者需要根据域名自己进行判断。
3. 后端每个微服务可能是由不同语言编写的、采用了不同的协议，比如 HTTP、Dubbo、GRPC 等，但是你不可能要求客户端去适配这么多种协议，这是一项非常有挑战的工作，项目会变的非常复杂且很难维护。后期如果需要对微服务进行重构的话，也会变的非常麻烦，需要客户端配合你一起进行改造，比如商品服务，随着业务变的越来越复杂，后期需要进行拆分成多个微服务，这个时候对外提供的服务也需要拆分成多个，同时需要客户端配合你进行改造，非常蛋疼。

![api gateway](https://pic1.zhimg.com/80/v2-0903a05306217b52effca6ebb80b45ea_1440w.jpg?source=1940ef5c)

因此可以实现一个 **API 网关(API Gateway)**接管所有的入口流量，类似 Nginx 的作用，将所有用户的请求转发给后端的服务器，但网关做的不仅仅只是简单的转发，也会针对流量做一些扩展，比如鉴权、限流、权限、熔断、协议转换、错误码统一、缓存、日志、监控、告警等，这样将通用的逻辑抽出来，由网关统一去做，业务方也能够更专注于业务逻辑，提升迭代的效率。通过引入 API 网关，客户端只需要与 API 网关交互，而不用与各个业务方的接口分别通讯。

服务调用方（内部和外部）同时通过 nginx 和 API 网关访问服务提供方示意图如下：

![api-gateway-consul-nginx]( {{site.url}}/style/images/smms/api-gateway-consul-nginx.png )

调用方到提供方经过 API 网关的整个链路的各个环节示意图如下：

![api-gateway-consul]( {{site.url}}/style/images/smms/api-gateway-consul.png )

### consul 服务发现

[参考这里](https://cloud.tencent.com/developer/article/1444664)。微服务的框架体系中，**服务发现**是不能不提的一个模块。我们看看以前的方案。客户端的一个接口，需要调用服务 A-N。客户端必须要知道所有服务的网络位置的，以往的做法是配置是配置文件中，或者有些配置在数据库中。这里就带出几个问题：

1. 需要配置 N 个服务的网络位置，加大配置的复杂性
2. 服务的网络位置变化，都需要改变每个调用者的配置
3. 集群的情况下，难以做负载（反向代理的方式除外）

![consul-before]( {{site.url}}/style/images/smms/consul-before.png )

我们再对比下加了服务发现的效果。服务 A-N 把当前自己的网络位置注册到服务发现模块，服务发现就以 K-V 的方式记录下，K 一般是服务名，V 就是 IP:PORT。服务发现模块会定时轮询查看这些服务是否能够正常访问（健康检查）。客户端在调用服务 A-N 的时候，就跑去服务发现模块问下它们的网络位置，然后再调用它们的服务。客户端完全不需要记录这些服务网络位置，客户端和服务端完全解耦！

![consul-after]( {{site.url}}/style/images/smms/consul-after.png )

> 做服务发现的框架除了 consul 外，常用的还有 zookeeper、eureka、etcd 等。

## 开源许可证对比

![mit]( {{site.url}}/style/images/smms/mit.jpg )

## 参考链接

1. [zabbix 从听说到学会](https://www.jianshu.com/p/49ef09f6d8db) By JokerW
2. [Zabbix 3.0 从入门到精通(zabbix 使用详解)](https://www.cnblogs.com/clsn/p/7885990.html) By 惨绿少年
3. [Comparing Virtual Machines vs Docker Containers](https://nickjanetakis.com/blog/comparing-virtual-machines-vs-docker-containers) By Nick Janetakis
4. [端口映射和 dmz](https://blog.csdn.net/shaochat/article/details/40583937) By 吾心安处方是家
5. [录制线上流量做回归测试的正确打开方式](https://testerhome.com/topics/25641) By 少年

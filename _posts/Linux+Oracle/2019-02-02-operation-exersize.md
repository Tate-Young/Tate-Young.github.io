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

里面还涉及到 **Vmware vSphere Client** 和 **vCenter** 的概念。

## FTP 服务器

**FTP**(File Transfer Protocol Server) 服务器是依照 FTP 协议提供服务，在互联网上提供文件存储和访问服务的计算机。参考这里可以了解到如何在 Linux 和 window server 2008 R2 系统下进行 [FTP 服务器的搭建](/style/files/ftp.pdf) 👈

## 文件服务器

在局域网中，以文件数据共享为目标，需要将供多台计算机共享的文件存放于一台计算机中。这台计算机就被称为**文件服务器**。参考这里可以了解到如何在 Linux 和 window server 2008 R2 系统下进行[文件服务器的搭建](/style/files/fileServer.pdf) 👈

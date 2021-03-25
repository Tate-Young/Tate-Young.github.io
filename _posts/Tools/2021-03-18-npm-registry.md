---
layout: blog
front: true
comments: True
flag: NPM
background: green
category: 前端
title: NPM 私有仓库搭建
date: 2021-03-22 16:56:00 GMT+0800 (CST)
background-image: /style/images/smms/node.jpg

tags:
- NPM
---
# {{ page.title }}

> 目前文章主要摘自[npm 私有仓库工具 Verdaccio 搭建 - 匠心博客](https://zhaomenghuan.js.org/blog/npm-private-repository-verdaccio.html)，后续会补上自己的实践

## 为什么需要 npm 私有仓库

在构建前端项目的过程中，核心包、开发脚手架、前端组件库等 JS SDK 依赖资源需要依托于 npm 去管理。而对于企业开发来说，不能将核心代码上传到完全开放的公网环境，所以一般会搭建企业内部 npm 私有仓库。

![npm registry](https://zhaomenghuan.js.org/assets/img/private-npm.f27dab4e.jpg)

用户 install 后向私有 npm 发起请求，服务器会先查询所请求的这个模块是否是我们自己的私有模块或已经缓存过的公共模块，如果是则直接返回给用户；如果请求的是一个还没有被缓存的公共模块，那么则会向上游源请求模块并进行缓存后返回给用户。上游的源可以是 npm 仓库，也可以是淘宝镜像。

## 如何搭建

npm 私有仓库搭建有以下几种方式:

1. 付费购买 npm 企业私有仓库
2. 使用 git + ssh 这种方式直接引用到 GitHub 项目地址
3. 开源代码源代码方式或者 docker 化构建

常用的 npm 私有仓库框架:

* [Nexus](https://www.sonatype.com/nexus-repository-oss) - Java 社区的一个方案，可以用于 Maven、npm 多种类型的仓库，界面比较丑，配置相对于复杂
* [Sinopia](https://github.com/rlidwka/sinopia) - 基于 Node.js 构建的，已经年久失修不维护了。替代者是下面的 Verdaccio
* [**Verdaccio**](https://verdaccio.org) - 通过 fork Sinopia 进行改造的；比较偏向于一个零配置、轻量型的私有 npm 模块管理工具，不需要额外的数据库配置，它内部自带小型数据库，支持私有模块管理的同时也支持缓存使用过的公共模块，发布及缓存的模块以静态资源形式本地存储
* [**cnpm**](https://cnpmjs.org) - cnpm 支持静态配置型用户管理机制，以及分层模块权限设置，可以实现公共模块镜像更新以及私有模块管理，支持拓展多种存储形式，相对的数据库的配置较多，部署过程略复杂，是淘宝及多家大型公司搭建内部私有 npm 仓库选择的方案
* [cpm](https://github.com/cevio/cpm)
* [npmfrog](https://github.com/dmstern/npmfrog)

常用的仓库地址:

1. [npm](https://registry.npmjs.org)
1. [cnpm](http://r.cnpmjs.org)
1. [taobao](https://registry.npm.taobao.org)
1. [nj](https://registry.nodejitsu.com)
1. [rednpm](http://registry.mirror.cqupt.edu.cn)
1. [npmMirror](https://skimdb.npmjs.com/registry)
1. [edunpm](http://registry.enpmjs.org)

### Verdaccio

[**Verdaccio**](https://verdaccio.org) 是一个 Node.js 创建的轻量的私有 npm proxy registry。提供 Docker 和 Kubernetes 支持；与 yarn, npm 和 pnpm 100% 兼容；forked 于 sinopia@1.4.0 并且 100% 向后兼容:

![verdaccio](https://zhaomenghuan.js.org/assets/img/verdaccio.1ea892c6.png)

要想在本地体验一下的话十分方便，只用全局装上依赖并启动服务即可:

```SHELL
# 安装
npm install -g verdaccio
yarn global add verdaccio
pnpm install -g verdaccio

# 安装完毕后，启动
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/4.8.1
```

打开 `http://localhost:4873` 就可以看到已经启动起来了:

![verdaccio page](https://zhaomenghuan.js.org/assets/img/verdaccio-docker.4f5f3a9a.png)

下面介绍一下 docker 部署方式，当然还有其他的方式，这里就不做介绍了:

```SHELL
# 拉取 Verdaccio 的 docker 镜像：
docker pull verdaccio/verdaccio
# 在根目录下创建 docker 文件
mkdir -p ~/docker/data
cd ~/docker/data
# 从 git 拉取示例到 data 到目录下
git clone https://github.com/verdaccio/docker-examples
cd ~/docker/data/docker-examples
# 移动配置文件
mv docker-local-storage-volume ~/docker/verdaccio
# 设置文件夹权限
chown -R 100:101 ~/docker/verdaccio
# 启动镜像 - 使用 docker-compose 启动:
cd ~/docker/verdaccio
docker-compose build
docker-compose up

# 或者使用 docker run 命令启动:
V_PATH=~/docker/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

### cnpmjs.org

[**cmpjs.org**](https://github.com/cnpm/cnpmjs.org/wiki/Deploy) 服务搭建是需要数据库支撑的，官方提供了 `mysql、sqlite、postgres、mariadb` 等数据库的支持，在这里我们选用 mysql 来提供数据服务。具体搭建方式官方文档已经很详细了，这里只是带过一下:

```SHELL
# clone from github
git clone git://github.com/cnpm/cnpmjs.org.git $HOME/cnpmjs.org
cd $HOME/cnpmjs.org

# create mysql tables
mysql -u yourname -p # 登陆
mysql> create database cnpmjs # 创建数据库
mysql> use cnpmjs; # 切换到 cnpmjs 数据库
mysql> source docs/db.sql # 导入 cnpm 数据库配置文件，生成 tables
```

![tables](https://static001.infoq.cn/resource/image/fe/38/fe14be5e55782b6a25fb5b70dee42538.png)

设置 `config/config.js`:

```JS
module.exports = {
  debug: false,
  enableCluster: true, // enable cluster mode
  enablePrivate: true, // enable private mode, only admin can publish, other user just can sync package from source npm
  database: {
    db: 'cnpmjstest',
    host: 'localhost',
    port: 3306,unknown database cnpmjs
    username: 'cnpmjs',
    password: 'cnpmjs123'  
  },
  admins: {
    admin: 'admin@cnpmjs.org',
  },
  syncModel: 'exist' // 'none', 'all', 'exist'
}
```

安装所有依赖和启动，服务启动后会监听两个端口，分别是:

* 7001 - registry 端口，用来在命令行发布，下载包等对用的远程 registry 地址
* 7002 - web 端口，用来在 web 端查看仓库信息，搜索包，包信息等

```SHELL
# 安装依赖
npm install --build-from-source --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/mirrors/node

# 启动服务
npm start
```

## 私有包管理

### 发布 publish

我们成功启动服务后，便可以进行发布 npm 包，并在上面进行管理和查看，一般我们有以下几种发布方式:

#### 指定 registry

```SHELL
# 添加用户 - 输入 username、password 以及 Email 即可
npm adduser --registry http://localhost:4873

# 登录
npm login --registry http://localhost:4873
# 上传私有包
npm publish --registry http://localhost:4873
```

#### 配置 .npmrc/.yarnrc

```SHELL
# .npmrc
registry=http://localhost:4873

# .yarnrc
registry "http://localhost:4873/"
```

关于 `.yarnrc` 的配置，详情可以[参考这里](https://gemfury.com/help/private-yarn/)，我们还可以去定义 scope 包，需要注意的是 scope 名字要与 package.json 里的 name 字段保持一致:

```SHELL
# .npmrc
@username:registry=http://localhost:4873

# .yarnrc
"@username:registry" "http://localhost:4873/"
```

#### 配置 publishConfig

```JSON
// package.json
{
  "publishConfig": {
    "registry": "http://localhost:4873"
  }
}
```

```SHELL
[GetColors] npm publish
# npm notice 
# npm notice 📦  @image-process-library/get-colors@1.0.0
# npm notice === Tarball Contents === 
# npm notice 518B  package.json           
# npm notice 1.2kB README.md              
# npm notice 1.8kB __tests__/index.spec.ts
# npm notice 1.6kB src/index.ts           
# npm notice === Tarball Details === 
# npm notice name:          @image-process-library/get-colors       
# npm notice version:       1.0.0                                   
# npm notice package size:  2.1 kB                                  
# npm notice unpacked size: 5.1 kB                                  
# npm notice shasum:        58c078a5258de6df3c75fa58f953aa4006b49bb0
# npm notice integrity:     sha512-VIiqpQD45lpjB[...]lOwgKyP1YKAgA==
# npm notice total files:   4                                       
# npm notice 
# + @image-process-library/get-colors@1.0.0
```

> 每次发布时版本号不能相同，否则无法发布成功

### 安装 install

同样，从 npm 私有仓库下载依赖，我们也有几种方式:

#### nrm 指定 registry

```SHELL
# 设置仓库源
npm set registry http://localhost:4873
# 安装
npm install

# 或者
npm install <packagename> --registry=http://localhost:4873
```

上面切换 registry 显然不推荐，需要指定和切换不同的 npm 源，当然我们可以通过管理工具 **nrm** 来稍微减少点工作量，具体可以[参考这篇博客]( {{site.url}}/2018/06/27/npm-scripts.html#nrm ) 👈

#### 配置 .npmrc/.yarnrc

配置同发布，都需要在项目根目录下创建。

### 撤回 unpublish

```SHELL
# 彻底移除一个包:
npm unpublish <packagename> --force

# 移除指定个一个版本：
npm unpublish <packagename>@1.0.0
```

### scope 管理发布包

经常有看到 `@xxx/yyy` 类型的开源 npm 包，原因是包名称难免会有重名，如果已经有人在 npm 上注册该包名，再次 npm publish 同名包时会告知发布失败，这时可以通过 scope 作用域来解决:

```JSON
// package.json
{
  "name": "@username/project-name"
}
```

> 需要注意的是，如果是发布到官方 registry，scope 一定要是自己注册的用户名，而如果是发布到自己的 npm 私服，scope 可以不是用户名

作用域模块默认发布是私有的，发布到官方 registry 时，直接 npm publish 会报错，原因是只有付费用户才能发布私有 scope 包，免费用户只能发布公用包，因此需要添加 `access=public` 参数。npm 私服则不用加该参数:

```JSON
// package.json
{
  "publishConfig": {
    "access": "public"
  }
}
```

```SHELL
# 安装
npm install @username/project-name
```

## 参考链接

1. [npm 私有仓库工具 Verdaccio 搭建 - 匠心博客](https://zhaomenghuan.js.org/blog/npm-private-repository-verdaccio.html)

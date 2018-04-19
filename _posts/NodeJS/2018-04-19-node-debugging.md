---
layout: blog
back: true
comments: True
flag: Node
background: gray
category: 后端
title:  NodeJS Debugging
date:   2018-04-19 21:48:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/06/5ac6ee540387c.jpg
tags:
- NodeJS
---
# {{ page.title }}

## Node 侦错

本文只针对 VS code 工具进行调试举例。需要额外插件一枚: [Debugger for Chrome](https://github.com/Microsoft/vscode-chrome-debug)，可以配合 Chrome 进行调试。

![debug](https://code.visualstudio.com/assets/docs/editor/debugging/debugging_hero.png)

### launch 配置

**launch.json** 文件配置里的有两个重要的属性 **type** 和 **request**，取值为:

* **type** - 设置需要启动的调试类型，选项是根据所安装的 debug 插件决定，如 "node" for built-in node debugger
* **request** - 设置需要启动的 request 类型，有两种取值:
  * **launch** - 启动一个独立的具有 debug 模式的程序
  * **attach** - 附加于已启动的程序并进行 debug

当配置完成后，会在根目录下自动生成文件 <code>.vscode/launch.json</code>。配置参数选项有很多，可以直接[参考官网文档](https://code.visualstudio.com/Docs/editor/debugging)。

```JSON
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/app.js",
      "stopOnEntry": false,
      "args": [],
      "cwd": "${workspaceRoot}",
      "preLaunchTask": null,
      "runtimeExecutable": null,
      "runtimeArgs": [
        "--nolazy"
      ],
      "env": {
        "NODE_ENV": "development"
      },
      "externalConsole": false,
      "sourceMaps": false,
      "outDir": null
    },
    {
      "name": "Attach",
      "type": "node",
      "request": "attach",
      "port": 5858,
      "address": "localhost",
      "restart": false,
      "sourceMaps": false,
      "outDir": null,
      "localRoot": "${workspaceRoot}",
      "remoteRoot": null
    }
  ]
}
```

此处作为测试，作如下配置:

```JSON
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch myTest",
      "program": "${workspaceFolder}/index.js"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach myTest",
      "port": 9229
    }
  ]
}
```

### launch

根据 launch.json 配置选项，选择 "Launch myTest" 模式并执行，此时控制台输出:

```SHELL
/usr/local/bin/node --inspect-brk=11561 index.js
Debugger listening on ws://127.0.0.1:11561/ba83731f-67bb-484e-8e7d-4ed842f62a60
Debugger attached.
listening on port 8080
```

此时 Chrome 上打开 <code>localhost:8080</code> 即可进行断点调试，但代码有修改的话，必须重新监听。

### attach

根据 launch.json 配置选项，选择 "Attach myTest" 模式，但注意在执行 debug 之前必须让程序启动，否则会报错:

```TEXT
Cannot connect to runtime; make sure that runtime is in 'legacy' debug mode.
```

这里使用 **nodemon** 做示例，但根据协议需要新增模式参数的选择:

* **Legacy Protocol** - **--debug** 模式，默认 **5858** 端口，一般用于旧版 Node (< 6.3)
* **Inspector Protocol** - **--inspect** 模式，默认 **9229** 端口，一般用于新版 Node (>= 6.3)

```SHELL
nodemon --debug index.js

# 或
nodemon --inspect index.js
```

监听之后执行 debug，终端会显示 "Debugger attached."，另外底边栏会有 <code>Auto Attach:Off</code> 状态，点击可切换为 On 状态，即当内容有修改后，会自动进行 attach 操作。

## nodemon / supervisor

两种监听文件改动并重启服务的方式，还可以搭配 **[Browsersync](https://browsersync.io/)** 实现客户端自动刷新:

* **[nodemon](https://github.com/remy/nodemon)** - 占用内存更少，易扩展
* **[supervisor](https://github.com/Supervisor/supervisor)**

```SHELL
nodemon index.js
```

两种在生产环境部署 node 服务的方式:

* **[forever](https://github.com/foreverjs/forever)**
* **[PM2](https://github.com/Unitech/pm2)**

| Feature | Forever | PM2 |
|:--------------|:---------|:---------|
| Keep Alive | ✔ | ✔ |
| Coffeescript | ✔ |  |
| Log aggregation |  | ✔ |
| API |  | ✔ |
| Terminal monitoring |  | ✔ |
| Clustering |  | ✔ |
| JSON configuration |  | ✔ |

```SHELL
pm2 start index.js
pm2 stop index.js

# 查看监控界面
pm2 list
```

![pm2](https://raw.githubusercontent.com/unitech/pm2/master/pres/pm2-list.png)

## 参考链接

1. [Visual Studio Code - Debugging](https://code.visualstudio.com/Docs/editor/debugging)
2. [Visual Studio Code 前端调试不完全指南](http://jerryzou.com/posts/vscode-debug-guide/) By Jerry
3. [Running Nodejs applications in production forever vs supervisord vs pm2](https://mrvautin.com/running-nodejs-applications-in-production-forever-vs-supervisord-vs-pm2/) By mrvautin
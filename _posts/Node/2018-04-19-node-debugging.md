---
layout: blog
back: true
comments: True
flag: Node
background: gray
category: 后端
title:  Node 侦错
date:   2018-04-19 21:48:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/04/19/5ad8a8e7dce53.jpg
tags:
- Node
---
# {{ page.title }}

本文只针对 VS code 工具进行调试举例。需要额外插件一枚: [Debugger for Chrome](https://github.com/Microsoft/vscode-chrome-debug)，可以配合 Chrome 进行调试。

![debug](https://code.visualstudio.com/assets/docs/editor/debugging/debugging_hero.png)

## launch.json 配置

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

## 断点

单击编辑器侧边缘即可为所在行添加或删除断点，调试时在 BREAKPOINTS 区域中也可对断点进行操作(enable/disable/reapply)。

* 断点一般显示为红色圆圈
* 被取消的断点显示为灰色圆圈
* 调试启动后，不能被注册的断点显示为灰色的空心圆圈

也可以通过代码语句 <code>debugger</code> 设置断点:

```JS
app.get('/', function(req, res) {
  console.log('tate')
  debugger // 相当于断点
  res.send('bbb')
})
```

![breakpoints](https://code.visualstudio.com/assets/docs/editor/debugging/debug-session.png)

## nodemon / supervisor

两种监听文件改动并重启服务的方式，还可以搭配 **[Browsersync](https://browsersync.io/)** 实现客户端自动刷新:

* **[nodemon](https://github.com/remy/nodemon)** - 占用内存更少，易扩展
* **[supervisor](https://github.com/Supervisor/supervisor)**

```SHELL
nodemon index.js

# 也可省略写法，默认找 index.js
nodemon
```

## pm2

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
# 启动一个 node 程序
pm2 start index.js
# 启动并取别名
pm2 start index.js --name application1
# 在文件改变的时候会重新启动程序
pm2 start index.js --watch

# 中止进程，指定进程 id 或名称，
pm2 stop 0

# 删除进程，all 则删除所有
pm2 delete 0

# 查看详情
pm2 describe 0

# 查看进程的资源消耗情况
pm2 monit

# 重启进程，也可用 restart
# Use reload instead of restart for 0-seconds downtime reloads
# restart 是先 kill 然后重启，而 reload 反之，故不会停机
pm2 reload 0

# 查看日志
pm2 logs 0

# 集群 cluster 启动
# -i 表示 number-instances 实例数量
# max 表示 PM2将自动检测可用CPU的数量 可以自己指定数量
pm2 start start.js -i max

# 查看监控界面，可简写为 pm2 l
pm2 list
```

![pm2](https://raw.githubusercontent.com/unitech/pm2/master/pres/pm2-list.png)

## 参考链接

1. [Visual Studio Code - Debugging](https://code.visualstudio.com/Docs/editor/debugging)
2. [Visual Studio Code 前端调试不完全指南](http://jerryzou.com/posts/vscode-debug-guide/) By Jerry
3. [Running Nodejs applications in production forever vs supervisord vs pm2](https://mrvautin.com/running-nodejs-applications-in-production-forever-vs-supervisord-vs-pm2/) By mrvautin
4. [PM2 官方文档](https://pm2.io/doc/en/runtime/quick-start/?utm_source=pm2&utm_medium=website&utm_campaign=rebranding)

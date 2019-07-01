---
layout: blog
front: true
comments: True
flag: Other
background: green
category: 前端
title: 记各种调试和兼容问题
date:   2018-07-20 11:01:00 GMT+0800 (CST)
update: 2019-07-01 14:40:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- Other
---
# {{ page.title }}

## 抓包

### Charles

[Charles](https://www.charlesproxy.com/) 主要的功能包括:

* 截取 Http 和 Https 网络封包
* 支持重发网络请求，方便后端调试
* 支持修改网络请求参数
* 支持网络请求的截获并动态修改 Edit
* 支持模拟慢速网络 Throttle

在做移动开发时，常常需要截取网络封包来分析，更多使用方法可[参考这里](https://blog.devtang.com/2015/11/14/charles-introduction/):

1、在 Charles 设置代理，端口默认为 8888

[![charles-proxy.png](https://i.loli.net/2018/07/20/5b5141425a210.png)](https://i.loli.net/2018/07/20/5b5141425a210.png)

2、在 移动端 设置代理，服务器地址即是本机的 ip 地址，端口号即在步骤 1 中设置的 Charles 代理端口号

[![charles-iphone-proxy.jpg](https://i.loli.net/2018/07/20/5b5141421339c.jpg)](https://i.loli.net/2018/07/20/5b5141421339c.jpg)

若针对 https 抓包:

1、首先在<code>Help --> SSL Proxying --> Install Charles Root Certificate</code>安装根证书;

2、在钥匙串中选择始终信任:

![debugger-charles-ssl.png](https://i.loli.net/2018/11/23/5bf7700990d1e.png)

3、其次点击<code>Help --> SSL Proxying --> Install Charles Root Certificate ... or Remote Browser</code>，按照提示在手机等设备安装证书，网址 <code>chls.pro/ssl</code>，切记安装完后，ios 一般要在 <code>设置 --> 通用 --> 关于本机 --> 证书信任设置</code> 里设置证书启用完全信任:

![debugger-charles-ssl-device.png](https://i.loli.net/2018/11/23/5bf770e96b33b.png)

4、点击<code>Proxy --> SSL Proxying Settings</code>进行 SSL 代理设置，https 端口设置 443:

![debugger-charles-ssl-settings.png](https://i.loli.net/2018/11/23/5bf7740529688.png)

### mitmproxy

1、安装和设置代理

```SHELL
brew install mitmproxy
```

2、启动服务，端口默认为 8080

```SHELL
mitmproxy -p 8888
```

3、在 移动端 设置代理，同上

4、在 移动端 安装 CA 证书(https 抓包)，直接在浏览器输入地址 <code>mitm.it</code> 并安装对应证书即可

![debugger-mitmproxy.jpg](https://i.loli.net/2018/11/16/5bedb616ee92d.jpg)

常用的快捷键操作:

| 快捷键           | 描述      |
| ------------ | ------- |
| q | 返回 |
| z | 清空 |
| f | 过滤 filter |
| i | 拦截 intercept |
| r | 重新请求 |
| esc | 退出编辑 |
| fn | 按住拖动光标即可选中 |

当然 mitmproxy 还可以直接运行 py 脚本:

```Python
# mitm.py
from mitmproxy import ctx

# 打印请求报文
def request(flow):
  ctx.log.warn(str(flow.request.headers))
  print(flow.request.path) # 请求路径
  print(flow.request.method) # 请求方法
  print(flow.request.url) # 请求路径
  print(flow.request.host) # 请求主机名

# 打印响应体
# def response(flow):
#   print(flow.response.status_code) # 响应体状态码
#   print(flow.response.text) # 响应体文本
```

之后运行以下命令，即可直接打印:

```SHELL
mitmproxy -s mitm.py
```

![mitmproxy-py.png](https://i.loli.net/2019/05/23/5ce6186fb9af064650.png)

> 如果装了 mitmproxy 证书的话还是无效，可以试试 **-k** 参数，它可以强制忽略证书安全 😋

> window 操作系统不支持使用 mitmproxy 命令，而是使用 mitmdump 或 mitmweb，虽然他们也支持同样的参数，但功能上还是比较弱一点(吐槽 🤮)

## 手机网页调试

### IOS

1、直接打开<code>设置 --> safari 浏览器 --> 高级 --> Web 检查器/Javascript</code>;

2、将手机连接至电脑，在 safari 开发者模式下调试就 OK 了。

### android

1、一般是打开<code>设置 --> 开发者选项 --> USB 调试</code>;

2、在 chrome 浏览器输入 <code>chrome://inspect/#devices</code> 打开 inspect 调试器，上面会显示所连接的设备上的页面，点击 inspect 就可以调试啦。

![debugger-inspect.png](https://i.loli.net/2018/11/22/5bf616017176c.png)

## Chrome 小技巧

此篇开发者小技巧基本转载自[这篇博客](https://www.w3cplus.com/tools/dev-tips.html) 👈

### Console 面板

1、Console - 修改页面元素及内容

获取元素节点后右键选择 `Edit as HTML` 或者 `Edit Text`。修改后的内容会实时反映在页面和 Elements 面板上:

![chrome tip 1](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/console-edit-html.gif)

2、Console - 输入交互

通过 `Object.defineProperty` 方法为全局变量 window 添加属性，并在 `getter` 时进行一系列操作:

```JS
Object.defineProperty(window, 'tate', {
  get() {
    return 'snow';
  }
})
```

这时候你在控制台输入 'tate'，则会打印出返回值 'snow'。

> 指令 `console` 也有超多的用法，具体可以[参考以前的博客]( {{site.url}}/2018/03/13/js-console.html ) 👈

### Sources 面板

1、Sources - 通过 `:` 跳转到指定行和字符

使用 `cmd + O` 快捷键打开搜索框，输入 `?` 会提示支持的一些符号语法，比如 `:` 可以跳转到指定行和字符，如 `:5:9` 则表示跳转到文件的第五行第九个字符:

![chrome tip 1](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/go-to-column.gif)

2、Sources - 光标位置跳转

使用 `alt + -` 和 `alt + =` 可以在上一个和下一个鼠标位置之间跳转，类似 vscode 设置的 `Go Back` 和 `Go Foward`:

![chrome tip 2](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/editing-locations.gif)

3、Sources - 条件断点

为 JS 代码设置条件断点，该断点只在条件满足时触发:

![chrome tip 3](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/conditional-breakpoint.gif)

> 资源面板下搜索定位需要调试的文件 Tips: Chrome 快捷键为 `cmd+o`，safari 快捷键为 `cmd+shift+o`(可能各自设定不一样) 👈

### Elements 面板

1、Elements - 搜索

使用 `cmd + F` 打开搜索框，除了常规字符串还可以使用选择器来选择 HTML 元素，如 `#root > div`:

![chrome tip 1](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/dom-search-by-selector.gif)

2、Elements - 转换和复制图片的 base64 编码

在预览图片上右键选择 `copy image as Data URI`，可以将图片转换为 base64 编码:

![chrome tip 2](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/copy-as-data-uri.gif)

3、Elements - 数值调整快捷键

这个用得还是比较多的，有四种方式可以调整:

* `up / down` - 增加或减少 1 单位
* `shift + up / down` - 增加或减少 10 单位
* `alt + up / down` - 增加或减少 0.1 单位

![chrome tip 3](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/is-running.gif)

4、Elements - 使用 `animation 检查器`可以检查运行中的 CSS 动画属性

![chrome tip 4](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/animation-inspector.gif)

### Network 面板

1、Network - 查看正在运行的网络请求

在 filter 输入框输入 `is:running` 指令可以查看正在进行中的网络请求:

![chrome tip 1](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/is-running.gif)

2、Network - 手动阻塞网络请求

右键选择 `Block request URL` 则可以手动阻塞 URL 的加载，用于测试资源获取失败的页面效果，取消则再次选择点击 `Unblock xxx`:

![chrome tip 2](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/block-requests.gif)

3、Network - 跨页面加载保存请求

要跨页面加载保存请求，则需要勾选 `Preserve log` 复选框。 在停用之前，DevTools 会保存所有请求:

![chrome tip 3](https://developers.google.com/web/tools/chrome-devtools/network/imgs/preserve-log.svg)

4、Network - 模拟离线和慢速网络连接

勾选 `Offline` 复选框以模拟完全离线的网络体验；在 `Network Throttling` 菜单中模拟 2G、3G 和其他连接速度，也可以自定义:

![chrome tip 4](https://developers.google.com/web/tools/chrome-devtools/network/imgs/network-panel-throttling-menu.svg)

### 其他

1、通过 `cmd + [` 或 `cmd + ]` 循环切换开发者工具的各个面板

![chrome tip 1](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/cycle-panel-shortcut.gif)

2、修改开发者工具的样式

将开发者工具从浏览器独立出来之后，使用 `cmd + alt + i` 将创建另一个开发者工具，可以用于修改第一个开发者工具的样式:

![chrome tip 2](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/inspect-the-inspector.gif)

3、可视化资源依赖关系

通过按住 `shift` 可查看可视化资源依赖关系：绿色资源为初始化资源，红色资源由绿色资源引入:

![chrome tip 3](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/network-dependency.gif)

## Safari

### 事件监听点击失效

比如存在如下标签，绑定了事件监听:

```HTML
<div>按钮</div>
```

在手机 safari 浏览器中点击该按钮会发现无法触发点击事件，解决方案如下:

* 直接在按钮上绑定事件处理器
* 在 div 上添加样式 <code>cursor: pointer</code>
* 给 div 上加 <code>onclick='void(0);'</code>
* 将 div 换成其他可点击元素 a、button 等

1. [Charles - 官网](https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/)
2. [Charles 从入门到精通](https://blog.devtang.com/2015/11/14/charles-introduction/) By 唐巧
3. [iOS Safari 点击事件失效](https://blog.zfanw.com/ios-safari-click-not-working/) By 陈三
4. [Chrome 35 个开发者工具的小技巧](https://www.w3cplus.com/tools/dev-tips.html) By 南北
5. [网络分析参考 network performance - Google](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#timing-explanation) By Kayce Basques
6. [安装 mitmproxy 以及遇到的坑和简单用法](https://segmentfault.com/a/1190000017956646) By sergiojune

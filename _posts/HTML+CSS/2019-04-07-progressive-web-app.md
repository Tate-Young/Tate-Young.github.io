---
layout: blog
front: true
comments: True
flag: PWA
background: purple
category: 前端
title:  PWA 简介
date:   2019-04-07 23:40:00 GMT+0800 (CST)
update: 2019-04-10 11:30:00 GMT+0800 (CST)
background-image: https://i.udemycdn.com/course/240x135/1233648_31e5_3.jpg
tags:
- pwa
---
# {{ page.title }}

## 什么是 PWA

**PWA(Progressive Web App)** 即渐进式网络应用，PWA 可以将 Web 和 App 各自的优势融合在一起，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验。其核心技术包括:

* **App Manifest** - Web 应用程序清单，实现可安装
* **Service Worker** - 后台运行的独立线程，实现离线使用
* **Web Push & Notification** - 消息推送和提醒

> 此博客基本转自 alienzhou 的[2018，开始你的 PWA 学习之旅](https://alienzhou.gitbook.io/learning-pwa/2018-kai-shi-ni-de-pwa-xue-xi-zhi-lv)

## Manifest

[**Manifest**](https://developer.mozilla.org/zh-CN/docs/Web/Manifest) 是一个 JSON 格式的文件，你可以把它理解为一个指定了 Web App 桌面图标、名称、开屏图标、运行模式等一系列资源的一个清单。创建好后直接通过 meta 标签来使用:

```HTML
<!-- 在 index.html 中添加以下 meta 标签 -->
<link rel="manifest" href="/manifest.json">
```

```JSON
{
  "name": "HackerWeb",
  "short_name": "HackerWeb", # 当没有足够空间展示应用的 name 时，系统就会使用 short_name
  "start_url": "./?utm_source=web_app_manifest", # 指定用户从设备启动应用程序时加载的 URL。 如果以相对 URL 的形式给出，则基本 URL 将是 manifest 的 URL
  "display": "standalone", # 定义开发人员对 Web 应用程序的首选显示模式
  "background_color": "#fff", # 为 web 应用程序预定义的背景颜色
  "orientation": "portrait", # 定义所有 Web 应用程序顶级的默认方向 browsing contexts
  "description": "A simply readable Hacker News app.",
  "icons": [{
    "src": "images/touch/homescreen48.png",
    "sizes": "48x48",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen72.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen192.png",
    "sizes": "192x192",
    "type": "image/png"
  }],
  "related_applications": [{ # 指定一个“应用程序对象”数组，代表可由底层平台安装或可访问的本机应用程序
    "platform": "web"
  }, {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
  }]
}
```

其中 `display` 是用来定义开发人员对 Web 应用程序的首选显示模式:

| 显示模式 | 描述 | 后备显示模式 |
|:-----|:-----|
| fullscreen | 全屏显示, 所有可用的显示区域都被使用, 并且不显示状态栏 | standalone |
| standalone | 独立应用模式，这种模式下打开的应用有自己的启动图标，并且不会有浏览器的地址栏。因此看起来更像一个 Native App | minimal-ui |
| minimal-ui | 与 standalone 相比，会有浏览器地址栏，样式因浏览器而异 | browser |
| browser | 该应用程序在传统的浏览器标签或新窗口中打开，具体实现取决于浏览器和平台。 这是默认的设置 | None |

## Service Worker

[**Service Worker**](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers) 可以简单理解为一个独立于前端页面，在后台运行的进程。它有一个非常重要的特性：你可以在 Service Worker 中监听所有客户端(Web)发出的请求，然后通过它来代理，向后端服务发起请求。通过监听用户请求信息，Service Worker 可以决定是否使用缓存来作为 Web 请求的返回。因此它是实现离线访问的核心，下图展示普通 Web App 与添加了 Service Worker 的 Web App 在网络请求上的差异:

![service worker](https://user-gold-cdn.xitu.io/2018/4/8/162a560d0bdb6ed1?w=567&h=271&f=png&s=14952)

> Service Worker 是一个特殊类型的 woker 上下文运行环境，与主运行线程（执行脚本）相独立，同时也没有访问 DOM 的能力。

> Service Worker 实际运行于本机上，相当于一个客户端代理，更多[请参考这里](https://developers.google.com/web/fundamentals/primers/service-workers?hl=zh-CN) 👈

### 注册

```JS
// index.js
// 注册 service worker，其脚本文件为 sw.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function () {
    console.log('Service Worker 注册成功');
  });
}
```

### 生命周期

当我们注册了 Service Worker 后，它会经历生命周期的各个阶段，同时会触发相应的事件。整个生命周期包括了: `installing --> installed --> activating --> activated --> redundant`:

![service-worker-lifecycle.png](https://i.loli.net/2020/02/21/85eM9JdDHgNZQG1.png)

比如可以监听 install 事件:

```JS
// 监听 install 事件
self.addEventListener('install', function (e) {
  console.log('Service Worker 状态： install');
});
```

> **self** 是 Service Worker 中一个特殊的全局变量，类似于 window 对象。self 引用了当前这个 Service Worker。

### CacheStorage

[**CacheStorage**](https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage) 接口表示 Cache 对象的存储，暴露以下几个方法:

* **CacheStorage.match()** - 检查给定的 Request 是否是 CacheStorage 对象跟踪的任何 Cache 对象的键，并返回一个 resolve 为该匹配的 Promise
* **CacheStorage.has()** - 如果存在与 cacheName 匹配的 Cache 对象，则返回一个 resolve 为 true 的 Promise
* **CacheStorage.open()** - 返回一个 Promise ，resolve 为匹配  cacheName 的 Cache 对象，如果不存在则创建一个新的 cache
* **CacheStorage.delete()** - 查找匹配 cacheName 的 Cache 对象，如果找到，则删除 Cache 对象并返回一个 resolve 为 true 的 Promise 。如果没有找到 Cache 对象，则返回 false
* **CacheStorage.keys()** - 返回一个 Promise ，它将使用一个包含与 CacheStorage 追踪的所有命名 Cache 对象对应字符串的数组来 resolve. 使用该方法迭代所有 Cache 对象的列表

要使我们的 Web App 离线可用，就需要将所需资源缓存下来。我们需要一个这样的资源列表，当 Service Worker 被激活时，会将该列表内的资源缓存进 cache:

```JS
// sw.js
var cacheName = 'bs-0-2-0';
var cacheFiles = [ // 列出所有的静态资源依赖
  '/',
  './index.html',
  './index.js',
  './style.css',
  './img/book.png',
  './img/loading.svg'
];

// 监听 install 事件，安装完成后，进行文件缓存
self.addEventListener('install', function (e) {
  // caches 是一个全局变量，通过它我们可以操作 Cache 相关接口
  var cacheOpenPromise = caches.open(cacheName).then(function (cache) {
    return cache.addAll(cacheFiles);
  });
  e.waitUntil(cacheOpenPromise);
});
```

> 注意: `localStorage` 跟  `service worker` 的 cache 工作原理很类似，但是它是同步的，所以不允许在  `service workers` 内使用

缓存有了，但是如何告知浏览器使用呢，可以参考以下几个策略:

* 有缓存

![cached](https://user-gold-cdn.xitu.io/2018/4/8/162a560d2d6b1798?w=567&h=284&f=png&s=19408)

* 无缓存

![noCache](https://user-gold-cdn.xitu.io/2018/4/8/162a560d30b47136?w=567&h=284&f=png&s=13705)

1. 浏览器发起请求，请求各类静态资源
2. Service Worker 拦截浏览器请求，并查询当前 cache
3. 若存在 cache 则直接返回，结束
4. 若不存在 cache，则通过 fetch 方法向服务端发起请求，并返回请求结果给浏览器

```JS
// sw.js
self.addEventListener('fetch', function (e) {
  // respondWith - 通过它让 Service Worker 向浏览器返回数据
  e.respondWith(
  // 如果有 cache 则直接返回，否则通过 fetch 请求，并将请求结果返回给浏览器
    caches.match(e.request).then(function (cache) {
      return cache || fetch(e.request);
    }).catch(function (err) {
      return fetch(e.request);
    })
  );
});
```

当我们将资源缓存后，除非注销(unregister) sw.js、手动清除缓存，否则新的静态资源将无法缓存。解决这个问题的一个简单方法就是修改 `cacheName`。由于浏览器判断 sw.js 是否更新是通过字节方式，因此修改 cacheName 会重新触发 install 并缓存资源。此外，在 activate 事件中，我们需要检查 cacheName 是否变化，如果变化则表示有了新的缓存资源，原有缓存需要删除:

```JS
// sw.js
// 监听 activate 事件，激活后通过 cache 的 key 来判断是否更新 cache 中的静态资源
self.addEventListener('activate', function (e) {
  var cachePromise = caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) {
      if (key !== cacheName) {
        return caches.delete(key);
      }
    }));
  })
  e.waitUntil(cachePromise);
  return self.clients.claim();
});
```

另一方面 Web App 也会把 XHR 请求的数据缓存一份。而再次请求时，我们会优先使用本地缓存，然后向服务端请求数据，服务端返回数据后，基于该数据替换展示:

![fetch](https://user-gold-cdn.xitu.io/2018/4/8/162a560d35c15a67?w=567&h=266&f=png&s=16946)

同时我们也可以改造下 `fetch`:

```JS
// sw.js
var apiCacheName = 'api-0-1-1';
self.addEventListener('fetch', function (e) {
  // 需要缓存的请求
  var cacheRequestUrls = [
    '/book?'
  ];

  // 判断当前请求是否需要缓存
  var needCache = cacheRequestUrls.some(function (url) {
    return e.request.url.indexOf(url) > -1;
  });

  /**** 这里是对 XHR 数据缓存的相关操作 ****/
  if (needCache) {
      // 需要缓存
    // 使用 fetch 请求数据，并将请求结果 clone 一份缓存到 cache
    // 此部分缓存后在 browser 中使用全局变量 caches 获取
    caches.open(apiCacheName).then(function (cache) {
      return fetch(e.request).then(function (response) {
        // clone 方法拷贝一份响应数据，这样我们就可以对响应缓存进行各类操作而不用担心原响应信息被修改了
        cache.put(e.request.url, response.clone());
        return response;
      });
    });
  }
  /* ******************************* */

  else {
    // 非 api 请求，直接查询 cache
    e.respondWith(
      caches.match(e.request).then(function (cache) {
        return cache || fetch(e.request);
      }).catch(function (err) {
        return fetch(e.request);
      })
    );
  }
});
```

SW 配置好后，最后只剩下如何在 XHR 请求时有策略的使用缓存了，这一部分的改造全部集中于 `index.js`:

```JS
function getApiDataFromCache(url) {
  // 仍然可以通过 caches 来访问缓存。为了保证渐进可用，我们需要先进行判断 'caches' in window
  if ('caches' in window) {
    return caches.match(url).then(function (cache) {
      // 判断是否命中缓存
      if (!cache) return;

      return cache.json();
    });
  }

  return Promise.resolve();
}
```

这样处理之后，我们可以感受到两个比较大的提升:

* 离线可用 - 如果我们之前访问过某些 URL，那么即使在离线的情况下，依然可以正常访问
* 优化体验 - 提高访问速度。读取本地 cache 耗时相比于网络请求较低，在弱网情况下更明显

### Workbox

[**Workbox**](https://developers.google.com/web/tools/workbox/modules/workbox-sw) 可以理解为 Google 官方 PWA 框架，它解决的就是用底层 API 写 PWA 太过复杂的问题。这里说的底层 API，指的就是去监听 SW 的 `install、active、fetch` 事件做相应逻辑处理等:

```JS
// 首先引入 workbox 框架
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');
workbox.precaching([
 // 注册成功后要立即缓存的资源列表
])

// 接下来定义 html 的缓存策略
workbox.routing.registerRoute(
 new RegExp('.*\.(?:js|css)'),
 workbox.strategies.cacheFirst()
);
```

对应的几种策略如下:

* **Stale-While-Revalidate**

The stale-while-revalidate pattern allows you to respond the request as quickly as possible with a cached response if available, falling back to the network request if it’s not cached. The network request is then used to update the cache.

```JS
workbox.routing.registerRoute(
  new RegExp('https://your\.cdn\.com/'),
  workbox.strategies.staleWhileRevalidate()
);
```

![Stale-While-Revalidate](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/stale-while-revalidate.png)

* **Cache First** (Cache Falling Back to Network)

If there is a Response in the cache, the Request will be fulfilled using the cached response, the network will not be used at all. If there isn't a cached response, the Request will be fulfilled by a a network request and the response will be cached so that the next request is served directly from the cache.

```JS
workbox.routing.registerRoute(
  new RegExp('https://your\.img\.cdn\.com/'),
  workbox.strategies.cacheFirst({
    cacheName: 'example:img'
  })
);
```

![Cache First](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/cache-first.png)

* **Network First** (Network Falling Back to Cache)

For requests that are updating frequently, the network first strategy is the ideal solution. By default it will try and fetch the latest request from the network. If the request is successful, it’ll put the response in the cache. If the network fails to return a response, the caches response will be used.

```JS
workbox.routing.registerRoute(
  new RegExp('/social-timeline/'),
  new workbox.strategies.NetworkFirst()
);
```

![Network First](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/network-first.png)

* **Network Only**

```JS
workbox.routing.registerRoute(
  new RegExp('/admin/'),
  new workbox.strategies.NetworkOnly()
);
```

![Network Only](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/network-only.png)

* **Cache Only**

```JS
workbox.routing.registerRoute(
  new RegExp('/app/v2/'),
  new workbox.strategies.CacheOnly()
);
```

![Cach Only](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/cache-only.png)

## Web Push 消息推送

下图来自 [Web Push 协议草案](https://tools.ietf.org/html/draft-ietf-webpush-protocol-12)，是 Web Push 的整个流程，该时序图表明了 Web Push 的各个步骤，我们可以将其分为**订阅(subscribe)**与**推送(push)**两部分来看:

```TEXT
    +-------+           +--------------+       +-------------+
    |  UA   |           | Push Service |       | Application |
    +-------+           +--------------+       |   Server    |
        |                      |               +-------------+
        |      Subscribe       |                      |
        |--------------------->|                      |
        |       Monitor        |                      |
        |<====================>|                      |
        |                      |                      |
        |          Distribute Push Resource           |
        |-------------------------------------------->|
        |                      |                      |
        :                      :                      :
        |                      |     Push Message     |
        |    Push Message      |<---------------------|
        |<---------------------|                      |
        |                      |                      |
```

首先是订阅:

* **Ask Permission** - 这一步不再上图的流程中，这其实是浏览器中的策略。浏览器会询问用户是否允许通知，只有在用户允许后，才能进行后面的操作
* **Subscribe** - 浏览器（客户端）需要向 Push Service 发起订阅（subscribe），订阅后会得到一个 **PushSubscription** 对象
* **Monitor** - 订阅操作会和 Push Service 进行通信，生成相应的订阅信息，Push Service 会维护相应信息，并基于此保持与客户端的联系
* **Distribute Push Resource** - 浏览器订阅完成后，会获取订阅的相关信息（存在于 PushSubscription 对象中），我们需要将这些信息发送到自己的服务端，在服务端进行保存

然后是推送:

* **Push Message 阶段一** - 我们的服务端需要推送消息时，不直接和客户端交互，而是通过 Web Push 协议，将相关信息通知 Push Service；
* **Push Message 阶段二** - Push Service 收到消息，通过校验后，基于其维护的客户端信息，将消息推送给订阅了的客户端。最后，客户端收到消息，完成整个推送过程

> **Push Service** 可以接收网络请求，校验该请求并将其推送给合适的浏览器客户端。Push Service 还有一个非常重要的功能：当用户离线时，可以帮我们保存消息队列，直到用户联网后再发送给他们。不同的浏览器厂商实现了不同的 Push Service，但都遵循 **Web Push Protocol**。

### 订阅 subscribe

上面可以看到整个大概流程，那么怎么具体去实施呢，首先要在客户端生成 subscription 信息，即需要使用 **PushManager** 的 **subscribe** 方法来在浏览器中进行订阅:

```JS
// index.js
function registerServiceWorker(file) {
  return navigator.serviceWorker.register(file);
}

// 向 SW 发起订阅
function subscribeUserToPush(registration, publicKey) {
  var subscribeOptions = {
    userVisibleOnly: true, // 表明该推送是否需要显性地展示给用户，即推送时是否会有消息提醒
    applicationServerKey: window.urlBase64ToUint8Array(publicKey) // 一个客户端的公钥，VAPID 定义了其规范
  };
  // 当我们注册完 Service Worker 后会得到一个 Registration 对象
  return registration.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  var publicKey = 'BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A';
  // 注册service worker
  registerServiceWorker('./sw.js').then(function (registration) {
    console.log('Service Worker 注册成功');
    // 开启该客户端的消息推送订阅功能
    return subscribeUserToPush(registration, publicKey);
  }).then(function (subscription) {
    var body = {subscription: subscription};
    // 为了方便之后的推送，为每个客户端简单生成一个标识
    body.uniqueid = Date.now();
    console.log('uniqueid', body.uniqueid);
    // 将生成的客户端订阅信息存储在自己的服务器上
    return sendSubscriptionToServer(JSON.stringify(body));
  }).then(function (res) {
    console.log(res);
  }).catch(function (err) {
    console.log(err);
  });
}
```

一个 PushSubscription 可能包含以下信息，其中的 `endpoint`，Push Service 会为每个客户端随机生成一个不同的值:

```JSON
{
  "endpoint":"https://fcm.googleapis.com/fcm/send/dFBJcJfA0ZQ:APA91bGP1bm8aLVRVEei1IxdhqLFZXPV28z1pQK6t-5nsCEpc7_JRsr3wQYAAE-d6hPbgo0qch5aLMc2sDbZBreFmkA6thkz28c3ajfXoiU4zf5ANJWM8QLZjmWJ4MF_WbbtlaP7o21u",
  "expirationTime":null,
  "keys":{
      "p256dh":"BGTNJ4e5-xxxPDbVpFdvM9KYHFiMTTEwCKXFbO1TOCuV7E",
      "auth":"WBS6llMxxxDmRhiqQ"
  }
}
```

> applicationServerKey 的生成规则是将 base64 的公钥字符串转为 Unit8Array，可以[参考这里](https://github.com/web-push-libs/web-push#using-vapid-key-for-applicationserverkey) 👈

### Distribute Push Resource

接下来需要服务端存储客户端 subscription 信息，为了存储浏览器 post 来的订阅信息，服务端需要增加一个接口 `/subscription`，同时添加中间件 `koa-body` 用于处理 body:

```JS
// index.js
function sendSubscriptionToServer(body, url) {
  url = url || '/subscription';
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    ...
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
  });
}
```

```JS
// app.js
const koaBody = require('koa-body');
const util = require('./util');
/**
 * 提交 subscription 信息，并保存
 * 这里使用了 nedb 来进行简单的存储。nedb 不需要部署安装，可以将数据存储在内存中，也可以持久化，nedb 的 api 和 mongodb 也比较类似
 */
router.post('/subscription', koaBody(), async ctx => {
  let body = ctx.request.body;
  await util.saveRecord(body);
  ctx.response.body = {
    status: 0
  };
});
```

```JS
// utils.js
const Datastore = require('nedb');
const db = new Datastore();
module.exports.saveRecord = function (obj) {
  return new Promise((r, j) => {
    db.findOne(obj, (err, res) => {
      if (err) {
        j(err);
        return;
      }
      if (res) {
        console.log('已存在');
        r(obj);
        return;
      }
      db.insert(obj, (err, item) => {
        if (err) {
          j(err);
          return;
        }
        console.log('存储完毕');
        r(obj);
      });
    });
  });
};
```

### Push Message

接下来使用 subscription 信息推送信息，以下模拟了一个接口来推送:

```JS
// app.js
const webpush = require('web-push');
/**
 * 消息推送 API，可以在管理后台进行调用
 * 本例子中，可以直接 post 一个请求来查看效果
 */
router.post('/push', koaBody(), async ctx => {
  let { uniqueid, payload } = ctx.request.body;
  // 我们可以通过 uniqueid 来查询某条订阅信息或者全部信息
  let list = uniqueid ? await util.find({uniqueid}) : await util.findAll();
  let status = list.length > 0 ? 0 : -1;

  for (let i = 0; i < list.length; i++) {
    let subscription = list[i].subscription;
    // 通过封装的 pushMessage 方法向 Push Service 发送请求
    pushMessage(subscription, JSON.stringify(payload));
  }

  ctx.response.body = {
    status
  };
});

// 向 Push Service 推送信息
function pushMessage(subscription, data = {}) {
  // webpush.sendNotification 方法为我们封装了请求的处理细节
  webpush.sendNotification(subscription, data, options).then(data => {
    console.log('push service 的相应数据:', JSON.stringify(data));
    return;
  }).catch(err => {
    // 判断状态码，440 和 410 表示失效
    if (err.statusCode === 410 || err.statusCode === 404) {
      return util.remove(subscription);
    }
    else {
      console.log(subscription);
      console.log(err);
    }
  })
}
```

> Web Push 协议的请求封装、加密处理相关操作非常繁琐。因此，Web Push 为各种语言的开发者提供了一系列对应的库：[Web Push Libaray](https://github.com/web-push-libs/web-push#using-vapid-key-for-applicationserverkey) 👈

通过 web-push 我们可以生成一对公钥和私钥:

```SHELL
# 安装
npm install web-push --save

# 生成 vapid keys
web-push generate-vapid-keys

================
Public key:
BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A
Private key:
TVe_nJlciDOn130gFyFYP8UiGxxWd3QdH6C5axXpSgM
```

然后设置 vapid key，设置完成后即可使用 `webpush.sendNotification()` 方法向 Push Service 发起请求:

```JS
// app.js
const webpush = require('web-push');
/**
 * VAPID 值
 */
const vapidKeys = {
  publicKey: 'BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A',
  privateKey: 'TVe_nJlciDOn130gFyFYP8UiGxxWd3QdH6C5axXpSgM'
};

// 设置 web-push 的 VAPID 值
webpush.setVapidDetails(
  'mailto:smd.tate@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
```

至此，我们就已经把消息发送至 Push Service 了，而 Push Service 会将我们的消息推送至浏览器。要想在浏览器中获取推送信息，只需在 Service Worker 中监听 push 的事件即可:

```JS
// sw.js
self.addEventListener('push', function (e) {
  var data = e.data;
  if (e.data) {
    data = data.json();
    console.log('push的数据为：', data);
    self.registration.showNotification(data.text);
  }
  else {
    console.log('push没有任何数据');
  }
});
```

![web-push](https://user-gold-cdn.xitu.io/2018/4/13/162bc954b09d78cf?w=1277&h=774&f=gif&s=2877596)

我们还可以在控制台对 SW 进行调试，同时也可以看到 cache 中所存储的一些脚本和请求信息:

![console](https://user-gold-cdn.xitu.io/2018/4/29/16310a142d0c794d?w=1197&h=503&f=png&s=116464)

## Notification 提醒

![Notification](https://user-gold-cdn.xitu.io/2018/5/1/1631a562ba773ddd?w=1275&h=762&f=gif&s=384884)

即使当你切换到其他页签，也可以通过提醒交互来快速让用户回到你的网站，甚至当用户离开当前网站，仍然可以收到系统的提醒消息，并且可以通过消息提醒快速打开你的网站:

![Notification-back](https://user-gold-cdn.xitu.io/2018/5/1/1631b52052cccb59?w=1270&h=676&f=gif&s=2317289)

### requestPermission 获取授权

要完成提醒，首先调用 **Notification** 对象上的静态方法 `Notification.requestPermission()` 来获取授权:

```JS
// index.js
function askPermission() {
  return new Promise(function (resolve, reject) {
    var permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    /*
    * permissionResult 可能值有以下几个
    * denied：用户拒绝了通知的显示
    * granted：用户允许了通知的显示
    * default：因为不知道用户的选择，所以浏览器的行为与 denied 时相同
    */
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
  });
}


registerServiceWorker('./sw.js').then(function (registration) {
  return Promise.all([
    registration,
    askPermission()
  ])
 })
```

### showNotification 提醒内容

获取用户授权后，我们就可以通过 `registration.showNotification()` 方法进行消息提醒了:

```JS
// index.js
registerServiceWorker('./sw.js').then(function (registration) {
  return Promise.all([
    registration,
    askPermission()
  ])
}).then(function (result) {
  var registration = result[0];
  /* ===== 添加提醒功能 ====== */
  document.querySelector('#js-notification-btn').addEventListener('click', function () {
    var title = 'PWA即学即用'; // 标题
    var options = {
      body: '邀请你一起学习',
      icon: '/img/icons/book-128.png',
      actions: [{
        action: 'show-book',
        title: '去看看'
      }, {
        action: 'contact-me',
        title: '联系我'
      }],
      tag: 'pwa-starter',
      renotify: true
    };
    registration.showNotification(title, options);
  });
  /* ======================= */
})
```

options 支持以下字段:

* body - 提醒的内容
* icon - 提醒的图标
* actions - 提醒可以包含一些自定义操作
* tag - 相当于是 ID，通过该 ID 标识可以操作特定的 notification
* renotify - 是否允许重复提醒，默认为 false。当不允许重复提醒时，同一个 tag 的 notification 只会显示一次

![options](https://user-gold-cdn.xitu.io/2018/5/1/1631a6c6007ffec9?w=800&h=300&f=jpeg&s=114296)

### notificationclick 事件监听

为了能够响应用户对于提醒框的点击事件，我们需要在 Service Worker 中监听 **notificationclick** 事件。在该事件的回调函数中我们可以获取点击的相关信息:

```JS
// sw.js
self.addEventListener('notificationclick', function (e) {
  var action = e.action;
  console.log(`action tag: ${e.notification.tag}`, `action: ${action}`);

  switch (action) {
    case 'show-book':
      console.log('show-book');
      break;
    case 'contact-me':
      console.log('contact-me');
      break;
    default:
      console.log(`未处理的action: ${e.action}`);
      action = 'default';
      break;
  }
  e.notification.close();
});
```

如果需要 Service Worker 与 client 通信，则还需要修改以下两个部分:

```JS
// sw.js
// 在 Service Worker 中使用 Worker 的 postMessage() 方法来通知 client
self.addEventListener('notificationclick', function (e) {
  ...
 e.waitUntil(
    // 获取所有clients
    self.clients.matchAll().then(function (clients) {
      if (!clients || clients.length === 0) {
        // 当不存在 client 时(比如网页已经关闭)，打开该网站
        self.clients.openWindow && self.clients.openWindow('http://127.0.0.1:8085');
        return;
      }
      // 切换到该站点的 tab
      clients[0].focus && clients[0].focus();
      clients.forEach(function (client) {
        // 使用postMessage进行通信
        client.postMessage(action);
      });
    })
  );
});
```

```JS
// index.js
// 在 client 中监听 message 事件，判断 data，进行不同的操作
navigator.serviceWorker.addEventListener('message', function (e) {
  var action = e.data;
  console.log(`receive post-message from sw, action is '${e.data}'`);
  switch (action) {
    case 'show-book':
      location.href = 'https://book.douban.com/subject/20515024/';
      break;
    case 'contact-me':
      location.href = 'mailto:someone@sample.com';
      break;
    default:
      document.querySelector('.panel').classList.add('show');
      break;
  }
});
```

另外，Web Push 和 Notification 也可以组合使用:

```JS
// sw.js
// 这样，即使是在用户关闭该 Web App 时，依然可以收到提醒，类似于 Native 中的消息推送与提醒
self.addEventListener('push', function (e) {
  var data = e.data;
  if (e.data) {
    data = data.json();
    console.log('push的数据为：', data);
    var title = 'PWA即学即用';
    var options = {
      body: data,
      icon: '/img/icons/book-128.png',
      image: '/img/icons/book-521.png',
      actions: [{
        action: 'show-book',
        title: '去看看'
      }, {
        action: 'contact-me',
        title: '联系我'
      }],
      tag: 'pwa-starter',
      renotify: true
    };
    self.registration.showNotification(title, options);
  }
  else {
    console.log('push 没有任何数据');
  }
});
```

## Background Sync 后台同步

在日常生活中，我们会遇到两个常见的问题:

* 普通的页面发起的请求会随着浏览器进程的结束或者 Tab 页面的关闭而终止
* 无网环境下，没有一种机制能“维持”住该请求，以待有网情况下再进行请求

而 **Background Sync** 后台同步功能可以有效解决此问题，其工作原理大致如下:

1. 在 Service Worker 中监听 sync 事件
2. 在浏览器中发起后台同步 sync（图中第一步）
3. 会触发 Service Worker 的 sync 事件，在该监听的回调中进行操作，例如向后端发起请求（图中第二步）
4. 可以在 Service Worker 中对服务端返回的数据进行处理

![Background Sync 流程](https://user-gold-cdn.xitu.io/2018/5/13/1635905056b125a7?w=573&h=129&f=png&s=8623)

接下来看看如何在实际中操作，首先在 client 触发 sync 事件:

```JS
// index.js
// 由于后台同步功能需要在 Service Worker 注册完成后触发，因此较好的一个方式是在 navigator.serviceWorker.ready 之后绑定相关操作
navigator.serviceWorker.ready.then(function (registration) {
  var tag = "sample_sync";
  document.getElementById('js-sync-btn').addEventListener('click', function () {
    registration.sync.register(tag).then(function () {
      console.log('后台同步已触发', tag);
    }).catch(function (err) {
      console.log('后台同步触发失败', err);
    });
  });
});
```

其中 `registration.sync` 返回一个 `SyncManager` 对象，包含以下两个方法:

* register() - Create a new sync registration and return a Promise.
* getTags() - Return a list of developer-defined identifiers for SyncManager registration

然后在 SW 中监听 sync 事件:

```JS
// sw.js
// 需要特别注意的是，fetch 请求一定要放在 e.waitUntil() 内。因为我们要保证“后台同步”
// 将 Promise 对象放在 e.waitUntil() 内可以确保在用户离开我们的网站后，Service Worker 会持续在后台运行，等待该请求完成
self.addEventListener('sync', function (e) {
  console.log(`service worker需要进行后台同步，tag: ${e.tag}`);
  var init = {
    method: 'GET'
  };
  // 根据不同的传入的 tag，可以不同处理
  if (e.tag === 'sample_sync') {
    var request = new Request(`sync?name=AlienZHOU`, init);
    e.waitUntil(
      fetch(request).then(function (response) {
        response.json().then(console.log.bind(console));
        return response;
      })
    );
  }
});
```

![Background Sync](https://user-gold-cdn.xitu.io/2018/5/13/163598ca174364ed?w=800&h=499&f=gif&s=2269837)

## TWA

[**TWA(Trusted Web Activity)**](https://developers.google.com/web/updates/2019/02/using-twa) 是一种技术，用来将 PWA 打包成安卓应用。设置 TWA 不要求开发人员编写 Java 代码，但需要 [Android Studio](https://developer.android.com/studio/)。

## Firebase

以上项目可部署至 [**Firebase**](https://firebase.google.com)，需要先创建帐户并安装一些工具：

1. 在 `https://firebase.google.com/console/` 上创建一个 Firebase 帐户
2. 通过 npm 安装 Firebase：`npm install -g firebase-tools`

创建帐户并登录后，便可随时进行部署！

1. 在 `https://firebase.google.com/console/` 上创建一个新应用
2. 如果您近期未登录 Firebase 工具，请更新您的凭据：`firebase login`
3. 初始化您的应用，并提供您完成的应用所在的目录： `firebase init`
4. 最后，将应用部署到 Firebase： `firebase deploy`
5. 大功告成。 操作完成！您的应用将部署到以下网域：`https://YOUR-FIREBASE-APP.firebaseapp.com`

> 深入阅读：[Firebase 托管指南](https://www.firebase.com/docs/hosting/guide/) 👈

## LightHouse

**Lighthouse** 是一个开源的自动化工具，用于改进网络应用的质量。 您可以将其作为一个 [Chrome 扩展程序](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)运行，或从命令行运行。 您为 Lighthouse 提供一个您要审查的网址，它将针对此页面运行一连串的测试，然后生成一个有关页面性能的报告。

```SHELL
# 安装
npm install -g lighthouse

# 审查
lighthouse https://airhorner.com/
```

![lighthouse](https://developers.google.com/web/tools/lighthouse/images/report.png)

## 参考链接

1. [Your First Progressive Web App](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/?hl=zh-cn)
2. [Workbox](https://developers.google.com/web/tools/workbox/modules/workbox-sw)
3. [2018，开始你的 PWA 学习之旅](https://alienzhou.gitbook.io/learning-pwa/2018-kai-shi-ni-de-pwa-xue-xi-zhi-lv) By alienzhou

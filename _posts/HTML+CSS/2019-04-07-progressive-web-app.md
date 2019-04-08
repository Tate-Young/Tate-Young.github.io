---
layout: blog
front: true
comments: True
flag: PWA
background: purple
category: 前端
title:  PWA 简介
date:   2019-04-07 23:40:00 GMT+0800 (CST)
update: 2019-04-08 16:02:00 GMT+0800 (CST)
background-image: https://i.udemycdn.com/course/240x135/1233648_31e5_3.jpg
tags:
- pwa
---

# {{ page.title }}

## 什么是 PWA

**PWA(Progressive Web App)** 即渐进式网络应用，PWA 可以将 Web 和 App 各自的优势融合在一起，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验。其核心技术包括:

* **App Manifest** - Web 应用程序清单，实现可安装
* **Service Worker** - 后台运行的独立线程，实现离线使用
* **Web Push**

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

### 代理

**Service Worker** 可以简单理解为一个独立于前端页面，在后台运行的进程。它有一个非常重要的特性：你可以在 Service Worker 中监听所有客户端(Web)发出的请求，然后通过它来代理，向后端服务发起请求。通过监听用户请求信息，Service Worker 可以决定是否使用缓存来作为 Web 请求的返回。因此它是实现离线访问的核心，下图展示普通 Web App 与添加了 Service Worker 的 Web App 在网络请求上的差异:

![service worker](https://user-gold-cdn.xitu.io/2018/4/8/162a560d0bdb6ed1?w=567&h=271&f=png&s=14952)

> Service Worker 实际运行于本机上，相当于一个客户端代理。

### 注册

以下 demo 都[来自 github 这里](https://github.com/alienzhou/learning-pwa):

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

![lifecycle](https://user-gold-cdn.xitu.io/2018/4/8/162a560d0bdaf33b?w=579&h=867&f=png&s=39680)

比如可以监听 install 事件:

```JS
// 监听 install 事件
self.addEventListener('install', function (e) {
  console.log('Service Worker 状态： install');
});
```

> **self** 是 Service Worker 中一个特殊的全局变量，类似于 window 对象。self 引用了当前这个 Service Worker。

### 缓存静态资源

要使我们的 Web App 离线可用，就需要将所需资源缓存下来。我们需要一个资源列表，当 Service Worker 被激活时，会将该列表内的资源缓存进 cache:

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

缓存有了，但是如何告知浏览器使用呢，可以参考以下几个策略:

![cached](https://user-gold-cdn.xitu.io/2018/4/8/162a560d2d6b1798?w=567&h=284&f=png&s=19408)

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
    // 使用fetch请求数据，并将请求结果clone一份缓存到cache
    // 此部分缓存后在browser中使用全局变量caches获取
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

## Notification 提醒

## Firebase

[**Firebase**](https://firebase.google.com)

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

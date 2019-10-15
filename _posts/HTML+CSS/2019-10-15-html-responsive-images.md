---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  响应式图片设计
date:   2019-10-15 21:47:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/07/24/5b56b1a40824c.jpg
tags:
- css
---
# {{ page.title }}

## 响应式图片

响应式图片无非两个解决方案，即 **inline images** 和 **CSS images**。而他们解决的问题也不过与两大方面:

* **Resolution Switching** - 分辨率切换
* **Art Direction** - 美术设计

## inline images

这部分直接参考 [MDN Responsive images](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。具体的响应式实现方式可以总结为以下几点:

| 方式        |   标签   |  属性  |
| ------------ | ------- | ------ |
| 基于视口宽度 | \<img\> | srcset、sizes |
| 基于设备像素比 | \<img\> | srcset |
| 基于媒体查询 | \<picture\> 下的 \<source\> | srcset、media |
| 基于图片格式 | \<picture\> 下的 \<source\> | srcset、type |

> 注意！这里旨在介绍一些 HTML5 新标签(例如 `pictrure`、`figure` 等)，要知道 CSS 是比 HTML 更好的响应式设计的工具。[**内容与样式分离**](https://en.wikipedia.org/wiki/Separation_of_content_and_presentation) 是 Web 设计中的重要概念。这样的设计有利于可维护性，机器可读和互操作性等。 外链样式表和 HTML5 语义标签都有这个用意。这方面 `<img>` 元素只需要注意一点： 纯装饰性的图片不建议使用 `<img>` 标签，尽量用 CSS 替代。

### \<img\>

场景1：分辨率切换问题（resolution switching problem）- 对于不同终端，我们想要根据不同分辨率切换不同的图片尺寸。

对于 img 标签，我们再熟悉不过了，但是我们平常使用的基本只是涉及 `src` 属性和 `alt` 属性:

```HTML
<img src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">
```

这里再介绍两个新的属性 `srcset` 和 `sizes` 来提供更多额外的资源图像和提示，帮助浏览器选择正确的一个资源。[点击前往示例传送门](https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/responsive.html)，我们可以看到不同分辨率下，图片的尺寸大小有所不同:

```HTML
<!-- 基于视口宽度 -->
<img srcset="elva-fairy-320w.jpg 320w,
             elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
     src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">
```

**srcset** 定义了我们允许浏览器选择的图像集，以及每个图像的大小。其中包含:

* 文件名 - 如(elva-fairy-480w.jpg)
* 图像的固有宽度 - 如 480w，注意到这里使用 w 单位，而不是你预计的 px。这是图像的真实大小，可以通过检查你电脑上的图片文件找到（例如，在 Mac 上，你可以在 Finder 上选择这个图像，然后按 `Cmd + I` 来显示信息）。

**sizes** 定义了一组媒体条件（例如屏幕宽度），并且指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择。其中包含了:

* 媒体条件 - 如 (max-width: 320px)
* 当媒体条件为真时，图像将填充的槽的宽度

所以，有了这些属性，浏览器会：

1. 查看设备宽度
2. 检查 sizes 列表中哪个媒体条件为真
3. 查看给予该媒体查询的槽大小
4. 加载 srcset 列表中引用的最接近所选的槽大小的图像

> 值得注意的是，这里的 w 和屏幕密度有关。比如屏幕密度为 2，此时 sizes 设定值为 440px，则图片实际规格为 440*2px，即会加载 800w 对应的图片。具体可以[参考这篇博客](https://www.zhangxinxu.com/wordpress/2014/10/responsive-images-srcset-size-w-descriptor/) 👈

场景2：分辨率切换问题（resolution switching problem）- 尺寸相同，但分辨率不同，分辨率过低可能造成图片太模糊。

可以直接通过 srcset 和 x 语法结合，来选择适当分辨率的图片，[示例传送门](https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/srcset-resolutions.html):

```HTML
<!-- 基于设备像素比 -->
<img srcset="elva-fairy-320w.jpg,
             elva-fairy-480w.jpg 1.5x,
             elva-fairy-640w.jpg 2x"
     src="elva-fairy-640w.jpg" alt="Elva dressed as a fairy">
```

### \<picture\>

上文提到在 \<img\> 元素的 sizes 中可以写媒体查询来计算宽高。 \<picture\> 中也可以通过媒体查询来选择 \<source\> 可以给不同的设备大小下载不同的图片。 区别在于 基于视口宽度的资源选择侧重于对不同大小的屏幕选择宽度适合的，同样内容的图片。 基于媒体查询的资源选择侧重于对不同的屏幕选择不同内容的图片。比如在移动设备上只显示头像，在大屏幕显示器上则显示完整的大图:

```HTML
<picture>
  <source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
  <source media="(min-width: 800px)" srcset="elva-800w.jpg">
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva">
</picture>
```

![responsive-image.png](https://i.loli.net/2019/10/15/fTHFj1hniS2OZAY.png)

> 为什么我们不能使用 CSS 或 JavaScript 来做到这一效果?

当浏览器开始加载一个页面, 它会在主解析器开始加载和解析页面的 CSS 和 JavaScript 之前先下载 (预加载) 任意的图片。这是一个非常有用的技巧，平均下来减少了页面加载时间的 20%。但是, 这对响应式图片一点帮助都没有, 所以需要类似 srcset 的实现方法。因为你不能先加载好 \<img\> 元素后, 再用 JavaScript 检测可视窗口的宽度，如果觉得大小不合适，再动态地加载小的图片替换已经加载好的图片，这样的话, 原始的图像已经被加载了, 然后你又加载了小的图像, 这样的做法对于响应式图像的理念来说，是很糟糕的。

\<source\> 元素的 **type** 属性可以指定图片格式，比如性能更优的 [**webp**](#webp) 等，浏览器可以选择自己支持的去下载:

```HTML
<picture>
  <source type="image/svg+xml" srcset="pyramid.svg">
  <source type="image/webp" srcset="pyramid.webp">
  <img src="pyramid.png" alt="regular pyramid built from four equilateral triangles">
</picture>
```

### \<figure\>

[\<figure\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure) 与 \<img\>、\<picture\> 不同的是它是独立的引用单元，而非技术上的图片资源。 比如 \<figure\> 可以有自己的 \<figurecaption\> 标签，还可以包含文字说明、代码片段等:

```HTML
<figure>
  <img src="/media/examples/elephant-660-480.jpg"
      alt="Elephant at sunset">
  <figcaption>An elephant at sunset</figcaption>
</figure>

<figure>
  <figcaption><cite>Edsger Dijkstra:</cite></figcaption>
  <blockquote>If debugging is the process of removing software bugs,
  then programming must be the process of putting them in.</blockquote>
</figure>
```

## CSS images

先说第一个问题，分辨率切换问题，我们先看看这里怎么处理的:

```CSS
￼￼background-image: image-set( "foo.png" 1x, "foo-2x.png" 2x);
```

![css](https://29comwzoq712ml5vj5gf479x-wpengine.netdna-ssl.com/wp-content/uploads/2015/06/image-set.png)

这里再提一下 CSS images 里的 `image-set()`，`srcset` 就是基于它来的。但是由于我们经常用媒体查询(media queries)，这个属性早被我们遗忘了 😿。而且问题是它虽然出道早，但是浏览器的支持不是很好 😳。

那么第二个问题，美术设计问题，就是通过上述的媒体查询来处理的:

```CSS
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
/* High density stuff here */
￼￼￼￼￼￼}
```

![media queries](https://29comwzoq712ml5vj5gf479x-wpengine.netdna-ssl.com/wp-content/uploads/2015/06/resolution-mq.png)

## webp

> to be continued

## 参考链接

1. [MDN - Responsive images](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
2. [Responsive Images 101, Part 8: CSS Images](https://cloudfour.com/thinks/responsive-images-101-part-8-css-images/)
3. [正确使用 HTML5 标签：img, picture, figure 的响应式设计](https://harttle.land/2018/05/30/responsive-img-picture.html) By harttle
4. [响应式图片 srcset 全新释义 sizes 属性 w 描述符](https://www.zhangxinxu.com/wordpress/2014/10/responsive-images-srcset-size-w-descriptor/) By 张鑫旭

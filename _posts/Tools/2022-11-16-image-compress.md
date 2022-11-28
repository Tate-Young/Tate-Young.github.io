---
layout: blog
front: true
comments: True
background: green
category: 前端
title: 图片压缩
date: 2022-11-16 17:25:00 GMT+0800 (CST)
update: 2022-11-28 14:03:00 GMT+0800 (CST)
background-image: /style/images/js.png
---

# {{ page.title }}

> 首先介绍一个众所周知、肥肠牛逼的在线图片压缩工具 [**TinyPNG**](https://tinify.cn) 👈

## 图片格式

* **JPG** / **JPEG** - 有损压缩。不支持透明。适合呈现色彩丰富的图片，如背景图、轮播图、Banner 图等。
* **PNG** - 无损压缩高保真图片格式。支持透明。8 位 png 能支持 256 种颜色，24 位能呈现 1600 万种颜色。比 JPG 有更强的色彩表现力。缺点是体积太大。考虑到 PNG 在处理线条和颜色对比度方面的优势，主要用它来呈现小的 Logo、颜色简单且对比强烈的图片或背景。
* **WebP** - Webp 拥有更优的数据图像压缩算法，在肉眼感知无差异的情况下，带来更小的体积。一样能呈现丰富色彩的图片，且和 PNG 一样支持透明。在兼容性支持的情况下，Webp 是替代 JPG 和 PNG 更好的方案。兼容性情况（caniuse.com/webp）。
* **GIF** / **APNG** - GIF 最多支持 256 色，因此不会有高清的画质。相比于 GIF，APNG(Animated PNG) 支持 24 位真彩色图片，画质比 GIF 好很多，且体积也更小。或使用视频格式代替 GIF，如 [MP4](https://caniuse.com/mpeg4)。视频只需要设置自动播放、循环播放以及关闭声音就能达到和 GIF 一样的效果，体积大幅下降，且画质也不是 GIF 可比拟。导致 GIF 过大的原因有，尺寸大小、帧率、图片色彩和时长。GIF 压缩在前端没有好的处理办法，因前端只能逐帧解析处理，整个解析、处理、再合成的过程耗时过长且效果不佳

## 客户端与服务端压缩处理的区别

* 客户端 Canvas 压缩图片能力很普通，适合比较简单的场景。它只有一个压缩系数的设置，而且不能保证压缩后的图片与原图在视觉上的效果。如 [**compressor.js**](https://github.com/fengyuanchen/compressorjs)
* 服务端 Node.js 结合 C/C++ 算法库处理，如 [**mozjpeg**](https://github.com/mozilla/mozjpeg)、[**pngquant**](https://github.com/kornelski/pngquant)、[**gifsicle**](https://github.com/kohler/gifsicle) 这些库用来处理对应的图像类型都能取得较好的效果。

## 图像质量评估算法

对于压缩我们常常使用的办法是直接设置一个压缩系数，但会面临几个问题。

1. 小图片（尺寸小或图片色彩不够丰富）如果按照统一的压缩系数，没法保证压缩后的视觉效果；
2. 大图片可能压缩的力度不够（依旧有压缩空间）。

如何寻找最佳压缩比？**图像质量评估算法**。图片在压缩过程中不可避免的会出现失真的情况，所以需要一种能够评价图像在转换之后的质量损失程度，称为图像评估标准。它在图像的压缩、视频编解码领域都有非常重要的作用。

评估方式介绍：

* **PSNR（峰值信噪比）** - 应用广泛的图像质量评估方法。借助均方误差来计算图像失真情况，值越大表示失真图像与原图越接近，画质越好。不过许多实验结果证明，PSNR 的局限性很大，它不够接近人眼的直观感觉。

* **SSIM（结构相似性）** - 一种用来衡量两张图像（影像）相似程度的指标。根据人眼的观看习惯，人总是倾向于首先捕捉整个画幅的所有信息后，再对细节内容进行细致的观察，同时，对于纹理信息变化较为剧烈的区域更敏感，而对于纹理信息变化缓慢的区域没有那么在意。其设计基于三个因素，即亮度、对比度和结构。相比于 PSNR，结构相似性在图像品质的衡量上更能符合人眼对图像品质的判断。

* **MS-SSIM（多尺度结构相似性）** - MS-SSIM 在 SSIM 的基础上更进一步。其关注点在于，图像到观看者的距离、像素信息密集程度等因素均会对观看者给出的主观评价产生影响。观看者给一个分辨率为 1080p 的较为模糊的画面的评分可能会比分辨率为 720p 的较为锐利的画面的评分高。因此在评价图像质量的时候不考虑尺度因素可能会导致得出片面的结果。因此 MS-SSIM 提出在不同分辨率（尺度）下多次计算结构相似度后综合结果得到最终的评价数值。

综合方案概述：

1. JPG/JPEG 类型采用结构相似性算法智能压缩；
1. PNG 类型采用 PNG 量化算法压缩；
1. Webp 类型一般体积不会太大，如果过大的可选择一个合适的压缩系数压缩；
1. GIF 类型借助 gifsicle 库或者转 webp 处理；
1. 图片本身体积太小（如小于 50KB）或尺寸太小的情况，可以选择不处理。因为这种情况下处理可能会导致图片失真过多；
1. 算法处理的图片，如算法认为图片本身没有优化空间，可能会输出比原图还大的图，这种情况直接返回原图。

## 对于不同图片的处理

### jpg/jpeg

针对于 jpg/jpeg，原图压缩的话可以使用 [**mozjpeg**](https://github.com/mozilla/mozjpeg) 或者 [**jpeg-recompress**](https://github.com/danielgtaylor/jpeg-archive#image-comparison-metrics) 都可，经实测，一般两者区别不大，都支持 ssim/ms-ssim：

| Name | Option | Description |
| ------------ | ------- | --- |
| MPE | -m mpe | Mean pixel error (as used by imgmin) |
| SSIM | -m ssim | Structural similarity DEFAULT |
| MS-SSIM* | -m ms-ssim | Multi-scale structural similarity (slow!) (2008 paper) |
| SmallFry | -m smallfry | Linear-weighted BBCQ-like (original project, 2011 BBCQ paper) |

```shell
# Default settings
jpeg-recompress image.jpg compressed.jpg

# High quality example settings
jpeg-recompress --quality high --min 60 image.jpg compressed.jpg

# Slow high quality settings (3-4x slower than above, slightly more accurate)
jpeg-recompress --accurate --quality high --min 60 image.jpg compressed.jpg

# Use SmallFry instead of SSIM
jpeg-recompress --method smallfry image.jpg compressed.jpg

# Use 4:4:4 sampling (disables subsampling).
jpeg-recompress --subsample disable image.jpg compressed.jpg

# Remove fisheye distortion (Tokina 10-17mm on APS-C @ 10mm)
jpeg-recompress --defish 2.6 --zoom 1.2 image.jpg defished.jpg

# Read from stdin and write to stdout with '-' as the filename
jpeg-recompress - - <image.jpg >compressed.jpg

# Convert RAW to JPEG via PPM from stdin
dcraw -w -q 3 -c IMG_1234.CR2 | jpeg-recompress --ppm - compressed.jpg

# Disable progressive mode (not recommended)
jpeg-recompress --no-progressive image.jpg compressed.jpg

# Disable all output except for errors
jpeg-recompress --quiet image.jpg compressed.jpg
```

![jpg/jpeg](https://cloud.githubusercontent.com/assets/106826/3633843/5fde26b6-0eff-11e4-8c98-f18dbbf7b510.png)

针对于压缩过的 jpg，我们还可以通过 jpeg-compare 来比较相似度，值为 0-100，0 为一致：

```shell
# Do a fast compare of two images
jpeg-compare image1.jpg image2.jpg

# Calculate PSNR
jpeg-compare --method psnr image1.jpg image2.jpg

# Calculate SSIM
jpeg-compare --method ssim image1.jpg image2.jpg
```

### png

针对于 png，原图压缩的话可以使用 [**pngquant**](https://github.com/kornelski/pngquant)，To further reduce file size, try [**oxipng**](https://lib.rs/crates/oxipng), [**imageOptim**](https://imageoptim.com/mac), or [**zopflipng**](https://github.com/google/zopfli).

```shell
pngquant --quality=65-80 image.png
```

### webp

针对上述 jpg/jpeg/png，我们还可以通过 [**cwebp**](https://developers.google.com/speed/webp/docs/cwebp) 转换为 webp。cwebp 本身也有压缩操作：

```shell
cwebp -mt -q 70 x.jpg -o x.webp
```

```python
# 批量转换 jpg 为 webp
# -*- coding: utf-8 -*-  
import os 
q = 70
for root, dirs, files in os.walk(".", topdown=False):
  for name in files:
    fileName = os.path.join(root, name)
    if (fileName.endswith('.jpg')):
      stem, suffix = os.path.splitext(fileName)
      os.system("cwebp -mt -q %d '%s' -o '%s'"%(q, fileName, stem + ' - q%d'%(q) + '.webp'))
```

针对于 gif，我们则通过 [**gif2webp**](https://developers.google.com/speed/webp/docs/gif2webp) 来转换，具体示例如下一节。

### gif

一般 gif 动图可以通过以下几种方式去处理，具体可以讨论下，以下均以同一张 1.8M gif 为示例，对比下效果：

1. **APNG(Animated PNG)** 替代
2. Webp - 通过 [**gif2webp**](https://developers.google.com/speed/webp/docs/gif2webp) 转
3. [**gifsicle**](http://www.lcdf.org/gifsicle/man.html) 压缩

> 三者比较可以[参考下这个地址](http://littlesvr.ca/apng/gif_apng_webp1.html) 👈

#### APNG

直接通过 gif 转 apng 经测试不行，可能体积会更大。可以在设计源头上去做处理，具体需要测试。和 webp 一样仍然有兼容性问题。

#### gif2webp

```shell
# 最终结果 1.8M -> 1.2M
gif2webp -mt -q=70 x.gif -o y.gif
```

需要注意的是，gif2webp 默认是采用无损压缩的，所以压缩下来体积仍然很大，尝试一下方案：

```shell
# 最终结果 1.8M -> 453kb
gif2webp -mt -q=70 -lossy x.gif -o y.gif
```

另外 gif2webp 命令行默认是使用 4 个压缩方法的，上限可以到 6 个：

```shell
# 最终结果 1.8M -> 402kb
gif2webp -mt -q=70 -lossy -m 6 x.gif -o y.gif
```

#### gifsicle

```shell
# 最终结果 1.8M -> 983kb
gifsicle -O3 --lossy=100 x.gif -o y.gif
```

总结下:

1. gif2webp/gifsicle 最终压缩出来的结果体积相差还比较大，但是看起来几乎无区别
2. 大部分情况下，gif2webp 压缩出来的效果要强于 gifsicle。建议 gif 同 jpg 一样分别走两道压缩，客户端仍然优先取 webp
3. 如果需要通过 gif2webp 转格式的话，没必要再经过 gifsicle 压缩一道了，两者体积差不多
4. 存在那种人为将普通 jpg/png 拓展名直接改为 gif 的行为，这时候 gif2webp/gifsicle 就转不了了，要么压不出来，要么压出来的质量会更大

## ssim 算法对比图片匹配度

压缩出来的图片，一般只能肉眼去判断质量，这样子不太可靠，姿势也不雅观。除了上述针对于 jpg 的 jpeg-compare，也可更全面通过 [**ssim**](https://github.com/obartra/ssim) 算法来计算图片匹配度，从而得到最理想的图片。在官方演示中，号称比 PSNR 或 MSE 更好：

![ssim]( {{site.url}}/style/images/smms/image-compress-ssim.webp )

> **MSE(Mean Squared Error)** 为均方误差，各测量值误差的平方和的平均值的平方根。

## 需要注意文本占比较大的图片

如上，需要注意文本占比较大的图片，有写算法或者参数不适合的话，可能会过于模糊，一定要针对这类图片进行测试。一些示例：

[jpg 对比举例](https://1zf68.csb.app) 👈

[png 对比举例](https://dvdt8.csb.app) 👈

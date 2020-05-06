---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  时区计算
date:   2020-05-06 19:17:00 GMT+0800 (CST)
background-image: https://upload.wikimedia.org/wikipedia/commons/8/88/World_Time_Zones_Map.png
tags:
- JavaScript
---
# {{ page.title }}

<style>
  /* 本文插入 img 暂时宽度都调成 100% */
  img {
    width: 100%;
  }
</style>

## 什么是时区

### 理论时区 / 法定时区

[**时区**](https://zh.wikipedia.org/wiki/时区)是地球上的区域使用同一个时间定义。以前，人们通过观察太阳的位置决定时间，这就使得不同经度的地方的时间有所不同。1863 年，首次使用时区的概念。时区通过设立一个区域的标准时间部分地解决了这个问题。世界各国位于地球不同位置上，因此不同国家，特别是东西跨度大的国家日出、日落时间必定有所偏差。这些偏差就是所谓的时差。

在 1884 年的“国际经度会议”上，**格林尼治天文台**测定的经线被确定为零度经线，有关国际会议决定将地球表面按经线从东到西，每相隔 15 度划一个区域，这样一共有 24 个区域（从西十二区到东十二区，规定英国（格林尼治天文台旧址）为中时区），并且规定相邻区域的时间相差 1 小时。当人们跨过一个区域，就将自己的时钟校正 1 小时（向西减 1 小时，向东加 1 小时），跨过几个区域就加或减几小时。

> 上面提到的时区正确来说应该是**理论时区**，实际上部分国家可能横跨多个时区，常常以国家内部行政分界线为时区界线，即为**法定时区**。

![time zones](https://upload.wikimedia.org/wikipedia/commons/8/88/World_Time_Zones_Map.png)

### 国际日期变更线

**国际日期变更线**是一条想象出来的经线，大致位于地球表面东经（或西经）180 度的位置，我们可以看到它是一条并非完全笔直的竖线，被它分隔出的两旁地区，时期相差整整一天。也就是说，假如你正在进行一场环球旅行，那在每进入一个新时区时，你就需要把你的时间向前或向后调整 1 小时。等你绕地球整整一周时，你的时钟就调整了 24 小时，而这 24 小时意味着你的时钟日期和实际日期产生了一天的偏差。为了避免这一天的变动，日期变更线避开了太平洋中间的一些国家。如果你向东穿过日期变更线，日期就减一天。反之，如果是向西穿越日期变更线，日期就加一天。

![international-date-line](http://www.timeofdate.com/articles/images/international-date-line.jpg)

## 时间标准

### GMT

**GMT** 即格林威治时间(Greenwich Mean Time)，以伦敦格林威治的子午线为基线，以地球自转为标准，全球都以此标准设定时间:

```JS
// 默认返回当地时区对应的时间
new Date()
// Wed May 06 2020 16:00:33 GMT+0800 (China Standard Time)
```

**时间戳(timestamp)**就是指格林威治时间 `1970-01-01 00:00:00` 起至现在的总毫秒数:

```JS
// 获取当前时间戳，和时区没半毛钱关系
Date.now()
new Date().getTime()
new Date().valueOf()
// 1588752190994

new Date('1970-01-01').getTime() // 0
```

> **注意不同时区/地区，时间戳都是一样的，我们可以根据时间戳和时区来计算当前时区的时间** 👈

### UTC

[**UTC**](https://zh.wikipedia.org/wiki/协调世界时) 即协调世界时间(Coordinated Universal Time)，是最主要的世界时间标准，在时刻上尽量接近于 GMT。UTC 基于国际原子时，并通过不规则的加入闰秒来抵消地球自转变慢的影响。闰秒在必要的时候会被插入到 UTC 中，以保证协调世界时与[世界时（UT1）](https://zh.wikipedia.org/wiki/世界时)相差不超过 0.9 秒。

### DST

[**DST**](https://zh.wikipedia.org/wiki/夏时制) 即夏令时(daylight saving time)，为了节约能源，一般在天亮早的夏季人为将时间调快一小时，可以使人早起早睡，减少照明量，以充分利用光照资源，从而节约照明用电。通常使用夏令时间的地区，会在接近春季开始的时候，将时间调快一小时，并在秋季调回正常时间。

全球仍有部分国家在实施夏令时。值得注意的是，我国在 1986 年至 1991 年期间也使用了夏令时，具体可以参考[夏令时中对中国状况的描述](https://baike.baidu.com/item/夏令时)，比如 `1986年5月4日 - 9月14日`，值得注意的是此夏季区间打印出来的时间都是东九区:

```JS
new Date('1986-05-04 00:00:00')
// Sun May 04 1986 00:00:00 GMT+0800 (China Standard Time) {}

new Date('1986-05-05 00:00:00')
// Mon May 05 1986 00:00:00 GMT+0900 (China Daylight Time) {}
```

> 各个国家的时间标准可能有所不同，比如中国采用的为北京时间(CST)，日本为 JST，具体可以根据 [moment timezone](https://momentjs.com/timezone/) 库查看 👈

## Date 对象

### new Date()

[**Date**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) 对象则基于 `Unix Time Stamp`，即自 1970 年 1 月 1 日（UTC）起经过的毫秒数，其语法如下:

* new Date() - 实例化时刻的日期和时间
* new Date(timestamp) - 接收一个时间戳，返回对应的当前时区的日期
* new Date(dateString) - 接收一个日期格式的字符串，返回对应的当前时区的日期
* new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
  * year - 年份。完整年份可以通过 `getFullYear()` 获取，设置的话为 `setFullYear()`，下面都可以套用该规则来自定义时间
  * monthIndex - 月份索引(0-11)。可以通过 `getMonth()` 获取，注意月份要加 1
  * day - 天数(1-31)，可以通过 `getDate()` 获取。注意 `getDay()` 是返回一周的第几天(0-6)，0 为周天
  * hours - 小时(0-23)，可以通过 `getHours()` 获取
  * minutes - 分钟(0-59)，可以通过 `getMinutes()` 获取
  * sencodes - 秒(0-59)，可以通过 `getSeconds()` 获取
  * getMilliseconds - 毫秒(0-999)，可以通过 `getMilliseconds()` 获取

```JS
const date1 = new Date('December 17, 1995 03:24:00')
// Sun Dec 17 1995 03:24:00 GMT+0800 (CST)

const date2 = new Date('1995-12-17T03:24:00')
// Sun Dec 17 1995 03:24:00 GMT+0800 (CST)

console.log(date1 === date2) // false

console.log(date1 - date2) // 0
```

需要注意的是 dateString 日期字符串应该尽量符合 `RFC2822` 或 `ISO 8601` 标准，否则返回值不一定符合预期。而且要能被 `Date.parse()` 正确方法识别(返回时间戳)，具体格式可以[查看 MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)，下面举一些示例:

```JS
// ISO 标准
"2020-05-06" // date-only form
"2020-05-06T14:48:00" // date-time form
"2020-05-06T14:48:00.000+09:00" // date-time form with milliseconds and time zone
"2020-05-06T00:00:00.000Z" // specifying UTC timezone via the ISO date specification，Z is the same with +00:00

// 非 ISO 标准
'Aug 9, 2008'
'Wed, 09 Aug 2008 00:00:00'
'Wed, 09 Aug 2008 00:00:00 GMT+3'
'2020-05-04 00:00:00 GMT+3'
'2020/05/04 00:00:00 GMT+3'
```

我们不妨尝试一些例子，可以看到下面两种写法返回的时间不一致，这是因为直接给传入 `yyyy-MM-dd` 格式日期字符串的话，会得到的是一个基于 UTC 时间的 Date 实例，而 UTC 时间即是中时区的标准时间，于东八区刚好相差 8 小时:

```JS
new Date('2019-10-10') // 尽量避免这种写法
// Thu Oct 10 2019 08:00:00 GMT+0800 (China Standard Time)

new Date('2019-10-10 00:00:00')
// Thu Oct 10 2019 00:00:00 GMT+0800 (China Standard Time)
```

另外对于时间的 set 设置，有些方法是支持多个参数的，注意他们返回的都是时间戳，比如:

```JS
const a = new Date() // Mon May 04 2020 05:00:00 GMT+0800 (China Standard Time)
a.setFullYear(2008, 8, 8) // 1220870868302，Mon Sep 08 2008 18:47:48 GMT+0800 (China Standard Time)
a.setHours(0, 0, 0) // 1220803200302，Mon Sep 08 2008 00:00:00 GMT+0800 (China Standard Time)
```

还有一点需要注意的是，在 safari 我们肯定遇到过这种情况，需要注意下日期字符串的格式:

```JS
new Date('2020-05-06 00:00:00') // Invalid Date

new Date('2020/05/06 00:00:00') // Wed May 06 2020 00:00:00 GMT+0800 (CST) ✅ PS: 在其他浏览器上也可以
```

### getTimezoneOffset()

**getTimezoneOffset** 方法返回协调世界时（UTC）相对于当前时区的时间差值，单位为分钟:

```JS
const date1 = new Date('August 19, 1975 23:15:30 GMT+07:00')
const date2 = new Date('August 19, 1975 23:15:30 GMT-02:00')

console.log(date1.getTimezoneOffset()); // -480(东八区)
// expected output: your local timezone offset in minutes
// (eg -480). NOT the timezone offset of the date object.

console.log(date1.getTimezoneOffset() === date2.getTimezoneOffset()) // true
```

需要注意的是，**不管你如何实例化一个 Date 对象，JS 在本地存储时，都会将它转换成本地时区**。js 不会帮你存储实例化该日期时的时区信息:

```JS
new Date('2020-05-04 00:00:00 GMT+3')
// Mon May 04 2020 05:00:00 GMT+0800 (China Standard Time) 自动转为本地时区时间
```

> It's important to keep in mind that while the time value at the heart of a Date object is UTC, the basic methods to fetch the date and time or its components all work in the local (i.e. host system) time zone and offset.

## 第三方库

下面推荐一些比较好用的处理时间的第三方库，更多推荐[可以参考这里](https://blog.bitsrc.io/9-javascript-date-time-libraries-for-2018-12d82f37872d) 👈

* [date-fns](https://date-fns.org/v2.12.0/docs/Getting-Started) - Modern JavaScript date utility library
* [Moment.js](https://momentjs.com) - Parse, validate, manipulate, and display dates and times in JavaScript
* [Moment Timezone](https://momentjs.com/timezone/) - Parse and display dates in any timezone
* [Day.js](https://day.js.org) - Fast 2kB alternative to Moment.js with the same modern API

```JS
import { format, compareAsc } from 'date-fns'

// 对日期进行格式化
format(new Date(2014, 1, 11), 'MM/dd/yyyy') // '02/11/2014'

const dates = [new Date(1995, 6, 2), new Date(1987, 1, 11), new Date(1989, 6, 10)]
dates.sort(compareAsc) // 按日期顺序排列

// 还有很多好用的功能，具体参考官网
```

## 参考链接

1. [时区与 JS 中的 Date 对象](https://juejin.im/post/5d23ef766fb9a07ea5681378) BY BDEEFE
2. [时区大全](http://www.timeofdate.com)

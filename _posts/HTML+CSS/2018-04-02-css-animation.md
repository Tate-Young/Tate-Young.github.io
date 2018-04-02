---
layout: blog
front: true
comments: True
flag: CSS
background: purple
category: 前端
title:  CSS 动画
date:   2018-04-02 17:07:00 GMT+0800 (CST)
background-image: /style/images/darling.jpg
tags:
- css
---
# {{ page.title }}

## transform 变换

### transform

* 2D Transform Functions：
  * **matrix()** - 以一个含六值的 (a,b,c,d,e,f) 变换矩阵的形式指定一个 2D 变换，相当于直接应用一个 [a,b,c,d,e,f] 变换矩阵
  * **translate()** - 指定对象的 2D translation（2D平移）。参数分别对应 X 轴和 Y 轴。如果第二个参数未提供，则默认值为 0
  * **translatex()** - 指定对象 X 轴（水平方向）的平移
  * **translatey()** - 指定对象 Y 轴（垂直方向）的平移
  * **rotate()** - 指定对象的 2D rotation（2D旋转），需先有 <' transform-origin '> 属性的定义
  * **scale()** - 指定对象的 2D scale（2D缩放）。参数分别对应 X 轴和 Y 轴。如果第二个参数未提供，则默认取第一个参数的值
  * **scalex()** - 指定对象 X 轴的（水平方向）缩放
  * **scaley()** - 指定对象 Y 轴的（垂直方向）缩放
  * **skew()** - 指定对象 skew transformation（斜切扭曲）。参数分别对应 X 轴和 Y 轴。如果第二个参数未提供，则默认值为 0
  * **skewx()** - 指定对象 X 轴的（水平方向）扭曲
  * **skewy()** - 指定对象 Y 轴的（垂直方向）扭曲
* 3D Transform Functions：
  * **matrix3d()** - 以一个 4x4 矩阵的形式指定一个 3D 变换
  * **translate3d()** - 指定对象的 3D 位移。参数分别对应 X、Y、Z轴，参数不允许省略
  * **translatez()** - 指定对象 Z 轴的平移
  * **rotate3d()** - 指定对象的 3D 旋转角度，其中前 3 个参数分别对应 X、Y、Z轴，第 4 个参数表示旋转的角度，参数不允许省略
  * **rotatex()** - 指定对象在 x 轴上的旋转角度
  * **rotatey()** - 指定对象在 y 轴上的旋转角度
  * **rotatez()** - 指定对象在 z 轴上的旋转角度
  * **scale3d()** - 指定对象的 3D 缩放。参数分别对应 X、Y、Z轴，参数不允许省略
  * **scalez()** - 指定对象的 z 轴缩放
  * **perspective()** - 指定透视距离

```CSS
transform: none | <transform-function>+
```

### transform-origin

**transform-origin** 用来设置或检索对象以某个原点进行转换，默认值：50% 50%，效果等同于 center center，取值为:

* **\<percentage\>** - 用百分比指定坐标值。可以为负值。
* **\<length\>** - 用长度值指定坐标值。可以为负值。
* **left** - 指定原点的横坐标为 left
* **center①** - 指定原点的横坐标为 center
* **right** - 指定原点的横坐标为 right
* **top** - 指定原点的纵坐标为 top
* **center②** - 指定原点的纵坐标为 center
* **bottom** - 指定原点的纵坐标为 bottom

```CSS
-webkit-transform-origin: top center;
-moz-transform-origin: top center;
-ms-transform-origin: top center;
-o-transform-origin: top center;
transform-origin: top center;
```

### transform-style

**transform-style** 指定某元素的子元素是位于三维空间内，还是在该元素所在的平面内被扁平化，取值为:

* **flat** - 指定子元素位于此元素所在平面内，默认
* **preserve-3d** - 指定子元素定位在三维空间内

### perspective

**perspective** 指定观察者距离「z=0」平面的距离，为元素及其内容应用透视变换。不允许负值。不同视距的设置会导致成像不同

```CSS
perspective：none | <length>
```

查看 JSFiddle 演示:

<script async src="//jsfiddle.net/Tate_Young/bkhc0btt/embed/html,css,result/"></script>

### backface-visibility

**backface-visibility** 指定元素背面面向用户时是否可见，取值为:

* **visible** - 指定元素背面可见，允许显示正面的镜像
* **hidden** - 指定元素背面不可见

查看 JSFiddle 演示:

<script async src="//jsfiddle.net/Tate_Young/4u055rsv/1/embed/html,css,result/"></script>

## transition 过渡

复合属性，检索或设置对象变换时的过渡，包括:

* **transition-property** - 检索或设置对象中的参与过渡的属性，[可点击查看有过渡属性的 css 属性](http://www.css88.com/book/css/properties/transition/transition-property.htm)
  * none：不指定过渡的 css 属性
  * all：所有可以进行过渡的 css 属性
  * \<IDENT\>：指定要进行过渡的 css 属性
* **transition-duration** - 检索或设置对象过渡的持续时间
* **transition-timing-function** - 检索或设置对象中过渡的动画类型
  * linear：线性过渡。等同于贝塞尔曲线(0.0, 0.0, 1.0, 1.0)
  * ease：平滑过渡。等同于贝塞尔曲线(0.25, 0.1, 0.25, 1.0)
  * ease-in：由慢到快。等同于贝塞尔曲线(0.42, 0, 1.0, 1.0)
  * ease-out：由快到慢。等同于贝塞尔曲线(0, 0, 0.58, 1.0)
  * ease-in-out：由慢到快再到慢。等同于贝塞尔曲线(0.42, 0, 0.58, 1.0)
  * step-start：等同于 steps(1, start)
  * step-end：等同于 steps(1, end)
  * steps()：接受两个参数的步进函数。第一个参数必须为正整数，指定函数的步数。第二个参数取值可以是 start 或 end ，指定每一步的值发生变化的时间点。第二个参数是可选的，默认值为 end
  * cubic-bezier()：特定的贝塞尔曲线类型，接受 4 个 [0, 1] 区间内数值参数
* **transition-delay** - 检索或设置对象延迟过渡的时间

[查看 cubic-bezier 在线生成器](http://yisibl.github.io/cubic-bezier/#.17,.67,.91,.43)

```CSS
transition: background-color .5s ease-in .1s;

/* 等价于 */
transition-property: background-color;
transition-duration: .5s;
transition-timing-function: ease-in;
transition-delay: .1s;
```

## animation 动画

复合属性，检索或设置对象所应用的动画特效，包括:

* **animation-name** - 检索或设置对象所应用的动画名称
  * none：不引用任何动画名称，默认
  * \<identifier\>：定义一个或多个动画名称(identifier标识)，通过 @keyframe 指定
* **animation-duration** - 检索或设置对象动画的持续时间
* **animation-timing-function** - 检索或设置对象动画的过渡类型
* **animation-delay** - 检索或设置对象动画延迟的时间
* **animation-iteration-count** - 检索或设置对象动画的循环次数，默认为 1
* **animation-direction** - 检索或设置对象动画在循环中是否反向运动
  * normal - 正常方向，默认
  * reverse - 反方向运行
  * alternate - 动画先正常运行再反方向运行，并持续交替运行
  * alternate-reverse - 动画先反运行再正方向运行，并持续交替运行
* **animation-fill-mode** - 检索或设置对象动画时间之外的状态
  * none - 默认值。不设置对象动画之外的状态
  * forwards - 设置对象状态为动画结束时的状态
  * backwards - 设置对象状态为动画开始时的状态
  * both - 设置对象状态为动画结束或开始的状态

使用 @keyframe 定义动画时，简单的动画可以直接使用关键字 from 和 to，也可使用 \<percentage\> 去设置某个时间段内的任意时间点的样式:

```CSS
/* animation: testanimations 3s linear */
@keyframes testanimations {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes testanimations{
  0% { transform: translate(0, 0); }
  40% { transform: translate(40px, 0); }
  80% { transform: translate(80px, 10px); }
  100% { transform: translate(100px, 20px); }
}
```

## CSS 动画示例

[alloyteam 简单动画演示](http://css3lib.alloyteam.com/uilib/animation/demo1/#cta)

使用 perspective 和 transform 实现容器上的悬浮效果，

<iframe id="bvwYrg" src="//codepen.io/airen/embed/bvwYrg?height=400&amp;theme-id=0&amp;slug-hash=bvwYrg&amp;default-tab=result&amp;user=airen" scrolling="no" frameborder="0" height="400" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="width: 100%; overflow: hidden;"></iframe>

<style>
.under-line{
  position: relative;
}
.under-line::before {
  content: '';
  position: absolute;
  top: auto;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ff4081;
  -webkit-transition: all .2s;
  transition: all .2s;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
}
.under-line:hover::before, .under-line:focus::before {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}
</style>

<a style="border:none;" data-hover="天王盖地虎">天王盖地虎</a>
<a class="under-line" style="border:none;">宝塔镇河妖</a>

```CSS
/* 宝塔镇河妖 样式参考 */
.under-line{
  position: relative;
}
.under-line::before {
  content: '';
  position: absolute;
  top: auto;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ff4081;
  -webkit-transition: all .2s;
  transition: all .2s;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
}
.under-line:hover::before, .under-line:focus::before {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}
```

## 参考链接

1. [CSS3 参考手册](http://www.css88.com/book/css/)
1. [w3cplus - Transform-style 和 Perspective 属性](https://www.w3cplus.com/css3/transform-basic-property.html) By Airen
1. [w3cplus - 使用 perspective 和 transform 实现容器上的悬浮效果](https://www.w3cplus.com/css/animate-a-container-on-mouse-over-using-perspective-and-transform.html) By Airen
1. [alloyteam 简单动画演示](http://css3lib.alloyteam.com/uilib/animation/demo1/#cta)
1. [前端观察 - HTML5+CSS3 loading 效果收集](https://www.qianduan.net/free-html5-css3-loaders-preloaders/)
1. [cubic-bezier 在线生成器](http://yisibl.github.io/cubic-bezier/#.17,.67,.91,.43)
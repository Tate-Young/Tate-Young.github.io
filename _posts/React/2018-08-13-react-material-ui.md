---
layout: blog
tool: true
comments: True
flag: React
background: green
category: 前端
title:  Material-UI
date:   2018-08-013 22:16:00 GMT+0800 (CST)
background-image: https://i.loli.net/2018/08/13/5b7147a3e4935.png
tags:
- react
---
# {{ page.title }}

## 什么是 Material-UI

[**Material-UI**](https://material-ui.com/getting-started/usage/) 是一组 React 组件，设计风格采用了 Google 的 [**Material Design**](https://material.io/)。👍

看个简单的栗子:

```JSX
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

function App() {
  return (
    <Button variant="contained" color="primary">
      Hello World
    </Button>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

> [Icons 图标看这里](https://material.io/tools/icons/?style=baseline) 👈

## JSS

[**JSS**](https://github.com/cssinjs/jss) 就是 "CSS In JS"，引用官方的介绍:

> JSS is a more powerful abstraction over CSS. It uses JavaScript as a language to describe styles in a declarative and maintainable way. It is a high performance JS to CSS compiler which works at runtime and server-side. This core library is low level and framework agnostic. It is about 6KB (minified and gzipped) and is extensible via plugins API.

Material-UI 样式解决方案就是采取 JSS 作为核心，我们使用 JSS 并通过 **withStyles** 创建的高阶组件将 styles 数组注入到 DOM 中作为 CSS 样式，如下:

```JSX
// 1. We define the styles.
const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};
```

```JSX
// 样式通过对象的形式访问
function ButtonAppBar(props) {
  const { classes } = props; // 获取 props 里的 classes 属性
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

// 2. We inject the styles.
export default withStyles(styles)(ButtonAppBar);
```

## Theme 主题

这里目前只讨论默认主题的情况，默认的全部样式[可查看这里](https://material-ui.com/customization/default-theme/):

```JSX
// theme.spacing.unit 默认为 8
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    backgroundColor: theme.palette.type === 'light' ? theme.palette.common.white : '#242424',
    minHeight: theme.spacing.unit * 40,
    width: '100%',
  },
  switch: {
    paddingBottom: theme.spacing.unit,
  },
});
```

> 如果需要自定义主题，需要使用 **MuiThemeProvider** 组件来注入到应用中，[具体查看这里](https://material-ui.com/customization/themes/) 👈

## 样式与布局

### CSS Baseline

**CSS Baseline** 如同 [normalize.css](https://github.com/necolas/normalize.css)，是属于 HTML 元素和属性样式标准化的一个集合:

```JSX
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

function MyApp() {
  return (
    <React.Fragment>
      <CssBaseline />
      {/* The rest of your application */}
    </React.Fragment>
  );
}
```

### Typography

API 可[查看这里](https://material-ui.com/api/typography/#__next)，常用的属性:

| 属性 | 类型 | 默认值 | 描述 |
|:--------------|:---------|:---------|:---------|
| children | node | | 通用属性。The content of the component. |
| classes | object | | 通用属性。Override or extend the styles applied to the component. See CSS API below for more details. |
| component | union: string、func、object | 'div' | 通用属性。The component used for the root node. Either a string to use a DOM element or a component. |
| **align** | enum: 'inherit', 'left', 'center', 'right', 'justify' | 'inherit' | Set the text-align on the component. |
| **color** | enum: 'default', 'error', 'inherit', 'primary', 'secondary', 'textPrimary', 'textSecondary' | 'default' | The color of the component. It supports those theme colors that make sense for this component. |
| gutterBottom | bool | false | If true, the text will have a bottom margin. |
| **noWrap** | bool | false | If true, the text will not wrap, but instead will truncate with an ellipsis. |
| paragraph | bool | false | If true, the text will have a bottom margin. |
| **variant** | enum: 'display4...1', 'headline', 'title', 'subheading', 'body2...1', 'caption', 'button' | 'body1' | Applies the theme typography styles. |

<iframe src="https://codesandbox.io/embed/1v4yko910l?module=%2Fdemo.js" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Grid

**Grid** 属于响应式布局，Material Design’s responsive UI is based on a 12-column grid layout:

```JSX
function CenteredGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        ...
      </Grid>
    </div>
  )
}
```

## 常用组件

### Button

| 属性 | 类型 | 默认值 | 描述 |
|:--------------|:---------|:---------|:---------|
| **color** | enum: 'default'、'inherit'、'primary'、'secondary' | 'default' | The color of the component. It supports those theme colors that make sense for |
| **disabled** | bool | false | If true, the button will be disabled. |
| fullWidth | bool | false | If true, the button will take up the full width of its container. |
| mini | bool | false | If true, and variant is 'fab', will use mini floating action button styling. |
| size | enum: 'small'、'medium'、'large' | 'medium' | The size of the button. small is equivalent to the dense button styling. |
| **variant** | enum: 'text', 'flat', 'outlined', 'contained', 'raised', 'fab', 'extendedFab' | 'text' | The variant to use. |

<iframe src="https://codesandbox.io/embed/53ok610wql?module=%2Fdemo.js" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Dialog

| 属性 | 类型 | 默认值 | 描述 |
|:--------------|:---------|:---------|:---------|
| fullScreen | bool | false | If true, the dialog will be full-screen |
| fullWidth | bool | false | If true, the dialog stretches to maxWidth. |
| **open** | bool | | If true, the Dialog is open. |
| **onClose** | func | | Callback fired when the component requests to be closed. |
| onEnter | func | | Callback fired before the dialog enters. |
| scroll | enum: 'body'、'paper' | 'paper' | Determine the container for scrolling the dialog. |
| TransitionComponent | union: string、func、object | Fade | Transition component. |
| transitionDuration | union: number、{ enter?: number, exit?: number } | { enter: duration.enteringScreen, exit: duration.leavingScreen } | The duration for the transition, in milliseconds. You may specify a single timeout for all transitions, or individually with an object. |

<iframe src="https://codesandbox.io/embed/1840qm2j07?module=%2Fdemo.js" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Paper

| 属性 | 类型 | 默认值 | 描述 |
|:--------------|:---------|:---------|:---------|
| **elevation** | number | 2 | Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive. |
| **square** | bool | false | If true, rounded corners are disabled. |

```JSX
<div>
  <Paper className={classes.root} elevation={1}>
    <Typography variant="headline" component="h3">
      This is a sheet of paper.
    </Typography>
    <Typography component="p">
      Paper can be used to build surface or other elements for your application.
    </Typography>
  </Paper>
</div>
```

> 其他组件及对应 API [请查看这里](https://material-ui.com/demos/app-bar/) 👈

## 动画组件

常用的动画组件如下:

* **\<Collapse /\>**
* **\<Fade /\>**
* **\<Grow /\>**
* **\<Slide /\>**
* **\<Zoom /\>**

<iframe src="https://codesandbox.io/embed/1w3rx6pl57?module=%2Fdemo.js" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## 参考链接

1. [Material-UI 官方文档](https://material-ui.com/getting-started/usage/)
2. [JSS 官方文档](http://cssinjs.org/?v=v9.8.7)

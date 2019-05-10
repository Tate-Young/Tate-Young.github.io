/**
 * gtag 首页埋点
*/

const createFunctionWithTimeout = (callback, opt_timeout) => {
  let called = false;
  function fn() {
    if (!called) {
      called = true;
      callback();
    }
  }
  setTimeout(fn, opt_timeout || 1000);
  return fn;
}
// 统一的 gtag 点击事件
const gtagEventClick = (param, fn, action = 'click') => {
  let gtagParam = param

  if (typeof fn === 'function') {
    gtagParam = {...param, ...{
      'event_callback': createFunctionWithTimeout(fn)
    }}
  }

  gtag('event', action, gtagParam)
}
// 点击 logo
const onClickLogo = () => {
  gtagEventClick({
    'event_category': 'Logo',
    'event_label': 'Tate & Snow',
  }, () => {
    window.location.href = '/?tate'
  });
}

// 点击 card
const onClickCard = (title = '', url = '/') => {
  gtagEventClick({
    'event_category': 'Blog',
    'event_label': title,
  }, () => {
    window.location.href = url
  });
}

// 点击 card 分类
const onClickCategory = (category) => {
  gtagEventClick({
    'event_category': 'Category',
    'event_label': category,
  }, () => {
    window.location.href = `/tags#${category}`
  });
}

// 点击 menu
const onClickMenu = (title = '', url = '/') => {
  gtagEventClick({
    'event_category': 'Menu',
    'event_label': title,
  }, () => {
    window.location.href = `${url}?tate`
  });
}

// 点击搜索
const onClickSearch = () => {
  gtagEventClick({
    'event_category': 'Search',
    'event_label': 'Search blogs',
  });
}

/**
 * gtag 博客页埋点
*/
// 点击 分类标签
const onClickTag = (tag) => {
  gtagEventClick({
    'event_category': 'Tag',
    'event_label': tag,
  }, () => {
    window.location.href = `/tags#${tag}`
  });
}

// 监听博客页面侧边栏锚点
if (typeof directoryContainer !== 'undefined') {
  directoryContainer.addEventListener('click', (e) => {
    const { target: { nodeName = '', name } = {} } = e
    const { innerText = '' } = postTitle

    if (nodeName === 'A') {
      gtagEventClick({
        'event_category': 'Anchor',
        'event_label': innerText + name,
        'post_title': innerText,
      }, () => {
        window.location.href = name
      });
    }
  })
}

---
layout: blog
front: true
comments: True
flag: JS
background: blue
category: 前端
title:  FormData & File API
date:   2018-03-29 13:43:00 GMT+0800 (CST)
update: 2021-01-22 17:07:00 GMT+0800 (CST)
background-image: /style/images/js.png
tags:
- JavaScript
---
# {{ page.title }}

## FormData

### 实例方法

XMLHttpRequest Level 2 添加了一个新的接口 **FormData**，可以组装一组用 XMLHttpRequest 发送请求的键/值对，它可以更灵活方便的管理和发送表单数据，还可以上传文件。FormData 是构造函数，其实例上的方法有:

* **append()** - 添加一个键/值对
* **delete()** - 删除一个键/值对
* **set()** - 修改或新增一个键/值对
* **get()** - 返回指定的键关联的第一个值
* **getAll()** - 返回指定 key 的所有值
* **has()** - 返回一个布尔值，是否含有某个 key 值
* **entries()** - 返回一个 iterator 对象，此对象可以遍历访问 FormData 中的键值对
* **keys()** - 返回一个 iterator 对象，此对象可以遍历访问 FormData  中的所有 key，这些 key 是 [USVString 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString)
* **values()** - 返回一个 iterator 对象，此对象可以遍历访问 FormData  中的所有 value

### 创建

FormData 的使用方式:

```JS
var formData = new FormData();

formData.append('name', 'tate');
formData.append('age', 18); // 数字 18 会被立即转换成字符串 "18"

// HTML 文件类型 input，由用户选择
formData.append('userfile', fileInputElement.files[0]);

// JavaScript file-like 对象
var content = '<a id="a"><b id="b">hey!</b></a>'; // 新文件的正文...
var blob = new Blob([content], { type: "text/xml"});

formData.append('webmasterfile', blob);

var request = new XMLHttpRequest();
request.open('POST', 'http://foo.com/submitform.php');
request.send(formData); // 直接发送 FormData 数据
```

还可以通过 HTML 表单创建 FormData 对象:

```HTML
<form name="myForm">
  <input type="text" name="username" value="tate">
  <input type="text" name="age" value="18">
</form>
```

```JS
// key 值与表单控件 name 属性对应
var myForm = document.forms.namedItem('myForm') // namedItem 返回具有指定 id 或 name 属性的首个元素或节点
var formData = new FormData(myForm);
console.log(formData.get('username')); // 'tate'
```

### 特殊请求处理

jQuery 使用 HTTP 请求上传 FormData 数据的方法：

```JS
$.ajax({
  url: "stash.php",
  type: "POST",
  data: formData,
  processData: false,  // 不处理数据
  contentType: false   // 不设置内容类型
});
```

AngularJS 使用 HTTP 请求上传 FormData 数据的方法，通过设置 `'Content-Type': undefined`，这样浏览器会自动把 Content-Type 设置为 multipart/form-data，并生成了一个 boundary 用于分割不同的字段，如果直接手动设置为 `'Content-Type': multipart/form-data`，后台会抛出异常:

```JS
$http({
  method: 'POST',
  url: url,
  data: formData,
  headers: {
    'Content-Type': undefined // 不设置内容类型
  }
});
```

## File API

### FileList

**FileList** 对象通常来自于 `<input type="file" multiple>` 选择文件，也可以来自拖放操作生成的 DataTransfer 对象。可以通过这个对象访问到用户所选择或拖放的文件。设置 *multiple* 属性，则可以同时上传多个文件。

```HTML
<input id="fileItem" type="file" multiple>
```

```JS
// 获取到一个 FileList 对象中的第一个文件(File 对象)
var file = document.getElementById('fileItem').files[0];
```

### File

**File** 对象继承于 [**Blob** 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)，Blob 对象表示一个不可变、原始数据的类文件对象。File 属性有以下这些:

* **name** - 文件名，该属性只读
* **size** - 文件大小，单位为字节，该属性只读
* **type** - 文件的 MIME 类型，如果分辨不出类型，则为空字符串，该属性只读
* **lastModified** - 文件的上次修改时间，格式为时间戳
* **lastModifiedDate** - 文件的上次修改时间，格式为 Date 对象实例

```JS
{ // File 对象属性
  lastModified: 1520483781436
  lastModifiedDate: Thu Mar 08 2018 12:36:21 GMT+0800 (CST) {}
  name: 'base64.png'
  size: 406458
  type: 'image/png'
  webkitRelativePath: ''
  __proto__: File
}
```

### FileReader

**FileReader** 对象允许 Web 应用程序异步读取存储在用户计算机上的文件(或原始数据缓冲区)的内容。参数为 File 对象或 Blob 对象，提供了以下几个方法:

* **readAsText**(file\|blob [, encoding]) - 以纯文本形式读取文件，将读取到的文本保存在 result 属性中。第二个参数用于指定编码类型，可选
* **readAsDataURL**(file\|blob) - 读取文件并以 data:URL 格式保存在 result 属性中，默认为 base64 编码
* **readAsArrayBuffer**(file\|blob) - 读取文件并将一个包含文件内容的 [ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 保存在 result 属性中
* **abort**() - 中止读取操作

由于读取文件的过程是异步的，因此 FileReader 也提供了几个事件，和 XHR 进度事件类似，常用的有：

* **loadstart** - 读取操作开始时触发
* **progress** - 数据读取中
* **error** - 读取操作发生错误时触发
* **abort** - 读取操作被中断时触发
* **load** - 读取操作完成时触发
* **loadend** - 数据读取结束时触发，无论成功或失败

progress 事件与 XHR 的 progress 事件类似，每过 50ms 左右，就会触发一次。同样可以获取到如下三个的属性:**lengthComputable**、**loaded** 和 **total**。每次 progress 事件中都可以通过 FileReader 的 result 属性读取到文件内容。

### 案例

点击:

<style>
  .thumb {
    height: 75px !important;
    border: 1px solid #000 !important;
    margin: 10px 5px 0 0 !important;
    display: inline !important;
  }
</style>

<input type="file" id="files" name="files[]" multiple />
<output id="list"></output>

<script>
  function handleFileSelect(ev) {
    var files = ev.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
</script>

拖拽:

<style>
  #drop_zone {
    border: 2px dashed #bbb;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    font: 20pt bold 'Vollkorn';
    color: #bbb;
  }
</style>

<div id="drop_zone">Drop files here</div>
<output id="drop-list"></output>

<script>
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('drop-list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
</script>

以 [drag 一节示例]( {{site.url}}/2018/03/28/js-touch-drag.html ) 为例:

```JS
var dragFile = {
  doc: document,
  init: function() {
    var dragArea = this.doc.querySelector('.drag-area');

    dragArea.addEventListener('dragover', function(ev) {
      ev.preventDefault();
    }, false);

    dragArea.addEventListener('drop', function(ev) {
      // 操作系统拖放文件到浏览器需要取消默认行为
      ev.preventDefault();
      // 遍历拖放拿到的文件集合 FileList
      [].forEach.call(ev.dataTransfer.files, function(file) {
        // 判断文件类型 type 是否为图片
        if (file && file.type.match('image.*')) {
          var reader = new FileReader();

          reader.onload = function(ev) {
            var img = dragFile.doc.createElement('img');
            img.src = ev.target.result;
            var li = dragFile.doc.createElement('li');
            li.appendChild(img);
            dragArea.appendChild(li);
          };

          reader.readAsDataURL(file);
        }
      });
    }, false);
  }
};

dragFile.init();
```

### 展示图片的过程

[可以参考 MDN 这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications) 👈

首先是选择文件:

1、**通过 click 方法使用隐藏的 file input 元素**

```HTML
<!-- 隐藏 file input 元素 -->
<input type="file" id="fileElem" multiple accept="image/*" style="display:none" onchange="handleFiles(this.files)">
<a href="#" id="fileSelect">Select some files</a>
```

```JS
var fileSelect = document.getElementById("fileSelect"),
  fileElem = document.getElementById("fileElem");

fileSelect.addEventListener("click", function (e) {
  if (fileElem) {
    fileElem.click();
  }
  e.preventDefault(); // 避免导航到 "#"
}, false);
```

2、**使用 label 元素来触发一个隐藏的 file input 元素**

```HTML
<!-- 隐藏 file input 元素，此时不需要额外添加 click 事件，比上面方法好用 😁 -->
<input type="file" id="fileElem" multiple accept="image/*" style="display:none" onchange="handleFiles(this.files)">
<label for="fileElem">Select some files</label>
```

3、**使用拖放 dnd(drag and drop) 来选择文件**

然后显示用户选择的图片的缩略图:

1、**使用 FileReader**

```JS
function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /^image\//;

    if (!imageType.test(file.type)) {
      continue;
    }

    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }
}
```

2、**使用对象 URL**

需要用到的方法如下，这个对象 URL 是一个标识 File 对象的 blob 字符串。每次你调用 `URL.createObjectURL()`，就会产生一个唯一的对象 URL:

```JS
// 直接挂到 img 元素的 src 属性上即可
var objectURL = window.URL.createObjectURL(fileObj);

// 生成的 blob 字符串
// blob:http://localhost:3000/51f4b8ce-4f5d-4807-b21e-de69ef40da69
```

每个创建了的对象 URL 必须要释放。当文档关闭时，它们会自动被释放。如果你的网页要动态使用它们，你需要显式调用 `window.URL.revokeObjectURL()`来释放它们。

### 下载 download

这里介绍一个 **download** 下载属性[(caniuse)](https://caniuse.com/#search=download):

<a href="{{ site.url }}/search/demo.txt" download="真兄弟">我系渣渣辉，链接在此，是兄弟就来点我！ ( ⊙ o ⊙ )</a>

```HTML
<a href="{{ site.url }}/search/demo.txt" download="demo">>点击下载</a>
```

还可以调用 URL 对象的 [createObjectURL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL) 方法，传入一个 File 对象或者 Blob 对象，静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的 URL:

```JS
var blob = new Blob(['Tate & Snow']);
var a = document.createElement('a');
a.href = window.URL.createObjectURL(blob); // 用到全局 URL 对象的 createObjectURL 方法
a.download = 'download.txt'; // 定义下载的文件名
a.textContent = 'Download Me';

document.body.appendChild(a);
```

### 图片转换

#### 转 base64 和 md5 加密

```JS
import MD5 from 'crypto-js/md5'

// 自动转 base64 并采用 md5 加密，生成唯一标识符 id
const toBase64AndMD5 = (file, callback) => {
  let md5 = ''
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    md5 = MD5(reader.result).toString() || '' // 拿到 base64 编码再进行 md5 加密
    callback(md5)
  }
  reader.onerror = error => {
    console.log('Upload Error: ', error)
  }
}
```

#### base64 转 File

一共有两种方式，一个是调用 `new File()`，另一个是通过转为 blob，再转为 File。可以具体看下栗子 👇:

```JS
// 调用 new File() 来转 base64 --> File
const dataURLtoFile = (dataurl, filename) => { 
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

const file = dataURLtoFile(base64Data, imgName)
```

```JS
// 将 base64 转为 blob
const dataURLtoBlob = dataurl => { 
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// 将 blob 转换为 File
const blobToFile = (theBlob, fileName) => {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}

const blob = dataURLtoBlob(base64Data)
const file = blobToFile(blob, imgName)
```

## 参考链接

1. [HTML5 File API — 让前端操作文件变的可能](http://www.cnblogs.com/zichi/p/html5-file-api.html) By 韩子迟
2. [通过 File API 使用 JavaScript 读取文件](https://www.html5rocks.com/zh/tutorials/file/dndfiles/) By Eric Bidelman
3. [MDN - Using files from web applications](https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications)

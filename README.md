## candyjs 模板引擎

此模板引擎基于 Handlebars 开发，旨在为 candyjs 提供强大的模板处理功能

## 使用

#### 安装

```
npm install @candyjs/template-hbs
```

#### 直接使用

使用模板引擎的方式很多，具体参考 candyjs 的文档，这里介绍其中一种：全局配置方式

```
// 入口文件 index.js
var CandyJs = require('candyjs');
var Candy = require('candyjs/Candy');
var App = require('candyjs/web/Application');

// 由于 candyjs 的模板采用别名路径
// 默认别名路径并不包含 node_modules 所以这里添加一下 方便引入模板引擎
Candy.setPathAlias('@template', __dirname + '/node_modules');

new CandyJs(new App({
    'id': 1,
    'debug': true,
    'appPath': __dirname + '/app',
    // 使用别名路径指定使用的模板引擎
    'defaultView': 'template/@candyjs/template-hbs/index'

})).listen(2333, function(){
    console.log('listen on 2333');
});


// app/controllers/index/IndexController.js
var CandyJs = require('candyjs');
var Controller = require('candyjs/web/Controller');

module.exports = class IndexController extends Controller {
    run(req, res) {
        // 渲染 index 模板
        this.render('index', {
            age: 20
        })
    }
}


// app/views/index/index.html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>view demo</title>
</head>
<body>
    {{ age }}
</body>
</html>
```

#### 布局文件的使用

大部分时候网站布局都有一部分保持不变的结构，比如头部导航，底部 footer ，这部分比较固定，可以利用布局文件将这部分逻辑进行抽离，避免重复布局

使用布局文件很简单，只需要编写一个布局文件并修改控制器部分即可

```
// app/controllers/index/IndexController.js
var CandyJs = require('candyjs');
var Controller = require('candyjs/web/Controller');

module.exports = class IndexController extends Controller {
    run(req, res) {
        this.getView().title = 'layout demo';
        this.getView().enableLayout = true;

        this.render('index', {
            age: 20
        });
    }
}


// app/views/layout.html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $this.title }}</title>
</head>
<body>
    <nav>layout page header</nav>

    <!-- 由于 contentHtml 包含 html 标签 所以使用三个大括号解析内容 -->
    {{{ contentHtml }}}

    <footer>layout page footer</footer>
</body>
</html>


// app/views/index/index.html
// 可见现在的模板文件已经没有了 html 文档结构
// 取而代之的是一个文档片段 这个片段将会替换布局文件的 contentHtml
<div>{{ age }}</div>
```

#### 布局文件补充

由上面代码可见，布局文件默认放到了 app/views 目录中，并起名 layout.html ，但这只是系统的默认配置，可以通过修改类的 layout 属性来改变布局文件的名称及位置

```
module.exports = class IndexController extends Controller {
    run(req, res) {
        this.getView().title = 'layout demo';
        this.getView().enableLayout = true;

        // 这里的 'app' 是一个系统别名
        // 表示将默认布局文件修改为 app/layout/default.html
        this.getView().layout = 'app/layout/default';

        this.render('index', {
            age: 20
        })
    }
}
```

#### 向 head 部分添加资源

有时候项目需要引入一个外部 javascript 文件，并且这个 javascript 文件需要在页面加载时先运行，模板引擎针对这种情况提供了向 html 的 head 部分追加内容的功能

下面在模板文件中调用 `addHeadAsset()` 函数，实现添加头部资源。布局文件中调用 `getHeadAssets()` 实现了输出资源到页面

```
// 模板片段文件注册了一个样式文件
{{ $this.addHeadAsset '<link href="outer.css">' }}

<div>other html content</div>
```

```
// 布局文件使用 getHeadAssets() 输出了所有注册的资源
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    {{{ $this.getHeadAssets }}}
</head>
<body>
    content
</body>
</html>
```

#### 处理输出

从 `candyjs 4.5.4`, `@candyjs/template-hbs 0.1.4` 开始支持返回模板处理结果，使用 `output` 参数控制是否直接输出或者返回模板渲染结果

```
module.exports = class IndexController extends Controller {
    run(req, res) {
        this.getView().title = 'layout demo';
        this.getView().enableLayout = true;

        // set output parameter
        this.getView().output = false;

        this.render('index', {
            age: 20
        }).then((data) => {
            // todo
            res.end(data);
        });
    }
}
```

## CHANGELOG

+ 2020-09-15

    * 0.1.5 优化布局文件参数 去除 title 和 description

+ 2020-09-15

    * 0.1.3 增加引入资源功能

+ 2020-08-10

    * 0.1.1 渲染模板添加 `$parameters` 参数

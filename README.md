### candyjs 模板引擎

此库是基于 Handlebars 的模板引擎，旨在方便 candyjs 进行模板渲染，目前该库功能比较简单，后期逐步增加功能

### 使用

使用前需要先安装本插件

```
npm install @candyjs/template-hbs
```

+ 直接使用

```
// 入口文件 index.js
var CandyJs = require('candyjs');
var Candy = require('candyjs/Candy');
var App = require('candyjs/web/Application');

// 由于 candyjs 的模板采用别名路径
// 默认别名路径并不包含 node_modules 所以这里添加一下 方便引入模板引擎
Candy.setPathAlias('@n_m', __dirname + '/node_modules');

new CandyJs(new App({
    'id': 1,
    'debug': true,
    'appPath': __dirname + '/app',
    // 指定使用的模板引擎
    'defaultView': 'n_m/@candyjs/template-hbs/index'

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

+ 基于布局文件使用

大部分时候我们的网站页面布局都很相似，比如头部导航，底部 footer ，这部分比较固定，所以我们可以利用布局文件将这部分逻辑抽离出来

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
    <title>{{ title }}</title>
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
// 取而代之的知识一个片段 这个片段将会替换布局文件的 contentHtml
<div>{{ age }}</div>
```

+ 须知

由上面代码可知，布局文件默认放到了 app/views 目录中，并起名 layout.html ，
这只是系统的默认配置，可以通过修改类的 layout 属性来改变布局文件的名称及位置

```
module.exports = class IndexController extends Controller {
    run(req, res) {
        this.getView().title = 'layout demo';
        this.getView().enableLayout = true;

        // 这里将默认布局文件修改为 app/layout/default.html
        // 路径支持绝对路径以及别名路径
        this.getView().layout = '@app/layout/default';

        this.render('index', {
            age: 20
        })
    }
}
```

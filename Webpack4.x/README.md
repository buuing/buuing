
# webpack4.x 入门


## 基础配置

> 打包出来的结果是一个自执行的匿名函数, 并且会传入一个对象作为参数; 其中这个对象的key就是当前模块的路径, 因为每个文件都是一个单独的模块, 对象的value就是对应模块的函数体字符串  
> 由于每个模块都会导出一些方法和变量, require方法会传入一个路径, 那我们就可以拿着这个路径当做key, 直接获取到对应的函数体字符串, 最后通过eval来执行字符串得到模块的返回值
 
1. 安装 webpack

```shell
npm i webpack@4.28.2 webpack-cli@3.1.2 -D
```

2. 新建`webpack.config.js`配置文件

```js
const path = require('path')

module.exports = {
  mode: 'development', // production
  entry: './src/index.js', // 入口文件
  output: {
    filename: 'index.js', // 导出的文件名
    path: path.resolve(__dirname, 'dist') // path 必须是一个绝对路径
  }
}
```

3. 配置`script`脚本

```json
"scripts": {
  "build": "webpack --mode=production"
},
```

## 搭建项目服务

1. 安装插件

```shell
npm i webpack-dev-server@3.1.14 -D
npm i html-webpack-plugin@3.2 -D
```

2. 在`webpack.config.js`里增加配置

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  devServer: { // 开发服务器的配置
    open: true, // 自动打开
    port: 8138, // 端口号
    progress: true, // 进度条
    contentBase: './dist', // 静态服务目录
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板的路径
      filename: 'index.html', // 打包后的文件名
      hash: true, // 给引入的文件增加哈希值
      minify: {
        removeAttributeQuotes: true, // 删除标签中的双引号
        collapseWhitespace: true, // 把代码折叠为一行
      }
    })
  ],
  ...
}
```

3. 配置`script`脚本

```json
"scripts": {
  ...
  "dev": "webpack-dev-server",
  ...
},
```

## 解析样式文件

1. 安装 loader 和插件

```shell
# 解析css文件
npm i style-loader@0.23.1 css-loader@2.1.0 -D
# 解析less文件
npm i less@4.1.1 less-loader@4.1.0 -D
# 抽离样式文件
npm i mini-css-extract-plugin@0.5.0 -D
# 增加样式前缀
npm i postcss-loader@3.0.0 autoprefixer@9.4.3 -D
# 压缩 CSS 和 JS 文件
npm i optimize-css-assets-webpack-plugin@5.0.1 uglifyjs-webpack-plugin@2.1.0 -D
```

2. 在`webpack.config.js`里增加配置

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  ...
  plugins: [ // 插件, 没有执行顺序可以随意书写
    ...
    new MiniCssExtractPlugin({
      filename: 'index.[hash:8].css',
    }),
  ],
  module: { // 模块
    rules: [ // 规则
      {
        test: /\.css$/, // 匹配以.css结尾的文件
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.less$/, // 匹配以.less结尾的文件
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ]
      },
    ]
  },
  optimization: { // 优化项
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCssAssetsPlugin(),
    ],
  },
}
```

3. 增加`postcss.config.js`文件

```js
module.exports = {
  plugins: [
    require('autoprefixer')({
      "browsers": [
        "defaults",
        "not ie < 11",
        "last 2 versions",
        "> 1%",
        "iOS 7",
        "last 3 iOS versions"
      ]
    })
  ]
}
```

## ES6转Es5

1. 安装插件

```shell
# es6转es5
npm i babel-loader@8.0.4 @babel/core@7.2.2 @babel/preset-env@7.2.3 -D
# es6的class类
npm i @babel/plugin-proposal-class-properties@7.2.3 -D
```

2. 在`webpack.config.js`里增加配置

```js
module.exports = {
  ...
  module: { // 模块
    rules: [ // 规则
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          }
        }
      },
      ...
    ]
  }
  ...
}
```
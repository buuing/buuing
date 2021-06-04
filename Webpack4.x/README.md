
# webpack4.x 入门


## 基础配置

> 打包出来的结果是一个自执行的匿名函数, 并且会传入一个对象作为参数; 其中这个对象的key就是当前模块的路径, 因为每个文件都是一个单独的模块, 对象的value就是对应模块的函数体字符串  
> 由于每个模块都会导出一些方法和变量, require方法会传入一个路径, 那我们就可以拿着这个路径当做key, 直接获取到对应的函数体字符串, 最后通过eval来执行字符串得到模块的返回值
 
1. 安装webpack

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
  "dev": "webpack",
  "build": "webpack --mode=production"
},
```

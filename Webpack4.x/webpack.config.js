
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // production
  entry: './src/index.js', // 入口文件
  output: {
    filename: 'index.[hash:8].js', // 导出的文件名
    path: path.resolve(__dirname, 'dist') // path 必须是一个绝对路径
  },
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
}

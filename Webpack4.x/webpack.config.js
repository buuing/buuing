
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
  plugins: [ // 插件, 没有执行顺序可以随意书写
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板的路径
      filename: 'index.html', // 打包后的文件名
      hash: true, // 给引入的文件增加哈希值
      minify: {
        removeAttributeQuotes: true, // 删除标签中的双引号
        collapseWhitespace: true, // 把代码折叠为一行
      }
    }),
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

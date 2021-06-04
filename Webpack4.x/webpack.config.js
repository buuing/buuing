
const path = require('path')

module.exports = {
    mode: 'development', // production
    entry: './src/index.js', // 入口文件
    output: {
        filename: 'index.js', // 导出的文件名
        path: path.resolve(__dirname, 'dist') // path 必须是一个绝对路径
    }
}

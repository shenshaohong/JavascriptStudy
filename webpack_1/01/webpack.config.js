const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src/login/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './login/index.js',
    clean: true //生成打包文件之前，先清除生成目录中的文件
  },
  // 配置插件自动生成html文件插件html- webpack - plugin
  // 要生成多少个html文件就new多少个HtmlWebpackPlugin()
  plugins: [new HtmlWebpackPlugin({
    // 模版来源
    template: path.resolve(__dirname, './public/login.html'),
    // 生成文件路径
    filename: path.resolve(__dirname, 'dist/login/index.html')
  })],
}
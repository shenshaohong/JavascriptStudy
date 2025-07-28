const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 这个插件使用 cssnano 优化和压缩 CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { type } = require('os')
const { Generator } = require('webpack')

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
  }),
  // 生成独立css文件
  new MiniCssExtractPlugin(),
  // 优化和压缩 CSS
  new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      // 让webpack识别css文件 进行加载打包
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // use: ['style-loader', 'css-loader']//不能与MiniCssExtractPlugin.loader混用
      },
      // webpack 将 Less 编译为 CSS 的 loader
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext][query]'
        },
      },
    ],
  },
  // 优化和压缩 CSS
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },

}
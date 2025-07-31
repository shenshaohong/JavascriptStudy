const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 这个插件使用 cssnano 优化和压缩 CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// 压缩js
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const config = {
  // 开发模式（development）：不压缩，保留源码格式，调试友好，快速构建。
  // 生产模式（production）：自动启用压缩（使用 TerserWebpackPlugin）。
  // mode: 'development',
  entry: {
    'login': path.join(__dirname, 'src/login/index.js'),
    'content': path.join(__dirname, 'src/content/index.js'),
    'publish': path.join(__dirname, 'src/publish/index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './[name]/index.js',
    clean: true //生成打包文件之前，先清除生成目录中的文件
  },

  // 配置插件自动生成html文件插件html- webpack - plugin
  // 要生成多少个html文件就new多少个HtmlWebpackPlugin()
  plugins: [new HtmlWebpackPlugin({
    // 模版来源
    template: path.resolve(__dirname, './src/login/login.html'),
    // 生成文件路径
    filename: path.resolve(__dirname, 'dist/login/index.html'),
    // 当此时属于生产环境，useCdn为真，与html代码中cdn中相应，在线加载相关模块
    useCdn: process.env.NODE_ENV === 'production',
    chunks: ['login']
  }),
  new HtmlWebpackPlugin({
    // 模版来源
    template: path.resolve(__dirname, './src/content/content.html'),
    // 生成文件路径
    filename: path.resolve(__dirname, 'dist/content/index.html'),
    // 当此时属于生产环境，useCdn为真，与html代码中cdn中相应，在线加载相关模块
    useCdn: process.env.NODE_ENV === 'production',
    chunks: ['content']
  }),
  new HtmlWebpackPlugin({
    // 模版来源
    template: path.resolve(__dirname, './src/publish/publish.html'),
    // 生成文件路径
    filename: path.resolve(__dirname, 'dist/publish/index.html'),
    // 当此时属于生产环境，useCdn为真，与html代码中cdn中相应，在线加载相关模块
    useCdn: process.env.NODE_ENV === 'production',
    chunks: ['publish']
  }),

  // 生成独立css文件
  new MiniCssExtractPlugin(),
  // 优化和压缩 CSS
  new CssMinimizerPlugin(),
  // 压缩js
  new TerserPlugin(),
  // 导出环境变量
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
  ],
  module: {
    rules: [
      // 让webpack识别css文件 进行加载打包
      {
        test: /\.css$/i,
        use: [process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        // use: ['style-loader', 'css-loader']//不能与MiniCssExtractPlugin.loader混用
      },
      // webpack 将 Less 编译为 CSS 的 loader
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      // 图片
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext][query]'
        },
      },
      // 富文本编辑器
      /*  {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         type: 'asset/resource',
         generator: {
           filename: 'fonts/[hash][ext][query]'
         }
       } */
    ],
  },
  // 优化和压缩 CSS
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserPlugin()
    ],
    minimize: true,

    // 配置 webpack.config.js 的 splitChunks 分割功能
    splitChunks: {
      chunks: 'all', // 所有模块动态非动态移入的都分割分析
      cacheGroups: { // 分隔组
        commons: { // 抽取公共模块
          minSize: 0, // 抽取的chunk最小大小字节
          minChunks: 2, // 最小引用数
          reuseExistingChunk: true, // 当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用
          name(module, chunks, cacheGroupKey) { // 分离出模块文件名
            const allChunksNames = chunks.map((item) => item.name).join('~') // 模块名1~模块名2
            return `./js/${allChunksNames}` // 输出到 dist 目录下位置
          }
        }
      }
    }

  },
  // 解析
  resolve: {
    alias: {
      // 别名
      '@': path.resolve(__dirname, 'src')
    }
  },



}
// 如处于开发模式下，则开始调试错误模式，可查看代码出错点
if (process.env.NODE_ENV === 'development') {
  config.devtool = 'inline-source-map'
}
// 如处于生产模式下，则不打包本地的第三方模块
if (process.env.NODE_ENV === 'production') {
  config.externals = {
    'axios': 'axios',
    'bootstrap/dist/css/bootstrap.min.css': 'bootstrap',
    '@wangeditor/editor': 'wangEditor',
    'form-serialize': 'serialize',
  }

}


module.exports = config
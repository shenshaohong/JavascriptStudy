const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/login/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './login/index.js',
    clean: true //生成打包文件之前，先清除生成目录中的文件
  }
}
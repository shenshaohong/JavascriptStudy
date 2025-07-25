const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/login/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './login/index.js'
  }
}
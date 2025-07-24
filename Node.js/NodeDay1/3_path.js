// 加载模块对象
const fs = require('fs')
// 写入文件内容

// 加载path
const path = require('path')
// 调用path.join()配合__dirname组成绝对路径

// 读取文件内容
fs.readFile(path.join(__dirname, './test.txt'), (error, data) => {
  if (error) console.log(error)
  else {
    console.log(data)
    // 转化为字符串
    console.log(data.toString())
  }
  console.log(__dirname)
})

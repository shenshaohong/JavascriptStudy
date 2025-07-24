// 加载模块对象
const fs = require('fs')
// 写入文件内容
fs.writeFile('./test.txt', 'hello', (error) => {
  if (error) console.log(error)
  else console.log('yes')
})
// 读取文件内容
fs.readFile('./test.txt', (error, data) => {
  if (error) console.log(error)
  else {
    console.log(data)
    // 转化为字符串
    console.log(data.toString())
  }

})
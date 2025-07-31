
//css引入加载并js中
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.less'

// 加载图片
// 相对路径导入
// import backgroundObj from './assets/background_2.png'
//绝对路径导入-别名使用

import backgroundObj from '@/login/assets/background_2.png'
import logoObj from './assets/logo.png'

import { checkPhone, checkCode } from '@/utils/check.js'
import myAxios from '@/utils/request.js'
import { myAlert } from '@/utils/alert.js'

//生产模式下，打印失效
console.log(process.env.NODE_ENV === 'production');

if (process.env.NODE_ENV === 'production') {
  console.log = function () { }
}
console.log('开发中，生产模式下，打印失效')

const logo = document.querySelector('.logo')
logo.src = logoObj

const backgroundImg = document.querySelector('.login-wrap')
backgroundImg.style.background = `url(${backgroundObj}) no-repeat top/cover`


document.querySelector('.btn').addEventListener('click', () => {
  const Phone = document.querySelector('[name=mobile]').value
  const Code = document.querySelector('[name=code]').value
  if (!checkPhone(Phone)) {
    // console.log('请输入11位手机号')
    myAlert(false, '请输入11位手机号')
    return
  }
  if (!checkCode(Code)) {
    // console.log('请输入6位验证码')
    myAlert(false, '请输入6位验证码')
    return
  }
  myAlert(true, '登录中...')
  // console.log('登录中...')
  myAxios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile: Phone,
      code: Code
    }
  }).then(result => {
    myAlert(true, '登录成功')
    localStorage.setItem('token', result.data.token)
    console.log(result.data.token)
    setTimeout(() => {
      location.href = '../content/index.html'
    }, 2500)
  }).catch(err => {
    myAlert(false, err.response.data.message)
    console.log(err.response.data.message)
  })
})

// console.log('更新22')
// console.log('@')




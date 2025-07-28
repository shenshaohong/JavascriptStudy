/* import { checkPhone, checkCode } from '../utils/check.js'

document.querySelector('.btn').addEventListener('click', () => {
  const Phone = document.querySelector('[name=mobile]').value
  const Code = document.querySelector('[name=code]').value
  if (!checkPhone(Phone)) {
    console.log('请输入11位手机号')
    return
  }
  if (!checkCode(Code)) {
    console.log('请输入6位验证码')
    return
  }
  console.log('登录中...')
}) */


//css引入加载并js中
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.less'

// 加载图片
import backgroundObj from './assets/background.png'
import logoObj from './assets/logo.png'

const logo = document.querySelector('.logo')
logo.src = logoObj

const backgroundImg = document.querySelector('.login-wrap')
backgroundImg.style.background = `url(${backgroundObj}) no-repeat top/cover`


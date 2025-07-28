import { checkPhone, checkCode } from '../utils/check.js'

//css引入加载并js中
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.less'

// 加载图片
import backgroundObj from './assets/background.png'
import logoObj from './assets/logo.png'

import myAxios from '../utils/request.js'
import { myAlert } from '../utils/alert.js'

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
    // location.href = ''
  }).catch(err => {
    myAlert(false, err.response.data.message)
  })
})


// 权限插件（引入到了除登录页面，以外的其他所有页面）
/**
 * 目标1：访问权限控制
 * 1.1 判断无 token 令牌字符串，则强制跳转到登录页
 * 1.2 登录成功后，保存 token 令牌字符串到本地，并跳转到内容列表页面
 */
const token = localStorage.getItem('token')
if (!token) {
  myAlert(false, '请登录')
  setTimeout(() => {
    location.href = '../login/index.html'
  }, 2500)
}

/**
 * 目标2：设置个人信息
 * 2.1 在 utils/request.js 设置请求拦截器，统一携带 token
 * 2.2 请求个人信息并设置到页面
 */
axios({
  url: '/v1_0/user/profile'
}).then(result => {
  // console.log('用户设置')
  // console.log(result)
  const username = result.data.data.name
  document.querySelector('.nick-name').innerHTML = username
})

/**
 * 目标3：退出登录
 *  3.1 绑定点击事件
 *  3.2 清空本地缓存，跳转到登录页面
 */
document.querySelector('.quit').addEventListener('click', () => {
  localStorage.clear()
  setTimeout(() => {
    location.href = '../login/index.html'
  }, 1500)
  myAlert(true, '退出成功')
})

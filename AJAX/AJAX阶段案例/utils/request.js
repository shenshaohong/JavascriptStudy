// axios 公共配置
// 基地址
axios.defaults.baseURL = 'https://geek.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前之前做些什么
  // 统一携带 token 令牌字符串在请求头上
  const token = localStorage.getItem('token')
  token && (config.headers.Authorization = `Bearer ${token}`)
  // console.log(config)
  // Bearer后面少一个空格是不可以的
  return config;
}, function (error) {
  // 对请求错误做什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  console.dir(error.response.data.message)
  if (error?.response?.status === 401) {
    // 前面有值才会访问此对象
    alert('身份验证失败，请重新登录')
    localStorage.clear()
    location.href = '../login/index.html'
  }
  return Promise.reject(error)
});
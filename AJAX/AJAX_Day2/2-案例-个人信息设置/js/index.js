/* 小功能：toast小提示框的使用
 */
const toastDom = document.querySelector('.my-toast')
const toast = new bootstrap.Toast(toastDom)
// const alertToast = document.querySelector('.info-box')
// alertToast.classList.remove('alert-success')
// alertToast.classList.add('alert-danger')
// alertToast.innerHTML = `请求失败`

/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */
function showInfor() {
  axios({
    url: 'http://hmajax.itheima.net/api/settings',
    params: {
      creator: '老李',
    }
  }).then(result => {
    // 获取到的用户信息对象
    const inforObj = result.data.data
    // console.log(inforObj);
    // 获取对象属性列表
    const inforKeys = Object.keys(inforObj)
    inforKeys.forEach(key => {
      if (key === 'avatar') {
        document.querySelector('.prew').src = inforObj[key]
      } else if (key === 'gender') {
        // 这里得到两个伪数组元素，0是男，1是女
        const genderList = document.querySelectorAll('.gender')
        // console.log((genderLlist));
        // 这里也要注意一定要强制转换为数字类型！！
        const iKey = +inforObj[key]
        // 检查 genderList 和 iKey 是否有效
        if (genderList.length > 0 && (iKey === 0 || iKey === 1)) {
          genderList[iKey].checked = true
        } else {
          console.error('无效的 gender 数据或 DOM 未找到:', iKey, genderList);
        }

      } else {
        document.querySelector(`.${key}`).value = inforObj[key]
      }
    })

  }).catch(error => {
    console.error('请求失败:', error);

  })
}
showInfor()

/* 
目标2：头像修改
2.1 选择图片上传
2.2 提交、回显
 */

document.querySelector('.upload').addEventListener('change', (e) => {

  // 获取到文件文件
  // console.log(e.target.files[0]);
  const fd = new FormData()
  fd.append('avatar', e.target.files[0])
  fd.append('creator', '老李')

  // 2.2 提交、回显
  axios({
    url: 'http://hmajax.itheima.net/api/avatar',
    method: 'PUT',
    data: fd
  }).then(result => {
    // console.log(result.data.data.avatar);
    document.querySelector('.prew').src = result.data.data.avatar
    // showInfor()
  })
})

/* 
目标3：信息修改
3.1 修改信息、收集
3.2 提交、回显
 */
document.querySelector('.submit').addEventListener('click', () => {

  // 先来一个收集函数
  const inforForm = document.querySelector('.user-form')
  const inforFormObj = serialize(inforForm, { hash: true, empty: true })
  // 需要把字符串类型的性别数据转换成数字
  inforFormObj.gender = Number(inforFormObj.gender)
  inforFormObj.creator = '老李'
  console.log(inforFormObj);

  axios({
    url: 'http://hmajax.itheima.net/api/settings',
    method: 'PUT',
    data: inforFormObj
    // 之前是body: { ...inforFormObj }
  }).then(result => {
    showInfor()
    toast.show()
  })
  // 以后把变量命名区分开来一些吧 分不清
})

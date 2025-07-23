/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
function setChannelList() {
  axios({
    url: '/v1_0/channels',
  }).then(result => {
    // console.log(result)
    const htmlStr = '<option value="">请选择文章频道</option>' +
      result.data.data.channels.map(item => {
        return `<option value="${item.id}">${item.name}</option>`
      }).join('')
    document.querySelector('.form-select').innerHTML = htmlStr
  })
}
setChannelList()

/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
document.querySelector('.img-file').addEventListener('change', e => {
  const file = e.target.files[0]
  const fd = new FormData()
  fd.append('image', file)
  axios({
    url: '/v1_0/upload',
    method: 'POST',
    data: fd
  }).then(result => {
    // console.log(result);
    // 设置封面
    const image = result.data.data.url
    document.querySelector('.rounded').src = image
    // 显示封面
    document.querySelector('.rounded').classList.add('show')
    // 隐藏加号
    document.querySelector('.place').classList.add('hide')

    // 其实这里还有一个点可以优化，也就是选择图片失败的情况需要处理
  }).catch(error => {
    alert(error.response.data.message)
  })
})
// 但是如果要重选怎么办？ 优化如下：
document.querySelector('.rounded').addEventListener('click', () => {
  console.log(1);
  document.querySelector('.img-file').click()
})

/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
document.querySelector('.send').addEventListener('click', async (e) => {
  // 判断是发布还是修改
  if (e.target.innerHTML !== '发布') return
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })
  const type = document.querySelector('.rounded').src ? 1 : 0
  const image = document.querySelector('.rounded').src
  data.cover = {
    type,
    images: [image]
  }
  console.log(data);
  // 一定要把提示框放到try里边，才能在成功时出提示框
  try {
    const res = await axios({
      url: '/v1_0/mp/articles',
      method: 'POST',
      data
    })
    // 调用 Alert 警告、框反馈结果给用户
    myAlert(true, '发布成功')
    console.log(res)
    // 重置表单
    form.reset()
    // 重置图片
    document.querySelector('.rounded').src = ''
    document.querySelector('.rounded').classList.remove('show')
    document.querySelector('.place').classList.remove('hide')
    // 重置富文本编辑器
    editor.setHtml('')

    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  } catch (error) {
    console.dir(error)
    myAlert(false, error.response.data.message)
  }

})

  /**
   * 目标4：编辑-回显文章
   *  4.1 页面跳转传参（URL 查询参数方式）
   *  4.2 发布文章页面接收参数判断（共用同一套表单）
   *  4.3 修改标题和按钮文字
   *  4.4 获取文章详情数据并回显表单
   */
  // 立即执行函数防止变量污染
  ; (function () {
    // console.log(location.search)
    if (location.search) {
      const paramsStr = location.search
      const params = new URLSearchParams(paramsStr)
      console.log(params)
      params.forEach(async (value, key) => {
        if (key === 'id') {
          // console.log(value)
          const res = await axios({
            url: `/v1_0/mp/articles/${value}`,
          })
          console.log(res)
          document.querySelector('.title').innerHTML = '修改文章'
          document.querySelector('.send').innerHTML = '修改'
          // 多处修改，把属性存成对象
          const dataObj = {
            channel_id: res.data.data.channel_id,
            title: res.data.data.title,
            rounded: res.data.data.cover.images[0],
            content: res.data.data.content,
            id: res.data.data.id
          }
          Object.keys(dataObj).forEach(key => {
            if (key === 'rounded') {
              document.querySelector('.rounded').src = dataObj[key]
              document.querySelector('.place').classList.add('hide')
              document.querySelector('.rounded').classList.add('show')
            } else if (key === 'content') {
              editor.setHtml(dataObj[key])
              document.querySelector('.publish-content').value = dataObj[key]
            } else {
              document.querySelector(`[name=${key}]`).value = dataObj[key]
            }
          })
        }
      })
    }

  })();


/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
document.querySelector('.send').addEventListener('click', async e => {
  if (e.target.innerHTML !== '修改') return
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })
  const type = document.querySelector('.rounded').src ? 1 : 0
  const image = document.querySelector('.rounded').src
  data.cover = {
    type,
    images: [image]
  }
  console.log(data)
  // 一定要把提示框放到try里边，才能在成功时出提示框
  try {
    const res = await axios({
      url: `/v1_0/mp/articles/${data.id}`,
      method: 'PUT',
      data
    })
    // 调用 Alert 警告、框反馈结果给用户
    myAlert(true, '修改成功')
    console.log(res)
    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  } catch (error) {
    console.dir(error)
    myAlert(false, error.response.data.message)
  }

})
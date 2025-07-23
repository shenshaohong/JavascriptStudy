/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
// 建立查询参数对象
const queryObj = {
  status: '', //文章状态: 1 - 待审核, 2-审核通过，不传为全部
  channel_id: '',//频道id，不传为全部
  page: 1,//当前页码
  per_page: 2//每页条数
}
// 保存文章条数
let totalCount = 0
// 封装查询显示函数
async function setArtitleList() {
  // 获取文章列表
  const res = await axios({
    url: '/v1_0/mp/articles',
    params: queryObj
  })
  // console.log(res.data.data.results)
  const htmlStr = res.data.data.results.map(item => {
    /*     注意：
        1.需要处理没有封面的情况，保留默认封面
        2.对审核状态处理 */
    return `<tr>
            <td>
              <img src="${item.cover.type === 0 ?
        'https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500'
        : item.cover.images[0]}" alt="">
            </td>
            <td>${item.title}</td>
            <td>
            ${item.status === 1 ? '<span class="badge text-bg-success">审核通过</span>' :
        '<span class="badge text-bg-primary">待审核</span>'}
            </td>
            <td>
              <span>${item.pubdate}</span>
            </td>
            <td>
              <span>${item.read_count}</span>
            </td>
            <td>
              <span>${item.comment_count}</span>
            </td>
            <td>
              <span>${item.like_count}</span>
            </td>
            <td  data-id="${item.id}">
              <i class="bi bi-pencil-square edit"></i>
              <i class="bi bi-trash3 del"></i>
            </td>
          </tr>`
  }).join('')
  document.querySelector('.art-list').innerHTML = htmlStr

  // * 3.1 保存并设置文章总条数
  totalCount = res.data.data.total_count
  document.querySelector('.total-count').innerHTML = `共 ${totalCount} 条`
  document.querySelector('.page-now').innerHTML = `第${queryObj.page}页`
}
setArtitleList()

/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
// 2.1 设置频道列表数据
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
// 2.2 监听筛选条件改变，保存查询信息到查询参数对象
// 单选框按钮状态的改变
document.querySelectorAll('.form-check').forEach(radio => {
  radio.addEventListener('change', e => {
    // console.log(e.target.value)
    queryObj.status = e.target.value
  })
})
document.querySelector('.form-select').addEventListener('change', e => {
  console.log(e.target.value)
  queryObj.channel_id = e.target.value
})
// 点击筛选按钮重新对内容进行筛选
document.querySelector('.sel-btn').addEventListener('click', () => {
  // 数据已重新赋值，调用渲染函数即可
  setArtitleList()
})
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
// 3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
document.querySelector('.next').addEventListener('click', () => {
  if (queryObj.page < Math.ceil(totalCount / queryObj.per_page)) {
    queryObj.page++
    setArtitleList()
  }
})
// 3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
document.querySelector('.last').addEventListener('click', () => {
  if (queryObj.page > 1) {
    queryObj.page--
    setArtitleList()
  }
})

/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
document.querySelector('.art-list').addEventListener('click', async e => {
  // 判断点击的是删除元素
  if (e.target.classList.contains('del')) {
    // console.log(1);
    // 拿到文章的id
    console.log(e.target.parentNode.dataset.id);
    const delID = e.target.parentNode.dataset.id
    try {
      const res = await axios({
        url: `/v1_0/mp/articles/${delID}`,
        method: 'DELETE'
      })
      console.log(res)
      myAlert(true, '删除成功')
      // * 4.5 删除最后一页的最后一条，需要自动向前翻页
      // 注意，不能让totalCount参与判断，因为每次渲染之后才能得到最新的总条数
      // 所以需要判断删除的这一个DOM是不是这次渲染的唯一一个
      const children = document.querySelector('.art-list').children
      if (children.length === 1 && queryObj.page !== 1) {
        queryObj.page--
      }
      setArtitleList()

    } catch (error) {
      console.dir(error)
      myAlert(false, error.response.data.message)
    }

  }
})
// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
// 页面跳转传参（URL传参）
// 找到编辑按钮
document.querySelector('.art-list').addEventListener('click', e => {
  // console.log(e.target.classList.contains('edit'));
  if (e.target.classList.contains('edit')) {
    // 找到文章id
    // console.log(e.target.parentNode.dataset.id);
    const artId = e.target.parentNode.dataset.id
    location.href = `../publish/index.html?id=${artId}`
  }
})

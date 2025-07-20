/**
 * 目标1：完成省市区下拉列表切换
 *  1.1 设置省份下拉菜单数据
 *  1.2 切换省份，设置城市下拉菜单数据，清空地区下拉菜单
 *  1.3 切换城市，设置地区下拉菜单数据
 */
//  * 1.1 设置省份下拉菜单数据
axios({
  url: 'http://hmajax.itheima.net/api/province'
}).then(result => {
  const pHtmlStr = result.data.list.map(pname => {
    return `<option value="${pname}">${pname}</option>`
  }).join('')
  document.querySelector('.province').innerHTML = '<option value="">省份</option>' + pHtmlStr
})

/* 这是之前的写法，现在学会了async和await 可以使用一下
const province = document.querySelector('.province')
province.addEventListener('change', function () {
  // console.log(this);
  if (!this.value) return
  axios({
    url: 'http://hmajax.itheima.net/api/city',
    params: {
      pname: this.value
    }
  }).then(result => {
    // console.log(result.data.list);
    cHtmlStr = result.data.list.map(cname => {
      return `<option value="${cname}">${cname}</option>`
    }).join('')
    document.querySelector('.city').innerHTML = '<option value="">城市</option>' + cHtmlStr
    document.querySelector('.area').innerHTML = '<option value="">地区</option>'
  })
})

document.querySelector('.city').addEventListener('change', function () {
  // console.log(this);
  if (!this.value) return
  axios({
    url: 'http://hmajax.itheima.net/api/area',
    params: {
      pname: province.value,
      cname: this.value
    }
  }).then(result => {
    // console.log(result.data.list);
    aHtmlStr = result.data.list.map(aname => {
      return `<option value="${aname}">${aname}</option>`
    }).join('')
    document.querySelector('.area').innerHTML = '<option value="">地区</option>' + aHtmlStr
  })
}) */
// 1.2获取下拉城市列表
const province = document.querySelector('.province')
province.addEventListener('change', async e => {
  // console.log(e.target.value);
  if (!e.target.value) return

  const result = await axios({
    url: 'http://hmajax.itheima.net/api/city',
    params: {
      pname: e.target.value
    }
  })
  // console.log(result);
  cHtmlStr = result.data.list.map(cname => {
    return `<option value="${cname}">${cname}</option>`
  }).join('')
  document.querySelector('.city').innerHTML = '<option value="">城市</option>' + cHtmlStr

  //  切换省份，设置城市下拉菜单数据，清空地区下拉菜单
  document.querySelector('.area').innerHTML = '<option value="">地区</option>'
})

// 1.3获取下拉区域列表
document.querySelector('.city').addEventListener('change', async e => {
  // console.log(this);
  if (!e.target.value) return
  const result = await axios({
    url: 'http://hmajax.itheima.net/api/area',
    params: {
      pname: province.value,
      cname: e.target.value
    }
  })
  // console.log(result);
  aHtmlStr = result.data.list.map(aname => {
    return `<option value="${aname}">${aname}</option>`
  }).join('')
  document.querySelector('.area').innerHTML = '<option value="">地区</option>' + aHtmlStr
})

// 目标2:收集表单数据
document.querySelector('.submit').addEventListener('click', async e => {
  const formDom = document.querySelector('.info-form')
  const formObj = serialize(formDom, { hash: true, empty: true })
  // console.log(formObj)
  try {
    const result = await axios({
      url: 'http://hmajax.itheima.net/api/feedback',
      method: 'POST',
      data: formObj
    })

  } catch (error) {
    // console.dir(error.response.data.message)
    alert(error.response.data.message)
  }
})


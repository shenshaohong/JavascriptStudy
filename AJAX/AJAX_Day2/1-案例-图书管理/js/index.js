/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */

// 定义一个全局变量，易于改变用户姓名
const creator = '老张'

// 封装-获取并渲染图书列表函数
function getBookList() {

  //获取数据，黑马接口文档中获取url链接
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    params: {
      //告诉服务器我是谁
      creator
    }
  }).then(result => {
    // console.log(result)
    const bookList = result.data.data
    // console.log(bookList)
    const htmlStr = bookList.map((item, index) => {
      return `<tr>
          <td>${(+index) + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td data-id="${item.id}">
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td> 
        </tr>`
    }).join('')
    // console.log(htmlStr)
    document.querySelector('.list').innerHTML = htmlStr

  })
}
// 网页加载运行，获取并渲染一次
getBookList()

/* 
  * 目标2：新增图书
  * 2.1 新增弹框-> 显示和隐藏
  * 2.2 收集表单数据,并提交到服务器保存
  * 2.3 刷新图书列表 */

//2.1创建弹框对象
const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)
//保存按钮->点击->隐藏弹框
document.querySelector('.add-btn').addEventListener('click', () => {

  //快速收集数据
  const addForm = document.querySelector('.add-form')
  const addData = serialize(addForm, { hash: true, empty: true })
  // console.log(addData)
  // console.log(addData.bookname)
  // 上传数据
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    method: 'post',
    /* 
     *api中要求是这个格式，少一个参数都是不可以的，可以留空，但不能少
      {
        "bookname": "xxx",
        "author": "xxx",
        "publisher": "xxx",
        "creator": "老张"
      }   
    */
    data: {
      ...addData, creator
    },
  }).then(result => {
    // console.log(result.data.message)
    // 重新渲染图书列表
    getBookList()
    // 表单重置
    addForm.reset()
    // 隐藏弹框
    addModal.hide()
  })

})

/*
目标3:删除图书
3.1 删除元素绑定点击事件->获取图书id
3.2 调用删除接口
3.3 刷新图书列表

 */

//3.1 删除元素->点击(事件委托)
const tbodyList = document.querySelector('.list')
tbodyList.addEventListener('click', (e) => {
  // console.log(e);
  // console.log(e.target);
  // console.log(e.target.nodeName);
  // console.log(e.target.parentNode);
  // console.log(e.target.parentNode.dataset.id)
  if (e.target.classList.contains('del')) {
    const delId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${delId}`,
      method: 'DELETE',
    }).then(result => {
      console.log(result.data.message)
      // 重新渲染数据
      getBookList()
    })
    // 这里删除没有弹框显示，直接删除

  }

})

/* 目标4：编辑图书
4.1 编辑弹框->显示和隐藏
4.2 获取当前编辑图书数据->回显到编辑表单中
4.3 提交保存修改，并刷新列表
 */

// 编辑弹框 -> 显示和隐藏
// 先找到编辑弹框
const editModalDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editModalDom)
// 点击编辑时 弹出编辑弹框
tbodyList.addEventListener('click', (e) => {
  // console.log(e.target.classList.contains('edit'));
  if (e.target.classList.contains('edit')) {

    // 显示弹框
    editModal.show()
    const editId = e.target.parentNode.dataset.id
    // 获取数据
    axios({
      url: `http://hmajax.itheima.net/api/books/${editId}`,
      params: {
        id: editId,
      }
    }).then(result => {
      // console.log(result.data.data)
      const bookObj = result.data.data
      // 获取图书详情对象的属性名
      const keys = Object.keys(bookObj)
      // console.log(keys)
      // 利用属性名循环写value值
      keys.forEach(key => {
        document.querySelector(`.edit-form .${key}`).value = bookObj[key]
      })

    })
  }
})

document.querySelector('.edit-btn').addEventListener('click', () => {
  // 上传数据
  const editForm = document.querySelector('.edit-form')
  const bookObj = serialize(editForm, { hash: true, empty: true })
  // < input type = "hidden" class="id" name = "id" value = "695983" >
  // 隐藏起此项input，因为收集数据时必须收集id，但用户不可编辑
  // console.log(bookObj)
  axios({
    url: `http://hmajax.itheima.net/api/books/${bookObj.id}`,
    method: 'PUT',
    params: {
      id: bookObj.id,
    },
    data: {
      ...bookObj,
      creator
    }
  }).then(result => {
    console.log(result.data.message)
    // 重新渲染数据
    // 弹框隐藏
    editModal.hide()
    getBookList()
  })
})


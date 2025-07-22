// 富文本编辑器
// 创建编辑器函数，创建工具栏函数
const { createEditor, createToolbar } = window.wangEditor

const editorConfig = {
  // 占位提示文字
  placeholder: 'Type here...',
  // 编辑器内容、选区变化时的回调函数
  onChange(editor) {
    const html = editor.getHtml()
    // console.log('editor content', html)
    // 也可以同步到 <textarea>
    // 为了后续快速收集整个表单内容做铺垫
    document.querySelector('.publish-content').value = html
  },
}

const editor = createEditor({
  selector: '#editor-container',
  // 编辑器的默认内容
  html: '<p><br></p>',
  config: editorConfig,
  // 配置集成模式
  mode: 'default', // or 'simple'
})

// 工具栏配置
const toolbarConfig = {}

const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})

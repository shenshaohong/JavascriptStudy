// 弹窗插件
// 需要先准备 alert 样式相关的 DOM
/**
 * BS 的 Alert 警告框函数，2秒后自动消失
 * @param {*} isSuccess 成功 true，失败 false
 * @param {*} msg 提示消息
 */
function myAlert(isSuccess, msg) {
  const myAlert = document.querySelector('.alert');

  // 重置状态并强制重绘
  myAlert.classList.remove('show', 'alert-success', 'alert-danger');
  void myAlert.offsetWidth;

  // 设置新内容
  myAlert.innerHTML = msg;
  myAlert.classList.add(isSuccess ? 'alert-success' : 'alert-danger');

  // 触发显示动画
  myAlert.classList.add('show');

  // 2秒后触发隐藏动画
  setTimeout(() => {
    myAlert.classList.remove('show');

    // 动画完成后清理
    myAlert.addEventListener('transitionend', () => {
      myAlert.classList.remove('alert-success', 'alert-danger');
      myAlert.innerHTML = '';
    }, { once: true });//{ once: true } 用完就释放
  }, 2000);
}
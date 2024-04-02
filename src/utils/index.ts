import { ElMessage, ElNotification } from 'element-plus'

/**
 * send 字符串转字节数据在转buffer
 * str:字符串
 */
export function strHexBuffer(str: string) {
  const bytes = []
  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.substr(i, 2), 16))
  }
  return Buffer.from(bytes)
}

/**
 * 高位填零
 * @param str 传入字符串
 * @param num 最终字符串长度
 */
export function addZero(str: string, num: number) {
  let diArr = new Array(num)
  diArr.fill('0')
  str = diArr.join('') + str
  str = str.substring(str.length - num)
  return str
}

/**
 * 消息弹窗
 */
export function messageShow(message: string, messageType: any = 'success', show: boolean = true) {
  ElMessage({
    type: messageType,
    showClose: show,
    message: message
  })
}

/**
 * 消息弹出框
 */
export function messageBoxShow(title: string, message: string, type: any = 'success', duration: number = 1500) {
  ElNotification({
    title,
    message,
    type,
    duration
  })
}

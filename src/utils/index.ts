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

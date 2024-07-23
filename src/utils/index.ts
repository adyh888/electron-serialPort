/**
 * imports
 * 工具
 */
import { ElLoading, ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { useIndexStore } from '../store'
import * as fs from 'fs'
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
 * 消息弹出框确认
 */
export async function messageBox(title: string, type: any = 'warning') {
  try {
    await ElMessageBox.confirm(title, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type
    })
    return true
  } catch (error) {
    return false
  }
}

/**
 * 消息弹窗-- html
 */
export async function messageBoxHtml(title: string, html: any, buttonText: string = '确定') {
  console.log(74, ElMessageBox)
  setTimeout(() => {
    ElMessageBox.close()
  }, 7500)
  //确定时间倒计时
  return await ElMessageBox.alert(html, title, {
    dangerouslyUseHTMLString: true,
    showClose: false,
    showConfirmButton: false
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

/**
 * 异步等待
 * @param array
 * @param callback
 */
export async function asyncForEach(array: any, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/**
 * 防抖函数
 * @param func 函数
 * @param delay 延迟
 */
export function debounce(func, delay) {
  let timerId

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * loading 加载动画
 *
 */
export const ElLoadingShow = () => {
  const storeIndex = useIndexStore()
  let loadingGlobal = ElLoading.service({
    lock: true,
    text: '数据加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  //储存到store里
  storeIndex.loadingGlobal = loadingGlobal
  return loadingGlobal
}

/**
 * 图片转buffer
 */
export async function imageToBuffer(imagePath: string): Promise<Buffer> {
  try {
    const fileData = await fs.promises.readFile(imagePath)
    return Buffer.from(fileData)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('文件不存在:', imagePath)
    } else if (error.code === 'EACCES') {
      console.error('权限不足:', imagePath)
    } else {
      console.error('读取文件时发生错误:', error)
    }
    throw error
  }
}

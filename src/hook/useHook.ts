import { useIndexStore } from '../store'
import { messageShow } from '../utils'
import { ipcRenderer } from 'electron'

/**
 *监听串口的状态和数据
 */
export function useSerialPortListener() {
  //打开串口
  ipcRenderer.on('openSerialPort', (event, args) => {
    console.log(11, args)
  })
  //窗口异常
  ipcRenderer.on('catchSerialPort', (event, args) => {
    console.log(12, args)
  })
  //关闭串口
  ipcRenderer.on('closeSerialPort', (event, args) => {
    console.log(13, args)
  })
  //监听串口数据
  ipcRenderer.on('dataSerialPort', (event, args) => {
    console.log(14, args)
  })
}

/**
 * SerialPortClass-串口类
 */
import { strHexBuffer } from '../utils'
/**
 * imports
 */
const { SerialPort } = require('serialport')
import bus from '../utils/eventBus'
/**
 * 封装串口类
 */
export class SerialPortClass {
  /**
   * 串口对象
   */
  private serialPort: any = null

  constructor() {}

  /**
   * 初始化串口
   * @param path:串口地址
   * @param baudRate:波特率
   */
  init(path: string, baudRate: number) {
    this.serialPort = new SerialPort({
      path: path, // 串口号
      baudRate: baudRate, // 波特率
      dataBits: 8, // 数据位
      parity: 'none', // 奇偶校验
      stopBits: 1, // 停止位
      autoOpen: false // 是否自动打开端口
    })
    // 打开串口
    this.serialPort.open((err: any) => {
      if (err) {
        return
      }
      bus.emit('serialPortStatus', true)
      console.log('端口打开成功')
    })
    // 串口数据监听
    this.serialPort.on('data', (data: any) => {
      console.log('data', data)
      //buffer转16进制的字符串
      let resHex = this.ab2hex(data)
      bus.emit('serialPortData', resHex)
    })
    // 串口关闭
    this.serialPort.on('close', () => {
      bus.emit('serialPortStatus', false)
      console.log('串口关闭')
    })
    // 错误监听
    this.serialPort.on('error', (err: any) => {
      bus.emit('serialPortStatus', false)
    })
  }

  /**
   * 获取列表
   */
  async serialPortList() {
    return await SerialPort.list()
  }

  /**
   * 发送写数据
   */
  write(data: string) {
    const buffer = strHexBuffer(data)
    // 打开串口
    this.serialPort.write(buffer, err => {
      if (err) {
        return
      }
      console.log('发送成功')
    })
  }

  /**
   * 关闭串口
   */
  close() {
    this.serialPort.close((err: any) => {
      if (err) {
        return
      }
    })
  }

  /**
   * ArrayBuffer转16进度字符串示例
   */
  private ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join('')
  }
}

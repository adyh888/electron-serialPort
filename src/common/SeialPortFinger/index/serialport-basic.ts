/**
 * SerialPortClass-串口类
 */
import { strHexBuffer } from '../../../utils'
/**
 * imports
 */
const { SerialPort } = require('serialport')
import { emitter2 } from '../../../utils/EventsBus'
/**
 * 封装串口类
 */
export class SerialPortClass {
  /**
   * 串口对象
   */
  serialPort: any = null

  client: any = null
  myevents: emitter2
  constructor(path: string, baudRate: number) {
    //事件
    this.myevents = emitter2
    this.serialPort = new SerialPort({
      path: path, // 串口号
      baudRate: baudRate, // 波特率
      dataBits: 8, // 数据位
      parity: 'none', // 奇偶校验
      stopBits: 1, // 停止位
      autoOpen: false // 是否自动打开端口
    })
    this.client = this.serialPort
    // 打开串口
    this.serialPort.open((err: any) => {
      if (err) {
        return
      }
      this.myevents.emit('serialPortStatus', true)
      console.log('端口打开成功')
    })
    // 串口数据监听
    this.serialPort.on('data', (data: any) => {
      //buffer转16进制的字符串
      let resHex = this.ab2hex(data)
      this.myevents.emit('serialPortData', resHex)
    })
    // 串口关闭
    this.serialPort.on('close', () => {
      console.log('串口关闭')
      this.myevents.emit('serialPortStatus', false)
    })
    // 错误监听
    this.serialPort.on('error', (err: any) => {
      this.myevents.emit('serialPortStatus', false)
    })
    //串口关闭
    this.myevents.on('serialPortClose', () => {
      this.close()
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
   * ArrayBuffer转16进度字符串
   */
  private ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join('')
  }
}

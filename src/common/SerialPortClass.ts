/**
 * SerialPortClass-串口类
 */

/**
 * imports
 */
import { SerialPort } from 'serialport'
import bus from '../utils/eventBus'
import { messageShow } from '../utils'
/**
 * 获取串口列表
 */
export async function serialPortList() {
  return await SerialPort.list()
}
/**
 * 串口类
 */
export class SerialPortClass {
  /**
   * 串口对象
   */
  private serialPort: SerialPort | null = null

  /**
   * 串口号
   * @private
   */
  private portName: string = ''

  /**
   * 波特率
   */
  private baudRate: number = 0

  /**
   * 连接状态
   */
  public connectStatus: boolean = false
  /**
   * 构造函数
   * @param portName 串口号
   * @param baudRate 波特率
   */
  constructor(portName: string, baudRate: number) {
    this.portName = portName
    this.baudRate = baudRate
  }

  /**
   * 串口初始化-异步的
   */
  async asyncSerialPortInit() {
    return new Promise((resolve, reject) => {
      let that = this
      //如果串口对象存在，那就关闭串口
      if (!that.serialPort) {
        that.serialPort = new SerialPort({ path: that.portName, baudRate: that.baudRate }, function (err) {
          if (err) {
            messageShow('串口初始化连接失败,请检查串口设备', 'error')
            that.serialPort = null
            that.connectStatus = false
            reject('串口初始化连接失败,请检查串口设备')
            return
          }
          that.serialPortEvent()
          resolve(true)
        })
      } else {
        //那就关闭串口类
        that.close()
        that.connectStatus = false
        reject('关闭串口')
      }
    })
  }

  /**
   * 串口事件的监听
   */
  private serialPortEvent() {
    console.log('进入连接')
    this.connectStatus = true
    this.serialPort!.on('data', data => {
      bus.emit('serialPortData', data)
    })
    this.serialPort!.on('error', function (err) {
      bus.emit('serialPortError', err)
    })
    messageShow('串口开启成功')
  }

  /**
   * 发送数据
   * @param data 数据
   */
  sendData(data: string) {
    if (!this.serialPort) {
      messageShow('串口设备未连接', 'error')
      return
    }
    this.serialPort!.write(data, err => {
      if (err) {
        messageShow(`数据写入失败${JSON.stringify(err)}`, 'error')
        return
      }
    })
  }

  /**
   * 关闭串口
   * @returns Promise<void>
   */
  close() {
    console.log('进入关闭')
    this.serialPort!.close(err => {
      if (err) {
        messageShow(`串口关闭失败${JSON.stringify(err)}`, 'error')
        return
      }
      messageShow('串口关闭成功')
      this.serialPort = null
      this.connectStatus = false
    })
  }
}

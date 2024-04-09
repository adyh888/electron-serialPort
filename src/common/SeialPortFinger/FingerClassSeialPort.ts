/**
 * imports
 */
import { SerialPortUtils } from './index/serialport-utils'
import * as _ from 'lodash'
const { SerialPort } = require('serialport')
import { emitter2 } from '../../utils/EventsBus'
import { strHexBuffer } from '../../utils'

export enum Q3 {
  ACK_SUCCESS = 0, //操作成功
  ACK_FAIL = 1, //操作失败
  ACK_FULL = 4, //指纹数据库已满
  ACK_NOUSER = 5, //无此用户
  ACK_USER_OPD = 6, //用户已存在
  ACK_FIN_OPD = 7, //指纹已存在
  ACK_TIMEOUT = 8 //采集超时
}

export interface Res {
  result: string
}

export interface ResTotal {
  result: string
  total: number
}

export interface ResUser {
  result: string
  userInfo?: { uno: number; right: number }
}

export interface ResFeature {
  result: string
  fno: number
  right: number
  feature: string
}

export interface ResData<T> {
  result: string
  data: T[]
  total: number
}

export interface UserInfo {
  fno: number
  right: number
}

export class SerialPortFinger extends SerialPortUtils {
  public isDebugMode: boolean
  /**
   * 串口对象
   */
  private serialPort: any = null

  myEvents = emitter2

  /**
   * 指纹 基本类
   * 仅包含 指纹 的基本方法和属性
   * 微雪指纹模块链接 https://www.waveshare.net/shop/UART-Fingerprint-Reader.htm
   */

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
    console.log(17, this.serialPort)
    // 打开串口
    this.serialPort.open((err: any) => {
      if (err) {
        return
      }
      this.myEvents.emit('serialPortStatus', true)
      console.log('端口打开成功')
    })
    // 串口数据监听
    this.serialPort.on('data', (data: any) => {
      console.log('接收到的数据data', data)
      var buf: Buffer = Buffer.from(data, 'hex')
      console.log('接收:', buf)
      if (buf[0] == 245) {
        //F5
        switch (buf[1]) {
          case 1: //01 第1次录入指纹
            this.myEvents.emit('record1', buf)
            break
          case 2: //02 第2次录入指纹
            this.myEvents.emit('record2', buf)
            break
          case 3: //03 第3次录入指纹
            this.myEvents.emit('record3', buf)
            break
          case 4: //04 删除指定用户
            this.myEvents.emit('deleteSingle', buf)
            break
          case 5: //05 删除所有用户
            this.myEvents.emit('deleteAll', buf)
            break
          case 9: //09
            if (buf[4] == 0) {
              //0 获取用户数
              this.myEvents.emit('getTotalUser', buf)
            }
            if (buf[4] == 255) {
              //FF 获取容量
              this.myEvents.emit('getTotalCapacity', buf)
            }
            break
          case 11: //0B 比对1：1
            this.myEvents.emit('companyOneToOne', buf)
            break
          case 12: //0C 比对1：N
            this.myEvents.emit('compareOneToMore', buf)
            break
          case 38: //26 取DSP 模块版本号
            this.myEvents.emit('getVersion', buf)
            break
          case 40: //28 取DSP 比较等级
            this.myEvents.emit('compareGrade', buf)
            break
          case 36: //24 采集图像并上传
            this.myEvents.emit('getImageAndUpload', buf)
            break
          case 35: //23 采集图像并提取特征值上传
            this.myEvents.emit('getImageFeatureUpload', buf)
            break
          case 68: //44 下传特征值与采集指纹比对
            this.myEvents.emit('downloadFeatureAndCompareToGetFeature', buf)
            break
          case 0x42: //42 下传指纹特征值与DSP 模块数据库指纹比对1：1
            this.myEvents.emit('downloadFeatureAndCompareOneToOne', buf)
            break
          case 0x43: //43 下传指纹特征值与DSP 模块数据库指纹比对1：N
            this.myEvents.emit('downloadFeatureAndCompareOneToMore', buf)
            break
          case 49: //31 上传DSP 模块数据库内指定用户特征值
            this.myEvents.emit('uploadDspOne', buf)
            break
          case 65: //41 下传特征值并按指定用户号存入DSP 模块数据库
            this.myEvents.emit('downloadFeatureAndSaveToDsp', buf)
            break
          case 43: //2B 取已登录所有用户用户号及权限
            this.myEvents.emit('getRegAllUserInfo', buf)
            break
          case 44: //2C 使模块进入休眠状态
            this.myEvents.emit('sleep', buf)
            break
          case 45: //2D 设置/读取指纹添加模式
            this.myEvents.emit('fingerAddMode', buf)
            break
          case 46: //2E 设置/读取指纹采集等待超时时间
            this.myEvents.emit('overTime', buf)
            break
          default:
            break
        }
      } else {
        console.log('返回head格式错误')
      }
      //buffer转16进制的字符串
      // let resHex = this.ab2hex(data)
      // myEvents.emit('serialPortData', resHex)
    })
    // 串口关闭
    this.serialPort.on('close', () => {
      this.myEvents.emit('serialPortStatus', false)
      console.log('串口关闭')
    })
    // 错误监听
    this.serialPort.on('error', (err: any) => {
      this.myEvents.emit('serialPortStatus', false)
    })
  }

  /**
   *
   * @param cmd 16进制字符串
   * @param P1 数字
   * @param P2 数字
   * @param P3 数字
   */
  private getCmd(cmd: string, P1: number, P2: number, P3: number) {
    let s1 = this.addzero(P1.toString(16), 2)
    let s2 = this.addzero(P2.toString(16), 2)
    let s3 = this.addzero(P3.toString(16), 2)
    let str = cmd + s1 + s2 + s3 + '00'
    let bcc = this.bccCheck(str)
    return 'F5' + str + bcc + 'F5'
  }

  /**
   *
   * @param P1 数字
   * @param P2 数字
   * @param P3 数字
   * @param data 数据
   */
  private getCmd2(P1: number, P2: number, P3: number, data: number[]) {
    let buf: Buffer = Buffer.from([P1, P2, P3, ...data])
    let str = ''
    buf.forEach(e => {
      str += e.toString(16).padStart(2, '0')
    })
    let bcc = this.bccCheck(str)
    return 'F5' + str + bcc + 'F5'
  }

  private getUserBytes(uno: number): number[] {
    let str = uno.toString(16)
    str = this.addzero(str, 4)
    // console.log('getUserBytes',str)
    let b: number[] = []
    b.push(parseInt(str.substr(0, 2), 16))
    b.push(parseInt(str.substr(2, 2), 16))
    return b
  }

  private getUserStrArr(uno: number) {
    let str = uno.toString(16)
    str = this.addzero(str, 4)
    console.log('getUserBytes', str)
    let s: string[] = []
    s.push(str.substr(0, 2))
    s.push(str.substr(2, 2))
    return s
  }

  private concatHighLow(high: number, low: number): number {
    return parseInt(high.toString(16).padStart(2, '0') + low.toString(16).padStart(2, '0'), 16)
  }

  private bccCheck(params: string) {
    let charArr: string[] = []
    while (true) {
      if (params.length == 0) {
        break
      }
      charArr.push(params.substring(0, 2))
      params = params.substring(2)
    }
    let res = 0
    for (var i = 0; i < charArr.length; i++) {
      res = res ^ parseInt(charArr[i], 16)
    }
    return this.addzero(res.toString(16).toUpperCase(), 2)
  }

  private static feature2hexData(feature: string): number[] {
    //特征值字符串转buffer
    let buf: number[] = []
    for (let i = 0; i < feature.length - 1; i += 2) {
      buf.push(parseInt('0x' + feature.substring(i, i + 2), 16))
    }
    return buf
  }

  async getEmptyFno(): Promise<number> {
    const res = await this.getRegAllUserInfo()
    // expect(res.result).toBe("ACK_SUCCESS");
    const existArr = _.map(res.data, e => e.fno)
    console.log({ existArr })
    const arr: number[] = []
    for (let i = 0; i < 4000; i++) {
      arr.push(i + 1)
    }
    const residueArr = _.difference(arr, existArr)
    return residueArr[0]
  }

  private _send(cmd: string) {
    //发送报文
    // this.client.write(cmd, 'hex', function (err) {
    //   if (err) {
    //     return console.log('Error on write: ', err.message)
    //   }
    //   // console.log('message written',cmd);
    // })
    this.write(cmd)
  }

  /**
   * 2．5 删除所有用户（命令/应答均为8 字节）
   * <= F5 05 00 00 00 00 05 F5
   * => F5 05 00 00 00 00 05 F5
   */
  async deleteAll(): Promise<Res> {
    return new Promise(resolve => {
      //发送报文
      let cmd = 'F5050000000005F5'
      this.write(cmd)
      // this.client.write(cmd, 'hex', function (err) {
      //   if (err) {
      //     return console.log('Error on write: ', err.message)
      //   }
      //   // console.log('message written',cmd);
      // })
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('deleteAll', buf => {
        //buf[4] 0:ACK_SUCCESS,1:ACK_FAIL
        const result = Q3[buf[4]]
        resolve({ result })
      })
    })
  }

  /**
   * 2.2 设置/读取指纹添加模式（命令/应答均为8 字节）
   * @param mode 0:设置 1：读取
   * F5 2D 00 00 01 00
   * <= F5 2D 00 00 00 00 2D F5
   * => F5 2D 00 00 00 00 2D F5
   * TODO：返回值还未设置
   */
  fingerAddMode(mode: number) {
    return new Promise(resolve => {
      if (mode != 0 && mode != 1) {
        resolve('error')
      } else {
        console.log('mode', mode)
        let cmd = this.getCmd('2D', 0, mode, 0)
        console.log('fingerAddMode', cmd)
        if (cmd) {
          //发送报文
          this.write(cmd)
          // this.client.write(cmd, 'hex', function (err) {
          //   if (err) {
          //     return console.log('Error on write: ', err.message)
          //   }
          //   console.log('message written', cmd)
          // })
          //接收报文后的响应
          // <Buffer f5 2d 00 01 00 00 2c f5>
          this.myEvents.once('fingerAddMode', buf => {
            //buf[3] 0:allowedRepeat,1:notAllowedRepeat
            console.log('buf[3]', buf[3])
            let res
            if (buf[3] == 0) {
              res = 'allowedRepeat'
            }
            if (buf[3] == 1) {
              res = 'notAllowedRepeat'
            }
            resolve(res)
          })
        }
      }
    })
  }

  /**
   * 第1次录入
   * <= F5 01 00 01 01 00 01 F5
   * =>
   */
  record1(uno: number): Promise<Res> {
    return new Promise(resolve => {
      let userBytes = this.getUserBytes(uno)
      let cmd = this.getCmd('01', userBytes[0], userBytes[1], 1)
      if (this.isDebugMode) console.log('record1', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('record1', buf => {
        const result = Q3[buf[4]] //buf[4] 0:ACK_SUCCESS,1:ACK_FAIL
        resolve({ result })
      })
    })
  }

  /**
   * 第2次录入
   * <= F5 02 00 01 01 00 02 F5
   * =>
   */
  record2(fno: number): Promise<Res> {
    return new Promise(resolve => {
      let userBytes = this.getUserBytes(fno)
      let cmd = this.getCmd('02', userBytes[0], userBytes[1], 1)
      if (this.isDebugMode) console.log('record2', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('record2', buf => {
        const result = Q3[buf[4]] //buf[4] 0:ACK_SUCCESS,1:ACK_FAIL
        resolve({ result })
      })
    })
  }

  /**
   * 第3次录入
   * @param fno 用户号
   * <= F5 03 00 01 01 00 03 F5
   * =>
   */
  record3(fno: number): Promise<Res> {
    return new Promise(resolve => {
      let userBytes = this.getUserBytes(fno)
      let cmd = this.getCmd('03', userBytes[0], userBytes[1], 1)
      if (this.isDebugMode) console.log('record2', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('record3', buf => {
        const result = Q3[buf[4]] //buf[4] 0:ACK_SUCCESS,1:ACK_FAIL
        resolve({ result })
      })
    })
  }

  /**
   * 删除指定用户
   * <= F5 04 00 01 00 00 05 F5
   * => F5 04 00 00 00 00 04 F5 成功
   * => F5 04 00 00 05 00 01 F5
   */
  deleteSingle(fno: number): Promise<Res> {
    return new Promise(resolve => {
      let userBytes = this.getUserBytes(fno)
      let cmd = this.getCmd('04', userBytes[0], userBytes[1], 0)
      if (this.isDebugMode) console.log('deleteSingle', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('deleteSingle', buf => {
        const result = Q3[buf[4]] //buf[4] 0:ACK_SUCCESS,1:ACK_FAIL
        resolve({ result })
      })
    })
  }

  /**
   * 取用户总数
   * F5 09 00 00 00 00 09 F5
   */
  async getTotalUser(): Promise<ResTotal> {
    return new Promise(resolve => {
      let cmd = 'F5090000000009F5'
      if (this.isDebugMode) console.log('getTotalUser', cmd)
      this._send(cmd) //发送报文
      // <Buffer f5 09 00 00 00 00 09 f5>
      this.myEvents.once('getTotalUser', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        // console.log(total)
        resolve({ result, total })
      })
    })
  }

  /**
   * 取指纹传感器容量
   * <= F5 09 00 00 FF 00 F6 F5
   * => F5 09 0F A0 FF 00 F6 F5
   */
  async getTotalCapacity(): Promise<ResTotal> {
    return new Promise(resolve => {
      //发送报文
      let cmd = 'F5090000FF00F6F5'

      if (this.isDebugMode) console.log('getTotalCapacity', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('getTotalCapacity', buf => {
        console.log(395, buf[4])
        const result = Q3[buf[4]]
        //buf[2] 用户数高位 buf[3]用户数低位
        let str = buf[2].toString(16) + buf[3].toString(16)
        const total = this.concatHighLow(buf[2], buf[3])
        console.log(399, result, total)
        resolve({ result, total })
      })
    })
  }

  /**
   * 取用户权限
   */
  async getUserRight(fno: number): Promise<ResTotal> {
    return new Promise(resolve => {
      let userBytes = this.getUserBytes(fno)
      let cmd = this.getCmd('0A', userBytes[0], userBytes[1], 0)
      if (this.isDebugMode) console.log('getUserRight', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('getUserRight', buf => {
        const result = Q3[buf[4]]
        //buf[2] 用户数高位 buf[3]用户数低位
        let str = buf[2].toString(16) + buf[3].toString(16)
        const total = this.concatHighLow(buf[2], buf[3])
        // console.log(total)
        resolve({ result, total })
      })
    })
  }

  /**
   * 比对1：1
   * <= F5 0B 00 01 00 00 1B F5
   * => F5 0B 00 01 00 00 1B F5
   */
  async companyOneToOne(fno: number): Promise<ResTotal> {
    return new Promise(resolve => {
      let userBytes = this.getUserBytes(fno)
      let cmd = this.getCmd('0B', userBytes[0], userBytes[1], 0)
      if (this.isDebugMode) console.log('companyOneToOne', cmd) //F50B001000001BF5
      //发送报文
      //F5 0B 00 01 00 00 0A F5
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('companyOneToOne', buf => {
        const result = Q3[buf[4]]
        //buf[2] 用户数高位 buf[3]用户数低位
        let str = buf[2].toString(16) + buf[3].toString(16)
        const total = this.concatHighLow(buf[2], buf[3])
        // console.log(total)
        resolve({ result, total })
      })
    })
  }

  /**
   * 比对1：N
   * <= F5 0C 00 01 00 00 0A F5 可能错
   * => F5 0C 00 01 00 00 0A F5
   */
  async compareOneToMore(): Promise<ResTotal> {
    return new Promise(resolve => {
      let cmd = this.getCmd('0C', 0, 0, 0)
      if (this.isDebugMode) console.log('compareOneToMore', cmd) //F50C000100000DF5
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('compareOneToMore', buf => {
        const result = Q3[buf[4]]
        //buf[2] 用户数高位 buf[3]用户数低位
        let str = buf[2].toString(16) + buf[3].toString(16)
        const total = this.concatHighLow(buf[2], buf[3])
        // console.log(total)
        resolve({ result, total })
      })
    })
  }

  /**
   * getVersion
   * <= F5 26 00 00 00 00 26 F5 可能错
   * => F5  F5
   */
  async getVersion(): Promise<ResTotal> {
    return new Promise(resolve => {
      let cmd = this.getCmd('26', 0, 0, 0)
      if (this.isDebugMode) console.log('getVersion', cmd) //F5260000000026F5
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('getVersion', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        // console.log(total)
        resolve({ result, total })
      })
    })
  }

  /**
   * 设置/读取比对等级
   * @param grade 比对等级取值为0-9，取值越大比对越严格，默认值为5
   * @param mode 0:设置 1：读取
   */
  compareGrade(grade: number, mode: number): Promise<ResTotal> {
    return new Promise(resolve => {
      let cmd = this.getCmd('28', 0, grade, mode)
      if (this.isDebugMode) console.log('compareGrade', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('compareGrade', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        resolve({ result, total })
      })
    })
  }

  /**
   * 采集图像并上传
   * <= F5 24 00 00 00 00 24 F5 可能错
   */
  getImageAndUpload(): Promise<ResTotal> {
    return new Promise(resolve => {
      //计算命令
      let cmd = this.getCmd('24', 0, 0, 0)
      if (this.isDebugMode) console.log('getImageAndUpload', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('getImageAndUpload', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        resolve({ result, total })
      })
    })
  }

  /**
   * 采集图像并提取特征值上传
   */
  getImageFeatureUpload(): Promise<ResTotal> {
    return new Promise(resolve => {
      //计算命令
      let cmd = this.getCmd('23', 0, 0, 0)
      if (this.isDebugMode) console.log('getImageFeatureUpload', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('getImageFeatureUpload', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        resolve({ result, total })
      })
    })
  }

  /**
   * 下传特征值与采集指纹比对
   * @param fno 用户号
   */
  downloadFeatureAndCompareToGetFeature(fno: number): Promise<ResTotal> {
    return new Promise(resolve => {
      //计算命令
      let userBytes = this.getUserBytes(fno)
      //发送报文
      let cmd = this.getCmd('44', userBytes[0], userBytes[1], 0)
      if (this.isDebugMode) console.log('downloadFeatureAndCompareToGetFeature', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('downloadFeatureAndCompareToGetFeature', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        resolve({ result, total })
      })
    })
  }

  /**
   * 下传指纹特征值与DSP 模块数据库指纹比对1：1
   * @param fno 用户号
   */
  downloadFeatureAndCompareOneToOne(fno: number): Promise<ResTotal> {
    return new Promise(resolve => {
      //计算命令
      let userBytes = this.getUserBytes(fno)
      //发送报文
      let cmd = this.getCmd('42', userBytes[0], userBytes[1], 0)
      if (this.isDebugMode) console.log('downloadFeatureAndCompareOneToOne', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('downloadFeatureAndCompareOneToOne', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        resolve({ result, total })
      })
    })
  }

  /**
   * 下传指纹特征值与DSP 模块数据库指纹比对1：N
   * @param feature 特征值
   */
  downloadFeatureAndCompareOneToMore(feature: string): Promise<ResUser> {
    return new Promise(resolve => {
      //计算命令
      const len = 196 // Len-3 恒为193字节
      let userBytes = this.getUserBytes(len)
      //发送报文
      const head = this.getCmd('43', userBytes[0], userBytes[1], 0)
      let data: number[] = TfsD400Basic.feature2hexData(feature) //特征值字符串转buffer
      console.assert(data.length == 193, '特征值长度必须为193位')
      const body = this.getCmd2(0, 0, 0, data)
      let cmd = head + body
      if (this.isDebugMode) console.log('downloadFeatureAndCompareOneToMore', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('downloadFeatureAndCompareOneToMore', buf => {
        console.log(655, buf)
        if (buf[4] == 5) {
          resolve({ result: Q3[buf[4]] }) //不存在
        } else {
          const result = Q3[buf[4]]
          const uno = this.concatHighLow(buf[2], buf[3])
          const right = buf[4]
          const userInfo = { uno, right }
          resolve({ result, userInfo })
        }
      })
    })
  }

  /**
   * 上传DSP 模块数据库内指定用户特征值
   * @param fno 用户号
   */
  uploadDspOne(fno: number): Promise<ResFeature> {
    return new Promise((resolve, reject) => {
      //计算命令
      let userBytes = this.getUserBytes(fno)
      let cmd = this.getCmd('31', userBytes[0], userBytes[1], 0)
      if (this.isDebugMode) console.log('uploadDspOne', cmd) //F50C000100000DF5
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('uploadDspOne', (buf: Buffer) => {
        console.log('uploadDspOne', buf)
        if (buf.length < 8) throw new Error('通讯错误')
        const head = buf.subarray(0, 7)
        const result = Q3[buf[4]]
        if (buf.length == 8) {
          // console.log(buf)
          reject(result)
        } else {
          const body = buf.subarray(8)
          //buf[2] 用户数高位 buf[3]用户数低位
          // let fno = parseInt(body[1].toString(16).padStart(2,'0') + body[2].toString(16).padStart(2,'0'));
          let fno = this.concatHighLow(body[1], body[2])
          console.log(686, fno, head, body)
          const right = body[3]
          const feature = body.subarray(4, 4 + 193).toString('hex')
          console.assert(feature.length === 193 * 2, `feature长度错误长度应为386，但现在为${feature.length}`)
          resolve({ result, fno, right, feature })
        }
      })
    })
  }

  /**
   * 下载DSP 模块数据库内指定用户特征值
   * @param fno 用户号
   * @param feature 指纹特征值
   */
  downloadFeatureAndSaveToDsp(fno: number, feature: string): Promise<ResTotal> {
    return new Promise(resolve => {
      ///计算命令 head
      let lenBytes = this.getUserBytes(196) // 固定长度
      const head = this.getCmd('41', lenBytes[0], lenBytes[1], 0)
      ///计算命令 body
      let userBytes = this.getUserBytes(fno)
      let data: number[] = TfsD400Basic.feature2hexData(feature) //特征值字符串转buffer
      console.assert(data.length == 193, '特征值长度必须为193位')
      const right = 1 //用户权限1/2/3
      const body = this.getCmd2(userBytes[0], userBytes[1], right, data)
      //发送报文
      let cmd = head + body
      if (this.isDebugMode) console.log('downloadFeatureAndSaveToDsp', cmd) //F50B001000001BF5
      this._send(cmd) //发送报文
      // 接收报文后的响应
      // <Buffer f5 09 0f a0 ff 00 59 f5>
      this.myEvents.once('downloadFeatureAndSaveToDsp', buf => {
        const result = Q3[buf[4]]
        const total = this.concatHighLow(buf[2], buf[3])
        // console.log(total)
        resolve({ result, total })
      })
    })
  }

  /**
   * 2.1 使模块进入休眠状态（命令/应答均为8 字节）
   * <= F5 2C 00 00 00 00 2C F5
   * => F5 2C 00 00 00 00 2C F5
   */
  sleep(): Promise<Res> {
    return new Promise(resolve => {
      //发送报文
      let cmd = this.getCmd('2C', 0, 0, 0)
      if (this.isDebugMode) console.log('sleep', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('sleep', buf => {
        let result = Q3[buf[4]]
        resolve({ result })
      })
    })
  }

  /**
   * 2.19 取已登录所有用户用户号及权限
   * <= F5 2C 00 00 00 00 2C F5
   * => F5 2C 00 00 00 00 2C F5
   */
  getRegAllUserInfo(): Promise<ResData<UserInfo>> {
    return new Promise((resolve, reject) => {
      //发送报文
      let cmd = this.getCmd('2B', 0, 0, 0)
      if (this.isDebugMode) console.log('getRegAllUserInfo', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('getRegAllUserInfo', (buf: Buffer) => {
        const arr = buf.toString('hex').split('f5f5')
        console.log('arr:', arr)
        let head = Buffer.from(arr[0] + 'f5', 'hex')
        console.log('head:', head)
        const result = Q3[head[4]] //buf[4] 0:ACK_SUCCESS,1:ACK_FAIL
        if (result != 'ACK_SUCCESS') {
          reject(result)
        } else {
          let body = Buffer.from('f5' + arr[1], 'hex')
          console.log('body:', body)
          const total = this.concatHighLow(body[1], body[2])
          console.log('total:', total)
          const data: UserInfo[] = []
          if (total == 0) resolve({ result, data, total })
          for (let i = 0; i < total; i++) {
            data.push({
              fno: this.concatHighLow(body[3 + 3 * i], body[4 + 3 * i]),
              right: body[5 + 3 * i]
            })
          }
          resolve({ result, data, total })
        }
      })
    })
  }

  /**
   * 2.25 设置/读取指纹采集等待超时时间(命令/应答均为 8 字节)
   * <= F5  F5
   * => F5  F5
   */
  overTime(): Promise<Res> {
    return new Promise(resolve => {
      //发送报文
      let cmd = this.getCmd('2E', 0, 0, 0)
      if (this.isDebugMode) console.log('overTime', cmd)
      this._send(cmd) //发送报文
      //接收报文后的响应
      // <Buffer F5 05 00 00 00 00 05 F5>
      this.myEvents.once('overTime', buf => {
        let result = Q3[buf[4]]
        resolve({ result })
      })
    })
  }

  async record(fno: number): Promise<Res> {
    return new Promise(async (resolve, reject) => {
      // 先删除指定
      await this.deleteSingle(fno)

      // 1
      let res = await this.record1(fno)
      // 2
      if (res.result == 'ACK_SUCCESS') {
        res = await this.record2(fno)
      } else {
        reject(res.result)
      }
      // 3
      if (res.result == 'ACK_SUCCESS') {
        res = await this.record3(fno)
      } else {
        reject(res.result)
      }
      // 最后一次验证
      if (res.result == 'ACK_SUCCESS') {
        console.log('录入成功')
        resolve({ result: '录入成功' })
      }
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
    console.log('发送的数据', data)
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

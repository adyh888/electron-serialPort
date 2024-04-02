/**
 * imports
 */
import { SocketBasic } from './socket-basic'
import * as crc from 'crc'
import axios from 'axios'

export class SocketUtils extends SocketBasic {
  constructor(host: string, port: number) {
    super(host, port)
  }

  /**
   * 高位填零
   * @param str 传入字符串
   * @param num 最终字符串长度
   */
  addzero(str: string, num: number) {
    let diArr = new Array(num)
    diArr.fill('0')
    str = diArr.join('') + str
    str = str.substring(str.length - num)
    return str
  }

  /**
   * 获取CRC校验
   * @param cmd
   * @returns
   */
  crc_xmodem(cmd: string) {
    let buf = Buffer.from(cmd, 'hex')
    let check = crc.crc16xmodem(buf).toString(16)
    check = this.addzero(check, 4).toUpperCase()
    // let buf2=Buffer.from(check,'hex');

    // let buf3=Buffer.from([buf2[1],buf2[0]]);//对调位置

    // check=buf3.toString('hex')
    // console.log(40,check)
    return check
  }

  getCRC(cmd: string) {
    let buf = Buffer.from(cmd, 'hex')
    let check = crc.crc16modbus(buf).toString(16)
    check = this.addzero(check, 4)
    let buf2 = Buffer.from(check, 'hex')

    let buf3 = Buffer.from([buf2[1], buf2[0]])
    // console.log(38,buf3)
    check = buf3.toString('hex')
    // console.log(40,check)
    return check
  }

  bin2Hex(flagArr: boolean[]): string {
    let arr: string[] = []
    flagArr.reverse()
    flagArr.forEach(element => {
      arr.push(element ? '1' : '0')
    })
    let bin: string = arr.join('')
    return parseInt(bin, 2).toString(16)
  }

  async asyncForEach(array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  number2boolean(num: number): boolean {
    return num ? true : false
  }

  bin_to_hex(str: string) {
    let hex_array = [
      { key: 0, val: '0000' },
      { key: 1, val: '0001' },
      { key: 2, val: '0010' },
      { key: 3, val: '0011' },
      { key: 4, val: '0100' },
      { key: 5, val: '0101' },
      { key: 6, val: '0110' },
      { key: 7, val: '0111' },
      { key: 8, val: '1000' },
      { key: 9, val: '1001' },
      { key: 'a', val: '1010' },
      { key: 'b', val: '1011' },
      { key: 'c', val: '1100' },
      { key: 'd', val: '1101' },
      { key: 'e', val: '1110' },
      { key: 'f', val: '1111' }
    ]
    let value = ''
    let list: string[] = []
    // console.log(str)
    if (str.length % 4 !== 0) {
      let a = '0000'
      let b = a.substring(0, 4 - (str.length % 4))
      str = b.concat(str)
    }
    // console.log(str)
    while (str.length > 4) {
      list.push(str.substring(0, 4))
      str = str.substring(4)
    }
    list.push(str)
    // console.log(list)
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < hex_array.length; j++) {
        if (list[i] == hex_array[j].val) {
          value = value.concat(hex_array[j].key.toString())
          break
        }
      }
    }
    // console.log(value)
    return value
  }

  hex_to_bin(str: string) {
    let hex_array = [
      { key: 0, val: '0000' },
      { key: 1, val: '0001' },
      { key: 2, val: '0010' },
      { key: 3, val: '0011' },
      { key: 4, val: '0100' },
      { key: 5, val: '0101' },
      { key: 6, val: '0110' },
      { key: 7, val: '0111' },
      { key: 8, val: '1000' },
      { key: 9, val: '1001' },
      { key: 'a', val: '1010' },
      { key: 'b', val: '1011' },
      { key: 'c', val: '1100' },
      { key: 'd', val: '1101' },
      { key: 'e', val: '1110' },
      { key: 'f', val: '1111' }
    ]

    let value = ''
    for (let i = 0; i < str.length; i++) {
      for (let j = 0; j < hex_array.length; j++) {
        if (str.charAt(i).toLowerCase() == hex_array[j].key) {
          value = value.concat(hex_array[j].val)
          break
        }
      }
    }
    // console.log(value)
    return value
  }

  dingtalk_message = async (content: string, dingtalk_token: string, debug = 0) => {
    // let dingtalk_token='eb3fd6e24e46bf14dc5b77d06a5dac53da103ab52465967815bf4837ece692d8'
    let dingtalk_roboturl = 'https://oapi.dingtalk.com/robot/send?access_token=' + dingtalk_token
    let data = {
      msgtype: 'text',
      text: {
        content
      }
    }
    try {
      let res = await axios.post(dingtalk_roboturl, data)
      if (debug) {
        console.log('res:', res)
      }
      return res.data
    } catch (error) {
      if (debug) {
        console.log('error:', error)
      }
      return error
    }
  }
}

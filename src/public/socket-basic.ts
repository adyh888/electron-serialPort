/**
 * imports
 */
import * as net from 'net'
import * as events from 'events'
import { emitterFinger } from '../utils/EventsBus'
/**
 * socket 通信基本类
 *
 * close end 重连
 */
export class SocketBasic {
  client: net.Socket
  myevents: any

  host: string
  port: number

  islog: boolean = false
  destroy: boolean = false

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
    //事件
    this.myevents = emitterFinger
    events.EventEmitter.defaultMaxListeners = 0
    //客户端
    this.client = new net.Socket()
    this.client.setTimeout(8000)
    this.client.setEncoding('hex')
    this.client.connect(port, host, () => {
      this.myevents.emit('connect_success')
    })
    //缓冲区接收数据
    this.client.on('data', (message: string) => {
      console.log('data')
      this.myevents.emit('onData', message)
    })
    //错误事件
    this.client.on('error', err => {
      console.log('error')
      this.myevents.emit('connect_error', err)
    }) //打开错误将会发出一个错误事件
    this.client.on('ready', () => {
      console.log('ready')
    })
    this.client.on('lookup', () => {
      console.log('lookup')
    })
    // this.client.on("close", () => {});
    /**
     * 超时
     * 当 socket 空闲超时时触发，仅是表明 socket 已经空闲。用户必须手动关闭连接。
     */
    this.client.on('timeout', () => {
      console.log('timeout')
      this.myevents.emit('connect_timeout')
    })
    /**
     * 空闲
     * 当 socket 空闲超时时触发，仅是表明 socket 已经空闲。用户必须手动关闭连接。
     */
    this.client.on('drain', () => {
      console.log('drain')
      this.myevents.emit('connect_drain')
    })

    // /**
    //  * 关闭
    //  * 当 socket 另一端发送 FIN 包时，触发该事件。
    //  */
    // this.client.on("close", () => {
    //     if (this.destroy) {
    //         this.destroy = false
    //         return
    //     }
    //     this.myevents.emit("connect_close");
    //     this.connect();
    // });

    /**
     * 结束
     * 当 socket 另一端发送 FIN 包时，触发该事件。
     */
    this.client.on('end', () => {
      console.log('end')
      this.myevents.emit('connect_end')
      this.connect()
    })

    //TODO 新增的关闭事件
    this.myevents.on('close', err => {
      console.log('close')
      this.close()
      this.myevents.removeAllListeners()
      this.myevents = null
    })
  }

  private connect() {
    this.client.connect(this.port, this.host, () => {
      this.myevents.emit('connect_success')
    })
  }

  close() {
    this.destroy = true
    this.client.destroy()
  }
}

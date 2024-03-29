/**
 * SerialPortClass-串口类
 */

/**
 * imports
 */
import { SerialPort } from 'serialport'
import {ElMessage} from "element-plus";
import bus from '../utils/eventBus'
/**
 * 获取串口列表
 */
export async function serialPortList(){
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
     * 构造函数
     * @param portName 串口号
     * @param baudRate 波特率
     */
    constructor(portName: string, baudRate: number) {
        this.portName = portName
        this.baudRate = baudRate
        this.serialPortInit()
    }

    /**
     *串口初始化
     */
    private serialPortInit() {
        if (!this.serialPort) {
            this.serialPort = new SerialPort({path: this.portName, baudRate: this.baudRate}, function (err) {
                if (err) {
                    ElMessage.error(`串口初始化失败${JSON.stringify(err)}`)
                }
            })
            this.serialPortEvent()
        } else {
            //那就关闭串口类
            this.close()
        }
    }

    /**
     * 串口事件的监听
     */
    private serialPortEvent() {
        if (!this.serialPort) return  throw new Error('串口未打开')
        this.serialPort!.on('data', (data) => {
            bus.emit('serialPortData', data)
        })
        this.serialPort!.on('error', function (err) {
            bus.emit('serialPortError', err)
        })
    }

    /**
     * 发送数据
     * @param data 数据
     * @returns Promise<void>
     */
    public sendData(data: string){
        if (!this.serialPort) return  throw new Error('串口未打开')
        this.serialPort!.write(data, err => {
            if (err) {
                ElMessage.error(`数据写入失败${JSON.stringify(err)}`)
                return
            }
        })
    }

    /**
     * 关闭串口
     * @returns Promise<void>
     */
    private close() {
        if (!this.serialPort) return  throw new Error('串口未打开')
        this.serialPort!.close((err)=>{
            if (err) {
                ElMessage.error(`数据写入失败${JSON.stringify(err)}`)
                return
            }
        })
    }
}


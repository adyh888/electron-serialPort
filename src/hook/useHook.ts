// import { SerialPortClass } from '../common/SerialPortClass'
import { useIndexStore } from '../store'
import { messageShow } from '../utils'

/**
 * 初始化的串口类的方法
 */
// export const useInitSerial = async (serialPort: string, baudRate: number) => {
//   let serialPortObj = new SerialPortClass(serialPort, baudRate)
//   try {
//     await serialPortObj.asyncSerialPortInit()
//     useIndexStore().setSerialPortObj = serialPortObj
//   } catch (err) {
//     messageShow('串口异常', 'error')
//   }
// }

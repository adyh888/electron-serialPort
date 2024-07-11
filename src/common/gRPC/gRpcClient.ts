/**
 * imports
 */
import { funEnum, typeEnum } from './enum'
import { getFingerStatus, getRepeatedFno, setFingerData } from './function/fingerFun'
import { grpcRequest } from './utils/request'

//data ts接口
interface dataType {
  type: number
  json: object
  fun: string
}

export async function main(data: dataType) {
  switch (data.type) {
    case typeEnum.finger:
      if (data.fun === funEnum.getRepeatedFno) return await grpcRequest(getRepeatedFno, data.json)
      if (data.fun === funEnum.setFingerData) return await grpcRequest(setFingerData, data.json)
      if (data.fun === funEnum.getFingerStatus) return await grpcRequest(getFingerStatus, data.json)
      break
    case typeEnum.face:
      return await getRepeatedFno(data.json)
  }
}

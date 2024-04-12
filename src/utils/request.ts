/**
 * imports
 */
import to from 'await-to-js'
import { useLcStore } from '../store'
import { messageShow } from './index'

/**
 * 请求的封装
 * @param actionFun
 * @param json
 * @constructor
 */
export async function Request(actionFun: Function, json: Object) {
  const [err, res] = await to(actionFun(json))
  if (err) await ErrorLogInsert(err.message)
  if (res) return res
}

/**
 * 插入错误日志
 * @param data
 * @constructor
 */
async function ErrorLogInsert(data: any) {
  let json = {
    errorContent: data, //错误日志
    // interfaceName: data.config.url, //接口url
    // interfaceParams: JSON.stringify(data.config.data), //接口参数
    type: 'ELECTRON_ERROR' //错误类型
  }
  // // @ts-ignore
  const [err, res] = await to(useLcStore().logErrorInsert(json))
  if (err) messageShow('错误日志记录失败', 'error')
  if (res) messageShow('错误日志记录成功,请查看错误接口日志')
}

/**
 * imports
 */
import to from 'await-to-js'
import { useLcStore } from '../store'
//请求
export async function request(actionFun: Function, json: Object) {
  // @ts-ignore
  const [err, res] = await to(actionFun(json))
  if (err) await errorLogInsert(err)
  if (res) return res
}
//错误日志
async function errorLogInsert(data: any) {
  let json = {
    errorContent: JSON.stringify(data.data), //错误日志
    interfaceName: data.config.url, //接口url
    interfaceParams: JSON.stringify(data.config.data), //接口参数
    type: 'WEIXIN_ERROR' //错误类型
  }
  // // @ts-ignore
  const [err, res] = await to(useLcStore().logErrorInsert(json))
  // if (err) uniShowToast('错误日志记录失败', 'error')
  // if (res) uniShowToast('错误日志记录成功,请查看错误接口日志', 'none', 1000)
}

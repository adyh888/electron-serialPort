/**
 * imports
 */
import to from 'await-to-js'
import { useLcStore } from '../store'
import { messageShow } from './index'
import axios from 'axios'

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

/**
 * 人脸删除接口
 */
export function faceDeleteRequest(item: any) {
  return new Promise((resolve, reject) => {
    let json = {
      uuid: item.faceUuid
    }
    axios({
      method: 'post',
      url: `http://${item.serverIp}:8274/unregisterFace`,
      data: json,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 人脸注册接口
 */
export function faceAddRequest(json: any) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('jpeg', json.file)
    formData.append('name', json.name)
    formData.append('uid', json.uid)
    axios({
      method: 'post',
      url: `http://${json.serverIp}:8274/registerJpegV2`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 15000
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 人脸验证接口
 */
export function faceVerifyRequest(json: any) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('imageBytes', json.file)
    axios({
      method: 'post',
      url: `http://${json.serverIp}:8274/doRecognizeV2`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 15000
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

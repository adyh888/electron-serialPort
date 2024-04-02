/**
 * imports
 */
import axios from 'axios'
import { Ac, Dc, Gc, Lc, Mc, Tc, Uc } from '@mew/request'
import { BaseURL } from '../config'
import { StorageCache } from '../common/StorageClass'
import { messageShow } from '../utils'
const service = axios.create({
  baseURL: BaseURL(),
  timeout: 10000,
  source: 'LWW-electron-serialPort'
})
const storage = new StorageCache()
/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    const token = storage.get('accessToken')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    // 请求错误处理
    // @ts-ignore
    return Promise.reject(error)
  }
)
/**
 * 响应拦截器
 */
service.interceptors.response.use(
  response => {
    if (response.data.code === 1) {
      messageShow(`${response.data.error}`, 'error')
      return Promise.reject(response.data.error)
    }
    return response
  },
  error => {
    // @ts-ignore
    return Promise.reject(error)
  }
)

export const isDebugMode = true
export const ac = Ac(service, isDebugMode)
export const dc = Dc(service, isDebugMode)
export const gc = Gc(service, isDebugMode)
export const lc = Lc(service, isDebugMode)
export const mc = Mc(service, isDebugMode)
export const tc = Tc(service, isDebugMode)
export const uc = Uc(service, isDebugMode)

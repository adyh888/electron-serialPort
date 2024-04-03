/**
 * imports
 */
import axios from 'axios'
import { Ac, Dc, Gc, Lc, Mc, Tc, Uc } from '@mew/request'
import { BaseURL } from '../config'
import { StorageCache } from '../common/StorageClass'
import { messageBoxShow, messageShow } from '../utils'
import router from '../router'
const service = axios.create({
  baseURL: BaseURL(),
  timeout: 10000
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
      config.headers['source'] = 'LWW-electron-serialPort'
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
    if (error.request.status === 401) {
      messageBoxShow('错误', 'token失效，正在退出登录', 'error')
      router.push('/')
    }
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

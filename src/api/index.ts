// @ts-nocheck
/**
 * imports
 */
import axios from 'axios'
import { Ac, Dc, Gc, Lc, Mc, Tc, Uc } from '@mew/request'
import { BaseURL } from '../config'
import { StorageCache } from '../common/StorageClass'
import { messageBoxShow, messageShow } from '../utils'
import router from '../router'
import { useIndexStore } from '../store'
const service = axios.create({
  baseURL: BaseURL(),
  timeout: 15000
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
      // @ts-ignore
      config.headers['source'] = ('electron-fingerprint' + '_' + __Admin_VERSION__) as string
    }
    return config
  },
  error => {
    // 请求错误处理
    return Promise.reject(error)
  }
)
/**
 * 响应拦截器
 */
service.interceptors.response.use(
  response => {
    // console.log('响应拦截器成功', response)
    if (response.data.code === 1) {
      messageShow(`${response.data.error}`, 'error')
      return Promise.reject(response.data.error)
    }
    return Promise.resolve(response)
  },
  error => {
    const storeIndex = useIndexStore()
    // console.log('响应拦截器失败', error)
    if (error.request.status === 401) {
      messageBoxShow('错误', 'token失效，正在退出登录', 'error')
      router.push('/')
    }
    if (error.code === 'ERR_NETWORK') {
      messageBoxShow('错误', '网络连接失败，请检查网络', 'error')
      storeIndex.loadingGlobal.close()
    }
    if (error.code === 'ECONNABORTED') {
      messageBoxShow('错误', '网络连接失败，请检查网络', 'error')
      storeIndex.loadingGlobal.close()
      return Promise.reject(error.code)
    }
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

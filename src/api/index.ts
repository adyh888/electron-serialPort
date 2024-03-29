import axios from 'axios'
import axiosAdapterUniapp from 'axios-adapter-uniapp'
import { Ac, Dc, Gc, Lc, Mc, Tc, Uc } from '@mew/request'
import { BaseURL } from '../config'
const service = axios.create({
  baseURL: BaseURL(),
  timeout: 10000,
  source: 'LWW-electron-serialPort',
  // @ts-ignore
  adapter: axiosAdapterUniapp
})
// request拦截器
service.interceptors.request.use(
  config => {
    // @ts-ignore
    uni.showLoading({
      title: '数据加载中',
      mask: true
    })
    return config
  },
  error => {
    // 请求错误处理
    // @ts-ignore
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // @ts-ignore
    uni.hideLoading()
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

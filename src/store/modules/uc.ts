/**
 * imports
 */
import { defineStore } from 'pinia'
import { uc } from '../../api'
import { Request } from '../../utils/request'
import { FingerSelectProperty, FingerUpdateProperty, UserSelectProperty } from '@mew/request/dist/ms/uc'

//创建容器并导出容器
const useUcStore = defineStore('uc', {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    // 用户信息
    async userSelect(json: UserSelectProperty) {
      return await uc.user.select(json)
    },
    //finger信息
    async fingerSelect(json: FingerSelectProperty) {
      return await uc.finger.select(json)
    },
    async fingerUpdate(json: FingerUpdateProperty) {
      return await uc.finger.update(json)
    },
    //用户注册
    async userRegister(json: any) {
      return await uc.registerUser(json)
    }
  }
})

export { useUcStore, Request }

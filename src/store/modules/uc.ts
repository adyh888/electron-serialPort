/**
 * imports
 */
import { defineStore } from 'pinia'
import { uc } from '../../api'
import { Request } from '../../utils/request'
import { UserSelectProperty } from '@mew/request/dist/ms/uc'

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
    }
  }
})

export { useUcStore, Request }

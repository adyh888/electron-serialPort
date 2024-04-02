/**
 * imports
 */
import { defineStore } from 'pinia'
import { dc } from '../../api'
import { Request } from '../../utils/request'
import { DeviceSelectProperty } from '@mew/request/dist/ms/dc'

//创建容器并导出容器
const useDcStore = defineStore('dc', {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    // device
    async deviceSelect(json: DeviceSelectProperty) {
      return await dc.device.select(json)
    }
  }
})

export { useDcStore, Request }

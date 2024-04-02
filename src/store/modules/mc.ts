/**
 * imports
 */
import { defineStore } from 'pinia'
import { Request } from '../../utils/request'
import { mc } from '../../api'
import { ManagerSelectProperty } from '@mew/request/dist/ms/mc'

//创建容器并导出容器
const useMcStore = defineStore('mc', {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    //token
    async getToken(json: any) {
      return await mc.getAuth(json)
    },
    // manager
    async managerSelect(json: ManagerSelectProperty) {
      return await mc.manager.select(json)
    }
  }
})

export { useMcStore, Request }

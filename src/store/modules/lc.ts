/**
 * imports
 */
import { defineStore } from 'pinia'
import { lc } from '../../api'
import { LogErrorInsertProperty } from '@mew/request/dist/ms/lc'

//创建容器并导出容器
export const useLcStore = defineStore('lc', {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    //错误日志
    async logErrorInsert(json: LogErrorInsertProperty) {
      return await lc.log_error.insert(json)
    }
  }
})

/**
 * imports
 */
import { defineStore } from 'pinia'
import { ac } from '../../api'
import { AlarmSelectProperty } from '@mew/request/dist/ms/ac'
import { Request } from '../../utils/request'

//创建AC的容器并导出容器
//组合式API
const useAcStore = defineStore('ac', {
  state: () => {
    return {
      count: 10
    }
  },
  getters: {},
  actions: {
    async alarmSelect(json: AlarmSelectProperty) {
      return await ac.alarm.select(json)
    }
  }
  //本地持久化
  // persist: true
})
export { useAcStore, Request }

//函数式API
// export const useAcStore = defineStore('ac', () => {
//   let count = ref(0)
//   async function alarmSelect(json: AlarmSelectProperty) {
//     return await ac.alarm.select(json)
//   }
//
//   return { count, alarmSelect, request }
// })

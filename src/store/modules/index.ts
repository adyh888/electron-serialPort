import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
export const useIndexStore = defineStore('index', () => {
  const serialPortStoreStatus = ref(false)
  const SerialPortClass = reactive({})
  const userInfo = ref({})
  return { serialPortStoreStatus, userInfo, SerialPortClass }
})

export * from './ac'
export * from './dc'
export * from './lc'
export * from './mc'
export * from './tc'
export * from './uc'

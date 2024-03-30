import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useIndexStore = defineStore('index', () => {
  const setSerialPortObj = ref({})

  return { setSerialPortObj }
})

export * from './ac'
export * from './dc'
export * from './lc'
export * from './mc'
export * from './tc'
export * from './uc'

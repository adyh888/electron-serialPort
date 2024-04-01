import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useIndexStore = defineStore('index', () => {
  const serialPortStoreStatus = ref(false)

  return { serialPortStoreStatus }
})

export * from './ac'
export * from './dc'
export * from './lc'
export * from './mc'
export * from './tc'
export * from './uc'

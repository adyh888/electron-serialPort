<script setup lang="ts">
/**
 * imports
 */
import { onMounted, onUnmounted } from 'vue'
import { emitter2 } from './utils/EventsBus'
import { useIndexStore } from './store'
import { messageBoxShow } from './utils'

/**
 * data
 */
// pinia
const indexStore = useIndexStore()
/**
 * methods
 */
//全局事件的监听
const appListenEvent = () => {
  emitter2.on('serialPortStatus', (data: boolean) => {
    indexStore.serialPortStoreStatus = data
    if (!data) {
      messageBoxShow('错误', '串口设备断开连接', 'error')
    }
  })
}
/**
 * life
 */
onMounted(() => {
  appListenEvent()
})
onUnmounted(() => {
  emitter2.emit('serialPortClose')
})
</script>

<template>
  <div class="app_container">
    <router-view />
  </div>
</template>

<style>
.app_container {
  display: flex;
  overflow: hidden;
}
</style>

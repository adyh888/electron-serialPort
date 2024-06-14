<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <div style="width: 100%; height: 85vh; background-color: #fff; display: flex; justify-content: center">
      <CameraComponent ref="cameraRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import CameraComponent from '../../../components/FunComponents/CameraComponent.vue'
import { ref, provide, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useIndexStore } from '../../../store'

/**
 * data
 */
const user = useIndexStore()
const HeadTitle = ref(user.userInfo.username ?? '空')
const BackShow = ref(true)
const cameraRef = ref<any>(null)

/**
 * methods
 */
const confirm = type => {
  console.log(31, type)
}

/**
 * life
 */
onMounted(() => {
  cameraRef.value.openCamera()
})
onBeforeUnmount(() => {
  cameraRef.value.closeCamera()
})

/**
 * provides
 */
provide('dataProvide', { HeadTitle, BackShow })
</script>

<style scoped></style>

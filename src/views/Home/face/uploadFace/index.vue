<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <FaceUploadComponent />
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import HeadComponent from '../../../../components/CommonComponents/HeadComponent.vue'
import FaceUploadComponent from '../../../../components/FunComponents/FaceUploadComponent.vue'
import { ref, provide } from 'vue'
import { useIndexStore } from '../../../../store'

/**
 * data
 */
const BackShow = ref(true)
const user = useIndexStore()
const HeadTitle = ref(user.userInfo.username ?? '空')

/**
 * provides
 */
provide('dataProvide', { BackShow, HeadTitle })
</script>

<style scoped></style>

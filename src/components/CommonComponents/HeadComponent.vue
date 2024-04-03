<template>
  <div>
    <div style="padding: 20px; display: flex; justify-content: space-between">
      <div style="padding: 10px; background: #1b84fa; width: 5%; color: white; border-radius: 5px; display: flex; align-items: center; justify-content: center" v-if="BackShow" @click="back">
        <el-icon><ArrowLeftBold /></el-icon>
        <span style="margin-left: 5px">返回</span>
      </div>
      <div v-else></div>
      <div style="padding: 10px; background: #1b84fa; width: 5%; color: white; border-radius: 5px; text-align: center">
        <span>{{ HeadTitle }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { inject } from 'vue'
import { useRouter } from 'vue-router'

/**
 * data
 */
const router = useRouter()
/**
 * methods
 */
const back = () => {
  router.back()
}

/**
 * injects
 */
const { HeadTitle, BackShow } = inject('dataProvide')
</script>

<style scoped></style>

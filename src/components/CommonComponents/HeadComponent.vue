<template>
  <div>
    <div style="padding: 20px; display: flex; justify-content: space-between">
      <div style="padding: 10px; background: #1b84fa; width: 5%; color: white; border-radius: 5px; display: flex; align-items: center; justify-content: center" v-if="BackShow" @click="back">
        <el-icon><ArrowLeftBold /></el-icon>
        <span style="margin-left: 5px">返回</span>
      </div>
      <div v-else></div>
      <el-popover placement="top-start" title="所属环境:" :width="200" trigger="hover" :content="envContent">
        <template #reference>
          <div style="padding: 10px 15px; background: #1b84fa; color: white; border-radius: 5px; text-align: center">
            <span>{{ HeadTitle }}</span>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { BaseURL } from '../../config'

/**
 * data
 */
const router = useRouter()
const envContent = BaseURL()
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

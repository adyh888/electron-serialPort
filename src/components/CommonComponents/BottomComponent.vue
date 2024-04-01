<template>
  <div style="padding: 20px">
    <div style="display: flex; flex-direction: row-reverse">
      <el-button type="primary" style="width: 12%; font-size: 24px; height: 50px" @click="outLogin">退出登录</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { useRouter } from 'vue-router'

/**
 * data
 */
const router = useRouter()
/**
 * methods
 */
const outLogin = () => {
  router.push('/')
}
</script>

<style scoped></style>

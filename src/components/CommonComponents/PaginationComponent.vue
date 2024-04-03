<template>
  <div>
    <el-pagination background layout="prev, pager, next" :total="total" />
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { inject } from 'vue'

/**
 * injects
 */
const { total } = inject('dataProvide')
</script>

<style scoped></style>

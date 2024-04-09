<template>
  <div>
    <el-pagination background layout="prev, pager, next" :total="pagination.total" v-model:current-page="pagination.pageNum" v-model:page-size="pagination.pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
const { pagination, handleSizeChange, handleCurrentChange } = inject('dataProvide')
</script>

<style scoped></style>

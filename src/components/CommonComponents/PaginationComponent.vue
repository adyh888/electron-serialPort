<template>
  <div>
    <el-config-provider :locale="locale">
      <el-pagination background layout="total,prev, pager, next" :total="pagination.total" v-model:current-page="pagination.pageNum" v-model:page-size="pagination.pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { inject, computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
/**
 * data
 */
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
zhCn.el.pagination = {
  total: '共 {total} 条'
}

/**
 * injects
 */
const { pagination, handleSizeChange, handleCurrentChange } = inject('dataProvide')
</script>

<style scoped></style>

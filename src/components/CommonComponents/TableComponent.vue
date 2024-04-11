<template>
  <div>
    <el-table :data="tableData" border style="width: 100%" :empty-text="emptyText" :cell-style="cellStyle">
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop" :show-overflow-tooltip="true" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { inject } from 'vue'

// 根据data返回的每一行的数据判断,再修改这一行的样式
const cellStyle = data => {
  if (data.row.errorStatus) {
    return {
      background: '#e2a2ac'
    }
  }
}

/**
 * data
 */

/**
 * injects
 */
const { tableData, columns, emptyText } = inject('dataProvide')
</script>

<style scoped></style>

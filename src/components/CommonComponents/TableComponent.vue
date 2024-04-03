<template>
  <div>
    <el-table :data="tableData" border style="width: 100%" empty-text="暂无异常的指纹数据">
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

/**
 * data
 */

/**
 * injects
 */
const { tableData, columns } = inject('dataProvide')
</script>

<style scoped></style>

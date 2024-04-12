<template>
  <div>
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" :empty-text="emptyText" :cell-style="cellStyle">
      <el-table-column type="index" label="序号" width="65" align="center" />
      <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop" :show-overflow-tooltip="true" align="center">
        <template #default="scope" v-if="column.prop === 'status'">
          <el-switch v-model="scope.row.status" @change="switchChange(scope.row)" />
        </template>
        <template #default="scope" v-if="column.prop === 'setting'">
          <el-button link type="primary" size="small" @click="edit(scope.row)"
            ><el-icon><EditPen /></el-icon>编辑</el-button
          >
          <el-button link type="danger" size="small" @click="del(scope.row)"
            ><el-icon><Delete /></el-icon>删除</el-button
          >
        </template>
      </el-table-column>
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
const { tableData, columns, emptyText, tableLoading, edit, del, switchChange } = inject('dataProvide')
</script>

<style scoped></style>

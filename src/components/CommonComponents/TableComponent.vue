<template>
  <div>
    <el-table v-loading="tableLoading" :data="tableData" border max-height="500" style="width: 100%" :empty-text="emptyText" :cell-style="cellStyle">
      <el-table-column type="index" label="序号" width="65" align="center" />
      <template v-for="column in columns" :key="column.prop">
        <el-table-column v-if="column.prop === 'setting'" :label="column.label" :prop="column.prop" :show-overflow-tooltip="true" align="center" fixed="right" width="130">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)"
              ><el-icon><EditPen /></el-icon>编辑</el-button
            >
            <el-button link type="danger" size="small" @click="del(scope.row)"
              ><el-icon><Delete /></el-icon>删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column v-if="column.prop === 'tagStatus'" :prop="column.prop" :label="column.label" width="300" :filters="column.filter" :filter-method="filterTag" filter-placement="bottom-end" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.tagStatus === '已注册'" type="warning" disable-transitions>{{ scope.row.tagStatus }}</el-tag>
            <el-tag v-if="scope.row.tagStatus === '未注册'" type="danger" disable-transitions>{{ scope.row.tagStatus }}</el-tag>
            <el-tag v-if="scope.row.tagStatus === '新注册'" type="success" disable-transitions>{{ scope.row.tagStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-else :label="column.label" :prop="column.prop" :show-overflow-tooltip="true" align="center">
          <template #default="scope" v-if="column.prop === 'status'">
            <el-switch v-model="scope.row.status" @change="switchChange(scope.row)" />
          </template>
        </el-table-column>
      </template>
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
 * methods
 */
// 根据data返回的每一行的数据判断,再修改这一行的样式
const cellStyle = data => {
  if (data.row.errorStatus) {
    return {
      background: '#e2a2ac'
    }
  }
}

/**
 * injects
 */
const { tableData, columns, emptyText, tableLoading, edit, del, switchChange, filterTag } = inject('dataProvide')
</script>

<style scoped></style>

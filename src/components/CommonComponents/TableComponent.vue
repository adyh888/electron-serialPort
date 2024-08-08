<template>
  <div>
    <el-table v-loading="tableLoading" :data="tableData" border max-height="400" style="width: 100%" :empty-text="emptyText" :cell-style="cellStyle">
      <el-table-column type="index" label="序号" width="65" align="center" />
      <template v-for="column in columns" :key="column.prop">
        <el-table-column v-if="column.prop === 'setting'" :label="column.label" :prop="column.prop" :show-overflow-tooltip="true" align="center" fixed="right" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)"
              ><el-icon><EditPen /></el-icon>编辑</el-button
            >
            <!--            <el-button link type="danger" size="small" @click="del(scope.row)"-->
            <!--              ><el-icon><Delete /></el-icon>删除</el-button-->
            <!--            >-->
          </template>
        </el-table-column>
        <el-table-column v-if="column.prop === 'tagStatus'" :prop="column.prop" :label="column.label" width="300" :filters="column.filter" :filter-method="filterTag" filter-placement="bottom-end" align="center">
          <template #default="scope">
            <!--            <el-tag v-if="scope.row.tagStatus === '已注册'" type="warning" disable-transitions>{{ scope.row.tagStatus }}</el-tag>-->
            <el-tooltip placement="top">
              <template #content>{{ scope.row.error }}</template>
              <el-tag v-if="scope.row.tagStatus === '注册失败'" type="danger" disable-transitions>
                {{ scope.row.tagStatus }}
                <el-icon><WarningFilled /></el-icon
              ></el-tag>
            </el-tooltip>
            <el-tag v-if="scope.row.tagStatus === '注册成功'" type="success" disable-transitions>{{ scope.row.tagStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-else-if="column.prop === 'faceImage'" :label="column.label" :prop="column.prop" :show-overflow-tooltip="true" align="center" width="130">
          <template #default="scope">
            <el-image style="width: 50px; height: 50px" :src="`data:image/jpg;base64,${scope.row.faceImage}`" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="scope.row.srcList" :z-index="99" :initial-index="1" fit="cover" preview-teleported>
              <template #error>
                <div style="font-size: 30px; display: flex; justify-content: center; align-items: center; height: 50px">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column v-else-if="column.prop !== 'setting'" :label="column.label" :prop="column.prop" :show-overflow-tooltip="true" align="center">
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
import { Picture as IconPicture } from '@element-plus/icons-vue'
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

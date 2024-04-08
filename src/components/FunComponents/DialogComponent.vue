<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="选择检验设备(必填)" width="700" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div style="display: flex; justify-content: center; align-items: center; padding: 20px 0">
        <span style="width: 80px; font-size: 16px">设备名称:</span>
        <el-select v-model="selectValue" placeholder="请选择设备" style="width: 500px" @change="selectChangeDialog">
          <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm(1)"> 确定</el-button>
        </div>
      </template>
    </el-dialog>
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
const { dialogFormVisible, selectChangeDialog, selectValue, cities, cancel, confirm } = inject('dataProvide')
</script>

<style scoped></style>

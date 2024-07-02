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
    <el-dialog v-model="dialogFingerVisible" title="请录入指纹" width="300" align-center :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="display: flex; justify-content: center; height: 20vh; align-items: center">
        <el-progress type="dashboard" :percentage="percentage" :color="colors" :width="200" />
      </div>
    </el-dialog>
    <el-dialog v-model="dialogFaceVisible" title="批量上传人脸验证" width="600" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div style="display: flex; justify-content: center; align-items: center; padding: 20px 0">
        <span style="color: red">*</span>
        <span style="width: 80px; font-size: 16px; margin-left: 5px">设备名称:</span>
        <el-select v-model="selectValue" placeholder="请选择设备" style="width: 500px" @change="selectChangeDialog">
          <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </div>
      <el-upload class="upload-demo" drag :auto-upload="false" v-model:file-list="fileList" :limit="1">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此区域，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip" style="color: #ff0000">注意：只能上传压缩文件ZIP格式，压缩包为图片文件,无需文件夹,图片格式为jpeg/jpg,示例图片文件名使用：姓名_工号</div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定</el-button>
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
import { UploadFilled } from '@element-plus/icons-vue'
/**
 * data
 */
const colors = [
  { color: '#e6a23c', percentage: 30 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 90 },
  { color: '#6f7ad3', percentage: 100 }
]
/**
 * injects
 */
const { dialogFormVisible, selectChangeDialog, selectValue, cities, cancel, confirm, dialogFingerVisible, percentage, dialogFaceVisible, fileList } = inject('dataProvide')
</script>

<style scoped></style>

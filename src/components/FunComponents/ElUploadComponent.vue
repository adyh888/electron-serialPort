<template>
  <div>
    <el-upload class="upload-demo" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :auto-upload="false" v-model:file-list="fileList">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此区域，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip" style="color: #ff0000">注意：只能上传压缩文件ZIP格式，图片格式为jpeg/jpg</div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { UploadFilled } from '@element-plus/icons-vue'
import { provide, ref } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
/**
 * data
 */
const fileList = ref<UploadUserFile[]>([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  }
])
/**
 * provides
 */
provide('dataProvide', { fileList })
</script>

<style scoped></style>

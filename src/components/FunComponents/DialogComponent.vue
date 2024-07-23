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
    <!--    自定义弹窗-->
    <el-dialog v-model="dialogCustomVisible" :title="dialogCustomTitle" width="600" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <slot></slot>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm">{{ confirmCustomText }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    自动倒计时弹窗-->
    <el-dialog v-model="dialogAutoVisible" title="提示" width="700" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div style="">
        <span style="font-size: 16px; color: #67c23a">成功设备列表</span>
        <div style="display: flex" v-for="(item, index) in deviceListSuccess" :key="index" v-if="deviceListSuccess.length > 0">
          <div style="display: flex">
            <span>设备ID:</span>
            <span>{{ item.deviceId }}</span>
          </div>
          <div style="display: flex; margin-left: 20px">
            <span>设备IP:</span>
            <span>{{ item.deviceIp }}</span>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px; border-top: 1px dashed black">
        <span style="font-size: 16px; color: red">失败设备列表</span>
        <div style="display: flex" v-for="(item, index) in deviceListFail" :key="index" v-if="deviceListFail.length > 0">
          <div style="display: flex">
            <span>设备ID:</span>
            <span>{{ item.deviceId }}</span>
          </div>
          <div style="display: flex; margin-left: 20px">
            <span>设备IP:</span>
            <span>{{ item.deviceIp }}</span>
          </div>
          <div style="display: flex; margin-left: 20px">
            <span>错误信息:</span>
            <span>{{ item.error }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmAutoClick">{{ confirmAutoText }}({{ confirmAutoCount }})</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { inject, ref, defineExpose } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import router from '../../router'
/**
 * data
 */
const colors = [
  { color: '#e6a23c', percentage: 30 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 90 },
  { color: '#6f7ad3', percentage: 100 }
]
//自动确定弹窗
const dialogAutoVisible = ref(false)
const confirmAutoText = ref('确定')
const confirmAutoCount = ref(5)
const confirmInterval = ref<any>(null)
/**
 * methods
 */
//自动确定弹窗事件
const autoConfirm = () => {
  dialogAutoVisible.value = true
  confirmInterval.value = setInterval(() => {
    confirmAutoCount.value--
    if (confirmAutoCount.value === 0) {
      clearIntervalFun()
    }
  }, 1000)
}

//自动确定弹窗点击事件
const confirmAutoClick = () => {
  if (confirmInterval.value) {
    clearIntervalFun()
  }
}
//清除定时器
const clearIntervalFun = () => {
  clearInterval(confirmInterval.value)
  confirmInterval.value = null
  dialogAutoVisible.value = false
  setTimeout(() => {
    confirmAutoCount.value = 5
    router.back()
  }, 500)
}

/**
 * injects
 */
const { dialogFormVisible, selectChangeDialog, selectValue, cities, cancel, confirm, dialogFingerVisible, percentage, dialogFaceVisible, fileList, dialogCustomVisible, dialogCustomTitle, confirmCustomText, deviceListSuccess, deviceListFail } = inject('dataProvide')

/**
 * 导出
 */
defineExpose({
  autoConfirm
})
</script>

<style scoped></style>

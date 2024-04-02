<template>
  <div style="background: white; width: 100vw; height: 100vh">
    <el-dialog v-model="dialogFormVisible" title="选择检验设备(必填)" width="500" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div style="display: flex; justify-content: center; align-items: center">
        <span style="width: 80px; font-size: 16px">设备名称:</span>
        <el-select v-model="value" placeholder="Select" style="width: 300px">
          <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="cancel"> 确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FingerSupplier } from '../../../common/SocketFinger/index/interface/finger-conf.interface'
import { fingerClassSocket } from '../../../common/SocketFinger/FingerClassSocket'
import { useDcStore, Request } from '../../../store'
/**
 * data
 */
const router = useRouter()
const dialogFormVisible = ref(true)
const value = ref('')
const cities = [
  {
    value: 'Beijing',
    label: 'Beijing22'
  },
  {
    value: 'Shanghai',
    label: 'Shanghai'
  },
  {
    value: 'Nanjing',
    label: 'Nanjing'
  },
  {
    value: 'Chengdu',
    label: 'Chengdu'
  },
  {
    value: 'Shenzhen',
    label: 'Shenzhen'
  },
  {
    value: 'Guangzhou',
    label: 'Guangzhou'
  }
]

/**
 * methods
 */
const cancel = () => {
  router.back()
}
//获取设备列表
const getDeviceList = async () => {
  let res = await Request(useDcStore().deviceSelect, {})
  console.log(10, res)
}

//指纹测试
const fingerTest = async () => {
  let finger
  let fingerConf = {
    host: '172.16.10.40',
    port: 20108,
    switch: true,
    supplier: FingerSupplier.wx,
    deviceId: '032005005',
    serverIndex: 1
  }
  finger = new fingerClassSocket(fingerConf)
  finger.isDebugMode = true
  const res = await finger.getTotalUser()
  console.log(20, res)
}

/**
 * life
 */
onMounted(() => {
  getDeviceList()
})
</script>

<style scoped></style>

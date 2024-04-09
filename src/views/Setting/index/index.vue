<template>
  <div>
    <HeadComponent />
    <div style="display: flex; justify-content: center; align-items: center; width: 100vw">
      <div style="padding: 20px">
        <div style="display: flex; align-items: center; font-size: 1.5rem; margin: 30px 0; justify-content: center; color: white">
          <div style="display: flex">
            串口配置(
            <div style="color: #ff4757" v-if="!serialStatus">未连接</div>
            <div style="color: #3595fb" v-else>已连接</div>
            )
          </div>
        </div>
        <div class="itemStyle">
          <div style="width: 90px; color: white">串口号:</div>
          <el-select v-model="serialPortValue" :disabled="serialStatus" placeholder="请选择串口号" style="width: 300px" @visible-change="visibleChange">
            <el-option v-for="item in serialOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="itemStyle">
          <div style="width: 90px; color: white">波特率:</div>
          <el-select v-model="baudRateValue" :disabled="serialStatus" placeholder="请选择波特率" style="width: 300px">
            <el-option v-for="item in baudRateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="itemStyle">
          <div style="width: 90px; color: white">开/关:</div>
          <el-switch v-model="serialStatus" size="large" inline-prompt style="--el-switch-on-color: #3595fb; --el-switch-off-color: #ff4949" active-text="已连接" inactive-text="未连接" @change="switchChange" />
        </div>
        <el-button type="primary" round @click="writeSerialPort">测试写数据</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import { ref, onMounted, provide } from 'vue'
import { messageShow } from '../../../utils'
import { useIndexStore } from '../../../store'
import { SerialPortFinger } from '../../../common/SeialPortFinger/FingerClassSeialPort'
import { emitter2 } from '../../../utils/EventsBus'
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
const { SerialPort } = require('serialport')
/**
 * data
 */
//串口的类
const fingerSerialPortClass = new SerialPortFinger()
//选中串口的值
const serialPortValue = ref('')
//选中波特率的值
const baudRateValue = ref('')
//串口列表
const serialOptions = ref([])
//波特率列表
const baudRateOptions = ref([
  {
    value: '115200',
    label: '115200'
  },
  {
    value: '57600',
    label: '57600'
  },
  {
    value: '38400',
    label: '38400'
  },
  {
    value: '19200',
    label: '19200'
  },
  {
    value: '9600',
    label: '9600'
  },
  {
    value: '4800',
    label: '4800'
  },
  {
    value: '2400',
    label: '2400'
  },
  {
    value: '1800',
    label: '1800'
  }
])
//串口状态
const serialStatus = ref(false)
// pinia
const indexStore = useIndexStore()
const user = useIndexStore()
const HeadTitle = ref(user.userInfo.username ?? '空')
const BackShow = ref(true)
//串口类

//获取本机的串口列表
const getSerialPortList = async () => {
  let serialListRes = await fingerSerialPortClass.serialPortList()
  if (serialListRes && serialListRes.length > 0) {
    serialOptions.value = serialListRes.map(item => {
      return {
        value: item.path,
        label: item.path
      }
    })
  }
}

//切换开关
const switchChange = val => {
  if (val && serialPortValue.value && baudRateValue.value) {
    fingerSerialPortClass.init(serialPortValue.value, Number(baudRateValue.value))
  } else if (!serialPortValue.value && !baudRateValue.value) {
    serialStatus.value = false
    messageShow('请选择连接的配置参数', 'warning')
  } else {
    fingerSerialPortClass.close()
  }
}

//下拉选择框
const visibleChange = async val => {
  if (val) {
    //获取串口列表
    await getSerialPortList()
  }
}

const listenSerialPort = () => {
  emitter2.on('serialPortStatus', (data: boolean) => {
    serialStatus.value = data
  })
}

const writeSerialPort = async () => {
  // fingerSerialPortClass.write('F5090000000009F5')
  let fno = await fingerSerialPortClass.getEmptyFno()
  console.log('空槽位', fno)
}
//默认进入页面获取串口的状态
const getSerialPortStoreStatus = () => {
  serialStatus.value = indexStore.serialPortStoreStatus
}

/**
 * life
 */
onMounted(() => {
  //进入页面先获取串口的状态
  getSerialPortStoreStatus()
  //获取串口列表
  getSerialPortList()
  //监听串口状态
  listenSerialPort()
})

/**
 * provides
 */
provide('dataProvide', { HeadTitle, BackShow })
</script>

<style scoped>
.itemStyle {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
</style>

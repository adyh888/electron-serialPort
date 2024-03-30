<template>
  <div style="display: flex; justify-content: center; align-items: center; width: 100vw">
    <div style="padding: 20px">
      <div style="display: flex; align-items: center; font-size: 1.5rem; margin: 30px 0; justify-content: center">
        <div style="display: flex">
          串口配置(
          <div style="color: red" v-if="!serialStatus">未连接</div>
          <div style="color: #3595fb" v-else>已连接</div>
          )
        </div>
      </div>
      <div class="itemStyle">
        <div style="width: 80px">串口号</div>
        <el-select v-model="serialPortValue" placeholder="请选择串口号" style="width: 300px" @visible-change="visibleChange">
          <el-option v-for="item in serialOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="itemStyle">
        <div style="width: 80px">波特率</div>
        <el-select v-model="baudRateValue" placeholder="请选择波特率" style="width: 300px">
          <el-option v-for="item in baudRateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="itemStyle">
        <div style="width: 80px">开/关</div>
        <el-switch v-model="serialStatus" size="large" inline-prompt style="--el-switch-on-color: #3595fb; --el-switch-off-color: #ff4949" active-text="已连接" inactive-text="未连接" @change="switchChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import { ref, onMounted } from 'vue'
// import { serialPortList, SerialPortClass } from '../../../common/SerialPortClass'
import { messageShow } from '../../../utils'
import { useIndexStore } from '../../../store'
// import { useInitSerial } from '../../../hook/useHook'
import SerialPort from 'serialport'
/**
 * data
 */
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

// 串口
let COM = null
// 串口列表
let ports = ref([])
// 串口号
const port = ref('COM1')
// 串口配置
const option = {
  baudRate: 9600, // 波特率
  dataBits: 8, // 数据位
  parity: 'none', // 校验位
  stopBits: 1, // 停止位
  flowControl: false
}
// 串口是否打开
const open = ref(false)
// 是否是十六进制显示
let hexDisplay = false
// 是否是十六进制发送
let hexSend = false
// 消息
const msg = ref([])

//获取本机的串口列表
// const getSerialPortList = async () => {
//   let serialListRes = await serialPortList()
//   if (serialListRes) {
//     serialOptions.value = serialListRes.map(item => {
//       return {
//         value: item.path,
//         label: item.path
//       }
//     })
//   }
// }

//切换开关
// const switchChange = async val => {
//   if (val && serialPortValue.value && baudRateValue.value) {
//     await useInitSerial(serialPortValue.value, Number(baudRateValue.value))
//     serialStatus.value = indexStore.setSerialPortObj.connectStatus
//   } else {
//     serialStatus.value = false
//     indexStore.setSerialPortObj.close()
//     messageShow('请选择连接的配置参数', 'warning')
//   }
// }

//下拉选择框
// const visibleChange = val => {
//   if (val) {
//     //获取串口列表
//     getSerialPortList()
//   }
// }

// 开关串口
const handleSwitch = checked => {
  if (checked) {
    COM = new SerialPort(port.value, option, false)
    COM.on('error', function () {
      open.value = false
    })
    // 接受消息
    COM.on('readable', () => {
      let content = ''

      if (hexDisplay) {
        COM.read().map(item => {
          content += item.toString(16)
        })
      } else {
        content = COM.read().toString()
      }

      if (content === '\n') {
        return
      }
      msg.value.push({ chat: 'roboto', content })
    })
    open.value = true
  } else {
    open.value = false
    COM.close(() => {})
  }
}

/**
 * life
 */
onMounted(() => {
  // SerialPort.list().then(list => {
  //   console.log(12, list)
  // })
  //获取串口列表
  // getSerialPortList()
})
</script>

<style scoped>
.itemStyle {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
</style>

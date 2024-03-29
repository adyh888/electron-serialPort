<script setup lang="ts">
/**
 * imports
 */
import HelloWorld from './components/HelloWorld.vue'
import { SerialPort } from 'serialport'
import { ref, onMounted } from 'vue'
import { strHexBuffer } from './utils'
const serialPort = new SerialPort({ path: '/dev/tty.SLAB_USBtoUART', baudRate: 19200 }, function (err) {
  if (err) {
    console.error(err)
  }
})
/**
 * data
 */
const input = ref('')
/**
 * methods
 */
//串口初始化
const serialInit = () => {
  // serialPort.SerialPort.list().then(value => {
  //   console.log("serialPort.SerialPort.list():", value)
  // })
  // 准备发送的字节数据
  // const bytesToSend = [0xF5,0x09,0x00,0x00,0x00,0x00,0x09,0xF5]; // 示例字节数据
  // const bufferToSend = Buffer.from(bytesToSend); // 将字节数组转换为Buffer对象
  // function hexStringToUint8Array(hexString) {
  //   const byteArray = new Uint8Array(hexString.length / 2);
  //   for (let i = 0; i < hexString.length; i += 2) {
  //     byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
  //   }
  //   return byteArray;
  // }
  //
  // const hexString = 'F5090000000009F5';
  // const uint8Array = hexStringToUint8Array(hexString);
  // console.log(uint8Array);
  // const buffer = Buffer.from(uint8Array);
  // console.log(buffer);

  // const str = 'F5090000000009F5'
  // const buffer = strHexBuffer(str)
  // console.log(buffer)
  // serialPort.write(buffer, err => {
  //   if (err) {
  //     return console.log('Error on write: ', err.message)
  //   }
  //   console.log('message written')
  // })
  serialPort.on('error', function (err) {
    console.log('Error: ', err.message)
  })

  serialPort.on('data', function (data) {
    console.info('data', data)
  })
}

const sendSerial = () => {
  const buffer = strHexBuffer(input.value)
  console.log(buffer)
  serialPort.write(buffer, err => {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })
}

/**
 * life
 */
onMounted(() => {
  serialInit()
})
</script>

<template>
  <div>
    <el-input v-model="input" style="width: 240px" placeholder="Please input" />
    <el-button type="primary" @click="sendSerial">发送指令</el-button>
    <HelloWorld msg="Electron + Vite + Vue" />
  </div>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

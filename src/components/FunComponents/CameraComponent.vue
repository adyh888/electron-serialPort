<template>
  <div style="margin-top: 30px">
    <video ref="video" style="width: 500px; height: 500px; border-radius: 20px" v-if="showVideo"></video>
    <canvas ref="canvas" width="500" height="500" v-show="showCanvas"></canvas>
    <div style="display: flex; justify-content: center; margin-top: 10px">
      <div>
        <el-button type="primary" style="width: 150px; height: 40px; margin-right: 30px" @click="confirm(1)">拍照</el-button>
        <el-button type="info" style="width: 150px; height: 40px; margin-right: 30px" @click="confirm(3)">重拍</el-button>
        <el-button type="success" style="width: 150px; height: 40px" @click="confirm(2)">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { ref, defineExpose, inject } from 'vue'
import { useIndexStore } from '../../store'
import { useRouter } from 'vue-router'
import { messageShow } from '../../utils'

/**
 * data
 */
const video = ref<any>(null)
const canvas = ref<any>(null)
const showVideo = ref(true)
const showCanvas = ref(false)
const streamObj = ref<any>(null)
const context = ref<any>(null)
const router = useRouter()
const user = useIndexStore()
/**
 * methods
 */
//开启摄像头
const openCamera = () => {
  /* 可同时开启video(摄像头)和audio(麦克风) 这里只请求摄像头，所以只设置video为true */
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      /* 使用这个 stream 传递到成功回调中 */
      streamObj.value = stream
      video.value.srcObject = stream
      video.value.play()
    })
    .catch(function (err) {
      /* 处理 error 信息 */
      console.log(42, err)
      messageShow(`启动摄像头错误${err}`, 'error')
    })
}

//按钮事件
const confirm = (type: number) => {
  switch (type) {
    case 1:
      if (streamObj.value) {
        if (!context.value) {
          showVideo.value = false
          showCanvas.value = true
          context.value = canvas.value.getContext('2d')
          /* 要跟video的宽高一致 */
          context.value.drawImage(video.value, 0, 0, 1000, 500, 0, 0, 800, 400)
        } else {
          messageShow('已拍照请勿重复点击，如需重拍，请点击重拍', 'error')
        }
      } else {
        messageShow('等待本地摄像硬件启动', 'warning')
      }
      break
    case 2:
      canvas.value.toBlob(
        blob => {
          console.log('===blob', blob)
          const url = URL.createObjectURL(blob)
          const imgFile = {
            file: blob,
            src: url
          }
          // console.log(62, imgFile)
          user.imgFileObj = imgFile
          closeCamera()
          router.back()
        },
        'image/png',
        0.95
      )
      break
    case 3:
      showVideo.value = true
      showCanvas.value = false
      openCamera()
      break
  }
}

//摄像头的关闭
const closeCamera = () => {
  streamObj.value?.getTracks().forEach(track => track.stop())
}
/**
 * 导出
 */
defineExpose({
  openCamera,
  closeCamera
})

// /**
//  * injects
//  */
// const { confirm } = inject('dataProvide')
</script>

<style scoped></style>

<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <FaceUploadComponent />
    <DialogComponent />
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import HeadComponent from '../../../../components/CommonComponents/HeadComponent.vue'
import FaceUploadComponent from '../../../../components/FunComponents/FaceUploadComponent.vue'
import DialogComponent from '../../../../components/FunComponents/DialogComponent.vue'
import { ref, provide, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIndexStore } from '../../../../store'
import JSZip from 'jszip'
import { faceVerifyRequest } from '../../../../utils/request'
import { getDeviceList } from '../../../../hook/useHook'

/**
 * data
 */
const router = useRouter()
const BackShow = ref(true)
const user = useIndexStore()
const HeadTitle = ref(user.userInfo.username ?? '空')
// 弹窗内的数据
const dialogFaceVisible = ref(true)
const selectValue = ref('')
const cities = ref([])
// 选择设备的id
const selectDeviceObj = ref({})
// 上传的列表数据
const fileList = ref([])
/**
 * methods
 */
const unzipAndReadFiles = async zipFile => {
  try {
    // 创建一个JSZip实例
    const zip = new JSZip()

    // 使用JSZip加载压缩包
    const zipData = await zip.loadAsync(zipFile)

    // 获取压缩包内的文件列表
    const fileNames = Object.keys(zipData.files)

    // 遍历文件列表并获取文件内容
    for (const fileName of fileNames) {
      const file = zipData.files[fileName]
      console.log(44, file)
      console.log(`文件名：${fileName}`)
      //图片转base64
      // file
      //   .async('base64')
      //   .then(res => {
      //     // console.log(49, res)
      //     let imgBase64 = `data:image/jpeg;base64,${res}`
      //     // imageList.value.push(imgBase64)
      //   })
      //   .catch(error => {
      //     console.log(52, error)
      //   })

      // 从 ZIP 文件中获取图片文件
      const content = await file.async('blob')
      // 创建一个新的 File 对象，包含解压后的图片数据
      const fileObj = new File([content], fileName, { type: 'image/jpeg' })
      // 现在你可以处理这个 file 对象了，例如显示在页面上或上传到服务器
      console.log(68, fileObj)
      let json = {
        file: fileObj,
        serverIp: '172.16.10.40'
      }
      let faceVerifyRes = await faceVerifyRequest(json)
      console.log(75, faceVerifyRes)
    }
  } catch (error) {
    console.error('解压缩出错：', error)
  }
}

const handleFileUpload = event => {
  const file = event.target.files[0]
  if (file) {
    unzipAndReadFiles(file)
  }
}

//选中事件
const selectChangeDialog = () => {
  selectDeviceObj.value = cities.value.find(item => item.value === selectValue.value)
}
//弹窗的取消按钮事件
const cancel = () => {
  router.back()
}
//弹窗的确定按钮事件
const confirm = () => {
  console.log(104, fileList.value)
}

/**
 * life
 */
onMounted(async () => {
  //获取设备列表
  cities.value = await getDeviceList(1)
})

/**
 * provides
 */
provide('dataProvide', { BackShow, HeadTitle, dialogFaceVisible, selectValue, cities, selectChangeDialog, fileList, cancel, confirm })
</script>

<style scoped></style>

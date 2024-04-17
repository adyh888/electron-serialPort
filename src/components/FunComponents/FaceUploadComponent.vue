<template>
  <div style="height: 88vh; margin: 10px 30px; background: white; border-radius: 8px">
    <div style="padding: 20px 30px; background: white">
      <div style="letter-spacing: 2px; font-weight: 500">用户列表</div>
      <div style="border-bottom: 1px solid #d8d8d8; margin: 10px 0px"></div>
      <div style="margin: 20px 0px">
        <SearchComponent />
      </div>
      <div style="height: 54vh">
        <TableComponent />
      </div>
      <div style="display: flex; flex-direction: row-reverse; margin-top: 25px">
        <PaginationComponent />
      </div>
    </div>
    <DialogComponent />
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import SearchComponent from '../CommonComponents/SearchComponent.vue'
import TableComponent from '../CommonComponents/TableComponent.vue'
import PaginationComponent from '../CommonComponents/PaginationComponent.vue'
import DialogComponent from './DialogComponent.vue'
import { ref, provide, reactive, onMounted } from 'vue'
import JSZip from 'jszip'
import { faceVerifyRequest } from '../../utils/request'
import { ElLoadingShow, messageBoxShow } from '../../utils'
import { getDeviceList } from '../../hook/useHook'
import { useRouter } from 'vue-router'

/**
 * data
 */
//同步按钮的锁定
const syncDisabled = ref(false)
//search列表数据
const formDataList = ref([
  {
    model: 'username',
    value: '',
    type: 'input',
    label: '用户名',
    placeholder: '请输入用户名'
  },
  {
    model: 'nickname',
    value: '',
    type: 'input',
    label: '账号',
    placeholder: '请输入账号'
  }
])
//按钮的数据
const buttonData = ref([
  { buttonEvent: 3, model: 'reset' },
  { buttonEvent: 2, model: 'search' },
  { buttonEvent: 4, model: 'add' }
])
//表格数据
const tableData = ref([])
//表格规则
const columns = ref([
  { label: 'ID', prop: 'id' },
  { label: '账号', prop: 'nickname' },
  { label: '姓名', prop: 'username' },
  { label: '人脸', prop: 'faceStatus' },
  { label: '状态', prop: 'status' }
])
//表格无数据的提醒
const emptyText = ref('暂无数据')
//表格加载
const tableLoading = ref(false)
//分页器
const pagination = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
// 弹窗内的数据
const dialogFaceVisible = ref(true)
const selectValue = ref('')
const cities = ref([])
// 选择设备的id
const selectDeviceObj = ref({})
// 上传的列表数据
const fileList = ref([])
const router = useRouter()
const loading = ref<any>(null)
/**
 * methods
 */
//loading加载弹窗
const loadingShow = () => {
  loading.value = ElLoadingShow()
}
//同步下载按钮
const syncButton = type => {
  switch (type) {
    case 4:
      //add
      break
    case 2:
      //search
      break
    case 3:
      //reset
      break
  }
}

// 分页事件
const handleSizeChange = (val: number) => {}

const handleCurrentChange = async (val: number) => {
  pagination.pageNum = val
}

const unzipAndReadFiles = async zipFile => {
  loadingShow()
  try {
    // 创建一个JSZip实例
    const zip = new JSZip()
    // 使用JSZip加载压缩包
    const zipData = await zip.loadAsync(zipFile)
    // 获取压缩包内的文件列表
    const fileNames = Object.keys(zipData.files)
    //统计文件数量
    const fileCount = fileNames.length
    let resCount = 0 //返回的数据次数
    let resArr = [] //返回的总数据
    // 遍历文件列表并获取文件内容
    for (const fileName of fileNames) {
      const file = zipData.files[fileName]
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
      let json = {
        file: fileObj,
        serverIp: selectDeviceObj.value.serviceId
      }
      let faceVerifyRes = await faceVerifyRequest(json)
      if (faceVerifyRes && faceVerifyRes.status === 200) {
        resCount++
        resArr.push(faceVerifyRes.data)
      }
    }
    if (resCount === fileCount) {
      let similarArr = [] //识别的相似度低并且数据库绑定的数据的人
      resArr.forEach(item => {
        if (item.success) {
          //接口返回正常的数据
          if (item.result.doRecognizeResult.compareMap.getSimilar > 0.9 && item.result.selectFaceDataResult.length > 0) {
            item.result.selectFaceDataResult.forEach(item2 => {
              similarArr.push(item2)
            })
          }
        } else {
          //接口异常的数据
          messageBoxShow('提示', `错误,${item.result}`, 'error')
        }
      })
      if (similarArr.length === 0) {
        messageBoxShow('提示', '人脸识别成功,未找到绑定人脸数据的信息', 'success')
      } else {
        console.log(182, similarArr)
      }
    }
  } catch (error) {
    messageBoxShow('提示', `错误,${error}`, 'error')
  }
  loading.value.close()
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
  //设备名称和文件列表不为空时，上传
  if (Object.keys(selectDeviceObj.value).length > 0 && fileList.value.length > 0) {
    unzipAndReadFiles(fileList.value[0].raw)
  } else {
    messageBoxShow('提示', '请选择设备和上传文件', 'error')
  }
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
provide('dataProvide', { syncButton, syncDisabled, formDataList, buttonData, handleSizeChange, pagination, handleCurrentChange, emptyText, columns, tableLoading, tableData, dialogFaceVisible, selectValue, cities, selectChangeDialog, fileList, cancel, confirm })
</script>

<style scoped></style>

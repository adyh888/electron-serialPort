<template>
  <div style="height: 88vh; margin: 10px 30px; background: white; border-radius: 8px">
    <div style="padding: 20px 30px; background: white">
      <div style="letter-spacing: 5px; font-weight: 500; color: red">{{ headContent }}</div>
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
import { faceAddRequest, faceVerifyRequest, Request } from '../../utils/request'
import { ElLoadingShow, messageBoxShow, messageShow } from '../../utils'
import { getDeviceList } from '../../hook/useHook'
import { useRouter } from 'vue-router'
import iconv from 'iconv-lite'
import { useUcStore } from '../../store'
/**
 * data
 */
//同步按钮的锁定
const syncDisabled = ref(false)
//search列表数据
const formDataList = ref([
  {
    model: 'employeeNo',
    value: '',
    type: 'input',
    label: '工号',
    placeholder: '请输入工号'
  },
  {
    model: 'nickname',
    value: '',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    model: 'tagStatus',
    value: '',
    type: 'select',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '已注册', value: '已注册' },
      { label: '新注册', value: '新注册' },
      { label: '未注册', value: '未注册' }
    ]
  }
])
//按钮的数据
const buttonData = ref([
  { buttonEvent: 3, model: 'reset' },
  { buttonEvent: 2, model: 'search' }
])
//表格数据
const tableData = ref([])
//表格原始数据
const tableDataInit = ref([])
//表格规则
const columns = ref([
  { label: '工号', prop: 'employeeNo' },
  // { label: '账号', prop: 'nickname' },
  { label: '姓名', prop: 'nickname' },
  { label: '人脸ID', prop: 'faceId' },
  {
    label: '状态',
    prop: 'tagStatus',
    filter: [
      { text: '已注册', value: '已注册' },
      { text: '新注册', value: '新注册' },
      { text: '未注册', value: '未注册' }
    ]
  }
])
//表格无数据的提醒
const emptyText = ref('暂无数据')
//表格加载
const tableLoading = ref(false)
//分页器
const pagination = reactive<any>({
  pageNum: 1,
  pageSize: 9,
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
//绑定过人脸数据的图片 -老数据
const bindOldFaceList = ref([])
//新的人脸数据
const bindNewFaceList = ref([])
//注册失败的人脸数据
const registerFailFaceList = ref([])
const headContent = ref('')
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
    case 2:
      //search
      searchLocal()
      break
    case 3:
      //reset
      reset()
      break
  }
}

const reset = () => {
  formDataList.value.forEach(item => {
    item.value = ''
  })
  tableData.value = tableDataInit.value
}

//本地的搜索
const searchLocal = () => {
  filterData(formDataList.value)
}
//本地搜索数据的处理
const filterData = data => {
  // 用于存储筛选条件的对象
  let filterObj = {}
  // 遍历数组，如果value有值则添加到filterObj中
  data.forEach(item => {
    if (item.value !== '') {
      filterObj[item.model] = item.value
    }
  })
  // 判断filterObj是否为空，如果为空则重置数据
  if (Object.keys(filterObj).length === 0) {
    reset()
    return
  }
  //判断filterObj的key值是否为nickname和employeeNo，如果为这两个值则进行过滤
  if (filterObj.hasOwnProperty('nickname') && filterObj.hasOwnProperty('employeeNo') && filterObj.hasOwnProperty('tagStatus')) {
    // console.log(171, filterObj)
    tableData.value = tableDataInit.value.filter(item => item.tagStatus.includes(filterObj.tagStatus) && item.nickname.includes(filterObj.nickname) && item.employeeNo.includes(filterObj.employeeNo))
  } else if (filterObj.hasOwnProperty('nickname') && filterObj.hasOwnProperty('employeeNo')) {
    // console.log(172, filterObj)
    tableData.value = tableDataInit.value.filter(item => item.nickname.includes(filterObj.nickname) && item.employeeNo.includes(filterObj.employeeNo))
  } else if (filterObj.hasOwnProperty('nickname') && filterObj.hasOwnProperty('tagStatus')) {
    // console.log(173, filterObj)
    tableData.value = tableDataInit.value.filter(item => item.tagStatus.includes(filterObj.tagStatus) && item.nickname.includes(filterObj.nickname))
  } else if (filterObj.hasOwnProperty('employeeNo') && filterObj.hasOwnProperty('tagStatus')) {
    // console.log(174, filterObj)
    tableData.value = tableDataInit.value.filter(item => item.tagStatus.includes(filterObj.tagStatus) && item.employeeNo.includes(filterObj.employeeNo))
  } else {
    for (const key in filterObj) {
      tableData.value = tableDataInit.value.filter(item => item[key].includes(filterObj[key]))
    }
  }
}

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.page = 1
  pagination.limit = val
  paging()
}

const handleCurrentChange = async (val: number) => {
  pagination.pageNum = val
  paging()
}

// 本地分页-切割数据
const paging = () => {
  // 起始位置 = (当前页 - 1) x 每页的大小
  const start = (pagination.pageNum - 1) * pagination.pageSize
  // 结束位置 = 当前页 x 每页的大小
  const end = pagination.pageNum * pagination.pageSize
  tableData.value = tableDataInit.value.slice(start, end)
}

const unzipAndReadFiles = async zipFile => {
  loadingShow()
  try {
    // 创建一个JSZip实例
    const zip = new JSZip()
    // 使用JSZip加载压缩包 --解决中文乱码问题
    const zipData = await zip.loadAsync(zipFile, {
      decodeFileName: function (bytes) {
        return iconv.decode(bytes, 'gbk') // 按中文编码
      }
    })
    // 获取压缩包内的文件列表
    const fileNames = Object.keys(zipData.files)
    // 遍历文件列表并获取文件内容
    for (const fileName of fileNames) {
      const file = zipData.files[fileName]
      let str = fileName
      //分割字符串
      let name: string //提取第一个部分，即"测试100"
      let employeeNo: string //提取加号后面的部分，并去掉'.jpg'后缀
      // 使用加号(+)作为分隔符来分割字符串
      const parts = str.split('_')
      // 检查分割后的数组长度，确保至少有两个部分
      if (parts.length >= 2) {
        name = parts[0] // 提取第一个部分，即"测试100"
        employeeNo = parts[1].split('.')[0] // 提取加号后面的部分，并去掉'.jpg'后缀
      } else {
        loading.value.close()
        messageBoxShow('提示', '数据格式不正确,无法处理,请检查是否满足要求(图片请放置根目录下,图片名称请填写姓名_工号)', 'error', 3000)
        return
      }
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
      //TODO 拿工号employeeNo获取用户uid
      let userJson = {
        nickname: name,
        employeeNo: employeeNo
      }
      let userFindRes = await Request(useUcStore().userFind, userJson)
      // console.log(221,userFindRes)
      if (userFindRes && userFindRes.code === 0 && userFindRes.total > 0) {
        //代表查找的用户存在，可以找到用户的uid
        let json = {
          name: userFindRes.data[0].nickname,
          uid: userFindRes.data[0].id,
          employeeNo: userFindRes.data[0].employeeNo,
          file: fileObj,
          serverIp: selectDeviceObj.value.serviceId
        }
        let faceVerifyRes = await faceVerifyRequest(json)
        // console.log(159, faceVerifyRes)
        if (faceVerifyRes && faceVerifyRes.status === 200 && faceVerifyRes.data.success) {
          //TODO 判断此用户有没有在数据库中注册过有绑定过用户，并且识别的相似度大于0.9
          if (faceVerifyRes.data.result.doRecognizeResult.compareMap.getSimilar > 0.9 && faceVerifyRes.data.result.selectFaceDataResult.length > 0) {
            //有绑定过，但是数据库user的uid没有绑定成功，需要重新绑定
            for (const item of faceVerifyRes.data.result.selectFaceDataResult) {
              if (item.uid === null) {
                //TODO 重新绑定
                await rebind(json)
              } else {
                bindOldFaceList.value.push({ employeeNo: employeeNo, faceId: item.id, nickname: name, tagStatus: '已注册' })
              }
            }
          } else {
            //没有绑定过，需要重新注册
            await rebind(json)
          }
        } else if (faceVerifyRes && faceVerifyRes.status === 200 && !faceVerifyRes.data.success) {
          //没有绑定过，需要重新注册
          await rebind(json)
          // messageShow(`${faceVerifyRes.data.result}`, 'error')
        }
      } else if (userFindRes && userFindRes.code === 0 && userFindRes.total === 0) {
        //代表根据姓名+工号找不到此用户的信息
        registerFailFaceList.value.push({ employeeNo: employeeNo, nickname: name, tagStatus: '未注册' })
      }
    }
  } catch (error) {
    loading.value.close()
    messageBoxShow('提示', `错误,${error}`, 'error')
  }
  await tableDataFilter()
  loading.value.close()
}

//重新绑定数据库人员
const rebind = async json => {
  // 人脸注册--上传新的人脸
  let faceAddRes = await Request(faceAddRequest, json)
  // console.log(230, faceAddRes)
  if (faceAddRes && faceAddRes.status === 200 && faceAddRes.data.success) {
    //人脸绑定注册成功
    bindNewFaceList.value.push({ employeeNo: json.employeeNo, faceId: faceAddRes.data.result.id, nickname: json.name, tagStatus: '新注册' })
  } else if (faceAddRes && faceAddRes.status === 200 && !faceAddRes.data.success) {
    registerFailFaceList.value.push({ employeeNo: json.employeeNo, nickname: json.name, tagStatus: '未注册' })
  } else {
    messageBoxShow('提示', '人脸注册接口请求错误', 'error')
  }
}

//表格数据的处理
const tableDataFilter = () => {
  if (bindOldFaceList.value.length > 0 || bindNewFaceList.value.length > 0 || registerFailFaceList.value.length > 0) {
    tableDataInit.value = [...bindOldFaceList.value, ...bindNewFaceList.value, ...registerFailFaceList.value]
    tableData.value = [...bindOldFaceList.value, ...bindNewFaceList.value, ...registerFailFaceList.value]
  }
  // else if (bindOldFaceList.value.length > 0) {
  //   tableDataInit.value = bindOldFaceList.value
  //   tableData.value = bindOldFaceList.value
  // } else if (bindNewFaceList.value.length > 0) {
  //   tableDataInit.value = bindNewFaceList.value
  //   tableData.value = bindNewFaceList.value
  // } else if (registerFailFaceList.value.length > 0) {
  //   tableDataInit.value = registerFailFaceList.value
  //   tableData.value = registerFailFaceList.value
  // }
  headContent.value = `上传的人脸图片,已经注册数量是${bindOldFaceList.value.length}个,新注册的数量是${bindNewFaceList.value.length}个,未注册的数量是${registerFailFaceList.value.length}个`
  pagination.total = tableData.value.length
  dialogFaceVisible.value = false
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
  if (fileList.value.length > 0) {
    let strArr = fileList.value[0].name.split('.')
    let str = strArr[strArr.length - 1]
    if (str !== 'zip') {
      messageShow('只能上传压缩包为zip文件格式的文件', 'error')
      return
    }
  }
  //设备名称和文件列表不为空时，上传
  if (Object.keys(selectDeviceObj.value).length > 0 && fileList.value.length > 0) {
    if (selectDeviceObj.value.serviceId) {
      unzipAndReadFiles(fileList.value[0].raw)
    } else {
      messageShow('选择到对应的device设备人脸的地址为空', 'error')
    }
  } else {
    messageBoxShow('提示', '请选择设备和上传文件', 'error')
  }
}

//表格的行的某一格的数据处理
const filterTag = (value: string, row: any) => {
  return row.tagStatus === value
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
provide('dataProvide', { syncButton, syncDisabled, formDataList, buttonData, handleSizeChange, pagination, handleCurrentChange, emptyText, columns, tableLoading, tableData, dialogFaceVisible, selectValue, cities, selectChangeDialog, fileList, cancel, confirm, filterTag })
</script>

<style scoped></style>

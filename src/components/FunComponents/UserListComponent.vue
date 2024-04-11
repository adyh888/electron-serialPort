<template>
  <div style="height: 88vh; margin: 10px 30px; background: white; border-radius: 8px">
    <div style="padding: 20px 30px; background: white">
      <div style="letter-spacing: 2px; font-weight: 500">用户列表</div>
      <div style="border-bottom: 1px solid #d8d8d8; margin: 10px 0px"></div>
      <div style="margin: 20px 0px">
        <SearchComponent />
      </div>
      <div style="height: 55vh">
        <TableComponent />
      </div>
      <div style="margin-top: 20px; display: flex; flex-direction: row-reverse">
        <PaginationComponent />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import SearchComponent from '../CommonComponents/SearchComponent.vue'
import TableComponent from '../CommonComponents/TableComponent.vue'
import PaginationComponent from '../CommonComponents/PaginationComponent.vue'
import { provide, ref, onMounted, reactive } from 'vue'
import { useOrganizationPermission } from '../../hook/useHook'
import { Request } from '../../utils/request'
import { useUcStore } from '../../store'

/**
 * data
 */
const formDataList = ref([
  {
    model: 'organizationalStructure',
    value: '',
    type: 'cascader',
    label: '组织架构',
    placeholder: '请选择组织架构',
    options: []
  },
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
  },
  {
    model: 'cardNo',
    value: '',
    type: 'select',
    label: '卡号',
    placeholder: '请选择卡号',
    options: []
  },
  {
    model: 'face',
    value: '',
    type: 'select',
    label: '人脸',
    placeholder: '请选择人脸',
    options: []
  },
  {
    model: 'finger',
    value: '',
    type: 'select',
    label: '指纹',
    placeholder: '请选择指纹',
    options: []
  },
  {
    model: 'status',
    value: '',
    type: 'select',
    label: '状态',
    placeholder: '请选择状态',
    options: []
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
  { label: 'ID', prop: 'no' },
  { label: '所属公司', prop: 'id' },
  { label: '所属部门', prop: 'nickname' },
  { label: '所属班组', prop: 'username' },
  { label: '账号', prop: 'fingerprint' },
  { label: '姓名', prop: 'fingerprint' },
  { label: '工号', prop: 'fingerprint' },
  { label: '卡号', prop: 'fingerprint' },
  { label: '指纹', prop: 'fingerprint' },
  { label: '人脸', prop: 'fingerprint' },
  { label: '状态', prop: 'fingerprint' }
])
//分页器
const pagination = reactive<any>({
  pageNum: 1,
  pageSize: 15,
  total: 0
})
//同步按钮的锁定
const syncDisabled = ref(false)
const emptyText = ref('暂无数据')

/**
 * methods
 */
//同步下载按钮
const syncButton = type => {}

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.page = 1
  pagination.limit = val
}
const handleCurrentChange = (val: number) => {
  pagination.page = val
}

//请求device_user用户列表
const fingerSelect = async deviceId => {
  let fingerRes = await Request(useUcStore().fingerSelect, { deviceId })
  if (fingerRes && fingerRes.total > 0) {
    fingerCount.value = fingerRes.total
    let res = fingerRes.data.map(item => {
      return {
        no: item.no,
        id: item.id,
        deviceId: item.deviceId,
        uid: item.uid,
        fingerprint: item.fingerprint,
        nickname: item.user.nickname,
        username: item.user.username,
        errorStatus: false
      }
    })
    fingerDataLocalStorage.value = res
    localFingerData.value = res
  }
}

/**
 * life
 */
onMounted(() => {
  formDataList.value.forEach(item => {
    if (item.model === 'organizationalStructure') {
      item.options = useOrganizationPermission()
    }
  })
})

/**
 * provides
 */
provide('dataProvide', { syncButton, syncDisabled, formDataList, buttonData, tableData, handleSizeChange, pagination, handleCurrentChange, emptyText, columns })
</script>

<style scoped></style>

<template>
  <div style="height: 88vh; margin: 10px 30px; background: white; border-radius: 8px">
    <div style="padding: 20px 30px; background: white">
      <div style="letter-spacing: 2px; font-weight: 500">用户列表</div>
      <div style="border-bottom: 1px solid #d8d8d8; margin: 10px 0px"></div>
      <div style="margin: 20px 0px">
        <SearchComponent />
      </div>
      <TableComponent />
      <div style="display: flex; flex-direction: row-reverse; margin-top: 25px">
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
import { base64ToBlob, deleteUser, getDeviceList, useOrganizationParams, userGradeJson } from '../../hook/useHook'
import { Request } from '../../utils/request'
import { useIndexStore, useUcStore } from '../../store'
import { deviceType } from '../../enum'
import { useRouter } from 'vue-router'
import { messageBox, messageBoxShow } from '../../utils'

/**
 * data
 */
//selectOptions数据
const selectOptions = ref([
  {
    label: '未录入',
    value: false
  },
  {
    label: '已录入',
    value: true
  }
])
const selectOptions2 = ref([
  {
    label: '禁用',
    value: false
  },
  {
    label: '启用',
    value: true
  }
])
const router = useRouter()
const formDataList = ref([
  {
    model: 'organizationalStructure',
    value: '',
    type: 'multipleCascader',
    label: '组织架构',
    placeholder: '请选择组织架构',
    props: {
      checkStrictly: true
    },
    options: []
  },
  {
    model: 'nickname',
    value: '',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    model: 'username',
    value: '',
    type: 'input',
    label: '账号',
    placeholder: '请输入账号'
  },
  {
    model: 'employeeNo',
    value: '',
    type: 'input',
    label: '工号',
    placeholder: '请输入工号'
  },
  {
    model: 'cardNo',
    value: '',
    type: 'select',
    label: '卡号',
    placeholder: '请选择卡号',
    options: selectOptions.value
  },
  {
    model: 'face',
    value: '',
    type: 'select',
    label: '人脸',
    placeholder: '请选择人脸',
    options: selectOptions.value
  },
  {
    model: 'finger',
    value: '',
    type: 'select',
    label: '指纹',
    placeholder: '请选择指纹',
    options: selectOptions.value
  },
  {
    model: 'status',
    value: '',
    type: 'select',
    label: '状态',
    placeholder: '请选择状态',
    options: selectOptions2.value
  }
])
//按钮的数据
const buttonData = ref([
  { buttonEvent: 4, model: 'add' },
  { buttonEvent: 3, model: 'reset' },
  { buttonEvent: 2, model: 'search' }
])
//表格数据
const tableData = ref([])
//表格规则
const columns = ref([
  { label: 'ID', prop: 'id' },
  { label: '所属公司', prop: 'companyName' },
  { label: '所属部门', prop: 'departmentName' },
  { label: '所属班组', prop: 'teamName' },
  { label: '账号', prop: 'username' },
  { label: '姓名', prop: 'nickname' },
  { label: '工号', prop: 'employeeNo' },
  { label: '卡号', prop: 'cardStatus' },
  { label: '指纹', prop: 'fingerStatus' },
  { label: '人脸', prop: 'faceStatus' },
  { label: '人脸图片', prop: 'faceImage' },
  { label: '状态', prop: 'status' },
  { label: '操作', prop: 'setting' }
])
//分页器
const pagination = reactive<any>({
  pageNum: 1,
  pageSize: 9,
  total: 0
})
//同步按钮的锁定
const syncDisabled = ref(false)
const emptyText = ref('暂无数据')
const tableLoading = ref(false)
const indexStore = useIndexStore()

/**
 * methods
 */
//同步下载按钮
const syncButton = type => {
  switch (type) {
    case 4:
      //add
      router.push('/add')
      break
    case 2:
      //search
      handleSearch()
      break
    case 3:
      //reset
      formDataList.value.forEach(item => {
        item.value = ''
      })
      pagination.pageNum = 1
      handleSearch()
      break
  }
}

// 分页事件
const handleSizeChange = (val: number) => {}
const handleCurrentChange = async (val: number) => {
  pagination.pageNum = val
  tableData.value = await userSelect()
}

//请求device_user用户列表
//虚拟设备-查询设备用户列表
const deviceUserSelect = async () => {
  let deviceArr = await getDeviceList(2)
  let deviceId = ''
  deviceArr.forEach(item => {
    if (item.type === deviceType.dummy) {
      deviceId = item.value
    }
  })
  let deviceUserRes = await Request(useUcStore().deviceUserSelect, { deviceId })
  console.log(140, deviceUserRes)
}
//用户列表
const userSelect = async () => {
  let organizationRes = await useOrganizationParams()
  tableLoading.value = true
  let json: any = {
    pageSize: pagination.pageSize,
    curPageNo: pagination.pageNum
  }
  if (Object.keys(organizationRes).length > 0) {
    json = {
      ...json,
      ...organizationRes
    }
  }
  formDataList.value.forEach(item => {
    if (item.model === 'username' && item.value !== '') {
      json.username = item.value
    }
    if (item.model === 'nickname' && item.value !== '') {
      json.nickname = item.value
    }
    if (item.model === 'employeeNo' && item.value !== '') {
      json.employeeNo = item.value
    }
    if (item.model === 'cardNo' && item.value !== '') {
      if (item.value) {
        json.cardId = '!=null'
      } else {
        json.cardId = null
      }
    }
    if (item.model === 'face' && item.value !== '') {
      if (item.value) {
        json.faceId = '!=null'
      } else {
        json.faceId = null
      }
    }
    if (item.model === 'finger' && item.value !== '') {
      if (item.value) {
        json.bindFinger = true
      } else {
        json.bindFinger = false
      }
    }
    if (item.model === 'status' && item.value !== '') {
      if (item.value) {
        json.status = item.value
      } else {
        json.status = false
      }
    }
    if (item.model === 'organizationalStructure' && item.value !== '') {
      json = { ...userGradeJson(item.value) }
    }
  })
  let userRes = await Request(useUcStore().userSelect, json)
  if (userRes && userRes.total > 0) {
    pagination.total = userRes.total
    tableLoading.value = false
    return userRes.data.map(item => {
      return {
        id: item.id,
        companyName: (item.companyId && item.company?.name) ?? '空',
        companyId: item.companyId,
        departmentName: (item.departmentId && item.department?.name) ?? '空',
        departmentId: item.departmentId,
        teamName: (item.teamId && item.team?.name) ?? '空',
        teamId: item.teamId,
        groupId: item.groupId,
        groupName: (item.groupId && item.group?.name) ?? '空',
        nickname: item.nickname,
        username: item.username,
        employeeNo: item.employeeNo,
        cardId: item.cardId,
        cardStatus: item.cardId ? '已录入' : '未录入',
        fingerId: item.fingerId,
        fingerStatus: item.bindFinger ? '已录入' : '未录入',
        faceId: item.faceId,
        faceStatus: item.faceId ? '已录入' : '未录入',
        faceImage: item.faceId && item.face?.imageData ? item.face?.imageData : '',
        srcList: item.faceId && item.face?.imageData ? [base64ToBlob(item.face?.imageData).src] : [],
        faceUuid: (item.faceId && item.face && item.face.uuid) ?? '',
        password: item.password,
        phoneNo: item.phoneNo,
        status: item.status
      }
    })
  } else {
    tableLoading.value = false
  }
}

//列表的编辑按钮
const edit = (row: any) => {
  row.type = 'edit'
  delete row.srcList
  router.push({
    name: 'Add',
    state: row
  })
}

//列表的删除按钮
const del = async (row: any) => {
  const messageRes = await messageBox(`确定删除姓名${row.nickname}吗？`)
  if (messageRes) {
    let deleteUserRes = await deleteUser(row.id)
    if (deleteUserRes && deleteUserRes.code === 0) {
      messageBoxShow('提示', `姓名${row.nickname}删除成功`)
      setTimeout(() => {
        handleSearch()
      }, 500)
    }
  }
}

//search数据处理
const handleSearch = async () => {
  pagination.pageNum = 1
  tableData.value = await userSelect()
}

const switchChange = async row => {
  let json = {
    id: row.id,
    status: row.status
  }
  let registerRes = await Request(useUcStore().userModify, json)
  if (registerRes && registerRes.code === 0) {
    messageBoxShow('提示', `姓名(${row.nickname ?? '无'})状态${json.status ? '启用' : '禁用'}成功`)
  }
}

/**
 * life
 */
onMounted(async () => {
  formDataList.value.forEach(item => {
    if (item.model === 'organizationalStructure') {
      item.options = indexStore.organizationalStructureArr
    }
  })
  //用户列表
  tableData.value = await userSelect()
})

/**
 * provides
 */
provide('dataProvide', { syncButton, syncDisabled, formDataList, buttonData, tableData, handleSizeChange, pagination, handleCurrentChange, emptyText, columns, tableLoading, edit, del, switchChange })
</script>

<style scoped></style>

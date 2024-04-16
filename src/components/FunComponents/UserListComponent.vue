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
import { deleteUser, getDeviceList, useOrganizationPermission, userGradeJson } from '../../hook/useHook'
import { Request } from '../../utils/request'
import { useUcStore } from '../../store'
import { deviceType } from '../../enum'
import { useRouter } from 'vue-router'
import { messageBoxShow } from '../../utils'

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
    label: '异常',
    value: false
  },
  {
    label: '正常',
    value: true
  }
])
const router = useRouter()
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
  { buttonEvent: 3, model: 'reset' },
  { buttonEvent: 2, model: 'search' },
  { buttonEvent: 4, model: 'add' }
])
//表格数据
const tableData = ref([])
//表格规则
const columns = ref([
  { label: 'ID', prop: 'id' },
  { label: '所属公司', prop: 'companyName' },
  { label: '所属部门', prop: 'departmentName' },
  { label: '所属班组', prop: 'teamName' },
  { label: '账号', prop: 'nickname' },
  { label: '姓名', prop: 'username' },
  { label: '工号', prop: 'employeeNo' },
  { label: '卡号', prop: 'cardStatus' },
  { label: '指纹', prop: 'fingerStatus' },
  { label: '人脸', prop: 'faceStatus' },
  { label: '状态', prop: 'status' },
  { label: '操作', prop: 'setting' }
])
//分页器
const pagination = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
//同步按钮的锁定
const syncDisabled = ref(false)
const emptyText = ref('暂无数据')
const tableLoading = ref(false)

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
  tableLoading.value = true
  let json = {
    pageSize: pagination.pageSize,
    curPageNo: pagination.pageNum
  }
  formDataList.value.forEach(item => {
    if (item.model === 'username' && item.value !== '') {
      json.username = item.value
    }
    if (item.model === 'nickname' && item.value !== '') {
      json.nickname = item.value
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
  })
  let userRes = await Request(useUcStore().userSelect, { ...userGradeJson(), ...json })
  if (userRes && userRes.total > 0) {
    pagination.total = userRes.total
    tableLoading.value = false
    return userRes.data.map(item => {
      return {
        id: item.id,
        companyName: (item.companyId && item.company.name) ?? '空',
        companyId: item.companyId,
        departmentName: (item.departmentId && item.department.name) ?? '空',
        departmentId: item.departmentId,
        teamName: (item.teamId && item.team.name) ?? '空',
        teamId: item.teamId,
        groupId: item.groupId,
        groupName: (item.groupId && item.group.name) ?? '空',
        nickname: item.nickname,
        username: item.username,
        employeeNo: item.employeeNo,
        cardId: item.cardId,
        cardStatus: item.cardId ? '已录入' : '未录入',
        fingerId: item.fingerId,
        fingerStatus: item.bindFinger ? '已录入' : '未录入',
        faceId: item.faceId,
        faceStatus: item.faceId ? '已录入' : '未录入',
        faceUuid: (item.faceId && item.face && item.face.uuid) ?? '',
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
  console.log(261, row)
  router.push({
    name: 'Add',
    state: { ...row, type: 'edit' }
  })
}

//列表的删除按钮
const del = async (row: any) => {
  let deleteUserRes = await deleteUser(row.id)
  if (deleteUserRes && deleteUserRes.code === 0) {
    messageBoxShow('提示', `用户${row.username}删除成功`)
    setTimeout(() => {
      handleSearch()
    }, 500)
  }
}

//search数据处理
const handleSearch = async () => {
  tableData.value = await userSelect()
}

const switchChange = async row => {
  let json = {
    id: row.id,
    status: row.status
  }
  let registerRes = await Request(useUcStore().userUpdate, json)
  if (registerRes && registerRes.code === 0) {
    messageBoxShow('提示', `用户${row.username}状态修改成功`)
  }
}

/**
 * life
 */
onMounted(async () => {
  formDataList.value.forEach(item => {
    if (item.model === 'organizationalStructure') {
      item.options = useOrganizationPermission()
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
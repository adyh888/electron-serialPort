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
import { ref, provide, reactive } from 'vue'

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
/**
 * methods
 */
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
/**
 * provides
 */
provide('dataProvide', { syncButton, syncDisabled, formDataList, buttonData, tableData, handleSizeChange, pagination, handleCurrentChange, emptyText, columns, tableLoading })
</script>

<style scoped></style>

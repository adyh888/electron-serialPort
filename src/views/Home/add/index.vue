<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <div style="margin: 10px 20px; background: white; height: 85vh; border-radius: 10px">
      <div style="text-align: center; padding: 20px">
        <div style="font-size: 26px; font-weight: 500; margin-top: 20px">人员录入</div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px">
          <div style="width: 50%">
            <div style="display: flex; align-items: center; font-size: 22px; font-weight: 500">
              <el-icon><List /></el-icon>
              <div style="margin-left: 5px">填写用户信息:</div>
            </div>
            <div class="userStyle" v-for="item in leftData" :key="item.id">
              <div style="width: 90px; display: flex">
                <div style="color: red" v-if="item.mandatory">*</div>
                <div style="width: 90px; text-align: justify; text-align-last: justify; margin-left: 5px">{{ item.title }}</div>
                <div>:</div>
              </div>
              <el-input v-model="item.value" style="width: 350px; margin-left: 5px" :placeholder="item.placeholder" v-if="item.type === 'input'" />
              <el-select v-model="item.value" :placeholder="item.placeholder" style="width: 350px; margin-left: 5px" v-if="item.type === 'select'">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-cascader v-model="item.value" style="width: 350px; margin-left: 5px" :options="cascaderOptions" :placeholder="item.placeholder" @change="handleChange" v-if="item.type === 'cascader'" />
            </div>
          </div>
          <div style="width: 50%">
            <div style="display: flex; align-items: center; font-size: 22px; font-weight: 500">
              <el-icon><List /></el-icon>
              <div style="margin-left: 5px">填写权限信息:</div>
            </div>
            <div class="userStyle" v-for="item in rightData" :key="item.id">
              <div style="width: 80px; display: flex">
                <div style="color: red" v-if="item.mandatory">*</div>
                <div style="width: 60px; text-align: justify; text-align-last: justify; margin-left: 5px">{{ item.title }}</div>
                <div>:</div>
              </div>
              <el-input v-model="item.value" style="width: 350px; margin-left: 5px" :placeholder="item.placeholder" v-if="item.type === 'input'" />
              <CropperUploadComponent v-if="item.type === 'image'" :otherData="{ a: 100 }" :headers="{}" v-model="urlList" :multiple="false" sendUrl="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" />
              <div style="display: flex; margin-left: 20px" v-if="item.setting">
                <el-button type="primary" :icon="Edit" circle @click="editButton(item)" />
                <el-button type="danger" style="margin-left: 25px" :icon="Delete" circle @click="deleteButton(item)" />
              </div>
            </div>
          </div>
        </div>
        <el-button type="primary" style="width: 300px; margin-top: 100px; height: 60px; font-size: 22px">确认</el-button>
      </div>
    </div>
    <DialogComponent />
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import DialogComponent from '../../../components/FunComponents/DialogComponent.vue'
import CropperUploadComponent from '../../../components/CommonComponents/CropperUploadComponent.vue'
import { provide, ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIndexStore } from '../../../store'
import { Delete, Edit } from '@element-plus/icons-vue'
import { useOrganizationPermission } from '../../../hook/useHook'
/**
 * data
 */
const dialogFormVisible = ref(false)
const BackShow = ref(true)
const selectValue = ref('')
const cities = ref([])
const router = useRouter()
const user = useIndexStore()
const HeadTitle = ref(user.userInfo.username ?? '空')
const input = ref('')
const leftData = ref([
  {
    id: 1,
    title: '组织架构',
    value: '',
    placeholder: '请选择组织架构',
    mandatory: true,
    type: 'cascader'
  },
  {
    id: 2,
    title: '账号',
    value: '',
    placeholder: '请输入账号',
    mandatory: true,
    type: 'input'
  },
  {
    id: 3,
    title: '姓名',
    value: '',
    placeholder: '请输入昵称',
    mandatory: true,
    type: 'input'
  },
  {
    id: 4,
    title: '角色',
    value: '',
    placeholder: '请选择角色',
    mandatory: true,
    type: 'select'
  },
  {
    id: 5,
    title: '工号',
    value: '',
    placeholder: '请输入工号',
    mandatory: false,
    type: 'input'
  },
  {
    id: 6,
    title: '手机号',
    value: '',
    placeholder: '请输入手机号',
    mandatory: false,
    type: 'input'
  }
])
const rightData = ref([
  {
    id: 1,
    title: '密码',
    value: '',
    placeholder: '请输入密码',
    mandatory: true,
    type: 'input',
    setting: false
  },
  {
    id: 2,
    title: '卡号',
    value: '',
    placeholder: '请录入卡号',
    mandatory: false,
    setting: true,
    type: 'input'
  },

  {
    id: 3,
    title: '指纹',
    value: '',
    placeholder: '请录入指纹',
    setting: true,
    mandatory: false,
    type: 'input'
  },
  {
    id: 4,
    title: '人脸',
    value: '',
    placeholder: '请录入人脸',
    setting: false,
    mandatory: false,
    type: 'image'
  }
])
const cascaderOptions = ref([])
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]
// 裁剪的配置
const urlList = reactive([])

/**
 * methods
 */
//选中事件
const selectChangeDialog = () => {}

const cancel = () => {
  router.back()
}

//确认按钮
const confirm = type => {}

//编辑按钮
const editButton = item => {
  console.log(item)
}

//删除按钮
const deleteButton = item => {
  console.log(item)
  router.push('/setting')
}

//级联选择器
const handleChange = () => {}

/**
 * life
 */
onMounted(() => {
  cascaderOptions.value = useOrganizationPermission()
})

/**
 * provides
 */
provide('dataProvide', { dialogFormVisible, selectChangeDialog, selectValue, cities, BackShow, cancel, confirm, HeadTitle })
</script>

<style scoped>
.userStyle {
  display: flex;
  align-items: center;
  margin-top: 50px;
  font-size: 16px;
}
</style>

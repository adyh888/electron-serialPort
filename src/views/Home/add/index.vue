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
              <el-input v-model="item.value" :disabled="item.disabled" style="width: 350px; margin-left: 5px" :placeholder="item.placeholder" v-if="item.type === 'input'" />
              <el-input v-model="item.value" :disabled="item.disabled" style="width: 350px; margin-left: 5px" :placeholder="item.placeholder" type="password" show-password v-if="item.type === 'password'" />
              <CropperUploadComponent v-if="item.type === 'image'" :otherData="{ a: 100 }" :headers="{}" v-model="urlList" :multiple="false" sendUrl="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" />
              <div style="display: flex; margin-left: 20px" v-if="item.setting">
                <el-button type="primary" :icon="Edit" circle @click="editButton(item)" />
                <el-button type="danger" style="margin-left: 25px" :icon="Delete" circle @click="deleteButton(item)" />
              </div>
            </div>
          </div>
        </div>
        <el-button type="primary" style="width: 300px; margin-top: 100px; height: 60px; font-size: 22px" @click="confirmSubmit">确认</el-button>
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
import { Request, useIndexStore, useUcStore } from '../../../store'
import { Delete, Edit } from '@element-plus/icons-vue'
import { getDeviceList, getSerialPortStatus, useOrganizationPermission, userGradeJson } from '../../../hook/useHook'
import { emitter2 } from '../../../utils/EventsBus'
import { messageBoxShow } from '../../../utils'
import { showErrFinger } from '../../../common/SeialPortFinger/FingerClassSeialPort'
import { deviceType } from '../../../enum'
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
    required: true,
    type: 'cascader'
  },
  {
    id: 2,
    title: '账号',
    value: '',
    placeholder: '请输入账号',
    mandatory: true,
    required: true,
    type: 'input'
  },
  {
    id: 3,
    title: '姓名',
    value: '',
    placeholder: '请输入昵称',
    mandatory: true,
    required: true,
    type: 'input'
  },
  // {
  //   id: 4,
  //   title: '角色',
  //   value: '',
  //   placeholder: '请选择角色',
  //   mandatory: true,
  //   type: 'select'
  // },
  {
    id: 5,
    title: '工号',
    value: '',
    placeholder: '请输入工号',
    mandatory: false,
    required: false,
    type: 'input'
  },
  {
    id: 6,
    title: '手机号',
    value: '',
    placeholder: '请输入手机号',
    mandatory: false,
    required: false,
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
    disabled: false,
    required: true,
    type: 'password',
    setting: false
  },
  {
    id: 2,
    title: '卡号',
    value: '',
    placeholder: '请录入卡号',
    mandatory: false,
    disabled: true,
    required: false,
    setting: true,
    type: 'input'
  },

  {
    id: 3,
    title: '指纹',
    value: '',
    fingerprint: '',
    placeholder: '请录入指纹',
    setting: true,
    disabled: true,
    required: false,
    mandatory: false,
    type: 'input'
  }
  // {
  //   id: 4,
  //   title: '人脸',
  //   value: '',
  //   placeholder: '请录入人脸',
  //   setting: false,
  //   disabled: false,
  //   required: false,
  //   mandatory: false,
  //   type: 'image'
  // }
])
const cascaderOptions = ref([])
const options = [
  {
    value: 2,
    label: '普通用户'
  },
  {
    value: 3,
    label: '管理员'
  }
]
// 裁剪的配置
const urlList = reactive([])
//指纹进度条弹窗
const dialogFingerVisible = ref(false)
const percentage = ref(0)
let userInfoForm = reactive<any>({ ...userGradeJson(), roleIdArr: [2], roleId2Arr: [2] }) //默认普通用户权限
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
const editButton = async item => {
  console.log(item)
  switch (item.id) {
    case 3:
      await inputFinger()
      break
  }
}

//删除按钮
const deleteButton = async item => {
  console.log(item)
  switch (item.id) {
    case 3:
      let serialPortStatus = getSerialPortStatus()
      if (serialPortStatus) {
        if (rightData.value[2].value) {
          let serialPort = user.SerialPortClass
          const res = await serialPort.deleteSingle(rightData.value[2].value)
          console.log('删除指纹信息', res)
          if (res && res.result === 'ACK_SUCCESS') {
            rightData.value[2].value = ''
            rightData.value[2].fingerprint = ''
            messageBoxShow('提示', '指纹删除成功')
          }
        } else {
          messageBoxShow('提示', '无对应的指纹需要删除', 'error')
        }
      } else {
        messageBoxShow('提示', '指纹设备不在线', 'error')
        setTimeout(() => {
          router.push('/setting')
        }, 1000)
      }
      break
  }
}

//级联选择器
const handleChange = () => {}

//录入指纹
const inputFinger = async () => {
  //指纹状态
  let serialPortStatus = getSerialPortStatus()
  if (serialPortStatus) {
    messageBoxShow('提示', '请放入手指', 'warning')
    let serialPort = user.SerialPortClass
    let fno = await serialPort.getEmptyFno()
    console.log('空槽位', fno)
    dialogFingerVisible.value = true
    onFingerEvent()
    let fingerRes
    try {
      fingerRes = await serialPort.record(fno)
    } catch (e) {
      percentage.value = 0
      messageBoxShow('提示', `指纹采集失败,${showErrFinger[e]}`, 'error')
      dialogFingerVisible.value = false
    }
    if (fingerRes && fingerRes.result === '录入成功') {
      percentage.value = 100
      messageBoxShow('提示', '指纹录入成功')
      rightData.value[2].value = fno
      const fingerUser = await serialPort.uploadDspOne(fno)
      console.log('录入用户的信息', fingerUser)
      if (fingerUser && fingerUser.result === 'ACK_SUCCESS') {
        rightData.value[2].fingerprint = fingerUser.feature
      }
      setTimeout(() => {
        dialogFingerVisible.value = false
        percentage.value = 0
      }, 1000)
    }
  } else {
    await router.push('/setting')
  }
}

//录入指纹的事件监听
const onFingerEvent = () => {
  emitter2.once('record1', () => {
    percentage.value = 30
  })
  emitter2.once('record2', () => {
    percentage.value = 60
  })
  emitter2.once('record3', () => {
    percentage.value = 90
  })
}

//提交
const confirmSubmit = async () => {
  let requestData = []
  let leftFilterArr = leftData.value.filter(item => item.required && item.value !== '')
  let rightFilterArr = rightData.value.filter(item => item.required && item.value !== '')
  if (rightFilterArr.length > 0) {
    requestData = [...leftFilterArr, ...rightFilterArr]
  } else {
    requestData = leftFilterArr
  }
  if (requestData.length === 4) {
    leftData.value.forEach(item => {
      if (item.id === 2) {
        userInfoForm.nickname = item.value
      }
      if (item.id === 3) {
        userInfoForm.username = item.value
      }
      if (item.id === 5 && item.value !== '') {
        userInfoForm.cardNo = item.value
      }
      if (item.id === 6 && item.value !== '') {
        userInfoForm.phoneNo = item.value
      }
    })
    rightData.value.forEach(item => {
      if (item.id === 1) {
        userInfoForm.password = item.value
      }
      if (item.id === 3 && item.value !== '') {
        userInfoForm.fingerprint = item.fingerprint
      }
    })
    let registerRes = await Request(useUcStore().userRegister, userInfoForm)
    if (registerRes) {
      messageBoxShow('提示', '人员录入成功', 'success', 2000)
      setTimeout(() => {
        cancel()
      }, 1000)
    }
  } else {
    messageBoxShow('提示', '必须项必填,请填写完整信息', 'error')
  }
}

/**
 * life
 */
onMounted(async () => {
  cascaderOptions.value = useOrganizationPermission()
  let deviceArr = await getDeviceList(2)
  deviceArr.forEach(item => {
    if (item.type === deviceType.dummy) {
      userInfoForm = { ...userInfoForm, deviceIdArr: [item.value] }
    }
  })
})

/**
 * provides
 */
provide('dataProvide', { dialogFormVisible, selectChangeDialog, selectValue, cities, BackShow, cancel, confirm, HeadTitle, dialogFingerVisible, percentage })
</script>

<style scoped>
.userStyle {
  display: flex;
  align-items: center;
  margin-top: 50px;
  font-size: 16px;
}
</style>

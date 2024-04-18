<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <div style="margin: 10px 20px; background: white; height: 85vh; border-radius: 10px">
      <div style="text-align: center; padding: 20px">
        <div style="font-size: 26px; font-weight: 500; margin-top: 20px">{{ registerType ? '人员录入' : '人员编辑' }}</div>
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
              <el-input v-model="item.value" :disabled="item.disabled" style="width: 350px; margin-left: 5px" :placeholder="item.placeholder" type="password" :show-password="showPassword" clearable v-if="item.type === 'password'" />
              <div>
                <span v-if="item.faceStatus === '已录入'" style="color: red">人脸已经录入，重新上传将覆盖人脸</span>
                <div style="margin-top: 5px">
                  <CropperUploadComponent v-if="item.type === 'image'" v-model="urlList" :multiple="false" />
                </div>
              </div>
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
import { provide, ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Request, useIndexStore, useUcStore } from '../../../store'
import { Delete, Edit } from '@element-plus/icons-vue'
import { getDeviceList, getSerialPortStatus, getUseOrganizationPermission, useOrganizationPermission, userGradeJson } from '../../../hook/useHook'
import { emitter2 } from '../../../utils/EventsBus'
import { ElLoadingShow, imageToBuffer, messageBoxShow, messageShow } from '../../../utils'
import { SerialPortFinger, showErrFinger } from '../../../common/SeialPortFinger/FingerClassSeialPort'
import { deviceType } from '../../../enum'
import axios from 'axios'
import { faceAddRequest, faceDeleteRequest, faceVerifyRequest } from '../../../utils/request'
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
    fingerFeatureData: '',
    placeholder: '请录入指纹',
    setting: true,
    disabled: true,
    required: false,
    mandatory: false,
    type: 'input'
  },
  {
    id: 4,
    title: '人脸',
    value: '',
    placeholder: '请录入人脸',
    setting: false,
    disabled: false,
    required: false,
    mandatory: false,
    type: 'image'
  }
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
const urlList = ref([])
//指纹进度条弹窗
const dialogFingerVisible = ref(false)
const percentage = ref(0)
let userInfoForm = reactive<any>({ ...userGradeJson() }) //默认普通用户权限
//类型判断是注册还是编辑
const registerType = ref(true)
//路由传参的对象
const routerParams = ref<any>({})
//上传成功提示
const uploadSuccess = ref(false)
//是否显示上传
const uploadShow = ref(false)
const loading = ref<any>(null)
//人脸图片信息
const faceImgInfo = ref<any>({})
//请求标记位
const requestFaceIndex = ref(0)
//密码回显
const showPassword = ref(true)
//注册用户的信息
const registerUserInfo = ref<any>({})
/**
 * methods
 */

//loading加载弹窗
const loadingShow = () => {
  loading.value = ElLoadingShow()
}
//选中事件
const selectChangeDialog = () => {}

const cancel = () => {
  router.back()
}

//确认按钮
const confirm = type => {}

//编辑按钮
const editButton = async item => {
  switch (item.id) {
    case 3:
      await inputFinger()
      break
  }
}

//删除按钮
const deleteButton = async item => {
  switch (item.id) {
    case 3:
      let serialPortStatus = getSerialPortStatus()
      if (serialPortStatus) {
        if (rightData.value[2].value && rightData.value[2].value !== '已录入' && rightData.value[2].value !== '未录入') {
          let serialPort = user.SerialPortClass
          const res = await serialPort.deleteSingle(rightData.value[2].value)
          console.log('删除指纹信息', res)
          if (res && res.result === 'ACK_SUCCESS') {
            rightData.value[2].value = ''
            rightData.value[2].fingerFeatureData = ''
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
    let serialPort = user.SerialPortClass
    //删除所有指纹
    // let res2 = await serialPort.deleteAll()
    // console.log(276, res2)
    messageBoxShow('提示', '请放入手指', 'warning')
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
    console.log(290, fingerRes)
    if (fingerRes && fingerRes.result === '录入成功') {
      percentage.value = 100
      rightData.value[2].value = fno
      const fingerUser = await serialPort.uploadDspOne(fno)
      console.log('录入用户的信息', fingerUser)
      if (fingerUser && fingerUser.result === 'ACK_SUCCESS') {
        rightData.value[2].fingerFeatureData = fingerUser.feature
      }
      setTimeout(() => {
        messageShow('指纹录入成功')
        dialogFingerVisible.value = false
        percentage.value = 0
      }, 1000)
    }
  } else {
    //指纹设备不在线
    user.paramsArr = [...leftData.value, ...rightData.value]
    await router.push('/setting')
  }
}

//录入指纹的事件监听
const onFingerEvent = () => {
  emitter2.once('record1', () => {
    messageShow('请抬开手指', 'warning')
    percentage.value = 30
  })
  emitter2.once('record2', () => {
    messageShow('请抬开手指', 'warning')
    percentage.value = 60
  })
  emitter2.once('record3', () => {
    percentage.value = 90
  })
}

//提交
const confirmSubmit = async () => {
  await loadingShow()
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
      if (item.id === 3 && item.value !== '' && item.fingerFeatureData !== '') {
        userInfoForm.fingerFeatureData = item.fingerFeatureData
      }
    })
    //注册
    if (registerType.value) {
      //注册
      let registerRes = await Request(useUcStore().userRegister, { ...userInfoForm, roleIdArr: [2], roleId2Arr: [2] })
      if (registerRes) {
        registerUserInfo.value = registerRes.data
        //代表有人脸上传的图片-并且是注册人员状态
        if (urlList.value.length > 0) {
          for (const item of urlList.value) {
            await uploadFileFn(item)
          }
        }
        messageBoxShow('提示', '人员录入成功', 'success', 2000)
        setTimeout(() => {
          cancel()
        }, 1000)
      }
    } else {
      //编辑
      let updateUserRes = await Request(useUcStore().userUpdate, { ...userInfoForm, id: routerParams.value.id })
      if (updateUserRes) {
        //代表有人脸上传的图片-并且是编辑人员状态
        if (urlList.value.length > 0) {
          for (const item of urlList.value) {
            await uploadFileFn(item)
          }
        }
        messageBoxShow('提示', '人员编辑成功', 'success', 2000)
        setTimeout(() => {
          cancel()
        }, 1000)
      }
    }
  } else {
    messageBoxShow('提示', '必须项必填,请填写完整信息', 'error')
  }
  loading.value.close()
}

//图片转buffer示例
const imgToBuffer = () => {
  // 使用示例
  imageToBuffer('./public/userAdd.jpg')
    .then(buffer => {
      // 这里你可以处理转换后的Buffer
      console.log(357, buffer) // 打印Buffer
      console.log('Buffer 长度:', buffer.length)
      let data = JSON.parse(JSON.stringify(buffer))
      let json = {
        uid: 362,
        name: '刘卫伟',
        jpeg: data.data
      }
      axios({
        method: 'post',
        data: json,
        url: 'http://172.16.10.40:8274/registerJpeg'
      })
        .then(res => {
          console.log(370, res)
        })
        .catch(error => {
          console.log(372, error)
        })
    })
    .catch(error => {
      console.error('处理图片时发生错误:', error)
    })
}

//图片上传
const uploadFileFn = async (item: any) => {
  faceImgInfo.value = item
  if (user.faceRequestUrl.length > 0) {
    await faceRequestFn(user.faceRequestUrl[requestFaceIndex.value])
  } else {
    messageBoxShow('提示', '无对应的设备serverIp地址', 'error')
  }
}

//循环请求-判断人脸接口是否在线
const faceRequestFn = async url => {
  let json
  if (registerType.value) {
    //注册人员状态
    json = {
      uid: registerUserInfo.value.id,
      name: registerUserInfo.value.username,
      file: faceImgInfo.value.file,
      faceUuid: '',
      serverIp: url
    }
  } else {
    //编辑人员状态
    json = {
      uid: routerParams.value.id,
      name: routerParams.value.username,
      file: faceImgInfo.value.file,
      faceUuid: routerParams.value.faceUuid,
      serverIp: url
    }
  }
  //代表face数据库有face信息
  if (Object.keys(routerParams.value).length > 0 && routerParams.value.faceUuid !== '') {
    //1：先删除人脸数据，调用陈龙的人脸删除接口
    let faceDeleteRes = await Request(faceDeleteRequest, json)
    if (faceDeleteRes && faceDeleteRes.status === 200) {
      //2：人脸删除成功，上传新的人脸
      if (faceDeleteRes.data.success) {
        let faceAddRes = await Request(faceAddRequest, json)
        if (faceAddRes && faceAddRes.status === 200 && faceAddRes.data.success) {
          uploadSuccess.value = true
          messageBoxShow('提示', '人员人脸录入成功', 'success')
        } else if (faceAddRes && faceAddRes.status === 200 && !faceAddRes.data.success) {
          messageBoxShow('提示', `错误${faceAddRes.data.result}`, 'error')
        }
      }
    } else if (faceDeleteRes && faceDeleteRes.status === 200 && !faceDeleteRes.data.success) {
      messageBoxShow('提示', `错误${faceDeleteRes.data.result}`, 'error')
    } else {
      //请求不到接口
      requestFaceIndex.value++
      if (requestFaceIndex.value < user.faceRequestUrl.length) {
        await faceRequestFn(user.faceRequestUrl[requestFaceIndex.value])
      } else if (requestFaceIndex.value === user.faceRequestUrl.length) {
        requestFaceIndex.value = 0
        messageBoxShow('提示', '无对应的设备serverIp地址', 'error')
      }
    }
  } else {
    // 人脸对比
    // let faceVerifyRes = await faceVerifyRequest(json)
    // console.log(415, faceVerifyRes)
    // 人脸注册--上传新的人脸
    let faceAddRes = await Request(faceAddRequest, json)
    if (faceAddRes && faceAddRes.status === 200 && faceAddRes.data.success) {
      uploadSuccess.value = true
      messageBoxShow('提示', '人员人脸录入成功', 'success')
    } else if (faceAddRes && faceAddRes.status === 200 && !faceAddRes.data.success) {
      messageBoxShow('提示', `错误${faceAddRes.data.result}`, 'error')
    } else {
      //请求不到接口
      requestFaceIndex.value++
      if (requestFaceIndex.value < user.faceRequestUrl.length) {
        await faceRequestFn(user.faceRequestUrl[requestFaceIndex.value])
      } else if (requestFaceIndex.value === user.faceRequestUrl.length) {
        requestFaceIndex.value = 0
        messageBoxShow('提示', '无对应的设备serverIp地址', 'error')
      }
    }
  }
}

//请求人脸服务器的接口地址
const faceRequestGetUrl = async () => {
  //注册类型 -虚拟设备号
  let deviceArr = await getDeviceList(1)
  if (deviceArr.length > 0) {
    let deviceIpArr = []
    deviceArr.forEach(item => {
      deviceIpArr.push(item.serviceId)
    })
    user.faceRequestUrl = deviceIpArr
  }
}
/**
 * life
 */
onMounted(async () => {
  //路由传参的值
  let params = history.state
  await faceRequestGetUrl()
  if (params && params.type === 'edit') {
    showPassword.value = false
    routerParams.value = params
    registerType.value = false
    cascaderOptions.value = getUseOrganizationPermission(params)
    leftData.value.forEach(item => {
      if (item.id === 1) {
        item.value = [params.groupId, params.companyId, params.departmentId, params.teamId] as any
      }
      if (item.id === 2) {
        item.value = params.nickname
      }
      if (item.id === 3) {
        item.value = params.username
      }
      if (item.id === 5) {
        item.value = params.employeeNo
      }
      if (item.id === 6) {
        item.value = params.phoneNo
      }
    })
    rightData.value.forEach(item => {
      if (item.id === 1) {
        item.value = params.password
      }
      if (item.id === 2) {
        item.value = params.cardStatus
      }
      if (item.id === 3) {
        item.value = params.fingerStatus
      }
      if (item.id === 4) {
        item.faceStatus = params.faceStatus
      }
    })
  } else {
    //获取增加的时候的编辑数据-状态获取中-当跳转到串口页面的时候，页面的数据保存
    if (user.paramsArr && user.paramsArr.length > 0) {
      user.paramsArr.forEach(item => {
        leftData.value.forEach(item2 => {
          if (item.title === item2.title) {
            item2.value = item.value
          }
        })
        rightData.value.forEach(item2 => {
          if (item.title === item2.title) {
            item2.value = item.value
          }
        })
      })
    }
    cascaderOptions.value = useOrganizationPermission()
    //注册类型 -虚拟设备号
    let deviceArr = await getDeviceList(2)
    deviceArr.forEach(item => {
      if (item.type === deviceType.dummy) {
        userInfoForm = { ...userInfoForm, deviceIdArr: [item.value] }
      }
    })
  }
})

/**
 * provides
 */
provide('dataProvide', { dialogFormVisible, selectChangeDialog, selectValue, cities, BackShow, cancel, confirm, HeadTitle, dialogFingerVisible, percentage, uploadFileFn, uploadSuccess, uploadShow })
</script>

<style scoped>
.userStyle {
  display: flex;
  align-items: center;
  margin-top: 50px;
  font-size: 16px;
}
</style>

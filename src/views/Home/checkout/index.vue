<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <div style="height: 88vh; margin: 10px 30px; background: white; border-radius: 8px">
      <div style="padding: 20px 30px; background: white">
        <div style="color: red; letter-spacing: 4px">{{ Description }}</div>
        <div style="border-bottom: 1px solid #d8d8d8; margin: 10px 0px"></div>
        <div style="margin: 20px 0px">
          <SearchComponent />
        </div>
        <div style="height: 62vh">
          <TableComponent />
        </div>
        <div style="margin-top: 20px; display: flex; flex-direction: row-reverse">
          <PaginationComponent />
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="选择检验设备(必填)" width="700" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div style="display: flex; justify-content: center; align-items: center; padding: 20px 0">
        <span style="width: 80px; font-size: 16px">设备名称:</span>
        <el-select v-model="selectValue" placeholder="请选择设备" style="width: 500px">
          <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" title="提示" width="500">
      <div style="display: flex; font-size: 18px; margin: 15px 5px">
        <el-icon color="#1086FA"><WarningFilled /></el-icon>
        <span style="margin-left: 15px">同步下载完成，是否重新检验指纹!</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import { onMounted, onUnmounted, ref, provide, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { FingerSupplier } from '../../../common/SocketFinger/index/interface/finger-conf.interface'
import { fingerClassSocket } from '../../../common/SocketFinger/FingerClassSocket'
import { useDcStore, Request, useUcStore } from '../../../store'
import { emitterFinger } from '../../../utils/EventsBus'
import { asyncForEach, debounce, messageBoxShow, messageShow } from '../../../utils'
import { SocketUtils } from '../../../common/SocketFinger/index/socket-utils'
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import TableComponent from '../../../components/CommonComponents/TableComponent.vue'
import SearchComponent from '../../../components/CommonComponents/SearchComponent.vue'
import PaginationComponent from '../../../components/CommonComponents/PaginationComponent.vue'
import { ElLoading } from 'element-plus'
/**
 * data
 */
const router = useRouter()
//弹窗显示
const dialogFormVisible = ref(true)
const dialogVisible = ref(false)
const selectValue = ref('')
const cities = ref([])
//finger表里的指纹总数据
const fingerCount = ref(0)
//finger表里的指纹本地数据的信息数据
const fingerDataLocalStorage = ref([])
//finger指纹容器里的总数据
const fingerTotal = ref(0)
const setIntervalSocket = ref<any>(0)
//异常的finger数据
const errFingerData = ref([])
const HeadTitle = ref('Saber')
const BackShow = ref(true)
//表格数据
const tableData = ref([])
//表格规则
const columns = ref([
  { label: '指纹号', prop: 'no' },
  { label: '用户ID', prop: 'id' },
  { label: '账号', prop: 'nickname' },
  { label: '姓名', prop: 'username' },
  { label: '特征值', prop: 'fingerprint' }
])
const Description = ref('提示：以下数据，均为不匹配数据，可点击“同步”修改不匹配数据！')
const loading = ref<any>(null)
const formInline = reactive({
  username: '',
  nickname: ''
})
let finger
/**
 * methods
 */
const cancel = () => {
  router.back()
}

//loading加载弹窗
const loadingShow = () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
//确认按钮
const confirm = () => {
  loadingShow()
  selectChange()
}

//获取设备列表
const getDeviceList = async () => {
  let res = await Request(useDcStore().deviceSelect, {})
  if (res && res.data.length > 0) {
    cities.value = res.data.map(item => {
      return {
        label: item.name,
        value: item.id,
        serviceId: item.serviceId,
        fingerPort: item.fingerPort
      }
    })
  }
}

//选中事件
const selectChange = async () => {
  if (selectValue.value) {
    loadingShow()
    let selectFind = cities.value.find(item => item.value === selectValue.value)
    if (selectFind) {
      await fingerSelect(selectFind.value)
      await fingerComparison(selectFind.serviceId, selectFind.fingerPort)
    }
  }
}

//请求finger对应的指纹数据表
const fingerSelect = async deviceId => {
  let fingerRes = await Request(useUcStore().fingerSelect, { deviceId })
  console.log('指纹本地数据', fingerRes)
  if (fingerRes && fingerRes.total > 0) {
    fingerCount.value = fingerRes.total
    fingerDataLocalStorage.value = fingerRes.data
  }
}
//指纹连接并查询数据里的数据跟指纹数量是否相等
const fingerComparison = async (host, port) => {
  if (finger) {
    finger.close()
  }
  let fingerConf = {
    host,
    port,
    switch: true,
    supplier: FingerSupplier.wx,
    deviceId: '032005005',
    serverIndex: 1
  }
  //心跳包
  // socketHeartbeat(host)
  finger = new fingerClassSocket(fingerConf)
  finger.isDebugMode = true
  emitterFinger.once('connect_error', err => {
    loading.value.close()
    messageBoxShow('错误', '检验失败，请查看设备是否在线', 'error')
    return
  })
  fingerTotal.value = await finger.getTotalUser()
  await fingerAsymmetry()
  // if (fingerCount.value === fingerTotal.value.total) {
  //   messageShow('检验完成，无任何不匹配信息')
  // } else {
  //
  // }
}
//socket心跳
const socketHeartbeat = hose => {
  const socket = new SocketUtils(hose, 20108)
  setIntervalSocket.value = setInterval(() => {
    socket.client.write('heart beat', 'hex', function (err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
    })
  }, 5000)
}

//指纹的比对
const fingerAsymmetry = async () => {
  console.log('传感器', fingerTotal.value.total)
  console.log('本地指纹', fingerCount.value)
  console.log('本地指纹数据表', fingerDataLocalStorage.value)
  //检查指纹数据
  await asyncForEach(fingerDataLocalStorage.value, async item => {
    const fingerRes = await finger.uploadDspOne(item.no)
    //有指纹模块的返回数据
    if (fingerRes.fno === item.no) {
      if (fingerRes.feature.slice(0, 266) !== item.fingerprint.slice(0, 266)) {
        errFingerData.value.push({ ...item, nickname: item.user.nickname, username: item.user.username })
        tableData.value = errFingerData.value
      }
    }
  })
  loading.value.close()
  if (errFingerData.value.length > 0) {
    dialogFormVisible.value = false
  } else {
    errFingerData.value = []
    messageShow('检验完成，无任何不匹配信息')
  }

  //指纹传感器多，服务器少
  // if (fingerTotal.value.total > fingerCount.value) {
  //   asyncForEach(fingerDataLocalStorage.value, async item => {
  //     const fingerRes = await finger.uploadDspOne(item.no)
  //     if (fingerRes.fno === item.no) {
  //       if (fingerRes.feature !== item.fingerprint) {
  //         errFingerData.value.push(item)
  //       }
  //     }
  //   })
  // } else if (fingerTotal.value.total < fingerCount.value) {
  //   //指纹传感器少，服务器多
  //   asyncForEach(fingerDataLocalStorage.value, async item => {
  //     const fingerRes = await finger.uploadDspOne(item.no)
  //     if (fingerRes.fno === item.no) {
  //       if (fingerRes.feature !== item.fingerprint) {
  //         console.log('模块特征值', fingerRes.feature)
  //         console.log('本地特征值', item.fingerprint)
  //         errFingerData.value.push(item)
  //         console.log('不匹配数据', errFingerData.value)
  //         tableData.value = errFingerData.value
  //       }
  //     }
  //   })
  //
  // }
}
//指纹模块的细分处理
const abnormalDispose = () => {}

//同步下载按钮
const syncButton = () => {
  debounce(syncButtonDebounce, 700)()
}
//同步的防抖
const syncButtonDebounce = async () => {
  let uploadFingerErr = false
  //先删除所有指纹
  await finger.deleteAll()
  //上传数据库里的指纹
  await asyncForEach(fingerDataLocalStorage.value, async item => {
    //把本地数据的指纹写入到指纹模块中
    //1.先验证指纹的长度
    if (item.fingerprint.length !== 386) {
      messageBoxShow('错误', '指纹长度不正确，请重新上传', 'error')
    } else {
      //将指纹特征值保存到Dsp
      const uploadFingerRes = await finger.downloadFeatureAndSaveToDsp(item.no, item.fingerprint)
      console.log(276, uploadFingerRes)
      uploadFingerErr = true
      // if (uploadFingerRes.result !== 'ACK SUCCESS') {
      //   messageBoxShow('错误', '指纹写入失败，请重新上传', 'error')
      //   uploadFingerErr = true
      // }
    }

    // if (fingerRes.fno === item.no) {
    //   if (fingerRes.feature !== item.fingerprint) {
    //     errFingerData.value.push({ ...item, nickname: item.user.nickname, username: item.user.username })
    //     tableData.value = errFingerData.value
    //   }
    // }
    // console.log('不匹配数据2', errFingerData.value)
    // if (errFingerData.value.length > 0) {
    //   dialogFormVisible.value = false
    // } else {
    //   messageShow('检验完成，无任何不匹配信息')
    // }
  })
  //上传没有异常
  if (!uploadFingerErr) {
    dialogVisible.value = true
  } else {
    messageBoxShow('错误', '指纹写入失败，请重新上传', 'error')
  }
}

/**
 * life
 */
onMounted(() => {
  getDeviceList()
})
onUnmounted(() => {
  clearInterval(setIntervalSocket.value)
})
/**
 * provides
 */
provide('dataProvide', { HeadTitle, BackShow, tableData, columns, syncButton, formInline })
</script>

<style scoped></style>

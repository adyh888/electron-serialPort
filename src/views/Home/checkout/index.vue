<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <!--    <div style="height: 88vh; margin: 10px 30px; background: white; border-radius: 8px">-->
    <!--      <div style="padding: 20px 30px; background: white">-->
    <!--        <div style="color: red; letter-spacing: 2px; font-weight: 500">{{ Description }}</div>-->
    <!--        <div style="border-bottom: 1px solid #d8d8d8; margin: 10px 0px"></div>-->
    <!--        <div style="margin: 20px 0px">-->
    <!--          <SearchComponent />-->
    <!--        </div>-->
    <!--        <div style="height: 62vh">-->
    <!--          <TableComponent />-->
    <!--        </div>-->
    <!--        <div style="margin-top: 20px; display: flex; flex-direction: row-reverse">-->
    <!--          <PaginationComponent />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <el-dialog v-model="dialogFormVisible" title="选择检验设备(必填)" width="700" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div style="display: flex; justify-content: center; align-items: center; padding: 20px 0">
        <span style="width: 80px; font-size: 16px">设备名称:</span>
        <el-select v-model="selectValue" placeholder="请选择设备" style="width: 500px" @change="selectChangeDialog">
          <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <el-icon style="margin-left: 5px; color: green; font-size: 10px" v-if="item.status"><SuccessFilled /></el-icon>
            <el-icon style="margin-left: 5px; color: red; font-size: 10px" v-else><WarningFilled /></el-icon>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button :disabled="confirmDisabled" type="primary" @click="confirm(1)"> 确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" title="警告" width="500">
      <div style="display: flex; font-size: 18px; margin: 8px; align-items: center">
        <el-icon color="#FFCB31"><WarningFilled /></el-icon>
        <span style="margin-left: 5px">同步功能</span>
      </div>
      <div style="margin: 10px 0">
        <div>1、finger表不存在，但指纹传感器内存在槽位，是无效数据，将被删除</div>
        <div>2、finger表存在，但是指纹传感器不存在，是有效数据，将写入传感器</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="syncConfirm(2)"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import { onMounted, onUnmounted, ref, provide, reactive, UnwrapRef } from 'vue'
import { useRouter } from 'vue-router'
import { FingerSupplier } from '../../../common/SocketFinger/index/interface/finger-conf.interface'
import { fingerClassSocket } from '../../../common/SocketFinger/FingerClassSocket'
import { useDcStore, Request, useUcStore, useIndexStore } from '../../../store'
import { emitterFinger } from '../../../utils/EventsBus'
import { asyncForEach, debounce, ElLoadingShow, messageBox, messageBoxShow, messageShow } from '../../../utils'
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import TableComponent from '../../../components/CommonComponents/TableComponent.vue'
import SearchComponent from '../../../components/CommonComponents/SearchComponent.vue'
import PaginationComponent from '../../../components/CommonComponents/PaginationComponent.vue'
import { getDeviceList, getDeviceStatus, isIpv4, useGetRepeatedFno, useSetFingerData, useSetFingerNull, useSyncDownFinger } from '../../../hook/useHook'
import { TfsD400 } from '../../../common/SocketFinger/tfsd400/tfsd400'
import { funEnum, typeEnum } from '../../../common/gRPC/enum'
import { ipcRenderer } from 'electron'
import { deviceStatusEnum, grpcResult } from '../../../enum'
/**
 * data
 */
const router = useRouter()
const user = useIndexStore()
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
const HeadTitle = ref(user.userInfo.username ?? '空')
const BackShow = ref(true)
//表格数据
const tableData = ref([])
//表格规则
const columns = ref([
  { label: '槽位号', prop: 'no' },
  { label: '用户ID', prop: 'id' },
  { label: '账号', prop: 'nickname' },
  { label: '姓名', prop: 'username' },
  { label: '特征值', prop: 'fingerprint' }
])
const Description = ref('')
const loading = ref<any>(null)
//表单数据
const formDataList = ref([
  {
    model: 'nickname',
    value: '',
    type: 'input',
    label: '账号',
    placeholder: '请输入账号'
  },
  {
    model: 'username',
    value: '',
    type: 'input',
    label: '用户名',
    placeholder: '请输入用户名'
  }
])

//分页总数据
//分页器
const pagination = reactive<any>({
  pageNum: 1,
  pageSize: 15,
  total: 0
})

//指纹模块的数据
const fingerData = ref([])
//指纹模块的用户列表数据
const fingerAllUserData = ref([])
//同步按钮的锁定
const syncDisabled = ref(false)
//指纹模块多的数据
const fingerMores = ref([])
//本地指纹数据多的异常数据
const fingerLocalMores = ref([])
//指纹模块的数据跟本地对比的数据的过滤后的数据
const fingerFilter = ref([])
//获取更新到指纹模块的槽位的数据
const downloadFeatureAndSaveToDspData = ref([])
//socket心跳
const socketInterval = ref<any>(0)
//选择设备的id
const selectDeviceObj = ref({})
//loading加载弹窗状态
const loadingShowTypeStatus = ref(0)
//loading超时弹窗的定时器
// const loadingTimer = ref<any>(null)
//本地的原始数据库数据
const localFingerData = ref([])
//按钮的数据
const buttonData = ref([
  { buttonEvent: 3, model: 'reset' },
  { buttonEvent: 2, model: 'search' },
  { buttonEvent: 1, model: 'sync' }
])
const emptyText = ref('暂无异常的指纹数据')
//选择设备的确定按钮状态
const confirmDisabled = ref(false)
let finger = null
/**
 * methods
 */
const cancel = () => {
  router.back()
}

//loading加载弹窗
const loadingShow = () => {
  loading.value = ElLoadingShow()
}
//确认按钮
const confirm = type => {
  loadingShowTypeStatus.value = type
  if (!selectValue.value) {
    messageBoxShow('提示', '请选择设备', 'warning')
    return
  }
  // if (!selectDeviceObj.value.serviceId) {
  //   messageBoxShow('提示', '没有配置服务器地址,请进入后台-设备中心-设备列表-配置服务器ID', 'warning')
  //   return
  // }
  confirmEvent()
}

//选中事件
const selectChangeDialog = () => {
  selectDeviceObj.value = cities.value.find(item => item.value === selectValue.value)
  if (!selectDeviceObj.value.status) {
    confirmDisabled.value = true
    messageBoxShow('提示', `设备${selectDeviceObj.value.label}--未连接`, 'warning')
  } else {
    confirmDisabled.value = false
  }
  // if (selectDeviceObj.value.serviceId === null || selectDeviceObj.value.serviceId === '' || !isIpv4(selectDeviceObj.value.serviceId)) {
  //   confirmDisabled.value = true
  //   messageBoxShow('提示', `socket服务地址不正确[${selectDeviceObj.value.serviceId}],请进入后台-设备中心-设备列表-配置服务器ID`, 'warning')
  // } else {
  //   confirmDisabled.value = false
  // }
}

//确定事件
const confirmEvent = async () => {
  let json = {
    url: `http://${selectDeviceObj.value.serviceId}:${selectDeviceObj.value.grpcPort}`,
    deviceId: selectDeviceObj.value.value
  }
  let { fnoList } = await useGetRepeatedFno(json)
  if (fnoList.length > 0) {
    await messageBox(`数据库内重复的no-${fnoList[0]}指纹号，请删除后在重新尝试`, 'warning')
  } else {
    let messageRes = await messageBox('确认是否同步指纹表数据到指纹传感器', 'warning')
    if (messageRes) {
      loadingShow()
      //同步指纹槽位数据
      let setFingerRes = await useSetFingerData(json)
      console.log(230, setFingerRes)
      if (setFingerRes.result === grpcResult.ACK_SUCCESS) {
        loading.value?.close()
        messageShow('设备同步成功即将返回主界面')
        setTimeout(() => {
          router.back()
        }, 1500)
      }
    }
  }
}
//选中事件
const selectChange = async () => {
  if (selectValue.value) {
    loadingShow()
    selectDeviceObj.value = cities.value.find(item => item.value === selectValue.value)
    if (Object.keys(selectDeviceObj.value).length !== 0) {
      //TODO 增加如果本地数据库里有相同槽位的赋值null函数处理
      await useSetFingerNull(selectDeviceObj.value.value)
      //在查询下本地指纹数据库
      await fingerSelect(selectDeviceObj.value.value)
      //连接指纹模块
      await fingerConnect(selectDeviceObj.value.serviceId, selectDeviceObj.value.fingerPort)
      clientTimeoutEvent()
      emitterFinger.once('connect_success', async () => {
        console.log('连接成功')
        await selectFingerData(selectDeviceObj.value.value)
      })
    }
  }
}

//监听client超时事件
const clientTimeoutEvent = () => {
  emitterFinger.once('connect_timeout', timeoutEvent)
}
//去除client超时事件
const clientTimeoutEventRemove = () => {
  emitterFinger.removeListener('connect_timeout', timeoutEvent)
}

//指纹模块的数据跟本地对比的数据的过滤后的数据重新查询对比
const selectFingerData = async deviceId => {
  //把本地的指纹数据更新no槽位为null的数据
  // await syncDownload()
  await fingerSelect(deviceId)
  await fingerComparison()
}

//请求finger对应的指纹数据表
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
        nickname: item.user?.nickname,
        username: item.user?.username,
        errorStatus: false
      }
    })
    fingerDataLocalStorage.value = res
    localFingerData.value = res
  }
}

//连接指纹模块类
const fingerConnect = async (host, port) => {
  finger = null
  let fingerConf = {
    host,
    port,
    switch: true,
    supplier: FingerSupplier.wx,
    deviceId: '032005005',
    serverIndex: 1
  }
  finger = new TfsD400(fingerConf)
  finger.isDebugMode = true
  emitterFinger.once('connect_error', err => {
    loading.value.close()
    messageBoxShow('错误', '检验失败，请查看设备是否在线', 'error')
    emitterFinger.emit('close')
    finger = null
    return
  })
}

//指纹连接并查询数据里的数据跟指纹数量是否相等
const fingerComparison = async () => {
  let fingerAllUser = await finger.getRegAllUserInfo()
  if (fingerAllUser.result === 'ACK_SUCCESS') {
    fingerTotal.value = fingerAllUser.total
    fingerAllUserData.value = fingerAllUser.data
  }
  console.log('传感器', fingerTotal.value)
  console.log('本地指纹', fingerCount.value)
  console.log('传感器指纹数据', fingerAllUser)
  console.log('本地指纹数据表', fingerDataLocalStorage.value)
  fingerData.value = [] //指纹模块的数据恢复默认值
  await abnormalDispose()
}

//将本地数据库的槽位为no的数据先写进指纹模块中-并且本地的数据库中特征值不为空
const syncDownload = async () => {
  if (fingerDataLocalStorage.value.length > 0) {
    //过滤本地数据，只获取指纹槽位为空的-并且本地的指纹特征值不为空的
    let fingerLocalNoFilter = fingerDataLocalStorage.value.filter(item => item.no === null)
    let fingerLocalFingerprintFilter = fingerDataLocalStorage.value.filter(item => item.fingerprint === null)
    if (fingerLocalFingerprintFilter.length > 0) {
      messageBoxShow('错误', '本地存在异常的数据,特征值为空', 'error')
      loading.value.close()
      dialogVisible.value = false
      return
    }
    // console.log(253, fingerLocalNoFilter)
    //筛选本地指纹槽位为空的数据，并且特征值不为空
    if (fingerLocalNoFilter.length > 0) {
      // let fingerLocalNoFilterCount = 0
      // let downloadFeatureAndSaveToDspData = []
      await asyncForEach(fingerLocalNoFilter, async item => {
        console.log(310, item.fingerprint)
        const res = await finger.downloadFeatureAndCompareOneToMore(item.fingerprint)
        console.log(312, res)
        if (res.result === 'ACK_NOUSER' || res.result === 'ACK_SUCCESS') {
          //如果不存在就下载 到最小的空槽位
          const downloadRes = await finger.downloadFeatureAndSaveToDsp(await finger.getEmptyFno(), item.fingerprint)
          console.log(427, downloadRes)
          //TODO 单个更新本地数据库
          if (downloadRes.result === 'ACK_SUCCESS') {
            await Request(useUcStore().fingerUpdate, { id: item.id, no: downloadRes.total, deviceId: selectDeviceObj.value.value })
          }
          //TODO 一起更新到本地数据库（all）
          // if (downloadRes.result === 'ACK_SUCCESS') {
          //   fingerLocalNoFilterCount++
          //   downloadFeatureAndSaveToDspData.push({ ...downloadRes, fingerprint: item.fingerprint }) //TODO 获取空槽位对应的指纹槽位值
          // }
        }
      })
      //TODO 更新本地数据库(all)
      // if (fingerLocalNoFilterCount === fingerLocalNoFilter.length) {
      //   console.log(277, downloadFeatureAndSaveToDspData)
      //   let updateRequestRes = false
      //   //把下载的指纹槽位更新到本地数据库中
      //   fingerLocalNoFilter.forEach(item => {
      //     downloadFeatureAndSaveToDspData.forEach(item2 => {
      //       if (item.fingerprint.slice(0, 240) === item2.fingerprint.slice(0, 240)) {
      //         item.no = item2.total
      //       }
      //     })
      //   })
      //   console.log('槽位空的数据', fingerLocalNoFilter)
      //   //将数据更新到本地数据库
      //   await asyncForEach(fingerLocalNoFilter, async item => {
      //     let fingerUpdateRes = await Request(useUcStore().fingerUpdate, { id: item.id, no: item.no, deviceId: selectDeviceObj.value.value })
      //     if (fingerUpdateRes) {
      //       updateRequestRes = true
      //     }
      //   })
      //   if (updateRequestRes) {
      //     fingerFilter.value = []
      //     downloadFeatureAndSaveToDspData = []
      //     // loading.value.close()
      //     // dialogVisible.value = false
      //   }
      // } else {
      //   messageBoxShow('错误', '指纹写入失败，请重新同步', 'error')
      //   loading.value.close()
      //   dialogVisible.value = false
      // }
    }
  }
}

//指纹模块的细分处理-逻辑处理
const abnormalDispose = async () => {
  //先获取指纹模块里所有的用户信息包括特征值
  if (fingerAllUserData.value.length > 0) {
    await asyncForEach(fingerAllUserData.value, async item => {
      const fingerRes = await finger.uploadDspOne(item.fno)
      fingerData.value.push(fingerRes)
    })
  }
  console.log('指纹传感器的数据', fingerData.value)
  //指纹模块的数量多，本地finger表的数据少
  if (fingerTotal.value > fingerCount.value) {
    let fingerRes = fingerData.value.filter(obj1 => !fingerDataLocalStorage.value.some(obj2 => obj1.fno === obj2.no))
    if (fingerRes.length > 0) {
      fingerMores.value = fingerRes.map(item => {
        return {
          no: item.fno,
          fingerprint: item.feature,
          errorStatus: true
        }
      })
    }
    console.log('指纹模块数据多', fingerMores.value)
    tableList()
  } else if (fingerTotal.value < fingerCount.value) {
    //指纹模块的数量少，本地finger表的数据多
    fingerLocalMores.value = fingerDataLocalStorage.value.filter(item => !fingerData.value.some(item1 => item1.fno === item.no))
    if (fingerLocalMores.value.length > 0) {
      fingerLocalMores.value.forEach(item => (item.errorStatus = true))
    }
    console.log('本地多出来的指纹数据', fingerLocalMores.value)
    tableList()
  } else if (fingerTotal.value === fingerCount.value) {
    //指纹模块数量和本地的finer表的数据相等---指纹模块的数据和本地数据对比
    fingerFilter.value = fingerData.value.filter(obj1 => !fingerDataLocalStorage.value.some(obj2 => obj1.feature.slice(0, 220) === obj2.fingerprint.slice(0, 220) && obj1.fno === obj2.no))
    console.log('指纹模块数据和本地数据对比', fingerFilter.value)
    tableList()
  }
  showViewData()
}
//列表数据
const tableList = () => {
  //指纹模块的数量多，本地finger表的数据少
  if (fingerMores.value.length > 0) {
    // messageBoxShow('异常', '指纹模块与本地服务器数据不正确', 'error')
    // Description.value = `提示：指纹表数据${fingerCount.value}条，指纹传感器数据${fingerTotal.value}条，当前有${fingerMores.value.length}条不匹配，可点击“同步下载”修改不匹配数据！`
    // syncDisabled.value = false
    fingerDataLocalStorage.value.unshift(...fingerMores.value)
    console.log('本地拼接的数据', fingerDataLocalStorage.value)
  } else if (fingerLocalMores.value.length > 0) {
    //指纹模块的数量少，本地finger表的数据多
    // messageBoxShow('异常', '指纹模块与本地服务器数据不正确', 'error')
    // Description.value = `提示：指纹表数据${fingerCount.value}条，指纹传感器数据${fingerTotal.value}条，当前有${fingerLocalMores.value.length}条不匹配，可点击“同步下载”修改不匹配数据！`
    // syncDisabled.value = false
    let fingerLocalRes: UnwrapRef<any> = fingerDataLocalStorage.value.filter(item => !fingerLocalMores.value.some(item1 => item1.no === item.no))
    fingerLocalRes.unshift(...fingerLocalMores.value)
    fingerDataLocalStorage.value = fingerLocalRes
  } else if (fingerFilter.value.length > 0) {
    //本地数据跟指纹模块数据相等，但是没有槽位或者特征值不对等
    // messageBoxShow('异常', '指纹模块与本地服务器数据不正确', 'error')
    // Description.value = `提示：指纹表数据${fingerCount.value}条，指纹传感器数据${fingerTotal.value}条，当前有${fingerFilter.value.length}条不匹配，可点击“同步下载”修改不匹配数据！`
    // syncDisabled.value = false
    fingerDataLocalStorage.value.forEach(item => {
      fingerFilter.value.forEach(item1 => {
        if (item.no === item1.fno || item.fingerprint.slice(0, 220) === item1.feature.slice(0, 220)) {
          item.errorStatus = true
        }
      })
    })
  }
  // else {
  //   syncDisabled.value = true
  //   messageBoxShow('提示', '指纹模块与本地服务器数据正常')
  //   Description.value = '以下数据，跟指纹模块同步，无需同步'
  // }
  // tableData.value = fingerDataLocalStorage.value
  if (loadingShowTypeStatus.value === 1) {
    clientTimeoutEventRemove()
    loading.value.close()
    dialogFormVisible.value = false
  }
}

//界面显示的数据处理
const showViewData = () => {
  if (fingerData.value.length > 0 && localFingerData.value.length > 0) {
    let comparisonRes = []
    //传感器大于本地的数量
    if (fingerData.value.length > localFingerData.value.length || fingerData.value.length === localFingerData.value.length) {
      comparisonRes = fingerData.value.filter(item => !localFingerData.value.some(item1 => item.fno === item1.no && item.feature.slice(0, 220) === item1.fingerprint.slice(0, 220)))
      console.log(453, comparisonRes)
      localFingerData.value.forEach(item => {
        comparisonRes.forEach(item1 => {
          if (item.no === item1.fno) {
            item.errorStatus = true
          }
        })
      })
    } else if (fingerData.value.length < localFingerData.value.length) {
      //传感器小于本地的数量
      comparisonRes = localFingerData.value.filter(item => !fingerData.value.some(item1 => item1.fno === item.no && item1.feature.slice(0, 220) === item.fingerprint.slice(0, 220)))
      console.log(464, comparisonRes)
      localFingerData.value.forEach(item => {
        comparisonRes.forEach(item1 => {
          if (item.no === item1.no) {
            item.errorStatus = true
          }
        })
      })
    }
    if (comparisonRes.length > 0 && loadingShowTypeStatus.value === 1) {
      messageBoxShow('异常', '指纹模块与本地服务器数据不正确', 'error')
      Description.value = `提示：指纹表数据${fingerCount.value}条，指纹传感器数据${fingerTotal.value}条，当前有${comparisonRes.length}条不匹配，可点击“同步”修改不匹配数据！`
      syncDisabled.value = false
    } else {
      console.log(476)
      syncDisabled.value = true
      messageBoxShow('提示', '指纹模块与本地服务器数据正常')
      Description.value = '以下数据，跟指纹模块同步，无需同步'
      //把localFingerData.value中no按照数据从小到大排序
      localFingerData.value = localFingerData.value.sort((a, b) => a.no - b.no)
    }
    getList()
    console.log(481, localFingerData.value)
    tableData.value = localFingerData.value
  }
}

//同步功能逻辑
const syncConfirm = type => {
  loadingShowTypeStatus.value = type
  loadingShow()
  // loadingTimer.value = setTimeout(() => {
  //   messageBoxShow('提示', '连接超时,请检查指纹设备', 'error')
  //   loading.value?.close()
  // }, 12000)
  debounce(syncButtonEvent, 500)()
  // clearTimeout(loadingTimer.value)
}

//同步下载按钮
const syncButton = type => {
  switch (type) {
    case 1:
      dialogVisible.value = true
      break
    case 2:
      searchLocal()
      break
    case 3:
      formDataList.value.forEach(item => {
        item.value = ''
      })
      tableData.value = localFingerData.value
      break
  }
}
//同步的防抖
const syncButtonDebounce = async () => {
  //指纹模块的数量多，本地finger表的数据少
  if (fingerMores.value.length > 0) {
    let deleteStatus = true
    let deleteResCount = 0
    //删除指纹表里对应的槽位数据
    // console.log(406, fingerMores.value)
    await asyncForEach(fingerMores.value, async item => {
      // console.log(408, item.no)
      const deleteRes = await finger.deleteSingle(item.no)
      console.log(433, deleteRes)
      if (deleteRes.result === 'ACK_SUCCESS') {
        deleteResCount++
        if (deleteResCount === fingerMores.value.length) deleteStatus = false
      }
    })
    if (deleteStatus) {
      messageBoxShow('错误', '指纹模块数据删除失败，请重新同步', 'error')
      loading.value.close()
    } else {
      fingerMores.value = []
      await selectFingerData(selectDeviceObj.value.value)
      await syncButtonDebounce()
    }
    dialogVisible.value = false
  } else if (fingerLocalMores.value.length > 0) {
    //指纹模块的数量少，本地finger表的数据多
    let addFingerStatus = true
    let addFingerResCount = 0
    //增加超时时间，防止指纹模块写入失败
    let timeout = setTimeout(() => {
      messageBoxShow('提示', '指纹模块失败,请检查指纹设备', 'error')
      loading.value?.close()
    }, 12000)
    await asyncForEach(fingerLocalMores.value, async item => {
      console.log(387, item.no, item.fingerprint)
      const addFingerRes = await finger.downloadFeatureAndSaveToDsp(item.no, item.fingerprint)
      // console.log(389, addFingerRes)
      clearTimeout(timeout)
      if (addFingerRes.result === 'ACK_SUCCESS') {
        addFingerResCount++
        if (addFingerResCount === fingerLocalMores.value.length) addFingerStatus = false
      }
    })
    if (addFingerStatus) {
      messageBoxShow('错误', '同步上传指纹失败，请重新同步', 'error')
      loading.value.close()
    } else {
      fingerLocalMores.value = []
      await selectFingerData(selectDeviceObj.value.value)
      await syncButtonDebounce()
    }
    dialogVisible.value = false
  } else if (fingerFilter.value.length > 0) {
    let deleteStatus = true
    let deleteResCount = 0
    //本地数据跟指纹模块数据相等，但是没有槽位或者特征值不对等
    await asyncForEach(fingerFilter.value, async item => {
      // console.log(356, item.fno)
      //删除指纹模块槽位数据
      const deleteRes = await finger.deleteSingle(item.fno)
      if (deleteRes.result === 'ACK_SUCCESS') {
        deleteResCount++
        if (deleteResCount === fingerFilter.value.length) deleteStatus = false
      }
    })
    if (deleteStatus) {
      messageBoxShow('错误', '指纹模块数据删除失败，请重新同步', 'error')
      dialogVisible.value = false
      loading.value.close()
    } else {
      //删除指纹对应的槽位指纹-成功
      //先对比Dsp是否已经存在，如果不存在下载到空余的最小槽位
      let awaitDspStatus = false
      await asyncForEach(fingerDataLocalStorage.value, async item => {
        const res = await finger.downloadFeatureAndCompareOneToMore(item.fingerprint)
        if (res.result === 'ACK_NOUSER') {
          //如果不存在就下载 到最小的空槽位
          const downloadRes = await finger.downloadFeatureAndSaveToDsp(await finger.getEmptyFno(), item.fingerprint)
          // console.log(429, downloadRes)
          if (downloadRes.result !== 'ACK_SUCCESS') {
            awaitDspStatus = true
          } else {
            awaitDspStatus = false
            downloadFeatureAndSaveToDspData.value.push({ ...downloadRes, fingerprint: item.fingerprint }) //TODO 获取空槽位对应的指纹槽位值
          }
          // console.log(436, downloadFeatureAndSaveToDspData.value)
        }
      })
      if (awaitDspStatus) {
        messageBoxShow('错误', '指纹写入失败，请重新同步', 'error')
        dialogVisible.value = false
      } else {
        let updateRequestRes = false
        //把下载的指纹槽位更新到本地数据库中
        fingerDataLocalStorage.value.forEach(item => {
          downloadFeatureAndSaveToDspData.value.forEach(item2 => {
            if (item.fingerprint.slice(0, 220) === item2.fingerprint.slice(0, 220)) {
              item.no = item2.total
            }
          })
        })
        //将数据更新到本地数据库
        await asyncForEach(fingerDataLocalStorage.value, async item => {
          let fingerUpdateRes = await Request(useUcStore().fingerUpdate, { id: item.id, no: item.no })
          if (fingerUpdateRes) {
            updateRequestRes = true
          }
        })
        if (updateRequestRes) {
          fingerFilter.value = []
          downloadFeatureAndSaveToDspData.value = []
          await selectFingerData(selectDeviceObj.value.value)
          await syncButtonDebounce()
        }
      }
    }
  } else {
    loading.value.close()
    dialogFormVisible.value = false
    dialogVisible.value = false
    loadingShowTypeStatus.value = 0
  }
}

//同步下载
const syncButtonEvent = async () => {
  //client 超时事件设定
  emitterFinger.emit('clientSetTimeout', 15000)
  clientTimeoutEvent()
  await useSyncDownFinger(tableData.value, finger, fingerData.value)
  clientTimeoutEventRemove()
}

//本地的搜索
const searchLocal = () => {
  filterData(formDataList.value)
}

//过滤筛选数据
const filterData = data => {
  for (const dataItem of data) {
    localFingerData.value.forEach(item => {
      if (item.username === undefined) {
        item.username = ''
      }
      if (item.nickname === undefined) {
        item.nickname = ''
      }
    })
    if (dataItem.model === 'username' && dataItem.value !== '' && dataItem.model === 'nickname' && dataItem.value !== '') {
      tableData.value = localFingerData.value.filter(item => item.username.includes(dataItem.value) && item.nickname.includes(dataItem.value))
    } else if (dataItem.model === 'username' && dataItem.value !== '') {
      tableData.value = localFingerData.value.filter(item => item.username.includes(dataItem.value))
    } else if (dataItem.model === 'nickname' && dataItem.value !== '') {
      tableData.value = localFingerData.value.filter(item => item.nickname.includes(dataItem.value))
    }
  }
}

// 本地分页-切割数据
const paging = () => {
  // 起始位置 = (当前页 - 1) x 每页的大小
  const start = (pagination.pageNum - 1) * pagination.pageSize
  // 结束位置 = 当前页 x 每页的大小
  const end = pagination.pageNum * pagination.pageSize
  tableData.value = localFingerData.value.slice(start, end)
}

// 获取列表数据
const getList = async () => {
  pagination.total = localFingerData.value.length
  paging()
}

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.page = 1
  pagination.limit = val
  getList()
}
const handleCurrentChange = (val: number) => {
  pagination.page = val
  getList()
}

const timeoutEvent = () => {
  messageBoxShow('提示', '指纹效验失败，超时指令未返回,请查看控制台信息', 'error')
  loading.value?.close()
  emitterFinger.emit('close')
}

/**
 * life
 */
onMounted(async () => {
  //获取设备状态
  let { data } = await getDeviceStatus()
  //获取设备列表
  let deviceArr = await getDeviceList(1)
  if (data.length > 0) {
    // 遍历deviceStatusArr
    data.forEach(deviceStatus => {
      // 查找deviceArr中匹配的deviceId
      let device = deviceArr.find(device => device.value === deviceStatus.deviceId)
      // 如果找到了匹配的设备，并且deviceStatus的status是'online'
      if (device && deviceStatus.status === deviceStatusEnum.online) {
        // 更新deviceArr中对应设备的status为true
        device.status = true
      }
    })
  }
  cities.value = deviceArr
})
onUnmounted(() => {
  emitterFinger.emit('close')
  finger = null
  clearInterval(socketInterval.value)
  socketInterval.value = null
})
/**
 * provides
 */
provide('dataProvide', { HeadTitle, BackShow, tableData, columns, syncButton, pagination, syncDisabled, handleSizeChange, handleCurrentChange, formDataList, buttonData, emptyText })
</script>

<style scoped></style>

<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <div style="height: 88vh; margin: 10px 30px; background: white; border-radius: 8px">
      <div style="padding: 20px 30px; background: white">
        <div style="color: red; letter-spacing: 2px; font-weight: 500">{{ Description }}</div>
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
          <el-button type="primary" @click="syncConfirm"> 确定 </el-button>
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
import { useDcStore, Request, useUcStore } from '../../../store'
import { emitterFinger } from '../../../utils/EventsBus'
import { asyncForEach, debounce, ElLoadingShow, messageBoxShow, messageShow } from '../../../utils'
import { SocketUtils } from '../../../common/SocketFinger/index/socket-utils'
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import TableComponent from '../../../components/CommonComponents/TableComponent.vue'
import SearchComponent from '../../../components/CommonComponents/SearchComponent.vue'
import PaginationComponent from '../../../components/CommonComponents/PaginationComponent.vue'
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
const HeadTitle = ref('Saber')
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
const formInline = reactive({
  username: '',
  nickname: ''
})
//分页总数据
const total = ref(0)
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
  if (fingerRes && fingerRes.total > 0) {
    fingerCount.value = fingerRes.total
    fingerDataLocalStorage.value = fingerRes.data.map(item => {
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
  }
}
//指纹连接并查询数据里的数据跟指纹数量是否相等
const fingerComparison = async (host, port) => {
  console.log('实例finger')
  if (finger) {
    finger.close()
    finger = null
  }
  let fingerConf = {
    host,
    port,
    switch: true,
    supplier: FingerSupplier.wx,
    deviceId: '032005005',
    serverIndex: 1
  }
  finger = new fingerClassSocket(fingerConf)
  finger.isDebugMode = true
  emitterFinger.once('connect_error', err => {
    loading.value.close()
    messageBoxShow('错误', '检验失败，请查看设备是否在线', 'error')
    return
  })
  let fingerAllUser = await finger.getRegAllUserInfo()
  // console.log(188, fingerAllUser)
  if (fingerAllUser.result === 'ACK_SUCCESS') {
    fingerTotal.value = fingerAllUser.total
    fingerAllUserData.value = fingerAllUser.data
  }
  console.log('传感器', fingerTotal.value)
  console.log('本地指纹', fingerCount.value)
  console.log('本地指纹数据表', fingerDataLocalStorage.value)
  fingerData.value = [] //指纹模块的数据恢复默认值
  await abnormalDispose()
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
  // console.log(280, fingerData.value)
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
    tableList()
    console.log('指纹模块数据多', fingerMores.value)
  } else if (fingerTotal.value < fingerCount.value) {
    //指纹模块的数量少，本地finger表的数据多
    fingerLocalMores.value = fingerDataLocalStorage.value.filter(item => !fingerData.value.some(item1 => item1.fno === item.no))
    if (fingerLocalMores.value.length > 0) {
      fingerLocalMores.value.forEach(item => (item.errorStatus = true))
    }
    console.log('本地多出来的指纹数据', fingerLocalMores.value)
    tableList()
  } else if (fingerTotal.value === fingerCount.value) {
    //指纹模块数量和本地的finer表的数据相等
    //指纹模块的数据和本地数据对比
    fingerFilter.value = fingerData.value.filter(obj1 => !fingerDataLocalStorage.value.some(obj2 => obj1.feature.slice(0, 266) === obj2.fingerprint.slice(0, 266) && obj1.fno === obj2.no))
    console.log('指纹模块数据和本地数据对比', fingerFilter.value)
    tableList()
  }
}
//列表数据
const tableList = () => {
  //指纹模块的数量多，本地finger表的数据少
  if (fingerMores.value.length > 0) {
    messageBoxShow('异常', '指纹模块与本地服务器数据不正确', 'error')
    Description.value = `提示：指纹表数据${fingerCount.value}条，指纹传感器数据${fingerTotal.value}条，当前有${fingerMores.value.length}条不匹配，可点击“同步下载”修改不匹配数据！`
    syncDisabled.value = false
    fingerDataLocalStorage.value.unshift(...fingerMores.value)
  } else if (fingerLocalMores.value.length > 0) {
    //指纹模块的数量少，本地finger表的数据多
    messageBoxShow('异常', '指纹模块与本地服务器数据不正确', 'error')
    Description.value = `提示：指纹表数据${fingerCount.value}条，指纹传感器数据${fingerTotal.value}条，当前有${fingerLocalMores.value.length}条不匹配，可点击“同步下载”修改不匹配数据！`
    syncDisabled.value = false
    let fingerLocalRes: UnwrapRef<any> = fingerDataLocalStorage.value.filter(item => !fingerLocalMores.value.some(item1 => item1.no === item.no))
    fingerLocalRes.unshift(...fingerLocalMores.value)
    fingerDataLocalStorage.value = fingerLocalRes
  } else if (fingerFilter.value.length > 0) {
    //本地数据跟指纹模块数据相等，但是没有槽位或者特征值不对等
    //指纹模块的数量少，本地finger表的数据多
    messageBoxShow('异常', '指纹模块与本地服务器数据不正确', 'error')
    Description.value = `提示：指纹表数据${fingerCount.value}条，指纹传感器数据${fingerTotal.value}条，当前有${fingerFilter.value.length}条不匹配，可点击“同步下载”修改不匹配数据！`
    syncDisabled.value = false
    fingerDataLocalStorage.value.forEach(item => {
      fingerFilter.value.forEach(item1 => {
        if (item.no === item1.fno || item.fingerprint.slice(0, 266) === item1.feature.slice(0, 266)) {
          item.errorStatus = true
        }
      })
    })
  } else {
    syncDisabled.value = true
    messageBoxShow('提示', '指纹模块与本地服务器数据正常')
    Description.value = '以下数据，跟指纹模块同步，无需同步'
  }
  tableData.value = fingerDataLocalStorage.value
  // console.log(310, tableData.value)
  loading.value.close()
  dialogFormVisible.value = false
}

//同步功能逻辑
const syncConfirm = () => {
  loadingShow()
  debounce(syncButtonDebounce, 500)()
}

//同步下载按钮
const syncButton = () => {
  dialogVisible.value = true
}
//同步的防抖
const syncButtonDebounce = async () => {
  //指纹模块的数量多，本地finger表的数据少
  if (fingerTotal.value > fingerCount.value) {
    let deleteStatus = false
    //删除指纹表里对应的槽位数据
    if (fingerMores.value.length > 0) {
      await asyncForEach(fingerMores.value, async item => {
        const deleteRes = await finger.deleteSingle(item.fno)
        if (deleteRes.result !== 'ACK_SUCCESS') {
          deleteStatus = true
        }
      })
      if (deleteStatus) {
        messageBoxShow('错误', '指纹模块数据删除失败，请重新同步', 'error')
      } else {
        fingerMores.value = []
        loading.value.close()
        messageShow('提示', '同步完成')
        await selectChange()
      }
      dialogVisible.value = false
    }
  } else if (fingerTotal.value < fingerCount.value) {
    //指纹模块的数量少，本地finger表的数据多
    let addFingerStatus = false
    if (fingerLocalMores.value.length > 0) {
      await asyncForEach(fingerLocalMores.value, async item => {
        const addFingerRes = await finger.downloadFeatureAndSaveToDsp(item.no, item.fingerprint)
        if (addFingerRes.result !== 'ACK_SUCCESS') {
          addFingerStatus = true
        }
      })
      if (addFingerStatus) {
        messageBoxShow('错误', '同步上传指纹失败，请重新同步', 'error')
      } else {
        fingerLocalMores.value = []
        loading.value.close()
        messageShow('提示', '同步完成')
        await selectChange()
      }
      dialogVisible.value = false
    }
  } else if (fingerFilter.value.length > 0) {
    let deleteStatus = false
    //本地数据跟指纹模块数据相等，但是没有槽位或者特征值不对等
    await asyncForEach(fingerFilter.value, async item => {
      const deleteRes = await finger.deleteSingle(item.fno)
      if (deleteRes.result !== 'ACK_SUCCESS') {
        deleteStatus = true
      }
    })
    if (deleteStatus) {
      messageBoxShow('错误', '指纹模块数据删除失败，请重新同步', 'error')
      dialogVisible.value = false
    } else {
      //删除指纹对应的槽位指纹-成功
      //先对比Dsp是否已经存在，如果不存在下载到空余的最小槽位
      let awaitDspStatus = false
      await asyncForEach(fingerDataLocalStorage.value, async item => {
        const res = await finger.downloadFeatureAndCompareOneToMore(item.fingerprint)
        if (res.result === 'ACK_NOUSER') {
          //如果不存在就下载 到最小的空槽位
          const downloadRes = await finger.downloadFeatureAndSaveToDsp(await finger.getEmptyFno(), item.fingerprint)
          // console.log(427, downloadRes)
          if (downloadRes.result !== 'ACK_SUCCESS') {
            awaitDspStatus = true
          } else {
            awaitDspStatus = false
            downloadFeatureAndSaveToDspData.value.push({ ...downloadRes, fingerprint: item.fingerprint }) //TODO 获取空槽位对应的指纹槽位值
          }
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
            if (item.fingerprint.slice(0, 266) === item2.fingerprint.slice(0, 266)) {
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
          loading.value.close()
          dialogVisible.value = false
          await selectChange()
        }
      }
    }
  }
}

/**
 * life
 */
onMounted(() => {
  getDeviceList()
})
onUnmounted(() => {
  if (finger) {
    finger.close()
    finger = null
  }
})
/**
 * provides
 */
provide('dataProvide', { HeadTitle, BackShow, tableData, columns, syncButton, formInline, total, syncDisabled })
</script>

<style scoped></style>

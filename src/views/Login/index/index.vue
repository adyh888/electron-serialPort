<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; text-align: center">
    <div>
      <div style="font-size: 28px; color: white; font-weight: 500; letter-spacing: 4px" @click="configClick">
        {{ title }}
        <el-popover placement="top-start" :title="versionTitle" :width="300" trigger="hover">
          <template #reference>
            <span style="font-size: 16px"> @{{ version }}</span>
          </template>
          <template #default>
            <div style="white-space: pre-wrap" v-html="content"></div>
          </template>
        </el-popover>
      </div>
      <div class="content">
        <el-input class="inputClass" v-model="username" style="width: 420px; color: white" placeholder="请输入账号" :prefix-icon="UserFilled" />
      </div>
      <div class="content">
        <el-input v-model="password" class="inputClass" style="width: 420px" show-password placeholder="请输入密码" :prefix-icon="Lock" />
      </div>
      <div class="content">
        <el-button style="width: 100%" type="primary" @click="loginClick">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import { onMounted, ref } from 'vue'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { ElLoadingShow, messageShow } from '../../../utils'
import { useRouter } from 'vue-router'
import { useMcStore, Request, useIndexStore } from '../../../store'
import { StorageCache } from '../../../common/StorageClass'
import { useOrganizationPermission } from '../../../hook/useHook'
import versionReadme from '../../../../versionReadme'
import { ipcRenderer } from 'electron'
import { funEnum, typeEnum } from '../../../common/gRPC/enum'
/**
 * data
 */
const title = ref('人员信息录入系统')
const username = ref('')
const password = ref('')
const router = useRouter()
const storage = new StorageCache()
const loading = ref<any>(null)
const user = useIndexStore()
const configCount = ref(0)
const version = ref('')
const content = ref('')
const versionTitle = ref('版本介绍')
/**
 * methods
 */
const loginClick = async () => {
  if (username.value !== '' || password.value !== '') {
    loadingShow()
    let json = {
      username: username.value,
      password: password.value
    }
    //1。先拿token
    let tokenRes = await Request(useMcStore().getToken, json)
    if (tokenRes) {
      let authUserToken = tokenRes.data.access_token
      storage.set('accessToken', authUserToken)
      //2。在登录
      let managerRes = await Request(useMcStore().managerSelect, json)
      if (managerRes && managerRes.total > 0) {
        user.userInfo = managerRes.data[0]
        storage.set('user', json)
        //获取组织架构
        await useOrganizationPermission()
        loading.value.close()
        // 登录
        await router.push('/home')
      }
    } else {
      loading.value.close()
      return
    }
  } else {
    messageShow('请输入账号和密码', 'error')
  }
}

//loading加载弹窗
const loadingShow = () => {
  loading.value = ElLoadingShow()
}

//config配置页面
const configClick = () => {
  configCount.value++
  if (configCount.value > 5) {
    router.push('/config')
    configCount.value = 0
  }
}

const demo = async () => {
  let json = {
    type: typeEnum.finger,
    fun: funEnum.getRepeatedFno,
    json: {
      url: 'http://172.16.10.249:50300',
      deviceId: '042311009'
    }
  }
  let result = ipcRenderer.sendSync('grpc', json)
  console.log(106, result)
}

/**
 * life
 */
onMounted(() => {
  content.value = versionReadme.description
  versionTitle.value = '版本介绍-' + versionReadme.version
  // @ts-ignore
  version.value = __Admin_VERSION__ as string
  let user = storage.get('user')
  if (user) {
    username.value = user.username
    password.value = user.password
  }
})
</script>

<style scoped>
.content {
  margin: 30px 0;
}

/deep/ .inputClass .el-input__wrapper {
  background: #242e3a !important;
}
/deep/ .inputClass .el-input__inner {
  color: white !important;
}
/deep/ .inputClass .el-input__wrapper {
  box-shadow: 0 0 0 1px #353f4c inset;
}
</style>

<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; text-align: center">
    <div>
      <div style="font-size: 28px; color: white; font-weight: 500; letter-spacing: 4px">{{ title }}</div>
      <div class="content">
        <el-input class="inputClass" v-model="username" style="width: 350px; color: white" placeholder="请输入账号" :prefix-icon="UserFilled" />
      </div>
      <div class="content">
        <el-input v-model="password" class="inputClass" style="width: 350px" show-password placeholder="请输入密码" :prefix-icon="Lock" />
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
import { messageShow } from '../../../utils'
import { useRouter } from 'vue-router'
import { useMcStore, Request } from '../../../store'
import { StorageCache } from '../../../common/StorageClass'
/**
 * data
 */
const title = ref('检验/录入指纹系统')
const username = ref('')
const password = ref('')
const router = useRouter()
const storage = new StorageCache()
/**
 * methods
 */
const loginClick = async () => {
  if (username.value !== '' || password.value !== '') {
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
      if (managerRes) {
        storage.set('user', json)
        // 登录
        await router.push('/home')
      }
    } else {
      return
    }
  } else {
    messageShow('请输入账号和密码', 'error')
  }
}

/**
 * life
 */
onMounted(() => {
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

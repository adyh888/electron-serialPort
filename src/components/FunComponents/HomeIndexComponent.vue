<template>
  <div>
    <div style="display: flex; justify-content: center; align-items: center; width: 100vw; height: 80vh">
      <div v-for="item in tabBar" :key="item.id" style="width: calc(33.33% - 10px); display: flex; justify-content: center; align-items: center" @click="labelClick(item)">
        <div style="display: flex; width: 340px; height: 120px; padding: 30px; border-radius: 10px" :style="item.bg" v-if="item.showStatus">
          <el-image style="width: 170px; height: 150px" fit="contain" :src="item.img"></el-image>
          <div style="margin-left: 20px; width: 350px">
            <div style="color: #333333; font-size: 22px; font-weight: 600; letter-spacing: 20px; text-align: center; font-weight: 600">{{ item.description }}</div>
            <div style="letter-spacing: 4px; color: #999999; font-size: 14px; font-weight: 500">{{ item.comment }}</div>
            <div style="color: white; font-size: 26rpx; display: flex; justify-content: center; align-items: center; letter-spacing: 5rpx; font-weight: 600" :style="item.inputBg">点击进入页面</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
/**
 * data
 */
const router = useRouter()
const tabBar = ref([
  {
    id: 1,
    img: './checkoutFinger.jpg',
    description: '检验指纹',
    showStatus: true,
    path: '/checkout',
    bg: { background: '#DBEEFF' },
    comment: '检验服务器与传感器数据是否一致',
    inputBg: { background: '#1890FF', height: '40px', borderRadius: '5px', marginTop: '10px' }
  },
  {
    id: 2,
    img: './userAdd.jpg',
    description: '人员录入',
    showStatus: true,
    path: '/userList',
    bg: { background: '#FFE9CC' },
    comment: '添加人员信息，录入指纹等信息',
    inputBg: { background: '#FF9B18', height: '40px', borderRadius: '5px', marginTop: '10px' }
  }
])

const labelClick = item => {
  router.push(item.path)
}

/**
 * life
 */
onMounted(() => {})
</script>

<style scoped></style>

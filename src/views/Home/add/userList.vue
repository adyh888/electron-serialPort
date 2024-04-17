<template>
  <div style="background: #ececec; width: 100vw; height: 100vh">
    <HeadComponent />
    <UserListComponent />
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import UserListComponent from '../../../components/FunComponents/UserListComponent.vue'
import { provide, ref, onMounted } from 'vue'
import { useIndexStore } from '../../../store'
import { useRouter } from 'vue-router'

/**
 * data
 */
const router = useRouter()
const BackShow = ref(true)
const user = useIndexStore()
const HeadTitle = ref(user.userInfo.username ?? '空')

/**
 * methods
 */

/**
 * life
 */
onMounted(() => {
  user.paramsArr = []
})
/**
 * provides
 */
provide('dataProvide', { BackShow, HeadTitle })
</script>

<style scoped></style>

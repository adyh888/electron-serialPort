<template>
  <div style="background: #e8e9ef; height: 100vh; width: 100vw">
    <HeadComponent />
    <HomeIndexComponent />
    <BottomComponent />
  </div>
</template>

<script setup lang="ts">
/**
 * imports
 */
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import HomeIndexComponent from '../../../components/FunComponents/HomeIndexComponent.vue'
import BottomComponent from '../../../components/CommonComponents/BottomComponent.vue'
import { onMounted, provide, ref } from 'vue'
import { useIndexStore } from '../../../store'

/**
 * data
 */
const user = useIndexStore()
const HeadTitle = ref(user.userInfo.username ?? '空')

/**
 * life
 */
onMounted(() => {})
/**
 * provides
 */
provide('dataProvide', { HeadTitle })
</script>

<style scoped></style>

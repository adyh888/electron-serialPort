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
import { provide, ref } from 'vue'
const HeadTitle = ref('Saber')

/**
 * provides
 */
provide('dataProvide', { HeadTitle })
</script>

<style scoped></style>

<template>
  <div>
    <div style="padding: 20px; display: flex; justify-content: space-between">
      <div></div>
      <div style="padding: 10px; background: #1b84fa; width: 5%; color: white; border-radius: 5px; text-align: center">
        <span>{{ HeadTitle }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import { inject } from 'vue'

/**
 * injects
 */
const { HeadTitle } = inject('dataProvide')
</script>

<style scoped></style>

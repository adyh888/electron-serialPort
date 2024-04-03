<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="账号">
        <el-input v-model="formInline.nickname" placeholder="请输入账号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formInline.username" placeholder="请输入姓名" clearable />
      </el-form-item>
      <!--      <el-form-item>-->
      <!--        <el-button type="primary" @click="onSubmit">Query</el-button>-->
      <!--      </el-form-item>-->
    </el-form>
    <div style="display: flex; flex-direction: row-reverse">
      <el-button style="margin-left: 20px" type="primary" @click="syncButton">重置</el-button>
      <el-button style="margin-left: 20px" type="primary" @click="syncButton">搜索</el-button>
      <el-button style="width: 80px" type="primary" :disabled="syncDisabled" @click="syncButton">同步</el-button>
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
const { syncButton, formInline, syncDisabled } = inject('dataProvide')
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>

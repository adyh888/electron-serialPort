<template>
  <div>
    <el-form :model="formDataList" class="demo-form-inline">
      <el-row>
        <el-col :span="6" v-for="item in formDataList" :key="item.model">
          <el-form-item :label="item.label">
            <el-cascader v-model="item.value" :options="item.options" :placeholder="item.placeholder" v-if="item.type === 'cascader'" />
            <el-cascader v-model="item.value" :placeholder="item.placeholder" :options="item.options" :props="item.props" filterable show-all-levels v-if="item.type === 'multipleCascader'" />
            <el-input v-model="item.value" :placeholder="item.placeholder" clearable v-if="item.type === 'input'" />
            <el-select v-model="item.value" :placeholder="item.placeholder" v-if="item.type === 'select'"> <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value" /> </el-select> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <div style="display: flex; flex-direction: row-reverse">
      <div v-for="item in buttonData">
        <el-button style="margin-left: 20px" type="primary" @click="syncButton(item.buttonEvent)" v-if="item.model === 'search'">搜索</el-button>
        <el-button style="margin-left: 20px" type="primary" @click="syncButton(item.buttonEvent)" v-if="item.model === 'reset'">重置</el-button>
        <el-button style="width: 80px" type="primary" :disabled="syncDisabled" @click="syncButton(item.buttonEvent)" v-if="item.model === 'sync'">同步</el-button>
        <el-button style="margin-left: 20px" type="primary" :disabled="syncDisabled" @click="syncButton(item.buttonEvent)" v-if="item.model === 'add'">添加</el-button>
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
const { syncButton, syncDisabled, formDataList, buttonData } = inject('dataProvide')
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>

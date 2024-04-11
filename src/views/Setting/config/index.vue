<template>
  <div style="background: #e8e9ef; height: 100vh; width: 100vw">
    <HeadComponent />
    <div style="display: flex; justify-content: center">
      <el-form ref="ruleFormRef" style="width: 70%" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm" :size="formSize" status-icon>
        <el-form-item label="服务器地址" prop="serverIp">
          <el-input v-model="ruleForm.serverIp" />
        </el-form-item>
        <el-form-item>
          <div style="display: flex; justify-content: center; width: 100%">
            <el-button style="margin-top: 30px; width: 300px" type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * imports
 */
import HeadComponent from '../../../components/CommonComponents/HeadComponent.vue'
import { provide, ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { messageBoxShow } from '../../../utils'
import { StorageCache } from '../../../common/StorageClass'
import { BaseURL } from '../../../config'
import { useRouter } from 'vue-router'
/**
 * data
 */
const HeadTitle = '环境配置'
const BackShow = ref(true)
const router = useRouter()
interface RuleForm {
  serverIp: string
}
const storage = new StorageCache()
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  serverIp: BaseURL()
})

const rules = reactive<FormRules<RuleForm>>({
  serverIp: [{ required: true, message: '服务器地址必填', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      storage.set('config', ruleForm)
      messageBoxShow('提示', '修改配置成功，请重启软件后生效')
      setTimeout(() => {
        router.back()
      })
    } else {
      messageBoxShow('提示', '必须项必填,请填写完整信息', 'error')
    }
  })
}

/**
 * provides
 */
provide('dataProvide', { HeadTitle, BackShow })
</script>

<style scoped></style>

<template>
  <Dialog title="添加应用" width="660px" :confirmConfig="{ name: '保存' }" @confirm="submitForm">
    <div class="dialog-box">
      <Form :schema="schema" ref="addFormRef" :model="addForm" :rules="rules" :isCol="false">
        <template #secret="form">
          <el-input v-model="form['secret']" placeholder="请输入应用Secret" />
          <div
            >在企微管理后台 > 应用管理
            <XTextButton type="primary" title="去获取" />
          </div>
        </template>
      </Form>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { FormSchema } from '@/types/form'
import type { FormRules } from 'element-plus'
import { FormExpose } from '@/components/Form'

const addForm = ref({
  id: '',
  secret: ''
})
const rules = reactive<FormRules>({
  id: [
    { required: true, message: '请输入应用ID', trigger: 'blur' },
    { pattern: '^\\d{32}$', message: '仅数字输入，字数上限32位' }
  ],
  secret: [
    { required: true, message: '请输入应用Secret', trigger: 'blur' },
    {
      pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{1,64}$',
      message: '仅支持英文、数字输入，字数上限64位'
    }
  ]
})

const addFormRef = ref<FormExpose>()
const submitForm = async () => {
  const elForm = unref(addFormRef)?.getElFormRef()
  if (!elForm) return

  elForm.validate(async (valid) => {
    if (valid) {
      const data = unref(addFormRef)?.formModel
      console.log(data)
    } else {
      console.log('error submit')
      return false
    }
  })
}
const schema = ref<FormSchema[]>([
  {
    field: 'id',
    label: '应用ID',
    component: 'Input'
  },
  {
    field: 'secret',
    label: '应用Secret',
    component: 'Input'
  }
])
</script>

<style lang="scss" scoped>
:deep(.el-input) {
  width: 340px;
}
</style>

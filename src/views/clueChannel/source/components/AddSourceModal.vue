<template>
  <XModal v-model="dialogVisible" width="534px" :title="dialogTitle" @close="heheMethod">
    <!-- 对话框(添加 / 修改) -->
    <Form
      v-if="['create', 'update'].includes(actionType)"
      :schema="allSchemas.formSchema"
      :rules="rules"
      ref="formRef"
      :model="model"
    >
      <template #sourceName="form">
        <el-input v-model="form.sourceName" placeholder="请输入线索来源名称" />
      </template>
      <template #status="form">
        <el-cascader :options="options" :props="props" v-model="form.status" clearable />
      </template>
    </Form>
    <!-- 操作按钮 -->
    <template #footer>
      <XButton
        v-if="['create', 'update'].includes(actionType)"
        type="primary"
        :title="t('action.save')"
        :loading="actionLoading"
        @click="submitForm()"
      />
      <XButton :loading="actionLoading" :title="t('dialog.close')" @click="dialogVisible = false" />
    </template>
  </XModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormExpose } from '@/components/Form'
import { rules, allSchemas, oa_source_res } from './source.form'
import * as channelApi from '@/api/clue/channel'

const formRef = ref<FormExpose>() // 表单 Ref
const { t } = useI18n() // 国际化
let dialogVisible = ref(false)
let dialogTitle = ref('新增')
const actionLoading = ref(false) // 遮罩层
const actionType = ref('create') // 操作按钮的类型
const message = useMessage() // 消息弹窗
const props = {
  checkStrictly: true,
  label: 'clueName',
  value: 'clueSourceId'
}

const heheMethod = () => {
  console.log('关闭啦啊啊啊')
}

let options = ref(oa_source_res.data)
interface ParentInfoType {
  parentId?: string
  sourceHierarchy: string
}
let parentInfo: ParentInfoType = { sourceHierarchy: '' }
let model = ref({})
const openModal = (data, type) => {
  let levelText = '来源'
  try {
    let levelList = data.levelList
    let level = levelList[data.sourceHierarchy - 1]
    levelText = `${level}级来源`
    delete data.levelList
  } catch (error) {
    console.log(error)
  }

  dialogVisible.value = true
  if (type == 'add') {
    dialogTitle.value = '新增' + levelText
    parentInfo = {
      sourceHierarchy: data.sourceHierarchy,
      parentId: data.id || ''
    }
  } else {
    dialogTitle.value = '编辑' + levelText
    setTimeout(() => {
      if (formRef.value) {
        formRef.value.setValues(data)
      }
    }, 100)
  }
}

defineExpose({ openModal })
const emit = defineEmits(['refreshList'])
// 保存按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        let data = unref(formRef)?.formModel
        data = {
          ...data,
          ...parentInfo
        }
        let res = null
        if (data.id) {
          res = await channelApi.clueSourceManageUpdate(data)
        } else {
          res = await channelApi.clueSourceManageAdd(data)
        }

        console.log(res)

        if (res) {
          message.success('操作成功')
          emit('refreshList')
          dialogVisible.value = false
        }
      } finally {
        actionLoading.value = false
      }
    }
  })
}
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>

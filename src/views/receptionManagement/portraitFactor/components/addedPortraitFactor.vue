<template>
  <div>
    <!--  画像因子新增 类型 -->
    <XModal v-model="modelValue_" title="新增">
      <!-- 表单 -->
      <Form ref="formRef" :schema="allSchemas.formSchema" :rules="addRules" :isCol="false">
        <template #score="form">
          <div class="flex">
            <el-input v-model="form.lowestScore" />
            <span class="pl-4 pr-4">——</span>
            <el-input v-model="form.topScore" />
          </div>
        </template>
      </Form>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="actionLoading" @click="submitForm" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import * as portraitFactor from '@/api/receptionManagement/portraitFactor'
import { allSchemas, addRules } from './addedPortraitFactor.data.js'

const { t } = useI18n() // 国际化
// let dialogLoading = ref(false) // 弹窗加载状态
// const [registerTable, { reload }] = useXTable({
//   allSchemas: allSchemas,
//   getListApi: promptConfig.portraitFactorLevelConfigSaveOrUpdateApi
// })

/* --------------------------------- // 新增类型 -------------------------------- */
import { FormExpose } from '@/components/Form'

// 表单参数
const actionLoading = ref(false) // 按钮 Loading
const formRef = ref<FormExpose>() // 表单 Ref
const message = useMessage() // 消息弹窗

// 表单监听
watch(
  () => {
    const formModel = formRef.value?.formModel
    return [formModel?.lowestScore, formModel?.topScore]
  },
  ([newfoo, prevfoo]) => {
    formRef.value?.setValues({
      score: newfoo && prevfoo ? `${newfoo} - ${prevfoo}` : ''
    })
  }
)

function openModal(open: boolean, data?: any) {
  modelValue_.value = open
  nextTick(() => {
    formRef.value?.setValues(data)
  })
}
defineExpose({ openModal })

// 提交按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (!valid) return
    try {
      actionLoading.value = true
      const data = unref(formRef)?.formModel
      await portraitFactor.portraitFactorLevelConfigSaveOrUpdateApi(data)
      modelValue_.value = false
      emits('refresh', true)
      message.success(t('common.createSuccess'))
    } finally {
      actionLoading.value = false
    }
  })
}

/* ---------------------------------- 弹窗初始化 --------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:modelValue', 'refresh'])
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>

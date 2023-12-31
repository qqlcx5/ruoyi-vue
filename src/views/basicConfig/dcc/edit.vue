<template>
  <div class="basic-config-content dcc-edit-container" v-loading="loading">
    <div class="page-title">DCC考核设置</div>
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
      v-if="!loading"
    >
      <el-form-item label="DCC规则名称" label-width="120" prop="dccRuleName">
        <el-input
          v-model.trim="ruleForm.dccRuleName"
          maxlength="20"
          show-word-limit
          placeholder="请输入DCC规则名称"
          style="width: 340px"
        />
      </el-form-item>
      <el-form-item label="适用门店" label-width="120" prop="applicableShopId">
        <el-cascader
          v-model="ruleForm.applicableShopId"
          :options="shopTreeList"
          :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
          filterable
          collapse-tags
          collapse-tags-tooltip
          clearable
          style="min-width: 240px"
        />
      </el-form-item>
      <el-table :data="ruleForm.examineSetList" class="custom-table mb-30px">
        <el-table-column label="意向等级" align="center" prop="intentionLevelName" />
        <el-table-column label="可选择性" min-width="220px">
          <template #default="{ row }">
            <span>派单时间后</span>
            <el-input-number
              :controls="false"
              v-model="row.selectivityTime"
              step-strictly
              :step="1"
              :min="0"
              class="input-w-90px"
            />
            <span>时</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进周期" min-width="650px">
          <template #default="{ row, $index }">
            <div
              class="cycle-item"
              v-for="(item, cIndex) in row.followUpCycleList"
              :key="item.timestamp"
            >
              <span>派单时间后</span>
              <el-input-number
                :controls="false"
                v-model="item.beginHour"
                step-strictly
                :step="1"
                :min="0"
                class="input-w-90px"
              />
              <span>至</span>
              <el-input-number
                :controls="false"
                v-model="item.endHour"
                step-strictly
                :step="1"
                :min="0"
                class="input-w-90px"
              />
              <span>小时内，每</span>
              <el-input-number
                :controls="false"
                v-model="item.everyHourFollow"
                step-strictly
                :step="1"
                :min="0"
                class="input-w-90px"
              />
              <span>小时内必须跟进</span>
              <Icon
                v-if="row.followUpCycleList.length - 1 === cIndex"
                icon="ep:circle-plus"
                class="toggle-icon"
                @click="handleAddRow($index)"
                color="#0081FF"
              />
              <Icon
                v-if="row.followUpCycleList.length > 1"
                icon="ep:remove"
                class="toggle-icon"
                @click="handleDelRow(row.followUpCycleList, cIndex)"
                color="#FF4141"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否可战败" min-width="100px">
          <template #default="{ row }">
            <el-switch v-model="row.failStatus" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="可战败起始时间" min-width="220px">
          <template #default="{ row }">
            <span>派单时间后</span>
            <el-input-number
              :controls="false"
              v-model="row.failStartTime"
              step-strictly
              :step="1"
              :min="0"
              class="input-w-90px"
            />
            <span>时</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="" label-width="0">
        <span class="mr-8px">线索无效率</span
        ><el-switch
          v-model="ruleForm.monthEffectiveRateStatus"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="" label-width="0">
        <el-radio-group v-model="ruleForm.effectiveRateType">
          <el-radio :label="1">按天</el-radio>
          <el-radio :label="2">按自然月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <span>每个成员的线索无效率不超过</span>
        <el-input-number
          v-model="ruleForm.effectiveRate"
          step-strictly
          :step="1"
          :min="0"
          :max="100"
          :controls="false"
          class="input-w-90px"
        />
        <span>%</span>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <span class="mr-8px">DCC规则说明</span
        ><el-switch v-model="ruleForm.dccExplainStatus" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <Editor
        v-model="ruleForm.dccExplain"
        :toolbarConfig="{ excludeKeys: ['group-image', 'group-video', 'emotion'] }"
        class="mb-20px"
        :height="220"
        style="width: 600px"
      />
    </el-form>
    <div class="bottom-btns">
      <el-button size="large" @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        size="large"
        :disabled="id && !ruleForm.id"
        :loading="btnLoading"
        @click="handleSave"
        >保存设置</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { DICT_TYPE, getTenantDictOptions } from '@/utils/dict'
import {
  existDccRuleShop,
  detailDcc,
  validDccRuleName,
  saveDccConfig
} from '@/api/clue/basicConfig'
import { cloneDeep } from 'lodash-es'
import { useTagsViewStoreWithOut } from '@/store/modules/tagsView'
import { useOption } from '@/store/modules/options'
import { getShopDataList } from '@/api/common'
const store = useOption()
const route = useRoute()
const router = useRouter()
const message = useMessage()
const tagsView = useTagsViewStoreWithOut()
const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive<any>({
  dccRuleName: '',
  applicableShopId: [],
  examineSetList: [],
  openRules: 1, // 状态是否开启
  monthEffectiveRateStatus: 0, // 线索无效率
  effectiveRateType: 1, // 按天、按自然月
  effectiveRate: null, // 每个成员的线索无效率不超过
  dccExplainStatus: 0, // DCC规则说明
  dccExplain: '' // editor
})
const rules: FormRules = reactive<FormRules>({
  dccRuleName: [{ required: true, message: '请输入DCC规则名称', trigger: 'blur' }],
  applicableShopId: [{ required: true, message: '请选择适用门店', trigger: 'change' }]
})
const handleAddRow = (index) => {
  const cycle = {
    beginHour: null,
    endHour: null,
    everyHourFollow: null,
    timestamp: new Date().getTime()
  }
  ruleForm.examineSetList[index].followUpCycleList.push(cycle)
  console.log(cycle)
}

const id = route.params.id
const loading = ref<boolean>(false)
onMounted(async () => {
  try {
    loading.value = true
    if (id) {
      const data: object = await detailDcc({ id })
      data['applicableShopId'] = data['applicableShopId'].split(',').map((d) => +d)
      ruleForm = reactive(data)
    } else {
      const data = await getTenantDictOptions(DICT_TYPE.INTENTION_LEVEL)
      if (data) {
        ruleForm.examineSetList = data.map((item) => {
          return {
            intentionLevel: item.value,
            intentionLevelName: item.label,
            selectivityTime: null, // 可选择性
            followUpCycleList: [{ beginHour: null, endHour: null, everyHourFollow: null }],
            failStatus: 0, // 是否可战败
            failStartTime: null, // 可战败起始时间
            status: 0 // 状态
          }
        })
      }
    }
    getShopList()
  } finally {
    loading.value = false
  }
})
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const shopList = await getShopDataList()
  const checkedList = await existDccRuleShop()
  shopTreeList.value = store.dealShopList(shopList, unref(checkedList), ruleForm.applicableShopId)
}
const handleDelRow = (list, index) => {
  // console.log(item)
  list.splice(index, 1)
}

const btnLoading = ref<boolean>(false)
const handleCancel = () => {
  router.push('/clue/basic-config/dcc')
  tagsView.delVisitedView(route)
}
const handleSave = async () => {
  ruleFormRef.value?.validate(async (vali) => {
    if (vali) {
      try {
        loading.value = true
        const params: any = cloneDeep(ruleForm)
        params.applicableShopId = params.applicableShopId.join(',')
        if (id) {
          await validDccRuleName({ id, ruleName: params.dccRuleName })
        }
        await saveDccConfig(params)
        message.success('提交成功')
        handleCancel()
      } finally {
        loading.value = false
      }
    } else {
      console.log(vali)
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/custom.scss';
.dcc-edit-container {
  padding: 15px 15px $btnWrapHeight;
  background-color: #ffffff;
  .page-title {
    line-height: 25px;
    font-size: 14px;
    font-weight: bold;
    color: $title-color;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-color;
    margin-bottom: 25px;
  }
  .input-w-90px {
    width: 90px;
    margin: 0 8px;
    :deep(.el-input__inner) {
      text-align: left;
    }
  }
  .toggle-icon {
    cursor: pointer;
    margin-left: 4px;
    vertical-align: middle;
  }
  .cycle-item + .cycle-item {
    margin-top: 8px;
  }
}
</style>

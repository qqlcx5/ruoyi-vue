<template>
  <form-table
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: mortgageFinancePage,
      showAdd: true,
      selection: true
    }"
    @add="addBank"
  >
    <template #tableAppend>
      <XButton title="删除" />
    </template>
    <template #form-province="{ model }">
      <AreaSelect
        v-model:province="model.province"
        v-model:city="model.city"
        v-model:county="model.county"
      />
    </template>
    <template #form-searchKey="{ model }">
      <el-input
        v-model="model.searchKey"
        placeholder="请输入按揭银行名称、联系人、最近操作人进行搜索"
        style="width: 344px"
      />
    </template>
    <template #action>
      <!-- 操作：修改 -->
      <XTextButton title="修改" />
      <!-- 操作：详情 -->
      <XTextButton title="删除" />
    </template>
    <template #superiorsCount="{ row }">
      <div class="leader-num" @click="lookLeaders(row)">1</div>
    </template>
    <template #financeStatus="{ row }">
      <el-switch v-model="row.financeStatus" :active-value="1" :inactive-value="0" />
    </template>
  </form-table>
  <EditBank v-model="visible" />
  <LeaderDialog v-model="visibleLeader" />
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { mortgageFinancePage } from '@/api/mortgage'
import EditBank from '@/views/mortgage/components/EditBank/index.vue'
import LeaderDialog from '@/views/mortgage/components/LeaderDialog/index.vue'
import AreaSelect from '@/components/AreaSelect/index.vue'

const columns: TableColumn[] = [
  { label: '金融机构名称', field: 'financeName', width: 150 },
  { label: '省份', field: 'provinceName' },
  { label: '城市', field: 'cityName' },
  { label: '区县', field: 'countyName' },
  { label: '单位地址', field: 'address', width: 150 },
  { label: '税号', field: 'taxNumber', width: 120 },

  {
    label: '开启状态',
    field: 'financeStatus',
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        clearable: true,
        options: [
          { label: '开启', value: 1 },
          { label: '关闭', value: 0 }
        ]
      }
    }
  },
  { label: '省市区', field: 'province', width: 110, isTable: false, isSearch: true },
  { label: '', field: 'searchKey', isTable: false, isSearch: true },
  { label: '联系人', field: 'contactName', width: 110 },
  { label: '电话', field: 'contactMobile', width: 110 },
  { label: '职位', field: 'position', width: 110 },
  { label: '新增说明', field: 'addExplain', width: 110 },
  { label: '上级领导联系人', field: 'superiorsCount', width: 130 },
  {
    label: '操作',
    field: 'action',
    width: 110,
    showOverflowTooltip: false
  }
]

const visible = ref<boolean>(false)
const addBank = () => {
  visible.value = true
}
const visibleLeader = ref<boolean>(false)
const lookLeaders = (row) => {
  visibleLeader.value = true
}

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss">
.leader-num {
  cursor: pointer;
  color: $wg-primary-color;
}
</style>

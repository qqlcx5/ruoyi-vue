<template>
  <div class="basic-config-page-container">
    <WgTable
      class="table-wrap"
      :loading="loading"
      :data="list"
      :tableConfig="tableConfig"
      @page-change="pageChange"
    >
      <template #btns>
        <XButton
          v-hasPermi="['clue:basic-config:recovery-clue:create']"
          type="primary"
          iconFont="icon-xinzeng"
          title="新增回收计划"
          @click="handleCreate"
        />
      </template>
    </WgTable>
    <CreateRecoveryPlan v-model="visible" @success="getList" />
  </div>
</template>

<script setup lang="tsx">
import useQueryPage from '@/hooks/web/useQueryPage'
import WgTable from '@/components/WTable/index.vue'
import CreateRecoveryPlan from '../components/CreateRecoveryPlan/index.vue'
import { executeRecycleSchedule, pageRecycleSchedule } from '@/api/clue/basicConfig'
import { dateFormat } from '@/utils/utils'
const message = useMessage()
const tableConfig = reactive({
  pageKey: 'recoveryClue',
  refresh: () => getList(),
  queryParams: { pageNo: 1, pageSize: 10 },
  columns: [
    { label: '线索所属成员', key: 'username', minWidth: 150, disabled: true },
    { label: '手动回收原因', key: 'recycleReasonName', minWidth: 120, disabled: true },
    { label: '回收线索所属门店', key: 'shopName', minWidth: 150 },
    {
      label: '回收线索品牌',
      key: 'brandNameList',
      minWidth: 160,
      render: ({ row }) => (row.brandNameList ? row.brandNameList.join('，') : '')
    },
    {
      label: '回收线索派发时间 ',
      key: 'remark',
      minWidth: 200,
      render: ({ row }) =>
        row.distributeTimeType === 1 ? (
          '全部'
        ) : (
          <div style={{ lineHeight: '17px' }}>
            <div>{dateFormat(row.distributeStartTime)}</div>
            <div>{`-${dateFormat(row.distributeEndTime)}`}</div>
          </div>
        )
    },
    { label: '备注', key: 'remark', minWidth: 150 },
    { label: '应回收线索数', key: 'shouldRecycleClueNum', minWidth: 150 },
    { label: '实际回收线索数', key: 'realRecycleClueNum', minWidth: 150 },
    { label: '创建人', key: 'creator' },
    {
      label: '创建时间',
      key: 'createTime',
      minWidth: 190,
      render: ({ row }) => dateFormat(row.createTime)
    },
    {
      label: '操作',
      key: 'operate',
      width: 120,
      fixed: 'right',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => {
        const disabled: boolean = +row.executeStatus === 1
        return (
          <el-button
            type="primary"
            v-hasPermi={[['clue:basic-config:recovery-clue:execute']]}
            disabled={disabled}
            link
            onclick={() => handleExecute(row)}
          >
            {disabled ? <span style={{ color: '#666' }}>执行完成</span> : '执行回收'}
          </el-button>
        )
      }
    }
  ]
})

const visible = ref<boolean>(false)

const { loading, list, getList, pageChange } = useQueryPage({
  path: pageRecycleSchedule,
  params: tableConfig.queryParams
})

const handleCreate = () => {
  visible.value = true
}

const handleExecute = async (row) => {
  await message.confirm(
    <div>
      <h3>确定执行该条回收计划吗？</h3>
      <p>
        <strong>线索所属成员：</strong>
        {row.username}
      </p>
      <p>
        <strong>手动回收原因：</strong>
        {row.recycleReasonName}
      </p>
      <p>
        <strong>线索所属门店：</strong>
        {row.shopName}
      </p>
      <p>
        <strong>回收线索品牌：</strong>
        {row.brandNameList.join(',')}
      </p>
      <p>
        <strong>回收线索派发时间：</strong>
        {row.distributeTimeType === 1
          ? '全部'
          : `${dateFormat(row.distributeStartTime)} - ${dateFormat(row.distributeEndTime)}`}
      </p>
      <p>
        <strong>备注：</strong>
        {row.remark || '-'}
      </p>
    </div>,
    '提示',
    { customClass: 'execute-recovery-clue-confirm' }
  )
  await executeRecycleSchedule({ id: row.id })
  message.success('提交成功')
  getList()
}
</script>

<style scoped lang="scss">
.basic-config-page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .top-search {
    padding: 15px;
    background-color: var(--page-bg-color);
  }
  .table-wrap {
    padding: 15px;
    background-color: var(--page-bg-color);
  }
}
</style>
<style lang="scss">
.execute-recovery-clue-confirm {
  --el-messagebox-width: 520px;
  width: auto;
  min-width: 400px;
  .el-message-box__status.el-icon {
    top: 12px;
  }
}
</style>

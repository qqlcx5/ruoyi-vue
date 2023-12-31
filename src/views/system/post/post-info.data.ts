import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

const { t } = useI18n() // 国际化

// 表单校验
export const rules = reactive({
  name: [required],
  code: [required],
  sort: [required]
})

// 增删改查 CrudSchema 配置
const crudSchemas = reactive<VxeCrudSchema>({
  firstColumn: 'checkbox',
  actionWidth: '180px',
  action: true,
  columns: [
    {
      title: '岗位ID',
      field: 'id',
      defaultShow: false
    },
    {
      title: '岗位编码',
      field: 'code',
      disabled: true
    },
    {
      title: '岗位名称',
      field: 'name',
      disabled: true
    },
    {
      title: '默认角色',
      field: 'roleList',
      table: {
        slots: {
          default: 'role_list'
        }
      }
    },
    {
      title: '在职成员',
      field: 'userCount',
      table: {
        slots: {
          default: 'user_count'
        }
      }
    },
    {
      title: '岗位顺序',
      field: 'sort',
      isTable: false,
      form: {
        component: 'InputNumber'
      }
    },
    {
      title: t('common.status'),
      field: 'status',
      dictType: DICT_TYPE.COMMON_STATUS,
      dictClass: 'number',
      table: {
        width: 80,
        slots: {
          default: 'status_default'
        }
      }
    },
    {
      title: t('common.creater'),
      field: 'creatorName',
      isForm: false,
      defaultShow: false
    },
    {
      title: t('common.createTime'),
      field: 'createTime',
      formatter: 'formatDate',
      isForm: false,
      defaultShow: false
    },
    {
      title: t('common.operator'),
      field: 'updaterName',
      isForm: false,
      defaultShow: false
    },
    {
      title: t('common.operationTime'),
      field: 'updateTime',
      formatter: 'formatDate',
      isForm: false,
      defaultShow: false
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)

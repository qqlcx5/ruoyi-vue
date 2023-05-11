import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// 增删改查 CrudSchema 配置
const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: 'checkbox',
  action: false,
  columns: [
    {
      title: '岗位编码',
      field: 'code',
    },
    {
      title: '岗位名称',
      field: 'name',
    },
    {
      title: '岗位类型编码',
      field: 'typeCode',
    },
    {
      title: '岗位类型',
      field: 'typeName',
    },
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)

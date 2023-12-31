import { XTableProps } from '@/components/XTable/src/type'

export interface tableMethod {
  reload: () => void // 刷新表格
  search: () => void // 查询表格
  refreshColumn: () => void // 刷新列
  setProps: (props: XTableProps) => void
  deleteData: (id: string | number, msg?: string | VNode | (() => VNode)) => void // 删除数据
  deleteReq: (id: string | number) => any // 删除请求
  deleteBatch: () => void // 批量删除
  exportList: (fileName?: string) => void // 导出列表
  getCurrentColumn: () => void // 获取当前列
  getRadioRecord: () => void // 获取当前选中列，radio
  getCheckboxRecords: () => any //获取当前选中列， checkbox
  setCheckboxRow: (row) => void // 设置复选选中行
  setRadioRow: (row) => void // 设置单选选中行
}

export const useXTable = (props: XTableProps): [Function, tableMethod] => {
  const tableRef = ref<Nullable<tableMethod>>(null)

  const register = (instance) => {
    tableRef.value = instance
    props && instance.setProps(props)
  }
  const getInstance = (): tableMethod => {
    const table = unref(tableRef)
    if (!table) {
      console.error('表格实例不存在')
    }
    return table as tableMethod
  }
  const methods: tableMethod = {
    reload: () => getInstance().reload(),
    search: () => getInstance().search(),
    refreshColumn: () => getInstance().refreshColumn(),
    setProps: (props) => getInstance().setProps(props),
    deleteData: (id: string | number, msg?: string | VNode | (() => VNode)) =>
      getInstance().deleteData(id, msg),
    deleteReq: (id: string | number) => getInstance().deleteReq(id),
    deleteBatch: () => getInstance().deleteBatch(),
    exportList: (fileName?: string) => getInstance().exportList(fileName),
    getCurrentColumn: () => getInstance().getCheckboxRecords(),
    getRadioRecord: () => getInstance().getRadioRecord(),
    getCheckboxRecords: () => getInstance().getCheckboxRecords(),
    setCheckboxRow: (row) => getInstance().setCheckboxRow(row),
    setRadioRow: (row) => getInstance().setRadioRow(row)
  }
  return [register, methods]
}

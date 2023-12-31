import request from '@/config/axios'
import type { DictDataVO, DictDataPageReqVO, DictDataExportReqVO } from './types'

// 查询字典数据（精简)列表
export const listSimpleDictDataApi = () => {
  return request.get({ url: '/system/tenant-dict-data/list-all-simple' })
}

// 查询字典数据列表
export const getDictDataPageApi = (params: DictDataPageReqVO) => {
  return request.get({ url: '/system/tenant-dict-data/page', params })
}

// 查询字典数据详情
export const getDictDataApi = (id: number) => {
  return request.get({ url: '/system/tenant-dict-data/get?id=' + id })
}

// 新增字典数据
export const createDictDataApi = (data: DictDataVO) => {
  return request.post({ url: '/system/tenant-dict-data/create', data })
}

// 修改字典数据
export const updateDictDataApi = (data: DictDataVO) => {
  return request.put({ url: '/system/tenant-dict-data/update', data })
}

// 删除字典数据
export const deleteDictDataApi = (id: number) => {
  return request.delete({ url: '/system/tenant-dict-data/delete?id=' + id })
}
// 导出字典类型数据
export const exportDictDataApi = (params: DictDataExportReqVO) => {
  return request.get({ url: '/system/tenant-dict-data/export', params })
}
// 根据字典组编码获得字典数据
export const getDictDetailByCode = (dictType: string) => {
  return request.get({ url: `/system/tenant-dict-data/getDictDetail/${dictType}` })
}

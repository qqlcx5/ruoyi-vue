import request from '@/config/axios'

export interface MajorIndividual {
  pageNo?: number
  pageSize?: number
  keyword?: string
  systemName?: string
  status?: number
  effectiveStartDate?: Date
  expireTime?: Date
}

// 通过岗位id获取岗位角色
export const getRolePostList = (params) => {
  return request.get({ url: '/system/post-role/get/post', params })
}

// 获取部门所属门店品牌
export const getDepBrandsList = (params) => {
  return request.get({ url: '/system/organization/brands-list', params })
}

// 查询成员管理列表分页
export const getMemberList = (params: MajorIndividual) => {
  return request.get({ url: '/system/user/extra/page', params })
}

// 查询成员管理列表不分页
export const getMemberAllList = (params: MajorIndividual) => {
  return request.get({ url: '/system/user/list-all-simple', params })
}

// 主体管理下查询 负责人
export const getMemberAllListBusiness = (params) => {
  return request.get({ url: '/system/user/list-for-tenant', params })
}

// 成员id获取手机号
export const getMemberPhoneList = (params: MajorIndividual) => {
  return request.get({ url: '/system/user/extra/get_phone_list', params })
}

// 成员id获取手机号 主体门店使用
export const getMajMemberPhoneList = (params: MajorIndividual) => {
  return request.get({ url: '/system/user/extra/get_phone_list_tenant', params })
}

// 获取岗位类型
export const getPostTypeList = () => {
  return request.get({ url: '/system/post-type/list-all-simple' })
}
// 通过岗位类型获取岗位列表
export const getTypePostList = (params) => {
  return request.get({ url: '/system/post/list-all-simple/code', params })
}

// 获取岗位列表
export const getPostList = () => {
  return request.get({ url: '/system/post/list-all-simple' })
}

// 获取角色信息
export const getRolesList = () => {
  return request.get({ url: '/system/role/list-all-simple' })
}

// 新增成员
export const addMember = (data) => {
  return request.post({ url: '/system/user/create', data })
}

// 编辑成员
export const updateMember = (data) => {
  return request.put({ url: '/system/user/update', data })
}

// 查询成员详情
export const getMemberDetails = (params) => {
  return request.get({ url: '/system/user/extra/get', params })
}

// 更改成员状态
export const updateMemberStatus = (data) => {
  return request.put({ url: '/system/user/update-status', data })
}

// 删除成员
export const deleteMember = (id: number) => {
  return request.delete({ url: '/system/user/delete?id=' + id })
}

// 重置密码
export const putResetPassWord = (data) => {
  return request.put({ url: '/system/tenant/update-password', data })
}

// 批量转岗
export const batchPostAdjustment = (data) => {
  return request.post({ url: '/system/user/extra/post-adjustment', data })
}

// 批量赋予用户角色
export const batchAssignUserRole = (data) => {
  return request.post({ url: '/system/permission/assign-user-role/batch', data })
}

// 无权限成员列表
export const getAllMemberList = (params) => {
  return request.get({ url: '/system/user/extra/page/all', params })
}

// 通过机构获取用户精简信息列表
export const getUserListByOrg = (params) => {
  return request.get({ url: '/system/user/extra/list-by-org', params })
}

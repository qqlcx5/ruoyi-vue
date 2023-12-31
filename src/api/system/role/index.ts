import request from '@/config/axios'

export interface RoleVO {
  id: number
  name: string
  code: string
  sort: number
  status: number
  type: number
  createTime: Date
}

export interface RolePageReqVO extends PageParam {
  name?: string
  code?: string
  status?: number
  createTime?: Date[]
}

export interface UpdateStatusReqVO {
  id: number
  status: number
}

// 查询角色列表
export const getRolePageApi = async (params: RolePageReqVO) => {
  return await request.get({ url: '/system/role/page', params })
}

// 查询角色（精简)列表
export const listSimpleRolesApi = async () => {
  return await request.get({ url: '/system/role/list-all-simple' })
}

// 查询角色详情
export const getRoleApi = async (id: number | string) => {
  return await request.get({ url: '/system/role/get?id=' + id })
}

// 新增角色
export const createRoleApi = async (data: RoleVO) => {
  return await request.post({ url: '/system/role/create', data })
}

// 修改角色
export const updateRoleApi = async (data: RoleVO) => {
  return await request.put({ url: '/system/role/update', data })
}

// 修改角色状态
export const updateRoleStatusApi = async (data: UpdateStatusReqVO) => {
  return await request.put({ url: '/system/role/update-status', data })
}

// 删除角色
export const deleteRoleApi = async (id: number) => {
  return await request.delete({ url: '/system/role/delete?id=' + id })
}

// 获得角色配置人员信息
export const getPersonsByRole = async (params) => {
  return await request.get({ url: '/system/role/get-persons-by-role', params })
}

// 赋予角色菜单和数据权限
export const assignRoleMenuDataScope = async (data) => {
  return await request.post({ url: '/system/permission/assign-role-menu-data-scope', data })
}

// 获得角色的菜单和数据权限
export const getRoleMenuDataScope = async (params) => {
  return await request.get({ url: '/system/permission/get-role-menu-data-scope', params })
}

// 获取角色在职员工数
export const getActiveUsersCount = async (id) => {
  return await request.get({ url: '/system/role/active_users?id=' + id })
}

//获得指定部门和人员列表
export const getListDeptUser = async () => {
  return await request.get({ url: '/system/permission/list-dept-user' })
}

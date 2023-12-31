import request from '@/config/axios'

export interface PostInfoVO {
  id?: number
  name: string
  code: string
  typeCode?: number | string
  status?: number
  remark?: string
  sort?: number
  createTime?: Date
  roleList?: object
}

export interface batchPostInfoVO {
  postCreateList: PostInfoVO[]
}

export interface batchPostRoleVO {
  postIds: object
  roleIds: object
  status: number
}

export interface PostPageReqVO extends PageParam {
  code?: string
  name?: string
  typeCode?: number | string
  status?: number
}

export interface PostExportReqVO {
  code?: string
  name?: string
  typeCode?: number | string
  status?: number
}

// 查询岗位列表
export const getPostPageApi = async (params: PostPageReqVO) => {
  return await request.get({ url: '/system/post/page', params })
}

// 获取岗位精简信息列表
export const listSimplePostsApi = async () => {
  return await request.get({ url: '/system/post/list-all-simple' })
}

// 根据岗位类型获取岗位精简信息列表
export const listSimplePostsByTypeCodeApi = async (params?) => {
  return await request.get({ url: '/system/post/list-all-simple/code', params })
}

// 查询岗位详情
export const getPostApi = async (id: number | string) => {
  return await request.get({ url: '/system/post/get?id=' + id })
}

// 新增岗位
export const createPostApi = async (data: PostInfoVO) => {
  return await request.post({ url: '/system/post/create', data })
}

// 批量新增岗位
export const batchCreatePostApi = async (data: batchPostInfoVO) => {
  return await request.post({ url: '/system/post/create/batch', data })
}

// 修改岗位
export const updatePostApi = async (data: PostInfoVO) => {
  return await request.put({ url: '/system/post/update', data })
}

// 修改岗位状态
export const updateStatusApi = async (data) => {
  return await request.put({ url: '/system/post/update-status', data })
}

// 删除岗位
export const deletePostApi = async (id: number) => {
  return await request.delete({ url: '/system/post/delete?id=' + id })
}

// 导出岗位
export const exportPostApi = async (params: PostExportReqVO) => {
  return await request.download({ url: '/system/post/export', params })
}

// 批量创建岗位角色关联
export const batchPostRoleApi = async (data: batchPostRoleVO) => {
  return await request.put({ url: '/system/post-role/update', data })
}

import request from '@/config/axios'

export interface groupReqVO {
  appraiseTypeName: string
  appraiseTypeId?: number
  status?: number
}

export interface topicPageReqVO extends PageParam {
  appraiseTopicType?: number
  appraiseTopicTitle?: string
  status?: number
  beginTime?: string
  endTime?: string
}

export interface topicReqVO {
  appraiseTopicTitle: string
  appraiseTopicType: number
  appraiseTypeId: number
  appraiseTopicId?: number
  matchField?: number
  matchStatus?: number
  maxValue?: number
  optionsList?: [enableExplain?: number, id?: number, optionName?: string, optionRemark?: string]
  status?: number
}

// 题目管理左侧
/** 添加分组 */
export const addGroup = (data: groupReqVO) => {
  return request.post({ url: '/appraise/type/create', data })
}

/** 删除分组 */
export const delGroup = (data: { ids: number[] }) => {
  return request.post({ url: '/appraise/type/batch/delete', data })
}

/** 题目分组列表 */
export const getGroupList = () => {
  return request.get<Questionnaire.GroupList[]>({ url: '/appraise/type/query/all' })
}

//题目管理右侧
/** 查询题目列表 */
export const getTopicList = (data: topicPageReqVO) => {
  return request.post({ url: '/appraise/topic/query/page', data })
}

/** 新增题目 */
export const addTopic = (data) => {
  return request.post({ url: '/appraise/topic/save', data })
}

/** 批量删除题目 */
export const delTopic = (data: { ids: number[] }) => {
  return request.post({ url: '/appraise/topic/batch/delete', data })
}

/** 修改列表状态 */
export const setTopicStatus = (data: { id: number; status: number }) => {
  return request.post({ url: '/appraise/topic/update/status', data })
}

/** 获取匹配字段 */
export const getField = () => {
  return request.get({ url: '/appraise/topic/query/match/field' })
}

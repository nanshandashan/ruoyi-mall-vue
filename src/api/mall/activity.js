import request from '@/utils/request'

// 查询活动表列表
export function listActivity(query, pageReq) {
  return request({
    url: '/mall/activity/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询活动表详细
export function getActivity(id) {
  return request({
    url: '/mall/activity/' + id,
    method: 'get'
  })
}

// 新增活动表
export function addActivity(data) {
  return request({
    url: '/mall/activity',
    method: 'post',
    data: data
  })
}

// 修改活动表
export function updateActivity(data) {
  return request({
    url: '/mall/activity',
    method: 'put',
    data: data
  })
}

// 删除活动表
export function delActivity(id) {
  return request({
    url: '/mall/activity/' + id,
    method: 'delete'
  })
}

// 导出活动表
export function exportActivity(query) {
  return request({
    url: '/mall/activity/export',
    method: 'get',
    params: query
  })
}

import request from '@/utils/request'

// 查询招聘表列表
export function listJobDetail(query, pageReq) {
  return request({
    url: '/mall/jobDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询招聘表详细
export function getJobDetail(id) {
  return request({
    url: '/mall/jobDetail/' + id,
    method: 'get'
  })
}

// 新增招聘表
export function addJobDetail(data) {
  return request({
    url: '/mall/jobDetail',
    method: 'post',
    data: data
  })
}

// 修改招聘表
export function updateJobDetail(data) {
  return request({
    url: '/mall/jobDetail',
    method: 'put',
    data: data
  })
}

// 删除招聘表
export function delJobDetail(id) {
  return request({
    url: '/mall/jobDetail/' + id,
    method: 'delete'
  })
}

// 导出招聘表
export function exportJobDetail(query) {
  return request({
    url: '/mall/jobDetail/export',
    method: 'get',
    params: query
  })
}

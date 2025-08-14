import request from '@/utils/request'

// 查询月报表列表
export function listMonthReport(query, pageReq) {
  return request({
    url: '/mall/monthReport/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询月报表详细
export function getMonthReport(id) {
  return request({
    url: '/mall/monthReport/' + id,
    method: 'get'
  })
}

// 新增月报表
export function addMonthReport(data) {
  return request({
    url: '/mall/monthReport',
    method: 'post',
    data: data
  })
}

// 修改月报表
export function updateMonthReport(data) {
  return request({
    url: '/mall/monthReport',
    method: 'put',
    data: data
  })
}

// 删除月报表
export function delMonthReport(id) {
  return request({
    url: '/mall/monthReport/' + id,
    method: 'delete'
  })
}

// 导出月报表
export function exportMonthReport(query) {
  return request({
    url: '/mall/monthReport/export',
    method: 'get',
    params: query
  })
}

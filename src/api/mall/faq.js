import request from '@/utils/request'

// 查询常见问题表列表
export function listFaq(query, pageReq) {
  return request({
    url: '/mall/faq/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询常见问题表详细
export function getFaq(id) {
  return request({
    url: '/mall/faq/' + id,
    method: 'get'
  })
}

// 新增常见问题表
export function addFaq(data) {
  return request({
    url: '/mall/faq',
    method: 'post',
    data: data
  })
}

// 修改常见问题表
export function updateFaq(data) {
  return request({
    url: '/mall/faq',
    method: 'put',
    data: data
  })
}

// 删除常见问题表
export function delFaq(id) {
  return request({
    url: '/mall/faq/' + id,
    method: 'delete'
  })
}

// 导出常见问题表
export function exportFaq(query) {
  return request({
    url: '/mall/faq/export',
    method: 'get',
    params: query
  })
}

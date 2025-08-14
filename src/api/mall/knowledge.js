import request from '@/utils/request'

// 查询知识表列表
export function listKnowledge(query, pageReq) {
  return request({
    url: '/mall/knowledge/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询知识表详细
export function getKnowledge(id) {
  return request({
    url: '/mall/knowledge/' + id,
    method: 'get'
  })
}

// 新增知识表
export function addKnowledge(data) {
  return request({
    url: '/mall/knowledge',
    method: 'post',
    data: data
  })
}

// 修改知识表
export function updateKnowledge(data) {
  return request({
    url: '/mall/knowledge',
    method: 'put',
    data: data
  })
}

// 删除知识表
export function delKnowledge(id) {
  return request({
    url: '/mall/knowledge/' + id,
    method: 'delete'
  })
}

// 导出知识表
export function exportKnowledge(query) {
  return request({
    url: '/mall/knowledge/export',
    method: 'get',
    params: query
  })
}

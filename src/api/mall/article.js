import request from '@/utils/request'

// 查询文章表列表
export function listArticle(query, pageReq) {
  return request({
    url: '/mall/article/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询文章表详细
export function getArticle(id) {
  return request({
    url: '/mall/article/' + id,
    method: 'get'
  })
}

// 新增文章表
export function addArticle(data) {
  return request({
    url: '/mall/article',
    method: 'post',
    data: data
  })
}

// 修改文章表
export function updateArticle(data) {
  return request({
    url: '/mall/article',
    method: 'put',
    data: data
  })
}

// 删除文章表
export function delArticle(id) {
  return request({
    url: '/mall/article/' + id,
    method: 'delete'
  })
}

// 导出文章表
export function exportArticle(query) {
  return request({
    url: '/mall/article/export',
    method: 'get',
    params: query
  })
}

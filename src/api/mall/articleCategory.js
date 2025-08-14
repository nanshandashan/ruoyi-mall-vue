import request from '@/utils/request'

// 查询文章分类表列表
export function listArticleCategory(query, pageReq) {
  return request({
    url: '/mall/articleCategory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询文章分类表详细
export function getArticleCategory(id) {
  return request({
    url: '/mall/articleCategory/' + id,
    method: 'get'
  })
}

// 新增文章分类表
export function addArticleCategory(data) {
  return request({
    url: '/mall/articleCategory',
    method: 'post',
    data: data
  })
}

// 修改文章分类表
export function updateArticleCategory(data) {
  return request({
    url: '/mall/articleCategory',
    method: 'put',
    data: data
  })
}

// 删除文章分类表
export function delArticleCategory(id) {
  return request({
    url: '/mall/articleCategory/' + id,
    method: 'delete'
  })
}

// 导出文章分类表
export function exportArticleCategory(query) {
  return request({
    url: '/mall/articleCategory/export',
    method: 'get',
    params: query
  })
}

import request from '@/utils/request'

// 查询文章收藏表列表
export function listArticleCollect(query, pageReq) {
  return request({
    url: '/mall/articleCollect/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询文章收藏表详细
export function getArticleCollect(id) {
  return request({
    url: '/mall/articleCollect/' + id,
    method: 'get'
  })
}

// 新增文章收藏表
export function addArticleCollect(data) {
  return request({
    url: '/mall/articleCollect',
    method: 'post',
    data: data
  })
}

// 修改文章收藏表
export function updateArticleCollect(data) {
  return request({
    url: '/mall/articleCollect',
    method: 'put',
    data: data
  })
}

// 删除文章收藏表
export function delArticleCollect(id) {
  return request({
    url: '/mall/articleCollect/' + id,
    method: 'delete'
  })
}

// 导出文章收藏表
export function exportArticleCollect(query) {
  return request({
    url: '/mall/articleCollect/export',
    method: 'get',
    params: query
  })
}

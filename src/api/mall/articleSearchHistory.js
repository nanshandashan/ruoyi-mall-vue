import request from '@/utils/request'

// 查询文章搜索历史表列表
export function listArticleSearchHistory(query, pageReq) {
  return request({
    url: '/mall/articleSearchHistory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询文章搜索历史表详细
export function getArticleSearchHistory(id) {
  return request({
    url: '/mall/articleSearchHistory/' + id,
    method: 'get'
  })
}

// 新增文章搜索历史表
export function addArticleSearchHistory(data) {
  return request({
    url: '/mall/articleSearchHistory',
    method: 'post',
    data: data
  })
}

// 修改文章搜索历史表
export function updateArticleSearchHistory(data) {
  return request({
    url: '/mall/articleSearchHistory',
    method: 'put',
    data: data
  })
}

// 删除文章搜索历史表
export function delArticleSearchHistory(id) {
  return request({
    url: '/mall/articleSearchHistory/' + id,
    method: 'delete'
  })
}

// 导出文章搜索历史表
export function exportArticleSearchHistory(query) {
  return request({
    url: '/mall/articleSearchHistory/export',
    method: 'get',
    params: query
  })
}

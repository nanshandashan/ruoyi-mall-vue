import request from '@/utils/request'

// 查询文章评论表列表
export function listArticleComment(query, pageReq) {
  return request({
    url: '/mall/articleComment/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询文章评论表详细
export function getArticleComment(id) {
  return request({
    url: '/mall/articleComment/' + id,
    method: 'get'
  })
}

// 新增文章评论表
export function addArticleComment(data) {
  return request({
    url: '/mall/articleComment',
    method: 'post',
    data: data
  })
}

// 修改文章评论表
export function updateArticleComment(data) {
  return request({
    url: '/mall/articleComment',
    method: 'put',
    data: data
  })
}

// 删除文章评论表
export function delArticleComment(id) {
  return request({
    url: '/mall/articleComment/' + id,
    method: 'delete'
  })
}

// 导出文章评论表
export function exportArticleComment(query) {
  return request({
    url: '/mall/articleComment/export',
    method: 'get',
    params: query
  })
}

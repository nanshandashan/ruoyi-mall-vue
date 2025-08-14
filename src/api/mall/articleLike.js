import request from '@/utils/request'

// 查询文章点赞表列表
export function listArticleLike(query, pageReq) {
  return request({
    url: '/mall/articleLike/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询文章点赞表详细
export function getArticleLike(id) {
  return request({
    url: '/mall/articleLike/' + id,
    method: 'get'
  })
}

// 新增文章点赞表
export function addArticleLike(data) {
  return request({
    url: '/mall/articleLike',
    method: 'post',
    data: data
  })
}

// 修改文章点赞表
export function updateArticleLike(data) {
  return request({
    url: '/mall/articleLike',
    method: 'put',
    data: data
  })
}

// 删除文章点赞表
export function delArticleLike(id) {
  return request({
    url: '/mall/articleLike/' + id,
    method: 'delete'
  })
}

// 导出文章点赞表
export function exportArticleLike(query) {
  return request({
    url: '/mall/articleLike/export',
    method: 'get',
    params: query
  })
}

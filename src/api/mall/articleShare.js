import request from '@/utils/request'

// 查询文章分享表列表
export function listArticleShare(query, pageReq) {
  return request({
    url: '/mall/articleShare/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询文章分享表详细
export function getArticleShare(id) {
  return request({
    url: '/mall/articleShare/' + id,
    method: 'get'
  })
}

// 新增文章分享表
export function addArticleShare(data) {
  return request({
    url: '/mall/articleShare',
    method: 'post',
    data: data
  })
}

// 修改文章分享表
export function updateArticleShare(data) {
  return request({
    url: '/mall/articleShare',
    method: 'put',
    data: data
  })
}

// 删除文章分享表
export function delArticleShare(id) {
  return request({
    url: '/mall/articleShare/' + id,
    method: 'delete'
  })
}

// 导出文章分享表
export function exportArticleShare(query) {
  return request({
    url: '/mall/articleShare/export',
    method: 'get',
    params: query
  })
}

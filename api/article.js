export default ({$axios}, inject) => {

  // 文章-根据文章ID-查询文章详情（  @PathVariable 传参方式 ）
  inject('getArticleById', articleId => $axios.$get(`/article/api/article/${articleId}`))
  // 文章-根据ID删除文章
  inject('removeArticleById', articleId => $axios.$delete(`/article/article/remove/${articleId}`))

  // 文章详情右则 - 轮播图
  inject('getArticleLooperList', () => $axios.$get(`/article/api/looper/article`))

  // 文章-新增文章
  inject('addArticle', data => $axios.$post(`/article/article/add`, data))
  // 所有文章图片-新增文章时保存用户上传的所有图片-系统比对删除垃圾图片用
  inject('addPicture', data => $axios.$post(`/article/picture/add`, data))

  // 文章-查看编辑状态-文章、草稿详情
  inject('getEditArticleById', articleId => $axios.$get(`/article/article/user/edit/${articleId}`))

  // 文章-编辑文章或草稿
  inject('updateArticle', data => $axios.$put(`/article/article/update`, data))

  // 草稿-查看草稿详情
  inject('getArticleDraftInfoById', articleId => $axios.$get(`/article/article/draft/${articleId}`))

  // ES 搜索文章
  inject('search', (keyword, current, size) => $axios.$get(`/article/api/article/search/${keyword}/${current}/${size}`))


}

export default ({$axios}, inject) => {

  // 随机诗语管理-条件分页查询
  inject('getAphorismListPage', (current, size, query) => $axios.$post(`/article/aphorism/search/${current}/${size}`, query))
  // 随机诗语管理-新增
  inject('addAphorism', data => $axios.$post(`/article/aphorism/add`, data))
  // 随机诗语管理-根据 ID 查询详情
  inject('getAphorismById', id => $axios.$get(`/article/aphorism/view/${id}`))
  // 随机诗语管理-根据 ID 编辑
  inject('updateAphorism', data => $axios.$put(`/article/aphorism/update`, data))
  // 随机诗语管理-根据 ID 删除
  inject('deleteAphorismById', (id) => $axios.$delete(`/article/aphorism/remove/${id}`))

  // 文章列表-条件分页获取
  inject('getAdminArticleListPage', (current, size, query) => $axios.$post(`/article/article/front/search/${current}/${size}`, query))
  // 推荐文章
  inject('recommendYes', (articleId) => $axios.$get(`/article/article/recommend/${articleId}`))
  // 取消推荐文章
  inject('recommendNo', (articleId) => $axios.$get(`/article/article/recommend/cancel/${articleId}`))

  // 公告管理-条件分页查询
  inject('getAnnouncementListPage', (current, size, query) => $axios.$post(`/system/announcement/admin/search/${current}/${size}`, query))
  // 公告管理-新增
  inject('addAnnouncement', data => $axios.$post(`/system/announcement`, data))
  // 公告管理-根据 ID 查询详情
  inject('getAnnouncementById', id => $axios.$get(`/system/announcement/${id}`))
  // 公告管理-根据 ID 编辑
  inject('updateAnnouncement', data => $axios.$put(`/system/announcement`, data))
  // 公告管理-根据 ID 删除
  inject('deleteAnnouncementById', (id) => $axios.$delete(`/system/announcement/${id}`))
  // 公告管理-启用或停用
  inject('updateStatusByAnnouncementId', (id, status) => $axios.$get(`/system/announcement/update/status/${id}/${status}`))

  // 分类管理-获取树形分类列表
  inject('getCategoryList', () => $axios.$get(`/article/api/category/search`))
  // 分类管理-新增
  inject('addCategory', data => $axios.$post(`/article/category/save`, data))
  // 分类管理-根据ID查询分类
  inject('getCategoryById', id => $axios.$get(`/article/category/${id}`))
  // 分类管理-根据 ID 编辑
  inject('updateCategoryById', data => $axios.$put(`/article/category/update`, data))
  // 分类管理-修改分类顺序
  inject('updateCategorySort', data => $axios.$put(`/article/category/update/sort`, data))
  // 分类管理-批量或单个删除 TODO 删除失败，没调用到后端接口，不知道怎么回事，肯定是接口传参有问题
  inject('deleteCategory', categoryIds => $axios.$delete(`/article/category/remove`, categoryIds))

  // 轮播图片-条件分页查询
  inject('getLoopListPage', (current, size, query) => $axios.$post(`/article/looper/search/${current}/${size}`, query))
  // 轮播图片-启用
  inject('auditPass', id => $axios.$get(`/article/looper/pass/${id}`))
  // 轮播图片-停用
  inject('auditNoPass', id => $axios.$get(`/article/looper/fail/${id}`))


}

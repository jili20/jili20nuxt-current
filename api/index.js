export default ({$axios}, inject) => {

  // 首页 - 条件分页查询文章列表
  inject('getArticleListPage', (current, size, query) => $axios.$get(`/article/api/article/list/${current}/${size}`, {params: query}))

  // 获取树状分类数据
  inject('getCategoryList', () => $axios.$get('/article/api/category/search'))

  // 门户网站 - 首页顶部 - 轮播图
  inject('getTopLooperList', () => $axios.$get(`/article/api/looper/top`))

  // 门户网站 - 首页右则下 - 轮播图
  inject('getRightLooperList', () => $axios.$get(`/article/api/looper/right`))

  // 门户网站 - 投放诗语详情右则 - 轮播图
  inject('getPatronRightLooperList', () => $axios.$get(`/article/api/looper/right/patron`))

  // 门户网站 - 首页右则 - 文章推荐
  inject('getArticleRecommendList', () => $axios.$get(`/article/api/article/recommend`))

  // 随机诗语
  inject('getRandomTip', () => $axios.$get(`/article/api/aphorism/random`))

  // 查询前 30 位1元投放诗语人
  inject('getOneTop', () => $axios.$get(`/system/api/one/top`))

  // 首页、搜索页面-更新轮播图背景图片
  inject('getBackgroundOne', () => $axios.$get(`/article/api/background/one`))

  // 系统公告
  inject('getAnnouncementOne', () => $axios.$get(`/system/api/announcement/use`))

  // 热搜榜
  inject('getSearchHotWorlds', () => $axios.$get(`/article/api/article/hto-words`))
}

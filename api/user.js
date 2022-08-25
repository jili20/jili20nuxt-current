export default ({$axios}, inject) => {

  // 用户登录 - 获取图灵验证码 (  @RequestParam 传参方式 ）
  inject('getCaptcha', (loginInfo) => $axios.$get(`/system/api/user/captcha`, {params: loginInfo}))
  // 用户登录
  inject('userLogin', data => $axios.$post(`/system/api/user/login`, data))
  // 退出登录
  inject('logout', () => $axios.$delete(`/system/user/logout`))

  // 用户找回密码 - 发送手机短信验证码
  inject('sendFindPasswordByPhoneCode', phone => $axios.$get(`/sms/api/send/update/password/${phone}`))
  // 用户手机验证码找回密码
  inject('userFindPasswordByPhoneCode', data => $axios.$post(`/system/api/user/findPasswordByPhoneCode`, data))
  // 用户找回密码 - 发送邮箱验证码
  inject('sendEmailCode', email => $axios.$get(`/sms/api/sendMailCode/${email}`))
  // 用户邮箱找回密码
  inject('userFindPasswordByEmailCode', data => $axios.$post(`/system/api/user/findPasswordByEmailCode`, data))

  // 新增投放诗语
  inject('addPatron', data => $axios.$post(`/system/one/add`, data))
  // 投放诗语列表
  inject('getPatronListPage', (current, size, query) => $axios.$get(`/system/api/one/one/list/${current}/${size}`, {params: query}))
  // 删除投放诗语人信息
  inject('deleteByOneId', (id) => $axios.$delete(`/system/one/user/remove/${id}`))

  // 用户投放轮播图片
  inject('addLooper', data => $axios.$post(`/article/looper/add`, data))
  // 门户网站 - 投放轮播图页面 - Top15轮播图信息
  inject('getLooperTop15List', () => $axios.$get(`/article/api/looper/top15`))
  // 门户网站 - 条件分页查询 - 已审核通过的所有轮播图列表
  inject('getLooperListPage', (current, size, query) => $axios.$get(`/article/api/looper/list/${current}/${size}`, {params: query}))

  // 个人主页-根据路由用户ID-获取用户基本信息
  inject('getUserInfoByRouteId', userId => $axios.$get(`/system/api/user/info/${userId}`))

  // 个人主页-统计-文章微服务
  inject('statisticCountArticle', userId => $axios.$get(`/article/api/statistic/total/${userId}`))
  // 个人主页-统计-用户微服务
  inject('statisticCountUser', userId => $axios.$get(`/system/api/user/total/${userId}`))

  // 个人主页-文章列表
  inject('getUserArticleList', (routeId, userId, current, size, query) => $axios.$get(`/article/api/article/user/${routeId}/${userId}/${current}/${size}`, {params: query}))
  // 个人主页-条件分页查询留言列表
  inject('getUserCommentList', (routeId, userId, current, size, query) => $axios.$get(`/article/api/comment/user/${routeId}/${userId}/${current}/${size}`, {params: query}))
  // 个人主页-关注人列表
  inject('getUserFolloweeList', (routeId, current, size, userId) => $axios.$get(`/system/api/follow/followee/list/${routeId}/${current}/${size}/${userId}`))
  // 个人主页-粉丝列表
  inject('getUserFollowerList', (routeId, current, size, userId) => $axios.$get(`/system/api/follow/follower/list/${routeId}/${current}/${size}/${userId}`))
  // 个人主页-收到的赞
  inject('getUserThumbList', (userId, current, size) => $axios.$get(`/article/api/thumb/user/list/${userId}/${current}/${size}`))
  // 个人主页-点过的赞
  inject('getUserDoThumbList', (userId, current, size) => $axios.$get(`/article/api/thumb/do/list/${userId}/${current}/${size}`))

  // 个人主页-用户投图投放诗语列表
  inject('getUserLooperList', (userId, current, size) => $axios.$get(`/article/api/looper/list/${userId}/${current}/${size}`))

  // 私人空间-动态流
  inject('getUserAndFolloweeArticleList', (current, size) => $axios.$get(`/article/api/article/user/${current}/${size}`))
  // 私人空间-草稿-用户草稿列表（包括审核未通过的文章）
  inject('getUserDraftArticleList', (userId, current, size) => $axios.$get(`/article/api/article/user/draft/${userId}/${current}/${size}`))
  // 私人空间-轮播图-用户所有投放的轮播图
  inject('getUserAllLooperList', (userId, current, size) => $axios.$get(`/article/api/looper/user/all/${userId}/${current}/${size}`))
  // 私人空间-轮播图-根据ID-删除轮播图
  inject('removeUserLooperById', (id) => $axios.$delete(`/article/looper/remove/${id}`))
  // 私人空间-轮播图-根据ID-查询编辑状态的轮播图详情
  inject('getEditUserLooperById', (looperId) => $axios.$get(`/article/looper/${looperId}`))
  // 私人空间-轮播图-根据ID-编辑轮播图
  inject('updateLooperById', data => $axios.$put(`/article/looper/update`, data))

  // 私人空间-设置-用户修改用户名
  inject('updateUsername', (data) => $axios.$post(`/system/user/update/username`, data))
  // 私人空间-设置-用户修改个性签名
  inject('updateUserSign', (data) => $axios.$post(`/system/user/update/sign`, data))

  // 私人空间-设置-用户修改密码
  inject('updatePassword', data => $axios.$post(`/system/user/updatePassword`, data))
  // 私人空间-设置-用户修改头像
  inject('updateAvatar', data => $axios.$post(`/system/user/update/avatar`, data))

  // 导入数据到 es
  inject('importEsData', () => $axios.$post(`/article/es/import-data`))
  inject('deleteEsIndex', () => $axios.$delete(`/article/es/delete-index`))

}

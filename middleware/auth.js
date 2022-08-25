// 运行在服务端
export default ({store, route, redirect}) => {
  // 权限判断，判断是否已经通过身份认证
  if (!store || !store.state.userInfo) {
    // 未认证，则跳转到认证中心
    const redirectURL = process.env._AXIOS_BASE_URL_.replace('api', '') + route.path
    // 重定向
    redirect(`http:${process.env.authURL}?redirectURL=${redirectURL}`) // 行
    // redirect(`${process.env.authURL}?redirectURL=${redirectURL}`) // 行
  }
}

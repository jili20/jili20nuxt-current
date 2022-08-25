import {Message} from 'element-ui'

export default ({store, route, redirect, $axios, app}) => {

  // 请求拦截器
  $axios.onRequest(config => {
    // 获取状态仓库中的 token
    const token = store.state.token
    // 如果有 token，请求头上带上 token
    if (token) {
      config.headers.token = token
      config.headers.common['Authorization'] = token;
    }
    return config
  })

  // 响应拦截器
  $axios.onResponse(response => {
    if (!store.state.token) {
    }
    return response
  })

  // 异常拦截器
  $axios.onError(error => {
    if (error.response) {
      const code = parseInt(error.response && error.response.status);
      switch (code) {
        case 101:
          Message({
            message: '最大支持上传2MB的图片 ',
            type: 'error',
            showClose: true,
            duration: 3 * 1000
          });
          break;
        case 401:
          Message({
            message: '请登录后再操作 ',
            type: 'error',
            showClose: true,
            duration: 3 * 1000
          });
          setTimeout(() => {
            window.location.href = `${process.env.authURL}?redirectURL=${window.location.href}`
          }, 2000)
          break;
        case 403:
          Message({
            message: '权限不足',
            type: 'error',
            showClose: true,
            duration: 3 * 1000
          });
          setTimeout(() => {
            window.location = '/auth/login';
            // redirect({path: '/auth/login'})
          }, 2000)
          break;
        case 405:
          Message({
            message: '您的身份已过期，请重新登录',
            type: 'error',
            duration: 3 * 1000
          });
          setTimeout(() => {
            window.location = '/auth/login';
          }, 2000)
          break;
        case 406:
          Message({
            message: '您的身份已过期，请重新登录',
            type: 'error',
            duration: 3 * 1000
          });
          setTimeout(() => {
            window.location = '/auth/login';
          }, 2000)
          break;
        case 503:
          Message({
            message: '您的身份已过期，请重新登录',
            type: 'error',
            duration: 3 * 1000
          });
          setTimeout(() => {
            redirect({path: '/auth/login'})
          }, 2000)
          break;
        case 407:
          Message({
            message: '出问题啦',
            type: 'error',
            duration: 3 * 1000
          });
          setTimeout(() => {
            redirect({path: '/auth/login'})
          }, 2000)
          break;
        default:
          Message({
            // message: '连接服务器失败!',
            message: '粗问题啦!',
            type: 'error',
            duration: 3 * 1000
          });
      }
    }
    if (error.response.status !== 200) {
      return Promise.reject(error)
    }
    // if (error.response.status === 401) {
    //   return Promise.reject(error)
    // }
    return Promise.reject('请登录后再操作')
  })
}

// 获取重定向地址
const redirectURL = (route) => {
  // 客户端
  if (process.client) {
    return window.location.href
  }
  // 服务端 process.env._AXIOS_BASE_URL_  http://localhost:3000/api   http://jili20.com/api
  return process.env._AXIOS_BASE_URL_.replace('api', '') + route.path
}

// 定义数据（state 的值应该始终是 function，为了避免返回引用类型，导航多个实例相同相互影响）
const state = () => ({
  token: null,
  userInfo: null
})


// 调用方法，改变状态
const mutations = {

  // 获取用户登录信息状态
  UPDATE_USER_STATE(state, data) {
    state.token = data.token
    state.userInfo = data.userInfo
  },

  // 用户退出登录，清空用户信息
  RESET_USER_STATE(state) {
    // 状态置空
    state.token = null
    state.userInfo = null
  }
}

// 写方法
const actions = {

  // 用户登录，获取用户信息
  // nuxt提供的，每次发送请求都会先调用此方法 ，并且第1个参数store, 该方法的第2个参数是context,
  nuxtServerInit({commit}, {app: {$cookies}}) {
    // console.log('nuxtServerInit 执行了....')
    const data = {}
    // 取出 cookie 中的 token
    data.token = $cookies.get('token')
    data.userInfo = $cookies.get('userInfo')
    // 更新状态值
    commit('UPDATE_USER_STATE', data)
  },
  // 用户退出登录
  userLogout({commit}) {
    // 重置状态
    commit('RESET_USER_STATE')
  },

  // 重置用户状态
  resetUserState({commit}) {
    // 重置状态
    commit('RESET_USER_STATE')
  }
}

// 简化数据
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}

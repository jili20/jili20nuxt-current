export default {
  // Global page headers: https://go.nuxtjs.dev/config-head

  env: {
    // 登录页面 URL， process.env.authURL
    authURL: process.env.NODE_ENV === 'dev' ? '//localhost:3000/auth/login' : '//www.jili20.com/auth/login'
  },

  head: {
    title: '经历网，为留住您的经历而生',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      // {name: "referrer", content: "no-referrer"}, // 隐藏发送请求时请求头表示来源的referrer字段。
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: '人生经历、文学艺术、文明礼节、思想哲学、个人宣言'},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/jili20.ico'}
    ]
  },
  /**
   * 定义系统默认 loading 效果，或者指定 loading 组件
   */
  loading: {color: '#f0c61f', height: '3px'},

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [ // 全局引入样式
    'element-ui/lib/theme-chalk/index.css', // 针对 element-ui 组件的各种样式
    'element-ui/lib/theme-chalk/display.css', // 布局样式
    '@/assets/theme/index.css', // 主题
    '@/assets/css/global.css',
    'element-tiptap/lib/index.css', // element-tiptap 编辑器样式
    '@/assets/css/iconfont.css' // 阿里字体图标样式
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/element-ui.js',
      ssr: true // 不支持ssr的插件只会在客户端运行不要给 true
    },
    { // 拦截器，请求头带上token
      src: '~/plugins/interceptor.js',
      ssr: true // 服务端渲染
    },
    {
      src: '~/plugins/element-tiptap.js',
      mode: 'client'
    },
    { // 阿里字体图标
      src: '@/assets/js/iconfont.js',
      mode: 'client'
    },
    {src: '~/plugins/SlideVerify', ssr: false }, //滑块验证
    '~/api/user.js',
    '~/api/index.js',
    '~/api/upload.js',
    '~/api/article.js',
    '~/api/admin.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt' // 针对服务端操作cookie
  ],

  axios: {
    proxy: true, //开启代理转发
    prefix: '/api/', // 请求接口添加前缀 /api   /test > /api/test
    credentials: true
  },
  // 生产环境
  // proxy: {
  //   '/api': {
  //     target: 'http://120.78.209.73:6000',
  //     pathRewrite: {
  //       '^/api/': '',
  //       changeOrigin: true
  //     }
  //   }
  // },
  // 开发环境
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:6000',
      pathRewrite: {
        '^/api/': '',
        changeOrigin: true
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/] // 只打包 element-ui 开头的元素
  }
}

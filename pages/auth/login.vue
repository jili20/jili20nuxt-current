<template>
  <div class="login_page">
    <div class="login_box">
      <div class="txt">
        <br>
        <b>&nbsp;&nbsp;经历网，为留住您的经历而生！</b>
        <p>Born to keep your experience!</p>
      </div>
      <div class="center_box">
        <!-- 登录-->
        <div :class="{login_form: true, rotate: tab === 2}">
          <div :class="{tabs: true, r180: reverse === 2}">
            <div class="fl tab" @click="changeTab(1)">
              <span :class="{on: tab === 1}">登录</span>
            </div>
            <div class="fl tab" @click="goToRegister">
              <!-- 去除翻转功能 -->
              <!-- <div class="fl tab" @click="changeTab(2)">-->
              <!-- <span :class="{on: tab === 2}">投放诗语</span>-->
              <span>注册</span>
            </div>
          </div>
          <!-- 登录开始 -->
          <div class="form_body" v-if="reverse === 1">
            <el-form :rules="rules" ref="loginForm" :model="user" label-width="70px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model.trim="user.username" clearable maxlength="30"
                          placeholder=" 用户名 / 手机号 / 邮箱"/>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model.trim="user.password" type="password" show-password clearable maxlength="20"
                          show-word-limit placeholder="请输入密码" @keyup.enter.native="doLogin('loginForm')"/>
              </el-form-item>
              <!-- 要添加 client-only 标签，否则报错 -->
              <client-only>
                <slide-verify :l="42"
                              :r="10"
                              :w="300"
                              :h="155"
                              class="verify"
                              ref="slideblock"
                              slider-text="请向右滑动登录"
                              @success="onSuccess('loginForm')"
                              @fail="onFail"
                              @refresh="onRefresh"
                ></slide-verify>
              </client-only>
              <div style="clear: both;text-align: right;">
                <br>
                <nuxt-link to="/auth/register" class="forgetPwd">&nbsp;&nbsp;注册 |</nuxt-link>
                <nuxt-link to="/auth/phone" class="forgetPwd">忘记密码 |</nuxt-link>
                <span class="forgetPwd" @click="resetForm('loginForm')"> 重置</span>
              </div>
            </el-form>
          </div>
          <!-- /登录结束 -->
          <!-- 投放诗语 开始 -->
          <div class="form_body r180" v-if="reverse === 2">
            <!-- 去除翻转功能 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  // 动态标题
  head() {
    return {
      title: '登录 - 经历网'
    }
  },
  data() {
    return {
      tab: 1, // 高亮当前标签名
      reverse: 1, // 旋转 1 登录，2 注册
      // 登录表单对象
      user: {
        username: '',
        password: ''
      },
      // 数据校验-登录表单
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 1, max: 30, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ]
      },
      // redirectURL: ('//localhost:3000') // 开发环境/生产环境-登录成功后重定向地址
      redirectURL: ('//www.jili20.com') // 开发环境/生产环境-登录成功后重定向地址
    }
  },
  async created() {
    // 获取来源地址
    if (this.$route.query.redirectURL) {
      // http://localhost:3000///user/notice/1 将跳转回来的地址去掉 两个 /
      this.redirectURL = this.$route.query.redirectURL.replace('///', '/')
    }
  },
  methods: {
    // 滑块验证登录
    async onSuccess(loginForm) {
      this.$refs[loginForm].validate(async (valid) => {
        if (valid) {
          await this.$userLogin(this.user).then(response => {
            if (response.code === 200) {
              // 设置 cookie（再设置过期时间，暂时防止token过期，页面报错 ）
              this.$cookies.set('token', response.data.user.token, {
                path: '/',
                maxAge: 43080 // 12小时 / TODO 还要设置 cookie 有效范围
              })
              // this.$cookies.set('userInfo', response.data.user.userInfo)
              this.$cookies.set('userInfo', response.data.user.userInfo, {
                path: '/',
                maxAge: 43080 // 17900 5小时 / TODO 还要设置 cookie 有效范围
              })
              // 跳转到 home 首页，使用刷新页面的方法，跳转到首页，马上能获取到用户信息
              this.$message.success('登录成功');
              // 如果在私信详情页面cookie失效了，重定向到登录页面，登录成功，跳转到私信首页，因获取不到私信会话id
              // if (this.redirectURL === 'http://localhost:3000/user/message/letter') {
              if (this.redirectURL === 'http://www.jili20.com/user/message/letter') {
                window.location = '/user/message/' + this.userId;
                return
              }
              window.location.href = this.redirectURL;
            } else {
              this.$message.error(response.message)
              this.$refs.slideblock.reset();
            }
          })
        } else {
          // 跳转到 home 首页
          window.location = '/auth/login';
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 滑块验证失败
    onFail() {
      this.$message.error('验证失败，请重试！')
    },
    // 刷新滑块验证
    onRefresh() {
      this.$refs.slideblock.reset();
    },
    goToRegister() {
      this.$router.push('/auth/register')
    },
    // 切换标签
    changeTab(int) {
      this.tab = int;
      let _that = this;
      setTimeout(() => {
        this.reverse = int
      }, 200)
    },
    // 重置登录表单
    resetForm(loginForm) {
      this.$refs[loginForm].resetFields();
    }
  }
}
</script>
<style scoped lang="less">

.el-form {
  padding-top: 20px;

  .verify {
    float: right;
  }
}

// 忘记密码
.forgetPwd {
  margin-top: 10px;
  font-size: 14px;
  color: #2b89db !important;
  cursor: pointer;
}

.forgetPwd:hover {
  color: #8205c6 !important;
}

.el-form-item__content {
  line-height: 1px !important;
}

// 网站标题
.login_box {
  .txt, .b {
    font-size: 20px;
  }

  // 网站标题
  .txt {
    padding-top: 10px;
    text-align: center;
    font-size: 18px;
    color: #eee;
  }
}

.login_page .login_form.rotate {
  transform: rotateY(-180deg);
}

.login_page .form_body {
  padding: 0 30px 20px;
  border-radius: 0 0 6px 6px;
  background: #efefef;
}

// 翻转
.fl {
  float: left;
  border-radius: 6px;
  background-color: #efefef;
}

.login_page .btn_box {
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}

.login_page .tabs {
  height: 60px;
  line-height: 60px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
}

.login_page .tabs .tab {
  width: 50%;
  line-height: 60px;
  font-size: 18px;
  text-align: center;
  cursor: pointer;
}


// 登录、注册 激活下划线
.login_page .tabs .on {
  border-bottom: 2px solid #345dc2;
  color: #345dc2;
}

// 旋转角度
.login_page .r180 {
  transform: rotateY(-180deg);
}

// 登录按钮
.e-button {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  color: white;
  border-radius: 4px;
  background-color: #355bbb;
}

// 让表单在最上面
.center_box {
  z-index: 10;
}

.login_page .login_box {
  height: 680px;
  background: url('~@/pages/auth/img/login.jpg') no-repeat;
  background-size: cover;
}

/* PC */
@media only screen and (min-width: 960px) {
  .login_page .login_box .center_box {
    position: relative;
    width: 100%;
  }

  .login_page .login_form {
    position: absolute;
    top: 40px;
    right: 300px;
    width: 380px;
    border-radius: 6px;
    background: #efefef;
    transition: all 0.8s;
    transform: perspective(600px);
  }
}

/* sm 旋转动画效果 */
@media only screen and (max-width: 960px) {

  .login_page .login_box .center_box {
    position: relative;
    width: 100%;
  }

  .login_page .login_form {
    position: absolute;
    top: 40px;
    width: 100%;
    border-radius: 6px;
    background: #d5d3d3;
    transition: all 0.8s;
    transform: perspective(600px);
  }
}

</style>


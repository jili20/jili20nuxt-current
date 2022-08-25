<template>
  <div class="login_page">
    <div class="login_box">
      <div class="txt">
        <p class="tex-title">经历网，为留住您的经历而生！</p>
        <b>&nbsp;&nbsp;经历网，为留住您的经历而生！</b>
        <p>Born to keep experience!</p>
      </div>
      <div class="center_box">
        <!-- 手机找回密码 & 随机投放诗语 -->
        <div :class="{login_form: true, rotate: tab === 2}">
          <div :class="{tabs: true, r180: reverse === 2}">
            <div class="fl tab" @click="changeTab(1)">
              <span :class="{on: tab === 1}">找回密码</span>
            </div>
            <div class="fl tab" @click="changeTab(2)">
              <span :class="{on: tab === 2}">随机诗语</span>
            </div>
          </div>
          <!-- 手机找回密码 开始 -->
          <div class="form_body" v-if="reverse === 1">
            <el-form :rules="rules" ref="ruleForm" :model="user" label-width="80px">
              <el-form-item label="手机号" prop="phone">
                <div class="p">
                  <el-input v-model.number="user.phone" clearable maxlength="11" placeholder="请输入手机号"></el-input>
                  <!-- <el-button class="code-btn" type="primary" v-if="!sending" @click="sendPhoneCode()">获取验证码</el-button>-->
                  <el-button class="code-btn" type="primary" v-if="!sending">获取验证码</el-button>
                  <el-button class="code-btn" type="primary" v-else disabled> {{ leftSecond }} 秒后重发</el-button>
                </div>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-input v-model.trim="user.code" clearable maxlength="4" show-word-limit
                          placeholder="请输入验证码"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model.trim="user.newPassword" type="password" show-password clearable maxlength="20"
                          show-word-limit
                          placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model.trim="user.confirmPassword" type="password" show-password clearable maxlength="20"
                          show-word-limit
                          placeholder="请输入确认密码"></el-input>
              </el-form-item>
              <el-form-item>
                <nuxt-link to="/auth/email" class="forgetPwd">邮箱找回密码</nuxt-link>
                <el-divider direction="vertical"/>
                <span class="forgetPwd" @click="resetForm('ruleForm')"> 清空</span>
                <!-- <el-button class="e-button" v-show="a" @click="findPasswordByPhoneCode('ruleForm')">重置密码</el-button>-->
                <el-button class="e-button" v-show="a">重置密码</el-button>
                <el-button class="e-button" v-show="b" disabled="disabled">进行中 ···</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- /手机找回密码 结束 -->
          <!-- 投放诗语 开始 -->
          <div class="form_body r180" v-if="reverse === 2">
            <div class="random-tip">
              <p>{{ randomTip.content }}</p>
              <p class="author" v-if="randomTip.author">
                ——{{ randomTip.author }}</p>
            </div>
          </div>
          <!-- /投放诗语 结束 -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "phone",
  // 动态标题
  head() {
    return {
      title: '手机号找回密码 - 经历网'
    }
  },
  async asyncData({app}) {
    // 随机诗语
    const {data: aphorism} = await app.$getRandomTip()
    const randomTip = aphorism.randomTip
    return {
      randomTip
    }
  },
  data() {
    return {
      tab: 1, // 高亮当前标签名
      reverse: 1, // 旋转 1 登录，2 注册
      a: true, // 提交状态
      b: false, // 中提交状态
      // 找回密码
      user: {
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        phone: [
          {required: true, message: '手机号码不能为空', trigger: 'blur'},
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入11位合法手机号码',
            trigger: 'blur'
          }
        ],
        code: [
          {required: true, message: '请输入手机短信验证码', trigger: 'blur'},
          {min: 4, max: 4, message: '长度为 4 位数', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ]
      },
      subState: false, // 提交状态
      sending: false, // 是否发送验证码
      second: 60, // 倒计时间
      leftSecond: 0, // 剩余时间
    }
  },
  methods: {
    // 重置登录表单
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    // 动态改变协议 dialog 的宽度
    setDialogWidth() {
      this.dialogVisible = true
      const val = document.body.clientWidth;
      const def = "800" // 默认宽度
      if (val < def) {
        this.dialogWidth = '90%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    // 切换标签
    changeTab(int) {
      this.tab = int;
      let _that = this;
      setTimeout(() => {
        this.reverse = int
      }, 200)
    },
    // 发送手机短信验证码
    async sendPhoneCode() {
      // 防止重复提交
      if (this.sending) return
      // 显示倒计时
      this.sending = true
      // 倒计时
      this.timeDown()
      const {code, message} = await this.$sendFindPasswordByPhoneCode(this.user.phone)
      if (code !== 200) {
        // 清空倒计时间
        this.leftSecond = null
        this.$message.error(message)
        return false
      }
    },
    // 发送手机短信验证码-倒计时
    timeDown() {
      this.leftSecond = this.second
      const timmer = setInterval(() => {
        this.leftSecond--
        if (this.leftSecond <= 0) {
          //停止计时
          clearInterval(timmer)
          this.sending = false
        }
      }, 1000)
    },
    // 修改密码
    async findPasswordByPhoneCode(ruleForm) {
      // 注册中，不能重复提交
      if (this.subState) {
        return false
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$userFindPasswordByPhoneCode(this.user).then(response => {
            this.b = true
            this.a = false
            if (response.code === 200) {
              this.a = true
              this.b = false
              this.$message.success(response.message)
              this.$router.push('/auth/login')
            } else {
              this.a = true
              this.b = false
              this.$message.error(response.message)
              this.$router.push('/auth/phone')
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
<style scoped lang="less">

.el-form {
  padding-top: 20px;

  .p {
    display: flex;
  }
}

// 随机诗语
.random-tip {
  padding: 10px 20px 30px 28px;
  margin-top: 20px;
  font-size: 16px;

  .author {
    float: right;
    margin-right: 8px;
    margin-bottom: 20px;
  }

  p {
    font-size: 16px;
  }
}

/* 显示图灵验证码图片 */
.captcha_code {
  width: 100%;
  height: 100px;
  margin-top: 5px;
  vertical-align: middle;
  border: solid 2px #ededed;
  border-radius: 5px;
  cursor: pointer;
}

// 忘记密码
.forgetPwd {
  padding-bottom: 10px;
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

    .tex-title {
      opacity: 0;
    }
  }
}


// 协议按钮 div
.dialog-div {
  display: flex;
  justify-content: center;
  margin-top: 30px;

  .el-button {
    color: white;
    background-color: #355bbb;
  }
}

.login_page .login_form.rotate {
  transform: rotateY(-180deg);
}

.login_page .form_body {
  padding: 0 20px 20px;
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
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
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
  text-align: center;
  font-size: 18px;
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

// 注册按钮
.e-button {
  width: 100%;
  height: 40px;
  color: white;
  border-radius: 4px;
  background-color: #355bbb;
}

// 发送手机验证码按钮
.code-btn {
  margin-left: 10px;
  color: white;
  background-color: #355bbb;
}


// 让注册表单在最上面
.center_box {
  z-index: 10;

  // 《用户协议》文字颜色
  .form_body {
    a {
      color: #355bbb;
    }
  }
}


// 找回密码
.find {
  margin-right: 10px;
  text-align: right;
  font-size: 14px;
  color: #355bbb;
}

.find:hover {
  cursor: pointer;
}


.login_page .login_box {
  height: 640px;
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


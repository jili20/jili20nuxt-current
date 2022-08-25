<template>
  <div class="login_page">
    <div class="login_box">
      <div class="txt">
        <p class="tex-title">经历网，为留住您的经历而生！</p>
        <b>&nbsp;&nbsp;经历网，为留住您的经历而生！</b>
        <p>Born to keep your experience!</p>
      </div>
      <div class="center_box">
        <!-- 注册-->
        <div :class="{login_form: true, rotate: tab === 2}">
          <div :class="{tabs: true, r180: reverse === 2}">
            <div class="fl tab" @click="changeTab(1)">
              <span :class="{on: tab === 1}">注册</span>
            </div>
            <div class="fl tab" @click="goToLogin">
              <span>登录</span>
            </div>
          </div>
          <!-- 注册开始 -->
          <div class="form_body" v-if="reverse === 1">
            <el-form :rules="rules" ref="registerForm" :model="user" label-width="80px">
              <el-form-item label="手机号码" prop="phone">
                <div style="display: flex;">
                  <el-input v-model.number="user.phone" clearable maxlength="11" placeholder="请输入手机号"/>
                  <el-button class="code-btn" type="primary" v-if="!sending" @click="setTipDialogWidth">获取验证码
                  </el-button>
                  <el-button class="code-btn" type="primary" v-else disabled> {{ leftSecond }} 秒后重发</el-button>
                </div>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input v-model.trim="user.username" clearable maxlength="10" show-word-limit
                          placeholder="请输入用户名"/>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-input v-model.trim="user.code" clearable maxlength="4" show-word-limit
                          placeholder="请输入验证码"/>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model.trim="user.password" type="password" show-password clearable maxlength="20"
                          show-word-limit
                          placeholder="请输入密码"/>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model.trim="user.confirmPassword" type="password" show-password clearable maxlength="20"
                          show-word-limit
                          placeholder="请输入确认密码"/>
                <nuxt-link to="/auth/login" class="goto">&nbsp;&nbsp;登录 |</nuxt-link>
                <span class="goto" @click="resetForm('registerForm')">  &nbsp;重置</span>
              </el-form-item>
              <el-form-item>
                <input type="checkbox" id="agree" v-model="user.check"/>
                <label for="agree">我已经阅读并同意</label>
                <span class="xy" @click="setDialogWidth">《用户协议》</span>
                <el-button class="e-button" v-show="a" @click="setTipDialogWidth">立即注册</el-button>
                <el-button class="e-button" v-show="b" disabled="disabled">注册中 ···</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- /注册结束 -->
          <!-- 投放诗语 开始 -->
          <div class="form_body r180" v-if="reverse === 2">
            <!-- 去除了翻转功能 -->
          </div>
          <!-- /投放诗语 结束 -->
        </div>
      </div>
    </div>
    <!-- 关闭注册功能提示 -->
    <el-dialog
      title="🔳 重要提示"
      :width='dialogWidth'
      :visible.sync="tipsDialogVisible"
      :before-close="handleCloseTips">
      <div class="tips">
        <p>经历网为只读网站，可搜索，全球可访问。投放个人经历，请点击
          <nuxt-link to="/article/1525011574368567298" style="margin-bottom: 10px;color: #8205c6;font-weight: bold;"> 《如何书写和免费投放个人经历》</nuxt-link>
        </p>
        <p style="margin-top: 5px;">欢迎您投放个人经历！期待您投放个人经历！—— 经历网</p>
        <p style="margin-top: 5px;">投稿邮箱：908866805@qq.com</p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="tipsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="tipsDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 用户协议 开始 -->
    <el-dialog
      :width='dialogWidth'
      title="请认真阅读用户协议"
      :visible.sync="dialogVisible">
      <div class="dialog-div-1">
        <h2>服务条款确认与接纳</h2>
        <p>经历网拥有jili20.com（https://www.jili20.com）及其涉及到的产品、相关软件的所有权和运作权。
          经历网享有对jili20.com上一切活动的监督、提示、检查、纠正及处罚等权利。
          用户通过注册程序阅读本服务条款并点击&quot;同意&quot;按钮完成注册，即表示用户与经历网已达成协议，自愿接受本服务条款的所有内容。
          如果用户不同意服务条款的条件，则不能获得使用经历网服务以及注册成为经历网用户的权利。</p><br>
        <h2>使用规则</h2>
        <ol>
          <li>用户注册成功后，经历网 将给予每个用户所申请的用户账号及密码，该用户账号和密码由用户负责保管，用户应当对以其用户账号进行的所有活动和事件负法律责任。</li>
          <br>
          <li>用户须对在经历网的注册信息的真实性、合法性、有效性承担全部责任；用户不得冒充他人，利用他人的名义发布任何信息；不得恶意使用注册帐户导致其他用户误认；
            否则经历网有权立即停止提供服务，收回其账号，并由用户独自承担由此而产生的一切法律责任。
          </li>
          <br>
          <li>用户不得使用经历网服务发送或传播敏感信息和违反国家法律制度的信息，包括但不限于下列信息:
            <ul>
              <li>1）反对宪法所确定的基本原则的；</li>
              <li>2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
              <li>3）损害国家荣誉和利益的；</li>
              <li>4）煽动民族仇恨、民族歧视，破坏民族团结的；</li>
              <li>5）破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
              <li>6）散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
              <li>7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
              <li>8）侮辱或者诽谤他人，侵害他人合法权益的；</li>
              <li>9）含有法律、行政法规禁止的其他内容的。</li>
            </ul>
          </li>
          <br>
          <li>经历网有权对用户使用经历网的情况进行审查和监督，如用户在使用经历网时违反任何上述规定，经历网或其授权的人有权要求用户改正或直接采取一切必要的措施（包括但不限于删除用户张贴的内容、暂停或终止用户使用经历网
            的权利）以减轻用户不当行为造成的影响。
          </li>
          <br>
          <li>盗取他人用户账号或利用网络通讯骚扰他人，均属于非法行为。用户不得采用测试、欺骗等任何非法手段，盗取其他用户的账号和对他人进行骚扰。</li>
        </ol>
        <br>
        <h2>知识产权</h2>
        <ol>
          <li><p>用户保证和声明对其所提供的作品拥有完整的合法的著作权，或完整的合法的授权，可以用于其在经历网上从事的活动，保证经历网使用该作品不违反国家的法律法规，也不侵犯第三方的合法权益或承担任何义务。
            用户应对其所提供作品因形式、内容及授权的不完善、不合法所造成的后果承担责任。</p></li>
          <br>
          <li><p>对于经用户本人创作并上传到 经历网 的文本、图片、图形等，经历网保留对其内容进行实时监控的权利，并有权依其独立判断对任何违反本协议约定的作品实施删除。
            经历网 对于删除用户作品引起的后果或导致用户损失不负责任。</p></li>
          <br>
          <li><p>
            因用户作品的违法或侵害第三人的合法权益，而导致经历网或其关联公司对第三方承担任何性质的赔偿、补偿或罚款而遭受损失（直接的、间接的、偶然的、惩罚性的和继发的损失），用户对于经历网或其关联公司蒙受的上述损失须承担赔偿责任。</p>
          </li>
          <br>
          <li><p>任何第三方，都可以在遵循知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议的情况下，分享本站用户创造的内容。</p>
            <ul>
              <li>经历网同时为用户提供“内容可演绎-相同方式共享”选项。任何第三方，都可以在遵循
                <a class="xy-a" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">知识共享署名-非商业性使用-相同方式共享
                  4.0
                  国际许可协议</a>的情况下分享本站用户创造的内容。
              </li>
              <br>
              <li>经历网亦为用户提供“保留所有权利，禁止转载”的选项。除非获得原作者的单独授权，任何第三方不得转载申明了禁止转载的内容，否则均视为侵权。</li>
            </ul>
          </li>
        </ol>
        <br>
        <h2>免责声明</h2>
        <ol>
          <li>若经历网 已经明示其网络服务提供方式发生变更，并提醒用户应当注意事项，用户未按要求操作，所产生的一切后果由用户自行承担。</li>
          <br>
          <li>用户明确同意其使用经历网网络服务所存在的风险将由其自己承担；因其使用经历网服务，而产生的后果，也由其自己承担。经历网对用户不承担以上责任。</li>
          <br>
          <li>经历网不保证网络服务一定能满足用户的要求，也不保证网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作百分百保证。</li>
          <br>
          <li>对于因不可抗力，或经历网不能控制的原因，造成的网络服务中断，或其它缺陷，经历网不承担责任，但将尽全力减少因此而给用户造成的损失和影响。</li>
          <br>
          <li>用户同意保障和维护经历网及其他用户的利益，用户在经历网发表的内容仅表明其个人的立场和观点，并不代表经历网的立场或观点。
            由于用户发表内容违法、不真实、不正当、侵犯第三方合法权益，或用户违反本协议项下的任何条款而给历网或任何其他第三人造成损失，用户同意承担由此造成的损害赔偿责任。
          </li>
        </ol>
        <br>
        <h2>服务条款的修改</h2>
        <p>经历网会在必要时修改服务条款，服务条款一旦发生变动，经历网将会在用户进入下一步使用前的页面提示修改内容。
          如果您同意改动，请再一次激活&quot;我同意&quot;按钮。如果您不接受，请及时取消您的帐户。 用户要继续使用经历网各项服务需要两方面的确认:</p>
        <ul>
          <li>1）首先确认经历网服务条款及其变动。</li>
          <li>2）同意接受所有的服务条款限制。</li>
        </ul>
        <br>
        <h2>隐私政策</h2>
        <p>经历网（jili20.com）以此声明对本站用户隐私保护的许诺。经历网的隐私声明正在不断改进中，随着经历网服务范围的扩大，
          会随时更新隐私声明，欢迎您随时查看隐私声明。</p><br>
        <h3>隐私政策</h3>
        <p>经历网非常重视对用户隐私权的保护，承诺不会在未获得用户许可的情况下擅自将用户的个人资料信息出租或出售给任何第三方，但以下情况除外:</p>
        <ul>
          <li>1）您同意让第三方共享资料；</li>
          <li>2）您同意公开你的个人资料，享受为您提供的产品和服务；</li>
          <li>3）本站需要听从法庭传票、法律命令或遵循法律程序；</li>
          <li>4）本站发现您违反了本站服务条款或本站其它使用规定。</li>
        </ul>
        <div class="dialog-div">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- /用户协议 结束 -->
  </div>
</template>
<script>
export default {
  name: "register",
  // 动态标题
  head() {
    return {
      title: '注册 - 经历网'
    }
  },
  data() {
    // 校验新密码和确认密码是否一致
    let validateCfPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('两次输入的密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // 关闭注册通道
      tipsDialogVisible: false,
      tab: 1, // 高亮当前标签名
      reverse: 1, // 旋转 1 登录，2 注册
      dialogVisible: false, // 协议弹出窗
      dialogWidth: "0", // 动态改变协议 dialog 的宽度
      a: true, // 提交状态
      b: false, // 中提交状态
      // 注册
      user: {
        phone: '',
        username: '',
        password: '',
        confirmPassword: '',
        code: '',
        check: false
      },
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '手机号码不能为空', trigger: 'blur'},
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入11位合法手机号码',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
          {validator: validateCfPass, trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入手机短信验证码', trigger: 'blur'},
          {min: 4, max: 4, message: '长度为 4 位数', trigger: 'blur'}
        ]
      },
      subState: false, // 提交状态
      sending: false, // 是否发送验证码
      second: 60, // 倒计时间
      leftSecond: 0, // 剩余时间
    }
  },

  methods: {
    // 关闭注册通道提示
    handleCloseTips() {
      this.tipsDialogVisible = false
    },
    // 动态改变协议 dialog 的宽度
    setTipDialogWidth() {
      this.tipsDialogVisible = true
      const val = document.body.clientWidth;
      const def = "800" // 默认宽度
      if (val < def) {
        this.dialogWidth = '90%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    goToLogin() {
      this.$router.push('/auth/login')
    },
    // 切换页签
    changeTab(int) {
      this.tab = int;
      let _that = this;
      setTimeout(() => {
        this.reverse = int
      }, 200)
    },
    // 重置登录表单
    resetForm(registerForm) {
      this.$refs[registerForm].resetFields();
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
    // 发送手机短信验证码
    async sendPhoneCode() {
      // 打开关闭注册通道对话框
      this.tipsDialogVisible = true
    },

    // 提交注册
    async userRegister() {
      // 打开关闭注册通道对话框
      this.tipsDialogVisible = true
    }
  }
}
</script>
<style scoped lang="less">

.tips {
  padding: 0 20px 20px;

  p {
    line-height: 25px;
  }
}

.el-form {
  padding-top: 20px;

  .xy {
    color: #2b89db !important;
    cursor: pointer;
  }
}

.goto {
  float: left;
  font-size: 14px;
  color: #2b89db !important;
  cursor: pointer;
}

.goto:hover {
  color: #8205c6 !important;
}

.el-form-item__content {
  line-height: 1px !important;
}

// 网站标题
.login_box {
  word-wrap: break-word;
  word-break: normal;

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

.dialog-div-1 {
  padding: 0 20px 30px;
  background-color: #FFFFFF;
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

// 协议
ol {
  line-height: 23px;
  list-style-type: demical;
}

ul {
  line-height: 23px;
}

.xy-a {
  color: #8205c6;
}

.xy-a:hover {
  text-decoration: underline;
}

// 表单旋转
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
    transition: all 0.8s;
    transform: perspective(600px);
    background: #efefef;
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


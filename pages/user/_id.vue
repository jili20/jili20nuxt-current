<template>
  <!-- 最外层容器 -->
  <div class="user-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 子组件-右则边栏-导航 -->
      <div class="aside sm-hidden">
        <Nav/>
      </div>
      <!-- /右则边栏 结束 -->
      <!-- 左边内容容器 开始 -->
      <div class="main">
        <!-- 子组件-顶部头像和各项统计 -->
        <Total :username="user.username" :userId="user.id" :avatar="user.avatar"
               :aCount="aCount" :authId="userId"/>
        <el-divider/>
        <!-- 列表 -->
        <div class="list-box">
          <!-- 列表内容区域 -->
          <div class="content">
            <!-- 只顾在这里写内容就行 -->
            <div class="txt-box">
              <div class="tex">个性签名： 为留住您的经历而生！</div>
              <div class="tex">注册于： {{ user.createTime }}</div>
              <div class="tex">上一次登录时间： {{ user.lastLoginTime }}</div>
            </div>
            <!-- 关注、私信、奖励 -->
            <div class="do-box">
              <!-- 关注 -->
              <el-button type="primary" icon="el-icon-plus" @click="unFollow">关注</el-button>
              <el-button type="primary" icon="el-icon-message" @click="openMessageBox"> 私信</el-button>
              <el-button type="primary" class="iconfont icon-payment fs14" @click="openOrCloseAward"> 奖励</el-button>
            </div>
            <!-- 背景图 -->
            <div class="rewardUrl">
              <div>
                <img src="@/assets/img/user/bg.jpeg" alt="">
              </div>
            </div>
          </div>
          <!-- /左边内容容器   -->
        </div>
        <!-- 奖励对话框 -->
        <el-dialog
          :visible.sync="awardDialogVisible"
          :width='dialogWidth'
          :before-close="openOrCloseAward">
          <h2>功能展示</h2>
          <el-form
            :rules="rulesAward"
            ref="awardRef"
            :model="awardData"
            label-width="100px"
            label-position="right"
            status-icon>
            <el-form-item label="奖励金额：" prop="amount">
              <el-input v-model.trim="awardData.amount" maxlength="99999" clearable placeholder="请输入金额"/>
            </el-form-item>
            <!--            <el-form-item label="奖励单号：" prop="payNumber">-->
            <!--              <el-input v-model.trim="awardData.payNumber" maxlength="50" clearable show-word-limit-->
            <!--                        placeholder="请输入奖励账单号"/>-->
            <!--            </el-form-item>-->
            <br>
            <el-form-item>
              <img src="@/assets/img/patron/no-reward.jpg" alt="用户赞赏码">
            </el-form-item>
          </el-form>
          <div align="center" class="btn">
            <el-button @click="resetForm('awardRef')">重置</el-button>
            <el-button @click="openOrCloseAward">取消</el-button>
            <el-button type="primary">提交</el-button>
          </div>
        </el-dialog>
        <!-- 发送私信对话框 -->
        <el-dialog
          :width='dialogWidth'
          :visible.sync="dialogVisible"
          :before-close="openMessageBox">
          <el-form ref="messageRef"
                   :rules="rules"
                   :model="messageData" class="msg-box">
            <span class="fs16">功能展示</span>
            <br>
            <br>
            <el-form-item label="" prop="content">
              <el-input type="textarea" v-model="messageData.content" maxlength="500" clearable
                        @keyup.enter.native="sendMessage('messageRef')"/>
            </el-form-item>
            <el-form-item align="right">
              <el-button @click="handleClose('messageRef')">取消</el-button>
              <el-button type="primary">立即发送</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- /左边内容容器   -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
import Nav from '@/components/user/nav'
import Total from '@/components/user/total'

export default {
  name: "user",
  components: {
    Nav,
    Total
  },
  // 动态标题
  head() {
    return {
      title: '主页 - 经历网'
    }
  },
  async asyncData({params, app, store}) {
    // 获取路由ID
    const routeId = params.id
    const userId = store.state.userInfo ? store.state.userInfo.id : 0
    // 统计-文章微服务
    const {data: statistic} = await app.$statisticCountArticle(routeId)
    const aCount = statistic.statistic
    return {
      routeId,
      userId,
      aCount
    }
  },
  data() {
    // 校验账单号为字符串类型数字值
    const validateOrderNumber = (rule, value, callback) => {
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字类型奖励账单号'))
      } else {
        callback()
      }
    }
    const validateAmount = (rule, value, callback) => {
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字类型金额'))
      } else {
        callback()
      }
    }
    return {
      user: {},
      routeName: this.$route.name,
      userRoute: 'user-id',
      username: this.$store.state.userInfo && this.$store.state.userInfo.username || 0,
      // 私信内容
      dialogVisible: false,
      // 动态改变弹窗的尺寸用
      dialogWidth: '0',
      messageData: {
        content: ""
      },
      rules: {
        content: [
          {required: true, message: '私信内容不能为空', trigger: 'blur'},
          {min: 2, max: 500, message: '长度为2至500个字符', trigger: 'blur'}
        ]
      },
      // 新增奖励对话框
      awardDialogVisible: false,
      // 新增奖励作者：类型（0 帖子；1 留言；2 用户）
      awardData: {
        amount: '',
        articleId: 1,
        entityType: "2",
        entityUserId: 0,
        payNumber: "",
        title: ""
      },
      // 校验奖励表单
      rulesAward: {
        payNumber: [
          {min: 6, max: 50, message: '长度在6到50个数字', trigger: 'blur'},
          {validator: validateOrderNumber, trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '奖励金额不能为空', trigger: 'blur'},
          {min: 1, max: 5, message: '长度在1至5个数字', trigger: 'blur'},
          {validator: validateAmount, trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取用户数据
    async fetchData() {
      let {data} = await this.$getUserInfoByRouteId(this.routeId)
      if (data === null) {
        return
      }
      this.user = data.user;
    },
    // 打开奖励对话框
    openOrCloseAward() {
      this.awardData.amount = ''
      this.awardData.payNumber = ''
      this.awardDialogVisible = !this.awardDialogVisible
      // 触发父组件方法
      const val = document.body.clientWidth;
      const def = 600 // 默认宽度
      if (val < def) {
        this.dialogWidth = '95%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    // 新增奖励用户
    async addAward() {
    },
    // 重置奖励表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 打开私信输入框
    openMessageBox() {
      this.messageData.content = ''
      this.dialogVisible = !this.dialogVisible
      // 触发父组件方法
      const val = document.body.clientWidth;
      const def = 600 // 默认宽度
      if (val < def) {
        this.dialogWidth = '95%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    // 关闭/取消发送私信对话框
    handleClose(messageRef) {
      this.messageData.content = ''
      this.$refs[messageRef].resetFields();
      this.dialogVisible = !this.dialogVisible
    },
    // 发送私信
    async sendMessage(messageRef) {
      this.$refs[messageRef].validate(async (valid) => {
        if (valid) {
          this.dialogVisible = !this.dialogVisible
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消关注
    unFollow() {
      this.$confirm('功能展示', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="less" scoped>
.line-top {
  clear: both;
}

// 外层大容器
.user-container {
  min-height: 630px;
  background-color: #242424;

  // 页面左则容器、右则容器
  .main, .aside {
    border-radius: 4px;
    background-color: #FFFFFF;
  }

  .main {

    .txt-box {
      width: 100%;

      .tex {
        margin-bottom: 5px;
        text-align: center;
        font-size: 14px;
      }
    }

    // 关注、私信、奖励
    .do-box {
      display: flex;
      justify-content: center;
      margin: 30px 0;
      box-shadow: 0 0 10px 6px #c7c5c5;

      .icon-payment {
        font-weight: unset;
        color: white;
      }

      .fs14 {
        font-size: 14px;
      }
    }

    // 投放诗语码区
    .rewardUrl {
      margin-bottom: 0;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
      box-shadow: 0 0 20px 6px white;

      img {
        width: 100%;
        height: 540px;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
      }
    }

    .el-form {
      // 赞赏码样式
      img {
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }

      .send-title {
        margin-bottom: 10px;
        font-size: 16px;
      }
    }

    .send-span {
      margin-bottom: 50px;
      font-size: 14px;
    }
  }

  h2 {
    margin-bottom: 50px;
    text-align: center;
  }
}

// md
@media screen and (min-width: 960px) {

  .user-container {

    .container-in {
      width: 80%;
      padding-bottom: 26px;
      margin: 0 auto;

      .main {
        float: left;
        width: 75%;
        margin-left: 26px;
        border-radius: 4px;

        // 发送私信窗口
        .msg-box {
          padding: 0 30px;
        }
      }

      .aside {
        float: left;
        width: 23%;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {
  .user-container {

    .container-in {
      clear: both;
      width: 100%;

      .main {
        width: 100%;
        margin: 0 auto;

        .rewardUrl div img {
          height: 300px;
        }
      }

      .aside {
        width: 100%;
      }
    }
  }

}
</style>

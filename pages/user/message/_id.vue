<template>
  <!-- 最外层容器 -->
  <div class="user-message-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 右则边栏-导航 -->
      <div class="aside">
      </div>
      <!-- /右则边栏 结束 -->
      <!-- 左边内容容器 开始 -->
      <div class="main">
        <!-- 顶部头像区域 -->
        <div class="avatar-box">
          <div class="avatar-div">
            <nuxt-link to="/user/1"><img src="@/assets/img/logo/avatar.png" alt=""></nuxt-link>
            <nuxt-link to="/user/1"><b> 经历网 </b></nuxt-link>
          </div>
          <div class="m-n-box">
            <!-- 通知图标、总数 -->
            <nuxt-link to="/user/notice/1" class="letter-a">
              <h1 class="el-icon-message-solid"></h1><span class="red"> 1</span>
            </nuxt-link>
            <!-- 私信图标、总数 -->
            <nuxt-link to="/user/message/1" class="letter-a">
              <h1 class="el-icon-message"></h1> <span class="red"> 0 </span></nuxt-link>
          </div>
        </div>
        <!-- 会话列表 -->
        <div class="letter-box">
          <ul>
            <h1>会话列表</h1>
            <!-- 发送私信图标 -->
            <p class="el-icon-edit-outline" @click="show"></p>
            <!-- 发送私信表单 -->
            <el-card class="box-card send-card" v-show="sendLetterBox">
              <div slot="header" class="clearfix">
                <span><i class="el-icon-message"/> 发信功能展示</span>
              </div>
              <div class="text item">
                <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
                  <el-form-item label="" prop="username">
                    <el-input v-model="formData.username" maxlength="20" clearable show-word-limit
                              placeholder="请输入收信人名称"></el-input>
                  </el-form-item>
                  <el-form-item label="" prop="content">
                    <el-input type="textarea" v-model="formData.content" maxlength="500" clearable
                              placeholder="请输入私信内容" @keyup.enter.native="addMessage('ruleForm')"></el-input>
                  </el-form-item>
                  <el-form-item align="right">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-button @click="cancel('ruleForm')">取消</el-button>
                    <el-button type="primary" @click="addMessage('ruleForm')">立即发送</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
            <!-- 私信会话列表 -->
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 私信目标头像 -->
                  <div>
                    <nuxt-link to="'/user/'+1">
                      <el-badge value="0" :max="99" type="info">
                        <img src="@/assets/img/user/bing2.jpg" alt="">
                      </el-badge>
                    </nuxt-link>
                  </div>
                  <div class="w100">
                    <div class="w100-div">
                      <div>
                       <span>
                         <nuxt-link to="'/user/'+1"><b> 梦</b></nuxt-link>
                       </span>
                        <el-divider direction="vertical"/>
                        <span class="count">共 6 条</span>
                      </div>
                      <!-- 删除会话 -->
                      <div>
                        <el-button type="primary" plain size="mini" icon="el-icon-delete" circle @click="remove"></el-button>
                      </div>
                    </div>
                    <!-- 用a标签进入，可以同步顶部导航未读消息数量 -->
                    <nuxt-link to="/user/message/letter?id=1_2"><p class="content"> 世上只有一种英雄主义，就是在认清真相之后依然热爱生活。</p>
                    </nuxt-link>
                    <p class="time">发送于 今天</p>
                  </div>
                </div>
              </el-card>
            </li>
          </ul>
        </div>
      </div>
      <!-- /左边内容容器   -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
export default {
  name: "user-message",
  // 动态标题
  head() {
    return {
      title: '私信会话列表 - 经历网'
    }
  },
  data() {
    return {
      // 新增私信窗口，默认不显示
      sendLetterBox: false,
      // 新增私信数据
      formData: {
        username: '',
        content: ''
      },
      // 表单校验
      rules: {
        username: [
          {required: true, message: '收信人名不能为空', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '私信内容不能为空', trigger: 'blur'},
          {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 显示发送私信窗口（新增）
    show() {
      this.formData.username = ''
      this.formData.content = ''
      this.sendLetterBox = !this.sendLetterBox
    },
    // 发送私信（新增私信）
    async addMessage(ruleForm) {
      if (this.userId === 0) {
        this.$message.info("功能展示")
        return
      }
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          await this.$addMessage(this.formData).then(response => {
            if (response.code === 200) {
              // 关闭窗口
              this.sendLetterBox = !this.sendLetterBox
              // 刷新列表数据
              this.fetchData()
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 取消
    cancel(formName) {
      // 关闭窗口
      this.sendLetterBox = !this.sendLetterBox
      this.$refs[formName].resetFields();
    },
    // 根据会话ID-批量删除私信
    remove() {
      this.$confirm('您确定要删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.info("功能展示")
      }).catch(() => {
        // 取消删除，什么也不做
      })
    }
  }
}
</script>

<style lang="less">

.user-message-container {
  min-height: 630px;
  background-color: #242424;

  // 页面左则容器、右则容器
  .main, .aside {
    border-radius: 4px;
  }

  .main {
    min-height: 630px;
    background: linear-gradient(to left, #e5e4e4, #e5e4e4, black);

    // 顶部大头像区
    .avatar-box {
      background-color: black;
      box-shadow: 0 0 20px 6px white;

      .red, .el-icon-message {
        color: red;
      }

      .avatar-div {
        display: flex;
        justify-content: center;
        padding-top: 20px;
        align-items: center;

        b {
          margin-left: 20px;
          color: #d9d7d7;
        }
      }

      // 通知私信图标
      .m-n-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        a {
          color: white;
        }
      }

      // 顶部头像
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        box-shadow: 0 0 20px 6px white;
        transition: all .4s ease-in-out;
        -webkit-transition: all .4s ease-in-out;
        object-fit: cover;
      }

      img:hover {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
      }
    }

    // 私信会话列表
    .letter-box {

      .send-name {
        margin-bottom: 20px;
        margin-left: 2px;
        font-size: 14px;
      }

      h1 {
        text-align: center;
      }

      // 发送私信窗口
      .send-card {
        clear: both;
        margin: 20px auto;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }

      // 发送私信图标
      .el-icon-edit-outline {
        float: right;
        margin: 0 150px 10px 0;
        font-size: 30px;
        cursor: pointer;
        box-shadow: 0 0 20px 6px white;
      }

      li {
        // 会话容器
        .box-card {
          clear: both;
          margin: 0 auto 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

          .box-card-div {
            display: flex;

            > div {
              margin-right: 10px;

              // 未读会话私信数量
              .el-badge {
                width: 55px;
                margin-right: 10px;
              }
            }

            // 私信内容
            .content {
              margin-top: 5px;
              font-size: 16px;
            }

            .content:hover {
              color: #8205c6;
            }

            .time {
              margin-top: 10px;
              font-size: 13px;
            }

            .count {
              font-size: 14px;
            }

            // 私信目标头像
            img {
              width: 50px;
              height: 50px;
              padding: 1px;
              border: #bbbec3 solid 1px;
              border-radius: 50%;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
              transition: all .4s ease-in-out;
              -webkit-transition: all .4s ease-in-out;
              object-fit: cover;
            }

            img:hover {
              transform: rotate(360deg);
              -webkit-transform: rotate(360deg);
            }
          }
        }
      }
    }

    .w100 {
      width: 100%;

      .w100-div {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}

// md
@media screen and (min-width: 960px) {
  .user-message-container {
    background-size: 100% 100%;

    .container-in {
      width: 80%;
      margin: 0 auto;
      padding-bottom: 26px;

      .main {
        float: left;
        width: 75%;
        margin-left: 26px;
        border-radius: 4px;

        // 顶部大头像区
        .avatar-box {

          .el-icon-message-solid {
            padding-left: 150px;
            color: white;
          }

          .letter-a {
            padding-right: 150px;
            color: white;
          }
        }

        .box-card {
          width: 70%;
        }

        // 发送私信窗口
        .send-card {

          .el-form {
            width: 80%;
            margin: 0 auto;
          }
        }
      }
    }

    .aside {
      float: left;
      height: 700px;
      width: 23%;
      border-radius: 4px;
      background: linear-gradient(to right, #e5e4e4, black);
    }
  }
}


// sm
@media screen and (max-width: 960px) {

  .el-card__body {
    padding: 20px 10px;
  }

  .user-message-container {

    .container-in {
      clear: both;
      width: 100%;

      .main {
        width: 100%;
        margin: 0 auto;

        // 顶部大头像区
        .avatar-box {

          .el-icon-message-solid {
            padding-left: 30px;
            color: white;
          }

          .letter-a {
            padding-right: 30px;
            color: white;
          }
        }

        .letter-box {
          // 发送私信图标按钮
          .el-icon-edit-outline {
            float: right;
            margin: 0 10px 10px 0;
            font-size: 30px;
            box-shadow: 0 0 20px 6px white;
          }
        }
      }

      .aside {
        width: 100%;
      }
    }
  }

}
</style>

<template>
  <!-- 最外层容器 -->
  <div class="user-message-letter-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 右则边栏-导航 -->
      <div class="aside"></div>
      <!-- /右则边栏 结束 -->
      <!-- 左边内容容器 开始 -->
      <div class="main">
        <!-- 顶部头像区域 -->
        <div class="avatar-box">
          <div class="avatar-div">
            <nuxt-link :to="'/user/'+1"><img src="@/assets/img/logo/avatar.png" alt=""></nuxt-link>
            <nuxt-link :to="'/user/'+1"><b> 经历网</b></nuxt-link>
          </div>
          <div class="m-n-box">
            <!-- 通知图标、总数 -->
            <nuxt-link :to="'/user/notice/'+1" class="letter-a">
              <h1 class="el-icon-message-solid"></h1> <span style="color: red;"> 1</span>
            </nuxt-link>
            <!-- 私信图标、总数 -->
            <nuxt-link :to="'/user/message/'+1" class="letter-a">
              <h1 class="el-icon-message" style="color: red;"></h1> <span style="color: red;"> 0 </span></nuxt-link>
          </div>
        </div>
        <div class="letter-box">
          <h1>会话详情</h1>
          <!-- 私信目标用户/发送私信图标按钮 -->
          <div class="target-box">
            <div style="display: flex;justify-content: space-between;align-items: center;margin: 20px 0 20px;">
              <div style="display: flex;">
                <h3>来自 </h3>
                <nuxt-link :to="'/user/'+1">
                  <h3 style="color: black;font-weight: bold;">&nbsp;<i class="el-icon-user-solid"/>
                    梦 &nbsp;</h3>
                </nuxt-link>
                <h3> 的私信</h3>
              </div>
              <!-- 打开发送私信窗口 -->
              <span class="el-icon-edit-outline add" @click="show"></span>
            </div>
          </div>
          <!-- 新增发送私信 -->
          <el-card class="box-card send-card" v-show="sendLetterBox">
            <div slot="header" class="clearfix">
              <span><i class="el-icon-message"/> 发信功能展示</span>
            </div>
            <div class="text item">
              <el-form ref="ruleForm" label-width="100px" label-position="top">
                <el-form-item label="" prop="username">
                  <el-input maxlength="20" clearable show-word-limit
                            placeholder="功能展示，仅限网站负责人可操作"></el-input>
                </el-form-item>
                <el-form-item label="" prop="content">
                  <el-input type="textarea" maxlength="500" clearable placeholder="请输入私信内容"></el-input>
                </el-form-item>
                <el-form-item align="right">
                  <el-button>重置</el-button>
                  <el-button @click="show">取消</el-button>
                  <el-button type="primary">立即发送</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
          <ul>
            <!-- Bing -->
            <li>
              <div class="box-card-div">
                <!-- 私信目标头像 -->
                <div>
                  <nuxt-link :to="'/user/'+1">
                    <img src="@/assets/img/user/bing.png" alt="">
                  </nuxt-link>
                </div>
                <div style="width: 100%;">
                  <div style="display: flex;justify-content: space-between;">
                    <nuxt-link :to="'/user/'+1"><b> Bing</b></nuxt-link>
                    <div>
                      <!-- 删除私信 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" circle/>
                    </div>
                  </div>
                  <p class="content">苦难与幸福一样，都是生命盛开的花朵。</p>
                  <p class="time">发送于 55 分钟前</p>
                </div>
              </div>
            </li>
            <!-- 梦 -->
            <li>
              <div class="box-card-div">
                <!-- 私信目标头像 -->
                <div>
                  <nuxt-link :to="'/user/'+1">
                    <img src="@/assets/img/user/bing2.jpg" alt="">
                  </nuxt-link>
                </div>
                <div style="width: 100%;">
                  <div style="display: flex;justify-content: space-between;">
                    <nuxt-link :to="'/user/'+1"><b> 梦</b></nuxt-link>
                    <div>
                      <!-- 打开回复私信按钮 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-edit" circle/>
                      <!-- 举报私信 -->
                      <el-button type="primary" plain size="mini"
                                 icon="el-icon-wind-power" circle/>
                      <!-- 删除私信 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" circle/>
                    </div>
                  </div>
                  <p class="content"> 爱之花开放的地方，生命便能欣欣向荣。</p>
                  <p class="time">发送于 46 分钟前</p>
                </div>
              </div>
            </li>
            <!-- Bing -->
            <li>
              <div class="box-card-div">
                <!-- 私信目标头像 -->
                <div>
                  <nuxt-link :to="'/user/'+1">
                    <img src="@/assets/img/user/bing.png" alt="">
                  </nuxt-link>
                </div>
                <div style="width: 100%;">
                  <div style="display: flex;justify-content: space-between;">
                    <nuxt-link :to="'/user/'+1"><b> Bing</b></nuxt-link>
                    <div>
                      <!-- 删除私信 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" circle/>
                    </div>
                  </div>
                  <p class="content"> 获得是一种满足，给予是一种快乐。</p>
                  <p class="time">发送于 43 分钟前</p>
                </div>
              </div>
            </li>
            <!-- 梦 -->
            <li>
              <div class="box-card-div">
                <!-- 私信目标头像 -->
                <div>
                  <nuxt-link :to="'/user/'+1">
                    <img src="@/assets/img/user/bing2.jpg" alt="">
                  </nuxt-link>
                </div>
                <div style="width: 100%;">
                  <div style="display: flex;justify-content: space-between;">
                    <nuxt-link :to="'/user/'+1"><b> 梦</b></nuxt-link>
                    <div>
                      <!-- 打开回复私信按钮 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-edit" circle/>
                      <!-- 举报私信 -->
                      <el-button type="primary" plain size="mini"
                                 icon="el-icon-wind-power" circle/>
                      <!-- 删除私信 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" circle
                      />
                    </div>
                  </div>
                  <p class="content"> 点燃蜡烛照亮他人者，也会给自己带来光明。</p>
                  <p class="time">发送于 41 分钟前</p>
                </div>
              </div>
            </li>
            <!-- Bing -->
            <li>
              <div class="box-card-div">
                <!-- 私信目标头像 -->
                <div>
                  <nuxt-link :to="'/user/'+1">
                    <img src="@/assets/img/user/bing.png" alt="">
                  </nuxt-link>
                </div>
                <div style="width: 100%;">
                  <div style="display: flex;justify-content: space-between;">
                    <nuxt-link :to="'/user/'+1"><b> Bing</b></nuxt-link>
                    <div>
                      <!-- 删除私信 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" circle/>
                    </div>
                  </div>
                  <p class="content"> 只要人人都献出一点爱</p>
                  <p class="time">发送于 38 分钟前</p>
                </div>
              </div>
            </li>
            <!-- 梦 -->
            <li>
              <div class="box-card-div">
                <!-- 私信目标头像 -->
                <div>
                  <nuxt-link :to="'/user/'+1">
                    <img src="@/assets/img/user/bing2.jpg" alt="">
                  </nuxt-link>
                </div>
                <div style="width: 100%;">
                  <div style="display: flex;justify-content: space-between;">
                    <nuxt-link :to="'/user/'+1"><b> 梦</b></nuxt-link>
                    <div>
                      <!-- 打开回复私信按钮 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-edit" circle/>
                      <!-- 举报私信 -->
                      <el-button type="primary" plain size="mini"
                                 icon="el-icon-wind-power" circle/>
                      <!-- 删除私信 -->
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" circle/>
                    </div>
                  </div>
                  <p class="content"> 世界将变成美好的人间！</p>
                  <p class="time">发送于 31 分钟前</p>
                </div>
              </div>
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
  name: "user-message-letter",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  // 动态标题
  head() {
    return {
      title: '私信详情 - 经历网'
    }
  },
  data() {
    return {
      // 新增私信窗口，默认不显示
      sendLetterBox: false
    }
  },
  methods: {
    // 显示发送私信窗口（新增）
    show() {
      this.sendLetterBox = !this.sendLetterBox
    }
  }
}
</script>
<style lang="less" scoped>
.user-message-letter-container {
  min-height: 630px;
  background-color: #242424;

  .el-dialog .el-form {
    padding: 0 30px 20px;

    .p {
      text-align: center;
      font-size: 16px;
    }

    .btn {
      margin-top: 30px;
      text-align: right;
    }
  }

  // 页面左则容器、右则容器
  .main, .aside {
    border-radius: 4px;
  }

  .main {
    background: linear-gradient(to left, #e5e4e4, #e5e4e4, black);

    // 顶部大头像区
    .avatar-box {
      background-color: black;
      box-shadow: 0 0 20px 6px white;

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
      .add {
        font-size: 30px;
        cursor: pointer;
        box-shadow: 0 0 20px 6px white;
      }

      // 来自xx的私信
      .target {
        font-size: 18px;
        color: white;
        box-shadow: 0 0 20px 6px white;
      }

      ul {
        margin: 0 auto 20px;
        padding: 20px 0;
        border-radius: 4px;
        background-color: #FFFFFF;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        li {
          // 私信会话容器
          .box-card-div {
            display: flex;
            border-bottom: solid 1px #c8c9cb;
            background-color: #FFFFFF;

            // 私信内容
            .content {
              margin: 5px 0 10px;
              font-size: 16px;
            }

            .time {
              margin-bottom: 5px;
              font-size: 12px;
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
              margin-right: 20px;
            }

            img:hover {
              transform: rotate(360deg);
              -webkit-transform: rotate(360deg);
            }
          }
        }
      }
    }
  }
}

// md
@media screen and (min-width: 960px) {
  .user-message-letter-container {
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

        // 私信目标
        .target-box {
          width: 70%;
          margin: 0 auto;
        }

        // 私信详情内容列表
        ul {
          width: 70%;

          li {
            // 私信会话容器
            .box-card-div {
              padding: 10px 30px;
            }
          }
        }
      }
    }

    .aside {
      float: left;
      width: 23%;
      height: 700px;
      border-radius: 4px;
      background: linear-gradient(to right, #e5e4e4, black);
    }
  }
}


// sm
@media screen and (max-width: 960px) {
  .user-message-letter-container {

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

        ul {
          li {
            // 私信会话容器
            .box-card-div {
              padding: 10px;
            }
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

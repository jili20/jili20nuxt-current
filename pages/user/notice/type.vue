<template>
  <!-- 最外层容器 -->
  <div class="user-notice-type-container">
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
            <nuxt-link to="/user/1"><img src="@/assets/img/user/bing.png" alt=""></nuxt-link>
            <nuxt-link to="/user/1"><b> Bing</b></nuxt-link>
          </div>
          <div class="m-n-box">
            <!-- 通知图标、总数 -->
            <nuxt-link to="/user/notice/1" class="letter-a">
              <h1 class="el-icon-message-solid" style="color: red;"></h1> <span class="red"> 1</span>
            </nuxt-link>
            <!-- 私信图标、总数 -->
            <nuxt-link to="/user/message/1" class="letter-a">
              <h1 class="el-icon-message"></h1> <span class="red"> 0 </span>
            </nuxt-link>
          </div>
        </div>
        <!-- 会话列表 -->
        <div class="letter-box">
          <ul>
            <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
            <h1 v-if="type == 0"><span class="iconfont icon-bi fs30"></span> 留言类通知</h1>
            <h1 v-if="type == 1"><span class="iconfont icon-pinglun fs35"></span> 回复类通知</h1>
            <h1 v-if="type == 2"><span class="iconfont icon-icon_dianzan-mian fs32"></span> 点赞类通知</h1>
            <h1 v-if="type == 3"><span class="iconfont icon-eyes fs32"></span> 关注类通知</h1>
            <h1 v-if="type == 4"><span class="iconfont icon-payment fs50"></span> 奖励类通知</h1>
            <h1 v-if="type == 5"><span class="el-icon-edit-outline fs50"></span> 审核类通知</h1>
            <h1 v-if="type == 6"><span class="el-icon-wind-power fs50"></span> 举报类通知</h1>
            <!-- 系统通知详情 -->
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <div v-if="type == 0">
                    <div class="box-card-div-1">
                      <a href="/user/1"><img src="@/assets/img/user/bing2.jpg" alt=""></a>
                      <div>
                        <span class="fs14"> &nbsp;收到一条来自 </span>
                        <a href="/user/1">
                          <b class="ml6"> Bing</b>
                        </a>
                        <span class="iconfont icon-bi fs14"> 的留言 </span>
                        <p class="title-p">
                          《王小波：只有一种生活，就是诚实地活着》</p>
                        <p class="content"> 穷则独善其身，达则兼济天下。</p>
                        <div>
                          <span class="el-icon-time fs14"> 1 小时前 </span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="el-icon-delete"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 回复类通知 -->
                  <div v-if="type == 1">
                    <div class="reply">
                      <a href="/user/1"><img src="@/assets/img/notice/22.jpeg" alt=""></a>
                      <div>
                        <a href="/user/1"><b class="ml6"> 雪舞</b></a>
                        <span class="fs14"> 回复了我</span>
                        <p class="title-p">《王小波：只有一种生活，就是诚实地活着》</p>
                        <p class="content"> 不管什么天气，记得随时带上自己的阳光。不管什么遭遇，记得内心装满开心的童话。</p>
                        <div>
                          <span class="el-icon-time fs14"> 1 分钟前 </span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="el-icon-delete"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 点赞文章类通知 -->
                  <div v-if="type == 2">
                    <div class="thumb">
                      <a href="/user/1"><img src="@/assets/img/notice/1.jpeg" alt=""></a>
                      <div>
                        <a href="/user/1"><b class="ml6"> 子霞仙子</b></a>
                        <span class="fs14"> 点赞了我发布的文章</span>
                        <p class="thumb-title">
                          《王小波：只有一种生活，就是诚实地活着》</p>
                        <div>
                          <span class="el-icon-time fs14"> 刚刚 </span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="el-icon-delete"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 奖励文章类通知 -->
                  <div v-if="type == 4">
                    <div class="award">
                      <a href="/user/1"><img src="@/assets/img/notice/2.jpeg" alt=""></a>
                      <div>
                        <a href="/user/1" class="award-username"><b>玲珑</b></a>
                        <span class="fs14"> 奖励了我 <b style="color: red">1</b> 元 </span>
                        <p class="award-title">《王小波：只有一种生活，就是诚实地活着》</p>
                        <p class="time"><i class="el-icon-time"/> 2 小时前</p>
                      </div>
                    </div>
                  </div>
                  <!-- 关注类通知 -->
                  <div v-if="type == 3">
                    <div class="follow">
                      <a href="/user/1"><img src="@/assets/img/notice/26.jpeg" alt=""></a>
                      <span class="fs16"><a href="/user/1"><b> 小飞儿</b></a>
                                           <el-divider direction="vertical"/>
                                          <i class="iconfont icon-eyes"/> 关注了我  </span>
                      <el-divider direction="vertical"/>
                      <span class="fs14">&nbsp; <i class="el-icon-time"/> 昨天  </span>
                    </div>
                  </div>
                  <!-- 推荐文章类通知 -->
                  <div v-if="type == 5">
                    <div class="recommend">
                      <img src="@/assets/img/logo/slogo.png" alt="">
                      <div>
                        <span>  您发布的作品：</span>
                        <div>
                          <b>《王小波：只有一种生活，就是诚实地活着》</b>
                        </div>
                        <span style="display: inline-block;font-size: 15px;margin: 6px 0;"> ✅ 已被管理员推荐上首页。 —— 经历网 </span>
                        <div>
                          <span class="el-icon-time"> 2分钟前 </span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="el-icon-delete"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 举报文章、留言、回复类通知 -->
                  <div v-if="type == 6">
                    <div class="report">
                      <img src="@/assets/img/logo/slogo.png" alt="">
                      <div>
                        <p class="fs16"><b>您举报的文章</b>：《今天好无聊啊，大家都在干嘛呢》</p>
                        <span class="cause"><b>您举报的原因</b>： </span>
                        <!--  举报原因：(0 作品侵权；1 涉嫌违法；2 内容不雅；3 骚扰谩骂；4 虚假宣传；5 低质灌水；6 其它 ) -->
                        <span> 低质灌水 </span>
                        <p class="content"><b>我们的处理结果</b>：已通知作者修改。感谢你为共建高品质社区的付出！ —— 经历网 </p>
                        <p class="re-time"><i class="el-icon-time"/> 3 天前</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </li>
            <!-- 系统通知详情 -->
            <li v-if="type == 5">
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 投图投放诗语-审核通过 -->
                  <div v-if="type == 5">
                    <div class="loop">
                      <a href="/"><img src="@/assets/img/notice/6.png" alt=""></a>
                      <div>
                        <span class="fs14">您投放的轮播图片 <b>《那年今天》</b> ✔  已审核通过，正在</span>
                        <b> 首页顶部 </b>
                        <span class="fs14"> 播放，请点击图片前往 对应位置 查看！ —— 经历网</span>
                        <p class="loop-time"><i class="el-icon-time"/> 8 分钟前</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </li>
            <!-- 系统通知详情 -->
            <li v-if="type == 5">
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 文章审核未通过类通知 -->
                  <!-- 审核不通过的原因：(0 无；1 作品侵权；2 涉嫌违法；3 内容不雅；4 骚扰谩骂；5 虚假宣传；6 低质灌水；7 不符合当前分类 ) -->
                  <!-- 状态：(0 待审核；1 审核通过；2 审核未通过；) -->
                  <div v-if="type == 5">
                    <!-- 审核未通过 -->
                    <div class="no-pass">
                      <img src="@/assets/img/logo/slogo.png" alt="" style="border-radius: 4px;">
                      <div>
                        <span> 您发布的作品：</span>
                        <!-- 跳到草稿详情页面 http://localhost:3000/article/draft/1508005454800834562 -->
                        <p style="margin: 4px;font-size: 16px;font-weight: bold;"> 《今天好无聊啊，大家都在干嘛呢》</p>
                        <!-- 审核未通过 -->
                        <span>❌  审核未通过。原因： </span>
                        <b> 低质灌水</b>
                        <span>请点击标题进入修改。 —— 经历网</span>
                        <p class="no-pass-time"><i class="el-icon-time"/> 5小时前 </p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </li>
            <!-- 系统通知详情 -->
            <li v-if="type == 5">
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 禁言类通知  -->
                  <div v-if="type == 5">
                    <div class="no-publish">
                      <img src="@/assets/img/logo/slogo.png" alt="">
                      <div>
                        <span class="el-icon-info"> 由于你的言论涉及国家政治敏感话题，被多人投诉，经过我们的调查和核实，我们很抱歉的通知您，您已被禁言。 —— 经历网</span>
                        <p><i class="el-icon-time"/>
                          1 年前</p>
                      </div>
                    </div>
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
  name: "user-notice-type",
  // 动态标题
  head() {
    return {
      title: '系统通知详情 - 经历网'
    }
  },
  data() {
    return {
      type: ''
    }
  },
  created() {
    this.type = this.$route.query.type
  }
}
</script>
<style lang="less" scoped>
.user-notice-type-container {
  min-height: 630px;
  background-color: #242424;

  .icon-icon_dianzan-mian {
    color: black;
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

      .red {
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
        justify-content: space-between;
        align-items: center;

        .red {
          color: red;
        }

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

    // 列表
    .letter-box {
      margin-bottom: 20px;

      .el-icon-delete {
        font-size: 14px !important;
        cursor: pointer;
      }

      .fs50 {
        font-size: 50px;
      }

      .fs35 {
        font-size: 35px;
      }

      .fs32 {
        font-size: 32px;
      }

      .fs30 {
        font-size: 30px;
      }

      .fs12 {
        font-size: 12px;
      }

      h1 {
        text-align: center;
      }

      li {
        // 列表容器
        .box-card {
          clear: both;
          margin: 0 auto 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

          .box-card-div, .box-card-div-1, .reply, .thumb, .award, .loop, .no-publish, .no-pass, .recommend {
            display: flex;

            .award-username {
              margin-left: 4px;
              font-size: 16px;
              color: black;
            }

            .award-title {
              margin: 5px 0;
              font-size: 16px;
              font-weight: bold;
            }

            .ml4 {
              margin-left: 4px;
            }

            .time {
              padding-left: 5px;
              padding-top: 5px;
              font-size: 14px;
              color: #8d9195;
            }

            .thumb-title {
              margin: 5px 0;
              font-weight: bold;
            }

            .title-p {
              margin: 5px 0;
              color: #5f6268;
            }

            .title-p:hover {
              color: #8205c6;
            }

            .fs14 {
              font-size: 14px;
            }

            .fs16 {
              font-size: 16px;
            }

            .ml6 {
              margin-left: 6px;
            }

            // 目标头像
            img {
              width: 50px;
              height: 50px;
              padding: 1px;
              border-radius: 50%;
              transition: all .4s ease-in-out;
              -webkit-transition: all .4s ease-in-out;
              object-fit: cover;
            }

            img:hover {
              transform: rotate(360deg);
              -webkit-transform: rotate(360deg);
            }

            > div {
              margin-right: 10px;

              // 分类通知图标
              span {
                font-size: 50px;
              }

              // 未读数量
              .el-badge {
                width: 55px;
                margin-right: 10px;
              }
            }

            a {
              font-size: 14px;
            }

            a:hover {
              color: #8205c6;
              text-decoration: underline;
            }

            .content {
              margin: 5px 0 5px 5px;
              font-size: 16px;
            }

            .fs12 {
              margin-top: 10px;
              font-size: 12px;
              color: #828487;
            }

            .report {
              span {
                font-size: 15px;
              }
            }
          }

          .follow {
            display: flex;
            align-items: center;
          }

          .loop {
            img {
              width: 50px;
              border-radius: 4px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
            }

            b {
              font-size: 14px;
            }

            .loop-time {
              padding: 10px 0 0 6px;
              font-size: 12px;
              color: #8c939d;
            }
          }

          .no-publish, .recommend {
            img {
              border-radius: 4px;
            }

            div {
              span {
                margin-left: 6px;
                font-size: 14px;
              }

              p {
                padding: 10px 0 0 6px;
                font-size: 12px;
                color: #8c939d;
              }

              a {
                margin: 5px 0;
                font-size: 16px;
                font-weight: bold;
              }
            }
          }

          .report {
            div {
              .cause {
                font-size: 14px;
              }

              .content {
                margin: 15px 0 5px 0;
                font-size: 14px;
              }

              .re-time {
                padding-top: 5px;
                font-size: 12px;
                //color: #65696f;
              }
            }
          }

          .no-pass {
            div {
              b {
                font-size: 14px;
              }

              span {
                margin-left: 7px;
                font-size: 14px;
              }

              a {
                margin: 5px 0;
                font-size: 16px;
                font-weight: bold;
              }

              .no-pass-time {
                padding: 10px 0 0 6px;
                font-size: 12px;
                color: #8c939d;
              }
            }
          }

          .recommend {
            img {
              border-radius: 4px;
            }

            div {
              span {
                margin-left: 6px;
                font-size: 14px;
              }

              p {
                padding: 10px 0 0 6px;
                font-size: 12px;
                color: #8c939d;
              }

              a {
                margin: 5px 0;
                font-weight: bold;
                font-size: 16px;
              }

              p {
                padding: 10px 0 0 6px;
                font-size: 12px;
                color: #8c939d;
              }
            }
          }
        }
      }
    }
  }
}

// md
@media screen and (min-width: 960px) {
  .user-notice-type-container {
    background-size: 100% 100%;

    .container-in {
      width: 80%;
      padding-bottom: 26px;
      margin: 0 auto;


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

          .box-card-div {
            display: flex;

            // 目标头像
            img {
              margin-right: 20px;
            }
          }
        }

        // 举报
        .report {
          display: flex;
          padding: 10px;
        }
      }
    }

    .aside {
      width: 23%;
      float: left;
      height: 700px;
      border-radius: 4px;
      background: linear-gradient(to right, #e5e4e4, black);
    }
  }

}


// sm
@media screen and (max-width: 960px) {

  .user-notice-type-container {

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

        .box-card {

          .box-card-div {

            // 目标头像
            img {
              margin-right: 10px;
            }
          }
        }

        // 举报
        .report {
          display: flex;
          padding: 10px 0;

          img {
            border-radius: 50%;
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

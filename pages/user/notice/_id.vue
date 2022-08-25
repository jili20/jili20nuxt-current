<template>
  <!-- 最外层容器 -->
  <div class="user-notice-container">
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
            <nuxt-link to="/user/1"><img src="@/assets/img/user/slogo.png" alt=""></nuxt-link>
            <nuxt-link to="/user/1"><b> 经历网 </b></nuxt-link>
          </div>
          <div class="m-n-box">
            <!-- 通知图标、总数 -->
            <nuxt-link to="/user/notice/1" class="letter-a">
              <h1 class="el-icon-message-solid" style="color: red;"></h1>
              <span style="color: red;">1</span>
            </nuxt-link>
            <!-- 私信图标、总数 -->
            <nuxt-link to="/user/message/1" class="letter-a">
              <h1 class="el-icon-message"></h1>
              <span style="color: red;">0</span>
            </nuxt-link>
          </div>
        </div>
        <!-- 会话列表 -->
        <div class="letter-box">
          <ul>
            <h1>系统通知</h1>
            <!-- 系统通知列表 -->
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 图标 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励；5 文章 ) -->
                  <el-badge value="1" :max="99"
                            type="danger">
                    <a href="/user/notice/type?type=0">
                      <span class="iconfont icon-bi fs38"></span></a>
                  </el-badge>
                  <!-- 内容 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
                  <nuxt-link to="/user/notice/type?type=0"><b>留言</b></nuxt-link>
                  <el-divider direction="vertical"/>
                  <span class="count">共 1 条</span>
                  <el-divider direction="vertical"/>
                  <span class="time"><i class="el-icon-time"/> 2022-04-30 15:47</span>
                </div>
              </el-card>
            </li>
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 图标 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励；5 文章 ) -->
                  <el-badge value="0" :max="99"
                            type="info">
                    <a href="/user/notice/type?type=1">
                      <span class="iconfont icon-pinglun fs42"></span></a>
                  </el-badge>
                  <!-- 内容 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
                  <nuxt-link to="/user/notice/type?type=1"><b>回复</b></nuxt-link>
                  <el-divider direction="vertical"/>
                   <span class="count">共 1 条</span>
                  <el-divider direction="vertical"/>
                  <span class="time"><i class="el-icon-time"/> 2022-04-30 15:47</span>
                </div>
              </el-card>
            </li>
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 图标 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励；5 文章 ) -->
                  <el-badge value="0" :max="99"
                            type="info">
                    <a href="/user/notice/type?type=2">
                      <span class="iconfont icon-icon_dianzan-mian fs38" style="color: black;"></span></a>
                  </el-badge>
                  <!-- 内容 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
                  <nuxt-link to="/user/notice/type?type=2"><b>点赞</b></nuxt-link>
                  <el-divider direction="vertical"/>
                  <span class="count">共 1 条</span>
                  <el-divider direction="vertical"/>
                  <span class="time"><i class="el-icon-time"/> 2022-04-30 15:47</span>
                </div>
              </el-card>
            </li>
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 图标 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励；5 文章 ) -->
                  <el-badge :value="0" :max="99" type="info">
                    <a href="/user/notice/type?type=3">
                      <span class="iconfont icon-eyes fs32"></span></a>
                  </el-badge>
                  <!-- 内容 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
                  <nuxt-link to="/user/notice/type?type=3"><b>关注</b></nuxt-link>
                  <el-divider direction="vertical"/>
                  <span class="count">共 1 条</span>
                  <el-divider direction="vertical"/>
                  <span class="time"><i class="el-icon-time"/> 2022-04-30 15:47</span>
                </div>
              </el-card>
            </li>
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 图标 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励；5 文章 ) -->
                  <el-badge value="1" :max="99"
                            type="info">
                    <a href="/user/notice/type?type=4">
                      <span class="iconfont icon-payment fs40"></span></a>
                  </el-badge>
                  <!-- 内容 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
                  <nuxt-link :to="'/user/notice/type?type='+4"><b>奖励</b></nuxt-link>
                  <el-divider direction="vertical"/>
                  <span class="count">共 1 条</span>
                  <el-divider direction="vertical"/>
                  <span class="time"><i class="el-icon-time"/> 2022-04-30 15:47</span>
                </div>
              </el-card>
            </li>
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 图标 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励；5 文章 ) -->
                  <el-badge value="0" :max="99" type="info">
                    <a href="/user/notice/type?type=5">
                      <span class="el-icon-s-check fs40"></span></a>
                  </el-badge>
                  <!-- 内容 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
                  <nuxt-link :to="'/user/notice/type?type='+5"><b>审核</b></nuxt-link>
                  <el-divider direction="vertical"/>
                  <span class="count">共 1 条</span>
                  <el-divider direction="vertical"/>
                  <span class="time"><i class="el-icon-time"/> 2022-04-30 15:47</span>
                </div>
              </el-card>
            </li>
            <li>
              <el-card class="box-card">
                <div class="box-card-div">
                  <!-- 图标 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励；5 文章 ) -->
                  <el-badge value="0" :max="99" type="info">
                    <a href="/user/notice/type?type=6">
                      <span class="el-icon-wind-power fs40"></span></a>
                  </el-badge>
                  <!-- 内容 -->
                  <!-- 通知的类型：( 0 留言；1、回复；2 点赞；3 关注；4 奖励 ) -->
                  <nuxt-link to="/user/notice/type?type=6"><b>举报</b></nuxt-link>
                  <el-divider direction="vertical"/>
                  <span class="count">共 1 条</span>
                  <el-divider direction="vertical"/>
                  <span class="time"><i class="el-icon-time"/> 2022-04-30 15:47</span>
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
  name: "user-notice",
  // 动态标题
  head() {
    return {
      title: '系统通知 - 经历网'
    }
  }
}
</script>

<style lang="less" scoped>

.user-notice-container {
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

      .avatar-div {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 20px;

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

    // 列表
    .letter-box {

      h1 {
        text-align: center;
      }

      li {
        // 私信会话容器
        .box-card {
          clear: both;
          margin: 0 auto 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

          .box-card-div {
            display: flex;
            align-items: center;

            .fs42 {
              font-size: 42px;
            }

            .fs40 {
              font-size: 40px;
            }

            .fs38 {
              font-size: 38px;
            }

            .fs32 {
              font-size: 32px;
            }

            .el-badge {
              margin-right: 20px;
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

              p {
                font-size: 16px;
                padding-top: 5px;
              }

              p:hover {
                color: #8205c6;
              }
            }

            .time {
              font-size: 14px;
            }

            .count {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}

// md
@media screen and (min-width: 960px) {
  .user-notice-container {
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
        }

        .letter-box {
          margin-bottom: 100px;
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

  .user-notice-container {

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
      }

      .aside {
        width: 100%;
      }
    }
  }

}
</style>

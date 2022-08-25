<template>
  <!-- 最外层容器 -->
  <div class="user-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 子组件-右则边栏-导航 -->
      <div class="aside">
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
          <h2>关注者 <i class="el-icon-user"/></h2>
          <!-- 列表内容区域 -->
          <div class="content">
            <ul>
              <hr>
              <!-- 分页组件 开始 -->
              <template>
                <!-- md 分页组件 开始 -->
                <el-pagination
                  class="sm-hidden"
                  background
                  @current-change=""
                  :current-page="1"
                  :page-size="10"
                  layout="total, prev, pager, next, jumper"
                  :total="0">
                </el-pagination>
                <!-- sm 分页组件 开始 -->
                <el-pagination
                  class="md-hidden"
                  small
                  background
                  @current-change=""
                  :current-page="1"
                  :page-size="10"
                  layout="total,prev, pager, next"
                  :total="0">
                </el-pagination>
              </template>
              <!-- /分页组件 结束 -->
            </ul>
          </div>
        </div>
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
  name: "user-follower",
  components: {
    Nav,
    Total
  },
  // 动态标题
  head() {
    return {
      title: this.user.username + ' 的关注者 - 经历网',
      totalData: {}
    }
  },
  async asyncData({params, app, store}) {
    // 获取路由ID
    const routeId = params.id
    // 获取当前登录用户ID
    const userId = store.state.userInfo && store.state.userInfo.id || 0
    // 通过路由ID查询用户信息
    let {data: info} = await app.$getUserInfoByRouteId(routeId)
    const user = info.user
    // 统计-文章微服务
    const {data: articleServiceCount} = await app.$statisticCountArticle(routeId)
    const aCount = articleServiceCount.statistic

    return {
      routeId,
      userId,
      user,
      aCount
    }
  },
  methods: {
    // 关注
    follow(userId) {
    }
  }
}
</script>

<style lang="less" scoped>

// 外层大容器
.user-container {
  min-height: 630px;
  background-color: #242424;

  // 分页器
  .el-pagination {
    padding: 30px 0 50px;
  }

  // 页面左则容器、右则容器
  .main, .aside {
    border-radius: 4px;
    background-color: #FFFFFF;
  }

  .main {

    // 文章标题列表
    .list-box {
      padding-top: 30px;

      .content {

        .li-box {
          display: flex;
          padding: 10px 0;

          .li-box-div {
            width: 100%;
            padding-left: 20px;

            > div {
              display: flex;
              justify-content: space-between;
            }
          }

          .sign {
            padding: 5px 0;
            font-size: 16px;
          }

          .time {
            margin-top: 5px;
            font-size: 14px;
            color: #7a7f86;
          }

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

      h2 {
        margin-bottom: 50px;
        text-align: center;
      }

      a:hover {
        color: #8205c6 !important;
      }

    }
  }
}

// md
@media screen and (min-width: 960px) {

  .user-container {

    .container-in {
      width: 80%;
      margin: 0 auto;

      .main {
        float: left;
        width: 75%;
        margin-left: 26px;
        border-radius: 4px;

        // 列表区域
        .list-box {
          border-radius: 4px;

          // 列表内容区域
          .content {
            margin: 0 200px;
          }
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

        // 列表内容区域
        .content {
          margin: 0 20px;
        }
      }

      .aside {
        width: 100%;
      }
    }
  }

}
</style>

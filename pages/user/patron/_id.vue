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
        <div class="list-box">
          <h2>投放诗语 <i class="el-icon-coin"/></h2>
          <el-tabs v-model="activeName" stretch>
            <el-tab-pane label="投放诗语" name="first">
              <!-- 分页组件 -->
              <div class="page">
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
              </div>
            </el-tab-pane>
            <el-tab-pane label="VIP投放诗语" name="second">
              <el-card class="box-card" v-for="item in vipList" :key="item.id">
                <div class="content-box">
                  <div>
                    <nuxt-link :to="'/user/'+item.userId">
                      <p>投放诗语人：{{ user.username }}</p>
                    </nuxt-link>
                    <p>投放诗语致辞： {{ item.message }}</p>
                    <p>投放诗语时间： {{ item.createTime }}</p>
                  </div>
                  <div>
                    <!-- 跳转到用户个人主页 -->
                    <nuxt-link :to="'/user/'+item.userId">
                      <img class="avatar" :src="user.avatar" alt=""/>
                    </nuxt-link>
                  </div>
                </div>
              </el-card>
              <!-- 分页组件 -->
              <div class="vip-page">
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
              </div>
            </el-tab-pane>
            <el-tab-pane label="轮播图片" name="three">
              <el-card class="box-card" v-for="item in loopList" :key="item.id">
                <div class="content-box">
                  <div>
                    <nuxt-link :to="'/user/'+item.userId">
                      <p>投放诗语人：{{ item.username }}</p>
                    </nuxt-link>
                    <p>图片播放位置： {{ item.position }} 元</p>
                    <a :href="item.looperLink"><p>图片标题： {{ item.title }}</p></a>
                    <a :href="item.looperLink"><p>链接地址： {{ item.looperLink }}</p></a>
                    <p>投放诗语时间： {{ item.createTime }}</p>
                  </div>
                  <div>
                    <!-- 跳转到用户个人主页 -->
                    <el-image :src="item.looperUrl" :preview-src-list="[item.looperUrl]"/>
                  </div>
                </div>
              </el-card>
              <!-- 分页组件 -->
              <div class="loop-page">
                <!-- md 分页组件 开始 -->
                <el-pagination
                  class="sm-hidden"
                  align="center"
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
                  align="center"
                  @current-change=""
                  :current-page="1"
                  :page-size="10"
                  layout="total,prev, pager, next"
                  :total="0">
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
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
  name: "user-patron",
  components: {
    Nav,
    Total
  },
  // 动态标题
  head() {
    return {
      title: this.user.username + ' 的投放诗语 - 经历网',
      totalData: {}
    }
  },
  async asyncData({params, app, store}) {
    // 获取路由ID
    const routeId = params.id
    // 获取当前登录用户ID（用于判断是否能看到删除按钮）
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
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
<style lang="less" scoped>

a:hover {
  color: #8205c6;
  text-decoration: underline;
}

// 公共样式
.avatar {
  width: 50px;
  height: 50px;
  padding: 1px;
  border: #bbbec3 solid 1px;
  border-radius: 4px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  transition: all .4s ease-in-out;
  -webkit-transition: all .4s ease-in-out;
  object-fit: cover;
}

.avatar:hover {
  transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
}

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

    // 标题列表
    .list-box {
      padding-top: 30px;
      border-radius: 4px;

      .box-card {
        p {
          font-size: 14px;
          font-weight: bold;
        }

        .el-image:hover {
          transform: rotate(360deg);
          -webkit-transform: rotate(360deg);
        }
      }

      h2 {
        margin-bottom: 50px;
        text-align: center;
      }

      .page {
        padding: 20px 0 80px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: url("~@/assets/img/patron/1.gif") no-repeat 0 0;
        background-size: 100% 100%;
      }

      .vip-page {
        padding: 20px 0 80px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: url("~@/assets/img/patron/2.gif") no-repeat 0 0;
        background-size: 100% 100%;
      }

      .loop-page {
        padding: 20px 0 80px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: url("~@/assets/img/patron/3.gif") no-repeat 0 0;
        background-size: 100% 100%;
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
      padding-bottom: 26px;

      .main {
        float: left;
        width: 75%;
        margin-left: 26px;
        border-radius: 4px;

        .content-box {
          display: flex;
          justify-content: space-between;
          margin: 0 100px;
        }

        .el-image {
          width: 200px;
          padding: 1px;
          border: #bbbec3 solid 1px;
          border-radius: 4px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
          transition: all .4s ease-in-out;
          -webkit-transition: all .4s ease-in-out;
          object-fit: cover;
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

        // 列表区域
        .list-box {

          // 列表内容区域
          .content {
            margin: 20px;
          }

          .content-box {
            display: flex;
            justify-content: space-between;

            .el-image {
              width: 100px;
              padding: 1px;
              border: #bbbec3 solid 1px;
              border-radius: 4px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
              transition: all .4s ease-in-out;
              -webkit-transition: all .4s ease-in-out;
              object-fit: cover;
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

<template>
  <!-- 最外层容器 -->
  <div class="user-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 子组件-右则边栏-导航 -->
      <div class="aside sm-hidden">
        <Set :userId="user.id"/>
      </div>
      <!-- /右则边栏 结束 -->
      <!-- 左边内容容器 开始 -->
      <div class="main">
        <!-- 子组件-顶部头像和各项统计 -->
        <Total :username="user.username" :userId="user.id" :avatar="user.avatar"
               :aCount="aCount" :authId="userId"/>
        <el-divider/>
        <div class="list-box">
          <h2>藏经阁</h2>
          <!-- 标题按钮区 -->
          <div class="title-btn">
            <a :href="'/user/private/'+ user.id" class="activate-icon"><h3><i
              class="el-icon-loading"/> 动态</h3></a>
            <a :href="'/user/private/draft/?id='+ user.id"><h3><i class="el-icon-edit-outline"/> 草稿</h3></a>
            <a :href="'/user/private/update/?id='+ user.id"><h3><i class="el-icon-setting"/> 设置</h3></a>
            <a :href="'/user/private/loop/?id='+ user.id"><h3><i class="el-icon-picture"/> 投图</h3></a>
          </div>
          <br>
          <div>
            <div class="title-out-box">
              <!-- 文章标题列表 开始 -->
              <ul>
                <li v-for="item in dynamicList" :key="item.id">
                  <div class="item">
                    <div>
                      <!-- 跳转到用户个人主页 -->
                      <a :href="'/user/'+item.userId">
                        <img class="avatar" :src="item.masterUrl" alt=""/>
                      </a>
                    </div>
                    <div>
                      <!-- 跳转到文章详情页面 -->
                      <a :href="'/article/'+item.id" :title="item.title">
                        <b>{{ item.title }}</b>
                      </a>
                      <div class="title-box">
                        <!-- 跳转到一级分类 -->
                        <el-link :href="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid">
                          <span>{{ item.categoryParentName }}</span>
                        </el-link>
                        <el-divider direction="vertical"/>
                        <!-- 跳转到二级分类 -->
                        <el-link
                          :href="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid + '&categoryId=' + item.categoryId">
                          <span>{{ item.categoryName }}</span>
                        </el-link>
                        <el-divider direction="vertical"/>
                        <span><i class="el-icon-view"/> {{ item.viewCount }}</span>
                        <el-divider direction="vertical"/>
                        <span><i class="el-icon-chat-dot-round"/> {{ item.commentCount }}</span>
                        <el-divider direction="vertical"/>
                        <!-- 未赞 -->
                        <span class="iconfont icon-zan1" style="font-weight: unset;font-size: 14px;"> 0 </span>
                        <el-divider direction="vertical"/>
                        <!-- 未收藏 -->
                        <span class="el-icon-star-off" v-if="!item.userCollect"> 0</span>
                        <el-divider direction="vertical"/>
                        <span><i class="el-icon-time"/> {{ item.createTime }} </span>
                        <el-divider direction="vertical" v-if="authId == item.userId"/>
                        <a class="ico-btn" v-if="authId == item.userId" @click="removeArticleById(item.id)"><i
                          class="el-icon-delete"/></a>
                        <!-- 站长操作编辑文章 -->
                        <el-divider direction="vertical" v-if="authId == item.userId"/>
                        <a class="el-icon-edit-outline ico-btn" :href="'/article/edit-article/?id='+ item.id"
                           v-if="authId == item.userId"/>
                      </div>
                    </div>
                  </div>
                  <el-divider/>
                </li>
              </ul>
            </div>
            <!-- 分页组件-->
            <div class="page">
              <!-- md 分页组件 开始 -->
              <el-pagination
                class="sm-hidden"
                background
                @current-change="handleCurrentChange"
                :current-page="current"
                :page-size="size"
                layout="total, prev, pager, next, jumper"
                :total="Number(dynamicTotal)">
              </el-pagination>
              <!-- sm 分页组件 开始 -->
              <el-pagination
                class="md-hidden"
                small
                background
                @current-change="handleCurrentChange"
                :current-page="current"
                :page-size="size"
                layout="total,prev, pager, next"
                :total="Number(dynamicTotal)">
              </el-pagination>
            </div>
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
import Set from '@/components/user/set'
import Total from '@/components/user/total'

export default {
  name: "user-private",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  // middleware: 'auth', // 改个人网站注释这里
  components: {
    Set,
    Total
  },
  // 动态标题
  head() {
    return {
      title: '藏经阁 - 经历网',
      totalData: {}
    }
  },
  async asyncData({app, store}) {
    // 获取当前登录用户ID（用于判断是否能看到删除按钮）
    const authId = store.state.userInfo && store.state.userInfo.id || 0
    const userId = 1
    // 通过路由ID查询用户信息
    let {data: info} = await app.$getUserInfoByRouteId(userId)
    const user = info.user
    // 统计-文章微服务
    const {data: articleServiceCount} = await app.$statisticCountArticle(userId)
    const aCount = articleServiceCount.statistic
    // 分页列表
    const current = 1
    const size = 10
    const {data: userAndFolloweeArticleList} = await app.$getUserAndFolloweeArticleList(current, size)
    const dynamicList = userAndFolloweeArticleList.records
    const dynamicTotal = userAndFolloweeArticleList.total

    return {
      authId,
      userId,
      user,
      aCount,
      current,
      size,
      dynamicList,
      dynamicTotal
    }
  },
  methods: {
    // 刷新-动态列表数据
    async fetchData() {
      const {data} = await this.$getUserAndFolloweeArticleList(this.current, this.size)
      this.dynamicList = data.records
      this.dynamicTotal = Number(data.total)
    },
    // 动态列表数据-切换分页
    handleCurrentChange(current) {
      this.current = Number(current)
      this.fetchData()
    },
    // 点赞-文章
    addThumb(articleId, userId) {
    },
    // 收藏-文章
    addCollect() {
    },
    // 收藏-取消收藏文章
    removeCollect(articleId) {
    },
    // 根据文章ID删除自己的文章
    removeArticleById(articleId) {
      this.$confirm('您确定要删除这篇文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.$removeArticleById(articleId).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$message.success("删除文章成功")
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
        // 取消删除，什么也不做
      })
    }
  }
}
</script>
<style lang="less" scoped>

// 图标激活颜色
.activate-icon {
  border-bottom: solid 3px #d95107;
  color: #d95107;
}

.icon-zengbi:hover {
  color: #d95107 !important;
  text-decoration: none !important;
}

.icon-payment {
  color: #7f7f7f;
}

.iconfont:hover, .el-icon-star-off:hover, .icon-payment:hover {
  text-decoration: none !important;
  color: #d95107 !important;
}

// 公共样式
.avatar {
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

.avatar:hover {
  transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
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

    // 文章标题列表
    .list-box {
      border-radius: 4px;

      .item {
        display: flex;

        > div {
          margin-right: 20px;
        }

        .title-box {
          margin-top: 8px;
          font-size: 14px;
          color: gray;
        }
      }

      .title-btn {
        display: flex;
        justify-content: space-around;
        margin-bottom: 50px;
        text-align: center;
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
    }
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

        .title-out-box {
          margin: 0 auto;
          width: 80%;
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

          .title-out-box {
            width: 90%;
            margin: 0 auto;
          }

          // 列表内容区域
          .content {
            margin: 20px;
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

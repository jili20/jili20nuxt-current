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
          <h2>发布 <i class="el-icon-edit-outline"/></h2>
          <!-- 列表内容区域 -->
          <div class="content">
            <!-- 条件排序查询 -->
            <div>
              <!-- 排序 开始 -->
              <ul class="order" v-if="total > 0">
                <li :class="{orderActive:searchObj.createTime}">
                  <nuxt-link to="" class="txt" @click.native="searchCreateTime">
                    最新 <i v-if="searchObj.createTime ==1">↓</i></nuxt-link>
                </li>
                <li :class="{orderActive:searchObj.viewCount}">
                  <nuxt-link to="#" class="txt" @click.native="searchViewCount">浏览 <i
                    v-if="searchObj.viewCount ==1">↓</i>
                  </nuxt-link>
                </li>
              </ul>
              <!-- /排序 结束 -->
            </div>
            <!-- 文章标题列表 开始 -->
            <ul>
              <li v-for="item in list" :key="item.id">
                <div class="item">
                  <div>
                    <!-- 跳转到文章详情页面 -->
                    <nuxt-link :to="'/article/'+item.id" :title="item.title">
                      <b>{{ item.title }}</b>
                    </nuxt-link>
                    <div class="title-box">
                      <!-- 跳转到用户个人主页 -->
                      <nuxt-link :to="'/user/'+item.userId">
                        <i class="el-icon-user-solid"/> 经历网
                      </nuxt-link>
                      <el-divider direction="vertical"/>
                      <!-- 跳转到一级分类 -->
                      <nuxt-link :to="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid">
                        <span>{{ item.categoryParentName }}</span>
                      </nuxt-link>
                      <el-divider direction="vertical"/>
                      <!-- 跳转到二级分类 -->
                      <nuxt-link
                        :to="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid + '&categoryId=' + item.categoryId">
                        <span>{{ item.categoryName }}</span>
                      </nuxt-link>
                      <el-divider direction="vertical"/>
                      <span :class="{orderActive2:searchObj.viewCount}"><i class="el-icon-view"/> {{
                          item.viewCount
                        }}</span>
                      <el-divider direction="vertical"/>
                      <span :class="{orderActive2:searchObj.commentCount}"><i
                        class="el-icon-chat-dot-round"/> {{ item.commentCount }}</span>
                      <el-divider direction="vertical"/>
                      <!-- 未赞 @click="addThumb(item.id, item.userId)" -->
                      <span class="iconfont icon-zan1"
                            :class="{orderActive2:searchObj.thumbCount}"> 0 </span>
                      <el-divider direction="vertical"/>
                      <!-- 未收藏 @click="addCollect(item.id, item.userId)" -->
                      <span class="el-icon-star-off" :class="{orderActive2:searchObj.collectionCount}"
                            v-if="!item.userCollect"><span
                        class="fs14"> 0</span></span>
                      <el-divider direction="vertical"/>
                      <!-- 未奖励 -->
                      <nuxt-link class="el-icon-coin" to="" :class="{orderActive2:searchObj.awardCount}"><span> 0</span></nuxt-link>
                      <el-divider direction="vertical"/>
                      <span><i class="el-icon-time"/> {{ item.createTime }} </span>
                      <!-- 编辑文章 -->
                      <el-divider direction="vertical" v-if="userId == item.userId"/>
                      <nuxt-link class="el-icon-edit-outline ico-btn" :to="'/article/edit-article/?id='+ item.id"
                                 v-if="userId == item.userId"/>
                      <el-divider direction="vertical" v-if="userId == item.userId"/>
                      <a href="javascript:void(0);" class="ico-btn" v-if="userId == item.userId"
                         @click="removeArticleById(item.id)"><i
                        class="el-icon-delete"/></a>
                    </div>
                  </div>
                </div>
                <el-divider/>
              </li>
              <!-- 分页组件 开始 -->
              <template>
                <!-- md 分页组件 开始 -->
                <el-pagination
                  class="sm-hidden"
                  background
                  @current-change="handleCurrentChange"
                  :current-page="current"
                  :page-size="size"
                  layout="total, prev, pager, next, jumper"
                  :total="Number(total)">
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
                  :total="Number(total)">
                </el-pagination>
                <br>
              </template>
              <!-- /分页组件 结束 -->
            </ul>
            <!-- /文章标题列表 结束 -->
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
  name: "user-article",
  components: {
    Nav,
    Total
  },
  // 动态标题
  head() {
    return {
      title: this.user.username + ' 的发布 - 经历网',
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
    // 分页列表
    const current = 1
    const size = 10
    // 条件搜索对象
    const searchObj = {
      commentCount: null,
      viewCount: null,
      thumbCount: null,
      collectionCount: null,
      awardCount: null,
      createTime: '1',
      updateTime: ''
    }
    // 参数：routeId 要查的用户、userId 当前用户（为了查点赞状态）
    const {data: articleList} = await app.$getUserArticleList(routeId, userId, current, size, searchObj)
    const list = articleList.records
    const total = articleList.total
    return {
      routeId,
      userId,
      user,
      aCount,
      current,
      size,
      searchObj,
      list,
      total
    }
  },
  methods: {
    // 点赞-文章
    addThumb(articleId, userId) {
    },
    // 点赞-取消点赞文章
    removeThumb() {
      this.$confirm('您确定要取消点赞吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    // 收藏-文章
    addCollect() {
    },
    // 收藏-取消收藏文章
    removeCollect() {
      this.$confirm('您确定要取消收藏该文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    // 刷新列表数据
    async fetchData() {
      const {data} = await this.$getUserArticleList(this.routeId, this.userId, this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)
    },
    // 切换分页
    handleCurrentChange(current) {
      this.current = Number(current)
      this.fetchData()
    },
    // 排序-最新发布 ( createTime 有值为最新排序 )
    async searchCreateTime() {
      // 组装查询条件
      this.searchObj.createTime = '1'
      this.searchObj.viewCount = null
      this.searchObj.commentCount = null
      this.searchObj.thumbCount = null
      this.searchObj.awardCount = null
      this.searchObj.collectionCount = null
      // 执行查询
      await this.fetchData()
    },
    // 排序-浏览量
    async searchViewCount() {
      // 组装查询条件
      this.searchObj.createTime = ''
      this.searchObj.viewCount = '1'
      this.searchObj.commentCount = null
      this.searchObj.thumbCount = null
      this.searchObj.awardCount = null
      this.searchObj.collectionCount = null
      // 执行查询
      await this.fetchData()
    },
    // 排序-留言数
    async searchCommentCount() {
      // 组装查询条件
      this.searchObj.createTime = ''
      this.searchObj.viewCount = null
      this.searchObj.commentCount = '1'
      this.searchObj.thumbCount = null
      this.searchObj.awardCount = null
      this.searchObj.collectionCount = null
      // 执行查询
      await this.fetchData()
    },
    // 根据文章ID删除文章
    removeArticleById(articleId) {
      this.$confirm('您确定要 删除 这篇文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.$removeArticleById(articleId).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$message.success(response.message)
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

.icon-zan1, .icon-icon_dianzan-mian {
  font-size: 14px;
}

.el-icon-coin {
  font-size: 14px;
  color: #7f7f7f;
}

.el-icon-coin:hover {
  text-decoration: unset !important;
  color: #d95107 !important;
}

.el-icon-star-off {
  font-size: 16px;
}

.icon-jinbi {
  color: #7f7f7f;
}

.iconfont:hover, .el-icon-star-off:hover {
  text-decoration: none !important;
  color: #d95107 !important;
}

// 外层大容器
.user-container {
  min-height: 630px;
  background-color: #242424;

  // 分页器
  .el-pagination {
    padding: 20px 0 50px;
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

      h2 {
        margin-bottom: 50px;
        text-align: center;
      }
    }

    // 排序
    .order {
      clear: both;
      padding-top: 20px;
      margin-bottom: 50px;

      li {
        display: inline-block;
        padding: 2px 10px;
        margin: 3px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #cccccc;
        font-size: 16px;
      }

      li:hover {
        font-weight: bold;
        color: black;
        background-color: #cccccc;

        .txt {
          color: black;
          font-weight: bold;
        }
      }
    }

    // 排序文字激活样式
    .orderActive {
      font-weight: bold;
      color: black;
      background-color: #cccccc;
    }

    .orderActive2 {
      color: #d95107;
    }

    .item {
      a:hover {
        color: #8205c6;
        text-decoration: underline;
      }

      .title-box {
        margin-top: 8px;
        font-size: 14px;
        color: gray;
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

        // 列表区域
        .list-box {
          border-radius: 4px;

          // 列表内容区域
          .content {
            margin: 0 120px;
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

        // 列表区域
        .list-box {
          border-radius: 4px;

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

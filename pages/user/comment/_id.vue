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
          <h2>留言语录 <i class="el-icon-chat-dot-round"/></h2>
          <!-- 列表内容区域 -->
          <div class="content">
            <!-- 文章标题列表 开始 -->
            <ul>
              <li v-for="item in list" :key="item.id">
                <div class="item">
                  <el-card>
                    <!-- 跳转到文章详情页面 -->
                    <div class="title-box">
                      <!-- 跳转到用户个人主页 -->
                      <nuxt-link :to="'/user/'+item.userId">
                        <b><i class="el-icon-user-solid"/> {{ item.username }}</b>
                      </nuxt-link>
                      <el-divider direction="vertical"/>
                      <!-- 未赞 @click="addCommentThumb(item.articleId,item.id,item.userId)" -->
                      <span class="iconfont icon-zan1"> 0</span>
                      <el-divider direction="vertical"/>
                      <span><i class="el-icon-time"/> {{ item.createTime }} </span>
                      <el-divider direction="vertical" v-if="userId == item.userId"/>
                      <span v-if="userId == item.userId" @click="removeCommentById(item.id)"><i
                        class="el-icon-delete"/></span>
                    </div>
                    <a :href="'/article/'+item.articleId"><p>{{ item.content }}</p></a>
                  </el-card>
                </div>
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
                  :total="0">
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
                  :total="0">
                </el-pagination>
              </template>
              <br>
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
  name: "user-comment",
  components: {
    Nav,
    Total
  },
  // 动态标题
  head() {
    return {
      title: this.user.username + ' 的留言回复语录- 经历网',
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
      thumbCount: null,
      createTime: '1'
    }
    const {data: commentList} = await app.$getUserCommentList(routeId, userId, current, size, searchObj)
    const list = commentList.records
    const total = commentList.total

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
    // 刷新列表数据
    async fetchData() {
      const {data} = await this.$getUserCommentList(this.routeId, this.userId, this.current, this.size, this.searchObj)
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
      this.searchObj.thumbCount = null
      await this.fetchData()
    },
    // 排序-获赞总数
    async searchThumbCount() {
      // 组装查询条件
      this.searchObj.createTime = ''
      this.searchObj.thumbCount = '1'
      await this.fetchData()
    },
    // 点赞-留言
    addCommentThumb(articleId, entityId, entityUserId) {
    },
    // 根据ID删除留言
    removeCommentById(id) {
      this.$confirm('您确定要删除这条留言吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.$removeCommentById(id).then(response => {
          if (response.code === 200) {
            // 刷新文章，和留言列表
            this.fetchData()
            this.$message.success("删除留言成功")
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

      h2 {
        margin-bottom: 50px;
        text-align: center;
      }

      .el-card {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }

    // 排序
    .order {
      clear: both;
      padding-top: 20px;
      margin-bottom: 50px;

      li {
        display: inline-block;
        padding: 3px 20px;
        text-align: center;
        font-size: 16px;
        border-radius: 4px;
        border: 1px solid #cccccc;
      }

      li:hover {
        font-weight: bold;
        color: black;
        background-color: #cccccc;

        .txt {
          font-weight: bold;
          color: black;
        }

        .txt:hover {
          text-decoration: none;
        }
      }
    }

    // 排序文字激活样式
    .orderActive {
      font-weight: bold;
      color: black;
      background-color: #cccccc;
    }

    .item {
      margin-bottom: 10px;

      .title-box {
        margin-top: 8px;
        font-size: 14px;
        color: gray;

        a {
          margin-left: 20px;
        }
      }

      p {
        margin: 5px 20px;
        font-size: 16px;
      }
    }

    .iconfont:hover, .el-icon-delete:hover {
      font-weight: bold;
      color: #d95107;
    }
  }
}

a:hover {
  color: #8205c6;
  text-decoration: underline;
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
        margin: 0 auto;
        width: 100%;

        // 列表区域
        .list-box {
          border-radius: 4px;

          // 列表内容区域
          .order {
            margin-left: 38px;
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

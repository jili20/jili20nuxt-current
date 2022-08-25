<template>
  <!-- 最外层容器 -->
  <div class="user-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 子组件-右则边栏-导航 -->
      <div class="aside">
        <Set/>
      </div>
      <!-- /右则边栏 结束 -->
      <!-- 左边内容容器 开始 -->
      <div class="main">
        <!-- 子组件-顶部头像和各项统计 -->
        <Total :username="user.username" :userId="user.id" :avatar="user.avatar" :aCount="aCount" :authId="userId"/>
        <el-divider/>
        <div class="list-box">
          <h2>藏经阁</h2>
          <!-- 标题按钮区 -->
          <div class="title-btn">
            <a :href="'/user/private/'+ user.id"><h3><i class="el-icon-loading"/> 动态</h3></a>
            <a :href="'/user/private/draft/?id='+ user.id" class="activate-icon"><h3>
              <i class="el-icon-edit-outline"/> 草稿</h3></a>
            <a :href="'/user/private/update/?id='+ user.id"><h3><i class="el-icon-setting"/> 设置</h3></a>
            <a :href="'/user/private/loop/?id='+ user.id"><h3><i class="el-icon-picture"/> 投图</h3></a>
          </div>
          <br>
          <div>
            <div class="title-out-box">
              <!-- 文章标题列表 开始 -->
              <ul>
                <li v-for="item in draftList" :key="item.id">
                  <div class="item">
                    <div>
                      <!-- 跳转到文章详情页面 -->
                      <a v-if="authId" :href="'/article/draft/'+item.id" :title="item.title">
                        <b>{{ item.title }}</b>
                      </a>
                      <el-tooltip class="item" effect="dark" content="草稿详情页面未对外开放" placement="top">
                        <b v-if="!authId">{{ item.title }}</b>
                      </el-tooltip>
                      <div class="title-box">
                        <!-- 跳转到用户个人主页 -->
                        <nuxt-link :to="'/user/'+item.userId">
                          <span><i class="el-icon-user-solid"/><b> {{ item.username }}</b></span>
                        </nuxt-link>
                        <el-divider direction="vertical"/>
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
                        <span v-if="item.publish==0">草稿</span>
                        <span v-if="item.publish==1">已发布</span>
                        <el-divider direction="vertical"/>
                        <span><i class="el-icon-time"/> {{ item.createTime }} </span>
                        <el-divider direction="vertical" v-if="authId == item.userId"/>
                        <a class="ico-btn" v-if="authId == item.userId" @click="removeArticleById(item.id)"><i
                          class="el-icon-delete"/></a>
                        <!-- 编辑草稿 -->
                        <el-divider direction="vertical" v-if="authId == item.userId"/>
                        <a class="el-icon-edit-outline ico-btn" :href="'/user/private/edit?id='+ item.id"
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
                :total="Number(draftTotal)">
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
                :total="Number(draftTotal)">
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
  name: "user-private-draft",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  // middleware: 'auth',
  components: {
    Set,
    Total
  },
  // 草稿标题
  head() {
    return {
      title: this.user.username + ' 的私人空间 - 经历网',
      totalData: {}
    }
  },
  async asyncData({app, store}) {
    // 获取当前登录用户ID（用于判断是否能看到删除按钮）
    // 获取当前登录用户ID（用于判断是否能看到删除按钮）
    const authId = store.state.userInfo && store.state.userInfo.id || 0
    const userId = store.state.userInfo && store.state.userInfo.id || 1
    // const userId = 1
    // 通过路由ID查询用户信息
    let {data: info} = await app.$getUserInfoByRouteId(userId)
    const user = info.user
    // 统计-文章微服务
    const {data: articleServiceCount} = await app.$statisticCountArticle(userId)
    const aCount = articleServiceCount.statistic
    // 草稿列表
    const current = 1
    const size = 10
    const {data: draftLists} = await app.$getUserDraftArticleList(userId, current, size)
    const draftList = draftLists.records
    const draftTotal = draftLists.total

    return {
      authId,
      userId,
      user,
      aCount,
      current,
      size,
      draftList,
      draftTotal
    }
  },
  methods: {
    // 刷新-草稿列表数据
    async fetchData() {
      const {data} = await this.$getUserDraftArticleList(this.userId, this.current, this.size)
      this.draftList = data.records
      this.draftTotal = Number(data.total)
    },
    // 草稿列表数据-切换分页
    handleCurrentChange(current) {
      this.current = Number(current)
      this.fetchData()
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
        //display: flex;
        //margin-left: 20px;

        .title-box {
          margin-top: 8px;
          font-size: 14px;
          color: gray;

          .danger {
            color: #e70505;;
          }
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
          width: 80%;
          margin: 0 auto;
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

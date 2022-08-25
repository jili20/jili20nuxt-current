<template>
  <!-- 所有投放诗语人列表 -->
  <div class="article-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 左边大容器 -->
      <div class="main">
        <!-- 文章详情 -->
        <div class="article-box">
          <div>
            <h2>{{ article.title }}</h2>
          </div>
          <div>
            <!-- 跳转到一级分类 -->
            <nuxt-link :to="'/?current=1&size=10&createTime=1&categoryPid=' + article.categoryPid"
               :title="'一级分类'+ article.categoryParentName">
              <el-tag effect="dark" type="danger">{{ article.categoryParentName }}</el-tag>
            </nuxt-link>
            <!-- 跳转到二级分类 -->
            <nuxt-link :to="'/?current=1&size=10&createTime=1&categoryPid=' + article.categoryPid
                             + '&categoryId=' + article.categoryId" :title="'二级分类'+ article.categoryName">
              <el-tag effect="dark">{{ article.categoryName }}</el-tag>
            </nuxt-link>
            <!-- 跳转到用户个人主页 -->
            <nuxt-link :to="'/user/'+article.userId">
              <span><i class="el-icon-user-solid"/> {{ article.username }}</span>
            </nuxt-link>
            <el-divider direction="vertical"/>
            <span><i class="el-icon-view"/> {{ article.viewCount }}</span>
            <el-divider direction="vertical"/>
            <span><i class="el-icon-chat-dot-round"/> </span>
            <el-divider direction="vertical"/>
            <span><i class="iconfont icon-zan1"/> </span>
            <el-divider direction="vertical"/>
            <span><i class="el-icon-star-off"/> </span>
            <el-divider direction="vertical"/>
            <span><i class="iconfont icon-zengbi"/> </span>
            <span><i class="el-icon-time"/> {{ article.createTime }}</span>
          </div>
          <div class="article-refuse">
            <span>⛔ 转载请注明出处</span>
          </div>
          <div class="article-content">
            <!-- 文章内容 -->
            <div class="content" v-html="article.content"></div>
            <!-- 修改时间 -->
            <div class="update-time">
              <span v-if="article.createTime !== article.updateTime">修改于 {{ article.updateTime }}</span>
            </div>
            <hr>
            <div class="do-article" v-if="userId == article.userId">
              <br>
              <!-- 删除草稿 -->
              <a href="javascript:void(0);" class="ico-btn el-icon-delete" @click="removeArticleById"></a>
              <!-- 编辑草稿 -->
              <a class="el-icon-edit-outline ico-btn" :href="'/user/private/edit?id='+ article.id"/>
            </div>
          </div>
        </div>
        <!-- /文章详情 -->
      </div>
      <!-- 右则边栏 -->
      <template>
        <!-- 子组件-发布新贴入口 -->
        <Add/>
        <!-- 经历主人头像 -->
        <div class="aside" v-if="article.masterUrl">
          <!-- 经历主人头像 -->
          <el-card>
            <img class="sidle-avatar" :src="article.masterUrl" alt="">
            <div class="master-name">
              <b>{{ article.masterName }}</b>
            </div>
          </el-card>
        </div>
        <!-- 作者头像 -->
        <div class="aside" v-if="!article.masterUrl">
          <el-card class="box-card">
            <a :href="'/user/'+article.userId">
              <img class="sidle-avatar" :src="article.avatar" alt="">
            </a>
            <el-divider content-position="center">作者</el-divider>
            <div>
              <a :href="'/user/'+article.userId">
                <div class="username">
                  <b>{{ article.username }}</b>
                </div>
              </a>
            </div>
          </el-card>
        </div>
      </template>
      <!-- /右则边栏 结束 -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
import Add from '@/components/article/add'  // 子组件-发布新贴入口

export default {
  name: 'article-draft-id',
  components: {
    Add
  },
  // 校验id为数值才可访问此组件
  validate({params}) {
    return /^\d+$/.test(params.id)
  },
  // 动态标题
  head() {
    return {
      title: this.article.title + ' - 经历网'
    }
  },
  // 服务端获取数据
  async asyncData({params, app,store}) {
    // 获取路由ID
    const routeId = params.id
    // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
    const userId = store.state.userInfo && store.state.userInfo.id || 0
    // const userId = 1

    // 根据路由上的文章ID获取文章详情
    const {data: articleInfo} = await app.$getArticleDraftInfoById(routeId)
    const article = articleInfo.articleInfo

    return {
      userId,
      article
    }
  },
  methods: {
    // 刷新文章详情
    async fetchData() {
      const {data} = await this.$getArticleById(this.article.id)
      this.article = data.articleInfo
    },
    // 根据文章ID删除文章
    removeArticleById() {
      this.$confirm('您确定要删除这篇文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.$removeArticleById(this.article.id).then(response => {
          if (response.code === 200) {
            this.$message.success("删除文章成功")
            this.$router.push('/')
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
// 公共样式

// 原创背景颜色
.article-container .main .article-box div .el-tag--dark.el-tag--danger[data-v-a30a8e90] {
  border-color: #ab1b4a;
  background-color: #ab1b4a;
}

// 编辑、删除草稿按钮
.ico-btn {
  float: right;
  margin-left: 35px;
  font-size: 25px;
}

// 最外层容器
.article-container {
  background-color: #242424;

  // 页面左则容器、右则容器
  .main, .aside {
    background-color: #242424;
  }

  .main {

    h2 {
      margin-bottom: 20px;
    }

    // 文章详情区域
    .article-box {
      border-radius: 4px;
      background-color: #ffffff;

      div {
        // 原创、分类名标记
        .el-tag {
          color: white;
        }

        // 原创标记颜色和边框颜色
        .el-tag--dark.el-tag--danger {
          border-color: #DB7093;
          background-color: #DB7093;
        }

        // 文件标题下各项总数
        span {
          font-size: 14px;
          color: #5f6163;
        }
      }

      .article-content {
        font-size: 16px;
        line-height: 25px;

        .update-time {
          display: flex;
          justify-content: right;
          margin-top: 80px;
          margin-bottom: 20px;
        }
      }

      .article-refuse span {
        font-weight: bold;
      }
    }
  }

  // 右则边栏公共样式
  .aside {
    margin-bottom: 20px;
    border-radius: 4px;

    // 修改则边栏标题横线颜色
    .el-divider {
      background-color: #828282;
    }

    // 作者、经历主人头像
    .sidle-avatar {
      width: 100%;
      border-radius: 4px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
    }

    .master-name {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }

    .username {
      display: flex;
      justify-content: center;
    }

    .el-button {
      width: 100%;
      color: #cccccc;
      background-color: black;
    }

    .el-button:hover {
      color: white;
    }

    .tex-box {
      padding: 20px;
    }
  }
}

// 清除浮动分割线
.line-1 {
  clear: both;
  height: 1px;
  width: 100%;
}

.line-2 {
  clear: both;
  height: 20px;
  width: 100%;
}

// md
@media screen and (min-width: 960px) {

  .article-container .container-in .main .article-box .article-content[data-v-a30a8e90] {
    padding: 20px 50px;
  }

  // 最外层容器
  .article-container {

    .container-in {
      width: 80%;
      margin: 0 auto;
      padding-bottom: 26px;

      .main {
        float: left;
        width: 75%;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        .article-box {
          padding: 50px 150px;

          .article-content {
            padding: 30px;
          }

          .article-refuse {
            margin-top: 20px;
            padding-left: 30px;
          }

          .flex {
            display: flex;
            justify-content: space-around;
            width: 50%;
          }
        }
      }

      .aside {
        float: left;
        width: 23%;
        margin-left: 26px;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {

  // 最外层容器
  .article-container {

    .container-in {
      clear: both;
      width: 100%;
      padding-bottom: 20px;

      .main {
        width: 100%;
        margin: 0 auto;

        .article-box {
          padding: 20px;

          .article-content {
            padding: 30px 0 50px;

          }

          .article-refuse {
            margin-top: 10px;
          }

          .flex {
            display: flex;
            justify-content: space-around;
            width: 80%;
          }
        }
      }

      .aside {
        width: 100%;
        margin: 20px auto 0;
      }
    }
  }

}
</style>

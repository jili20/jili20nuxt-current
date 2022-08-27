<template xmlns="http://www.w3.org/1999/html">
  <!-- 文章详情页面 -->
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
            <a :href="'/?current=1&size=10&createTime=1&categoryPid=' + article.categoryPid"
               :title="'一级分类'+ article.categoryParentName">
              <el-tag effect="dark" type="danger">{{ article.categoryParentName }}</el-tag>
            </a>
            <!-- 跳转到二级分类 -->
            <a :href="'/?current=1&size=10&createTime=1&categoryPid=' + article.categoryPid
                             + '&categoryId=' + article.categoryId" :title="'二级分类'+ article.categoryName">
              <el-tag effect="dark">{{ article.categoryName }}</el-tag>
            </a>
            <span>&nbsp;&nbsp;<i class="el-icon-view"/> {{ article.viewCount }}</span>
            <el-divider direction="vertical"/>
            <span class="sm-hidden"><i class="el-icon-chat-dot-round"/> </span>
            <el-divider direction="vertical" class="sm-hidden"/>
            <span class="iconfont icon-zan1 sm-hidden"> </span>
            <el-divider direction="vertical" class="sm-hidden"/>
            <span class="sm-hidden"><i class="el-icon-star-off fs16"/> </span>
            <el-divider direction="vertical" class="sm-hidden"/>
            <span class="sm-hidden"><i class="el-icon-coin"/> </span>
            <el-divider direction="vertical" class="sm-hidden"/>
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
            <div class="do-article">
              <div class="flex"></div>
              <div v-if="userId == article.userId">
                <el-tooltip placement="top">
                  <div slot="content">
                    <!-- 编辑文章 -->
                    <p><a class="el-icon-edit-outline ico-btn" :href="'/article/edit-article/?id='+ article.id"/></p>
                    <br>
                  </div>
                  <!-- 。。。 -->
                  <i class="el-icon-more-outline"/>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <!-- /文章详情 -->
        <!-- 子组件-留言区-->
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
        <!-- 右则边栏 随机诗语 -->
        <Aphorism :content="randomTip.content" :author="randomTip.author"/>
        <!-- 右则边栏 文章推荐 -->
        <div v-if="recommendArticleList">
          <Recommend v-bind:recommendArticleList="recommendArticleList"/>
        </div>
        <div class="md-hidden line-1"></div>
        <!-- 右则边栏 轮播图 -->
        <div class="aside">
          <el-carousel style="background-color: #FFFFFF;border-radius: 4px;">
            <el-carousel-item v-for="item in looperList" :key="item.id">
              <el-divider content-position="center">{{ item.title }}</el-divider>
              <div>
                <a :href="item.looperLink" v-if="item.looperLink">
                  <img class="carousel-img" :src="item.looperUrl" alt="">
                </a>
                <a :href="'/user/'+item.userId" v-else>
                  <img class="carousel-img" :src="item.looperUrl" alt="">
                </a>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="md-hidden line-2"></div>
        <!-- 子组件 - 投放诗语 -->
        <Patron :isOpenPatron="isOpenPatron"
                :addPatronData="addPatronData" @addPatron="addPatron" @openPatron="openPatron"
                @handleClosePatron="handleClosePatron"/>
      </template>
      <!-- /右则边栏 结束 -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
import Add from '@/components/article/add'  // 子组件-发布新贴入口
import Report from "@/components/article/report"; // 新增举报子组件
import Award from "@/components/article/award"; // 新增奖励子组件
import Aphorism from '@/components/aside/aphorism'  // 子组件-随机诗语
import Recommend from '@/components/aside/recommend'  // 子组件-文章推荐
import Patron from '@/components/aside/patron' // 子组件-投放诗语
import Message from '@/components/aside/message' // 子组件-发送私信

export default {
  name: 'article-detail',
  components: {
    Report,
    Award,
    Add,
    Aphorism,
    Recommend,
    Patron,
    Message
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
  async asyncData({params, app, store}) {
    // 获取路由ID
    const routeId = params.id
    // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
    const userId = store.state.userInfo && store.state.userInfo.id || 0
    const avatar = store.state.userInfo && store.state.userInfo.avatar || ''
    // 根据路由上的文章ID获取文章详情
    const {data: articleInfo} = await app.$getArticleById(routeId)
    const article = articleInfo.articleInfo
    // 文章作者ID，传给评论子组件，判断是否作者
    const authorId = article.userId
    // 随机诗语
    const {data: aphorism} = await app.$getRandomTip()
    const randomTip = aphorism.randomTip
    // 文章推荐列表
    const {data: recommend} = await app.$getArticleRecommendList()
    const recommendArticleList = recommend.recommendList
    // 轮播图 - 右边栏
    const {data: looper} = await app.$getArticleLooperList()
    const looperList = looper.looperListArticle
    return {
      routeId,
      userId,
      avatar,
      article,
      authorId,
      randomTip,
      recommendArticleList,
      looperList
    }
  },
  data() {
    return {
      // 回复
      replyCurrent: 1,  // 回复当前页码
      replySize: 5,     // 回复每页显示记录数
      replyList: [],
      repTotal: 0,
      commentId: 0,
      // 举报-举报文章对话框，默认隐藏，传给子组件
      dialogVisible: false,
      // 举报-新增举报文章数据对象
      reportData: {
        title: '', // 当前文章标题
        entityType: '0', // 举报的实体：(0 文章；1 留言；2 回复；3 私信 )
        entityId: '',  // 当前文章id
        entityUserId: '', // 举报目标用户ID
        reportType: '', // 举报原因：(0 作品侵权；1 涉嫌违法；2 色情低俗；3 骚扰谩骂；4 虚假宣传；5 低质灌水；6 其它 )"
        description: '', // 补充说明（子组件传过来）
        content: '' // 举报文章，为空
      },
      // 奖励-新增奖励对话框
      awardDialogVisible: false,
      // 奖励-新增奖励作者
      awardData: {
        amount: '',
        articleId: 0,
        entityType: "0",
        entityUserId: 0,
        payNumber: "",
        title: ""
      },
      // 新增投放诗语-窗口
      dialogWidth: false,
      isOpenPatron: false,
      addPatronData: {
        amount: 1,
        message: "",
        payNumber: ""
      },
      // 私信内容
      messageBox: false,
      messageData: {
        content: "",
        fromId: 0,
        toId: 0
      }
    }
  },
  methods: {
    // 刷新文章详情
    async fetchData() {
      const {data} = await this.$getArticleById(this.article.id)
      this.article = data.articleInfo
    },
    // 奖励-打开奖励窗口
    openOrCloseAward() {
      this.awardData.amount = ''
      this.awardData.payNumber = ''
      this.awardDialogVisible = !this.awardDialogVisible
    },
    // 奖励-作者
    addAward() {
    },
    // 点赞-文章
    addThumb() {
    },
    // 点赞-取消点赞文章
    removeThumb() {
      if (this.userId === 0) {
        this.$message.info("功能展示")
        return
      }
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
    },
    // 举报-打开举报文章窗口
    openOrCloseReport() {
      this.reportData.reportType = '';
      this.reportData.description = ''
      this.dialogVisible = !this.dialogVisible
    },
    // 举报-新增举报文章
    async addReport() {
    },
    // 投放诗语-打开-窗口
    openPatron() {
      this.addPatronData.avatar = ''
      this.addPatronData.username = ''
      this.addPatronData.message = ''
      this.isOpenPatron = !this.isOpenPatron
    },
    // 投放诗语-关闭-窗口
    handleClosePatron() {
      this.addPatronData.avatar = ''
      this.addPatronData.username = ''
      this.addPatronData.message = ''
      this.isOpenPatron = !this.isOpenPatron
    },
    // 获取投放诗语人列表
    async getPatron() {
      const {data} = await this.$getOneTop()
      this.oneTop = data.oneTop
    },
    // 投放诗语-新增
    async addPatron() {
      await this.$addPatron(this.addPatronData).then(response => {
        if (response.code === 200) {
          // 后端接口会删除缓存
          this.getPatron()
          this.isOpenPatron = !this.isOpenPatron
          this.$message.success('投放诗语成功')
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

// 公共样式
.line-top {
  clear: both;
}

// 一级留言输入框
.el-textarea__inner {
  color: black;
}

// 原创背景颜色
.article-container .main .article-box div .el-tag--dark.el-tag--danger[data-v-a30a8e90] {
  border-color: #ab1b4a;
  background-color: #ab1b4a;
}

// 举报、编辑、删除按钮图标
.ico-btn {
  font-size: 25px;
  color: white;
}

.big-icon {
  font-weight: bold;
  font-size: 28px !important;
  color: #747474;
}

.icon-shoucang-shoucang {
  font-weight: bold;
  font-size: 31px !important;
}

.big-star {
  font-weight: bold;
  font-size: 33px !important;
}

.big-icon:hover, .big-star:hover {
  font-weight: bold;
  color: #d95107;
}

.icon-zan1 {
  font-size: 21px;
}

.icon-zengbi, .el-icon-star-off, .icon-zan1 {
  cursor: auto;
  color: #5e6165;
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
      background-color: #FFFFFF;

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

        // 文章标题下各项总数
        span {
          font-size: 14px;
          color: #5f6163;
        }
      }

      .article-content {
        line-height: 27px;

        .content {
          font-size: 18px;
        }

        .update-time {
          display: flex;
          justify-content: right;
        }

        .do-article {
          display: flex;
          justify-content: space-between;
          //margin-top: 50px;

          .flex {
            .el-tooltip > span {
              font-size: 14px;
            }

            a {
              font-size: 25px;

              span {
                font-size: 18px;
              }
            }
          }

          div {
            span {
              font-size: 25px;
            }
          }
        }
      }

      .article-refuse span {
        font-weight: bold;
      }
    }

    // 公共样式-留言区最外层容器
    .comment-box {
      margin-top: 20px;
      border-radius: 4px;
      background-color: #e5e4e4;

      // 当前用户头像，一级留言发表框左则
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

      .add-one {
        border-radius: 4px;
        background-color: #d5d4d5;

        div {
          .el-form {
            display: flex;
            align-items: center;
          }
        }

      }

      .content {
        padding: 8px 0;
        font-size: 16px;
      }

      .com-two {
        li {
          margin-bottom: 10px;

          div {
            img {
              height: 30px;
              width: 30px;
            }
          }
        }
      }

      .time {
        font-size: 12px;

        span {
          margin-left: 30px;
        }
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

    .el-carousel {
      padding: 0 20px 30px 20px;

      .carousel-img {
        height: 280px;
        width: 100%;
        text-align: center;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// 清除浮动分割线
.line-1 {
  height: 1px;
  width: 100%;
  clear: both;
}

.line-2 {
  height: 5px;
  width: 100%;
  clear: both;
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
        width: 75%;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        float: left;

        .article-box {
          padding: 50px 120px;

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

        // 留言区最外层容器
        .comment-box {
          width: 90%;
          padding: 50px;

          h1 {
            margin: 0 0 20px 20px;
          }

          // 新增一级留言
          .add-one {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

            div {
              padding-top: 20px;
              padding-bottom: 20px;

              .el-form {
                padding: 30px 50px;

                img {
                  margin-right: 10px;
                }
              }
            }
          }

          // 一二级留言展示区
          .com-one {
            margin-top: 20px;
            padding: 50px 0;
            border-radius: 4px;

            > li {
              border-radius: 4px;
              padding: 0 50px 0;

              > div {
                display: flex;
              }

              img {
                margin-right: 20px;
              }
            }

            // 二级留言
            .com-two {
              margin-top: 10px;
              margin-left: 70px;
            }
          }
        }
      }

      .aside {
        width: 23%;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        border-radius: 4px;
        float: left;
        margin-left: 26px;
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {

  // 最外层容器
  .article-container {

    .container-in {
      width: 100%;
      clear: both;
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

        // 留言区最外层容器
        .comment-box {

          h1 {
            padding-top: 30px;
            padding-left: 10px;
          }

          .add-one {
            width: 100%;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

            div {
              padding: 20px 10px;
            }

          }

          // 一二级留言展示区
          .com-one {
            margin-top: 20px;
            padding: 20px 0;
            border-radius: 4px;

            > li {
              border-radius: 4px;
              padding: 0 10px 0;


              > div {
                display: flex;
              }

              img {
                margin-right: 8px;
              }
            }

            // 二级留言
            .com-two {
              margin-top: 10px;
              margin-left: 60px;
            }
          }
        }
      }

      .aside {
        width: 100%;
        margin: 5px auto 0;
      }
    }
  }

}
</style>

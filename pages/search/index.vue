<template>
  <!-- 所有投放诗语人列表 -->
  <div class="search-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 轮播图 开始 -->
    <el-carousel>
      <!-- <el-carousel :style="{backgroundImage: 'url(' + loopBackgroundImage + ')'}">-->
      <el-carousel-item v-for="item in looperListTop" :key="item.id">
        <div>
          <nuxt-link :to="item.looperLink" v-if="item.looperLink">
            <img class="carousel-img" :src="item.looperUrl" alt="" lazy>
          </nuxt-link>
          <nuxt-link :to="'/user/'+item.userId" v-else>
            <img class="carousel-img" :src="item.looperUrl" alt="" lazy>
          </nuxt-link>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 左边大容器 -->
      <div class="main">
        <div class="main-in-box">
          <!-- ES 搜索输入框 -->
          <div class="search-input">
            <el-input placeholder="请输入关键词" v-model="keyword2" class="input-with-select" @focus="focus()" @blur="blur()"
                      @keyup.enter.native="search"
                      maxlength="30" clearable show-word-limit>
              <el-button slot="append" type="primary" @click="search">搜索</el-button>
            </el-input>
            <div v-show="hotWorldsBox" class="hot-worlds">
              <ul>
                <p>经历网热搜</p>
                <li v-for="world in hotWorlds">
                  <!-- @mousedown 事件优先于 @blur 事件先执行 -->
                  <a href="javascript:void(0);" @mousedown="searchHotWorlds(world)">{{ world }}</a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 搜索结果展示 -->
          <div class="search-li-box">
            <ul>
              <li v-for="item in article" :key="item.id">
                <div class="s-l-b-div">
                  <div>
                    <nuxt-link :to="'/article/'+item.id"><img class="avatar" :src="item.masterUrl" alt="" lazy>
                    </nuxt-link>
                  </div>
                  <div>
                    <h4 style="word-wrap: break-word;word-break: normal;">
                      <nuxt-link :to="'/article/'+item.id" v-html="item.title"></nuxt-link>
                    </h4>
                    <div class="title-box">
                      <!-- 跳转到一级分类 -->
                      <nuxt-link class="sm-hidden" :to="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid">
                        <span v-html="item.categoryParentName"></span>
                      </nuxt-link>
                      <el-divider direction="vertical" class="sm-hidden"/>
                      <!-- 跳转到二级分类 -->
                      <nuxt-link
                        :to="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid + '&categoryId=' + item.categoryId">
                        <span v-html="item.categoryName"></span>
                      </nuxt-link>
                      <el-divider direction="vertical"/>
                      <span><i class="el-icon-time"/> {{ item.createTime }} </span>
                    </div>
                  </div>
                </div>
                <el-divider/>
              </li>
              <!-- 分页组件 开始 -->
              <template>
                <!-- md 分页组件 -->
                <el-pagination
                  class="sm-hidden"
                  background
                  @current-change="handleCurrentChange"
                  :current-page="current"
                  :page-size="size"
                  layout="total, prev, pager, next"
                  :total="Number(total) ? Number(total) : 0">
                </el-pagination>
                <!-- sm 分页组件 -->
                <el-pagination
                  class="md-hidden"
                  small
                  background
                  @current-change="handleCurrentChange"
                  :current-page="current"
                  :page-size="size"
                  layout="total,prev, pager, next"
                  :total="Number(total) ? Number(total) : 0">
                </el-pagination>
              </template>
              <!-- /分页组件 结束 -->
            </ul>
          </div>
        </div>
      </div>
      <!-- 左则边栏 -->
      <template>
        <!-- 子组件-发布新贴入口 -->
        <Add/>
        <!-- 右则边栏 随机诗语 开始 -->
        <Aphorism :content="randomTip.content" :author="randomTip.author"/>
        <!-- 右则边栏 文章推荐 开始 -->
        <Recommend v-bind:recommendArticleList="recommendArticleList"/>
        <!-- 子组件-轮播图 -->
        <Looper v-bind:looperListRight="looperListRight"/>
        <!-- 子组件 - 投放诗语 -->
        <Patron v-bind:oneTop="oneTop" :isOpenPatron="isOpenPatron"
                :addPatronData="addPatronData" @addPatron="addPatron" @openPatron="openPatron"
                @handleClosePatron="handleClosePatron"/>
        <!-- /右则边栏 结束 -->
      </template>
      <!-- /右则边栏 -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
import Add from '@/components/article/add'  // 子组件-发布新贴入口
import Aphorism from '@/components/aside/aphorism'  // 子组件-随机诗语
import Recommend from '@/components/aside/recommend'  // 子组件-文章推荐
import Looper from '@/components/aside/looper'  // 子组件-右则小轮播图
import Patron from '@/components/aside/patron' // 子组件-投放诗语-成为VIP投放诗语人

export default {
  name: 'Search',
  components: {
    Add,
    Aphorism,
    Recommend,
    Looper,
    Patron
  },
  // 动态标题
  head() {
    return {
      title: '检索 - 经历网'
    }
  },
  async asyncData({app, store}) {
    // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
    const userId = store.state.userInfo && store.state.userInfo.id || 0
    // 轮播图 - 首页顶部
    const {data: looper} = await app.$getTopLooperList()
    const looperListTop = looper.looperListTop
    // 轮播图 - 首页右则下
    const {data: looperRight} = await app.$getRightLooperList()
    const looperListRight = looperRight.looperListRight
    // 文章推荐列表
    const {data: recommend} = await app.$getArticleRecommendList()
    const recommendArticleList = recommend.recommendList
    // 随机诗语
    const {data: aphorism} = await app.$getRandomTip()
    const randomTip = aphorism.randomTip
    // 投放诗语-右则栏列表
    const {data: one} = await app.$getOneTop()
    const oneTop = one.oneTop
    // 动态获取轮播图背景图片
    // const {data: one} = await app.$getBackgroundOne()
    // const loopBackgroundImage = one.url

    return {
      // loopBackgroundImage,
      userId,
      looperListTop,
      looperListRight,
      recommendArticleList,
      randomTip,
      oneTop
    }
  },
  data() {
    return {
      article: {},
      keyword: this.$route.query.keyword,
      keyword2: '',
      current: 1,
      size: 10,
      total: null,
      // 投放诗语-窗口
      isOpenPatron: false,
      addPatronData: {
        avatar: '',
        amount: 1,
        message: "",
        username: ""
      },
      // 热搜
      hotWorldsBox: false,
      hotWorlds: []
    }
  },
  created() {
    if (this.keyword !== '') {
      this.searchArticle();
    }
  },
  methods: {
    // 其它页面跳转过来的 ES 搜索
    searchArticle() {
      this.$search(this.keyword, this.current, this.size).then(response => {
        this.article = response.data.articles
        this.total = response.data.total
      })
    },
    // 本页 ES 搜索
    search() {
      // 如果用户没有输入关键字再按搜索跳转到首页
      if (this.keyword2 === '') {
        window.location = '/';
        return
      }
      this.$router.push({
        path: `/search`,
        query: {'keyword2': this.keyword2}
      });
      this.$search(this.keyword2, this.current, this.size).then(response => {
        this.article = response.data.articles
        this.total = response.data.total
      })
    },
    // 搜索框输入框获得焦点事件
    async focus() {
      this.hotWorldsBox = true
      const {data} = await this.$getSearchHotWorlds()
      this.hotWorlds = data.hotWords
    },
    // 搜索输入框失去焦点事件
    blur() {
      this.hotWorldsBox = false
    },
    // 点击热搜词搜索
    searchHotWorlds(world) {
      window.location = '/search?keyword=' + world;
    },
    // 切换分页
    handleCurrentChange(current) {
      this.current = current
      this.searchArticle()
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

.search-container {
  min-height: 630px;
  background-color: #242424;

  // 轮播图
  .el-carousel {
    clear: both;
    height: 310px;
    width: 100%;
    background: url("~@/assets/img/background/a.jpeg") no-repeat 0 0;
    background-size: 100% 100%;
  }

  // 搜索框按钮样式
  .el-input-group__append button.el-button {
    background-color: black;
  }

  // 搜索框按钮样式
  .el-button {
    color: white !important;
  }

  // 热搜词
  .hot-worlds {
    padding: 10px 20px 20px;
    border-radius: 4px;
    border-left: #d5d5d9 solid 1px;
    border-bottom: #d5d5d9 solid 1px;

    ul > p {
      font-size: 14px;
      color: #fa5c5c;
      margin-bottom: 6px;
    }

    li > a {
      font-size: 16px;
      line-height: 25px;
      color: #8c939d;
    }

    li > a:hover {
      color: black;
    }
  }

  .title-box {
    margin-top: 8px;
    font-size: 14px;
    color: gray;
  }

  .s-l-b-div {
    display: flex;
    align-items: center;
  }

  // 页面左则容器、右则容器
  .main, .aside {
    background-color: #FFFFFF;
  }

  .avatar {
    width: 50px;
    height: 50px;
    padding: 1px;
    margin-right: 20px;
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

  .search-input {
    width: 90%;
    margin: 0 auto;
  }

}

// md
@media screen and (min-width: 960px) {
  .search-container {

    // 轮播图
    .el-carousel {
      div {
        display: flex;
        justify-content: center;

        img {
          height: 300px;
          text-align: center;
          border-radius: 4px;
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

    .container-in {
      width: 80%;
      margin: 0 auto;
      padding-bottom: 26px;

      .main {
        float: left;
        width: 75%;
        min-height: 1500px;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        .main-in-box {
          padding: 50px 200px;

          .search-li-box {
            margin-top: 60px;
          }
        }
      }

      .aside {
        float: left;
        width: 23%;
        margin-bottom: 20px;
        margin-left: 26px;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {
  .search-container {

    // 轮播图
    .el-carousel {

      div {

        img {
          height: 300px;
          width: 100% !important;
          text-align: center;
          border-radius: 4px;
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

    .container-in {
      clear: both;
      width: 100%;
      padding-bottom: 20px;

      .main {
        width: 100%;
        margin: 0 auto;

        .main-in-box {
          padding: 50px 10px;

          .el-input__inner {
            float: right;
            width: 90%;
          }

          .search-li-box {
            margin-top: 50px;
          }
        }
      }

      .aside {
        clear: both;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }

}
</style>

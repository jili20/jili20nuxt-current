<template>
  <!-- 所有投放诗语人列表 -->
  <div class="container">
    <!-- 顶部清除浮动线 -->
    <div class="line"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 左边大容器 -->
      <div class="main">
        <h1>※ 轮播图片 ※ </h1>
        <!-- 搜索框 -->
        <div class="search">
          <el-input clearable placeholder="请输入图片投放人姓名" v-model="searchObj.username" class="input-with-select"
                    @keyup.enter.native="search(searchObj.username)">
            <el-button slot="append" icon="el-icon-search"
                       @click.native="search(searchObj.username)"></el-button>
          </el-input>
        </div>
        <!-- 所有投放的轮播图片 -->
        <ul>
          <li v-for="item in list" :key="item.id">
            <div class="looper-url">
              <el-image :src="item.looperUrl" :preview-src-list="[item.looperUrl]" lazy/>
            </div>
            <div class="info-box">
              <p>投放人：<span class="link">{{ item.username }}</span></p>
              <!-- 0 首页轮播图；1 首页右则；2 文章正文下 -->
              <p v-if="item.position == 0">投放位置：首页顶部</p>
              <p v-if="item.position == 1">投放位置：页面右则</p>
              <p v-if="item.position == 2">投放位置：帖子正文下</p>
              <p>图片标题： {{ item.title }}</p>
              <p>
                <a v-if="item.looperLink" class="link" :href="item.looperLink">网页链接 <i class="el-icon-link"/></a>
              </p>
              <p>投放时间： {{ item.createTime }}</p>
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
      </div>
      <!-- 右则边栏 开始 -->
      <template>
        <!-- 子组件-发布新贴入口 -->
        <Add/>
        <!-- 右则边栏 随机诗语 -->
        <Aphorism :content="randomTip.content" :author="randomTip.author"/>
        <!-- 右则边栏 文章推荐 -->
        <Recommend v-bind:recommendArticleList="recommendArticleList"/>
        <!-- 子组件-轮播图 -->
        <Looper v-bind:looperListRight="looperListRight"/>
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
import Aphorism from '@/components/aside/aphorism'  // 子组件-随机诗语
import Recommend from '@/components/aside/recommend'  // 子组件-文章推荐
import Looper from '@/components/aside/looper'  // 子组件-右则小轮播图
import Patron from '@/components/aside/patron' // 子组件-投放诗语-成为VIP投放诗语人

export default {
  name: 'loop-all',
  // 动态标题
  head() {
    return {
      title: '轮播图片 - 经历网'
    }
  },
  components: {
    Add,
    Aphorism,
    Recommend,
    Looper,
    Patron
  },
  // 服务端获取数据
  async asyncData({app, route, store}) {
    // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
    const userId = store.state.userInfo && store.state.userInfo.id || 0
    // 获取路由中的参数，拼接地址查询
    const query = route.query
    // 分页
    const current = 1
    const size = 10
    // 条件搜索对象
    const searchObj = {
      username: ''
    }
    // 查询条件
    searchObj.username = query.username || ''
    // 条件分页查询列表
    const {data: looper} = await app.$getLooperListPage(current, size, searchObj)
    const total = looper.total
    const list = looper.records
    // 随机诗语
    const {data: aphorism} = await app.$getRandomTip()
    const randomTip = aphorism.randomTip
    // 文章推荐列表
    const {data: recommend} = await app.$getArticleRecommendList()
    const recommendArticleList = recommend.recommendList
    // 轮播图 - 右边栏
    const {data: looperRight} = await app.$getPatronRightLooperList()
    const looperListRight = looperRight.looperListRight

    return {
      userId,
      current,
      size,
      total,
      searchObj,
      list,
      randomTip,
      recommendArticleList,
      looperListRight
    }
  },
  data() {
    return {
      formData: {
        // 回显的时候需要
        looperUrl: ''
      },
      // 投放诗语-窗口
      isOpenPatron: false,
      addPatronData: {
        avatar: '',
        message: "",
        username: ""
      }
    }
  },
  methods: {
    // 刷新列表数据
    async fetchData() {
      const {data} = await this.$getLooperListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = data.total
    },
    // 切换分页
    handleCurrentChange(current) {
      this.current = current
      this.fetchData()
    },
    // 条件分页查询
    search(username) {
      window.location = '?current=1&size=10&username=' + username;
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
    }
  }
}
</script>
<style lang="less" scoped>

.container {
  width: 100%;
  min-height: 630px;
  background-color: #242424;

  .line {
    clear: both;
    height: 1px;
  }

  // 页面左则容器、右则容器
  .main, .aside {
    background-color: #FFFFFF;
  }

  h1 {
    text-align: center;
  }

  .main {
    min-height: 1500px;

    // 公共搜索框
    .search {
      display: flex;
      justify-content: center;
      margin: 20px auto 40px;

      .el-button {
        padding: 8px 20px;
        border-top-left-radius: 6px;
        -webkit-border-top-right-radius: 6px;
      }

      .el-input__inner {
        height: 42px;
      }
    }

    ul {
      li {
        margin: 0 auto 20px;
        padding: 30px;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        .info-box {
          .link:hover {
            color: #8205c6;
            text-decoration: underline;
          }
        }

        p {
          font-size: 16px;
          font-weight: bold;
        }

        .el-image {
          width: auto;
          height: 280px;
          margin: 0 auto;
          border-radius: 4px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        }
      }
    }

    .el-pagination {
      text-align: center;
    }

    .looper-url {
      display: flex;
      justify-content: center;
    }
  }

  .aside {

    .el-button {
      width: 100%;
      color: #cccccc;
      background-color: black;
    }

    .el-button:hover {
      color: white;
    }

    ul > li {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      margin-bottom: 8px;

      img {
        height: 30px;
        width: 30px;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }

      a {
        margin-left: 20px;
        font-size: 16px;
      }

      a:hover {
        color: #8205c6;
        text-decoration: underline;
      }
    }
  }
}

// md
@media screen and (min-width: 960px) {
  .container {

    .container-in {
      width: 80%;
      padding-bottom: 26px;
      margin: 0 auto;

      .main {
        float: left;
        width: 75%;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        .search {
          .el-input {
            width: 50%;
          }
        }
      }

      .aside {
        float: left;
        width: 23%;
        margin-bottom: 20px;
        margin-left: 26px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {

  .line-top {
    width: 100%;
    height: 1px;
    background-color: black;
  }

  .container {

    .container-in {
      clear: both;
      width: 100%;

      .main {
        .search {
          width: 80%;
        }

        h1 {
          padding-top: 20px;
        }

        ul > li .info-box {
          margin-top: 20px;
        }
      }

      .aside {
        float: left;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }

}
</style>

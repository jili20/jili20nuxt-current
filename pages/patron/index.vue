<template>
  <!-- 所有投放诗语人列表 -->
  <div class="container">
    <!-- 顶部清除浮动线 -->
    <div class="line"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 左边大容器 -->
      <div class="main">
        <h1>※ 随机诗语 ※ </h1>
        <el-tabs v-model="activeName" stretch>
          <!-- 投放诗语人 开始 -->
          <el-tab-pane label="诗语" name="first">
            <!-- 搜索框 -->
            <div class="search">
              <el-input clearable placeholder="请输入投放人姓名" v-model="searchObj.username" class="input-with-select"
                        @keyup.enter.native="patronSearch(searchObj.username)">
                <el-button slot="append" icon="el-icon-search"
                           @click.native="patronSearch(searchObj.username)"></el-button>
              </el-input>
              <!-- <el-button class="amount" slot="append" @click.native="searchAmount()">投放诗语金额 ↓</el-button>-->
            </div>
            <!-- 投放诗语人 信息 -->
            <el-card class="box-card" v-for="item in list" :key="item.id">
              <div class="content-box">
                <div>
                  <p><b>来自：</b> {{ item.username }} </p>
                  <p><b>内容：</b>{{ item.message }}</p>
                  <p><b>日期：</b> {{ item.createTime }}</p>
                  <el-button v-if="userId" type="primary" size="mini" icon="el-icon-delete" circle
                             @click="handleDelete(item.id)"></el-button>
                </div>
                <div>
                  <img class="avatar" :src="item.avatar" alt="" lazy/>
                </div>
              </div>
            </el-card>
            <!-- 分页组件 -->
            <div class="page">
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
            </div>
            <!-- /分页组件 结束 -->
          </el-tab-pane>
          <!-- /投放诗语人 结束 -->
          <el-tab-pane label="" name="two"></el-tab-pane>
        </el-tabs>
      </div>
      <!-- 右则边栏 开始 -->
      <template>
        <!-- 子组件-发布新贴入口 -->
        <Add/>
        <!-- 子组件-随机诗语 -->
        <Aphorism :content="randomTip.content" :author="randomTip.author"/>
        <!-- 子组件-文章推荐 -->
        <Recommend v-bind:recommendArticleList="recommendArticleList"/>
        <!-- 子组件-轮播图 -->
        <Looper v-bind:looperListRight="looperListRight"/>
        <!-- 子组件 - 投放诗语 -->
        <Patron v-bind:oneTop="oneTop" :isOpenPatron="isOpenPatron"
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
import Aphorism from '@/components/aside/aphorism'  // 子组件-右则随机诗语
import Recommend from '@/components/aside/recommend'  // 子组件-右则文章推荐
import Looper from '@/components/aside/looper'  // 子组件-右则小轮播图
import Patron from '@/components/aside/patron' // 子组件-投放诗语-成为VIP投放诗语人

export default {
  name: 'patron',
  // 动态标题
  head() {
    return {
      title: '随机诗语 - 经历网'
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
    // 首页文章列表
    const current = 1
    const size = 10
    // 投放诗语人条件搜索对象
    const searchObj = {
      username: '',
      amount: ''
    }
    // 投放诗语人查询条件
    searchObj.username = query.username || ''
    searchObj.amount = query.amount || ''
    // 条件分页查询投放诗语人列表
    const {data: patrons} = await app.$getPatronListPage(current, size, searchObj)
    const total = patrons.total
    const list = patrons.records
    // 随机诗语
    const {data: aphorism} = await app.$getRandomTip()
    const randomTip = aphorism.randomTip
    // 文章推荐列表
    const {data: recommend} = await app.$getArticleRecommendList()
    const recommendArticleList = recommend.recommendList
    // 轮播图 - 右边栏
    const {data: looperRight} = await app.$getPatronRightLooperList()
    const looperListRight = looperRight.looperListRight
    // 投放诗语-右则栏列表
    const {data: one} = await app.$getOneTop()
    const oneTop = one.oneTop
    return {
      userId,
      current,
      size,
      searchObj,
      total,
      list,
      randomTip,
      recommendArticleList,
      looperListRight,
      oneTop
    }
  },
  data() {
    return {
      activeName: 'first',
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
    // 条件分页查询投放诗语人列表
    async fetchData() {
      const {data} = await this.$getPatronListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = data.total
    },
    // 根据用户名查询投放诗语人(使用拼接地址的方式，方法用户转发地址直接到当前页面）
    patronSearch(username) {
      this.$router.push('?patron&current=1&size=10&username=' + username)
      this.searchObj.username = username
      this.fetchData()
      // window.location = '?patron&current=1&size=10&username=' + username;
    },
    // 投放诗语人-切换页码
    handleCurrentChange(current) {
      this.current = current
      this.fetchData()
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
          this.fetchData()
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
    // 删除投放诗语人信息
    handleDelete(id) {
      this.$confirm('确定要 删除 这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$deleteByOneId(id).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$message.success(response.message)
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="less" scoped>
// 公共样式
.avatar {
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

// 公共搜索框
.search {
  display: flex;
  justify-content: center;
  margin: 20px auto 40px;

  .el-button {
    padding: 8px 20px;
    -webkit-border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }

  .el-input__inner {
    height: 42px;
  }
}

// 最外层容器
.container {
  min-height: 630px;

  // 页面左则容器、右则容器
  .main, .aside {
    background-color: #FFFFFF;
  }

  .main {
    border-radius: 4px;

    h1 {
      text-align: center;
    }

    .sponsor-card {
      background: #FFFFFF;
    }

    .el-tabs {
      border-radius: 4px;
      background: #dcdbdb;

      // 投放诗语人按金额排序按钮
      .amount {
        margin-left: 5px;
        font-weight: bold;
        color: #e0dede;
        background: #2b2b2b;
      }
    }

    .el-pagination {
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
}

// --------------- md ------------------>
@media screen and (min-width: 960px) {
  .container {
    background: #242424;

    .line {
      clear: both;
      height: 1px;
    }

    .container-in {
      width: 80%;
      margin: 0 auto;
      padding-bottom: 26px;
      border-radius: 4px;

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

        .content-box {
          display: flex;
          justify-content: space-between;
          width: 70%;
          margin: 0 auto;

          p {
            font-size: 14px;
          }

          .avatar {
            width: 90px;
            height: 90px;
          }
        }
      }

      .aside {
        float: left;
        width: 23%;
        margin-left: 26px;
        margin-bottom: 20px;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// ------------- sm -------------->
@media screen and (max-width: 960px) {
  .container {

    .line {
      height: 1px;
    }

    .container-in {
      width: 100%;

      .main {
        width: 100%;
        margin: 0 auto;

        h1 {
          padding-top: 20px;
        }

        .search {
          width: 100%;
          padding: 10px;

          .el-input {
            width: 60%;
          }

          .amount {
            margin-right: 20px;
          }
        }

        .content-box {
          display: flex;
          justify-content: space-between;
          margin: 0 auto;

          p {
            font-size: 14px;
          }

          .avatar {
            width: 80px;
            height: 80px;
          }
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

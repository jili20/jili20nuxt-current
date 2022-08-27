<template>
  <div class="index">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 轮播图 开始 -->
    <el-carousel>
      <!-- <el-carousel :style="{backgroundImage: 'url(' + loopBackgroundImage + ')'}">-->
      <el-carousel>
        <div v-for="item in looperListTop" :key="item.id">
          <el-carousel-item>
            <div>
              <nuxt-link :to="item.looperLink" v-if="item.looperLink">
                <img :src="item.looperUrl" alt="">
              </nuxt-link>
              <nuxt-link :to="'/user/'+item.userId" v-else>
                <img :src="item.looperUrl" alt="">
              </nuxt-link>
            </div>
          </el-carousel-item>
        </div>
      </el-carousel>
    </el-carousel>
    <!-- /轮播图 结束 -->
    <!-- 中间内容区域 -->
    <div class="content-box">
      <div class="section">
        <!-- 分类 开始 -->
        <div class="category-box">
          <!-- 一级全部 开始 -->
          <ul class="category-one-ul">
            <!-- 全部分类 开始（样式判断，可以使用 searchObj.categoryParentId; 也可以使用 v-if="$route.query.categoryPid"） -->
            <li :class="{current:!searchObj.categoryPid}" class="all">
              <a href="javascript:void(0);" title="全部" :class="{current:!searchObj.categoryPid}"
                 @click="searchCategoryAll">全部
              </a>
            </li>
            <!-- / 一级全部 结束 -->
            <!-- 一级分类 开始 -->
            <li class="category-one" v-for="c1 in categoryList" :key="c1.id"
                :class="{current:$route.query.categoryPid==c1.id}">
              <div>
                <nuxt-link to="" class="category-one-name"
                           :title="c1.categoryName" :class="{current:$route.query.categoryPid==c1.id}"
                           @click.native="searchCategoryLeverOne(c1.id)">{{ c1.categoryName }}
                </nuxt-link>
              </div>
            </li>
          </ul>
          <!-- /一级分类 结束 -->
          <!-- 二级分类 开始 -->
          <div class="category-two-box">
            <!-- /二级全部 开始 -->
            <div class="category-two-all" :class="{active1:!searchObj.categoryId}"
                 v-if="$route.query.categoryPid">
              <nuxt-link to="" class="link" title="全部" :class="{active1:!searchObj.categoryId}"
                         @click.native="searchCategoryLeverTwo('')">全部
              </nuxt-link>
            </div>
            <!-- /二级全部 结束 -->
            <ul class="category-two-ul">
              <!-- 二级分类 开始 -->
              <li v-for="c2 in categoryChildren" :key="c2.id"
                  class="category-two-li"
                  :class="{active:$route.query.categoryId==c2.id}">
                <nuxt-link to="" :title="c2.categoryName"
                           class="category-two-name"
                           :class="{active:$route.query.categoryId==c2.id}"
                           @click.native="searchCategoryLeverTwo(c2.id)">{{ c2.categoryName }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
        <!-- /分类 结束 -->
        <!-- 暂无数据 开始 -->
        <section class="no-data" v-if="list.length === 0">
          <span>查无数据</span>
        </section>
        <!-- /暂无数据 结束 -->
        <!-- ES 搜索输入框 -->
        <br>
        <div class="es-search-box">
          <el-input v-model="keyword" @focus="focus()" @blur="blur()" @keyup.enter.native="search" clearable
                    placeholder="请输入关键词">
            <el-button slot="append" @click="search" maxlength="30" clearable show-word-limit> 搜 索</el-button>
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
        <br>
        <!-- 排序 开始 -->
        <ul class="order" v-if="total > 0">
          <li :class="{orderActive:searchObj.createTime}">
            <nuxt-link to="" class="txt" @click.native="searchCreateTime">
              最新 <i v-if="searchObj.createTime ==1">↓</i></nuxt-link>
          </li>
          <li :class="{orderActive:searchObj.viewCount}">
            <nuxt-link to="#" class="txt" @click.native="searchViewCount">浏览 <i v-if="searchObj.viewCount ==1">↓</i>
            </nuxt-link>
          </li>
        </ul>
        <!-- /排序 结束 -->
        <!-- 文章标题列表 开始 -->
        <ul class="article-title-list">
          <li v-for="item in list" :key="item.id">
            <div class="item">
              <div>
                <!-- 跳转到用户个人主页 -->
                <nuxt-link :to="'/user/'+item.userId">
                  <img v-if="item.masterUrl" class="avatar" :src="item.masterUrl" alt="" lazy/>
                  <img v-else class="avatar" :src="item.avatar" alt="" lazy/>
                </nuxt-link>
              </div>
              <div>
                <!-- 跳转到文章详情页面 -->
                <nuxt-link :to="'/article/'+item.id" target="_blank">
                  <b>{{ item.title }}</b>
                </nuxt-link>
                <div class="title-box">
                  <!-- 跳转到一级分类 -->
                  <el-link :href="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid" class="sm-hidden">
                    <span>{{ item.categoryParentName }}</span>
                  </el-link>
                  <el-divider direction="vertical" class="sm-hidden"/>
                  <!-- 跳转到二级分类 -->
                  <el-link
                    :href="'/?current=1&size=10&createTime=1&categoryPid=' + item.categoryPid + '&categoryId=' + item.categoryId">
                    <span>{{ item.categoryName }}</span>
                  </el-link>
                  <el-divider direction="vertical"/>
                  <span :class="{orderActive2:searchObj.viewCount}"><i class="el-icon-view"/> {{
                      item.viewCount
                    }}</span>
                  <el-divider direction="vertical" class="sm-hidden"/>
                  <span class="sm-hidden"><i class="el-icon-chat-dot-round"/> </span>
                  <el-divider direction="vertical" class="sm-hidden"/>
                  <span class="sm-hidden"><span class="iconfont icon-zan1"></span> </span>
                  <el-divider direction="vertical"/>
                  <span class="sm-hidden"><i class="el-icon-star-off"/> </span>
                  <el-divider direction="vertical" class="sm-hidden"/>
                  <span class="el-icon-coin sm-hidden"></span>
                  <el-divider direction="vertical" class="sm-hidden"/>
                  <span><i class="el-icon-time"/> {{ item.createTime }} </span>
                </div>
              </div>
            </div>
            <div></div>
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
              :total="total">
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
              :total="total">
            </el-pagination>
            <br>
          </template>
          <!-- /分页组件 结束 -->
        </ul>
        <!-- /文章标题列表 结束 -->
      </div>
      <!-- 右则边栏 开始 -->
      <template>
        <!-- 子组件-发布新贴入口 -->
        <Add/>
        <!-- 系统公告 -->
        <Announcement v-if="ann!==undefined" :ann="ann"/>
        <!-- 子组件-随机诗语 -->
        <Aphorism :content="randomTip.content" :author="randomTip.author"/>
        <!-- 子组件-文章推荐 -->
        <Recommend v-bind:recommendArticleList="recommendArticleList"/>
        <!-- 子组件-轮播图 -->
        <Looper v-bind:looperListRight="looperListRight"/>
        <!-- 子组件 - 改为随机诗语 -->
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
import Aphorism from '@/components/aside/aphorism'  // 子组件-右则随机诗语
import Recommend from '@/components/aside/recommend'  // 子组件-右则文章推荐
import Looper from '@/components/aside/looper'  // 子组件-右则小轮播图
import Patron from '@/components/aside/patron' // 子组件-投放诗语-成为VIP投放诗语人
import Announcement from '@/components/aside/announcement' // 子组件-系统公告

export default {
  name: 'IndexPage',
  components: {
    Add,
    Aphorism,
    Recommend,
    Looper,
    Patron,
    Announcement
  },
  async asyncData({app, route}) {
    // 首页文章列表
    const current = 1
    const size = 10
    // 条件搜索对象
    const searchObj = {
      categoryId: null,
      categoryPid: null,
      viewCount: null,
      createTime: '',
      updateTime: ''
    }
    // 组装查询参数：当点击查询条件的时候，在url地址栏中组装查询参数。从url地址栏中获取查询参数，对页面中响应部分的内容进行高亮显示
    // 获取路由字符串参数，赋值给 searchObj。从route中获取query,所以方法上要传入route
    const query = route.query
    // 左边是后端属性名， 右边是地址栏上的值
    // http://localhost:3000?current=1&size=10&categoryId=2
    // http://localhost:3000/?current=1&size=10&createTime=1&categoryPid=3&categoryId=35
    searchObj.categoryId = query.categoryId || ''
    searchObj.categoryPid = query.categoryPid || ''
    searchObj.viewCount = query.viewCount || ''
    searchObj.createTime = query.createTime || '1' // 默认最新排序
    searchObj.updateTime = query.updateTime || ''
    // 条件分页查询文章列表
    const {data: articleList} = await app.$getArticleListPage(current, size, searchObj)
    const total = Number(articleList.total)
    const list = articleList.records
    // 查询所有分类
    const {data: categories} = await app.$getCategoryList()
    const categoryList = categories.categoryList
    // 二级分类: 遍历一级分类:查询一级分类下的二级分类
    let categoryChildren = []

    for (let i = 0; i < categoryList.length; i++) {
      // 注意：后端分类id是Integer类型，地址栏分类id是字符串，所以只能用 == ，不能用 ===
      if (categoryList[i].id == searchObj.categoryPid) {
        // 组装二级分类数据
        categoryChildren = categoryList[i].children
      }
    }
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
    // 查询最新一条系统公告
    const {data: announcement} = await app.$getAnnouncementOne()
    const ann = announcement.content
    // 轮播图背景图片
    // const {data: one} = await app.$getBackgroundOne()
    // const loopBackgroundImage = one.url

    return {
      // loopBackgroundImage,
      ann,
      current,
      size,
      total,
      searchObj,
      list,
      categoryList,
      categoryChildren,
      looperListTop,
      looperListRight,
      recommendArticleList,
      randomTip
    }
  },
  data() {
    return {
      // 搜索关键字
      keyword: "",
      hotWorldsBox: false,
      hotWorlds: [],
      // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
      // userId: this.$store.state.userInfo && this.$store.state.userInfo.id,
      // 投放诗语-窗口
      isOpenPatron: false,
      addPatronData: {
        avatar: '',
        message: "",
        username: "",
        link: ''
      }
    }
  },
  methods: {
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
    // 搜索-点击热搜词搜索
    searchHotWorlds(world) {
      this.$router.push('/search?keyword=' + world)
    },
    // 搜索-带关键词跳转到 ElasticSearch 搜索结果页面
    search() {
      // 关闭导航下拉框
      if (this.keyword === '') {
        this.$message({
          showClose: true,
          message: '请输入关键词',
          type: 'warning'
        });
        return
      }
      window.location = '/search?keyword=' + this.keyword;
    },
    // 刷新列表数据
    async fetchData() {
      const {data} = await this.$getArticleListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)
    },
    // 切换分页
    async handleCurrentChange(current) {
      this.current = current
      await this.fetchData()
    },
    // 点击查询全部
    async searchCategoryAll() {
      // 组装查询条件
      this.current = 1
      this.size = 10
      this.searchObj.createTime = '1'
      this.searchObj.categoryId = null
      this.searchObj.categoryPid = null
      // 组装路径参数
      await this.$router.push({
        path: `/`,
        query: {'current': '1', 'size': '10', 'createTime': '1'}
      })
      // 调用接口查询
      const {data} = await this.$getArticleListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)
      this.categoryChildren = null
    },
    // 点击查询一级分类（根据一级分类id查询，有一级分类ID，有激活样式，拼接地址栏地址)
    async searchCategoryLeverOne(categoryPid) {
      // window.location = '?current=1&size=10&createTime=1&categoryPid=' + categoryPid;
      this.searchObj.createTime = '1'
      this.searchObj.categoryId = null
      this.searchObj.categoryPid = categoryPid
      // 接的地址栏地址
      await this.$router.push({
        path: `/`,
        query: {'current': '1', 'size': '10', 'createTime': '1', 'categoryPid': categoryPid}
      })
      // 点击一级分类，显示对应的所有子分类
      for (let i = 0; i < this.categoryList.length; i++) {
        // 注意：后端分类id是Integer类型，地址栏分类id是字符串，所以只能用 == ，不能用 ===
        if (this.categoryList[i].id == this.searchObj.categoryPid) {
          // 组装二级分类数据
          this.categoryChildren = this.categoryList[i].children
        }
      }
      const {data} = await this.$getArticleListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)
    },
    // 点击查询二级分类（根据二级分类id查询，有二级分类ID，有激活样式，拼接地址栏地址)
    async searchCategoryLeverTwo(categoryId) {
      await this.$router.push({
        path: `/`,
        query: {
          'current': '1',
          'size': '10',
          'createTime': '1',
          'categoryPid': this.searchObj.categoryPid,
          'categoryId': categoryId
        }
      })
      this.searchObj.createTime = '1'
      this.searchObj.categoryId = categoryId
      const {data} = await this.$getArticleListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)

    },
    // 排序-最新发布 ( createTime 有值为最新排序 )
    async searchCreateTime() {
      // 拼接路径参数
      await this.$router.push({
        path: `/`,
        query: {
          'current': '1',
          'size': '10',
          'createTime': '1',
          'categoryPid': this.searchObj.categoryPid,
          'categoryId': this.searchObj.categoryId
        }
      })
      // 组装查询条件
      this.searchObj.createTime = '1'
      this.searchObj.updateTime = ''
      this.searchObj.viewCount = null
      // 执行查询
      const {data} = await this.$getArticleListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)
    },
    // 排序-浏览量
    async searchViewCount() {
      // 拼接路径参数
      await this.$router.push({
        path: `/`,
        query: {
          'current': '1',
          'size': '10',
          'categoryPid': this.searchObj.categoryPid,
          'categoryId': this.searchObj.categoryId,
          'viewCount': '1'
        }
      })
      // 组装查询条件
      this.searchObj.createTime = ''
      this.searchObj.updateTime = ''
      this.searchObj.viewCount = '1'
      // 执行查询
      const {data} = await this.$getArticleListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)
    },
    // 排序-留言数
    async searchCommentCount() {
      // 拼接路径参数
      await this.$router.push({
        path: `/`,
        query: {
          'current': '1',
          'size': '10',
          'categoryPid': this.searchObj.categoryPid,
          'categoryId': this.searchObj.categoryId,
          'commentCount': '1'
        }
      })
      // 组装查询条件
      this.searchObj.createTime = ''
      this.searchObj.updateTime = ''
      this.searchObj.viewCount = null
      // 执行查询
      const {data} = await this.$getArticleListPage(this.current, this.size, this.searchObj)
      this.list = data.records
      this.total = Number(data.total)
    },
    // 跳转到新增轮播图页面
    addLooper() {
      this.$router.push('/looper')
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

.index {

  .el-divider {
    background-color: #eff2f3 !important;
  }

  .iconfont:hover, .icon-shoucang-shoucang:hover, .el-icon-star-off:hover {
    color: #5c5a59;
    cursor: unset;
  }

  .el-icon-star-off {
    font-size: 16px;
  }

  .icon-zan1 {
    font-size: 14px;
  }

  .line-top {
    clear: both;
    height: 1px;
    background-color: #35363a;
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

  // 公共样式
  .category-box {
    overflow: auto;

    .category-one-ul {
      display: flex;
      align-items: center;
      padding-top: 10px;
    }

    // 一级分类全部
    .all {
      margin-right: 10px;
      padding: 5px 10px;
      border: #adacac 1px solid;
      border-radius: 4px;
      white-space: nowrap; // 强制分类名一行显示，超出自动添加滚动条
    }

    // 一级分类名
    .category-one-name {
      padding: 8px 15px;
      border: #adacac 1px solid;
      border-radius: 4px;
      white-space: nowrap; // 强制分类名一行显示，超出自动添加滚动条
    }

    .category-one-name:hover, .category-two-name:hover {
      color: white;
      border: black 1px solid;
      background-color: black;
    }

    .category-two-box {
      position: relative;

      .category-two-all {
        position: absolute;
        z-index: 10;

        .link {
          padding: 0 10px;
        }
      }

      .category-two-li {
        display: inline-block;
        margin: 3px;

        .category-two-name {
          padding: 3px 15px;
          font-size: 16px;
          line-height: 30px;
          border: #cccccc 1px solid;
          border-radius: 4px;
        }
      }
    }

    // 一级分类激活样式
    .current {
      background-color: black;
      color: white;
    }

    // 二级分类全部
    .active1 {
      color: white;
      line-height: 30px;
      border-radius: 4px;
      background-color: black;
    }

    // 二级分类激活样式
    .active {
      color: white;
      border: none;
      border-radius: 4px;
      background-color: black;
    }
  }

  // 排序
  .order {
    clear: both;
    margin-bottom: 40px;
    margin-left: 50px;

    li {
      display: inline-block;
      margin: 3px;
      padding: 2px 10px;
      font-size: 16px;
      text-align: center;
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
    }
  }

  .title-box {
    margin-top: 8px;
    font-size: 14px;
    color: gray;
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

  // 侧边栏
  .aside {
    float: left;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

    .el-button {
      width: 100%;
      color: #cccccc;
      background-color: black;
    }

    .el-button:hover {
      color: white;
    }

    .el-card {
      border: none;
      box-shadow: none;
    }

    .aside-content-box {
      padding: 10px 20px 30px 10px;
    }

    .el-carousel {
      clear: both;
      height: 300px;
      border-radius: 4px;
    }
  }
}

// ----------------- md -------------------->
@media screen and (min-width: 960px) {

  .index {

    // 轮播图
    .el-carousel {
      clear: both;
      height: 310px;
      width: 100%;
      background: url("~@/assets/img/background/1.gif") no-repeat 0 0;
      background-size: 100% 100%;

      div {
        display: flex;
        justify-content: center;

        img {
          width: 100%;
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

    .content-box {
      width: 80%;
      margin: 0 auto;

      .section {
        min-height: 1500px;
        float: left;
        width: 62%;
        border-radius: 4px;
        padding: 0 80px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        .category-two-ul {
          width: 85%;
          margin-bottom: 5px;
          margin-left: 70px;
        }

        .es-search-box {
          width: 70%;
          margin: 20px auto;
        }

        // 文章标题列表
        .article-title-list {
          margin-left: 50px; // 整个标题列表与左辚的距离
          .item {
            display: flex;

            div {
              margin-right: 20px;
            }
          }

          .avatar {
            width: 50px;
            height: 50px;
            padding: 1px;
            border: #bbbec3 solid 1px;
            //border-radius: 50%;
            border-radius: 4px;
            //box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
            transition: all .4s ease-in-out;
            -webkit-transition: all .4s ease-in-out;
            object-fit: cover;
          }

          .avatar:hover {
            transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
          }
        }
      }

      .no-data {
        padding: 80px;
        text-align: center;
      }

      // 右则边栏
      .aside {
        width: 23%;
        margin-left: 26px;

        .patron {

          div {
            display: inline-block;

            img {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
}

/* sm */
@media screen and (max-width: 960px) {

  .sm-hidden {
    display: none;
  }

  .index {

    // 轮播图
    .el-carousel {
      clear: both;
      height: 310px;
      width: 100%;
      background: url("~@/assets/img/background/1.gif") no-repeat 0 0;
      background-size: 100% 100%;

      div {

        img {
          width: 100%;
          height: 100% !important;
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

    .content-box {
      width: 100%;
      margin: 3px auto;

      .section {
        float: left;
        width: 100%;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);


        .category-box {
          margin: 0 10px;
          overflow-x: auto;
        }

        .category-two-ul {
          width: 200%;
          margin-bottom: 30px;
          margin-left: 70px;
        }

        // 排序
        .order {
          margin-left: 10px;
        }

        .es-search-box {
          width: 85%;
          margin: 20px auto;
        }

        // 文章标题列表
        .article-title-list {
          width: 95%;
          margin: 0 auto;

          .item {
            display: flex;

            div {
              margin-right: 10px;
            }
          }

          .avatar {
            width: 50px;
            height: 50px;
            padding: 1px;
            border: #bbbec3 solid 1px;
            //border-radius: 50%;
            border-radius: 4px;
            //box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
            transition: all .4s ease-in-out;
            -webkit-transition: all .4s ease-in-out;
            object-fit: cover;
          }

          .avatar:hover {
            transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
          }
        }
      }

      .no-data {
        padding: 80px;
        text-align: center;
      }

      // 侧边栏
      .aside {
        width: 100%;

        .patron {
          padding-left: 10px;

          div {
            display: inline-block;

            img {
              margin-left: 5px;
            }
          }

        }
      }

      // sm-减少随机诗语与文章列表的间距
      .aside-add {
        margin-top: 0;
      }

    }
  }
}
</style>

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
        <Total :username="user.username" :userId="user.id" :avatar="user.avatar"
               :aCount="aCount" :authId="userId"/>
        <el-divider/>
        <div class="list-box">
          <h2>藏经阁</h2>
          <!-- 标题按钮区 -->
          <div class="title-btn">
            <a :href="'/user/private/'+ user.id"><h3><i class="el-icon-loading"/> 动态</h3></a>
            <a :href="'/user/private/draft/?id='+ user.id"><h3><i class="el-icon-edit-outline"/> 草稿</h3></a>
            <a :href="'/user/private/update/?id='+ user.id"><h3><i class="el-icon-setting"/> 设置</h3></a>
            <a :href="'/user/private/loop/?id='+ user.id" class="activate-icon"><h3>
              <i class="el-icon-picture"/> 投图</h3></a>
          </div>
          <div>
            <ul class="title-out-box">
              <li class="box-card" v-for="item in loopList" :key="item.id">
                <div class="content-box">
                  <div>
                    <nuxt-link :to="'/user/'+item.userId">
                      <p>投放诗语者：{{ item.username }}</p>
                    </nuxt-link>
                    <a :href="item.looperLink"><p>图片标题： {{ item.title }}</p></a>
                    <!-- (0 首页轮播图；1 首页右则；2 帖子正文下)  -->
                    <p v-if="item.position == 0">图片播放位置： 首页顶部</p>
                    <p v-if="item.position == 1">图片播放位置： 首页右则</p>
                    <p v-if="item.position == 2">图片播放位置： 帖子正文下</p>
                    <a :href="item.looperLink"><p class="el-icon-link"> 网页链接</p></a>
                    <!-- 状态：（ 0:待审核; 1 审核通过播放中; 2 审核未通过; 3  留存） -->
                    <p v-if="item.status == 0">状态： <span class="status-0">待审核</span></p>
                    <p v-if="item.status == 1">状态： <span class="status-1">播放中</span></p>
                    <p v-if="item.status == 2">状态： <span>未启用</span></p>
                    <p>投放时间： {{ item.createTime }}</p>
                    <!-- 新增、编辑、删除轮播图按钮 -->
                    <el-button size="mini" type="primary" icon="el-icon-plus" circle
                               @click="handleAdd"/>
                    <el-button v-if="authId !== 0" size="mini" type="primary" icon="el-icon-delete" circle
                               @click="handleDelete(item.id)"/>
                    <el-button v-if="authId == 0" size="mini" type="primary" icon="el-icon-delete" circle/>
                    <el-button v-if="authId !== 0" size="mini" type="primary" icon="el-icon-edit" circle
                               @click="handleUpdate(item.id)"/>
                    <el-button v-if="authId == 0" size="mini" type="primary" icon="el-icon-edit" circle/>
                  </div>
                  <div>
                    <!-- 跳转到用户个人主页 -->
                    <el-image :src="item.looperUrl" :preview-src-list="[item.looperUrl]"/>
                  </div>
                </div>
                <el-divider/>
              </li>
            </ul>
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
                :total="Number(loopTotal)">
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
                :total="Number(loopTotal)">
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
  // middleware: 'auth',
  components: {
    Set,
    Total
  },
  // 动态标题
  head() {
    return {
      title: this.user.username + ' 的私人空间 - 经历网'
    }
  },
  async asyncData({app, store}) {
    // 获取当前登录用户ID（用于判断是否能看到删除按钮）
    const userId = 1
    const authId = store.state.userInfo && store.state.userInfo.id || 0
    // 通过路由ID查询用户信息
    let {data: info} = await app.$getUserInfoByRouteId(userId)
    const user = info.user
    // 统计-文章微服务
    const {data: articleServiceCount} = await app.$statisticCountArticle(userId)
    const aCount = articleServiceCount.statistic
    // 分页列表
    const current = 1
    const size = 10
    const {data: loop} = await app.$getUserAllLooperList(userId, current, size)
    const loopList = loop.records
    const loopTotal = loop.total

    return {
      authId,
      userId,
      user,
      aCount,
      current,
      size,
      loopList,
      loopTotal
    }
  },
  methods: {

    // 获取列表数据
    async fetchData() {
      const {data} = await this.$getUserAllLooperList(this.userId, this.current, this.size)
      this.loopList = data.records
      this.loopTotal = Number(data.total)
    },
    // 切换分页
    handleCurrentChange(current) {
      this.current = Number(current)
      this.fetchData()
    },
    // 跳转到新增页面
    handleAdd() {
      window.location = '/looper';
    },
    // 跳转到编辑页面-根据ID编辑
    handleUpdate(id) {
      if (this.authId === 0) {
        this.$message.info("功能展示")
        return;
      }
      window.location = '/looper?id=' + id;
    },
    // 根据ID删除
    handleDelete(id) {
      if (this.authId === 0) {
        this.$message.info("功能展示")
        return;
      }
      this.$confirm('您确定要删除这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.$removeUserLooperById(id).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$message.success("删除轮播图成功")
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

<style lang="less">

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

      .status-0 {
        color: #3f9dfd;
      }

      .status-1 {
        color: #66c03a;
      }

      .danger {
        color: #e70505;;
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

      .box-card {
        p {
          font-size: 14px;
          font-weight: bold;
        }

        .el-image:hover {
          transform: rotate(360deg);
          -webkit-transform: rotate(360deg);
        }
      }
    }

    .page {
      padding: 20px 0 80px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      background: url("~@/assets/img/patron/3.gif") no-repeat 0 0;
      background-size: 100% 100%;
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
          width: 90%;
          margin: 0 auto;

          .content-box {
            display: flex;
            justify-content: space-between;
            margin: 0 70px;

            .el-image {
              width: 300px;
              padding: 1px;
              border: #bbbec3 solid 1px;
              border-radius: 4px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
              transition: all .4s ease-in-out;
              -webkit-transition: all .4s ease-in-out;
              object-fit: cover;
            }
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

          .title-out-box {
            width: 90%;
            margin: 0 auto;
          }

          // 列表内容区域
          .content-box {
            display: flex;
            justify-content: space-between;
            margin: 20px 10px;

            .el-image {
              width: 100px;
              padding: 1px;
              border: #bbbec3 solid 1px;
              border-radius: 4px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
              transition: all .4s ease-in-out;
              -webkit-transition: all .4s ease-in-out;
              object-fit: cover;
            }
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

<template>
  <header>
    <!-- md-顶部导航 开始 -->
    <el-row>
      <el-col :span="4">
        <!-- 首页 Logo -->
        <a href="/">
          <img class="logo" src="@/assets/img/index/logo.png" height="50" width="138"
               title="经历网" alt="经历网logo" lazy/>
        </a>
      </el-col>
      <el-col :span="8" class="category">
        <div>
          <nuxt-link to="/?current=1&size=10&createTime=1&categoryPid=1" class="item"> 经历</nuxt-link>
          <nuxt-link to="/?current=1&size=10&createTime=1&categoryPid=2" class="item"> 信息</nuxt-link>
          <nuxt-link to="/?current=1&size=10&createTime=1&categoryPid=3" class="item"> 艺术</nuxt-link>
          <nuxt-link to="/?current=1&size=10&createTime=1&categoryPid=4" class="item"> 觉悟</nuxt-link>
          <nuxt-link to="/?current=1&size=10&createTime=1&categoryPid=5" class="item"> 宣言</nuxt-link>
          <nuxt-link to="/?current=1&size=10&createTime=1&categoryPid=6" class="item"> 送别</nuxt-link>
          <nuxt-link to="/?current=1&size=10&createTime=1&categoryPid=7" class="item"> 服务</nuxt-link>
        </div>
      </el-col>
      <el-col :span="6" class="search">
        <!-- ES 搜索输入框 开始 -->
        <div>
          <el-input placeholder="请输入内容" v-model="keyword" clearable @keyup.enter.native="search(keyword)">
            <el-button slot="append" @click="search" type="primary" maxlength="30" clearable show-word-limit>
              搜索
            </el-button>
          </el-input>
        </div>
        <!-- /ES 搜索输入框 开始 -->
      </el-col>
      <el-col :span="6" class="login">
        <div>
          <span @click="back" class="back">〈〈</span>
          <div class="status">
            <!-- md发布新贴-->
            <a href="/article/edit-article">
              <b class="add">+</b>&nbsp;&nbsp;&nbsp;&nbsp;
            </a>
            <nuxt-link :to="'/user/notice/'+1">
              <!-- md-消息通知 -->
              <el-badge :value="1" :max="1" class="md-msg" type="danger"/>&nbsp;&nbsp;&nbsp;&nbsp;
            </nuxt-link>
            <div class="avatar-box">
              <img v-if="!userId" class="avatar" src="@/assets/img/logo/avatar.png"
                   height="40" width="40" lazy
                   alt=""/>
              <img v-if="userId" class="avatar" :src="avatar" height="40" width="40" lazy alt=""/>
              <!-- md 头像下拉菜单 -->
              <div class="dropdown">
                <div>
                  <nuxt-link to="/auth/login" class="item iconfont icon-login-full br"> 参观登录</nuxt-link>
                </div>
                <div>
                  <nuxt-link to="/auth/register" class="item iconfont icon-zhucehaoxiafa br">参观注册</nuxt-link>
                </div>
                <div>
                  <nuxt-link class="el-icon-s-home item" :to="'/user/'+1"> 参观主页</nuxt-link>
                </div>
                <div>
                  <nuxt-link class="el-icon-s-custom item" :to="'/user/private/'+1"><i class="el-icon-user-solid"/> 藏经阁
                  </nuxt-link>
                </div>
                <div>
                  <nuxt-link class="el-icon-picture item" to="/looper/all"> 轮播图片</nuxt-link>
                </div>
                <div>
                  <nuxt-link class="el-icon-edit item" to="/patron"> 随机诗语</nuxt-link>
                </div>
                <div v-if="userId">
                  <nuxt-link class="el-icon-setting item" to="/admin"> 后台管理</nuxt-link>
                </div>
                <div>
                  <a v-if="userId" class="el-icon-switch-button item" href="javascript:void(0);" @click="logout">
                    退出系统</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- /md-顶部导航 结束 -->
    <!-- sm-下拉导航 开始 -->
    <div class="sm-nav" @click="isOpen = !isOpen">
      <span v-if="isOpen" class="iconfont icon-xingzhuang"></span>
      <span v-if="!isOpen" class="iconfont icon-shousuo"></span>
    </div>
    <transition name="nav">
      <div v-show="isOpen" class="sm-nav-dropdown">
        <!--  ES 搜索输入框 开始 -->
        <div class="sm-search">
          <el-input class="search-input" placeholder="请输入关键字" v-model="keyword" clearable
                    @keyup.enter.native="search(keyword)">
            <el-button class="el-icon-search" slot="append" @click="search"/>
          </el-input>
        </div>
        <!-- 用户头像-->
        <div class="sm-avatar-box">
          <el-link :href="'/user/'+1">
            <img v-if="!userId" class="sm-avatar" src="@/assets/img/logo/avatar.png"
                 height="40" width="40" lazy
                 alt=""/>
            <img v-if="userId" class="sm-avatar" :src="avatar" height="40" width="40" lazy alt=""/>
          </el-link>
          <!-- 消息总数 -->
          <span @click="toMessage">
            <el-badge :value="1" :max="1" type="danger"/>&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
        <div class="sm-down">
          <br>
          <div class="iconfont icon-login-full" @click="toLogin">&nbsp;参观登录</div>
          <div class="iconfont icon-zhucehaoxiafa" @click="toRegister">参观注册</div>
          <div @click="toAddArticle"><i class="el-icon-edit-outline"/>&nbsp;发布经历</div>
          <div @click="toHome"><i class="el-icon-user-solid"/>&nbsp;参观主页</div>
          <div @click="toPrivate"><i class="el-icon-s-custom"/><i class="el-icon-user-solid"/>&nbsp;藏经阁</div>
          <div @click="toLoop"><i class="el-icon-picture"/>&nbsp;轮播图片</div>
          <div @click="toPatron"><i class="el-icon-edit"/>&nbsp;随机诗语</div>
          <div v-if="userId" @click="toAdmin"><i class="el-icon-s-platform"/> 后台管理</div>
          <div v-if="userId" class="iconfont icon-exit-full" @click="logout"> 退出系统</div>
          <div class="line"></div>
        </div>
      </div>
    </transition>
    <!-- /sm-下拉导航 结束 -->
  </header>
</template>
<script>
export default {
  name: 'Header',
  computed: {
    userId() {
      // 获取状态仓库中的用户名和头像
      return this.$store.state.userInfo && this.$store.state.userInfo.id
    },
    avatar() {
      // 获取状态仓库中的用户名和头像
      return this.$store.state.userInfo && this.$store.state.userInfo.avatar
    }
  },
  data() {
    return {
      keyword: "",
      isOpen: false,
      allUnreadCount: 0
    }
  },
  methods: {
    // 跳转到消息页面
    toMessage() {
      this.isOpen = false
      this.$router.push('/user/notice/' + 1)
    },
    // 跳转到所有投放诗语人页面
    toPatron() {
      this.isOpen = false
      this.$router.push('/patron')
    },
    // 跳转到所有轮播图页面
    toLoop() {
      this.isOpen = false
      this.$router.push('/looper/all')
    },
    // 带关键词跳转到 ElasticSearch 搜索结果页面
    search() {
      if (this.keyword === '') {
        this.$message({
          showClose: true,
          message: '请输入关键词',
          type: 'warning'
        });
        return
      }
      // 这种跳转方式，在搜索当前页面再输入关键字一样可以再搜索，因为是全面刷新式跳转
      window.location = '/search?keyword=' + this.keyword;
    },
    // 发贴入口（如果登录，跳转到发贴页面，未登录跳转到登录页面）
    toAddArticle() {
      window.location = '/article/edit-article';
    },
    // 跳转到个人主页
    toHome() {
      this.isOpen = false
      this.$router.push('/user/' + 1)
    },
    // 跳转到私人空间
    toPrivate() {
      this.isOpen = false
      this.$router.push('/user/private/' + 1)
    },
    // 跳转到后台管理
    toAdmin() {
      this.isOpen = false
      this.$router.push('/admin')
    },
    // 返回上一层
    back() {
      this.$router.go(-1);
    },
    // 跳转到登录页面（为了点击之后，关闭下拉菜单，并且路由跳转）
    toLogin() {
      this.isOpen = false
      window.location.href = '/auth/login';
    },
    // 去注册
    toRegister() {
      this.isOpen = false
      this.$router.push("/auth/register")
    },
    // 退出登录
    logout() {
      this.$confirm('您确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$logout().then(response => {
          if (response.code === 200) {
            this.$cookies.remove('token')
            this.$cookies.remove('userInfo')
            this.$store.dispatch('userLogout')
            // 跳转到 home 首页
            window.location = '/auth/login';
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="less">

header {
  width: 100%;
  height: 60px;
  font-size: 16px;
  color: wheat;
  background: black;
  border-top: 3px solid #e9c121;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 50%);

  .el-input__inner {
    color: white;
    border: solid 1px #515357;
    background-color: #494949;
  }

  // 搜索框按钮样式
  .el-input-group__append button.el-button {
    color: #d2cece;
    background-color: black;
  }

  .el-button {
    line-height: 100%;
    border: solid 1px black;
    border-radius: unset;
  }

  .status {
    display: inline-block;
    margin-top: -10px;
  }

  b {
    color: #8c939d;
  }

  .login-link {
    margin-left: 30px;
  }

  .login-link, .add, .dropdown .item, .register-link {
    font-size: 16px;
    color: wheat;
  }

  .login-link:hover, .register-link:hover {
    color: yellow;
    box-shadow: 0 0 25px 8px red;
  }
}

// md
@media screen and (min-width: 960px) {
  header {

    .sm-nav, .sm-nav-dropdown {
      display: none;
    }

    .logo {
      margin-top: 5px;
      margin-left: 30px;
    }

    .category div {
      margin-top: 17px;

      .item {
        margin-right: 10px;
        font-size: 16px;
        color: wheat;
      }

      .item:hover {
        color: white;
        box-shadow: 0 0 25px 8px #db0303;
      }
    }

    .search {
      margin-top: 10px;
    }

    .login {
      margin-top: 17px;
    }

    .el-icon-d-arrow-left {
      margin-left: 20px;
      margin-right: 20px;
      font-size: 20px;
      color: wheat;
    }

    .back:hover, .add:hover {
      font-weight: bolder !important;
      color: white !important;
    }

    .back {
      margin-left: 50px;
    }

    .add {
      margin-left: 20px;
      font-size: 30px;
      color: #d2bb91 !important;
    }

    .md-msg {
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .avatar-box {
      display: inline-block;
      position: absolute;
    }

    .avatar {
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 20px 6px white;
    }

    .avatar-box:hover .dropdown {
      display: block;
    }

    .dropdown {
      position: relative;
      display: none;
      top: 5px;
      right: 70px;
      width: 150px;
      line-height: 35px;
      padding: 10px;
      text-align: center;
      border: #8c939d solid 1px;
      border-radius: 5px;
      background-color: #222222;
      z-index: 100;

      .item:hover {
        color: white;
        box-shadow: 0 0 18px 6px white;
      }
    }
  }
}

// sm
@media only screen and (max-width: 960px) {

  header {

    .logo {
      margin-top: 5px;
    }

    .category, .search, .login {
      display: none;
    }

    .sm-nav {
      position: absolute;
      right: 18px;
      top: 0;
      z-index: 8888 !important;
    }

    .sm-nav-dropdown {
      position: absolute;
      width: 100%;
      top: 60px;
      left: 0;
      background-color: #181717;
      z-index: 100;

      .sm-down {
        div {
          line-height: 35px;
          text-align: center;
          font-size: 18px;
          color: #958e8e;
        }

        div:hover {
          color: white;
          background: none;
          box-shadow: 0 0 25px 8px #f5f5f5;
        }
      }

      .sm-search {
        display: flex;
        justify-content: center;
      }

      .search-input {
        position: relative;
        width: 70%;
        padding: 30px 0;
      }

      .el-button {
        position: absolute;
        top: 7px;
        right: 17px;
        height: 43px;
      }

      //.item {
      //  line-height: 35px;
      //  text-align: center;
      //  font-size: 18px;
      //  color: #958e8e;
      //}
      //
      //.item:hover {
      //  color: white;
      //  background: none;
      //  box-shadow: 0 0 25px 8px #f5f5f5;
      //}
    }

    // sm-下拉菜单过渡动画效果
    .nav {
      overflow: hidden; // 让文字和动画一起显示
    }

    .nav-enter {
      opacity: 0;
    }

    // 开关图标
    .icon-shousuo, .icon-xingzhuang {
      display: inline-block;
      margin-top: 20px;
    }

    // 搜索图标
    .el-icon-search {
      border-radius: 4px;

    }

    .el-input-group__append button.el-button {
      font-size: 20px;
    }

    // 过滤动画结束状态（进入）
    .nav-enter-to {
      opacity: 1;
    }

    // 定义动画时间、速率
    .nav-enter-active {
      transition: all .5s linear;
    }

    .sm-avatar-box {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      align-items: center;

      // 头像 / 消息通知
      .sm-avatar {
        margin: 0 20px;
        border-radius: 50%;
        box-shadow: 0 0 15px 4px white;
      }

      .sm-avatar:hover {
        box-shadow: 0 0 25px 8px white;
      }
    }

    .line {
      border-bottom: #515357 1px solid;
      margin: 10px auto;
      background-color: #181717;
    }
  }
}


</style>

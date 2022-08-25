<template>
  <div>
    <!-- 顶部头像区域 -->
    <div class="avatar-box">
      <nuxt-link :to="'/user/'+userId"><img src="@/assets/img/user/slogo.png" alt=""></nuxt-link>
      <div>
        <b class="fs25">经历网</b>
      </div>
    </div>
    <!-- 用户各项统计 -->
    <div class="total">
      <div class="b">
        <el-button :class="{current:(routeName === article)}" plain size="medium" @click="toArticle">文章
          {{ aCount.articleCount }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "total",
  props: ["username", "userId", "avatar", "aCount", "authId"],
  data() {
    return {
      routeName: this.$route.name,
      article: 'user-article-id'
    }
  },
  methods: {
    // 跳转到我的文章面
    async toArticle() {
      // window.location = '/user/article/' + this.userId
      await this.$router.push('/user/article/' + this.userId)
    }
  }
}
</script>
<style lang="less" scoped>

// 外层大容器
.user-container {

  a:hover {
    color: #8205c6;
    text-decoration: underline;
  }

  .main {

    // 顶部大头像区
    .avatar-box {

      .fs25 {
        font-size: 25px;
      }

      div {
        margin-left: 30px;
      }

      // VIP投放诗语人头像
      img {
        width: 100px;
        height: 100px;
        padding: 2px;
        border-radius: 50%;
        box-shadow: 0 0 20px 6px white;
        transition: all .4s ease-in-out;
        -webkit-transition: all .4s ease-in-out;
        object-fit: cover;
      }

      img:hover {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
      }

      b {
        color: #d9d7d7;
      }

      p {
        margin-top: 10px;
        font-size: 14px;
        color: #d9d7d7;
      }
    }

    // 各项统计
    .total {
      padding: 20px 0 30px;
      font-size: 14px;
      background-color: #FFFFFF;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

      .el-divider {
        background-color: #acaeb3;
      }

      .a, .b {
        display: flex;
        justify-content: center;
        margin: 10px 0 15px;
        align-items: center;
      }

      .c-div {
        margin: 6px auto 0;
        white-space: nowrap;
      }
    }
  }
}

// 激活样式
.current {
  color: white;
  background-color: black;
}

.el-button:hover {
  color: white;
  background-color: black;
}

.user-container {

  .container-in {

    .main {

      .avatar-box {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px 20px 40px;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        background-color: black;
        box-shadow: 0 0 20px 6px white;
      }

      .total {
        .c {
          display: flex;
          align-items: center;
          overflow: auto;
        }
      }
    }

    .aside {
      float: left;
      width: 23%;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      border-radius: 4px;
    }
  }
}

// sm
@media screen and (max-width: 960px) {
  .user-container {

    .container-in {


      .main {

        .avatar-box {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
          background-color: black;
        }

        .total {
          .c {
            display: flex;
            align-items: center;
            margin: 6px 20px;
            padding-bottom: 30px;
            overflow: auto;
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

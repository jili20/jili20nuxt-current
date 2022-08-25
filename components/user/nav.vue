<template>
  <div class="user-nav">
    <!-- md 左则导航 -->
    <template>
      <el-card class="box-card">
        <p class="to-b"> 主页</p>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs7.jpeg" alt="" lazy>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs6.png" alt="" lazy>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs9.jpeg" alt="" lazy>
        </div>
      </el-card>
      <el-card class="box-card" v-show="routeName !== userRoute">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs10.png" alt="" lazy>
        </div>
      </el-card>
      <el-card class="box-card mbn" v-show="routeName !== userRoute">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs8.jpeg" alt="" lazy>
        </div>
      </el-card>
    </template>
  </div>
</template>
<script>
export default {
  name: "user-nav",
  data() {
    return {
      routeName: this.$route.name,
      userRoute: 'user-id',
    }
  }
}
</script>
<style lang="less">
.user-nav {
  background-color: #242424;

  .box-card {
    margin-bottom: 10px;
    font-size: 16px;
    background: linear-gradient(to right, #e5e4e4, black);
    box-shadow: 0 0 20px 6px white;

    .to-b {
      display: inline-block;
      height: 42px;
      width: 100%;
      line-height: 42px;
      border-radius: 4px;
      text-align: center;
      color: #cccccc;
      background-color: black;
    }

    .to-b:hover {
      color: white;
    }

    img {
      width: 100%;
      height: 250px;
      border-radius: 4px;
    }
  }

  .mbn {
    margin-bottom: 0;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .clearfix {
    font-weight: bold;
  }

  // 导航激活样式
  .current {
    padding: 3px 0;
    font-weight: bold;
    border-radius: 4px;
    color: black;
    background-color: #bdbcbc;
  }
}

</style>

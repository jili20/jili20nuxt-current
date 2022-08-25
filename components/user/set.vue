<template>
  <div class="user-nav">
    <!-- md 左则导航 -->
    <template>
      <el-card class="box-card">
        <p class="to-b">藏经阁</p>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs2.jpeg" alt="" width="100%" height="250px" lazy>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs1.jpeg" alt="" width="100%" height="250px" lazy>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs3.jpeg" alt="" width="100%" height="250px" lazy>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs4.jpeg" alt="" width="100%" height="250px" lazy>
        </div>
      </el-card>
      <el-card class="box-card mbn">
        <div slot="header" class="clearfix">
          <img src="@/assets/img/user/bs5.jpg" alt="" width="100%" height="250px" lazy>
        </div>
      </el-card>
    </template>
  </div>
</template>
<script>
export default {
  name: "user-set"
}
</script>

<style lang="less" scoped>
.user-nav {
  background-color: #242424;

  .box-card {
    margin-bottom: 10px;
    font-size: 16px;
    background: linear-gradient(to right, #e5e4e4, black);

    .to-b {
      display: inline-block;
      width: 100%;
      height: 42px;
      line-height: 42px;
      text-align: center;
      border-radius: 4px;
      color: #cccccc;
      background-color: black;
    }

    .to-b:hover {
      color: white;
    }

    img {
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
}
</style>

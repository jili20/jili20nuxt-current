<template>
  <!-- 右则边栏 轮播图 -->
  <div class="aside" style="background-color: #FFFFFF;">
    <el-carousel>
      <el-carousel-item v-for="item in looperListRight" :key="item.id">
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
</template>
<script>
export default {
  name: "looper",
  props: ["looperListRight"]
}
</script>
<style scoped lang="less">

// 右则边栏公共样式
.aside {
  margin-bottom: 20px;
  border-radius: 4px;
}

.tex-box {
  padding: 20px;
}
/* 修改则边栏标题横线颜色 */
.el-divider {
  background-color: #828282;
}

.el-carousel {
  padding: 0 20px 30px 20px;

  .carousel-img {
    height: 300px;
    width: 100%;
    text-align: center;
    border-radius: 4px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  }
}
/* sm */
@media screen and (max-width: 960px) {
  .aside {
    margin-bottom: 5px;
  }
}
</style>

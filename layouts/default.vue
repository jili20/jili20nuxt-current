<template>
  <div class="content">
    <Header/>
    <!-- 中间主体区域 -->
    <div class="main">
      <nuxt/>
    </div>
    <Footer/>
    <!-- 回到顶部组件 bottom 是图标距离底部高度 -->
    <el-backtop :bottom="80"/>
  </div>
</template>
<script>
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";

export default {
  name: "default",
  components: {
    Header,
    Footer
  }
}
</script>
<style lang="less" scoped>

.content {

  .main {
    width: 100%;
    min-height: 630px;
    background-color: #242424;
    //background-color: #ffffff;
  }

  .el-backtop {
    color: white;
    font-size: 30px;
    border: 1px white solid;
    background-color: black;
  }

}
</style>

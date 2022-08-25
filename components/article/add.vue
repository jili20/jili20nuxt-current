<template>
  <!-- 右则边栏 发贴入口链接 -->
  <div class="aside aside-add">
    <el-card class="box-card sm-hidden">
      <a href="javascript:void(0);" @click="getToAddArticle">
        <el-button class="el-icon-edit-outline"> 发布经历</el-button>
      </a>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
      userId: this.$store.state.userInfo && this.$store.state.userInfo.id || 0
    }
  },
  methods: {
    // 点击发布新贴按钮-已登录跳转到新增文章页面，未登录跳转到登录页面
    getToAddArticle() {
      if (this.userId === 0) {
        window.location.href = (`/auth/login?redirectURL=` + window.location.href)  // 重定向回来
      }
      window.location = '/article/edit-article';
    }
  }
}
</script>
<style scoped lang="less">

// 右则边栏公共样式
.aside {
  margin-bottom: 20px;
  border-radius: 4px;
}

.el-button {
  width: 100%;
  color: #cccccc;
  background-color: black;
}

.el-button:hover {
  color: white;
}
/* sm */
@media screen and (max-width: 960px) {
  .aside {
    margin-bottom: 5px;
  }
}

</style>

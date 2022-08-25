<template>
  <!-- 右则边栏 随机诗语 开始 -->
  <div class="aside" style="background-color: #FFFFFF;">
    <el-divider>随机诗语</el-divider>
    <div class="random-tip">
      <p>{{ content }}</p>
      <p class="author" v-if="author">
        ——{{ author }}</p>
    </div>
  </div>
  <!-- /右则边栏 随机诗语 结束 -->
</template>

<script>
export default {
  name: "aphorism",
  props: ["content", "author"]
}
</script>
<style lang="less" scoped>

/* 修改则边栏标题横线颜色 */
.el-divider {
  background-color: #2b2b2b;
}

.aside {
  float: left;
  margin-bottom: 20px;
  border-radius: 4px;
}

// 随机诗语
.random-tip {
  padding: 0 20px 20px 28px;
  font-size: 16px;

  .author {
    float: right;
    margin-right: 8px;
    margin-bottom: 20px;
  }

  p {
    font-size: 16px;
  }
}
/* sm */
@media screen and (max-width: 960px) {
  .aside {
    margin-bottom: 5px;
  }
}
</style>

<template>
  <!-- 右则边栏 系统公告 -->
  <div class="aside">
    <el-divider>系统公告</el-divider>
    <div>
      <p>{{ ann }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Announcement",
  props: ["ann"]
}
</script>
<style scoped lang="less">

/* 修改则边栏标题横线颜色 */
.el-divider {
  background-color: #2b2b2b;
}

.aside {
  float: left;
  margin-bottom: 20px;
  border-radius: 4px;

  p {
    margin: 20px;
    text-align: center;
  }
}

/* sm */
@media screen and (max-width: 960px) {
  .aside {
    margin-bottom: 5px;
  }
}
</style>

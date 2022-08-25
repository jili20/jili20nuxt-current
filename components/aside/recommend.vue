<template>
  <!-- 右则边栏 文章推荐 开始 -->
  <div class="aside" style="background-color: #FFFFFF;">
    <el-divider>文章推荐</el-divider>
    <div class="aside-content-box">
      <ol>
        <li v-for="item in recommendArticleList" :key="item.id">
          <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
            <a :href="'/article/'+item.id"><p>{{ item.title }}</p></a>
          </el-tooltip>
        </li>
      </ol>
    </div>
  </div>
  <!-- /右则边栏 文章推荐 结束 -->
</template>
<script>
export default {
  name: "recommend",
  props: ["recommendArticleList"]
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

  ol {
    overflow: hidden;
    white-space: nowrap;
    padding: 0 40px 20px;
    line-height: 25px;
    margin-right: 25px;
    text-overflow: ellipsis;
    font-size: 16px;

    li:hover {
      color: #8205c6;
      cursor: pointer;

      a {
        font-size: 16px;
      }
    }
  }
}
/* sm */
@media screen and (max-width: 960px) {
  .aside {
    margin-bottom: 5px;
  }
}
</style>

<template>
  <footer>
    <div class="clear"></div>
    <a href="/">
      <el-divider class="md-divider">经历网 - 为留住您的经历而生！</el-divider>
    </a>
    <!-- sm -->
    <div class="sm">
      <a href="/"><p class="sm-title">经历网</p></a>
      <el-divider class="sm-divider">为留住您的经历而生！</el-divider>
    </div>
    <div class="text">
      <!-- nofollow 告诉搜索引擎"不要追踪此网页上的链接或不要追踪此特定链接 -->
      <a class="num" href="https://beian.miit.gov.cn" target="_blank" rel="nofollow"
         :underline="false">粤ICP备2022055115号</a>
      <div style="width:300px;margin:0 auto; padding:20px 0;">
        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44170202000325"
           style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img
          src="@/assets/img/index/beiantubiao.png" style="float:left;" alt=""/>
          <p style="float:left;height:20px;line-height:20px;margin: 0 0 0 5px; color:#939393;">粤公网安备
            44170202000325号</p></a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: "Header"
}
</script>
<style scoped lang="less">

footer {
  //clear: both;
  width: 100%;
  padding-bottom: 30px;
  background-color: black;

  .clear {
    height: 1px;
    width: 100px;
  }

  .md-divider {
    background-color: black;
  }

  .el-divider__text {
    color: #B1B1B1;
    background: black;
  }

  .el-divider {
    background: #999696;
  }

  span {
    text-align: center;
    color: #B1B1B1;
  }

  .text {
    text-align: center;
    color: #B1B1B1;

    a {
      font-size: 12px;
    }
  }

  .num {
    font-size: 12px;
    color: #B1B1B1;
  }

  .num:hover {
    color: #9932CC;
  }
}

// md
@media screen and (min-width: 960px) {
  footer {
    .sm {
      display: none;
    }
  }
}

// sm
@media screen and (max-width: 960px) {
  footer {
    .md-divider {
      display: none;
    }

    .sm-title {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      color: #B1B1B1;
    }

    .sm {
      .el-divider__text {
        font-size: 14px;
      }
    }
  }
}

</style>

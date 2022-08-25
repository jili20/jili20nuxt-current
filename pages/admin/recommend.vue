<template>
  <div class="app-container">
    <div class="title">
      <div><a href="/admin">随机诗语</a></div>
      <div>
        <el-button type="success" @click="toRecommend">推荐与搜索</el-button>
      </div>
      <div><a href="/admin/loop">轮播图片</a></div>
      <div><a href="/admin/announcement">系统公告</a></div>
      <div><a href="/admin/category">分类管理</a></div>
    </div>
    <!-- 条件查询 -->
    <el-card class="box-card" style="width: 100%;">
      <el-form :inline="true" :model="query" size="mini">
        <el-form-item label="ID">
          <el-input v-model.trim="query.id" clearable placeholder="请输入作者姓名"/>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model.trim="query.username" clearable placeholder="请输入作者姓名"/>
        </el-form-item>
        <el-form-item label="经历主人">
          <el-input v-model.trim="query.masterName" clearable placeholder="请输入作者姓名"/>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model.trim="query.title" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-select v-model="query.recommend" clearable style="width: 120px">
            <el-option label="正常" :value="0"/>
            <el-option label="推荐" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
          <el-button icon="el-icon-plus" type="success" @click="importEsData">导入数据进es</el-button>
          <el-button icon="el-icon-plus" type="danger" @click="deleteEsIndex">删除es索引</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格显示列表数据 -->
    <el-table
      :data="list"
      stripe
      border>
      <el-table-column label="序号" width="70" fixed align="center">
        <template slot-scope="scope">
          {{ (current - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="200" align="center"/>
      <el-table-column prop="username" label="作者" width="170" align="center"/>
      <el-table-column prop="masterName" label="经历主人" width="170" align="center"/>
      <el-table-column prop="title" label="标题" width="500" align="center">
        <template slot-scope="scope">
          <a :href="'/article/'+scope.row.id">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200px" align="center"/>
      <!-- 是否推荐：(0 正常；1 推荐) -->
      <el-table-column prop="recommend" label="是否推荐" width="300" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.recommend == 0">正常</el-tag>
          <el-tag v-if="scope.row.recommend == 1" type="success">推荐</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300px" fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.recommend==1" type="primary" @click="doRecommend(scope.row.id)" size="mini">
            推荐
          </el-button>
          <el-button :disabled="scope.row.recommend==0" type="primary" @click="noRecommend(scope.row.id)" size="mini">
            取消推荐
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row.id)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      :current-page="current"
      :page-sizes="[10, 20,30,50,100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: "Recommend",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  middleware: 'auth',
  // 动态标题
  head() {
    return {
      title: '经历网 - 文章推荐'
    }
  },
  // 服务端获取数据
  async asyncData({app}) {
    // 条件分页查询文章列表
    const current = 1
    const size = 10
    // 条件搜索对象
    const query = {
      id: null,
      username: '',
      masterName: '',
      title: '',
      recommend: null
    }
    const {data} = await app.$getAdminArticleListPage(current, size, query)
    const list = data.records
    const total = Number(data.total)

    return {
      current,
      size,
      query,
      list,
      total
    }
  },
  methods: {
    // 导入数据进es
    importEsData() {
      this.$importEsData().then(response => {
        if (response.code === 200) {
          this.$message.success(response.message)
        } else {
          this.$message.error('导入数据进es失败')
        }
      })
    },
    // 删除 es 索引
    deleteEsIndex(){
      this.$deleteEsIndex().then(response => {
        if (response.code === 200) {
          this.$message.success(response.message)
        } else {
          this.$message.error('删除es索引失败')
        }
      })
    },
    // 跳转到后台管理文章推荐
    toRecommend() {
      this.$router.push('/admin/recommend')
    },
    // 跳转到随机诗语管理页面
    toAphorism() {
      this.$router.push('/admin')
    },
    // 获取条件分页列表数据
    async fetchData() {
      const {data} = await this.$getAdminArticleListPage(this.current, this.size, this.query)
      this.list = data.records
      this.total = Number(data.total)
    },
    // 切换每页显示多少条记录
    handleSizeChange(size) {
      this.size = size
      this.fetchData()
    },
    // 切换当前页码
    handleCurrentChange(current) {
      this.current = current
      this.fetchData()
    },
    // 条件查询
    queryData() {
      this.current = 1
      this.fetchData()
    },
    // 重置表单
    reload() {
      this.query = {}
      this.fetchData()
    },
    // 取消
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 设置文章为推荐
    doRecommend(articleId) {
      this.$confirm('确定要 推荐 此文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$recommendYes(articleId).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$message.success(response.message)
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
      })
    },
    // 取消推荐文章
    noRecommend(articleId) {
      this.$confirm('确定 取消推荐 此文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$recommendNo(articleId).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$message.success(response.message)
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
      })
    },
    // 根据ID删除
    handleDelete(articleId) {
      this.$confirm('确定要 删除 这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$removeArticleById(articleId).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$message.success(response.message)
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style scoped lang="less">
.app-container {
  min-width: 1226px;
  min-height: 900px;

  .title {
    display: flex;
    padding: 20px 0;
    background-color: #242424;

    > div {
      width: 20%;
    }
  }

  div > div > a {
    color: #e5e1e1;
  }
}

</style>

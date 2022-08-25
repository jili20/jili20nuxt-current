<template>
  <div class="app-container">
    <div class="title">
      <div><a href="/admin">随机诗语</a></div>
      <div><a href="/admin/recommend">推荐与搜索</a></div>
      <div>
        <el-button type="success" @click="toBackground">轮播图片</el-button>
      </div>
      <div><a href="/admin/announcement">系统公告</a></div>
      <div><a href="/admin/category">分类管理</a></div>
    </div>
    <!-- 条件查询 -->
    <el-card class="box-card">
      <el-form :inline="true" :model="query" size="mini">
        <el-form-item label="标题">
          <el-input v-model.trim="query.title" clearable placeholder="请输入图片标题"/>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="query.begin"
            clearable
            placeholder="开始时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="query.end"
            clearable
            placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="图片ID">
          <el-input v-model.trim="query.id" clearable placeholder="请输入图片ID"/>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model.trim="query.looperLink" clearable placeholder="请输入链接地址"/>
        </el-form-item>
        <el-form-item label="投放诗语金额">
          <el-select v-model="query.amount" clearable style="width: 120px">
            <el-option label="倒序" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable style="width: 120px">
            <el-option label="待用" :value="0"/>
            <el-option label="启用" :value="1"/>
            <el-option label="停用" :value="2"/>
            <el-option label="留存" :value="3"/>
          </el-select>
        </el-form-item>
        <!-- 位置：(0 首页顶部；1 首页右则；2 帖子正文下) -->
        <el-form-item label="位置">
          <el-select v-model="query.position" clearable style="width: 120px">
            <el-option label="首页顶部" :value="0"/>
            <el-option label="首页右则" :value="1"/>
            <el-option label="帖子正文下" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
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
          <!--  page.current 当前页码；page.size 每页记录数 -->
          {{ (current - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="投放人" align="center" width="120"/>
      <el-table-column align="center" prop="looperUrl" label="图片" width="100">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.looperUrl"
            :preview-src-list="[scope.row.looperUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center" width="200"/>
      <!-- 位置：(0 首页轮播图；1 首页右则；2 帖子正文下) -->
      <el-table-column prop="position" label="位置" align="center" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.position == 0" type="danger" effect="dark">首页顶部</el-tag>
          <el-tag v-if="scope.row.position == 1" type="info" effect="dark">页面右则</el-tag>
          <el-tag v-if="scope.row.position == 2" type="primary" effect="dark">帖子正文下</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="looperLink" label="链接网址" align="center" width="240"/>
      <!-- 状态：（ 0:待审核; 1 审核通过播放中; 2 审核未通过; 3  留存） -->
      <el-table-column align="center" prop="status" label="状态" width="130">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="" effect="dark">待用</el-tag>
          <el-tag v-if="scope.row.status == 1" type="success" effect="dark">启用</el-tag>
          <el-tag v-if="scope.row.status == 2" type="info" effect="dark">停用</el-tag>
          <el-tag v-if="scope.row.status == 3" type="info" effect="dark">留存</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间" width="160px"/>
      <el-table-column align="center" prop="createTime" label="创建时间" width="160px"/>
      <el-table-column prop="amount" label="投放诗语金额" align="center"/>
      <el-table-column prop="userId" label="用户ID" align="center" width="200"/>
      <el-table-column prop="id" label="图片ID" align="center" width="200"/>
      <el-table-column align="center" label="操作" min-width="250px" fixed="right">
        <template slot-scope="scope">
          <!-- 1、打开审核窗口，只有 status == 0 待审核状态，才显示审核按钮-->
          <el-button
            :disabled="scope.row.status == 1"
            size="mini"
            type="primary"
            @click="auditPass(scope.row.id)"
          >启用
          </el-button>
          <el-button
            :disabled="scope.row.status != 1"
            size="mini"
            type="warning"
            @click="auditNoPass(scope.row.id)"
          >停用
          </el-button>
          <!-- 5、根据ID删除文章-->
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      :current-page="current"
      :page-sizes="[3, 20,30,50,100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: "Background",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  middleware: 'auth',
  data() {
    return {
      list: [],
      current: 1,
      size: 10,
      total: 0,
      query: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 跳转到背景图片页面
    toBackground() {
      this.$router.push('/admin/loop')
    },
    // 获取条件分页列表数据
    async fetchData() {
      const {data} = await this.$getLoopListPage(this.current, this.size, this.query)
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
    // 启用轮播图片
    auditPass(id) {
      this.$confirm('确定 启用 此轮播图吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$auditPass(id).then(response => {
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
    // 停用
    auditNoPass(id) {
      this.$confirm('确定 停用 此轮播图吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$auditNoPass(id).then(response => {
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
    handleDelete(id) {
      this.$confirm('确定要 删除 这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$removeUserLooperById(id).then(response => {
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

  .el-image {
    border-radius: 4px;
  }

  .el-pagination {
    margin: 20px 0 50px;
  }
}


</style>

<template>
  <div class="app-container">
    <div class="title">
      <div>
        <el-button type="success" @click="toAphorism">随机诗语</el-button>
      </div>
      <div><a href="/admin/recommend">推荐与搜索</a></div>
      <div><a href="/admin/loop">轮播图片</a></div>
      <div><a href="/admin/announcement">系统公告</a></div>
      <div><a href="/admin/category">分类管理</a></div>
    </div>
    <!-- 条件查询 -->
    <el-card class="box-card" style="width: 100%;">
      <el-form :inline="true" :model="query" size="mini">
        <el-form-item label="作者">
          <el-input v-model.trim="query.author" clearable placeholder="请输入作者姓名"/>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model.trim="query.content" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
          <el-button icon="el-icon-plus" type="success" @click="open">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格显示列表数据 -->
    <el-table
      :data="list"
      stripe
      border
    >
      <el-table-column label="序号" width="70" fixed align="center">
        <template slot-scope="scope">
          <!--  page.current 当前页码；page.size 每页记录数 -->
          {{ (current - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="200" align="center"/>
      <el-table-column prop="content" label="内容" width="1000"/>
      <el-table-column align="center" prop="createTime" label="创建时间" width="200px"/>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)" size="mini">编辑</el-button>
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
    <!-- 新增对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form :model="aphorism" :rules="rules" ref="ruleForm" label-width="100px" style="margin-right: 50px;">
        <h1><i class="el-icon-edit-outline"></i> {{ title }}</h1>
        <el-form-item label="作者">
          <el-input v-model="aphorism.author"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="aphorism.content" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button @click="cancel('ruleForm')">取消</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Aphorism',
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  middleware: 'auth',
  // 动态标题
  head() {
    return {
      title: '经历网 - 随机诗语'
    }
  },
  data() {
    return {
      list: [],
      current: 1,
      size: 10,
      total: 0,
      query: {},
      // 新增、编辑
      title: '',
      dialogVisible: false,
      aphorism: {
        id: null,
        author: '',
        content: ''
      },
      // 校验表单
      rules: {
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'},
          {min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    // 文章数据列表
    this.fetchData()
  },
  methods: {
    // 跳转到随机诗语管理页面
    toAphorism() {
      this.$router.push('/admin')
    },
    // 获取条件分页列表数据
    async fetchData() {
      const {data} = await this.$getAphorismListPage(this.current, this.size, this.query)
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
    // 打开新增窗口
    open() {
      this.title = '新增随机诗语'
      this.dialogVisible = true
      this.aphorism.author = ''
      this.aphorism.content = ''
    },
    // 关闭新增或编辑对话框
    handleClose() {
      this.dialogVisible = false
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 提交表单（新增或编辑）
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.aphorism.id) {
            this.update()
          } else {
            this.add()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add() {
      this.$addAphorism(this.aphorism).then(response => {
        if (response.code === 200) {
          this.fetchData()
          this.dialogVisible = false
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 打开编辑窗口，根据ID查询详情
    async handleEdit(id) {
      await this.$getAphorismById(id).then(response => {
        if (response.code === 200) {
          this.title = '编辑随机诗语'
          this.dialogVisible = true
          this.aphorism.id = id
          this.aphorism.author = response.data.aphorism.author
          this.aphorism.content = response.data.aphorism.content
        }
      })
    },
    // 根据ID编辑
    update() {
      this.$updateAphorism(this.aphorism).then(response => {
        if (response.code === 200) {
          this.$message.success(response.message)
          this.dialogVisible = false
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 根据ID删除
    handleDelete(id) {
      this.$confirm('确定要删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$deleteAphorismById(id).then(response => {
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

/* 对话框头部 */
.app-container .el-dialog__header {
  padding: 0 20px 0;
}

/* 标题 */
.app-container h1 {
  text-align: center;
  margin-bottom: 30px;
}

.el-pagination {
  margin: 20px 0 50px;
}

</style>

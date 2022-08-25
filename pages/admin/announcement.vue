<template>
  <div class="app-container">
    <div class="title">
      <div><a href="/admin">随机诗语</a></div>
      <div><a href="/admin/recommend">推荐与搜索</a></div>
      <div><a href="/admin/loop">轮播图片</a></div>
      <div>
        <el-button type="success" @click="toAnnouncement">系统公告</el-button>
      </div>
      <div><a href="/admin/category">分类管理</a></div>
    </div>
    <!-- 条件查询 -->
    <el-card class="box-card">
      <el-form :inline="true" :model="query" size="mini">
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
        <el-form-item label="ID">
          <el-input v-model.trim="query.id" clearable placeholder="请输入ID"/>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input v-model.trim="query.content" clearable placeholder="请输入公告内容"/>
        </el-form-item>
        <!-- 状态（ 0 启用；1 待用；2 停用 ） -->
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable style="width: 120px">
            <el-option label="启用" :value="0"/>
            <el-option label="待用" :value="1"/>
            <el-option label="停用" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-permission="'announcement:search'" icon="el-icon-search" type="primary" @click="queryData">查询
          </el-button>
          <el-button v-permission="'announcement:search'" icon="el-icon-refresh" @click="reload">重置</el-button>
          <el-button v-permission="'announcement:add'" icon="el-icon-plus" type="success" @click="openAdd">新增
          </el-button>
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
      <el-table-column align="center" prop="content" label="公告内容"/>
      <!-- 状态（ 0 启用；1 待用；2 停用 ） -->
      <el-table-column align="center" prop="status" label="状态" width="130">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="success">展示中</el-tag>
          <el-tag v-if="scope.row.status == 1" type="primary">待用</el-tag>
          <el-tag v-if="scope.row.status == 2" type="info">已过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" align="center" width="200"/>
      <el-table-column align="center" prop="createTime" label="创建时间" width="200px"/>
      <el-table-column align="center" prop="updateTime" label="更新时间" width="200px"/>
      <el-table-column align="center" label="操作" width="300px" fixed="right">
        <template slot-scope="scope">
          <!-- 只有 status == 0 待审核状态，才显示按钮  v-permission="'article:audit'" -->
          <el-button
            :disabled="scope.row.status == 0"
            size="mini"
            type="success"
            @click="enable(scope.row.id)"
          >启用
          </el-button>
          <el-button
            :disabled="scope.row.status == 1"
            size="mini"
            type="info"
            @click="stop(scope.row.id)"
          >停用
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row.id)"
          >编辑
          </el-button>
          <!--  v-permission="'article:delete'" -->
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      :current-page="current"
      :page-sizes="[10, 20,30,50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="announcement" :rules="rules" label-width="100px" style="margin-right: 50px;">
        <h1><i class="el-icon-edit-outline"/> {{ title }}</h1>
        <el-form-item label="内容" prop="content">
          <el-input v-model="announcement.content" type="textarea" :rows="3" maxlength="255"/>
        </el-form-item>
        <el-form-item class="btn">
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
  name: "announcement",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  middleware: 'auth', // 改个人网站注释这里
  // 动态标题
  head() {
    return {
      title: '经历网 - 系统公告'
    }
  },
  data() {
    return {
      list: [],
      current: 1,
      size: 10,
      total: 0,
      query: {},
      // 新增
      title: '',
      dialogVisible: false,
      announcement: {
        content: '',
        id: null
      },
      // 校验表单
      rules: {
        content: [
          {required: true, message: '请输入公告内容', trigger: 'blur'},
          {min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur'}
        ]
      },
      // 启用或停用公告：(0 启用；2 停用；)
      id: null,
      status: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 跳转到文章推荐页面
    toAnnouncement() {
      this.$router.push('/admin/announcement')
    },
    // 获取条件分页列表数据
    async fetchData() {
      const {data} = await this.$getAnnouncementListPage(this.current, this.size, this.query)
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
    // 重置条件查询表单
    reload() {
      this.query = {}
      this.fetchData()
    },
    // 打开新增窗口
    openAdd() {
      this.title = '新增公告'
      this.dialogVisible = true
      this.announcement.content = ''
    },
    // 关闭新增或编辑对话框
    handleClose() {
      this.dialogVisible = false
    },
    // 重置新增或编辑表单
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
          if (this.announcement.id) {
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
    // 根据ID编辑
    update() {
      this.$updateAnnouncement(this.announcement).then(response => {
        if (response.code === 200) {
          this.$message.success('编辑公告成功')
          this.dialogVisible = false
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    add() {
      this.$addAnnouncement(this.announcement).then(response => {
        if (response.code === 200) {
          this.fetchData()
          this.dialogVisible = false
          this.$message.success('新增公告成功')
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 根据ID获取公告详情
    async handleEdit(id) {
      await this.$getAnnouncementById(id).then(response => {
        if (response.code === 200) {
          this.title = '编辑公告'
          this.dialogVisible = true
          this.announcement.id = id
          this.announcement.content = response.data.announcement.content
        }
      })
    },
    // 根据ID删除
    handleDelete(id) {
      this.$confirm('确定要 删除 这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$deleteAnnouncementById(id).then(response => {
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
    // 启用公告-状态：(0 启用；2 停用；)
    enable(id) {
      this.id = id
      this.status = '0'
      this.$updateStatusByAnnouncementId(this.id, this.status).then(response => {
        if (response.code === 200) {
          this.$message.success('启用公告成功')
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 停用公告 - 状态：(0 启用；2 停用；)
    stop(id) {
      this.id = id
      this.status = '2'
      this.$updateStatusByAnnouncementId(this.id, this.status).then(response => {
        if (response.code === 200) {
          this.$message.success('停用公告成功')
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
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

  .el-table {
    min-height: 600px;
  }

  // 新增公告
  h1 {
    margin-bottom: 50px;
    text-align: center;
  }

  .btn {
    text-align: right;
  }
}

</style>

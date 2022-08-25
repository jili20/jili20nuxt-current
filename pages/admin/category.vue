<template>
  <div class="app-container">
    <div class="title">
      <div><a href="/admin">随机诗语</a></div>
      <div><a href="/admin/recommend">推荐与搜索</a></div>
      <div><a href="/admin/loop">轮播图片</a></div>
      <div><a href="/admin/announcement">系统公告</a></div>
      <div><el-button type="success" @click="toCategory">分类管理</el-button></div>
    </div>
    <!-- 分类树形列表数据 -->
    <div class="tree">
      <div style="width: 30%;margin: 0 auto;padding: 20px 0 0;">
        <!-- 开关-->
        <el-switch v-model="draggable" active-color="#13ce66" active-text="开启拖拽" inactive-text="关闭拖拽"/>
        <!-- 保存按钮-->
        <el-button
          v-if="draggable"
          type="success"
          plain
          size="mini"
          @click="batchSave"
          style="margin-left: 20px;">批量保存
        </el-button>
        <el-button
          type="danger"
          size="mini"
          @click="batchDelete"
          style="margin-left: 20px;">批量删除
        </el-button>
      </div>
      <!-- 树形分类列表 -->
      <el-tree
        ref="menuTree"
        :data="list"
        :props="defaultProps"
        :expand-on-click-node="false"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expandedKey"
        :allow-drop="allowDrop"
        :draggable="draggable"
        @node-drop="handleDrop"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="margin-left: 30px;">
          <el-button
            v-if="node.level <= 1"
            type="text"
            size="mini"
            @click="() => append(data)">
            添加
          </el-button>
          <!-- 修改按钮 edit ; data 当前节点的数据 -->
          <el-button type="text" size="mini" @click="edit(data)">修改</el-button>
         <el-button
           v-if="node.childNodes.length == 0"
           type="text"
           size="mini"
           @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>
    </div>
    <!-- 添加分类-表单-对话框 el-dialog -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="dialogClosed"
    >
      <el-form ref="ruleForm" :rules="rules" :model="category">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model.trim="category.categoryName"
            autocomplete="off"
            :min="2"
            maxlength="10"
            clearable
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Category",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  middleware: 'auth', // 改个人网站注释这里
  data() {
    return {
      list: [],
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      // 添加分类
      title: '', // 添加的修改共用对话框，用于动态改变标题
      dialogType: '', // 对话框类型：修改 edit，添加 add
      dialogVisible: false, // 添加分类对话框，默认关闭
      category: {
        id: null,
        categoryName: '',
        parentId: 0,
        level: 0,
        sort: 0
      },
      rules: { // 校验表单
        categoryName: [
          {required: true, message: '分类名不能为空', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ]
      },
      // 最大层级，拖拽节点用
      maxLevel: 0,
      expandedKey: [], // 绑定分类数据
      updateNodes: [], // 所有拖拽要修改的节点
      draggable: false, // 默认不可以拖拽
      pid: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 跳转到分类管理页面
    toCategory() {
      this.$router.push('/admin/category')
    },
    async fetchData() {
      const {data} = await this.$getCategoryList()
      this.list = data.categoryList
    },
    // 删除单个分类
    remove(node, data) {
      const categoryIds = [data.id]
      this.$confirm(`是否要 删除 分类 [ ${data.categoryName} ] ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteCategory(categoryIds).then(response => {
          if (response.code === 200) {
            this.fetchData();
            this.$message.success(response.message)
            // 设置需要默认展开的菜单
            this.expandedKey = [node.parent.data.id]
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
      })
    },
    // 清空表单校验结果，调用框架方法
    dialogClosed() {
      this.$refs['ruleForm'].resetFields()
    },
    // 添加分类对话框
    append(data) {
      this.dialogType = 'add'
      this.title = '添加二级分类'
      this.dialogVisible = true
      this.category.parentId = data.id
      this.category.level = data.level * 1 + 1 // 转换成数字再+1
      this.category.id = null
      this.category.categoryName = ''
      this.category.sort = 0
    },
    // 添加分类-提交表单-formName 接收传来的 ref 数据
    submitForm(ruleForm) { // 绑定 ref
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            this.addCategory() // 调用新增分类方法
          }
          if (this.dialogType === 'edit') {
            this.editCategory()
          }
        }
      })
    },
    // 添加二级分类
    addCategory(node, data) {
      this.$addCategory(this.category).then(response => {
        if (response.code === 200) {
          this.fetchData()
          // 业务成功
          this.$message.success(response.message)
          this.dialogVisible = false
          // 设置需要默认展开的菜单(展开添加的分类的父分类)
          this.expandedKey = [this.category.parentId]
        } else {
          // 业务失败
          this.$message.error(response.message)
        }
      })
    },
    // 点击修改按钮，根据分类ID，查询分类名回显（data 是要修改的数据）
    edit(data) {
      this.dialogType = 'edit'
      this.title = '修改分类'
      this.dialogVisible = true
      this.$getCategoryById(data.id).then(response => {
        this.category.id = response.data.category.id
        this.category.categoryName = response.data.category.categoryName
        this.category.parentId = response.data.category.parentId
        this.category.level = response.data.category.level
        this.category.sort = response.data.category.sort
        if (response.code !== 200) {
          this.$message.error(response.message)
        }
      })
    },
    // 修改二级分类
    editCategory() {
      this.$updateCategoryById(this.category).then(response => {
        if (response.code === 200) {
          this.fetchData()
          // 业务成功
          this.$message.success(response.message)
          this.dialogVisible = false
          // 设置需要默认展开的菜单
          this.expandedKey = [this.category.parentId] // 展开添加的分类的父分类
        } else {
          // 业务失败
          this.$message.error(response.message)
        }
      })
    },
    // 拖拽节点，改变分类层级父子关系
    allowDrop(draggingNode, dropNode, type) {
      this.countNodeLevel(draggingNode)
      // 当前正在拖动的节点+父节点所在的深度不大于3即可（深度）
      const deep = Math.abs(this.maxLevel - draggingNode.level) + 1
      if (type === 'inner') {
        return deep + dropNode.level <= 3
      } else {
        return deep + dropNode.parent.level <= 3
      }
    },
    // 计算拖拽的总层数
    countNodeLevel(node) { // node 当前拖拽的节点
      // 找到所有子节点，求出最大深度
      if (node.childNodes != null && node.childNodes.length > 0) { // 证明有子节点
        // 遍历所有子节点
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].level > this.maxLevel) {
            // 如果当前节点的层级大于最大层级,将当前节点层级置为最大层级
            this.maxLevel = node.childNodes[i].level
          }
          // 递归:继续找出当前节点的子节点最大深度(层级)
          this.countNodeLevel(node.childNodes[i])
        }
      }
    },
    // 框架拖拽节点成功事件
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', draggingNode, dropNode, dropType)
      // 1. 当前节点最新父节点id
      let pid = 0 // 新父节点
      let siblings = null // 新兄弟
      // 前后拖动
      if (dropType === 'before' || dropType === 'after') {
        // 节点拖拽到前面或后面,父节点为当前节点的父节点; undefined 为拖拽为 顶级;
        pid = dropNode.parent.data.id === undefined ? 0 : dropNode.parent.data.id
        siblings = dropNode.parent.childNodes // 兄弟节点
      } else {
        pid = dropNode.data.id // 当前节点拖拽进a里面,父id是a的 categoryId
        siblings = dropNode.childNodes
      }
      this.pid.push(pid)
      // 2. 当前拖拽节点的最新顺序
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].data.id === draggingNode.data.id) { // 当前拖拽的节点
          // 如果遍历的是当前正在拖拽的节点
          let level = draggingNode.level
          if (siblings[i].level !== draggingNode.level) {
            // 当前节点的层级发生变化
            level = siblings[i].level
            // 修改他子节点的层级(调用下面递归方法)
            this.updateChildNodeLevel(siblings[i])
          }
          this.updateNodes.push({id: siblings[i].data.id, sort: i, parentId: pid, level: level})
        } else {
          this.updateNodes.push({id: siblings[i].data.id, sort: i})
        }
      }
      // 3. 当前拖拽节点的最新层级
      // console.log('updateNode', this.updateNodes)
    },
    // 递归改变子节点层级(改变传入的 node 节点的子节点层级)
    updateChildNodeLevel(node) {
      if (node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const cNode = node.childNodes[i].data
          this.updateNodes.push({categoryId: cNode.id, level: node.childNodes[i].level})
          this.updateChildNodeLevel(node.childNodes[i]) // 递归改变子节点层级
        }
      }
    },
    // 保存所有拖拽节点顺序
    batchSave() {
      this.$updateCategorySort(this.updateNodes).then(response => {
        if (response.code === 200) {
          this.fetchData();
          this.$message.success(response.message)
          this.expandedKey = this.pid
          this.updateNodes = []
          this.maxLevel = 0
        }
      })
    },
    // 批量删除分类
    batchDelete() {
      const categoryIds = []
      // 通过 ref 框架方法 getCheckedNodes() 获取选中的节点
      const checkedNodes = this.$refs.menuTree.getCheckedNodes()
      // console.log('被选中的元素', checkedNodes)
      for (let i = 0; i < checkedNodes.length; i++) {
        categoryIds.push(checkedNodes[i].id)
      }
      this.$confirm(`确定要删除选中的分类吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$removeByIds(categoryIds).then(response => {
          if (response.code === 200) {
            this.fetchData(); // 重新获取数据列表
            this.$message.success('批量删除分类成功')
            // 设置需要默认展开的菜单
            this.expandedKey = this.pid
          }
        })
      }).catch(() => {
        // 取消删除，不用理会
      })
    }
  }
}
</script>
<style scoped lang="less">
.app-container {
  min-width: 800px;
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

  .tree {
    width: 100%;
    min-height: 600px;
    background-color: #FFFFFF;

    .el-tree {
      width: 30%;
      padding: 30px;
      margin: 0 auto;
      border-radius: 4px;
    }
  }
}

</style>

<template>
  <!-- 最外层容器 -->
  <div class="article-edit-container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 左边内容容器 开始 -->
      <div class="main">
        <el-form ref="formRef" :rules="rules" :model="formData" label-position="top" status-icon label-width="80px">
          <h1><b><i class="el-icon-edit-outline"/> {{ articleId ? '编辑经历' : '发布经历' }} </b></h1>
          <p><b>🔳 温馨提示：</b>经历网为只读网站，可搜索，全球可访问。</p>
          <p>投放个人经历，请点击
            <nuxt-link to="/article/1525011574368567298" style="color: #8205c6;font-weight: bold;"> 《如何书写和免费投放个人经历》
            </nuxt-link>
          </p>
          <br>
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" maxlength="30" clearable placeholder="请输入标题" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="categoryPid">
            <!-- 一级分类 -->
            <!-- 注意 categoryChanged 不能写成 categoryChanged(),带 () 系统不会把选择的选项赋值给 categoryChanged -->
            <el-select
              v-model="formData.categoryPid"
              placeholder="请选择一级分类"
              @change="categoryChanged">
              <el-option
                v-for="category in categoryList"
                :key="category.id"
                :value="category.id"
                :label="category.categoryName"/>
            </el-select>
            <!-- 二级分类 -->
            <el-select
              v-model="formData.categoryId"
              placeholder="请选择二级分类">
              <el-option
                v-for="category in categoryTwoList"
                :key="category.id"
                :value="category.id"
                :label="category.categoryName"/>
            </el-select>
          </el-form-item>
          <!-- 上传经历头像 -->
          <el-form-item v-show="authId!==0" label="经历主人头像" prop="masterUrl">
            <!-- 发布非本人经历，需上传经历主人头像。只能上传 jpg 格式的图片。-->
            <el-upload
              class="avatar-uploader"
              action=""
              accept="image/*"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadImg">
              <img v-if="formData.masterUrl" :src="formData.masterUrl" class="avatar" alt="" lazy>
              <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
          <el-form-item v-show="authId==0" label="经历主人头像" prop="masterUrl">
            <!-- 发布非本人经历，需上传经历主人头像。只能上传 jpg 格式的图片。-->
            <el-upload
              disabled
              class="avatar-uploader"
              action=""
              accept="image/*"
              :show-file-list="false">
              <!-- 如果有图片，显示图片 -->
              <img v-if="formData.masterUrl" :src="formData.masterUrl" class="avatar" alt="" lazy>
              <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
          <el-form-item label="经历主人头像" prop="masterUrl">
            <el-input v-model="formData.masterUrl" maxlength="255" clearable show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="经历主人姓名" prop="masterName">
            <el-input v-model="formData.masterName" maxlength="20" clearable show-word-limit></el-input>
          </el-form-item>
          <!-- 富文本编辑器 -->
          <el-form-item label="正文内容" prop="content">
            <client-only>
              <el-tiptap
                v-model="formData.content"
                :extensions="extensions"
                height="800px"
                placeholder="请您确保输入的内容，文明、没有版权纠纷！"
              ></el-tiptap>
            </client-only>
          </el-form-item>
          <el-form-item class="btn-item" align="center">
            <el-button v-show="authId !== 0" type="primary" @click="submitForm('formRef')">立即发布</el-button>
            <el-button v-show="authId == 0" type="primary">立即发布</el-button>
            <el-button @click="resetForm('formRef')">重置</el-button>
            <el-button v-show="authId !== 0" @click="cancel">取消</el-button>
            <el-button v-show="authId == 0">取消</el-button>
            <el-button v-show="authId!==0 && formData.publish == false" @click="saveDraft('formRef')">保存草稿</el-button>
            <el-button v-show="authId==0">保存草稿</el-button>
          </el-form-item>
        </el-form>
        <!-- 删除阿里云 OSS 中的图片 -->
        <el-form v-show="userId" :model="oss">
          <el-form-item>
            <div style="display: flex;">
              <el-input v-model="oss.fileUrl" maxlength="255" show-word-limit clearable
                        placeholder="请输入要删除的图像链接地址"></el-input>
              <el-button type="primary" @click="deletePicture">删除图片</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!-- /删除阿里云 OSS 中的图片 -->
      </div>
      <!-- /左边内容容器 -->
      <!-- 右则边栏 开始 -->
      <template>
        <!-- 子组件-发布新贴入口 -->
        <div class="sm-hidden">
          <AddArticle/>
        </div>
        <!-- 右则边栏 随机诗语 开始 -->
        <Aphorism :content="randomTip.content" :author="randomTip.author"/>
        <div v-show="recommendArticleList">
          <Recommend v-bind:recommendArticleList="recommendArticleList"/>
        </div>
        <div class="md-hidden line-1"></div>
        <!-- 子组件-轮播图 -->
        <Looper v-bind:looperListRight="looperListRight"/>
        <!-- 子组件 - 投放诗语 -->
        <Patron v-bind:oneTop="oneTop" :isOpenPatron="isOpenPatron"
                :addPatronData="addPatronData" @addPatron="addPatron" @openPatron="openPatron"
                @handleClosePatron="handleClosePatron"/>
      </template>
      <!-- /右则边栏 结束 -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
import AddArticle from '@/components/article/add'  // 子组件-发布新贴入口
import Aphorism from '@/components/aside/aphorism'  // 子组件-随机诗语
import Recommend from '@/components/aside/recommend'  // 子组件-文章推荐
import Looper from '@/components/aside/looper'  // 子组件-右则小轮播图
import Patron from '@/components/aside/patron' // 子组件-投放诗语-成为VIP投放诗语人
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Italic,
  FontSize,
  TextAlign,
  TextHighlight,
  Strike,
  Underline,
  FontType,
  ListItem,
  Link,
  Image,
  CodeBlock,
  Blockquote,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Indent,
  LineHeight,
  HorizontalRule,
  HardBreak,
  TrailingNode,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  FormatClear,
  TextColor,
  Preview,
  Fullscreen
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'

export default {
  name: 'article-edit',
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  // middleware: 'auth', // 改为个人网站，公开此功能
  components: {
    'el-tiptap': ElementTiptap,
    AddArticle,
    Aphorism,
    Recommend,
    Looper,
    Patron
  },
  // 校验（ context 里有 query 对象 ）
  validate({query}) {
    // 如果有传递id,则是修改
    if (query.id) {
      return /^\d+$/.test(query.id)
    }
    return true
  },
  // 动态标题
  head() {
    return {
      // title: '发布/编辑文章 - 经历网'
      title: this.articleId ? '编辑经历' : '发布经历'
    }
  },
  // 服务端获取数据
  async asyncData({app, store}) {
    // 获取当前登录用户ID（用于判断是否能看到删除按钮）
    const authId = store.state.userInfo && store.state.userInfo.id || 0
    const {data: aphorism} = await app.$getRandomTip()
    const randomTip = aphorism.randomTip
    // 文章推荐列表
    const {data: recommend} = await app.$getArticleRecommendList()
    const recommendArticleList = recommend.recommendList
    // 轮播图 - 右边栏
    const {data: looperRight} = await app.$getPatronRightLooperList()
    const looperListRight = looperRight.looperListRight
    // 投放诗语-右则栏列表
    const {data: one} = await app.$getOneTop()
    const oneTop = one.oneTop

    return {
      authId,
      randomTip,
      recommendArticleList,
      looperListRight,
      oneTop
    }
  },
  data() {
    return {
      // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
      userId: this.$store.state.userInfo && this.$store.state.userInfo.id,
      // 获取路由ID，回显文章详情
      articleId: this.$route.query.id,
      categoryList: [],
      categoryTwoList: [],
      formData: {
        title: "",
        categoryId: '',
        categoryPid: '',
        content: "",
        masterName: "",
        masterUrl: "",
        publish: ''
      },
      fileUrl: '',
      // 临时存放已上传成功返回的图片url，为了重复上传的时候删除之前上传无用的图片
      oldImageUrl: String,
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({level: 5}),
        new Bold({bubble: true}),
        new Underline({
          bubble: true,
          menubar: false
        }),
        new Italic(),
        new FontSize(),
        new Image({
          uploadRequest: (file) => { // 注意这里使用的是 箭头函数,因为获取不到 this
            const data = new FormData()
            data.append('file', file)
            return this.$uploadImg("article", data).then(response => {
              if (response.code !== 200) {
                this.$message.error(response.message)
                return
              }
              this.fileUrl = response.data.fileUrl
              return response.data.fileUrl
            })
          }
        }),
        new Link(),
        new Table(),
        new TextAlign(),
        new TodoItem(),
        new Indent(),
        new LineHeight(),
        new TodoList(),
        new HardBreak(),
        new TrailingNode(),
        new FontType(),
        new TextColor(),
        new TextHighlight(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new HorizontalRule(),
        new History(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new CodeBlock(),
        new Blockquote(),
        new Preview(),
        new FormatClear(),
        new Fullscreen()
      ],
      // 校验表单
      rules: {
        title: [
          {required: true, message: '请输文章标题', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在2至30个字符', trigger: 'blur'}
        ],
        categoryPid: [
          {required: true, message: '请选择分类', trigger: 'change'}
        ],
        content: [
          {required: true, message: '请输文章内容', trigger: 'blur'},
          {min: 10, max: 100000, message: '内容长度在10到10万个字符', trigger: 'blur'}
        ]
      },
      // 投放诗语-窗口
      isOpenPatron: false,
      addPatronData: {
        avatar: '',
        amount: 1,
        message: "",
        username: ""
      },
      pictureData: {
        url: ''
      },
      // 删除 OSS 中的图片
      oss: {
        fileUrl: ''
      }
    }
  },
  created() {
    this.initCategoryList()
    this.getArticleById()
  },
  methods: {
    // 根据网址删除OSS中的图片
    deletePicture() {
      // 发送请求
      if (this.oss.fileUrl === '') {
        this.$message.error('请输入图片链接地址')
        return
      }
      this.$deleteImg(this.oss.fileUrl).then(response => {
        if (response.code === 200) {
          this.oss.fileUrl = ''
          this.$message.success("删除图片成功")
        } else {
          this.$message.error("删除图片失败")
        }
      });
    },
    // 根据ID查询文章详情  getArticleById
    getArticleById() {
      // 有路由ID才获取文章详情, 并且分类数据也要同时获取,
      if (this.articleId) {
        this.$getEditArticleById(this.articleId).then(response => {
          this.formData = response.data.articleInfo
          // 渲染类别(新增文章时切换一级分类才查询二级分类,回显要获取数据的同时获取所有分类数据
          this.$getCategoryList().then(response => {
            this.categoryList = response.data.categoryList
            this.categoryList.forEach(category => {
              // 判断当前选中的一级类别是否和当前遍历的一级类别的 id 一致
              // 编辑 这里要先获取到值,才能渲染一二级分类数据和名,否则二级分类只显示 ID 数值
              if (category.id === this.formData.categoryPid) {
                // 切换后清空当前值
                // 如果一致,则将当前遍历的一级类别的子类别绑定在页面的二级类别列表中
                this.categoryTwoList = category.children
              }
            })
          })
        })
      }
    },
    // 上传图片之前的钩子（限制上传图片大小）
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return
      }
      return isLt2M;
    },
    // 上传经历主人头像
    uploadImg(file) {
      if (this.authId === 0) {
        this.$message.info("功能展示")
        return;
      }
      const data = new FormData() // 封装表单对象
      data.append('file', file.file)
      this.$uploadImg("master", data).then(response => {
        // 图片目录为 master ，这里将参数直接写死，不多定义一个变量了
        if (response.code === 200) {
          // 以防图片多次上传,上传成功后,把原来的图片删除
          this.removeImg()
          this.formData.masterUrl = response.data.fileUrl
          this.oldImageUrl = response.data.fileUrl
          this.$message.success("上传图片成功")
        } else {
          this.$message.error(response.message);
        }
      }).catch(() => {
        this.$message.error('上传失败')
      })
    },
    // 删除之前上传无用的图片
    removeImg() {
      if (this.formData.masterUrl) {
        this.$deleteImg(this.formData.masterUrl)
      }
    },
    // 获取分类列表所有数据
    initCategoryList() {
      this.$getCategoryList().then(response => {
        this.categoryList = response.data.categoryList
      })
    },
    // 切换一级类别下拉列表(value 选择器的回调参数，自定义名)
    categoryChanged(value) {
      // 遍历一级类别列表
      this.categoryList.forEach(category => {
        // 判断当前选中的一级类别是否和当前遍历的一级类别的 id 一致
        if (category.id === value) {
          // 切换后清空当前值
          this.formData.categoryId = ''
          // 如果一致，则将当前遍历的一级类别的子类别绑定在页面的二级类别列表中
          this.categoryTwoList = category.children
        }
      })
    },
    // 重置表单（移除该表单项校验结果）
    resetForm(formName) {
      // 清空表单的时候，删除之前上传的图片
      if (this.formData.publish === false) {
        if (this.oldImageUrl !== null && this.formData.masterUrl !== '') {
          this.$deleteImg(this.oldImageUrl); // 取消时，删除上传的图片
        }
      }
      this.$refs[formName].resetFields();
    },
    // 取消
    cancel() {
      if (this.formData.publish === false) {
        if (this.oldImageUrl !== null && this.formData.masterUrl !== '') {
          this.$deleteImg(this.oldImageUrl); // 取消时，删除上传的图片
        }
      }
      if (this.articleId) {
        window.location = '/article/' + this.articleId;
      } else {
        window.location = '/';
      }
    },
    // 保存草稿   updateArticle
    async saveDraft() {
      if (this.authId == 0) {
        this.$message.info("功能展示")
        return;
      }
      // 设置为草稿
      this.formData.publish = "0"
      let response = null
      // 有文章id则修改，没有id则是新增
      if (this.formData.id) {
        // 修改
        this.formData.content = this.formData.content.replaceAll('<p></p>', '<br>')
        response = await this.$updateArticle(this.formData)
      } else {
        // 新增
        this.formData.content = this.formData.content.replaceAll('<p></p>', '<br>')
        response = await this.$addArticle(this.formData)
      }
      if (response.code === 200) {
        // 跳转到私人空间草稿页面
        window.location = '/user/private/draft/?id=' + this.userId;
        this.$message.success('保存草稿成功')
      } else {
        this.$message.error(response.message)
      }
    },
    // 编辑期间保存草稿（ 因上传图片大于 2MB 会自动跳转到 404 页面）
    async saveDraft2() {
      if (this.authId === 0) {
        this.$message.info("功能展示")
        return;
      }
      // 设置为草稿
      this.formData.publish = "0"
      let response = null
      // 有文章id则修改，没有id则是新增
      if (this.formData.id) {
        // 修改
        this.formData.content = this.formData.content.replaceAll('<p></p>', '<br>')
        response = await this.$updateArticle(this.formData)
      } else {
        // 新增
        this.formData.content = this.formData.content.replaceAll('<p></p>', '<br>')
        response = await this.$addArticle(this.formData)
      }
      if (response.code === 200) {
        // 跳转到私人空间草稿页面
        this.$message.success('保存草稿成功')
      } else {
        this.$message.error(response.message)
      }
    },
    // 新增或编辑（提交表单）
    async submitForm(formRef) {
      if (this.authId === 0) {
        this.$message.info("功能展示")
        return;
      }
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    // 新增文章/编辑（调用接口）
    async submitData() {
      if (this.authId === 0) {
        this.$message.info("功能展示")
        return;
      }
      // 设置为发布
      this.formData.publish = "1"
      // p 标签替换空格
      this.formData.content = this.formData.content.replaceAll('<p></p>', '<br>');
      let response = null
      // 有文章id则修改
      if (this.articleId) {
        response = await this.$updateArticle(this.formData)
      } else {
        // 没有文章id则新增
        response = await this.$addArticle(this.formData)
      }
      // 新增和编辑都跳转到文章详情页面（状态：发布）
      if (response.code === 200) {
        window.location = '/article/' + response.data.articleId;
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
    },
    // 投放诗语-打开-窗口
    openPatron() {
      this.addPatronData.avatar = ''
      this.addPatronData.username = ''
      this.addPatronData.message = ''
      this.isOpenPatron = !this.isOpenPatron
    },
    // 投放诗语-关闭-窗口
    handleClosePatron() {
      this.addPatronData.avatar = ''
      this.addPatronData.username = ''
      this.addPatronData.message = ''
      this.isOpenPatron = !this.isOpenPatron
    },
    // 获取投放诗语人列表
    async getPatron() {
      const {data} = await this.$getOneTop()
      this.oneTop = data.oneTop
    },
    // 投放诗语-新增
    async addPatron() {
      await this.$addPatron(this.addPatronData).then(response => {
        if (response.code === 200) {
          // 后端接口会删除缓存
          this.getPatron()
          this.isOpenPatron = !this.isOpenPatron
          this.$message.success('投放诗语成功')
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>
<style lang="less">

// 清除浮动分割线
.line-1 {
  height: 1px;
  width: 100%;
  clear: both;
}

.el-icon-info {
  margin-left: 10px;
  margin-bottom: 10px;
  line-height: 22px;
  color: #606266;
}

// 最外层容器
.article-edit-container {
  min-height: 630px;
  background-color: #242424;

  // 中间整个容器
  .container-in {

    // 页面左则容器、右则容器
    .main, .aside {
      background-color: #FFFFFF;
    }

    // 左则容器
    .main {

      .el-form {
        border-radius: 4px;

        p {
          margin-bottom: 5px;
          font-size: 14px;
        }

        // 上传图片样式
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          background-color: #FFFFFF;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 200px;
          height: 200px;
          line-height: 200px;
          text-align: center;
        }

        .avatar {
          width: 200px;
          height: 200px;
          display: block;
        }

        h1 {
          margin-bottom: 50px;
        }

        // 编辑器样式
        img {
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

// md
@media screen and (min-width: 960px) {
  // 最外层容器
  .article-edit-container {

    .container-in {
      width: 80%;
      margin: 0 auto;

      .main {
        width: 75%;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        border-radius: 4px;
        float: left;

        .el-form {
          padding: 50px 100px;
          margin: 50px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

          .btn-item {
            margin: 50px 0;
          }
        }
      }

      .aside {
        width: 23%;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        border-radius: 4px;
        float: left;
        margin-left: 26px;
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {
  // 最外层容器
  .article-edit-container {

    .container-in {
      width: 100%;
      clear: both;

      .main {
        width: 100%;
        margin: 0 auto;

        .el-form {
          padding: 10px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

          // 选择分类
          .el-select {
            width: 170px;
          }

          .btn-item {
            margin: 30px 0 100px;

            .el-button {
              margin-top: 30px;
            }
          }
        }
      }

      .aside {
        width: 100%;
        margin: 5px auto 0;
      }
    }
  }

}
</style>

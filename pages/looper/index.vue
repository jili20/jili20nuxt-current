<template>
  <!-- 所有投放诗语人列表 -->
  <div class="container">
    <!-- 顶部清除浮动线 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 左边大容器 -->
      <div class="main">
        <h1>※ 投放轮播图片 ※ </h1>
        <!-- 新增轮播图片 -->
        <div class="add-box">
          <el-form
            ref="formRef"
            :rules="rules"
            :model="formData"
            label-width="100px"
            label-position="top"
            status-icon>
            <template>
              <p><b>🔳 温馨提示：</b> 经历网为只读网站，可搜索，全球可访问。</p>
              <p>投放轮播图片，内容仅限于个人作品、个人照片（写真、生日、表白、求婚、订婚、婚礼、活动、特别纪念日、庆祝等）；
                内容文明、合法、不侵犯任何第三方合法权益、没有版权纠纷；大小为 2M 以内，高度为 300px，宽度为自适应。</p><br>
              <b>投放轮播图片的方式：</b>
              <ul>
                <li>1、将资料发送至电子邮箱 908866805@qq.com，标题为《投放轮播图片》；</li>
                <li>2、添加QQ或微信：908866805 提交；</li>
                <li>3、添加QQ群：572844626 提交；</li>
              </ul>
              <br>
              <p>各个位置的轮播器，自动播放前5张最新图片。您可以点击查看 <a href="/looper/all" title="所有投放的轮播图片"><b>所有投放的轮播图片</b></a></p>
            </template>
            <el-divider/>
            <el-form-item label="图片标题" prop="title">
              <el-input v-model="formData.title" maxlength="30" clearable show-word-limit/>
            </el-form-item>
            <el-form-item label="图片播放位置" prop="position">
              <el-radio-group v-model="formData.position" size="small">
                <el-radio-button :label="0">首页顶部</el-radio-button>
                <el-radio-button :label="1">页面右则</el-radio-button>
                <el-radio-button :label="2">文章正文下</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="userId !== 0" label="上传图片" prop="looperUrl">
              <!-- 上传图片  :headers="headers" -->
              <!-- 当点击上传图片的时候，会触发这个方法 :http-request="uploadMainImg" 自定义上传图片方法 -->
              <el-upload
                class="loop-uploader"
                action=""
                accept="image/*"
                :show-file-list="false"
                :http-request="uploadImg"
                :before-upload="beforeUpload">
                <!-- 如果有图片，显示图片 -->
                <img v-if="formData.looperUrl" :src="formData.looperUrl" class="el-avatar" alt="" lazy>
                <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
                <i v-else class="el-icon-plus uploader-icon"/>
              </el-upload>
            </el-form-item>
            <el-form-item v-if="userId == 0" label="上传图片" prop="looperUrl">
              <!-- 上传图片  :headers="headers" -->
              <!-- 当点击上传图片的时候，会触发这个方法 :http-request="uploadMainImg" 自定义上传图片方法 -->
              <el-upload
                disabled
                class="loop-uploader"
                action=""
                accept="image/*"
                :show-file-list="false">
                <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
                <i class="el-icon-plus uploader-icon"/>
              </el-upload>
            </el-form-item>
            <el-form-item label="图片地址" prop="looperUrl">
              <el-input v-model="formData.looperUrl" :min="10" maxlength="255" clearable show-word-limit/>
            </el-form-item>
            <el-form-item label="个人经历链接网址" prop="looperLink">
              <el-input v-model="formData.looperLink" :min="10" maxlength="255" clearable show-word-limit/>
            </el-form-item>
            <div class="centre">
              <el-button @click="resetForm('formRef')">重置</el-button>
              <el-button v-if="userId == 0" @click="goIndex('formRef')">取消</el-button>
              <el-button v-if="userId !== 0" @click="cancel('formRef')">取消</el-button>
              <el-button v-if="userId !== 0" type="primary" @click="submitForm('formRef')">确定</el-button>
              <el-button v-if="userId == 0" type="primary">确定</el-button>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 右则边栏 开始 -->
      <template>
        <!-- 子组件-发布新贴入口 -->
        <Add/>
        <!-- 右则边栏 随机诗语 -->
        <Aphorism :content="randomTip.content" :author="randomTip.author"/>
        <!-- 右则边栏 文章推荐 -->
        <Recommend v-bind:recommendArticleList="recommendArticleList"/>
        <!-- 子组件-轮播图 -->
        <Looper v-bind:looperListRight="looperListRight"/>
        <!-- 子组件 - 投放诗语 -->
        <Patron v-bind:oneTop="oneTop" :isOpenPatron="isOpenPatron"
                :addPatronData="addPatronData" @addPatron="addPatron" @openPatron="openPatron"
                @handleClosePatron="handleClosePatron"/>
        <!-- 轮播图Top15 -->
        <div class="aside">
          <el-divider>轮播图</el-divider>
          <ul>
            <li v-for="item in loopTop15">
              <el-image
                class="img"
                :src="item.looperUrl"
                :preview-src-list="[item.looperUrl]" lazy>
              </el-image>
              <nuxt-link :to="item.looperLink" v-if="item.looperLink">{{ item.title }}</nuxt-link>
              <nuxt-link :to="'/user/'+item.userId" v-else>{{ item.title }}</nuxt-link>
            </li>
          </ul>
        </div>
      </template>
      <!-- /右则边栏 结束 -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
import Add from '@/components/article/add'  // 子组件-发布新贴入口
import Aphorism from '@/components/aside/aphorism'  // 子组件-随机诗语
import Recommend from '@/components/aside/recommend'  // 子组件-文章推荐
import Looper from '@/components/aside/looper'  // 子组件-右则小轮播图
import Patron from '@/components/aside/patron' // 子组件-投放诗语-成为VIP投放诗语人

export default {
  name: 'looper',
  // 动态标题
  head() {
    return {
      title: '轮播图片 - 经历网'
    }
  },
  components: {
    Add,
    Aphorism,
    Recommend,
    Looper,
    Patron
  },
  async asyncData({app, store}) {
    // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
    const userId = store.state.userInfo && store.state.userInfo.id || 0
    // 随机诗语
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
    // 最新前15条轮播图信息
    const {data: looper} = await app.$getLooperTop15List()
    const loopTop15 = looper.looperTop15List

    return {
      randomTip,
      recommendArticleList,
      looperListRight,
      oneTop,
      loopTop15,
      userId
    }
  },
  data() {
    return {
      formData: {
        // 金额给默认值页面才会显示默认值
        amount: 20,
        // 回显的时候需要
        looperUrl: ''
      },
      // 临时存放已上传成功返回的图片url，为了重复上传的时候删除之前上传无用的图片
      oldImageUrl: String,
      // 校验表单
      rules: {
        looperUrl: [
          {required: true, message: '轮播图片不能为空', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '图片标题不能为空', trigger: 'blur'},
          {min: 1, max: 30, message: '长度在1到30个字符', trigger: 'blur'}
        ],
        position: [
          {required: true, message: '请选择轮播位置', trigger: 'blur'}
        ],
        // 校验网址
        looperLink: [
          {
            pattern: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
            message: '链接网址格式不正确',
            trigger: 'blur'
          }],
        amount: [
          {required: true, message: '投放诗语金额不能为空', trigger: 'blur'},
          {type: 'number', message: '投放诗语金额必须为数字'}
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
      // 获取路由ID
      loopId: this.$route.query.id,
    }
  },
  created() {
    if (this.loopId) {
      this.getLooperInfoById();
    }
  },
  methods: {
    // 根据ID查询编辑状态轮播图详情
    async getLooperInfoById() {
      const {data} = await this.$getEditUserLooperById(this.loopId)
      this.formData = data.looper
    },
    // 上传图片之前的钩子（限制上传图片大小）
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    // 上传图片
    uploadImg(file) {
      if (this.userId === 0) {
        this.$message.info("功能展示")
        return;
      }
      const data = new FormData() // 封装表单对象
      data.append('file', file.file)
      this.$uploadImg("looper", data).then(response => {
        // 图片目录为 looper ，这里将参数直接写死，不多定义一个变量了
        if (response.code === 200) {
          // 以防图片多次上传,上传成功后,把原来的图片删除
          this.removeImg()
          this.formData.looperUrl = response.data.fileUrl
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
      if (this.formData.looperUrl) {
        this.$deleteImg(this.formData.looperUrl)
      }
    },
    // 清空表单，移除该表单项校验结果
    resetForm(formName) {
      // 清空表单的时候，删除之前上传的图片
      this.removeImg()
      this.$refs[formName].resetFields();
    },
    // 游客点击取消按钮
    goIndex(formRef) {
      this.$refs['formRef'].resetFields()
      window.location = '/';
    },
    // 取消投放轮播图片
    cancel(formRef) {
      // 取消的时候，删除上传的图片
      this.removeImg()
      this.$refs['formRef'].resetFields()
      window.location = '/';
    },
    // 提交表单
    submitForm(formRef) {
      if (this.userId === 0) {
        this.$message.info("功能展示")
        return;
      }
      // 提交数据给后台
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    // 新增或修改轮播图片
    async submitData() {
      let response = null
      // 有id则修改，没有id则新增
      if (this.formData.id) {
        // 修改
        response = await this.$updateLooperById(this.formData)
      } else {
        // 新增
        response = await this.$addLooper(this.formData)
      }
      if (response.code === 200) {
        // 跳转到用户私人空间-投图页面
        window.location = '/user/private/loop/?id=' + this.userId;
        this.$message.success("新增成功")
      } else {
        this.$message.error(response.message)
      }
    },
    // 打开-投放诗语-窗口
    openPatron() {
      this.addPatronData.message = ''
      this.addPatronData.payNumber = ''
      this.isOpenPatron = !this.isOpenPatron
    },
    // 关闭-投放诗语-窗口
    handleClosePatron() {
      this.addPatronData.message = ''
      this.addPatronData.payNumber = ''
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

// 上传图片
.loop-uploader .el-upload {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #fdfdfd;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
}

// 上传图片
.loop-uploader .el-upload:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
}

// 最外层容器
.container {
  min-height: 630px;
  background-color: #242424;

  // 页面左则容器、右则容器
  .main, .aside {
    border-radius: 4px;
    background-color: #FFFFFF;
  }

  .el-form {
    ul > li, p {
      line-height: 30px;
      font-size: 14px;
    }
  }

  .add-box {
    // 公共样式
    a {
      color: #8205c6;
    }

    a:hover {
      text-decoration: underline;
    }

    img {
      border-radius: 4px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
    }
  }

  .aside {

    .el-button {
      width: 100%;
      color: #cccccc;
      background-color: black;
    }

    .el-button:hover {
      color: white;
    }

    ul {
      padding: 10px 0 25px;

      li {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px;

        img {
          height: 30px;
          width: 30px;
          border-radius: 4px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        }

        a {
          margin-left: 20px;
          font-size: 16px;
        }

        a:hover {
          color: #8205c6;
          text-decoration: underline;
        }
      }
    }

    .el-divider {
      background-color: black;
    }
  }

}

// md
@media screen and (min-width: 960px) {

  //上传图片
  .uploader-icon {
    width: 100%;
    min-width: 280px;
    height: 280px;
    line-height: 280px;
    text-align: center;
    color: #8c939d;
    font-size: 28px;
  }

  // 上传图片
  .el-avatar {
    display: block;
    min-width: 280px;
    height: 280px;
    width: 100%;
  }


  // md 最外层容器
  .container {

    .container-in {
      width: 80%;
      margin: 0 auto;

      .main {
        float: left;
        width: 75%;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

        h1 {
          margin: 50px 0 80px;
          text-align: center;
        }

        // 按钮
        .centre {
          display: flex;
          justify-content: center;
          padding-top: 20px;
          padding-bottom: 80px;
        }

        .add-box {
          width: 70%;
          margin: 0 auto;
          line-height: 2;
          font-size: 16px;

          ol {
            margin-left: 20px;
          }
        }

        // 二维收款码
        .ewm {
          height: 200px;
        }
      }

      .aside {
        float: left;
        width: 23%;
        margin-bottom: 20px;
        margin-left: 26px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {

  // 上传图片样式
  .uploader-icon {
    height: 178px;
    width: 100%;
    min-width: 178px;
    line-height: 178px;
    text-align: center;
    font-size: 28px;
    color: #8c939d;
  }

  .el-avatar {
    display: block;
    height: 178px;
    width: 100%;
    min-width: 178px;
  }

  // sm - 最外层容器
  .container {

    .container-in {
      clear: both;
      width: 100%;

      .main {
        width: 100%;
        margin: 0 auto;

        h1 {
          margin: 0 0 50px;
          padding-top: 20px;
          text-align: center;
        }

        .add-box {
          width: 90%;
          margin: 0 auto;
          line-height: 1.5;
          font-size: 16px;

          // 按钮
          .centre {
            display: flex;
            justify-content: flex-end;
            padding-top: 20px;
            padding-bottom: 80px;
            margin: 0 auto;
          }

          ol {
            margin-left: 20px;
          }

          .el-radio-button:last-child .el-radio-button__inner, .el-radio-button--small .el-radio-button__inner {
            border-radius: 4px;
          }

        }

        // 二维收款码
        .ewm {
          width: 100%;
        }
      }

      .aside {
        float: left;
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }

}
</style>

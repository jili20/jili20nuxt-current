<template>
  <div class="patron-one-vip">
    <!-- 右则边栏 投放诗语人 -->
    <div class="aside" style="background-color: #FFFFFF;">
      <el-divider>联系编辑</el-divider>
      <img src="@/assets/img/patron/bing.jpg" alt="" style="width: 100%;">
      <div class="btn">
        <el-button class="el-icon-edit" style="font-size: 14px;" @click="openPatron"> 投放诗语</el-button>
        <br>
        <el-button class="el-icon-picture" @click="addLooper"> 投放轮播图片</el-button>
      </div>
    </div>
    <!-- 新增投放诗语 对话框 -->
    <el-dialog
      :width='dialogWidth'
      :visible.sync="isOpenPatron"
      :before-close="handleClosePatron">
      <div>
        <h2 class="title-1"><i class="el-icon-microphone"/> 投放诗语</h2>
        <el-form :rules="rules" ref="patronForm" label-position="right" label-width="100px"
                 :model="addPatronData">
          <div class="ts">
            <p><b>🔳 温馨提示：</b> 经历网为只读网站，可搜索，全球可访问。</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;投放诗语，请您将内容发送至电子邮箱 908866805@qq.com</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;或添加编辑的微信/QQ： 908866805 提交</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;您可以点击 <a href="/patron" title="查看所有投放的诗语"> 查看所有诗语</a></p>
          </div>
          <el-form-item label="头像" prop="avatar">
            <!-- 当点击上传图片的时候，会触发这个方法 :http-request="uploadMainImg" 自定义上传图片方法 -->
            <el-upload
              v-if="userId == 0"
              disabled
              class="avatar-uploader"
              action=""
              accept="image/*"
              :show-file-list="false">
              <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-upload
              v-if="userId !== 0"
              class="avatar-uploader"
              action=""
              accept="image/*"
              :show-file-list="false"
              :http-request="uploadImg"
              :before-upload="beforeUpload">
              <!-- 如果有图片，显示图片 -->
              <img v-if="addPatronData.avatar" :src="addPatronData.avatar" class="avatar" alt="">
              <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-input v-model="addPatronData.avatar" :min="10" maxlength="255" show-word-limit/>
          </el-form-item>
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addPatronData.username" :min="1" maxlength="20" show-word-limit/>
          </el-form-item>
          <el-form-item label="内容" prop="message">
            <el-input v-model.trim="addPatronData.message" clearable :min="1" maxlength="200" show-word-limit
                      @keyup.enter.native="submitAddPatronForm('patronForm')"/>
          </el-form-item>
          <el-form-item label="经历" prop="link">
            <el-input v-model="addPatronData.link" :min="10" maxlength="50" show-word-limit/>
          </el-form-item>
        </el-form>
        <div class="btn-box">
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('patronForm')">重置</el-button>
          <el-button @click="handleClosePatron">取 消</el-button>
          <el-button v-if="userId !== 0" type="primary" @click="submitAddPatronForm('patronForm')">立即投放</el-button>
          <el-button v-if="userId == 0" type="primary">立即投放</el-button>
        </span>
        </div>
      </div>

    </el-dialog>
    <!-- /新增随机诗语 对话框 结束 -->
  </div>
</template>
<script>
export default {
  name: "patron",
  props: ["isOpenPatron", "addPatronData"],
  data() {
    return {
      // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
      userId: this.$store.state.userInfo && this.$store.state.userInfo.id || 0,
      // 动态改变弹窗的尺寸用
      dialogWidth: '0',
      rules: {
        avatar: [
          {required: true, message: '投放人头像不能为空', trigger: 'blur'},
          {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '投放人姓名不能为空', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        message: [
          {required: true, message: '内容不能为空', trigger: 'blur'},
          {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 提交投放诗语表单
    async submitAddPatronForm(patronForm) {
      if (this.userId === 0) {
        this.$message.info("功能展示")
        return;
      }
      this.$refs[patronForm].validate((valid) => {
        if (valid) {
          // 触发父组件新增方法
          this.$emit('addPatron', this.addPatronData, this.isOpenPatron);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 打开 新增投放诗语 窗口
    openPatron() {
      // 触发父组件方法
      this.$emit('openPatron');
      const val = document.body.clientWidth;
      const def = 800 // 默认宽度
      if (val < def) {
        this.dialogWidth = '95%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    // 关闭投放诗语 窗口
    handleClosePatron() {
      this.$emit('handleClosePatron');
    },
    // 重置表单
    resetForm(sponsorForm) {
      this.$refs[sponsorForm].resetFields();
    },
    // 跳转到新增轮播图页面
    addLooper() {
      window.location = '/looper';
    },
    // 上传图片之前的钩子（限制上传图片大小）
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    // 上传投放诗语投放诗语人头像
    uploadImg(file) {
      if (this.userId === 0) {
        this.$message.info("功能展示")
        return;
      }
      const data = new FormData() // 封装表单对象
      data.append('file', file.file)
      // 图片上传到 looper 目录 ，这里将参数直接写死，不多定义一个变量了
      this.$uploadImg("one", data).then(response => {
        if (response.code === 200) {
          // 以防图片多次上传,上传成功后,把原来的图片删除
          this.removeImg()
          this.addPatronData.avatar = response.data.fileUrl
          // this.oldImageUrl = response.data.fileUrl
          this.$message.success("上传头像成功")
        } else {
          this.$message.error(response.message)
        }
      }).catch(() => {
        this.$message.error('上传头像失败')
      })
    },
    // 删除之前上传无用的图片
    removeImg() {
      if (this.addPatronData.avatar) {
        this.$deleteImg(this.addPatronData.avatar)
      }
    }
  }
}
</script>
<style lang="less">
.patron-one-vip {

  // 上传图片
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .icon-yiyuanmiaosha {
    font-size: 30px;
    font-weight: unset;
  }

  /* 修改则边栏标题横线颜色 */

  .el-divider {
    background-color: #2b2b2b;
  }

  .el-dialog {

    .title-1 {
      margin-bottom: 50px;
      text-align: center;
    }

    .btn-box {
      display: flex;
      justify-content: center;
      margin: 50px 0;
    }

    h2 {
      margin-bottom: 50px;
      text-align: center;
    }

    .ts {
      padding: 0 30px 50px;

      p {
        line-height: 30px;
      }
    }

    .ml18 {
      margin-left: 18px;
    }
  }

  a {
    font-weight: bold;
    color: #8205c6;
  }

  a:hover {
    text-decoration: underline;
  }

  // 侧边栏
  .aside {
    float: left;
    border-radius: 4px;
    font-size: 16px;

    .patron, .btn {
      padding: 20px;
    }

    .el-button {
      width: 100%;
      color: #cccccc;
      background-color: black;
    }

    .el-button:hover {
      color: white;
    }

    // 投放诗语人头像
    .avatar {
      width: 35px;
      height: 35px;
      padding: 2px;
      border-radius: 4px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
    }

    .avatar:hover {
      border-radius: 50%;
    }
  }
}


// ----------------- md -------------------->
@media screen and (min-width: 960px) {

  .patron-one-vip {

    // 右则边栏
    .aside {
      width: 23%;
      margin-left: 26px;
      margin-bottom: 20px;

      .patron {

        div {
          display: inline-block;

          img {
            margin-left: 5px;
          }
        }
      }
    }
  }
}

/* sm */
@media screen and (max-width: 960px) {

  .patron-one-vip {

    // 侧边栏
    .aside {
      width: 100%;
      margin-bottom: 5px;

      .patron {
        margin-top: 20px;

        div {
          display: inline-block;

        }

      }
    }

    .img {
      width: 100%;
      height: 100%;
      margin-top: 20px;
      border-radius: 4px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
    }
  }

}

</style>

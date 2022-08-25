<template>
  <!-- 最外层容器 -->
  <div class="user-container">
    <!-- 顶部清除浮动 -->
    <div class="line-top"></div>
    <!-- 中间整个容器 -->
    <div class="container-in">
      <!-- 子组件-右则边栏-导航 -->
      <div class="aside">
        <Set/>
      </div>
      <!-- /右则边栏 结束 -->
      <!-- 左边内容容器 开始 -->
      <div class="main">
        <!-- 子组件-顶部头像和各项统计 -->
        <Total :username="user.username" :userId="user.id" :avatar="user.avatar"
               :aCount="aCount" :authId="userId"/>
        <el-divider/>
        <div class="list-box">
          <h2>藏经阁</h2>
          <!-- 标题按钮区 -->
          <div class="title-btn">
            <a :href="'/user/private/'+ user.id"><h3><i class="el-icon-loading"/> 动态</h3></a>
            <a :href="'/user/private/draft/?id='+ user.id"><h3><i class="el-icon-edit-outline"/> 草稿</h3></a>
            <a :href="'/user/private/update/?id='+ user.id" class="activate-icon">
              <h3><i class="el-icon-setting"/> 设置</h3></a>
            <a :href="'/user/private/loop/?id='+ user.id"><h3><i class="el-icon-picture"/> 投图</h3></a>
          </div>
          <!-- 设置隐私-->
          <b class="el-icon-unlock"> 隐私设置</b>
          <div class="privacy-box">
            <div>
              <span class="left">是否公开关注列表 &nbsp;&nbsp;</span>
              <el-switch
                v-model="privacy.follow"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateFollow">
              </el-switch>
            </div>
            <div>
              <span class="right">是否公开粉丝列表 </span>
              <el-switch
                v-model="privacy.follower"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateFollower">
              </el-switch>
            </div>
            <div>
              <span class="left">是否公开留言列表 &nbsp;&nbsp;</span>
              <el-switch
                v-model="privacy.comment"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateComment">
              </el-switch>
            </div>
            <div>
              <span class="right">是否公开投放诗语列表 </span>
              <el-switch
                v-model="privacy.patron"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updatePatron">
              </el-switch>
            </div>
            <div>
              <span class="left">是否公开获赞列表 &nbsp;&nbsp;</span>
              <el-switch
                v-model="privacy.thumb"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateThumb">
              </el-switch>
            </div>
            <div>
              <span class="right">是否公开点赞列表 </span>
              <el-switch
                v-model="privacy.doThumb"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateDoThumb">
              </el-switch>
            </div>
            <div>
              <span class="left">是否公开获奖励列表 </span>
              <el-switch
                v-model="privacy.award"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateAward">
              </el-switch>
            </div>
            <div>
              <span class="right">是否公开奖励列表 </span>
              <el-switch
                v-model="privacy.doAward"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateDoAward">
              </el-switch>
            </div>
            <div>
              <span class="left">是否公开被收藏列表 </span>
              <el-switch
                v-model="privacy.collect"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateCollect">
              </el-switch>
            </div>
            <div>
              <span class="right">是否公开收藏列表 </span>
              <el-switch
                v-model="privacy.doCollect"
                active-color="#409EFF"
                inactive-color="#7E7E7E"
                active-text="公开"
                inactive-text="隐藏"
                @change="updateDoCollect">
              </el-switch>
            </div>
          </div>
          <div>
            <!-- 用户修改头像/投放诗语码 -->
            <div class="uploader-box">
              <!-- 修改头像 -->
              <div>
                <el-upload
                  class="user-avatar-uploader"
                  action=""
                  accept="image/*"
                  :show-file-list="false"
                  :http-request="uploadAvatar"
                  :before-upload="beforeUpload">
                  <!-- 如果有图片，显示图片 -->
                  <el-tooltip content="点击上传头像" effect="dark" placement="top">
                    <img v-if="user.avatar" :src="user.avatar" class="el-avatar" alt="">
                    <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
                    <i v-else class="el-icon-plus avatar-uploader-icon"/>
                  </el-tooltip>
                </el-upload>
                <p class="title-p">🔲
                  修改头像（修改成功需重新认证身份）</p>
              </div>
              <!-- 修改赞赏码 -->
              <div>
                <el-upload
                  class="user-avatar-uploader"
                  action=""
                  accept="image/*"
                  :show-file-list="false"
                  :http-request="uploadRewardUrl"
                  :before-upload="beforeUpload">
                  <!-- 如果有图片，显示图片 -->
                  <el-tooltip content="点击上传赞赏码" effect="dark" placement="top">
                    <img src="@/assets/img/user/reward.jpg" class="el-avatar" alt="">
                    <!-- 如果没有图片，显示那个 + 号，底下的样式就是 + 号 加边框 -->
                    <!-- <i v-else class="el-icon-plus avatar-uploader-icon"/>-->
                  </el-tooltip>
                </el-upload>
                <p class="title-p">🔲 赞赏码</p>
              </div>
            </div>
            <!-- 修改用户其它信息 -->
            <div class="title-out-box">
              <el-divider/>
              <!-- 修改用户名 -->
              <div class="edit-box">
                <el-form :model="user" label-width="100px"
                         label-position="top">
                  <el-form-item label="🔳 修改用户名（修改成功需重新认证身份）" style="padding: 0 5px;">
                    <div style="display: flex;justify-content: space-around;">
                      <el-input v-model="user.username" maxlength="10" clearable show-word-limit placeholder="请输入新用户名"/>
                      <el-button type="primary" @click="updateUsername">确定</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <br>
              <!-- 修改个性签名 -->
              <div class="edit-box">
                <el-form :model="user" label-width="100px"
                         label-position="top">
                  <el-form-item label="🔳 修改个性签名" style="padding: 0 5px;">
                    <div style="display: flex;justify-content: space-around;">
                      <el-input v-model="user.sign" maxlength="30" clearable show-word-limit placeholder="请输入新个性签名"/>
                      <el-button type="primary" @click="updateUserSign">确定</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <br>
              <!-- 修改邮箱 -->
              <div class="edit-box">
                <el-form :model="user" label-width="100px"
                         label-position="top">
                  <el-form-item label="🔳 修改邮箱" style="padding: 0 5px;">
                    <div style="margin-bottom: 10px;display: flex;justify-content: space-around;">
                      <el-input v-model="user.email" maxlength="30" clearable placeholder="请输入新邮箱"/>
                      <el-button class="code-btn" type="primary" v-if="!sending">获取验证码
                      </el-button>
                      <el-button class="code-btn" type="primary" v-else disabled> {{ leftSecond }} 秒后重发</el-button>
                    </div>
                    <div style="display: flex;justify-content: space-around;">
                      <el-input v-model="emailData.code" maxlength="4" clearable show-word-limit
                                placeholder="请输入邮箱验证码"/>
                      <el-button type="primary">确定</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <br>
              <!-- 修改手机号 -->
              <div class="edit-box">
                <el-form :model="user" label-width="100px"
                         label-position="top">
                  <el-form-item label="🔳 修改手机号码" style="padding: 0 5px;">
                    <div style="margin-bottom: 10px;display: flex;justify-content: space-around;">
                      <el-input v-model="user.phone" maxlength="30" clearable placeholder="请输入新手机号码"/>
                      <el-button class="code-btn" type="primary" v-if="!phoneSending">获取验证码
                      </el-button>
                      <el-button class="code-btn" type="primary" v-else disabled> {{ phoneSecond }} 秒后重发</el-button>
                    </div>
                    <div style="display: flex;justify-content: space-around;">
                      <el-input v-model="phoneData.code" maxlength="4" clearable show-word-limit
                                placeholder="请输入手机验证码"/>
                      <el-button type="primary">确定</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <br>
              <!-- 修改密码 -->
              <div class="edit-box">
                <el-form :model="pwdData" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
                  <el-form-item label="🔳 修改密码" prop="password">
                    <el-input type="password" v-model="pwdData.password" min="6" maxlength="20" clearable
                              show-word-limit
                              placeholder="请输入现用密码"/>
                  </el-form-item>
                  <el-form-item prop="newPassword">
                    <el-input type="password" v-model="pwdData.newPassword" min="6" maxlength="20" clearable
                              show-word-limit
                              placeholder="请输入新密码"/>
                  </el-form-item>
                  <el-form-item prop="confirmPassword">
                    <el-input type="password" v-model="pwdData.confirmPassword" min="6" maxlength="20" clearable
                              show-word-limit
                              placeholder="请确认新密码"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-button type="primary" @click="updatePassword('ruleForm')">确定</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-divider/>
              <br>
              <br>
            </div>
            <!-- 加背景图片-->
            <div class="page"></div>
          </div>
        </div>
      </div>
      <!-- /左边内容容器   -->
    </div>
    <!-- 底部清除浮动线 -->
    <div class="line-bottom"></div>
  </div>
</template>
<script>
import Set from '@/components/user/set'
import Total from '@/components/user/total'
import {isvalidEmail, isvalidPhone} from '@/utils/validate'

export default {
  name: "user-private",
  // 引用中间件，拦截路由请求，判断是否已经身份认证
  // middleware: 'auth',
  components: {
    Set,
    Total
  },
  // 动态标题
  head() {
    return {
      title: this.user.username + ' 的私人空间 - 经历网'
    }
  },
  async asyncData({app, store}) {
    // 获取当前登录用户ID（用于判断是否能看到删除按钮）
    const authId = store.state.userInfo && store.state.userInfo.id || 0
    const userId = store.state.userInfo && store.state.userInfo.id || 1
    const userInfo = store.state.userInfo && store.state.userInfo
    // 通过路由ID查询用户信息
    let {data: info} = await app.$getUserInfoByRouteId(userId)
    const user = info.user
    // 统计-文章微服务
    const {data: articleServiceCount} = await app.$statisticCountArticle(userId)
    const aCount = articleServiceCount.statistic

    return {
      authId,
      userId,
      user,
      aCount,
      userInfo
    }
  },
  data() {
    // 校验新密码和确认密码是否一致
    let validateNewAndOldPass = (rule, value, callback) => {
      if (value === this.pwdData.password) {
        callback(new Error('新密码不能和旧密码一致'));
      } else {
        callback();
      }
    };
    // 校验新密码和确认密码是否一致
    let validateCfPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdData.newPassword) {
        callback(new Error('新密码和确认密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // 用户修改用户名
      usernameData: {
        username: ''
      },
      // 用户修改个性签名
      signData: {
        sign: ''
      },
      // 用户修改邮箱
      emailData: {
        email: '',
        code: ''
      },
      leftSecond: 0, // 剩余时间
      sending: false, // 是否发送验证码
      // 用户修改手机号码
      phoneData: {
        phone: '',
        code: ''
      },
      phoneSecond: 0,
      phoneSending: false, // 是否发送验证码
      // 公共
      subState: false, // 提交状态
      second: 60, // 倒计时间
      // 用户修改密码
      pwdData: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        password: [
          {required: true, message: '现用密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
          {validator: validateNewAndOldPass, trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
          {validator: validateCfPass, trigger: 'blur'}
        ]
      },
      // 设置隐藏
      privacy: {
        userId: 0,
        follow: true,
        follower: true,
        comment: true,
        patron: true,
        thumb: true,
        doThumb: true,
        award: true,
        doAward: true,
        collect: true,
        doCollect: true
      }
    }
  },
  methods: {
    // 隐私设置-是否公开关注列表
    updateFollow() {
    },
    // 隐私设置-是否公开粉丝列表
    updateFollower() {
    },
    // 隐私设置-是否公开留言列表
    updateComment() {
    },
    // 隐私设置-是否公开投放诗语列表列表
    updatePatron() {
    },
    // 隐私设置-是否公开被赞列表
    updateThumb() {
    },
    // 隐私设置-是否公开点赞列表
    updateDoThumb() {
    },
    // 隐私设置-是否公开获奖励列表
    updateAward() {
    },
    // 隐私设置-是否公开奖励列表
    updateDoAward() {
    },
    // 隐私设置-是否公开被收藏列表
    updateCollect() {
    },
    // 隐私设置-是否公开收藏列表
    updateDoCollect() {
    },
    // 用户修改头像，上传图片之前的钩子（限制上传图片大小）
    beforeUpload(file) {
      if (this.authId == 0) {
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    // 用户上传头像
    uploadAvatar(file) {
      if (this.authId == 0) {
        return;
      }
      const data = new FormData() // 封装表单对象
      data.append('file', file.file)
      this.$uploadImg("avatar", data).then(response => {
        // 图片目录名为 avatar ，这里直接写死
        if (response.code === 200) {
          // 以防图片多次上传，上传成功后，把原来的图片删除
          this.removeImg()
          // 上传成功，保存头像到数据库
          this.user.avatar = response.data.fileUrl
          this.$updateAvatar(this.user)
          this.$message.success("上传头像成功")
          // 退出登录( 为了同步数据 )
          this.$logout().then(response => {
            if (response.code === 200) {
              this.$cookies.remove('token')
              this.$cookies.remove('userInfo')
              this.$store.dispatch('userLogout')
              // 跳转到登录页面，再重定向回来
              window.location.href = (`/auth/login?redirectURL=` + window.location.href)
            }
          })
        } else {
          this.$message.error(response.message);
        }
      }).catch(() => {
        this.$message.error('上传头像失败')
      })
    },
    // 删除头像
    removeImg() {
      if (this.user.avatar) {
        this.$deleteImg(this.user.avatar)
      }
    },
    // 用户上传赞赏码
    uploadRewardUrl(file) {
      if (this.authId == 0) {
        return;
      }
      // const data = new FormData() // 封装表单对象
      // data.append('file', file.file)
      // 图片目录名为 reward ，这里直接写死
      // this.$uploadImg("reward", data).then(response => {
      //   if (response.code === 200) {
      //     // 以防图片多次上传，上传成功后，把原来的图片删除
      //     this.removeOldRewardUrl()
      //     // 上传成功，保存头像到数据库
      //     this.user.rewardUrl = response.data.fileUrl
      //     this.$updateReward(this.user)
      //     this.$message.success("上传赞赏码成功")
      //     // 退出登录( 为了同步数据 )
      //     this.$logout().then(response => {
      //       if (response.code === 200) {
      //         this.$cookies.remove('token')
      //         this.$cookies.remove('userInfo')
      //         this.$store.dispatch('userLogout')
      //         // 跳转到登录页面，再重定向回来
      //         window.location.href = (`/auth/login?redirectURL=` + window.location.href)
      //       }
      //     })
      //   } else {
      //     this.$message.error(response.message);
      //   }
      // }).catch(() => {
      //   this.$message.error('上传赞赏码失败')
      // })
    },
    // 删除赞赏码
    // removeOldRewardUrl() {
    //   if (this.authId == 0) {
    //     return;
    //   }
    //   if (this.user.rewardUrl) {
    //     this.$deleteImg(this.user.rewardUrl)
    //   }
    // },
    // 用户修改密码
    updatePassword(formName) {
      if (this.authId == 0) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$updatePassword(this.pwdData).then(response => {
            if (response.code === 200) {
              this.pwdData.password = ''
              this.pwdData.newPassword = ''
              this.pwdData.confirmPassword = ''
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置修改密码表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 用户修改-个性签名
    updateUserSign() {
      if (this.authId == 0) {
        return;
      }
      if (this.user.sign === '') {
        this.$message.error("个性签名不能为空")
        return
      }
      this.signData.sign = this.user.sign
      this.$updateUserSign(this.signData).then(response => {
        if (response.code === 200) {
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 用户修改-用户名
    updateUsername() {
      if (this.authId == 0) {
        return;
      }
      if (this.user.username === '') {
        this.$message.error("用户名不能为空")
        return
      }
      this.usernameData.username = this.user.username
      this.$updateUsername(this.usernameData).then(response => {
        if (response.code === 200) {
          this.$message.success(response.message)
          // 退出登录( 为了同步数据 )
          this.$logout().then(response => {
            if (response.code === 200) {
              this.$cookies.remove('token')
              this.$cookies.remove('userInfo')
              this.$store.dispatch('userLogout')
              // 跳转到登录页面，再重定向回来
              window.location.href = (`/auth/login?redirectURL=` + window.location.href)
            }
          })
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>
<style lang="less">

// 图标激活颜色
.activate-icon {
  border-bottom: solid 3px #d95107;
  color: #d95107;
}

// 隐私设置
.el-icon-unlock {
  font-size: 22px;
  margin: 20px 0 30px 80px;
}

// 上传图片
.user-avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.user-avatar-uploader .el-upload:hover {
  box-shadow: 0 0 20px 6px white;
}

// 外层大容器
.user-container {
  min-height: 630px;
  background-color: #242424;

  // 页面左则容器、右则容器
  .main, .aside {
    border-radius: 4px;
    background-color: #FFFFFF;
  }

  .main {

    // 文章标题列表
    .list-box {
      border-radius: 4px;

      .title-btn {
        display: flex;
        justify-content: space-around;
        margin-bottom: 50px;
        text-align: center;
      }

      h2 {
        text-align: center;
        margin-bottom: 50px;
      }

      // 修改用户名
      .edit-box {
        padding: 20px 10px 10px;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }

    .uploader-box {
      clear: left;
      display: flex;
      justify-content: space-around;
      padding: 30px;
      background-color: #242424;
      box-shadow: 0 0 20px 6px white;

      .title-p {
        margin: 20px 0 0;
        text-align: center;
        font-size: 14px;
        color: #d5d5d5;
      }
    }

    .page {
      height: 100px;
      padding: 20px 0 80px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      box-shadow: 0 0 20px 6px white;
      background: url("~@/assets/img/patron/1.gif") no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
}

// md
@media screen and (min-width: 960px) {

  .user-container {

    .container-in {
      width: 80%;
      margin: 0 auto;
      padding-bottom: 26px;

      .main {
        float: left;
        width: 75%;
        margin-left: 26px;
        border-radius: 4px;

        .title-out-box {
          width: 60%;
          margin: 0 auto;
        }

        // Switch 开关
        .privacy-box {
          width: 100%;
          margin: 0 50px 250px;

          > div {
            float: left;
            margin-bottom: 10px;

            .left {
              margin-left: 30px;
              margin-right: 70px;
              font-size: 15px;
            }

            .right {
              margin-left: 200px;
              margin-right: 70px;
              font-size: 15px;
            }
          }
        }

        // 修改各项表单容器
        .edit-box {
          padding: 10px 100px;
        }

        // 上传头像
        .user-avatar-uploader {
          width: 178px;
          min-height: 178px;
          text-align: center;
          font-size: 28px;
          color: #8c939d;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

          img {
            display: block;
            width: 178px;
            min-height: 178px;
            border-radius: 6px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
          }
        }
      }

      .aside {
        float: left;
        width: 23%;
        border-radius: 4px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// sm
@media screen and (max-width: 960px) {
  .user-container {

    .container-in {
      clear: both;
      width: 100%;

      .main {
        width: 100%;
        margin: 0 auto;

        // 列表区域
        .list-box {

          .title-out-box {
            width: 90%;
            margin: 0 auto;
          }

          // 列表内容区域
          .content {
            margin: 20px;
          }
        }

        // Switch 开关
        .privacy-box {
          margin-top: 50px;
          margin-bottom: 50px;

          > div {
            display: flex;
            justify-content: center;
            margin-bottom: 10px;

            .left {
              margin-right: 40px;
              font-size: 15px;
            }

            .right {
              margin-right: 40px;
              font-size: 15px;
            }
          }
        }

        // 上传头像
        .user-avatar-uploader {
          width: 120px;
          min-height: 120px;
          text-align: center;
          font-size: 28px;
          color: #8c939d;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);

          img {
            display: block;
            width: 120px;
            min-height: 120px;
            border-radius: 6px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
          }
        }
      }

      .aside {
        width: 100%;
      }
    }
  }

}
</style>

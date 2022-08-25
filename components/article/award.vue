<template>
  <div>
    <!-- 未奖励 -->
    <a href="javascript:void(0);" class="el-icon-coin" @click="openOrClose">
      <span> {{ awardCount }} </span>
    </a>
    <el-dialog
      title="◼ 奖励作者"
      :visible.sync="awardDialogVisible"
      :width='dialogWidth'
      :before-close="openOrClose">
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="awardData"
        label-width="100px"
        label-position="right"
        status-icon>
        <el-form-item>
          <img src="https://s3.bmp.ovh/imgs/2022/05/03/37f75015084637d1.jpg" alt="作者赞赏码" lazy>
        </el-form-item>
        <el-form-item label="文章标题：">
          <p class="fs16">{{ title }}</p>
        </el-form-item>
        <el-form-item label="文章作者：">
          <b>{{ author }}</b>
        </el-form-item>
        <el-form-item label="奖励金额：" prop="amount">
          <el-input v-model.trim="awardData.amount" maxlength="99999" clearable placeholder="0.1 元起，请扫描作者赞赏码支付"
                    @keyup.enter.native="add('ruleForm')"/>
        </el-form-item>
        <el-form-item label="奖励单号：" prop="payNumber">
          <el-input v-model.trim="awardData.payNumber" maxlength="50" clearable show-word-limit placeholder="请输入奖励账单号"/>
        </el-form-item>
      </el-form>
      <div align="center" class="btn">
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="openOrClose">取消</el-button>
        <el-button type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "award",
  props: ["title", "author", "rewardUrl", "awardCount", "isAward", "awardData", "awardDialogVisible"],
  data() {
    // 校验账单号为字符串类型数字值
    const validateOrderNumber = (rule, value, callback) => {
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字类型奖励账单号'))
      } else {
        callback()
      }
    }
    const validateAmount = (rule, value, callback) => {
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字类型金额'))
      } else {
        callback()
      }
    }
    return {
      // 获取当前登录用户ID和头像 ( 方法参数上传入 store 才能获取 )
      userId: this.$store.state.userInfo && this.$store.state.userInfo.id || 0,
      // 动态改变弹窗的尺寸用
      dialogWidth: '0',
      // 校验表单
      rules: {
        payNumber: [
          {min: 6, max: 50, message: '长度在6到50个数字', trigger: 'blur'},
          {validator: validateOrderNumber, trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '奖励金额不能为空', trigger: 'blur'},
          {min: 1, max: 5, message: '长度在1至5个数字', trigger: 'blur'},
          {validator: validateAmount, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    openOrClose() {
      // 触发父组件方法
      this.$emit('openOrCloseAward');
      const val = document.body.clientWidth;
      const def = 600 // 默认宽度
      if (val < def) {
        this.dialogWidth = '95%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 提交表单
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 触发父组件新增方法
          this.$emit('addAward', this.awardData, formName);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style scoped lang="less">

.icon-jinbi {
  font-weight: bold;
  font-size: 36px;
  color: #747474;
}

.el-icon-coin {
  font-weight: bold;
  font-size: 31px;
}

.icon-jinbi:hover, .el-icon-coin:hover {
  color: #d95107;
}

a {
  font-size: 25px;

  span {
    font-size: 14px;
  }
}

.el-icon-wind-power {
  font-size: 25px;
}

.el-dialog {

  .btn {
    margin: 0 0 80px;
  }

  img {
    border-radius: 4px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  }
}
</style>

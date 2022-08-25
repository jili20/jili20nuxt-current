<template>
  <!-- 新增举报 对话框 开始 -->
  <div>
    <span @click="openOrCloseReport"><i class="el-icon-wind-power"/></span>
    <el-dialog
      :visible.sync="dialogVisible"
      :width='dialogWidth'
      :before-close="openOrCloseReport">
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="reportData"
        label-width="100px"
        label-position="top"
        status-icon>
        <h1>举报文章</h1>
        <hr>
        <br>
        <el-form-item label="文章标题：">
          <h3>{{ title }}</h3>
        </el-form-item>
        <hr>
        <el-form-item label="作者：">
          <b>{{ author }}</b>
        </el-form-item>
        <hr>
        <el-form-item label="举报原因：" prop="reportType">
          <!-- 举报原因：(0 作品侵权；1 涉嫌违法；2 内容不雅；3 骚扰谩骂；4 虚假宣传；5 低质灌水；6 其它 ) -->
          <el-radio-group v-model="reportData.reportType" size="small">
            <el-radio-button :label="0">作品侵权</el-radio-button>
            <el-radio-button :label="1">涉嫌违法</el-radio-button>
            <el-radio-button :label="2">内容不雅</el-radio-button>
            <el-radio-button :label="3">骚扰谩骂</el-radio-button>
            <el-radio-button :label="4">广告欺诈</el-radio-button>
            <el-radio-button :label="5">低质灌水</el-radio-button>
            <el-radio-button :label="6">其它</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <hr>
        <el-form-item label="补充说明：" prop="description" class="i-input">
          <el-input type="textarea" :rows="3" v-model="reportData.description" maxlength="500" clearable
                    placeholder="如果是作品侵权，请出具相关证明" @keyup.enter.native="addReport('ruleForm')"/>
        </el-form-item>
        <p>站务会尽快处理您的举报，处理结果，请留意站内通知!</p>
        <p>感谢您为共建文明社区付出!</p>
        <br>
      </el-form>
      <div align="right" class="btn">
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="openOrCloseReport">取消</el-button>
        <el-button type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "report",
  props: ["dialogVisible", "title", "author", "reportData"],
  data() {
    return {
      // 动态改变弹窗的尺寸用
      dialogWidth: '0',
      // 校验表单
      rules: {
        reportType: [
          {required: true, message: '请选择举报原因', trigger: 'change'}
        ],
        description: [
          {min: 10, max: 500, message: '补充长度在 10 到 500 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 打开窗口
    openOrCloseReport() {
      // 触发父组件方法
      this.$emit('openOrCloseReport');
      const val = document.body.clientWidth;
      const def = 800 // 默认宽度
      if (val < def) {
        this.dialogWidth = '95%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    // 提交表单
    addReport(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 触发父组件方法
          this.$emit('addReport', this.reportData);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped lang="less">

.el-icon-wind-power:hover {
  color: #d95107;
  cursor: pointer;
}

.el-icon-wind-power {
  font-size: 31px;
  font-weight: bold;
  color: #656870;
}

.el-dialog {

  .btn {
    margin: 0 35px 50px;
  }

  .el-form {
    p {
      text-align: center;
      font-size: 14px;
      color: #4d5158;
    }
  }
}

// md
@media screen and (min-width: 960px) {

  .el-form {
    padding: 0 30px 20px;
  }
}
</style>

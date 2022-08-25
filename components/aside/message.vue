<template>
  <div class="aside" v-show="messageBox">
    <el-form ref="ruleForm"
             :rules="rules"
             :model="messageData">
      <br>
      <p>给 <b>{{ author }}</b> 发送私信</p>
      <p>发信人：<span class="fs14" v-text="username ? username : '您还未登录，请登录后再操作!'">{{ username }}</span></p>
      <el-form-item label="" prop="content">
        <el-input type="textarea" v-model="messageData.content" maxlength="500" clearable
                  :placeholder="'@ '+ author"  @keyup.enter.native="add('ruleForm')"/>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="add('ruleForm')">立即发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "message",
  props: ["author", "messageData", "messageBox"],
  data() {
    return {
      username: this.$store.state.userInfo && this.$store.state.userInfo.username || '',
      rules: {
        content: [
          {required: true, message: '私信内容不能为空', trigger: 'blur'},
          {min: 2, max: 500, message: '长度为2至500个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    openMessageBox() {
      this.messageData.content = ''
      this.$emit('openMessageBox');
    },
    // 提交表单
    add(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          // 触发父组件新增方法
          this.$emit('sendMessage', this.messageData);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.$emit('openMessageBox');
    }
  }
}
</script>

<style scoped lang="less">

.el-form {
  padding: 20px;

  p {
    margin-bottom: 10px;
    font-size: 16px;
  }
}

</style>

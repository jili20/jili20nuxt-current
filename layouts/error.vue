<template>
  <div class="error">
  </div>
</template>

<script>
export default {
  name: 'error-page',
  // 自带的error参数
  props: ['error']

}
</script>
<style scoped>
.error {
  min-height: 630px;
  background: url("~@/assets/img/error/404.gif") no-repeat 0 0;
  background-size: 100% 100%;
}
</style>

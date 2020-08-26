<template>
  <div class="anquan">
    <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="back" />
    <div class="toExit">
      <van-button :round="true" :block="true" type="danger" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import "../assets/css/anquan.less";
//导入验证表单模块
import validForm from "../assets/js/FormValidation";

export default {
  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },

    //退出登录
    logout() {
      localStorage.removeItem("__Tk");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
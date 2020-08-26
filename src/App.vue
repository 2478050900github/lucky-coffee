<template>
  <div id="app">
    <!-- 一级路由插座 -->
    <!-- <router-view></router-view> -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
// 允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。
// 声明reload方法，控制router-view的显示或隐藏，从而控制页面的再次加载
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>
<style lang="less">
//全局样式
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  background-color: #fff;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.auto-img {
  width: 100%;
  display: block;
}
.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.van-nav-bar .van-icon,
.van-nav-bar__text {
  color: #0c34ba;
}
// 隐藏滚动条
::-webkit-scrollbar {
  display: none;
}
</style>

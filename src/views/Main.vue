<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>
    <!-- vant框架-开启路由模式:route="true" -->
    <van-tabbar v-model="tabbarActiveKey" active-color="#0C34BA" :route="true">
      <van-tabbar-item v-for="(item,index) in tabbars" :key="index" :to="item.url">
        <i :class="item.tabIcon"></i>
        {{item.tabTit}}
      </van-tabbar-item>
    </van-tabbar>
    <!-- <van-tabbar v-model="tabbarActiveKey" @change="toggleTabBar">
      <van-tabbar-item v-for="(item,index) in tabbars" :key="index">
        <i :class="item.tabIcon"></i>
        {{item.tabTit}}
      </van-tabbar-item>
    </van-tabbar>-->
  </div>
</template>

<script>
import "../assets/css/main.less";
export default {
  name: "Main",
  data() {
    return {
      // 底部导航激活
      tabbarActiveKey: 0,
      tabbars: [
        {
          tabTit: "首页",
          tabIcon: "iconfont icon-shouye",
          name: "01SY",
          url: "/main/01sy",
        },
        {
          tabTit: "菜单",
          tabIcon: "iconfont icon-menu",
          name: "02DC",
          url: "/main/02dc",
        },
        {
          tabTit: "购物车",
          tabIcon: "iconfont icon-dingdan",
          name: "03GWC",
          url: "/main/03gwc",
        },
        {
          tabTit: "我的",
          tabIcon: "iconfont icon-my",
          name: "04My",
          url: "/main/04my",
        },
      ],
    };
  },

  // created() {
  //   let hash = location.hash.slice(1);
  //   for (let i = 0; i < this.tabbars.length; i++) {
  //     if (this.tabbars[i].url == hash) {
  //       this.tabbarActiveKey = i;
  //       break;
  //     }
  //   }
  // },
  // methods: {
  //   //  底部切换
  //   toggleTabBar(index) {
  //     this.$router.push({ name: this.tabbars[index].name });
  //   },
  // },
};
</script>
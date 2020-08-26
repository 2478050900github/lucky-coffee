<template>
  <div class="shouye">
    <div class="say">{{hello}}{{userInfo.nickName}}</div>
    <van-swipe :autoplay="3000" class="my-swipe" indicator-color="blue">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <!-- 懒加载 -->
        <img v-lazy="image" style="width:100%; height:100%;" />
      </van-swipe-item>
    </van-swipe>
    <div class="buy-way">
      <div class="buy-self fl bw">
        <div class="buy-icon fl">
          <i class="iconfont icon-ziti"></i>
        </div>
        <div class="b-text">
          <div>自提</div>
          <span>在线点，到店取</span>
        </div>
      </div>
      <div class="buy-out fl bw">
        <div class="buy-icon fl">
          <i class="iconfont icon-waisong"></i>
        </div>
        <div class="b-text">
          <div>外送</div>
          <span>30分钟必达</span>
        </div>
      </div>
    </div>
    <div class="recommend">
      <h2>最新产品></h2>
      <div class="commodity-list">
        <div class="prd-card fl" v-for="(item, index) in productData" :key="index">
          <div class="prd-img">
            <img class="auto-img" :src="item.smallImg" />
          </div>
          <div class="prd-name">{{item.name}}</div>
          <div class="prd-price fl">
            <span>￥</span>
            {{item.price}}
          </div>
          <button class="fr" @click="getpid(item.pid)">＋</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/shouye.less";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");

export default {
  data() {
    return {
      hello: "",
      //商品数据
      productData: [],
      images: [
        //    ../../：代表的是上一层目录的上一层目录
        require("../../assets/images/m01.jpg"),
        require("../../assets/images/m02.jpg"),
        require("../../assets/images/m03.jpg"),
        require("../../assets/images/m04.jpg"),
        require("../../assets/images/m05.jpg"),
        require("../../assets/images/m06.jpg"),
      ],
      //用户信息
      userInfo: {},
      isLogin: false,
    };
  },
  created() {
    this.getTime();
    //获取商品类型数据
    this.getTypeData();
    //根据类型获取商品数据
    this.getProductByType({ type: "isHot" });
    this.getUserInfo();
    if (localStorage.getItem("__Tk")) {
      this.isLogin = true;
    }
  },
  computed: {
    ...mapState([
      "typeDataCache",
      "products",
      "bannerDataCache",
      "changeProducts",
    ]),
  },
  methods: {
    getTime() {
      let t = new Date().getHours();
      if (t >= 6 && t < 12) {
        this.hello = "早上好，";
      } else if (t >= 12 && t < 18) {
        this.hello = "下午好，";
      } else if (t >= 18 && t < 24) {
        this.hello = "晚上好，";
      } else {
        this.hello = "深夜了，";
      }
    },
    // 获取商品类型数据
    getTypeData() {
      // 侧边栏菜单缓存数据是否存在缓存数据，是否发起请求
      if (this.typeDataCache.length > 0) {
        this.typeData = this.typeDataCache;
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 400) {
            result.data.result.forEach((v) => {
              v.isActive = false;
            });
            result.data.result.unshift({
              type: "isHot",
              typeDesc: "最新推荐",
              isActive: true,
            });
            this.typeData = result.data.result;

            // 缓存侧边栏菜单数据在vuex
            this.changeData({
              key: "typeDataCache",
              value: result.data.result,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 根据类型获取商品数据
    getProductByType(name) {
      // 在缓存获取商品数据
      if (this.products[name.type]) {
        this.productData = this.products[name.type];
        return;
      }

      this.productData = [];

      let params = {
        appkey: this.appkey,
        key: "type",
        value: name.type,
      };

      // 最近推荐
      if (name.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 500) {
            this.productData = result.data.result;

            // 缓存商品数据
            this.changeProducts({
              type: name.type,
              value: result.data.result,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    getpid(pid) {
      //pid: 商品id
      this.$router.push({ name: "ProDetail", query: { pid } });
    },
    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>
<template>
  <div class="diancan">
    <div class="dingw">
      <div>
        定位到您的位置在：广州
        <van-button type="primary" class="fr">查看附近门店</van-button>
      </div>
    </div>
    <van-swipe style="height:4.5rem;" :autoplay="3000" class="my-swipe" indicator-color="#0b34ba">
      <van-swipe-item style="height:4.5rem;" v-for="(item, index) in banners" :key="index">
        <!-- 懒加载 -->
        <img v-lazy="item.bannerImg" style="width:100%; height:100%;" />
      </van-swipe-item>
    </van-swipe>

    <div class="menu-content">
      <van-tabs v-model="actName" swipeable @change="toggleType">
        <van-tab
          v-for="(item, index) in typeData"
          :key="index"
          :title="item.typeDesc"
          :name="item.type"
        ></van-tab>
          <div class="commodity-list">
            <van-card
              v-for="(item, index) in productData"
              :key="index"
              :price="item.price"
              :title="item.name"
              :desc="item.enname"
              :thumb="item.smallImg"
            >
              <template #footer>
                <van-button size="mini" @click="getpid(item.pid)">选规格</van-button>
              </template>
            </van-card>
          </div>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../../assets/css/menu.less";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");

export default {
  data() {
    return {
      actName: "",
      // 侧边导航
      activeKey: 0,

      //商品类型
      typeData: [],
      //商品数据
      productData: [],
      banners: [], //轮播图
    };
  },

  created() {
    //获取商品类型数据
    this.getTypeData();
    this.getBannerData();
    //根据类型获取商品数据
    this.getProductByType({ type: "isHot" });
  },

  computed: {
    ...mapState(["typeDataCache", "products"]),
  },

  methods: {
    ...mapMutations(["changeData", "changeProducts", "bannerDataCache"]),
    //轮播图
    getBannerData() {
      //获取vuex的banner缓存数据，如果存在缓存数据，则不发起请求，否则发起请求
      if (this.bannerDataCache.length > 0) {
        this.bannerData = this.bannerDataCache;

        return;
      }

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 300) {
            this.banners = result.data.result;

            //缓存banner数据在vuex中
            // this.$store.commit('menuModule/changeData', {
            //   key: 'bannerDataCache',
            //   value: result.data.result
            // })

            this.changeData({
              key: "bannerDataCache",
              value: result.data.result,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
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
            result.data.result.unshift({
              type: "isHot",
              typeDesc: "最新推荐",
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

    // 切换标签
    toggleType(name, title) {
      //根据类型获取商品数据
      this.getProductByType({ type: this.actName });
    },

    //根据类型获取商品数据
    getProductByType(item) {
      //在缓存获取商品数据
      if (this.products[item.type]) {
        this.productData = this.products[item.type];
        return;
      }

      this.productData = [];
      let params = {
        appkey: this.appkey,
        key: "type",
        value: item.type,
      };

      //最近推荐
      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }

      //开启加载提示
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

            //缓存商品数据
            this.changeProducts({
              type: item.type,
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
  },
};
</script>
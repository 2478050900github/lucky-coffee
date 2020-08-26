<template>
  <div class="proDetil">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="back" />
    <div class="prd-tu">
      <img class="auto-img" :src="productData.large_img" />
    </div>

    <div class="prd-content">
      <div class="prd-name clearfix">{{productData.name}}</div>

      <div class="rule-box">
        <!-- 规格 -->
        <div class="rule-b">
          <div class="rule-item clearfix" v-for="(item, index) in productData.rules" :key="index">
            <div>
              <div class="rule-title">{{item.title}}</div>
              <div class="fl rule-tags clearfix">
                <div
                  class="fl tag-item"
                  :class="{active: v.isActive}"
                  v-for="(v, i) in item.tag"
                  :key="i"
                  @click="toggleRuleTag(item, v)"
                >{{v.name}}</div>
              </div>
            </div>
          </div>
          <div class="desc-box">
            <div class="desc-title">商品描述:</div>
            <div class="desc-content">
              <div class="desc-item" v-for="(item, index) in productData.desc" :key="index">{{item}}</div>
            </div>
          </div>
        </div>

        <van-goods-action>
          <div class="price-box clearfix">
            <div class="fl price">价格：￥{{productData.price}}</div>
            <div class="fr">
              <van-stepper
                v-model="count"
                :integer="true"
                theme="round"
                button-size="22"
                disable-input
              />
            </div>
          </div>

          <van-goods-action-icon
            @click="goShopcart"
            icon="cart-o"
            :badge="shopcartCount == 0 ? '' : shopcartCount"
            text="购物车"
          />
          <van-goods-action-icon
            @click="likeAndNotLike"
            icon="like"
            :text="isLike ? '已收藏':'收藏'"
            :color="isLike ? '#dc143c':'#666'"
          />
          <van-goods-action-button text="加入购物车" @click="addShopcart" />
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/prodetail.less";
export default {
  data() {
    return {
      //商品数量
      count: 1,

      pid: "",

      //商品详情数据
      productData: {},

      isLike: false,

      //购物车种类
      shopcartCount: 0,
    };
  },
  created() {
    //截取查询参数
    this.pid = this.$route.query.pid;
    this.getPrdDetail(this.pid);
    this.findLike(this.pid);
    this.findShopcart();
  },

  computed: {
    getItems() {
      return this.items.slice(0, 1);
    },
  },
  methods: {
    //根据商品id获取商品详情数据
    getPrdDetail(pid) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          pid,
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 600) {
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);

            //商品规格
            let productRule = ["tem", "sugar", "milk", "cream"];

            let rules = [];
            productRule.forEach((v) => {
              if (data[v] != "") {
                let rule = {
                  title: data[v + "_desc"],
                  tag: [],
                };
                let tag = data[v].split(/\//);

                tag.forEach((item, i) => {
                  let t = {
                    name: item,
                    isActive: i == 0,
                  };
                  rule.tag.push(t);
                });
                rules.push(rule);
              }
            });

            data.rules = rules;
            this.productData = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 切换规格标签
    toggleRuleTag(item, v) {
      if (v.isActive) {
        return;
      }

      //查找已经激活的规格标签
      for (let i = 0; i < item.tag.length; i++) {
        if (item.tag[i].isActive) {
          item.tag[i].isActive = false;
          break;
        }
      }

      v.isActive = true;
    },

    // 收藏
    likeAndNotLike() {
      //获取token
      let tokenString = localStorage.getItem("__Tk");

      //请求路径, 收藏like, 取消收藏 notlike
      let url = this.isLike ? "/notlike" : "/like";

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 800 || result.data.code == 900) {
            //收藏成功
            this.isLike = result.data.code == 800;
            this.$toast(result.data.msg);
          } else {
            //如果token无效，则跳转到登录页面
            this.$router.push({ name: "Login" });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 是否收藏
    findLike(pid) {
      //获取token
      let tokenString = localStorage.getItem("__Tk");

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 1000) {
            this.isLike = result.data.result.length > 0;
          } else {
            this.$router.push({ name: "Login" });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //返回
    back() {
      this.$router.go(-1);
    },

    // 查询购物车商品条数
    findShopcart() {
      // 获取token
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });

      // 购物车条数
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 5000) {
            this.shopcartCount = result.data.result.length;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 加入购物车
    addShopcart() {
      let tokenString = localStorage.getItem("__Tk");

      //获取商品规格
      let rules = this.productData.rules;
      let rule = [];
      rules.forEach((v) => {
        for (let i = 0; i < v.tag.length; i++) {
          // 看哪一个规格是激活的(true)，就加到数组存储
          if (v.tag[i].isActive) {
            rule.push(v.tag[i].name);
            break;
          }
        }
      });

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          tokenString,

          //商品id
          pid: this.pid,
          //商品数量
          count: this.count,
          //商品规格
          rule: rule.join("/"),
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              this.shopcartCount++;
            }

            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //跳转到购物车
    goShopcart() {
      this.$router.push({ name: "03GWC" });
    },
  },
};
</script>
<template>
  <van-list
    class="gowuche"
    v-model="loadOptions.isLoading"
    :finished="loadOptions.isFinished"
    :finished-text="loadOptions.finishedText"
    @load="loadData"
    :offset="50"
  >
    <!-- 如果购物车没有数据，则显示空页面 -->
    <div v-if="shopcartData.length == 0">
      <van-empty description="购物车空空如也，快去下单吧~" class="custom-image" :image="url">
        <van-button color="#108C2A" class="bottom-button" :to="{name:'02DC'}">去点单</van-button>
      </van-empty>
    </div>
    <div v-else>
      <van-nav-bar @click-right="manage" :right-text="isManage ? '管理' : '完成'"></van-nav-bar>

      <!-- 商品列表 -->
      <div class="list">
        <van-swipe-cell class="list-items" v-for="(item, index) in shopcartData" :key="index">
          <div class="list-item clearfix" :class="{active:item.isCheck}">
            <!-- 单选框 -->
            <div class="fl checkbox-item">
              <van-checkbox
                v-model="item.isCheck"
                @change="simpleSelect"
                shape="round"
                checked-color="#0c34ba"
              />
            </div>
            <!-- 商品信息 -->
            <div class="fl product-info clearfix">
              <div class="product-img fl">
                <img class="auto-img" :src="item.small_img" alt />
              </div>
              <div class="fl product-content">
                <div class="product-text">
                  <div class="clearfix product-name">
                    <span class="product-title fl">{{item.name}}</span>
                    <span class="fl product-rule">{{item.rule}}</span>
                  </div>
                  <div class="product-enname">{{item.enname}}</div>
                </div>

                <div class="product-price">
                  <div class="price fl">￥{{item.price}}</div>
                  <div class="fr product-count">
                    <van-stepper
                      v-model="item.count"
                      :integer="true"
                      theme="round"
                      button-size="22"
                      disable-input
                      @change="modifyCount(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除" @click="removeShopcart([item.sid], index)" />
          </template>
        </van-swipe-cell>
      </div>

      <!-- 提交订单 -->
      <div v-if="isManage">
        <van-submit-bar
          class="submit-bar"
          :price="total"
          :disabled="isNotHasCheck"
          button-text="去结算"
          button-type="info"
          @submit="sumbitOrder"
        >
          <van-checkbox v-model="allCheck" @click="allSelect" checked-color="#0c34ba">全选</van-checkbox>
        </van-submit-bar>
      </div>
      <div v-else>
        <van-submit-bar
          class="submit-bar submit-bar-delete"
          :disabled="isNotHasCheck"
          button-text="删除"
          button-type="danger"
          @submit="removeMoreShopcart"
        >
          <van-checkbox v-model="allCheck" @click="allSelect" checked-color="#0c34ba">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
  </van-list>
</template>

<script>
import "../../assets/css/gwc.less";

export default {
  data() {
    return {
      url: require("../../assets/images/no-order.png"),
      isManage: true,
      allCheck: false,
      isHas: false,
      isNotHasCheck: true,
      shopcartData: [],
      allShopcartData: [],

      loadOptions: {
        isLoading: true, //是否处于加载状态，加载过程中不触发load事件
        isFinished: false, //是否完成加载所有数据
        finishedText: "到底啦~~~",
      },

      // 每次加载8条数据
      loadCount: 8,

      //总金额
      total: 0,
    };
  },

  created() {
    this.getShopcartData();
  },

  methods: {
    //获取购物车数据
    getShopcartData() {
      //获取token
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

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
            result.data.result.forEach((v) => {
              v.isCheck = false;
            });

            this.allShopcartData = result.data.result;

            this.shopcartData = this.allShopcartData.splice(0, this.loadCount);

            //根据截取购物车商品数量和总购物车商品数量判断是否加载完成
            if (this.allShopcartData.length > 0) {
              this.loadOptions.isLoading = false;
            } else {
              this.loadOptions.isLoading = true;
              this.loadOptions.isFinished = true;
            }

            if (this.shopcartData.length == 0) {
              this.loadOptions.finishedText = "";
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //懒加载购物车数据
    loadData() {
      setTimeout(() => {
        this.shopcartData.push(
          ...this.allShopcartData.splice(0, this.loadCount)
        );
        if (this.allShopcartData.length == 0) {
          //没有数据可加载
          this.loadOptions.isLoading = true;
          this.loadOptions.isFinished = true;
        }
      }, 1000);
    },

    //全选
    allSelect() {
      this.allShopcartData.forEach((v) => {
        v.isCheck = this.allCheck;
      });

      this.shopcartData.forEach((v) => {
        v.isCheck = this.allCheck;
      });

      this.isNotHasCheck = !this.allCheck;

      this.sum();
    },

    //单选
    simpleSelect() {
      this.sum();

      this.isNotHasCheck = true;

      for (let i = 0; i < this.shopcartData.length; i++) {
        if (this.shopcartData[i].isCheck) {
          this.isNotHasCheck = false;
          break;
        }
      }

      for (let i = 0; i < this.shopcartData.length; i++) {
        if (!this.shopcartData[i].isCheck) {
          this.allCheck = false;
          return;
        }
      }
      this.allCheck = true;
    },

    // 管理
    manage() {
      this.isManage = !this.isManage;
    },

    //修改购物车数量
    modifyCount(item) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 6000) {
            this.sum();
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //单个删除购物车
    removeShopcart(sids, index) {
      //获取购物车的sid
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,

          //sid购物车唯一标识集合字符串
          sids: JSON.stringify(sids),
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 7000) {
            this.shopcartData.splice(index, 1);
            if (this.shopcartData.length == 0) {
              this.loadOptions.finishedText = "";
            }
            this.sum();
            this.$toast.success("删除成功");
          } else {
            this.$toast.success("删除失败");
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 删除多个购物车商品
    removeMoreShopcart() {
      //获取删除购物车sid
      let sids = [];
      this.shopcartData.forEach((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,

          //sid购物车唯一标识集合字符串
          sids: JSON.stringify(sids),
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 7000) {
            // 删除购物车商品
            for (let i = this.shopcartData.length - 1; i >= 0; i--) {
              if (this.shopcartData[i].isCheck) {
                this.shopcartData.splice(i, 1);
              }
            }

            this.sum();

            if (this.shopcartData.length == 0) {
              this.allCheck = false;
              this.isManage = true;
              this.loadOptions.finishedText = "";
            }
            this.$toast.success("删除成功");
          } else {
            this.$toast.success("删除失败");
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 总金额
    sum() {
      this.total = 0;
      this.shopcartData.forEach((v) => {
        if (v.isCheck) {
          this.total += v.count * v.price * 100;
        }
      });
    },

    // 提交订单
    sumbitOrder() {
      // 已加购sid
      let sids = [];

      this.shopcartData.forEach((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      this.$router.push({ name: "upOrder", query: { sids: sids.join("-") } });
    },
  },
};
</script>
<template>
  <div class="get-order-list">
    <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="goPage('04My')" />
    <div v-if="isLogin">
      <van-tabs
        :sticky="true"
        v-model="activeName"
        @change="selectOrderStatus"
        color="green"
        line-height="2"
        title-active-color="darkgreen"
      >
        <van-tab
          :title="item.title"
          :name="item.name"
          v-for="(item, index) in tabContent"
          :key="index"
        >
          <!-- 订单卡片 -->
          <div class="order-card" v-for="(item, index) in orderNos" :key="index">
            <!-- 编号、是否收货 -->
            <div class="order-item-title">
              <div class="fl order-no">订单编号：{{item}}</div>
              <div class="fr" v-if="orderData[item].status == 2">
                <span class="confirm fl">已收货</span>
                <span class="delete fl" @click="removeOrder(item)">
                  <van-icon class="delete-icon" name="delete" />
                </span>
              </div>
              <div class="fr" v-else>
                <van-button plain type="primary" size="small" @click="recieve(item)">确认收货</van-button>
              </div>
            </div>
            <!-- 订单列表、小卡片 -->
            <van-card
              v-for="(v, i) in orderData[item].data"
              :key="i"
              :num="v.count"
              :title="v.name"
              :desc="v.enname"
              :price="v.price"
              :thumb="v.smallImg"
            >
              <template #tags>
                <van-tag plain type="success">{{v.rule}}</van-tag>
              </template>
            </van-card>

            <div class="order-total clearfix">
              <!-- 时间、合计 -->
              <div
                class="order-date fl"
              >{{orderData[item].date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
              <div class="fr clearfix">
                <span class="fl total-count">共计 {{orderData[item].count}} 件商品 合计：</span>
                <span class="fl total-price">￥{{orderData[item].total}}</span>
              </div>
            </div>
          </div>
          <van-empty v-if="orderNos.length == 0" description="没有订单数据" />
        </van-tab>
      </van-tabs>
    </div>

    <div v-else>
      <van-empty description="没有订单数据" />
    </div>
  </div>
</template>

<script>
import "../assets/css/getOrderList.less";
export default {
  data() {
    return {
      isLogin: false,

      tabContent: [
        {
          title: "全部",
          name: "0"
        },
        {
          title: "待收货",
          name: "1"
        },
        {
          title: "已收货",
          name: "2"
        }
      ],

      activeName: "0",
      isRecieve: false,

      //订单编号
      orderNos: [],

      //订单数据
      orderData: {}
    };
  },

  created() {
    if (localStorage.getItem("__Tk")) {
      this.isLogin = true;
      //获取订单商品
      this.getOrderProduct();
    }
  },

  methods: {
    //切换不同状态的商品
    selectOrderStatus(a) {
      this.getOrderProduct();
    },

    //获取订单商品
    getOrderProduct() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.activeName
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 70000) {
            //降序排序
            result.data.result.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });

            //获取所有订单编号
            let oids = [];

            result.data.result.forEach(v => {
              if (oids.indexOf(v.oid) === -1) {
                oids.push(v.oid);
              }
            });

            this.orderNos = oids;

            //按照订单编号筛选商品
            let orderData = {};
            result.data.result.forEach(v => {
              if (!orderData[v.oid]) {
                //如果当前订单数据不存在，则添加一个新的订单
                orderData[v.oid] = {
                  data: [v],
                  status: v.status,
                  date: v.createdAt,
                  count: v.count,
                  total: v.count * v.price
                };
              } else {
                orderData[v.oid].count += v.count;
                orderData[v.oid].total += v.count * v.price;
                orderData[v.oid].data.push(v);
              }
            });

            this.orderData = orderData;
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    //确认收货
    recieve(oid) {
      //订单编号
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 80000) {
            this.orderData[oid].status = 2;

            //如果是待收货，则删除页面上的订单数据
            if (this.activeName == 1) {
              let index = this.orderNos.indexOf(oid);
              this.orderNos.splice(index, 1);
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    //删除订单
    removeOrder(oid) {
      //订单编号
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 90000) {
            //删除页面的订单
            let index = this.orderNos.indexOf(oid);
            this.orderNos.splice(index, 1);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    //跳转页面
    goPage(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
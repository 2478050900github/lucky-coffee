<template>
  <div class="order">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="back" />

    <div class="order-box">
      <van-cell is-link :title="userAddress.address" @click="openPopup" />
    </div>
    <!-- 订单卡片 -->
    <div class="order-card">
      <van-card
        v-for="(item, index) in orderData"
        :key="index"
        :num="item.count"
        :title="item.name"
        :desc="item.enname"
        :price="item.price"
        :thumb="item.small_img"
      >
        <template #tags>
          <van-tag plain type="success">{{item.rule}}</van-tag>
        </template>
      </van-card>

      <div class="order-total clearfix">
        <div class="fr clearfix">
          <span class="fl total-count">共计 {{counts}} 件商品 合计：</span>
          <span class="fl total-price">￥{{total}}</span>
        </div>
      </div>
    </div>

    <van-submit-bar :price="total * 100" button-text="提交订单" button-type="info" @submit="orderSubmit" />

    <van-popup class="popup-box" v-model="isOpen" position="bottom">
      <van-address-list
        @add="addNewAddress"
        v-model="aid"
        :list="addressList"
        default-tag-text="默认"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/css/uporder.less";
export default {
  data() {
    return {
      isOpen: false,
      aid: "",
      addressList: [],
      userAddress: {
        address: "请选择收货地址",
        phone: "",
        receiver: ""
      },

      // 订单数据
      orderData: [],
      //商品总数量
      counts: 0,

      //总金额
      total: 0,
      // 已加购sid
      sids: []
    };
  },

  created() {
    //截取查询参数sids
    this.sids = this.$route.query.sids.split("-");
    this.getAddressData();
    this.getPayOrderData(this.sids);
  },

  methods: {
    openPopup() {
      this.isOpen = true;
    },

    //获取地址数据
    getAddressData() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 20000) {
            result.data.result.forEach(v => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + " " + v.addressDetail,
                isDefault: Boolean(v.isDefault)
              };

              //默认选择默认地址
              if (v.isDefault) {
                this.aid = v.aid;

                //如果存在默认地址，则默认选择默认地址
                this.userAddress.address = currentAddress.address;
              }

              this.addressList.push(currentAddress);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    //选择地址
    selectAddress(item) {
      this.isOpen = false;
      this.address = item.address;

      this.userAddress = {
        address: item.address,
        phone: item.tel,
        receiver: item.name
      };
    },

    //获取提交订单数据
    getPayOrderData(sids) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 50000) {
            result.data.result.forEach(v => {
              this.counts += v.count;
              this.total += v.count * v.price;
            });

            this.orderData = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    //提交订单
    orderSubmit() {
      if (this.userAddress.address == "请选择收货地址") {
        this.$toast("请选择收货地址");
        return;
      }

      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.userAddress.phone,
          address: this.userAddress.address,
          receiver: this.userAddress.receiver
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code === 60000) {
            this.$router.push({ name: "getMyOrderList" });
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    //新增地址
    addNewAddress() {
      this.$router.push({ name: "AddressEdit" });
    },
    //返回
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
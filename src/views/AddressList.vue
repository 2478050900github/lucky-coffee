<template>
  <div class="addList">
    <van-nav-bar title="收货地址" left-text="返回" left-arrow @click-left="back" />
    <van-address-list
      v-model="aid"
      :list="addressList"
      default-tag-text="默认"
      @add="goAddress"
      @edit="goAddress"
    />
  </div>
</template>

<script>
import "../assets/css/adsList.less";
export default {
  data() {
    return {
      aid: "1",
      //地址列表
      addressList: [],
    };
  },

  // 1.1.6
  created() {
    this.getAddressData();
  },

  methods: {
    // 1.1.4获取地址数据
    getAddressData() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 1.1.5发起请求
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: { appkey: this.appkey, tokenString },
      })
        .then((result) => {
          this.$toast.clear();
          // 1.1.6创建数据，遍历，构造对象存在数组里面，然后push
          if (result.data.code == 20000) {
            result.data.result.forEach((v) => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault),
              };

              // 默认选择默认地址
              if (v.isDefault) {
                this.aid = v.aid;
              }

              this.addressList.push(currentAddress);
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 1.1.7 新增/编辑地址, 新增地址不要携带aid, 编辑地址需要携带aid,    aid：动态参数地址id
    // 去路由加上参数 path: '/adsedit/:aid?',
    goAddress(address) {
      let o = {
        name: "AddressEdit",
      };

      if (address) {
        o.params = { aid: address.id };
      }
      this.$router.push(o);
    },
    //返回
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
<template>
  <div class="adsEdit">
    <van-nav-bar :title="!!aid ? '编辑地址' : '新增地址'" left-text="返回" left-arrow @click-left="back" />
    <!-- address-info收货人信息初始值-->
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="!!aid"
      show-set-default
      save-button-text="保存地址"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="saveAddress"
      @delete="removeAddress"
    />
  </div>
</template>

<script>
//导入地址数据
import areaList from "../assets/js/area";
import "../assets/css/adsEdit.less"

export default {
  data() {
    return {
      areaList,
      //地址信息
      addressInfo: {
        name: "",
        tel: "",
        province: "",
        city: "",
        //区县
        county: "",
        //详细地址
        addressDetail: "",
        //地区编号，地址选择
        areaCode: "",
        //默认地址
        isDefault: false
      },
      //地址id
      aid: ""
    };
  },

  created() {
    //截取路由参数 地址id: aid
    this.aid = this.$route.params.aid;
    // 判断是否新增，如果是编辑地址，则查询地址数据关联
    if (this.aid) {
      this.getAddressByAid(this.aid);
    }
  },

  methods: {
    // 1.0保存地址
    saveAddress(addressData) {

      let isSame = true;

      if (this.aid) {
        // 3.1判断用户是否修改地址-是否发起请求， 需要获取当前地址数据和查询地址数据是否一致
        for (let key in this.addressInfo) {
          // 存在不同数据,表明用户已经修改过地址
          if (this.addressInfo[key] != addressData[key]) {
            isSame = false;
          }
        }
      }

      let tokenString = localStorage.getItem("__Tk");
      //   1.1.0
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      // 3.0编辑地址
      if (this.aid) {
        // 3.2
        if (!isSame) {
          // 3.2.1复制
          let userAddress = Object.assign({}, this.addressInfo);
          // 3.2.2遍历
          for (let key in userAddress) {
            userAddress[key] = addressData[key];
          }

          // 3.2.3把布尔变成number
          userAddress.isDefault = Number(userAddress.isDefault);
          userAddress.appkey = this.appkey;
          userAddress.tokenString = tokenString;
          userAddress.aid = this.aid;

          //3.2.4发起编辑地址请求
          this.axios({
            method: "POST",
            url: "/editAddress",
            data: userAddress
          })
            .then(result => {
              this.$toast.clear();
              if (result.data.code == 30000) {
                this.$router.push({ name: "AddressList" });
              } else {
                this.$toast(result.data.msg);
              }
            })
            .catch(err => {
              this.$toast.clear();
            });
        } else {
          this.$toast.clear();
        }
      } else {
        //3.0新增地址，根据aid 来判断，如果存在就赋值，不存在就不发起请求

        // 1.1.2对应文档请求参数
        let data = {
          name: "",
          tel: "",
          province: "",
          city: "",
          county: "",
          addressDetail: "",
          areaCode: "",
          postalCode: "",
          isDefault: ""
        };

        //   1.1.3拷贝对象属性
        for (let key in data) {
          data[key] = addressData[key];
        }

        data.appkey = this.appkey;
        data.tokenString = tokenString; //存储
        data.isDefault = Number(data.isDefault); //转换成0、1

        //   1.1.1发起编辑地址请求
        this.axios({
          method: "POST",
          url: "/addAddress",
          data
        })
          .then(result => {
            this.$toast.clear();
            if (result.data.code == 9000) {
              this.$router.push({ name: "AddressList" });
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear();
          });
      }
    },

    // 2.0根据地址id获取地址数据
    getAddressByAid(aid) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      // 2.1发起请求
      this.axios({
        method: "GET",
        // url: "/findAddressByAid",
        url: ":10002/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 40000) {
            // 2.2变成布尔值
            result.data.result[0].isDefault = Boolean(
              result.data.result[0].isDefault
            );
            for (let key in this.addressInfo) {
              this.addressInfo[key] = result.data.result[0][key];
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    // 删除地址
    removeAddress() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 10000) {
            this.$router.push({ name: "AddressList" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    //返回
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<template>
  <div class="my">
<div class="self-top">
    <div v-if="isLogin">
      <div class="my-top">
        <div class="my-name">
          <van-image round width="2rem" height="2rem" :src="userInfo.userImg" />
          <div class="myname">{{userInfo.nickName}}</div>
        </div>
        <div class="self-text">简介：{{userInfo.desc == '' ? '这家伙很懒~' : userInfo.desc}}</div>
      </div>
    </div>

    <div class="login-tip" v-else @click="goPage('Login')">请登录</div>
    </div>
    
    <div class="my-cell">
      <van-cell title="我的收藏" is-link :to="{name:'Mycollege'}" />
      <van-cell title="我的订单" is-link :to="{name:'getMyOrderList'}" />
      <van-cell title="收货地址" is-link :to="{name:'AddressList'}" />
      <van-cell title="账号管理" is-link :to="{name:'ZhangHaoEdit'}" />
      <van-cell title="安全中心" is-link :to="{name:'anQuan'}" />
    </div>
  </div>
</template>

<script>
import "../../assets/css/my.less";
export default {
  data() {
    return {
      //  //上传图片大小1MB
      // maxSize: 1 * 1024 * 1024,
      show: false,
      //用户信息
      userInfo: {},
      isLogin: false
    };
  },

  created() {
    this.getUserInfo();

    if (localStorage.getItem("__Tk")) {
      this.isLogin = true;
    }
  },
  methods: {
    goPage(name) {
      if (name === "Login") {
        this.$router.push({ name });
      } else {
        if (!this.isLogin) {
          this.$toast("请先登录");
        } else {
          this.$router.push({ name });
        }
      }
    },
    showPopup() {
      this.show = true;
    },
    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    //获取上传文件的base64
    uploadFile(file) {
      //获取图片base64
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );

      //获取图片类型
      let imgType = file.file.type.split("/")[1];
      let tokenString = localStorage.getItem("__Tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  }
};
</script>
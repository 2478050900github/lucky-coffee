<template>
  <div class="account">
    <van-nav-bar title="账号管理" left-text="返回" left-arrow @click-left="back" />

    <van-cell-group>
      <van-cell class="v-cell" title="头像">
        <div class="clearfix">
          <div class="fr user-img">
            <img class="auto-img" :src="userInfo.userImg" alt />
            <van-uploader class="upload-box" :after-read="uploadFile" />
          </div>
        </div>
      </van-cell>
      <van-cell class="v-cell" title="手机号" :value="userInfo.phone"></van-cell>
      <van-cell class="v-cell" title="昵称">
        <div class="clearfix">
          <div class="fr">
            <van-field
              @blur="updateUserInfo({key: 'nickName', value: userInfo.nickName, url: '/updateNickName'})"
              class="v-filed"
              v-model="userInfo.nickName"
              input-align="right"
            />
          </div>
        </div>
      </van-cell>
      <van-cell>
        <div class="clearfix">
          <div class="fl v-cell-text">简介</div>
          <div class="fl v-cell-textarea">
            <textarea
              @change="updateUserInfo({key: 'desc', value: userInfo.desc, url: '/updateDesc'})"
              class="textarea"
              v-model="userInfo.desc"
            ></textarea>
          </div>
        </div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import "../assets/css/myZhangHu.less";
export default {
  data() {
    return {
      userInfo: {}
    };
  },

  created() {
    //获取用户信息
    this.getUserInfo();
  },

  methods: {
    // 获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == "B001") {
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
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == "H001") {
            this.userInfo.userImg = result.data.userImg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    // 修改昵称, 简介
    updateUserInfo(o) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: o.url,
        data: {
          appkey: this.appkey,
          tokenString,
          [o.key]: o.value
        }
      })
        .then(result => {
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    back() {
      this.$router.go(-1);
    }
  }
};
</script>
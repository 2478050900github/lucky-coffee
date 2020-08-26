<template>
  <div class="login">
    <van-nav-bar title="Luckin Coffee">
      <template #left>
        <i class="iconfont icon-icon_luckin"></i>
      </template>
    </van-nav-bar>
    <div class="welcome">
      <h1>欢迎回来！</h1>
      <h2>Please login to your accounts</h2>
    </div>

    <van-form @submit="login">
      <van-field
        label="账号"
        v-model="userInfo.phone"
        type="tel"
        left-icon="smile-o"
        placeholder="请输入手机号..."
        maxlength="11"
      />
      <van-field
        v-model="userInfo.password"
        :type="isOpen ? 'text' : 'password'"
        label="密码"
        placeholder="请输入登录密码..."
        left-icon="goods-collect-o"
        :right-icon="isOpen ? 'eye-o' : 'closed-eye'"
        @click-right-icon="isOpenPasswd"
        maxlength="16"
      />
      <div class="forget-pass fr" @click="goPage('ForgetPass')">忘记密码？</div>

      <div class="login-btn">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
      <!-- 弹出注册 -->
      <div class="register" @click="openPop">注册</div>
      <van-popup class="popup-box" v-model="isShowRegister" position="bottom" closeable>
        <div class="register-list">
          <h1>注册</h1>
          <van-form @submit="userRegister">
            <van-field
              v-model="userInfo.nickName"
              label="昵称"
              type="text"
              left-icon="smile-o"
              placeholder="请设置您的昵称..."
              maxlength="8"
            />
            <van-field
              v-model="userInfo.phone"
              label="手机号"
              type="tel"
              left-icon="phone-o"
              placeholder="请输入手机号..."
              maxlength="11"
            />
            <van-field
              v-model="userInfo.password"
              :type="isOpen ? 'text' : 'password'"
              label="密码"
              placeholder="请设置登录密码..."
              left-icon="goods-collect-o"
              :right-icon="isOpen ? 'eye-o' : 'closed-eye'"
              @click-right-icon="isOpenPasswd"
              maxlength="16"
            />

            <div class="register-btn">
              <van-button block type="info" native-type="submit">立即注册</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </van-form>
  </div>
</template>

<script>
// 导入样式
import "../assets/css/login.less";
//导入验证表单模块
import validForm from "../assets/js/FormValidation";

export default {
  // 注入依赖，页面刷新
  inject: ["reload"],

  // this.reload();
  data() {
    return {
      userInfo: {
        phone: "",
        password: "",
      },
      isOpen: false,
      isShowRegister: false,
    };
  },
  methods: {
    goPage(name) {
      this.$router.push({ name });
    },
    // 弹出注册
    openPop() {
      this.isShowRegister = true;
    },
    isOpenPasswd() {
      this.isOpen = !this.isOpen;
    },

    //登录
    login() {
      if (validForm.validUserForm(this.userInfo)) {
        let data = Object.assign({}, this.userInfo);
        data.appkey = this.appkey;

        this.$toast.loading({
          message: "加载中...",
          // 防止点击穿透
          forbidClick: true,
          duration: 0,
        });

        //发起请求
        this.axios({
          method: "POST",
          url: "/login",
          data,
        })
          .then((result) => {
            this.$toast.clear();
            if (result.data.code == 200) {
              localStorage.setItem("__Tk", result.data.token);
              //跳转到页面
              this.$router.push({ name: "01SY" });
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
    // 1.3注册提交
    userRegister() {
      // if (validForm.validUserForm(this.userInfo, this)) {
      // 在validForm.js导入vant框架后的优化↓
      if (validForm.validUserForm(this.userInfo)) {
        // 1.35直接在data里面传上面的数据，会覆盖，所以再复制一个data对象，再合并，这样就将上一步的data传递过来了
        let data = Object.assign({}, this.userInfo);
        // 请求密钥→配合main.js[1.39]
        // data.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";
        data.appkey = this.appkey;

        // 1.37开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: "/register",
          // post传递参数需要写在data（GET→传递在参数pramas里面）
          data,
        })
          .then((result) => {
            this.$toast.clear();
            if (result.data.code == 100) {
              // 注册成功--刷新当前页面
              // 1.37开启加载提示
              this.$toast.loading({
                message: "注册成功...",
                forbidClick: true,
              });
              this.reload();
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
  },
};
</script>
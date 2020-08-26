<template>
  <div class="myCollege">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="back" />
    <div class="like-box clearfix" v-if="likeData.length > 0">
      <van-swipe-cell v-for="(item, index) in likeData" :key="index">
        <van-card
          :price="item.price"
          :title="item.name"
          :desc="item.enname"
          :thumb="item.smallImg"
        />
        <template #right>
          <van-button
            square
            text="删除"
            type="danger"
            @click="removeLike(item.pid, index)"
            class="delete-button"
          />
        </template>
      </van-swipe-cell>
    </div>

    <div v-else>
      <van-empty description="还没有收藏~~~" />
    </div>
  </div>
</template>

<script>
import "../assets/css/myCollege.less";
export default {
  data() {
    return {
      // 已收藏商品数据
      likeData: []
    };
  },

  created() {
    this.getLikeData();
  },

  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },

    // 获取已收藏商品数据
    getLikeData() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 2000) {
            this.likeData = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    //根据商品id查看商品详情
    goDetail(pid) {
      this.$router.push({ name: "ProDetail", query: { pid } });
    },

    // 删除
    removeLike(pid, index) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 900) {
            this.likeData.splice(index, 1);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  }
};
</script>

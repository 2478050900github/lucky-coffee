"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = void 0;
var routes = [{
  // 登录
  path: '/login',
  name: 'Login',
  component: function component(r) {
    return require(['../views/Login.vue'], r);
  }
}, {
  path: '/main',
  name: 'Main',
  component: function component(r) {
    return require(['../views/Main.vue'], r);
  },
  children: [{
    path: '01sy',
    name: '01SY',
    component: function component(r) {
      return require(['../views/TabbarToggle/01SY.vue'], r);
    }
  }, {
    path: '02dc',
    name: '02DC',
    component: function component(r) {
      return require(['../views/TabbarToggle/02DC.vue'], r);
    }
  }, {
    path: '03gwc',
    name: '03GWC',
    component: function component(r) {
      return require(['../views/TabbarToggle/03GWC.vue'], r);
    }
  }, {
    path: '04my',
    name: '04My',
    component: function component(r) {
      return require(['../views/TabbarToggle/04My.vue'], r);
    }
  }, {
    path: '*',
    redirect: {
      name: '01sy'
    }
  }]
}, {
  // 详情
  path: '/xijie',
  name: 'ProDetail',
  component: function component(r) {
    return require(['../views/ProDetail.vue'], r);
  }
}, {
  // 订单页面
  path: '/uporder',
  name: 'upOrder',
  component: function component(r) {
    return require(['../views/upOrder.vue'], r);
  }
}, {
  // 编辑地址
  path: '/adsedit/:aid?',
  name: 'AddressEdit',
  component: function component(r) {
    return require(['../views/AddressEdit.vue'], r);
  }
}, {
  // 地址列表
  path: '/adsList',
  name: 'AddressList',
  component: function component(r) {
    return require(['../views/AddressList.vue'], r);
  }
}, {
  // 已提交的订单列表
  path: '/getOrd',
  name: 'getMyOrderList',
  component: function component(r) {
    return require(['../views/getMyOrderList.vue'], r);
  }
}, {
  // 账号管理
  path: '/zhanghao',
  name: 'ZhangHaoEdit',
  component: function component(r) {
    return require(['../views/ZhangHaoEdit.vue'], r);
  }
}, {
  // 我的收藏
  path: '/myLove',
  name: 'Mycollege',
  component: function component(r) {
    return require(['../views/Mycollege.vue'], r);
  }
}, {
  // 安全
  path: '/aq',
  name: 'anQuan',
  component: function component(r) {
    return require(['../views/anQuan.vue'], r);
  }
}, {
  path: '*',
  redirect: {
    name: 'Login'
  }
}];
exports.routes = routes;
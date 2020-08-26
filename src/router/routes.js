export const routes = [
  {
    // 登录
    path: '/login',
    name: 'Login',
    component: r => require(['../views/Login.vue'], r)
  },
  {
    path: '/main', name: 'Main', component: r => require(['../views/Main.vue'], r),
    children: [
      { path: '01sy', name: '01SY', component: r => require(['../views/TabbarToggle/01SY.vue'], r), },
      { path: '02dc', name: '02DC', component: r => require(['../views/TabbarToggle/02DC.vue'], r), },
      { path: '03gwc', name: '03GWC', component: r => require(['../views/TabbarToggle/03GWC.vue'], r), },
      { path: '04my', name: '04My', component: r => require(['../views/TabbarToggle/04My.vue'], r), },
      { path: '*', redirect: { name: '01sy' } }
    ]
  },
  {
    // 详情
    path: '/xijie',
    name: 'ProDetail',
    component: r => require(['../views/ProDetail.vue'], r)
  },
  {
    // 订单页面
    path: '/uporder',
    name: 'upOrder',
    component: r => require(['../views/upOrder.vue'], r)
  },
  {
    // 编辑地址
    path: '/adsedit/:aid?',
    name: 'AddressEdit',
    component: r => require(['../views/AddressEdit.vue'], r)
  },
  {
    // 地址列表
    path: '/adsList',
    name: 'AddressList',
    component: r => require(['../views/AddressList.vue'], r)
  },
  {
    // 已提交的订单列表
    path: '/getOrd',
    name: 'getMyOrderList',
    component: r => require(['../views/getMyOrderList.vue'], r)
  },
  {
    // 账号管理
    path: '/zhanghao',
    name: 'ZhangHaoEdit',
    component: r => require(['../views/ZhangHaoEdit.vue'], r)
  },
  {
    // 我的收藏
    path: '/myLove',
    name: 'Mycollege',
    component: r => require(['../views/Mycollege.vue'], r)
  },
  {
    // 安全
    path: '/aq',
    name: 'anQuan',
    component: r => require(['../views/anQuan.vue'], r)
  },
  {
    path: '*', redirect: { name: 'Login' }
  }
]
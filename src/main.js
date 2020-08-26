import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'
// 引入阿里巴巴图标
import './assets/icon/iconfont.css'
import './assets/icon/iconfont'

//导入vant框架
import {
  NavBar,
  Image as VanImage,
  Icon,
  Swipe, SwipeItem,
  Lazyload,
  Sidebar, SidebarItem,
  Notify,
  Tabbar, TabbarItem,
  Form,
  Toast,
  Empty,
  Card,
  Col, Row,
  Cell, CellGroup,
  Area,
  AddressEdit,
  AddressList,
  SubmitBar,
  ActionSheet,
  Popup,
  GoodsAction, GoodsActionIcon, GoodsActionButton,
  Stepper,
  Field,
  Button,
  SwipeCell,
  Checkbox,
  List,
  Tabs,
  Tab,
  Uploader,
  Tag,
} from 'vant'

//导入用于设置 rem 基准值模块，默认情况下，设置在iphone6屏幕下的html元素的字体大小为37.5px
import 'lib-flexible'

//注册vant框架的组件
Vue
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Popup)
  .use(Tabs)
  .use(Tab)
  .use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(VanImage)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Notify)
  .use(Card)
  .use(Col)
  .use(Row)
  .use(Area)
  .use(ActionSheet)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(Tag)
  .use(Stepper);


//注册axios
Vue.use(VueAxios, axios)

//配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//发起请求之前处理
axios.interceptors.request.use(config => {
  //  

  if (config.method == 'post') {
    let paramsString = '';
    //post请求参数序列化，转成一个字符串
    for (let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&'
    }

    //  

    config.data = paramsString.slice(0, -1);

    //  
  }

  return config;
})

Vue.config.productionTip = false

//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

//全局过滤器
Vue.filter('formatDate', (value, format) => {
  //value: 2020-07-08T02:40:51.000Z
  //format: yyyy-MM-dd hh:mm:ss
  let current = new Date(value);

  //获取年份
  let year = current.getFullYear();
  //  
  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    let yearContent = RegExp.$1;
    //  

    format = format.replace(yearContent, year);
  }

  //处理月日时分秒
  let dateObject = {
    M: current.getMonth() + 1,
    d: current.getDate(),
    h: current.getHours(),
    m: current.getMinutes(),
    s: current.getSeconds()
  };

  for (let key in dateObject) {
    //创建动态正则表达式
    let reg = new RegExp(`(${key}+)`)
    //  
    if (reg.test(format)) {
      //获取匹配组的内容, RegExp.$n必须需要test验证通过可以获取
      let content = RegExp.$1;
      //  

      //控制补零
      let value = dateObject[key] >= 10 ? dateObject[key] : content.length == 2 ? '0' + dateObject[key] : dateObject[key];
      format = format.replace(content, value);
    }
  }

  return format;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

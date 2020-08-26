import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import Router from 'vue-router'
Vue.use(VueRouter);

// 路由冗余
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

export default new VueRouter({
  routes
})
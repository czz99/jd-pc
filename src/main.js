// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Router from 'vue-router'
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// 如果没有登录（session中没有userInfo），那么路由跳转时自动跳转到登录页面
router.beforeEach((to, from, next) => {
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  if (userInfo && userInfo.access_token) {
    next()
  } else if (to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})

// 解决点击底部导航栏出现的路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

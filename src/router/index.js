import Vue from 'vue'
import Router from 'vue-router'

// 原因在于Vue-router在3.1之后把$router.push()方法改为了Promise。所以假如没有回调函数，错误信息就会交给全局的路由错误处理，因此就会报上述的错误。
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/pages/login.vue')
    },
    {
      path: '/home',
      name: 'home',
      // redirect: '/user-manage',
      // 组件打包在异步块 (chunk) 中
      component: () => import(/* webpackChunkName: "home" */ '@/pages/home.vue'),
      children: [
        {
          path: '/user-manage',
          name: 'user-manage',
          component: () => import(/* webpackChunkName: "user-manage" */ '@/pages/user-manage/index.vue')
        },
        {
          path: '/menu-manage',
          name: 'menu-manage',
          component: () => import(/* webpackChunkName: "menu-manage" */ '@/pages/menu-manage/index.vue')
        },
        {
          path: '/comm-manage',
          name: 'comm-manage',
          component: () => import(/* webpackChunkName: "comm-manage" */ '@/pages/comm-manage/index.vue')
        },
        {
          path: '/home-pic-manage',
          name: 'home-pic-manage',
          component: () => import(/* webpackChunkName: "home-pic-manage" */ '@/pages/home-pic-manage/index.vue')
        },
        {
          path: '/comm-classify-manage',
          name: 'comm-classify-manage',
          component: () => import(/* webpackChunkName: "comm-classify-manage" */ '@/pages/comm-classify-manage/index.vue')
        },
        {
          path: '/client-manage',
          name: 'client-manage',
          component: () => import(/* webpackChunkName: "client-manage" */ '@/pages/client-manage/index.vue')
        },
        {
          path: '/order-manage',
          name: 'order-manage',
          component: () => import(/* webpackChunkName: "order-manage" */ '@/pages/order-manage/index.vue')
        },
        {
          path: '/hot-comm-manage',
          name: 'hot-comm-manage',
          component: () => import(/* webpackChunkName: "hot-comm-manage" */ '@/pages/hot-comm-manage/index.vue')
        },
        {
          path: '/shop-info-manage',
          name: 'shop-info-manage',
          component: () => import(/* webpackChunkName: "shop-info-manage" */ '@/pages/shop-info-manage/index.vue')
        },
        {
          path: '/driver-info-manage',
          name: 'driver-info-manage',
          component: () => import(/* webpackChunkName: "driver-info-manage" */ '@/pages/driver-info-manage/index.vue')
        }
      ]
    }
  ]
})

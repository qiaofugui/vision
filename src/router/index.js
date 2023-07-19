import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // {
  //   path: '',
  //   name: '',
  //   component: () => import(/* webpackChunkName: "about" */ '')
  // },
  {
    path: '/sellerpage',
    name: 'sellerPage',
    component: () => import(/* webpackChunkName: "about" */ '@/views/SellerPage.vue')
  },
  {
    path: '/trendpage',
    name: 'TrendPage',
    component: () => import(/* webpackChunkName: "about" */ '@/views/TrendPage.vue')
  },
  {
    path: '/mappage',
    name: 'MapPage',
    component: () => import(/* webpackChunkName: "about" */ '@/views/MapPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

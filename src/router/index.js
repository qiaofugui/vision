import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // {
  //   path: '',
  //   name: '',
  //   component: () => import(/* webpackChunkName: "about" */ '')
  // },
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import(/* webpackChunkName: "about" */ '@/views/ScreenPage.vue')
  }
  // {
  //   path: '/seller',
  //   name: 'Seller',
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/SellerPage.vue')
  // },
  // {
  //   path: '/trend',
  //   name: 'Trend',
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/TrendPage.vue')
  // },
  // {
  //   path: '/map',
  //   name: 'Map',
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/MapPage.vue')
  // },
  // {
  //   path: '/rank',
  //   name: 'Rank',
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/RankPage.vue')
  // },
  // {
  //   path: '/hot',
  //   name: 'Hot',
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/HotPage.vue')
  // },
  // {
  //   path: '/stock',
  //   name: 'Stock',
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/StockPage.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

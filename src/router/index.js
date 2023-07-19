import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // {
  //   path: '',
  //   name: '',
  //   component: () => import(/* webpackChunkName: "about" */ '')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

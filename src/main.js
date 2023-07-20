import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import http from '@/utils/http.js'
// 全局样式文件
import '@/assets/css/global.less'
// 字体文件
import '@/assets/font/iconfont.css'

import SocketService from './utils/socket_service'

import dayjs from 'dayjs'

const pinia = createPinia()
const app = createApp(App)

// 将全局的 echarts 对象挂载到 Vue 对象原型上
app.config.globalProperties.$echarts = window.echarts

app.config.globalProperties.$http = http

// 对服务端进行 websocket 连接
SocketService.Instance.connect()
app.config.globalProperties.$socket = SocketService.Instance

app.config.globalProperties.$dayjs = dayjs

app.use(pinia)
app.use(router)
app.mount('#app')

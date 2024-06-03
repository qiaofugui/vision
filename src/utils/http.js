// 基于 axios 封装，网络请求的函数
import axios from 'axios'

export const baseURL = 'http://127.0.0.1:18010/api'

// axios.create() 创建一个带配置项的自定义 axios 函数
const http = axios.create({
  baseURL
})

// 定义请求拦截器
http.interceptors.request.use(function (config) {
  // 在请求前会触发一次
  return config
}, function (error) {
  // 在请求发起前的代码，如果有异常，会直接进入这里
  return Promise.reject(error)
})

// 定义响应拦截器
http.interceptors.response.use(function (response) {
  // 响应状态码为 2xx 时触发成功的回调，形参中 response 是 ”成功的结果“
  return response
}, function (error) {
  return Promise.reject(error)
})

// 导出 axios 自定义函数
export default http

/*
  定义类 SocketService，并定义成单例设计模式
  定义连接服务器的方法 connect
    创建 WebSocket 对象，连接服务器
    在 main.js 中调用此方法
  监听事件
    onopen 事件
    onclose 事件
    onmessage 事件
  存储回调函数
  接收数据的处理
  定义发送数据的方法
  挂载 SocketService 到 Vue 原型上
*/

export default class SocketService {
  // 单例
  static instance = null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务器连接的对象
  ws = null

  // 定义连接服务器的方法
  connect () {
    // 连接服务器
    if (!window.WebSocket) return console.log('您的浏览器不支持WebSocket')
    this.ws = new WebSocket('ws://localhost:9999')

    // 连接成功事件
    this.ws.onopen = () => {
      console.log('连接服务器成功')
    }
    // 连接失败事件
    this.ws.onclose = () => {
      console.log('连接服务器失败')
    }
    // 得到服务器发送过来的数据
    this.ws.onmessage = msg => {
      console.log('从服务器获取到了数据')
      console.log(msg.data)
    }
  }
}

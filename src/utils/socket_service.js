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
    callBackMapping = {}
    registerCallBack(socketType, callBack)
    unRegisterCallBack(socketType){}
  接收数据的处理
    onmessage 调用之前存储的回调函数，传递数据
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

  // 存储回调函数
  callBackMapping = {}

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
      // console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  // 取消某个回调函数
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法
  send (data) {
    this.ws.send(JSON.stringify(data))
  }
}

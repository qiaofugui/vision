const path = require('path')
const fileUtils = require('../utils/file_utils')
const WebSocket = require('ws')
// 创建WebSocket服务端的对象, 绑定的端口号是18011
const wss = new WebSocket.Server({
  port: 18011
})
// 服务端开启了监听
module.exports.listen = () => {
  // 对客户端的连接事件进行监听
  // client:代表的是客户端的连接socket对象
  wss.on('connection', client => {
    console.log('有客户端连接成功了...')
    // 对客户端的连接对象进行message事件的监听
    // msg: 由客户端发给服务端的数据
    client.on('message', async (msg, isBinary) => {
      console.log('客户端发送数据给服务端了: ' + msg, isBinary)
      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        let filePath = '../data/' + payload.chartName + '.json'
        // payload.chartName // trend seller map rank hot stock
        filePath = path.join(__dirname, filePath)
        const ret = await fileUtils.getFileJsonData(filePath)
        // 需要在服务端获取到数据的基础之上, 增加一个data的字段
        // data所对应的值,就是某个json文件的内容
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        // 原封不动的将所接收到的数据转发给每一个处于连接状态的客户端
        // wss.clients // 所有客户端的连接
        wss.clients.forEach(client => {
          client.send(msg, { binary: isBinary })
        })
      }
      // 由服务端往客户端发送数据
      // client.send('hello socket from backend')
    })
  })
}













// const path = require('path')
// const fileUtils = require('../utils/file_utils')

// const WebSocket = require('ws')
// // 创建 WebSocket 服务端的对象，绑定端口号为 9999
// const wss = new WebSocket.Server({
//   port: 9999
// })

// // 服务端开启了监听
// module.exports.listen = () => {
//   // 监听连接事件
//   // client: 代表的是客户端的连接 socket 对象
//   wss.on('connection', (client) => {
//     console.log('有客户端连接成功了')

//     // 监听接收数据事件
//     // msg: 代表的是客户端发送给服务器的数据
//     client.on('message', async (msg) => {
//       console.log('客户端发送数据给服务端了' + msg)

//       let payload = JSON.parse(msg)
//       const action = payload.action

//       if (action === 'getData') {
//         // payload.charName  //  trend seller map rank hot stock
//         let filePath = '../data/' + payload.chartName + '.json'
//         filePath = path.join(__dirname, filePath)
//         // 读取文件内容，将读取的内容，响应给客户端
//         const res = await fileUtils.getFileJsonData(filePath)
//         // 需要在服务端获取到数据的基础之上，增加一个 data 的字段
//         // data 对应的值，就是某个 json 文件的内容
//         payload.data = res
//         client.send(JSON.stringify(payload))
//       } else {
//         // 原封不动的将所接收到的数据转发给每一个处于连接状态的客户端
//         // wss.clients 代表所有客户端的连接
//         wss.clients.forEach((client) => {
//           client.send(msg)
//         })
//       }

//       // 服务端向客户端发送数据
//       // client.send('hello socket from backend')
//     })
//   })
// }



// /*
// 前后端数据字段约定
// 服务端接收数据字段约定
//   {
//     "action": "getData",
//     "socketType": "trendData",
//     "chartName": "trend",
//     "value": ""
//   }

//   action 代表某项行为，可选值为：
//       getData: 获取图表数据
//       fullScreen: 全屏事件
//       themeChange: 主题切换事件
//   socketType 代表某个图表类型，可选值为：
//       trendData
//       sellerData
//       mapData
//       rankData
//       hotData
//       stockData
//       fullScreen
//       themeChange
//   chartName 代表某个图表的名称，可选值为：
//       trend
//       seller
//       map
//       rank
//       hot
//       stock
//     如果是主题切换事件，可不传此值，因为主题切换是所有组件都要切换；而全屏事件和获取数据是需要标识出是那个图表的
//   value 代表具体的数据值
//     如果是全屏事件，value 为 true 或 false
//     如果是主题切换事件，value 为 chalk 或 vintage

// 服务端发送数据字段约定
//   接收到 action 为 getData 时：
//     1.取出数据中的 chartName 字段
//     2. 拼接 json 文件的路径
//     3. 读取 json 文件中的数据
//     4. 在接收的数据基础之上，增加 data 字段，值就是读取的文件内容
//       {
//         "action": "getData",
//         "socketType": "trendData",
//         "chartName": "trend",
//         "value": "",
//         "data": "读取的 json 文件内容"
//       }
//   接收到 action 不为 getData 时：
//     原封不动的将客户端接收到的数，转发给每一个处于链接状态的客户端
// */
<script setup>
import { getCurrentInstance, onMounted, ref, onUnmounted } from 'vue'
const { proxy } = getCurrentInstance()

// 图表实例
let echartInstance = null
// 图表 dom 元素
const stockRef = ref(null)
// 图表数据
const allData = ref(null)

const currentIndex = ref(0)
const timerId = ref(null)

onMounted(() => {
  initChart()
  // getData()
})
// 窗口变化
onMounted(() => {
  window.addEventListener('resize', screenAdapter)
  // 开始也要执行一次
  screenAdapter()
})

// 初始化图表
const initChart = () => {
  echartInstance = proxy.$echarts.init(stockRef.value, 'chalk')
  const initOption = {
    title: {
      text: '▎ 库存和销量分析',
      top: 20,
      left: 20
    }
  }
  echartInstance.setOption(initOption)

  // 对图标对象进行数据事件的监听
  echartInstance.on('mouseover', () => {
    console.log('mouseover')
    clearInterval(timerId.value)
  })
  echartInstance.on('mouseout ', () => {
    console.log('mouseout')
    startInterval()
  })
}
// 获取图表数据
const getData = async (res) => {
  // const { data: res } = await proxy.$http.get('/stock')
  console.log(res)
  allData.value = res
  updateChart()
  startInterval()
}
// 更新图表
const updateChart = () => {
  // 处理数据
  const centerArr = [
    ['18%', '40%'],
    ['50%', '40%'],
    ['82%', '40%'],
    ['34%', '75%'],
    ['66%', '75%']
  ]
  const colorArr = [
    ['#4FF778', '#0BA82C'],
    ['#E5DD45', '#E8B11C'],
    ['#E8821C', '#E55445'],
    ['#5052EE', '#AB6EE5'],
    ['#23E5E5', '#2E72BF']
  ]

  const start = currentIndex.value * 5
  const end = (currentIndex.value + 1) * 5

  const showData = allData.value.slice(start, end)
  const seriesArr = showData.map((item, index) => ({
    type: 'pie',
    radius: [110, 100],
    center: centerArr[index],
    hoverAnimation: false, // 关闭鼠标移入时的动画效果
    labelLine: {
      show: false // 关闭指示线
    },
    label: {
      position: 'center',
      color: colorArr[index][0]
    },
    data: [
      {
        value: item.sales,
        name: `${item.name} \n ${item.sales}`,
        itemStyle: {
          color: new proxy.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: colorArr[index][0]
            },
            {
              offset: 1,
              color: colorArr[index][1]
            }
          ])
        }
      },
      {
        value: item.stock,
        itemStyle: {
          color: '#333843'
        }
      }
    ]
  }))
  const dataOption = {
    series: seriesArr
  }
  echartInstance.setOption(dataOption)
}
// 浏览器屏幕发生变化调用，屏幕适配
const screenAdapter = () => {
  const titleFontSize = stockRef.value.offsetWidth / 100 * 3.6
  const innerRadius = titleFontSize * 2
  const outerRadius = innerRadius * 1.12
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        type: 'pie',
        radius: [outerRadius, innerRadius],
        label: {
          fontSize: titleFontSize / 2
        }
      },
      {
        type: 'pie',
        radius: [outerRadius, innerRadius],
        label: {
          fontSize: titleFontSize / 2
        }
      },
      {
        type: 'pie',
        radius: [outerRadius, innerRadius],
        label: {
          fontSize: titleFontSize / 2
        }
      },
      {
        type: 'pie',
        radius: [outerRadius, innerRadius],
        label: {
          fontSize: titleFontSize / 2
        }
      },
      {
        type: 'pie',
        radius: [outerRadius, innerRadius],
        label: {
          fontSize: titleFontSize / 2
        }
      }
    ]
  }
  echartInstance.setOption(adapterOption)
  echartInstance.resize()
}

// 启动定时器
const startInterval = () => {
  if (timerId.value) clearInterval(timerId.value)
  timerId.value = setInterval(() => {
    currentIndex.value++
    if (currentIndex.value > 1) currentIndex.value = 0
    updateChart()
  }, 3000)
}

onUnmounted(() => {
  // 取消监听
  window.removeEventListener('resize', screenAdapter)

  clearInterval(timerId.value)
})

// 组件创建注册回调函数
proxy.$socket.registerCallBack('stockData', getData)
// 组件销毁注销回调函数
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('stockData')
})
onMounted(() => {
  // 发送数据给服务器
  proxy.$socket.send({
    action: 'getData',
    socketType: 'stockData',
    chartName: 'stock',
    value: ''
  })
})

</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="stockRef"></div>
  </div>
</template>

<style lang="less" scoped></style>

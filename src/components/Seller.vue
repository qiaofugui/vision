<script setup>
import { getCurrentInstance, onMounted, ref, onUnmounted, defineExpose, computed, watch } from 'vue'
import { useStoreStore } from '@/store/index.js'

import { getThemeValue } from '@/utils/theme_utils'

const { proxy } = getCurrentInstance()

const store = useStoreStore()

// 监听主题变化
const theme = computed(() => store.theme)
watch(
  () => theme.value,
  (newValue, oldValue) => {
    console.log('主题切换了')
    // 1.销毁图表实例
    echartInstance.dispose()
    // 2.重新初始化图表实例
    initChart()
    // 3.屏幕适配
    screenAdapter()
    // 4.更新图表数据
    updateChart()
  }
)

// 图表 dom 元素
const sellerRef = ref(null)
// 图表的实例 --- 大坑不要用响应式定义实例
let echartInstance = null
// 服务器返回的图表数据
const allData = ref(null)

const limit = ref({
  // 当前显示页数
  currentPage: 1,
  // 一共多少页
  totalPage: 0,
  // 定时器标识
  timerId: null
})

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

// 初始化 echartInstance 对象
const initChart = () => {
  echartInstance = proxy.$echarts.init(sellerRef.value, theme.value)

  const option = {
    title: {
      text: '▎ 商家销量统计',
      textStyle: {
        fontSize: 66
      },
      left: 20,
      top: 20
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '6%',
      bottom: '3%',
      // 是否包含坐标轴的刻度标签
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        z: 0,
        lineStyle: {
          color: 'rgba(45, 52, 67, 0.3)',
          width: 66
        }
      }
    },
    series: [
      {
        type: 'bar',
        // 柱子的宽度
        barWidth: 66,
        label: {
          show: true,
          position: 'right'
        },
        itemStyle: {
          barBorderRadius: [0, 33, 33, 0],
          // 指明颜色渐变的方向
          // 指明不同百分比之下颜色的值
          color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
            // 0% 处的颜色
            { offset: 0, color: '#5052EE' },
            // 100% 处的颜色
            { offset: 1, color: '#AB6EE5' }
          ])
        }
      }
    ]
  }

  echartInstance.setOption(option)

  // 对图标对象进行数据事件的监听
  echartInstance.on('mouseover', () => {
    console.log('mouseover')
    clearInterval(limit.value.timerId)
  })
  echartInstance.on('mouseout ', () => {
    console.log('mouseout')
    startInterval()
  })
}
// 获取服务器数据
const getData = async (res) => {
  // const { data: res } = await proxy.$http.get('/seller')
  console.log(res)
  allData.value = res
  // 从小到大排序
  allData.value.sort((a, b) => a.value - b.value)
  // 每五个元素显示一页
  limit.value.totalPage = allData.value.length % 5 === 0 ? allData.value.length / 5 : allData.value.length / 5 + 1
  updateChart()
  // 启动定时器
  startInterval()
}
// 更新图表
const updateChart = () => {
  const start = (limit.value.currentPage - 1) * 5
  const end = limit.value.currentPage * 5
  const showData = allData.value.slice(start, end)
  const dataOption = {
    yAxis: {
      data: showData.map(item => item.name)
    },
    series: [
      {
        data: showData.map(item => item.value),
        label: {
          textStyle: {
            color: getThemeValue(theme.value).titleColor
          }
        }
      }
    ]
  }
  echartInstance.setOption(dataOption)
}
// startInterval
const startInterval = () => {
  if (limit.value.timerId) clearInterval(limit.value.timerId)
  limit.value.timerId = setInterval(() => {
    limit.value.currentPage++
    if (limit.value.currentPage > limit.value.totalPage) {
      limit.value.currentPage = 1
    }
    updateChart()
  }, 3000)
}
// 浏览器屏幕发生变化调用，屏幕适配
const screenAdapter = () => {
  const titleFontSize = sellerRef.value.offsetWidth / 100 * 3.6
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: titleFontSize
        }
      }
    },
    series: [
      {
        // 柱子的宽度
        barWidth: titleFontSize,
        label: {
          textStyle: {
            fontSize: titleFontSize / 1.5
          }
        },
        itemStyle: {
          barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
        }
      }
    ]
  }
  echartInstance.setOption(adapterOption)
  echartInstance.resize()
}

onUnmounted(() => {
  // 销毁定时器
  clearInterval(limit.value.timerId)
  // // 销毁图表实例
  // echartInstance.dispose()
  // 移除窗口变化事件
  window.removeEventListener('resize', screenAdapter)
})

// 组件创建注册回调函数
proxy.$socket.registerCallBack('sellerData', getData)
// 组件销毁注销回调函数
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('sellerData')
})
onMounted(() => {
  // 发送数据给服务器
  proxy.$socket.send({
    action: 'getData',
    socketType: 'sellerData',
    chartName: 'seller',
    value: ''
  })
})

// 让父组件可拿到自己方法
defineExpose({
  screenAdapter
})
</script>

<template>
  <!-- 商家销量统计横向柱状图 -->
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>

<style lang="less" scoped></style>

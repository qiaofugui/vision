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

// 图表实例
let echartInstance = null
// 图表 dom 元素
const rankRef = ref(null)
// 图表数据
const allData = ref(null)

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
  // 柱子颜色渐变的值
  const colorArr = [
    ['rgba(11, 168, 44)', 'rgba(79, 247, 120)'],
    ['rgba(46, 114, 191)', 'rgba(36, 55, 81)'],
    ['rgba(80, 82, 238)', 'rgba(171, 110, 229)']
  ]

  echartInstance = proxy.$echarts.init(rankRef.value, theme.value)
  const initOption = {
    title: {
      text: '▎ 地区销售排行',
      top: 20,
      left: 20
    },
    grid: {
      top: '40%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true
    },
    tooltip: {
      show: true
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        label: {
          show: true,
          position: 'top'
        },
        itemStyle: {
          color: arg => {
            let targetColorArr = null
            if (arg.value > 300) {
              targetColorArr = colorArr[0]
            } else if (arg.value > 200) {
              targetColorArr = colorArr[1]
            } else {
              targetColorArr = colorArr[2]
            }
            return new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: targetColorArr[0]
              },
              {
                offset: 1,
                color: targetColorArr[1]
              }
            ])
          }
        }
      }
    ]
  }
  echartInstance.setOption(initOption)

  // 对图标对象进行数据事件的监听
  echartInstance.on('mouseover', () => {
    clearInterval(timerId.value)
  })
  echartInstance.on('mouseout', () => {
    startInterval()
  })
}

// 获取图表数据
const getData = async (res) => {
  // const { data: res } = await proxy.$http.get('/rank')
  console.log(res)
  allData.value = res
  // 从大到小进行排序
  allData.value.sort((a, b) => b.value - a.value)
  updateChart()
  startInterval()
}
// 更新图表
// 区域缩放起点值
const startValue = ref(0)
// 区域缩放终点值
const endValue = ref(9)
const updateChart = () => {
  // 处理数据
  // 生成省份的数值
  const provinceArr = allData.value.map(item => item.name)
  // 省份对应的销售金额
  const valueArr = allData.value.map(item => item.value)
  const dataOption = {
    xAxis: {
      data: provinceArr
    },
    // 区域缩放
    dataZoom: [
      {
        show: false,
        startValue: startValue.value,
        endValue: endValue.value
      }
    ],
    series: [
      {
        data: valueArr
      }
    ]
  }
  echartInstance.setOption(dataOption)
}
// 浏览器屏幕发生变化调用，屏幕适配
const screenAdapter = () => {
  const titleFontSize = rankRef.value.offsetWidth / 100 * 3.6
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        barWidth: titleFontSize,
        label: {
          textStyle: {
            color: getThemeValue(theme.value).titleColor
          }
        },
        itemStyle: {
          barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
        }
      }
    ]
  }
  echartInstance.setOption(adapterOption)
  echartInstance.resize()
}

// 变化
const timerId = ref(null)
const startInterval = () => {
  if (timerId.value) clearInterval(timerId)
  timerId.value = setInterval(() => {
    startValue.value++
    endValue.value++
    if (endValue.value > allData.value.length - 1) {
      startValue.value = 0
      endValue.value = 9
    }
    updateChart()
  }, 2000)
}

onUnmounted(() => {
  // 取消监听
  window.removeEventListener('resize', screenAdapter)
  clearInterval(timerId)
})

// 组件创建注册回调函数
proxy.$socket.registerCallBack('rankData', getData)
// 组件销毁注销回调函数
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('rankData')
})
onMounted(() => {
  // 发送数据给服务器
  proxy.$socket.send({
    action: 'getData',
    socketType: 'rankData',
    chartName: 'rank',
    value: ''
  })
})

// 让父组件可拿到自己方法
defineExpose({
  screenAdapter
})
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<style lang="less" scoped></style>
